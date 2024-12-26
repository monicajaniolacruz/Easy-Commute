<script setup>
import { ref } from 'vue'
import { useDisplay } from 'vuetify'
import AppLayout from '@/components/AppLayout.vue'

// Vuetify display composable for mobile detection
const { mobile } = useDisplay()
</script>

<template>
  <AppLayout>
    <!-- Background Video and Content Overlay -->
    <div class="video-container">
      <video autoplay muted loop class="background-video">
        <source src="/public/images/homeview.mp4" type="video/mp4" />
      </video>
    </div>

    <!-- Overlay Content -->
    <div class="overlay">
      <div class="main-title">DON'T KNOW</div>
      <div class="subtitle">WHERE TO GO?</div>
      <router-link to="/routes" style="text-decoration: none">
        <v-btn class="contact-button"> GET STARTED </v-btn>
      </router-link>
    </div>
  </AppLayout>
</template>

<style scoped>
/* Background Video */
.background-video {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
  min-height: 100vh;
}

.video-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* Overlay */
.overlay {
  position: absolute;
  top: 50%;
  left: 10%;
  transform: translateY(-50%);
  text-align: left;
  color: white;
  z-index: 1;
  width: 90%;
}

.main-title {
  font-size: 5rem;
  font-weight: bold;
  text-transform: uppercase;
  text-shadow:
    2px 2px 10px #00bfff,
    4px 4px 10px rgba(254, 254, 254, 0.8);
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.5rem;
  text-transform: uppercase;
  margin-bottom: 20px;
  letter-spacing: 3px;
}

.contact-button {
  display: inline-block;
  background-color: #00bfff;
  color: black;
  text-transform: uppercase;
  font-weight: bold;
  padding: 10px 20px;
  border-radius: 30px;
  text-decoration: none;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 4px 10px rgba(0, 255, 128, 0.4);
}

.contact-button:hover {
  background-color: #ffffff;
  color: #00bfff;
  transform: translateY(-3px);
  box-shadow: 0 8px 15px rgba(0, 255, 128, 0.6);
}

/* Responsive Adjustments */
@media (max-width: 600px) {
  .main-title {
    font-size: 3rem;
  }

  .subtitle {
    font-size: 1.2rem;
  }

  .contact-button {
    font-size: 1rem;
    padding: 8px 15px;
  }

  .overlay {
    left: 5%;
    width: 90%;
  }
}

@media (max-width: 768px) {
  .main-title {
    font-size: 4rem;
  }

  .subtitle {
    font-size: 1.5rem;
  }
}

@media (max-width: 1024px) {
  .main-title {
    font-size: 5rem;
  }

  .subtitle {
    font-size: 1.8rem;
  }
}

@media (min-width: 1025px) {
  .main-title {
    font-size: 5.5rem;
  }

  .subtitle {
    font-size: 2rem;
  }
}
</style>
