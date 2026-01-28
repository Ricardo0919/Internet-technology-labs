<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <div class="w-full max-w-md rounded-2xl border p-6 shadow-sm">
      <h1 class="text-2xl font-semibold">Tic-Tac-Toe</h1>
      <p class="text-sm opacity-70 mt-1">Registra tu nombre para jugar.</p>

      <form class="mt-6 space-y-3" @submit.prevent="onSubmit">
        <input
            v-model.trim="name"
            class="w-full rounded-xl border px-4 py-3"
            placeholder="Tu nombre"
        />
        <button class="w-full rounded-xl border px-4 py-3" :disabled="loading || !name">
          {{ loading ? "Creando..." : "Continuar" }}
        </button>

        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { createPlayer } from "../api/players";

const router = useRouter();
const name = ref("");
const loading = ref(false);
const error = ref("");

async function onSubmit() {
  error.value = "";
  loading.value = true;
  try {
    const res: any = await createPlayer(name.value);
    const playerId = res.playerId ?? res.id;
    localStorage.setItem("playerId", playerId);
    localStorage.setItem("playerName", name.value);
    router.push("/mode");
  } catch (e: any) {
    error.value = e?.message ?? "Error creando jugador";
  } finally {
    loading.value = false;
  }
}
</script>
