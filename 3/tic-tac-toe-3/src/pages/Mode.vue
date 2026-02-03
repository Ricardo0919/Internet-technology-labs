<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <div class="w-full max-w-md space-y-4">
      <h1 class="text-2xl font-semibold text-center">Select mode</h1>

      <!-- 
        Navigates to the PVP lobby, where players can
        create or join an existing multiplayer game.
      -->
      <button class="w-full rounded-xl border px-4 py-4 hover:bg-gray-50" @click="goPvp">
        Player vs Player
      </button>

      <!-- 
        Starts a Player vs Computer game.
        The player is always assigned the 'X' mark by convention.
      -->
      <button
          class="w-full rounded-xl border px-4 py-4 hover:bg-gray-50"
          :disabled="loading"
          @click="startPvc"
      >
        {{ loading ? "Creating..." : "Player vs Computer" }}
      </button>

      <!-- Displays API or validation errors -->
      <p v-if="error" class="text-sm text-red-600 text-center">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { createGame } from "../api/games";

const router = useRouter();

/*
  UI state:
  - loading prevents multiple game creation requests
  - error provides feedback when the operation fails
*/
const loading = ref(false);
const error = ref("");

/*
  Redirects the user to the PVP lobby view.
*/
function goPvp() {
  router.push("/lobby");
}

/*
  Creates a PVC game using the backend API.
  The local player is assigned the 'X' mark and the game
  starts immediately after creation.
*/
async function startPvc() {
  error.value = "";
  loading.value = true;

  try {
    const playerId = localStorage.getItem("playerId");
    if (!playerId) throw new Error("No playerId found. Go to /register.");

    const game: any = await createGame("PVC");
    const gameId = game.id ?? game.gameId;
    
    // Store the player's mark locally for turn validation
    localStorage.setItem(`myMark:${gameId}`, "X");

    router.push(`/game/${gameId}`);
  } catch (e: any) {
    error.value = e?.message ?? "Error creating PVC game";
  } finally {
    loading.value = false;
  }
}
</script>
