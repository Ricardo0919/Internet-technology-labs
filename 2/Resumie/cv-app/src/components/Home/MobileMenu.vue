<script setup lang="ts">
import { ref } from "vue";
import { XMarkIcon, PhoneIcon } from "@heroicons/vue/24/outline";

type MobileLink = { href: string; label: string };

interface Props {
  open: boolean;
  links: MobileLink[];
  contact: { href: string; label: string };
}

// Props drive the menu content + visibility (purely controlled by parent)
const props = defineProps<Props>();

// Emit close to keep one-way data flow (child requests close, parent updates state)
const emit = defineEmits<{
  (e: "close"): void;
}>();

// Tracks which link is animating to prevent double navigation during transitions
const animatingIdx = ref<number | null>(null);

const navigate = (href: string, idx: number, e: MouseEvent) => {
  e.preventDefault();

  // Guard: avoids multiple rapid clicks while the underline animation is running
  if (animatingIdx.value !== null) return;

  animatingIdx.value = idx;

  // Delay navigation to let the micro-animation play (better perceived responsiveness)
  setTimeout(() => {
    emit("close");
    window.location.href = href;
    animatingIdx.value = null;
  }, 220);
};

const handleKey = (href: string, idx: number, e: KeyboardEvent) => {
  // Keyboard accessibility: allow activation via Enter / Space (button-like behavior)
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    if (animatingIdx.value !== null) return;

    animatingIdx.value = idx;
    setTimeout(() => {
      emit("close");
      window.location.href = href;
      animatingIdx.value = null;
    }, 220);
  }
};

const handleContactClick = (e: MouseEvent) => {
  e.preventDefault();

  // Small visual feedback on tap/click before closing the overlay
  const target = e.currentTarget as HTMLAnchorElement | null;
  if (target) target.classList.add("active:opacity-90");

  setTimeout(() => {
    emit("close");
    window.location.href = props.contact.href;
  }, 120);
};
</script>

<template>
  <div>
    <div v-if="open" class="fixed inset-0 z-[60]">
      <div
          class="absolute inset-0 bg-white"
          @click="emit('close')"
          aria-hidden="true"
      />


      <div class="relative h-full w-full flex flex-col items-center justify-center font-zendots text-black">
        <!-- Close Button -->
        <button
            class="absolute top-[max(1rem,env(safe-area-inset-top))] right-[max(1rem,env(safe-area-inset-right))] text-5xl md:text-6xl"
            @click="emit('close')"
        >
          <XMarkIcon class="w-10 h-10 md:w-12 md:h-12" />
        </button>

        <!-- Menu links -->
        <nav class="flex w-4/5 max-w-xs flex-col gap-6 text-center text-lg md:text-xl font-semibold">
          <button
              v-for="(l, i) in props.links"
              :key="l.href"
              type="button"
              class="relative pb-2 outline-none focus-visible:ring-2 focus-visible:ring-black/40 rounded-sm"
              @click="(e) => navigate(l.href, i, e)"
              @keydown="(e) => handleKey(l.href, i, e)"
          >
            {{ l.label }}
            <!-- Underline animation bar -->
            <span
                class="pointer-events-none absolute left-1/2 -bottom-0.5 h-[2px] w-full -translate-x-1/2 bg-black origin-center transform transition-transform duration-200"
                :class="animatingIdx === i ? 'scale-x-100' : 'scale-x-0'"
            />
          </button>
        </nav>

        <!-- Contact Button -->
        <div class="mt-10 w-full flex justify-center px-6">
          <a
              :href="props.contact.href"
              @click="handleContactClick"
              class="inline-flex gap-2 items-center justify-center rounded-full bg-black px-6 py-3 text-white text-base font-semibold shadow-sm
                   hover:opacity-95 active:opacity-90 transition"
          >
            <PhoneIcon class="w-4 h-4" />
            <span>{{ props.contact.label }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
