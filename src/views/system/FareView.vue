<script setup>
import { ref, onMounted } from 'vue'
import { useDisplay } from 'vuetify'
import AppLayout from '@/components/AppLayout.vue'
import EpicSpinners from '@/components/EpicSpinners.vue'

const { mobile } = useDisplay()
const zoomedImage = ref(null)
const showModal = ref(false)

const openModal = (image) => {
  zoomedImage.value = image
  showModal.value = true
}

const closeModal = () => {
  zoomedImage.value = null
  showModal.value = false
}

const isLoading = ref(true)

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 3000)
})
</script>

<template>
  <AppLayout>
    <EpicSpinners v-if="isLoading" :color="'#0000ff'" />

    <!-- Background Video -->
    <div class="video-container">
      <video autoplay muted loop class="background-video">
        <source src="/images/background.mp4" type="video/mp4" />
      </video>
    </div>

    <!-- Images Overlay -->
    <div class="images-overlay" v-if="!isLoading">
      <!-- Single top tricycle fare image -->
      <div class="image-container">
        <img
          src="/images/tricyclefare.png"
          alt="Tricycle Fare"
          class="overlay-image top-image"
          @click="openModal('/images/tricyclefare.png')"
        />
      </div>

      <!-- Two side-by-side multicab images -->
      <div class="images-row">
        <img
          src="/images/multicab_fare.jpg"
          alt="Multicab Fare"
          class="overlay-image side-by-side"
          @click="openModal('/images/multicab_fare.jpg')"
        />
        <img
          src="/images/modernmulticabfare.jpg"
          alt="Multicab Fare"
          class="overlay-image side-by-side"
          @click="openModal('/images/modernmulticabfare.jpg')"
        />
      </div>
    </div>

    <!-- Fullscreen Zoomed Image -->
    <v-dialog
      v-model="showModal"
      fullscreen
      overlay-color="black"
      transition="fade-transition"
      persistent
    >
      <v-img :src="zoomedImage" class="zoomed-image" @click="closeModal"></v-img>
    </v-dialog>

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

.video-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: black;
}

/* Overlay container for all images */
.images-overlay {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  padding: 80px 20px;
  width: 100%;
  box-sizing: border-box;
  z-index: 1;
}

/* Single image container */
.image-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

/* Top Tricycle Fare Image */
.overlay-image.top-image {
  width: 80%;
  max-width: 500px;
  height: auto;
  cursor: pointer;
  border-radius: 8px;
  transition: transform 0.3s;
}

.overlay-image.top-image:hover {
  transform: scale(1.05);
}

/* Row for side-by-side images */
.images-row {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  max-width: 1200px;
}

/* Side-by-side multicab images */
.overlay-image.side-by-side {
  width: calc(50% - 10px);
  max-width: 500px;
  height: auto;
  cursor: pointer;
  border-radius: 8px;
  transition: transform 0.3s;
}

.overlay-image.side-by-side:hover {
  transform: scale(1.05);
}

/* Fullscreen zoomed image */
.zoomed-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: black;
  cursor: zoom-out;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .overlay-image.side-by-side {
    width: 45%;
  }
}

@media (max-width: 992px) {
  .overlay-image.side-by-side {
    width: 48%;
  }
  .overlay-image.top-image {
    width: 85%;
  }
}

@media (max-width: 768px) {
  .images-row {
    flex-direction: column;
    gap: 15px;
    align-items: center;
  }

  .overlay-image.side-by-side {
    width: 90%;
  }

  .overlay-image.top-image {
    width: 90%;
  }
}

@media (max-width: 480px) {
  .images-overlay {
    padding: 60px 10px;
  }

  .overlay-image.side-by-side {
    width: 100%;
  }

  .overlay-image.top-image {
    width: 100%;
  }
}
</style>
