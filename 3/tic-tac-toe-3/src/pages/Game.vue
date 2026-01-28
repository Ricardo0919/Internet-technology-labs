<template>
  <div class="min-h-screen p-6 max-w-3xl mx-auto">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold">Juego</h1>
        <p class="opacity-70 mt-1">Game ID: {{ gameId }}</p>
      </div>

      <button class="rounded-xl border px-4 py-2 hover:bg-gray-50" @click="goBack">
        Salir
      </button>
    </div>

    <div class="mt-6 rounded-2xl border p-4">
      <div v-if="loading" class="opacity-70">Cargando estado del juego...</div>

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
            <div class="font-medium">Turno</div>
            <div class="opacity-70">{{ game.currentTurn }}</div>
          </div>

          <div class="text-sm">
            <div class="font-medium">Modo</div>
            <div class="opacity-70">{{ game.mode }}</div>
          </div>

          <div class="text-sm">
            <div class="font-medium">Tú</div>
            <div class="opacity-70">{{ myMark ?? "?" }}</div>
          </div>

          <div class="text-sm">
            <div class="font-medium">Tiempo real</div>
            <div class="opacity-70">
              <span v-if="isConnected">WS conectado ✅</span>
              <span v-else>Polling (fallback) 🧯</span>
            </div>
          </div>

          <div class="text-sm" v-if="game.status === 'FINISHED'">
            <div class="font-medium">Resultado</div>
            <div class="opacity-70">
              {{ game.winner === "DRAW" ? "Empate" : `Ganó ${game.winner}` }}
            </div>
          </div>
        </div>

        <p v-if="hint" class="text-sm opacity-70 whitespace-pre-wrap">{{ hint }}</p>

        <GameBoard :board="normalizedBoard" :disabled="boardDisabled" @play="onPlay" />

        <div class="flex flex-wrap gap-3">
          <button class="rounded-xl border px-4 py-2 hover:bg-gray-50" :disabled="loading" @click="refresh">
            Refrescar
          </button>

          <button
              v-if="game.status === 'FINISHED'"
              class="rounded-xl border px-4 py-2 hover:bg-gray-50"
              @click="goMode"
          >
            Nuevo juego
          </button>
        </div>

        <p v-if="moveLoading" class="text-sm opacity-70">Enviando jugada...</p>

        <!-- Debug opcional -->
        <!-- <pre class="text-xs mt-4 opacity-70 overflow-auto">{{ game }}</pre> -->
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

const game = ref<Game | null>(null);
const loading = ref(true);
const moveLoading = ref(false);
const error = ref("");
const hint = ref("");

// ✅ mark por juego (solo lectura aquí)
const markKey = `myMark:${props.gameId}`;
function readMark(): "X" | "O" | null {
  const v = localStorage.getItem(markKey);
  return v === "X" || v === "O" ? v : null;
}
const myMark = ref<"X" | "O" | null>(readMark());

// ------- Board normalizado -------
const normalizedBoard = computed<Mark[][]>(() => {
  const b: any = game.value?.board;
  if (!Array.isArray(b)) return [[null, null, null], [null, null, null], [null, null, null]];

  return b.map((row: any[]) =>
      row.map((cell: any) => (cell === "X" || cell === "O" ? cell : null))
  ) as Mark[][];
});

// Board disabled: bloquea por turno si tengo myMark; si no tengo, NO dejo jugar en PVP/PVC
const boardDisabled = computed(() => {
  if (!game.value) return true;
  if (loading.value || moveLoading.value) return true;

  if (game.value.status !== "IN_PROGRESS") return true;

  // Si no hay mark, no juegas (porque luego spameas 400)
  if (!myMark.value) return true;

  return game.value.currentTurn !== myMark.value;
});

// ------- REST refresh -------
async function refresh() {
  error.value = "";
  try {
    const data: any = await getGame(props.gameId);
    if (!data.id && data.gameId) data.id = data.gameId;
    game.value = data as Game;
    loading.value = false;

    myMark.value = readMark();

    if (!myMark.value) {
      hint.value = "No tengo tu símbolo aún. Vuelve al lobby y entra desde ahí.";
      return;
    }

    if (game.value.mode === "PVP" && game.value.status === "WAITING_FOR_PLAYER") {
      hint.value = "Esperando al segundo jugador…";
    } else if (game.value.status === "IN_PROGRESS") {
      hint.value = game.value.currentTurn === myMark.value ? "Tu turno ✅" : "Turno del otro jugador…";
    } else {
      hint.value = "";
    }
  } catch (e: any) {
    error.value = e?.message ?? "Error cargando el juego";
    loading.value = false;
  }
}

// ------- Move -------
async function onPlay(row: number, col: number) {
  if (!game.value) return;

  if (game.value.status !== "IN_PROGRESS") {
    hint.value = "Aún no inicia el juego.";
    return;
  }

  if (!myMark.value) {
    hint.value = "No tengo tu símbolo. Regresa al lobby y entra desde ahí.";
    return;
  }

  if (game.value.currentTurn !== myMark.value) {
    hint.value = "No es tu turno 👀";
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
    error.value = e?.message ?? "Jugada inválida";
  } finally {
    moveLoading.value = false;
  }
}

// ------- Polling fallback -------
let pollId: number | null = null;

function startPolling() {
  if (pollId) return;
  pollId = window.setInterval(async () => {
    if (!game.value) return;
    if (game.value.status === "FINISHED") return;
    await refresh();
  }, 1200);
}

function stopPolling() {
  if (pollId) window.clearInterval(pollId);
  pollId = null;
}

// ------- WebSocket -------
const { connect, disconnect, isConnected } = useGameSocket({
  gameId: props.gameId,
  onGame: (g) => {
    game.value = g;
    loading.value = false;

    myMark.value = readMark();

    if (!myMark.value) {
      hint.value = "No tengo tu símbolo aún. Vuelve al lobby y entra desde ahí.";
      return;
    }

    if (g.status === "IN_PROGRESS") {
      hint.value = g.currentTurn === myMark.value ? "Tu turno ✅" : "Turno del otro jugador…";
    } else if (g.mode === "PVP" && g.status === "WAITING_FOR_PLAYER") {
      hint.value = "Esperando al segundo jugador…";
    } else {
      hint.value = "";
    }

    stopPolling();
  },
  onError: () => {},
});

// ------- Navigation -------
function goBack() {
  router.push("/mode");
}

function goMode() {
  router.push("/mode");
}

// ------- Lifecycle -------
onMounted(async () => {
  await refresh();
  connect();

  window.setTimeout(() => {
    if (!isConnected.value) startPolling();
  }, 1500);
});

onBeforeUnmount(() => {
  stopPolling();
  disconnect();
});
</script>
