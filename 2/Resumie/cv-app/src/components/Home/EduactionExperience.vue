<script setup lang="ts">
import { ref } from 'vue'
import tecLogo from '../../assets/images/Home/EducationExperience/tecLogo.png'
import plus from '../../assets/images/Home/EducationExperience/plus.webp'

interface ExperienceItem {
  title: string
  location: string
  period: string
  description: string
}

const experiences: ExperienceItem[] = [
  {
    title: 'Software Engineer Intern - PPG Industries',
    location: 'Querétaro, MX',
    period: 'Nov 2024 - Present',
    description: 'Full Stack Developer Intern working on Angular, .NET, and PostgreSQL for COMEX projects.',
  },
  {
    title: 'Jr Developer - Cloud Keter',
    location: 'Querétaro, MX',
    period: 'Feb 2024 - Sep 2024',
    description: 'Developed full-stack web applications with React, Tailwind CSS, and TypeScript, integrating APIs and databases.',
  },
  {
    title: 'AES Project - Intel',
    location: 'Guadalajara, MX',
    period: 'Mar 2024 - Apr 2024',
    description: 'Implemented AES encryption/decryption on FPGA in collaboration with Tec de Monterrey and Intel.',
  },
  {
    title: 'AI Puzzlebot - Manchester Robotics',
    location: 'Querétaro, MX',
    period: 'Mar 2025 - Jun 2025',
    description: 'Developed adaptive control and YOLOv8-based vision system for an autonomous mobile robot using ROS2.',
  },
]

const openIndex = ref<number | null>(null)
const toggleCard = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
  <main class="flex flex-col items-start justify-center lg:flex-row mx-10 mt-16 lg:my-40 md:mx-20 lg:gap-10 xl:mx-40" id="about-me">
    <div class="w-full lg:w-1/3">
      <h2 class="text-2xl md:text-3xl font-semibold text-white text-center lg:text-left">
        Education
      </h2>
      <div class="mt-2 h-px w-full bg-neutral-700"></div>

      <div class="mt-8 rounded-2xl border border-neutral-700 bg-neutral-900/40 px-8 py-10 flex flex-col items-center text-center">
        <img :src="tecLogo" alt="Tecnológico de Monterrey" class="h-20 w-auto mb-6" />
        <p class="text-lg md:text-xl font-semibold text-white">
          Tecnologico de Monterrey (ITESM)
        </p>
        <p class="mt-2 text-sm text-white/80">
          Robotics and Digital Systems Engineering
        </p>
        <p class="mt-4 text-xs md:text-sm text-white/70">
          August 2022 – Present
        </p>
        <p class="mt-1 text-xs md:text-sm text-white/70">
          GPA: 98.17 / 100
        </p>
      </div>
    </div>

    <div class="w-full lg:w-2/3 mt-12 lg:mt-0">
      <h2 class="text-2xl md:text-3xl font-semibold text-white text-center lg:text-left">
        Experience
      </h2>
      <div class="mt-2 h-px w-full bg-neutral-700"></div>

      <div class="mt-8 space-y-4 mb-4">
        <div v-for="(exp, index) in experiences" :key="exp.title" class="rounded-2xl border border-neutral-700 bg-neutral-900/40 px-6 pt-4 pb-2">
          <div class="flex items-center justify-between gap-4">
            <button type="button" class="flex items-center gap-4" @click="toggleCard(index)">
              <img
                  :src="plus"
                  alt="More"
                  class="h-4 w-4 transition-transform duration-200"
                  :class="openIndex === index ? 'rotate-45' : ''"
              />
              <p class="text-sm md:text-base font-semibold text-white text-left">
                {{ exp.title }}
              </p>
            </button>

            <p class="text-xs md:text-sm italic text-white/70 text-right">
              {{ exp.location }} | {{ exp.period }}
            </p>
          </div>


          <div class="mt-2 overflow-hidden transition-all duration-300" :class="openIndex === index ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'">
            <p class="mt-2 text-sm text-white/80 pl-6">
              {{ exp.description }}
            </p>
          </div>

        </div>
      </div>

    </div>
  </main>
</template>
