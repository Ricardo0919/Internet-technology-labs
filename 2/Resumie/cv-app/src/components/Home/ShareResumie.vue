<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import QrIcon from "../../assets/images/Home/ShareResumie/qrCode.png";
import QrcodeVue from "qrcode.vue";

const resumieUrl = "https://ricardo-sierra-roa.netlify.app/";

const isOpen = ref(false);

const openModal = () => {
  isOpen.value = true;
};

const closeModal = () => {
  isOpen.value = false;
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    closeModal();
  }
};

// bloquear scroll de fondo cuando el modal está abierto
watch(isOpen, (val) => {
  if (val) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
});

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
  document.body.style.overflow = "";
});
</script>

<template>
  <button
      type="button"
      @click="openModal"
      aria-label="Abrir QR para compartir el resumie"
      class="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-40
           w-14 h-14 md:w-16 md:h-16
           flex items-center justify-center
           rounded-full border border-white
           bg-black
           shadow-lg shadow-black/40
           transition-transform transition-opacity duration-300 ease-out
           hover:scale-110 hover:opacity-60 active:scale-95"
  >
    <img
        :src="QrIcon"
        alt="QR icon"
        class="w-10 h-10 md:w-12 md:h-12"
    />
  </button>

  <transition name="fade">
    <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center
             bg-black/60 backdrop-blur-sm"
        @click.self="closeModal"
    >
      <div
          class="relative w-[90%] max-w-sm md:max-w-md
               bg-white rounded-2xl shadow-2xl
               p-6 md:p-8 flex flex-col items-center gap-4"
      >
        <button
            type="button"
            @click="closeModal"
            class="absolute top-3 right-3
                 w-8 h-8 flex items-center justify-center
                 rounded-full border border-black/10
                 text-black/70 hover:text-black hover:bg-black/5
                 transition"
            aria-label="Cerrar"
        >
          ✕
        </button>

        <h2 class="text-lg md:text-xl font-semibold text-black text-center">
          Scan to view & share my resume
        </h2>

        <p class="text-sm text-gray-600 text-center max-w-xs">
          Open your camera or any QR scanner, point it at the code,
          and you’ll get the link to my online resume.
        </p>

        <div
            class="mt-2 rounded-xl border border-gray-200 p-4 md:p-5
                 bg-gray-50 flex items-center justify-center"
        >
          <QrcodeVue
              :value="resumieUrl"
              :size="192"
              level="H"
              class="rounded-md"
          />
        </div>

        <div class="mt-4 w-full flex flex-col gap-3">
          <button
              type="button"
              @click="closeModal"
              class="w-full inline-flex items-center justify-center
                   rounded-full border border-black/70
                   bg-white text-black text-sm font-medium
                   py-2.5 md:py-3
                   hover:bg-black hover:text-white
                   transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>
