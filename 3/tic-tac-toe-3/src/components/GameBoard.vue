<template>
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

type Mark = "X" | "O" | null | "" | undefined;

const props = defineProps<{
  board: Mark[][];
  disabled?: boolean;
}>();

defineEmits<{
  (e: "play", row: number, col: number): void;
}>();

function isFilled(v: any): v is "X" | "O" {
  return v === "X" || v === "O";
}

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
