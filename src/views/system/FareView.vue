<script setup>
import { ref } from 'vue'
import { useDisplay } from 'vuetify'
import AppLayout from '@/components/AppLayout.vue'

const { mobile } = useDisplay()
const zoomedImage = ref(null)
const showModal = ref(false)

const openModal = (image) => {
  zoomedImage.value = image
  showModal.value = true
}

const closeModal = () => {
  zoomedImage.value = null // Reset image when closing
  showModal.value = false
}
</script>

<template>
  <AppLayout>
    <!-- Background Video -->
    <div class="video-container">
      <video autoplay muted loop class="background-video">
        <source src="/images/background.mp4" type="video/mp4" />
      </video>
    </div>

    <!-- Images Overlay -->
    <div class="image-container-1">
      <img
        src="/images/tricyclefare.png"
        alt="Tricycle Fare"
        class="overlay-image"
        @click="openModal('/images/tricyclefare.png')"
      />
    </div>

    <div class="image-container-2">
      <img
        src="/images/multicabfare.jpg"
        alt="Multicab Fare"
        class="overlay-image"
        @click="openModal('/images/multicabfare.jpg')"
      />
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

    <RouterView />
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
}

/* Image Container and Overlay Images */
.image-container-1,
.image-container-2 {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  z-index: 1;
}

.image-container-2 {
  transform: translateX(-50%) translateY(80%); /* Adjust the position of the second image */
}

.overlay-image {
  width: 100%;
  max-width: 600px; /* Keeps the image within a limit */
  height: auto; /* Maintains aspect ratio */
  border-radius: 10px;
  cursor: pointer;
  object-fit: contain;
}

/* Zoomed Image */
.zoomed-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: black;
  cursor: zoom-out;
}

/* Mobile Responsiveness */
@media (max-width: 600px) {
  /* Adjust image width */
  .overlay-image {
    width: 90%; /* Adjust width of images on mobile */
    max-width: none; /* Remove max-width constraint */
  }

  /* Adjust image containers for better positioning on mobile */
  .image-container-1,
  .image-container-2 {
    position: relative;
    top: 10%; /* Adjust vertical position */
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px; /* Reduce gap between images */
  }

  /* Image 2 (second image) */
  .image-container-2 {
    top: 20%; /* Adjust vertical position of the second image */
  }
}
</style>
