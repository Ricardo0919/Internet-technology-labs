<script setup lang="ts">
interface ProjectItem {
  title: string
  date: string
  detail: string
}

const projects: ProjectItem[] = [
  {
    title: 'Inc Mty - Pitch Competition',
    date: 'May 2025',
    detail: 'National 1st place',
  },
  {
    title: 'FIN 4 ALL - Hackathon',
    date: 'Nov 2024',
    detail: 'National 2nd place',
  },
  {
    title: 'Defin Space - Hackathon',
    date: 'Nov 2023',
    detail: 'National 2nd place',
  },
]

const languages: string[] = [
  'Spanish - Native',
  'English - TOEFL iBT B2 (Aug 2024)',
  'German - A2 (Goethe-Zertifikat A2, Jul 2024)',
  'French - A2 (DELF A2, Apr 2019)',
]
</script>

<template>
  <main class="mx-10 mt-16 md:mx-20 lg:mx-40 lg:my-40" id="languages-projects">
    <section class="flex flex-col lg:flex-row lg:gap-10">
      <div class="w-full lg:w-1/3">
        <h2 class="text-2xl md:text-3xl font-semibold text-white">
          Languages
        </h2>
        <div class="mt-1 h-px w-full bg-neutral-700"></div>

        <ul class="mt-4 space-y-1 text-sm md:text-base text-white/80">
          <li v-for="lang in languages" :key="lang">
            {{ lang }}
          </li>
        </ul>
      </div>

      <div class="w-full lg:w-2/3 mt-10 lg:mt-0">
        <h2 class="text-2xl md:text-3xl font-semibold text-white">
          Projects &amp; Achievements
        </h2>
        <div class="mt-1 h-px w-full bg-neutral-700"></div>

        <div class="mt-6 space-y-4">
          <div
              v-for="project in projects" :key="project.title"
              class="rounded-2xl border border-neutral-700 bg-neutral-900/40 px-6 py-4
                   transition-all duration-200 hover:-translate-y-1 hover:bg-neutral-900/70"
          >
            <p class="text-sm md:text-base font-semibold text-white">
              {{ project.title }}
            </p>
            <p class="mt-1 text-xs md:text-sm text-white/70">
              {{ project.date }} - {{ project.detail }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
