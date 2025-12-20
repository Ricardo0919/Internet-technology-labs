<script setup lang="ts">
const whatsappLink = "https://wa.me/4915222044690";
import Whatsapp from "../../assets/images/Home/WhatsApp/Whatsapp.png";
</script>

<template>
  <a
      :href="whatsappLink"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      class="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50
           w-14 h-14 md:w-16 md:h-16
           flex items-center justify-center
           rounded-full border border-white
           bg-black
           transition-transform duration-500 ease-out
           hover:scale-110 hover:opacity-30"
  >
    <img
        :src="Whatsapp"
        alt="WhatsApp"
        class="w-8 h-8 md:w-10 md:h-10"
    />
  </a>
</template>
