<script setup lang="ts">

</script>

<template>
  <div class="bg-slate-100/50">
    <header>
      <nav class="flex items-center justify-between p-6 lg:px-8">
        <div class="flex lg:flex-1">
          <a href="/" class="-m-1.5 p-1.5">
            <span class="sr-only">Marketplace.js</span>
            <img src="../../public/images/logo.png" class="block w-[125px] max-[991px]:w-[115px]"></img>
          </a>
        </div>
      </nav>
    </header>
    <div class="p-6 lg:p-8">
      <div class="flex flex-col justify-center space-y-6 w-full mx-auto">
        <slot />
      </div>
    </div>
  </div>
</template>
