<script setup lang="ts">
interface SkillGroup {
  title: string
  items: string[]
}

const skillGroups: SkillGroup[] = [
  {
    title: 'Soft Skills',
    items: [
      'Time Management',
      'Teamwork & Leadership',
      'Problem Solving',
      'Attention to Detail',
      'Adaptability',
    ],
  },
  {
    title: 'Hard Skills',
    items: [
      'HTML, CSS, React, TypeScript',
      'C, C++, C#, .NET',
      'Python, SQL',
      'Embedded Linux, ROS2, Matlab',
      'GitHub',
    ],
  },
]
</script>

<template>
  <main class="mx-10 mt-16 md:mx-20 lg:mx-40 lg:my-40" id="skills">
    <h2 class="text-2xl md:text-3xl font-semibold text-white text-center">
      Skills
    </h2>
    <div class="mt-2 h-px w-24 mx-auto bg-neutral-700"></div>

    <section class="mt-10 flex flex-col gap-6 lg:flex-row lg:gap-8">
      <div v-for="group in skillGroups" :key="group.title" class="w-full lg:w-1/2">
        <div class="rounded-2xl border border-neutral-700 bg-neutral-900/40 px-8 py-8 transition-all duration-200 hover:-translate-y-1 hover:bg-neutral-900/70">
          <h3 class="text-lg md:text-xl font-semibold text-white text-center">
            {{ group.title }}
          </h3>

          <ul class="mt-6 space-y-2 text-sm md:text-base text-white/80">
            <li v-for="item in group.items" :key="item">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </section>

  </main>
</template>
