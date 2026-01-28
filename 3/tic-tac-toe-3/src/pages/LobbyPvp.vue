<template>
  <div class="min-h-screen p-6 max-w-3xl mx-auto">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold">Lobby PVP</h1>
        <p class="opacity-70">Crea un juego o únete a uno disponible.</p>
      </div>

      <button class="rounded-xl border px-4 py-2 hover:bg-gray-50" @click="goBack">
        ← Modo
      </button>
    </div>

    <div class="mt-6 flex flex-wrap gap-3">
      <button
          class="rounded-xl border px-4 py-2 hover:bg-gray-50"
          :disabled="creating"
          @click="onCreate"
      >
        {{ creating ? "Creando..." : "Crear juego PVP" }}
      </button>

      <button
          class="rounded-xl border px-4 py-2 hover:bg-gray-50"
          :disabled="loading"
          @click="refresh"
      >
        {{ loading ? "Cargando..." : "Refrescar lista" }}
      </button>
    </div>

    <p v-if="error" class="mt-4 text-sm text-red-600">{{ error }}</p>

    <div class="mt-6">
      <h2 class="text-lg font-semibold">Juegos esperando jugador</h2>

      <div v-if="loading" class="mt-3 opacity-70">Cargando...</div>

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
          </div>

          <button
              class="rounded-xl border px-4 py-2 hover:bg-gray-50"
              :disabled="joiningId === g.id"
              @click="onJoin(g.id)"
          >
            {{ joiningId === g.id ? "Uniéndome..." : "Unirme" }}
          </button>
        </div>

        <div v-if="games.length === 0" class="opacity-70">
          No hay juegos disponibles. Crea uno 👀
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { createGame, joinGame, listWaitingPvpGames } from "../api/games";

type LobbyGame = { id: string; status?: string; mode?: string };

const router = useRouter();
const games = ref<LobbyGame[]>([]);
const loading = ref(false);
const creating = ref(false);
const joiningId = ref<string | null>(null);
const error = ref("");

function goBack() {
  router.push("/mode");
}

async function refresh() {
  error.value = "";
  loading.value = true;
  try {
    const data: any = await listWaitingPvpGames();
    games.value = (data.games ?? []).map((g: any) => ({
      id: g.id ?? g.gameId,
      status: g.status,
      mode: g.mode,
    }));
  } catch (e: any) {
    error.value = e?.message ?? "Error listando juegos";
  } finally {
    loading.value = false;
  }
}

/**
 * =========================
 * CREAR JUEGO (CREADOR = X)
 * =========================
 */
async function onCreate() {
  error.value = "";
  creating.value = true;

  try {
    const playerId = localStorage.getItem("playerId");
    if (!playerId) throw new Error("No hay playerId. Ve a /register.");

    const game: any = await createGame("PVP");
    const gameId = game.id ?? game.gameId;

    // ✅ CLAVE: creador SIEMPRE es X (por gameId)
    localStorage.setItem(`myMark:${gameId}`, "X");

    router.push(`/game/${gameId}`);
  } catch (e: any) {
    error.value = e?.message ?? "Error creando juego PVP";
  } finally {
    creating.value = false;
  }
}

/**
 * =========================
 * UNIRSE A JUEGO (JOINER = O)
 * =========================
 */
async function onJoin(gameId: string) {
  error.value = "";
  joiningId.value = gameId;

  try {
    const playerId = localStorage.getItem("playerId");
    if (!playerId) throw new Error("No hay playerId. Ve a /register.");

    await joinGame(gameId);

    // ✅ CLAVE: el que se une es O (por gameId)
    localStorage.setItem(`myMark:${gameId}`, "O");

    router.push(`/game/${gameId}`);
  } catch (e: any) {
    error.value = e?.message ?? "Error uniéndose al juego";
  } finally {
    joiningId.value = null;
  }
}

onMounted(() => {
  refresh();
});
</script>
