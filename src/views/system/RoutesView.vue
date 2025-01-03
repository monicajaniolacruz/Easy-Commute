<script setup>
import { ref, onMounted } from 'vue'
import { useDisplay } from 'vuetify'
import AppLayout from '@/components/AppLayout.vue'
import EpicSpinners from '@/components/EpicSpinners.vue'

const { mobile } = useDisplay()

const isLoading = ref(true)

onMounted(() => {
  // Simulate loading
  setTimeout(() => {
    isLoading.value = false
  }, 3000) // Adjust the duration as needed
})
</script>

<template>
  <AppLayout>
    <EpicSpinners v-if="isLoading" :color="'#0000ff'" />
    <!-- Background Video -->
    <div v-if="!isLoading" class="video-container">
      <video autoplay muted loop class="background-video">
        <source src="/public/images/rides.mp4" type="video/mp4" />
      </video>
    </div>

    <!-- Main Content -->
    <div v-if="!isLoading">
      <!-- First Row -->
      <v-container class="text-center custom-container">
        <v-row justify="center" align="center" class="button-row first-row">
          <v-col cols="12" md="4" sm="6">
            <RouterLink to="/multicab" style="text-decoration: none">
              <v-btn class="custom-btn" rounded="xl" size="x-large" block> Multicab </v-btn>
            </RouterLink>
          </v-col>
        </v-row>

        <!-- Second Row -->
        <v-row justify="center" align="center" class="button-row second-row">
          <v-col cols="12" md="4" sm="6">
            <RouterLink to="/tricycle" style="text-decoration: none">
              <v-btn class="custom-btn" rounded="xl" size="x-large" block> Tricycle </v-btn>
            </RouterLink>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <RouterView v-if="!isLoading" />
  </AppLayout>
</template>

<style scoped>
/* Background Video */
.background-video {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: -1;
}

/* Video Container */
.video-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: black; /* Set the background color to black */
}

.custom-btn {
  font-weight: bold; /* Adjust font weight for a bolder appearance */
  padding: 16px 24px; /* Increase padding for a 'heavier' feel */
  border: 3px solid #ffffff; /* Add a thicker border */
  background-color: #ffffff; /* Button background color */
  color: #000000; /* Text color */
  text-transform: uppercase; /* Optional: Make text uppercase */
  transition: all 0.3s ease; /* Smooth transitions for hover effects */
}

.custom-btn:hover {
  background-color: #000000; /* Change background on hover */
  color: #ffffff; /* Change text color on hover */
  border-color: #000000; /* Change border color on hover */
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2); /* Add shadow for hover effect */
}

.button-row {
  margin-top: 20px; /* Add some spacing between rows */
}

.first-row {
  transform: translate(32%, 250%);
  width: 60%;
}

.second-row {
  transform: translate(32%, 400%);
  width: 60%;
}
</style>
