<template>
  <div class="min-h-screen p-6 max-w-3xl mx-auto">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold">Game</h1>
        <p class="opacity-70 mt-1">Game ID: {{ gameId }}</p>
      </div>

      <button class="rounded-xl border px-4 py-2 hover:bg-gray-50" @click="goBack">
        Exit
      </button>
    </div>

    <div class="mt-6 rounded-2xl border p-4">
      <!-- Loading state for initial fetch / transitions -->
      <div v-if="loading" class="opacity-70">Loading game state...</div>

      <!-- User-friendly error output for API/network failures -->
      <div v-else-if="error" class="text-red-600 text-sm whitespace-pre-wrap">
        {{ error }}
      </div>

      <div v-else-if="game" class="space-y-4">
        <div class="flex flex-wrap gap-6">
          <div class="text-sm">
            <div class="font-medium">Status</div>
            <div class="opacity-70">{{ game.status }}</div>
          </div>

          <div class="text-sm">
            <div class="font-medium">Turn</div>
            <div class="opacity-70">{{ game.currentTurn }}</div>
          </div>

          <div class="text-sm">
            <div class="font-medium">Mode</div>
            <div class="opacity-70">{{ game.mode }}</div>
          </div>

          <div class="text-sm">
            <div class="font-medium">You</div>
            <div class="opacity-70">{{ myMark ?? "?" }}</div>
          </div>
          
          <div class="text-sm">
            <div class="font-medium">Player X</div>
            <div class="opacity-70">{{ xLabel }}</div>
          </div>

          <div class="text-sm">
            <div class="font-medium">Player O</div>
            <div class="opacity-70">{{ oLabel }}</div>
          </div>


          <div class="text-sm">
            <div class="font-medium">Real-time</div>
            <div class="opacity-70">
              <span v-if="isConnected">WS connected</span>
              <span v-else>Polling (fallback)</span>
            </div>
          </div>

          <div class="text-sm" v-if="game.status === 'FINISHED'">
            <div class="font-medium">Result</div>
            <div class="opacity-70">
              {{ game.winner === "DRAW" ? "Draw" : `Winner: ${game.winner}` }}
            </div>
          </div>
        </div>

        <p v-if="hint" class="text-sm opacity-70 whitespace-pre-wrap">{{ hint }}</p>

        <GameBoard :board="normalizedBoard" :disabled="boardDisabled" @play="onPlay" />

        <div class="flex flex-wrap gap-3">
          <button class="rounded-xl border px-4 py-2 hover:bg-gray-50" :disabled="loading" @click="refresh">
            Refresh
          </button>

          <button
              v-if="game.status === 'FINISHED'"
              class="rounded-xl border px-4 py-2 hover:bg-gray-50"
              @click="goMode"
          >
            New game
          </button>
        </div>

        <p v-if="moveLoading" class="text-sm opacity-70">Sending move...</p>
        
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import GameBoard from "../components/GameBoard.vue";
import type { Game, Mark } from "../types/ticTac";
import { getGame, makeMove } from "../api/games";
import { useGameSocket } from "../composables/useGameSocket";

const props = defineProps<{ gameId: string }>();
const router = useRouter();

/*
  Core reactive state:
  - game: latest game state from REST/WS
  - loading/moveLoading: prevents duplicate actions and enables UI feedback
  - error/hint: user-facing messages for errors and guidance
*/
const game = ref<Game | null>(null);
const loading = ref(true);
const moveLoading = ref(false);
const error = ref("");
const hint = ref("");

/*
  The backend does not return the local player's symbol,
  so we persist it client-side per game. This is used for:
  - turn validation (disable board)
  - role labels (You/Opponent)
*/
const markKey = `myMark:${props.gameId}`;
function readMark(): "X" | "O" | null {
  const v = localStorage.getItem(markKey);
  return v === "X" || v === "O" ? v : null;
}
const myMark = ref<"X" | "O" | null>(readMark());

/*
  Role labels are derived from the local mark:
  - X/O player IDs are not part of the game state response
*/
const xLabel = computed(() => {
  if (!myMark.value) return "—";
  return myMark.value === "X" ? "You" : "Opponent";
});

const oLabel = computed(() => {
  if (!myMark.value) return "—";
  return myMark.value === "O" ? "You" : "Opponent";
});

