<template>
  <!-- 
    3x3 grid representing the Tic-Tac-Toe board.
    The board itself is stateless; all game logic is handled by the parent.
  -->
  <div class="grid grid-cols-3 gap-3 w-full max-w-sm">
    <button
        v-for="cell in flatCells"
        :key="cell.key"
        class="aspect-square rounded-2xl border text-4xl font-semibold flex items-center justify-center
             hover:bg-gray-50 disabled:opacity-60 disabled:hover:bg-transparent"
        :disabled="disabled || isFilled(cell.value)"
        @click="$emit('play', cell.row, cell.col)"
        :aria-label="`Cell ${cell.row},${cell.col}`"
    >
      <span v-if="isFilled(cell.value)">{{ cell.value }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

/*
  Mark type is intentionally permissive because:
  - backend may send empty strings ("")
  - board normalization happens in the parent component
*/
type Mark = "X" | "O" | null | "" | undefined;

const props = defineProps<{
  board: Mark[][];
  disabled?: boolean;
}>();

/*
  Emits a play event with the selected row and column.
  The parent component is responsible for validating the move.
*/
defineEmits<{
  (e: "play", row: number, col: number): void;
}>();

/*
  Utility type guard to check whether a cell is already occupied.
  Keeps template logic simple and readable.
*/
function isFilled(v: any): v is "X" | "O" {
  return v === "X" || v === "O";
}

/*
  Flattens the 2D board into a 1D array for easy rendering with v-for.
  This avoids nested loops in the template and keeps rendering logic clean.
*/
const flatCells = computed(() => {
  const out: { key: string; row: number; col: number; value: Mark }[] = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      out.push({
        key: `${r}-${c}`,
        row: r,
        col: c,
        value: props.board?.[r]?.[c] ?? null,
      });
    }
  }
  return out;
});
</script>
