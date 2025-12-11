<script setup lang="ts">
const links = [
  { label: 'Home', href: '#home' },
  { label: 'About me', href: '#about-me' },
  { label: 'Skills', href: '#skills' },
  { label: 'Languages, Projects & Achievements', href: '#languages-projects' },
]

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="bg-black" id="footer">
    <main class="mx-10 mt-16 md:mx-20 lg:mx-40 py-10 md:py-14 text-white">
      <section class="flex flex-col gap-10 md:flex-row md:justify-between">
        <div class="w-full md:w-1/2">
          <h3 class="text-lg md:text-xl font-semibold">
            Contact Info
          </h3>

          <div class="mt-4 space-y-2 text-sm md:text-base text-white/80">
            <p>
              <a href="mailto:rickisierra919@gmail.com" class="group inline-block relative">
                <span class="relative z-10">
                  rickisierra919@gmail.com
                </span>
                <span class="absolute left-0 -bottom-0.5 h-[2px] w-full bg-white/80 origin-left scale-x-0 transition-transform duration-200 group-hover:scale-x-100"/>
              </a>
            </p>

            <p>
              <a href="https://www.linkedin.com/in/ricardo-sierra-roa/" target="_blank" rel="noreferrer" class="group inline-block relative">
                <span class="relative z-10">
                  LinkedIn
                </span>
                <span class="absolute left-0 -bottom-0.5 h-[2px] w-full bg-white/80 origin-left scale-x-0 transition-transform duration-200 group-hover:scale-x-100"/>
              </a>
            </p>

            <p>
              <a href="tel:+4915222044690" class="group inline-block relative">
                <span class="relative z-10">
                  +49 1522 2044690
                </span>
                <span class="absolute left-0 -bottom-0.5 h-[2px] w-full bg-white/80 origin-left scale-x-0 transition-transform duration-200 group-hover:scale-x-100"/>
              </a>
            </p>
          </div>
        </div>


        <div class="w-full md:w-1/2 md:text-right">
          <h3 class="text-lg md:text-xl font-semibold">
            Links
          </h3>

          <div class="mt-4 space-y-2 text-sm md:text-base text-white/80">
            <div v-for="link in links" :key="link.label">
              <a :href="link.href" class="group inline-block relative">
                <span class="relative z-10">
                  {{ link.label }}
                </span>
                <span class="absolute left-0 -bottom-0.5 h-[2px] w-full bg-white/80 origin-left scale-x-0 transition-transform duration-200 group-hover:scale-x-100"/>
              </a>
            </div>
          </div>
        </div>
      </section>

      <div class="mt-10 border-t border-neutral-800 pt-4">
        <p class="text-xs md:text-sm text-center text-white/60">
          © {{ currentYear }}, Ricardo Sierra Roa. All rights reserved.
        </p>
      </div>

    </main>
  </footer>
</template>
