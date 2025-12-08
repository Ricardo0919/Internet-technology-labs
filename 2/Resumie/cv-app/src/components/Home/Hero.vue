<script setup lang="ts">
import profilePhoto from '../../assets/images/Home/Hero/profilePhoto.jpg'
import github from '../../assets/images/Home/Hero/github.png'
import linkedin from '../../assets/images/Home/Hero/linkedin.png'
import mail from '../../assets/images/Home/Hero/mail.png'
</script>

<template>
  <header class="flex flex-col items-center justify-center lg:flex-row mx-10 mt-16 md:mx-20 lg:gap-10 xl:mx-40" id="home">
    <div class="order-2 w-full lg:order-1 lg:w-2/3 text-center lg:text-left mt-6 md:mt-16">
      <h1 class="text-4xl md:text-5xl font-bold text-white">
        Ricardo Sierra Roa
      </h1>

      <div class="mt-6 flex flex-col md:flex-row gap-4 items-center justify-center lg:justify-start">
        <span class="rounded-full border border-neutral-600 px-6 py-2 text-xs md:text-sm text-white/80">
          Robotics &amp; Digital Systems Engineering Student
        </span>
        <span class="rounded-full border border-neutral-600 px-6 py-2 text-xs md:text-sm text-white/80">
          Jr Software Engineer
        </span>
      </div>

      <p class="mt-6 text-sm text-center md:text-lg text-white lg:text-left lg:text-base lg:pr-10 xl:pr-52">
        Currently studying Robotics and Digital Systems Engineering at
        Tecnologico de Monterrey (ITESM) with a 50% academic talent scholarship,
        and completing a semester abroad at Hochschule Esslingen, Germany.
        Passionate about AI, software development, and robotics, I aim to
        combine technology and creativity to solve complex problems. Currently
        working at PPG Industries as a Software Engineer Intern, gaining
        hands-on experience in real-world applications. I am now seeking to grow
        further by pursuing new professional opportunities in Germany within AI,
        robotics, and software engineering.
      </p>

      <div class="mt-8 flex flex-row items-center justify-center gap-6 lg:justify-start">
        <a href="https://github.com/Ricardo0919" target="_blank" rel="noreferrer">
          <img :src="github" alt="GitHub" class="h-12 w-auto md:h-16 transition-transform duration-500 ease-out hover:scale-110 hover:opacity-30" />
        </a>
        <a href="https://www.linkedin.com/in/ricardo-sierra-roa/" target="_blank" rel="noreferrer">
          <img :src="linkedin" alt="LinkedIn" class="h-12 w-auto md:h-16 transition-transform duration-500 ease-out hover:scale-110 hover:opacity-30" />
        </a>
        <a href="mailto:ricardo@example.com">
          <img :src="mail" alt="Email" class="h-12 w-auto md:h-16 transition-transform duration-500 ease-out hover:scale-110 hover:opacity-30" />
        </a>
      </div>
    </div>

    <div class="order-1 lg:order-2 w-full lg:w-1/3 flex justify-center">
      <div class="flex items-center justify-center rounded-full border border-neutral-600">
        <img :src="profilePhoto" alt="Profile photo" class="h-64 w-64 md:h-72 md:w-72 xl:h-96 xl:w-96 rounded-full object-cover"/>
      </div>
    </div>
  </header>
</template>
