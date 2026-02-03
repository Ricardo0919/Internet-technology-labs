<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <div class="w-full max-w-md rounded-2xl border p-6 shadow-sm">
      <h1 class="text-2xl font-semibold">Tic-Tac-Toe</h1>
      <p class="text-sm opacity-70 mt-1">Enter your name to play.</p>

      <!-- 
        Player registration form.
        The submit is handled manually to control loading state
        and prevent duplicate player creation.
      -->
      <form class="mt-6 space-y-3" @submit.prevent="onSubmit">
        <input
            v-model.trim="name"
            class="w-full rounded-xl border px-4 py-3"
            placeholder="Your name"
        />

        <!-- 
          Disabled while the request is in progress or
          when the name input is empty to avoid invalid submissions.
        -->
        <button class="w-full rounded-xl border px-4 py-3" :disabled="loading || !name">
          {{ loading ? "Creating..." : "Continue" }}
        </button>

        <!-- Displays backend or network errors -->
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

/*
  Reactive state:
  - name: user-provided player name
  - loading: prevents duplicate submissions during API calls
  - error: message shown when player creation fails
*/
const name = ref("");
const loading = ref(false);
const error = ref("");

/*
  Creates a new player using the REST API.
  The returned playerId is persisted in localStorage so the user
  can be recognized across page reloads or future visits.
*/
async function onSubmit() {
  error.value = "";
  loading.value = true;
  try {
    const res: any = await createPlayer(name.value);

    // Backend responses may use either `playerId` or `id`
    const playerId = res.playerId ?? res.id;

    // Persist player identity for the entire application lifecycle
    localStorage.setItem("playerId", playerId);
    localStorage.setItem("playerName", name.value);

    // Redirect to game mode selection after successful registration
    router.push("/mode");
  } catch (e: any) {
    error.value = e?.message ?? "Error creating player";
  } finally {
    loading.value = false;
  }
}
</script>
