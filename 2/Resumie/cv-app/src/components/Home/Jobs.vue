<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const go = () => {
  router.push("/look-jobs");
};
</script>

<template>
  <section class="mx-10 mt-16 md:mx-20 lg:mx-40 lg:my-40">
    <div class="rounded-2xl border border-neutral-700 bg-neutral-900/40 px-8 py-10 transition-all duration-200 hover:-translate-y-1 hover:bg-neutral-900/70">

      <div class="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8">
        <div class="max-w-2xl">
          <h2 class="text-2xl md:text-3xl font-semibold text-white">
            Explore Live Jobs in Germany
          </h2>
          <div class="mt-2 h-px w-24 bg-neutral-700"></div>

          <p class="mt-5 text-sm md:text-base text-white/80">
            Browse real job offers using Germany’s official Jobsuche API.
            Filter by city, radius, and keywords (werkstudent, praktikum, robotik…).
          </p>

          <p class="mt-2 text-xs md:text-sm text-white/60">
            Powered by Bundesagentur für Arbeit (Jobsuche).
          </p>
        </div>

        <div class="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
          <button
              type="button"
              @click="go"
              class="inline-flex items-center justify-center rounded-full border border-white px-6 py-3 text-white text-sm md:text-base
                    font-medium shadow-sm hover:opacity-90 active:opacity-80 transition"
          >
            Open job explorer →
          </button>
        </div>
      </div>

    </div>
  </section>
</template>