/*
  Backend uses empty strings for empty cells (""), while the UI expects null.
  Normalize the board to Mark[][] so the GameBoard component stays simple.
*/
const normalizedBoard = computed<Mark[][]>(() => {
  const b: any = game.value?.board;
  if (!Array.isArray(b)) return [[null, null, null], [null, null, null], [null, null, null]];

  return b.map((row: any[]) =>
      row.map((cell: any) => (cell === "X" || cell === "O" ? cell : null))
  ) as Mark[][];
});

/*
  Disables the board when a move is not allowed:
  - game not loaded / move in progress
  - game not in progress
  - local mark is unknown
  - not the player's turn
  This prevents invalid requests and reduces server-side 400 errors.
*/
const boardDisabled = computed(() => {
  if (!game.value) return true;
  if (loading.value || moveLoading.value) return true;

  if (game.value.status !== "IN_PROGRESS") return true;

  if (!myMark.value) return true;

  return game.value.currentTurn !== myMark.value;
});

/*
  REST refresh used for:
  - initial load
  - manual refresh button
  - polling fallback when WebSocket is unavailable
*/
async function refresh() {
  error.value = "";
  try {
    const data: any = await getGame(props.gameId);
    if (!data.id && data.gameId) data.id = data.gameId;
    game.value = data as Game;
    loading.value = false;

    myMark.value = readMark();

    if (!myMark.value) {
      hint.value = "You don't have your mark yet. Go back to the lobby and enter from there.";
      return;
    }

    if (game.value.mode === "PVP" && game.value.status === "WAITING_FOR_PLAYER") {
      hint.value = "Waiting for the second player…";
    } else if (game.value.status === "IN_PROGRESS") {
      hint.value = game.value.currentTurn === myMark.value ? "Your turn" : "Turn of the other player…";
    } else {
      hint.value = "";
    }
  } catch (e: any) {
    error.value = e?.message ?? "Error loading the game";
    loading.value = false;
  }
}

/*
  Sends a move only if it is valid client-side.
  Server still validates, but this improves UX and avoids unnecessary requests.
*/
async function onPlay(row: number, col: number) {
  if (!game.value) return;

  if (game.value.status !== "IN_PROGRESS") {
    hint.value = "The game hasn't started yet.";
    return;
  }

  if (!myMark.value) {
    hint.value = "You don't have your mark yet. Go back to the lobby and enter from there.";
    return;
  }

  if (game.value.currentTurn !== myMark.value) {
    hint.value = "It's not your turn";
    return;
  }

  if (normalizedBoard.value?.[row]?.[col] !== null) return;

  moveLoading.value = true;
  error.value = "";
  hint.value = "";

  try {
    const updated: any = await makeMove(props.gameId, row, col);
    if (!updated.id && updated.gameId) updated.id = updated.gameId;
    game.value = updated as Game;
  } catch (e: any) {
    error.value = e?.message ?? "Invalid move";
  } finally {
    moveLoading.value = false;
  }
}

/*
  Polling fallback:
  If WS is not connected shortly after mount, poll the game state periodically.
  This ensures the UI still updates in real time-like behavior.
*/
let pollId: number | null = null;

function startPolling() {
  if (pollId) return;
  pollId = window.setInterval(async () => {
    if (!game.value) return;
    if (game.value.status === "FINISHED") {
      stopPolling();
      return
    };
    await refresh();
  }, 1200);
}

function stopPolling() {
  if (pollId) window.clearInterval(pollId);
  pollId = null;
}


/*
  WebSocket is the primary update mechanism.
  On successful WS messages, we stop polling to avoid redundant network traffic.
*/
const { connect, disconnect, isConnected } = useGameSocket({
  gameId: props.gameId,
  onGame: (g) => {
    game.value = g;
    loading.value = false;

    myMark.value = readMark();

    if (!myMark.value) {
      hint.value = "You don't have your mark yet. Go back to the lobby and enter from there.";
      return;
    }

    if (g.status === "IN_PROGRESS") {
      hint.value = g.currentTurn === myMark.value ? "Your turn" : "Turn of the other player…";
    } else if (g.mode === "PVP" && g.status === "WAITING_FOR_PLAYER") {
      hint.value = "Waiting for the second player…";
    } else {
      hint.value = "";
    }

    stopPolling();
  },
  onError: () => {},
});

function goBack() {
  router.push("/mode");
}

function goMode() {
  router.push("/mode");
}

onMounted(async () => {
  await refresh();
  connect();

  // Give WS a short grace period; then switch to polling if not connected
  window.setTimeout(() => {
    if (!isConnected.value) startPolling();
  }, 1500);
});

onBeforeUnmount(() => {
  stopPolling();
  disconnect();
});

</script>
