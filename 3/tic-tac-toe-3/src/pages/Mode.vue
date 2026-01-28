<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <div class="w-full max-w-md space-y-4">
      <h1 class="text-2xl font-semibold text-center">Selecciona modo</h1>

      <button class="w-full rounded-xl border px-4 py-4 hover:bg-gray-50" @click="goPvp">
        Player vs Player
      </button>

      <button
          class="w-full rounded-xl border px-4 py-4 hover:bg-gray-50"
          :disabled="loading"
          @click="startPvc"
      >
        {{ loading ? "Creando..." : "Player vs Computer" }}
      </button>

      <p v-if="error" class="text-sm text-red-600 text-center">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { createGame } from "../api/games";

const router = useRouter();
const loading = ref(false);
const error = ref("");

function goPvp() {
  router.push("/lobby");
}

async function startPvc() {
  error.value = "";
  loading.value = true;

  try {
    const playerId = localStorage.getItem("playerId");
    if (!playerId) throw new Error("No hay playerId. Ve a /register.");

    const game: any = await createGame("PVC");
    const gameId = game.id ?? game.gameId;
    localStorage.setItem(`myMark:${gameId}`, "X");
    router.push(`/game/${gameId}`);
  } catch (e: any) {
    error.value = e?.message ?? "Error creando juego PVC";
  } finally {
    loading.value = false;
  }
}
</script>
