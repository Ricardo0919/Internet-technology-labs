<script setup lang="ts">
import { ref } from "vue";
import { XMarkIcon, PhoneIcon } from "@heroicons/vue/24/outline";
type MobileLink = { href: string; label: string };

interface Props {
  open: boolean;
  links: MobileLink[];
  contact: { href: string; label: string };
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "close"): void;
}>();

const animatingIdx = ref<number | null>(null);

const navigate = (href: string, idx: number, e: MouseEvent) => {
  e.preventDefault();
  if (animatingIdx.value !== null) return;

  animatingIdx.value = idx;
  setTimeout(() => {
    emit("close");
    window.location.href = href; // navegación simple
    animatingIdx.value = null;
  }, 220);
};

const handleKey = (href: string, idx: number, e: KeyboardEvent) => {
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
  const target = e.currentTarget as HTMLAnchorElement | null;
  if (target) target.classList.add("active:opacity-90");

  setTimeout(() => {
    emit("close");
    window.location.href = props.contact.href;
  }, 120);
};
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-[60]">
      <!-- Overlay -->
      <div
          class="absolute inset-0 bg-white"
          @click="emit('close')"
          aria-hidden="true"
      />

      <!-- Contenido -->
      <div
          class="relative h-full w-full flex flex-col items-center justify-center font-zendots text-black"
      >
        <!-- Close -->
        <button
            class="absolute top-[max(1rem,env(safe-area-inset-top))] right-[max(1rem,env(safe-area-inset-right))] text-5xl md:text-6xl"
            @click="emit('close')"
            aria-label="Cerrar menú"
        >
          <XMarkIcon class="w-10 h-10 md:w-12 md:h-12" />
        </button>

        <!-- Links -->
        <nav
            class="flex w-4/5 max-w-xs flex-col gap-6 text-center text-lg md:text-xl font-semibold"
        >
          <button
              v-for="(l, i) in props.links"
              :key="l.href"
              type="button"
              class="relative pb-2 outline-none focus-visible:ring-2 focus-visible:ring-black/40 rounded-sm"
              @click="(e) => navigate(l.href, i, e)"
              @keydown="(e) => handleKey(l.href, i, e)"
          >
            {{ l.label }}
            <span
                class="pointer-events-none absolute left-1/2 -bottom-0.5 h-[2px] w-full -translate-x-1/2 bg-black origin-center transform transition-transform duration-200"
                :class="animatingIdx === i ? 'scale-x-100' : 'scale-x-0'"
            />
          </button>
        </nav>

        <!-- CTA contacto -->
        <div class="mt-10 w-full flex justify-center px-6">
          <a
              :href="props.contact.href"
              @click="handleContactClick"
              class="inline-flex gap-2 items-center justify-center rounded-full bg-black px-6 py-3 text-white text-base font-semibold shadow-sm
                   hover:opacity-95 active:opacity-90 transition"
              :aria-label="props.contact.label"
          >
            <PhoneIcon class="w-4 h-4" />
            <span>{{ props.contact.label }}</span>
          </a>
        </div>
      </div>
    </div>
  </Teleport>
</template>
