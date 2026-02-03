<template>
  <div class="min-h-screen p-6 max-w-3xl mx-auto">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold">PVP Lobby</h1>
        <p class="opacity-70">Create a game or join an available one.</p>
      </div>

      <!-- Navigation back to mode selection (keeps the flow simple) -->
      <button class="rounded-xl border px-4 py-2 hover:bg-gray-50" @click="goBack">
        Back to select mode
      </button>
    </div>

    <div class="mt-6 flex flex-wrap gap-3">
      <!-- Creates a new PVP game (creator becomes X by convention in this app) -->
      <button
          class="rounded-xl border px-4 py-2 hover:bg-gray-50"
          :disabled="creating"
          @click="onCreate"
      >
        {{ creating ? "Creating..." : "Create PVP game" }}
      </button>

      <!-- Refreshes the list of games waiting for a second player -->
      <button
          class="rounded-xl border px-4 py-2 hover:bg-gray-50"
          :disabled="loading"
          @click="refresh"
      >
        {{ loading ? "Loading..." : "Refresh list" }}
      </button>
    </div>

    <!-- Displays backend/network errors -->
    <p v-if="error" class="mt-4 text-sm text-red-600">{{ error }}</p>

    <div class="mt-6">
      <h2 class="text-lg font-semibold">Games waiting for player</h2>

      <div v-if="loading" class="mt-3 opacity-70">Loading...</div>

      <div v-else class="mt-3 space-y-3">
        <div
            v-for="g in games"
            :key="g.id"
            class="rounded-2xl border p-4 flex items-center justify-between gap-4"
        >
          <div class="min-w-0">
            <div class="font-medium truncate">Game: {{ g.id }}</div>
            <div class="text-sm opacity-70">
              Status: {{ g.status }} · Mode: {{ g.mode }}
            </div>

            <div v-if="g.createdAt" class="text-xs opacity-60">
              Created: {{ new Date(g.createdAt).toLocaleString() }}
            </div>
          </div>

          <!-- Join flow: disabled while join request is pending to prevent double joins -->
          <button
              class="rounded-xl border px-4 py-2 hover:bg-gray-50"
              :disabled="joiningId === g.id"
              @click="onJoin(g.id)"
          >
            {{ joiningId === g.id ? "Joining..." : "Join" }}
          </button>
        </div>

        <div v-if="games.length === 0" class="opacity-70">
          No games available. Create one, or refresh the list.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { createGame, joinGame, listWaitingPvpGames } from "../api/games";

type LobbyGame = {
  id: string;
  status?: string;
  mode?: string;
  xPlayerId?: string;
  createdAt?: string;
};

const router = useRouter();

/*
  UI state:
  - games: current lobby list from the backend
  - loading: list refresh in progress
  - creating: new game creation in progress
  - joiningId: tracks which game is currently being joined (button-level loading)
  - error: user-facing error message
*/
const games = ref<LobbyGame[]>([]);
const loading = ref(false);
const creating = ref(false);
const joiningId = ref<string | null>(null);
const error = ref("");

function goBack() {
  router.push("/mode");
}


/*
  Loads all PVP games that are waiting for a second player.
  Keeping this in a dedicated function allows:
  - manual refresh via button
  - initial load on mount
*/
async function refresh() {
  error.value = "";
  loading.value = true;
  try {
    const data: any = await listWaitingPvpGames();

    // Normalize backend responses (some endpoints may use `id` or `gameId`)
    games.value = (data.games ?? []).map((g: any) => ({
      id: g.id ?? g.gameId,
      status: g.status,
      mode: g.mode,
      xPlayerId: g.xPlayerId,
      createdAt: g.createdAt,
    }));
  } catch (e: any) {
    error.value = e?.message ?? "Error loading games";
  } finally {
    loading.value = false;
  }
}

/*
  Creates a new PVP game.
  We store the local player's mark ("X") in localStorage using a game-scoped key.
  This is later used in the Game view to validate turns and disable the board.
*/
async function onCreate() {
  error.value = "";
  creating.value = true;

  try {
    const playerId = localStorage.getItem("playerId");
    if (!playerId) throw new Error("No playerId found. Go to /register.");

    const game: any = await createGame("PVP");
    const gameId = game.id ?? game.gameId;

    // Creator is X for this client-side implementation
    localStorage.setItem(`myMark:${gameId}`, "X");

    router.push(`/game/${gameId}`);
  } catch (e: any) {
    error.value = e?.message ?? "Error creating PVP game";
  } finally {
    creating.value = false;
  }
}

/*
  Joins an existing PVP game.
  The joining player is assigned "O" in this client-side implementation.
*/
async function onJoin(gameId: string) {
  error.value = "";
  joiningId.value = gameId;

  try {
    const playerId = localStorage.getItem("playerId");
    if (!playerId) throw new Error("No playerId found. Go to /register.");

    await joinGame(gameId);

    // Joiner is O for this client-side implementation
    localStorage.setItem(`myMark:${gameId}`, "O");

    router.push(`/game/${gameId}`);
  } catch (e: any) {
    error.value = e?.message ?? "Error joining the game";
  } finally {
    joiningId.value = null;
  }
}

onMounted(() => {
  refresh();
});
</script>
