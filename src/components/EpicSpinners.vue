<script setup>
import { ref, onMounted } from 'vue'
import { FulfillingSquareSpinner } from 'epic-spinners'

const isLoading = ref(true)

onMounted(() => {
  window.addEventListener('load', () => {
    isLoading.value = false
  })
})
</script>

<template>
  <div v-if="isLoading" class="preloader">
    <fulfilling-square-spinner :animation-duration="4000" :size="50" color="#0000ff" />
  </div>
  <div v-else>
    <!-- Your main content goes here -->
  </div>
</template>

<style>
.preloader {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999; /* Ensure it is above other elements */
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: black; /* Optional: you can change the background color */
}
</style>
