<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Bars3Icon, PhoneIcon } from "@heroicons/vue/24/outline";
import Logo from "../../assets/images/Home/Navbar/Logo.png";
import MobileMenu from "./MobileMenu.vue";

// UI state kept local to Navbar for predictable behavior:
// - open: controls mobile overlay
// - spinning: prevents double-tap spam while the icon animates
// - scrolled: toggles header styling after the user scrolls
const open = ref(false);
const spinning = ref(false);
const scrolled = ref(false);

// Navigation config as data
const LINKS = [
  { href: "/#home", label: "Home" },
  { href: "/#about-me", label: "Experience" },
  { href: "/#skills", label: "Skills" },
  { href: "/#languages-projects", label: "Languages, Projects & Achievements" },
];

const CONTACT = {
  href: "#footer",
  label: "Contact",
};

// Scroll listener updates header visuals (glass effect) once the user leaves the top
const handleScroll = () => {
  scrolled.value = window.scrollY > 10;
};

onMounted(() => {
  // Attach listener only while component is mounted to avoid leaks
  window.addEventListener("scroll", handleScroll);
  handleScroll();
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});

const handleHamburgerClick = () => {
  // Guard against multiple clicks while animating or already open
  if (spinning.value || open.value) return;

  // Small delay to sync icon animation with menu opening for a smoother UX
  spinning.value = true;
  setTimeout(() => {
    open.value = true;
    spinning.value = false;
  }, 300);
};

const handleCloseMenu = () => {
  open.value = false;
};
</script>

<template>
  <header
      class="sticky top-8 md:top-12 lg:top-5 z-50 mx-6 md:mx-8 lg:mx-auto max-w-7xl rounded-full font-zendots transition-all duration-300"
      :class="scrolled
      ? 'border border-white/20 bg-white/10 backdrop-blur-xl shadow-lg shadow-black/10'
      : 'bg-transparent border-transparent shadow-none'"
  >
    <nav
        role="navigation"
        class="flex h-16 lg:h-20 items-center justify-between px-12 md:px-20 lg:px-8"
    >
      <!-- Icon -->
      <a href="/" class="shrink-0">
        <img :src="Logo" alt="Logo" class="h-6 w-auto md:h-7 lg:h-8" />
      </a>

      <!-- Desktop Menu -->
      <ul class="hidden lg:flex items-center gap-8 xl:gap-10">
        <li v-for="item in LINKS" :key="item.href">
          <a
              :href="item.href"
              class="lg:text-sm xl:text-base tracking-wide text-white/90 hover:text-white transition-colors relative
                   after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-all hover:after:w-full"
          >
            {{ item.label }}
          </a>
        </li>
      </ul>

      <!-- Contact button -->
      <div class="hidden lg:flex">
        <a
            :href="CONTACT.href"
            class="inline-flex items-center gap-2 rounded-full border border-white px-5 py-2 text-white text-sm font-medium shadow-sm hover:opacity-90 active:opacity-80 transition"
        >
          <PhoneIcon class="w-4 h-4" />
          <span>{{ CONTACT.label }}</span>
        </a>
      </div>

      <!-- Tablet and Mobile menu trigger -->
      <button
          class="lg:hidden p-2 -mr-2"
          @click="handleHamburgerClick"
      >
        <Bars3Icon
            class="w-7 h-7 md:w-8 md:h-8 text-white
           transition-transform duration-300 active:scale-95
           motion-reduce:transition-none motion-reduce:animate-none"
            :class="spinning ? 'animate-[spin_0.3s_linear_1]' : ''"
        />
      </button>
    </nav>
  </header>

  <!-- Tablet and Phone Menu Component-->
  <MobileMenu :open="open" :links="LINKS" :contact="CONTACT" @close="handleCloseMenu" />
</template>
