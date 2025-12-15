<script setup>
import { isAuthenticated } from '@/utils/supabase'
import { ref, onMounted } from 'vue'
import { useDisplay } from 'vuetify'
import { defineProps } from 'vue'
import ProfileHeader from './ProfileHeader.vue'

const { mobile } = useDisplay()
const drawer = ref(false)
const menu = ref(false)

// Load Variables
const isLoggedIn = ref(false)

// get authenticated status from supabase
const getLoggedStatus = async () => {
  isLoggedIn.value = await isAuthenticated()
}

// Load Functions during component rendering
onMounted(() => getLoggedStatus())
</script>

<template>
  <v-app>
    <!-- Header Section -->
    <v-app-bar app flat class="navbar">
      <v-container class="d-flex align-center">
        <!-- Logo -->
        <v-app-bar-title class="logo">Easy Commute</v-app-bar-title>

        <!-- Navigation -->
        <v-spacer></v-spacer>
        <nav v-if="!mobile" class="nav-container">
          <router-link to="/home" class="nav-link">Home</router-link>
          <router-link to="/routes" class="nav-link">Ride</router-link>
          <router-link to="/fare" class="nav-link">Fare</router-link>
          <router-link to="/contact" class="nav-link">Contact Us</router-link>
          <ProfileHeader v-if="isLoggedIn"></ProfileHeader>
        </nav>

        <!-- Mobile Navigation Toggle -->
        <v-btn icon v-if="mobile" @click="drawer = !drawer">
          <v-icon color="white">mdi-menu</v-icon>
        </v-btn>
      </v-container>
    </v-app-bar>

    <!-- Mobile Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" temporary class="mobile-drawer">
      <v-list>
        <v-list-item>
          <router-link to="/home" class="nav-link">Home</router-link>
        </v-list-item>
        <v-list-item>
          <router-link to="/routes" class="nav-link">Ride</router-link>
        </v-list-item>
        <v-list-item>
          <router-link to="/fare" class="nav-link">Fare</router-link>
        </v-list-item>
        <v-list-item>
          <router-link to="/contact" class="nav-link">Contact Us</router-link>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Slot for Child Content -->
    <slot />
    <!-- Add this to render child content like HomeView.vue -->
  </v-app>
</template>

<style scoped>
/* Navbar Styles */
.navbar {
  background-color: black;
  /* Semi-transparent fallback */
}

/* Container for navigation */
.nav-container {
  display: flex;
  align-items: center;
  gap: 70px; /* spacing between links and avatar */
  transform: translate(25%);
}

/* Links section */
.nav-links {
  display: flex;
  align-items: center;
}

/* Avatar section */
.nav-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 50px; /* space between links and avatar */
}

/* Style for individual links */
.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1rem;
  transition: opacity 0.3s ease;
  font-family: 'Lucida Sans', Geneva, Verdana, sans-serif;
}

.nav-link:hover {
  opacity: 0.8;
}

/* Logo Styles */
.logo {
  font-size: 1.5rem;
  /* Base size for larger screens */
  font-weight: bold;
  color: white;
  /* text-align: center; */
  flex-grow: 1;
  /* Ensure logo takes available space */
}

/* Ensures avatar icon is visible and sized correctly */
.avatar-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  background-color: #333;
  /* Adjust background color if needed */
  border-radius: 50%;
  /* Circular shape */
  border: 2px solid white;
  /* Add white border for visibility */
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  /* Optional shadow for depth */
  font-size: 24px;
  /* Icon size */
  color: white;
  /* Icon color */
}

/* Dropdown Items */
.dropdown-item {
  padding: 10px 20px;
  /* Add padding for a cleaner look */
  color: #ffffff;
  /* White text color */
  cursor: pointer;
  /* Pointer cursor for clickable items */
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

/* Hover Effect for Dropdown Items */
.dropdown-item:hover {
  background-color: #007bff;
  /* Bright blue background on hover */
  color: #ffffff;
  /* Keep text white */
}

/* Active State (Optional) */
.dropdown-item:active {
  background-color: #0056b3;
  /* Slightly darker blue for active state */
  color: #ffffff;
  /* Keep text white */
}

/* Mobile Drawer */
.mobile-drawer {
  background-color: black;
}

.v-list-item a {
  color: #00bfff;
  text-decoration: none;
  font-size: 1.1rem;
}

.v-list-item a:hover {
  color: #007bb5;
}

/* Mobile Responsiveness */
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

  .nav-link {
    margin-right: 20px;
  }

  /* Navigation drawer */
  .v-navigation-drawer {
    width: 250px;
    background-color: black;
  }

  .v-list-item {
    padding: 16px 0;
  }

  .v-list-item a {
    font-size: 1.1rem;
    padding: 8px 16px;
    color: #007bb5;
  }

  .v-list-item a:hover {
    color: #00bfff;
  }

  .dropdown-item {
    padding: 0;
    color: #00bfff;
    transition:
      background-color 0.3s ease,
      color 0.3s ease;
    cursor: pointer;
    /* Make items clickable */
  }
}

/* Additional Media Queries for Tablets and Larger Devices */
@media (max-width: 768px) {
  .main-title {
    font-size: 4rem;
  }

  .subtitle {
    font-size: 1.5rem;
  }

  .nav-link {
    font-size: 1.1rem;
    margin-right: 25px;
  }

  /* Navigation drawer */
  .v-navigation-drawer {
    width: 250px;
    background-color: black;
  }

  .v-list-item {
    padding: 16px 0;
  }

  .v-list-item a {
    font-size: 1.1rem;
    padding: 8px 16px;
    color: #007bb5;
  }

  .v-list-item a:hover {
    color: #00bfff;
  }

  .dropdown-item {
    padding: 0;
    color: #00bfff;
    transition:
      background-color 0.3s ease,
      color 0.3s ease;
    cursor: pointer;
    /* Make items clickable */
  }
}

@media (max-width: 1200px) {
  .main-title {
    font-size: 5rem;
  }

  .subtitle {
    font-size: 1.8rem;
  }

  .dropdown-item {
    padding: 0;
    color: #00bfff;
    transition:
      background-color 0.3s ease,
      color 0.3s ease;
    cursor: pointer;
    /* Make items clickable */
  }

  .main-title {
    font-size: 5.5rem;
  }

  .subtitle {
    font-size: 2rem;
  }

  .nav-link {
    font-size: 1.2rem;
  }

  /* Navigation drawer */
  .v-navigation-drawer {
    width: 250px;
    background-color: black;
  }

  .v-list-item {
    padding: 16px 0;
  }

  .v-list-item a {
    font-size: 1.1rem;
    padding: 8px 16px;
    color: #007bb5;
  }

  .v-list-item a:hover {
    color: #00bfff;
  }
}

/* Adjustments for smaller screens */
@media (max-width: 900px) {
  .logo {
    font-size: 1em;
  }
}

@media (max-width: 600px) {
  .logo {
    font-size: 1em;
  }
}

@media (max-width: 400px) {
  .logo {
    font-size: 1em;
  }
}

@media (max-width: 300px) {
  .logo {
    font-size: 1em;
  }
}
</style>
