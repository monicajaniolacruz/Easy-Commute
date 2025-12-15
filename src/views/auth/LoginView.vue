<script setup>
import { requiredValidator, emailValidator } from '@/utils/validators'
import { supabase, formActionDefault } from '@/utils/supabase'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const password = ref('')
const showPassword = ref(false)
const currentForm = ref('login')
const refVform = ref()
const showLoginForm = ref(false) // 👈 NEW state to control visibility

const router = useRouter()

const formDataDefault = {
  email: '',
  password: '',
}

const formData = ref({
  ...formDataDefault,
})

const formAction = ref({
  ...formActionDefault,
})

// 🟢 Function to show login form
function toggleLoginForm() {
  showLoginForm.value = !showLoginForm.value
}

const onLogin = async () => {
  formAction.value = { ...formActionDefault }
  formAction.value.formProcess = true

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.value.email,
    password: formData.value.password,
  })
  if (error) {
    formAction.value.formErrorMessage = error.message
    formAction.value.formStatus = error.status
  }
  if (data) {
    formAction.value.formSuccessMessage = 'Successfully Logged Account.'

    // Wait a moment to show success
    setTimeout(() => {
      router.replace('/home')
    }, 1500)
  }

  refVform.value?.reset()
  formAction.value.formProcess = false
}

const onFormSubmit = () => {
  refVform.value?.validate().then(({ valid }) => {
    if (valid) onLogin()
  })
}

const loginWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/google/callback',
    },
  })

  if (error) {
    formAction.value.formErrorMessage = error.message
    formAction.value.formStatus = error.status
  }
}

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <v-responsive class="border rounded">
    <v-app>
      <!-- Background Video -->
      <div class="video-container">
        <video autoplay muted loop class="background-video">
          <source src="/public/images/register.mp4" type="video/mp4" />
        </video>
      </div>
      <!-- HEADER NAVBAR -->
      <v-app-bar app flat class="transparent-navbar">
        <v-container class="d-flex align-center">
          <v-app-bar-title class="logo">Easy Commute</v-app-bar-title>
          <v-spacer></v-spacer>
          <!-- 🔘 Sign in button toggles form -->
          <button class="ml-3 adjustable-button" @click="toggleLoginForm">
            {{ showLoginForm ? 'Close' : 'Sign in' }}
          </button>
        </v-container>
      </v-app-bar>

      <!-- 🔽 Login Form (Hidden initially) -->
      <transition name="fade-slide">
        <v-container
          v-if="showLoginForm"
          fluid
          class="fill-height d-flex align-center justify-center"
        >
          <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="6" lg="4">
              <v-card
                class="elevation-12 rounded-xl transparent-card blurred-background flexible-form"
              >
                <v-toolbar dark flat class="rounded-t-xl transparent-card">
                  <v-toolbar-title class="text-h5 font-weight-bold text-center white--text">
                    Easy Commute
                  </v-toolbar-title>
                </v-toolbar>

                <v-card-text class="pa-6 transparent-card white--text">
                  <v-form class="mt-5" ref="refVform" @submit.prevent="onFormSubmit">
                    <v-text-field
                      v-model="formData.email"
                      label="Email"
                      prepend-icon="mdi-email"
                      variant="filled"
                      color="white"
                      hide-details
                      :rules="[requiredValidator, emailValidator]"
                    ></v-text-field>

                    <v-text-field
                      v-model="formData.password"
                      label="Password"
                      prepend-icon="mdi-lock"
                      variant="filled"
                      color="white"
                      :type="showPassword ? 'text' : 'password'"
                      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="togglePasswordVisibility"
                      hide-details
                      :rules="[requiredValidator]"
                    ></v-text-field>

                    <v-btn class="mt-4 gradient-btn" type="submit" block rounded elevation="6">
                      SIGN IN
                    </v-btn>
                    <v-btn
                      class="mt-4 google-btn"
                      block
                      rounded
                      elevation="6"
                      @click="loginWithGoogle"
                    >
                      <v-icon left>mdi-google</v-icon>
                      Sign in with Google
                    </v-btn>
                  </v-form>

                  <v-divider class="my-5"></v-divider>
                  <h5 class="text-center">
                    Don't have an account?
                    <RouterLink class="btn-cyan" to="/register">SIGNUP</RouterLink>
                  </h5>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </transition>

      <!-- Alerts -->
      <v-alert
        v-if="formAction.formSuccessMessage"
        :text="formAction.formSuccessMessage"
        title="Success!"
        type="success"
        variant="tonal"
        density="compact"
        border="start"
        closable
      ></v-alert>
      <v-alert
        v-if="formAction.formErrorMessage"
        :text="formAction.formErrorMessage"
        title="Ooops!"
        type="error"
        variant="tonal"
        density="compact"
        border="start"
        closable
      ></v-alert>

      <RouterView />
    </v-app>
  </v-responsive>
</template>

<style scoped>
.background-video {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%; /* Default width */
  height: auto; /* Maintain aspect ratio */
  transform: translate(-50%, -50%); /* Center the video */
  min-width: 100%; /* Ensure video covers the width */
  min-height: 100%; /* Ensure video covers the height */
  object-fit: cover; /* Scale to cover the entire container */
  z-index: -1; /* Behind all content */
}
.video-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.logo {
  font-size: 2em;
  font-weight: bold;
  color: white;
  user-select: none;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva,
    Verdana, sans-serif;
}
.transparent-navbar {
  background-color: transparent;
}

.white-text-custom {
  color: white !important;
}

/* Gradient button (blue-green theme) */
.gradient-btn {
  background: #98ded9;
  color: rgb(0, 0, 0) !important;
  text-transform: uppercase;

  letter-spacing: 1px;
  border-radius: 12px !important;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 4px 12px rgba(0, 255, 200, 0.3);
}

/* Hover effect - brighter glow */
.gradient-btn:hover {
  transform: scale(1.03);
  box-shadow: 0 6px 16px rgba(0, 255, 200, 0.5);
  background: linear-gradient(90deg, #00e5ff, #00c853);
}
@keyframes glow {
  0% {
    box-shadow:
      0 0 5px #00e5ff,
      0 0 10px #00c853;
  }
  50% {
    box-shadow:
      0 0 15px #00e5ff,
      0 0 25px #00c853;
  }
  100% {
    box-shadow:
      0 0 5px #00e5ff,
      0 0 10px #00c853;
  }
}

.gradient-btn:hover {
  animation: glow 1.5s infinite alternate;
}

/* Transparent Card */
.transparent-card {
  background-color: transparent !important;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* Blurred Background */
.blurred-background {
  backdrop-filter: blur(10px);
}

/* White text for forms */
.white-input .v-input__control {
  color: white !important;
}

/* Ensure all text is white */
.white--text {
  color: white !important;
}

.custom-checkbox {
  width: 16px;
  height: 16px;
  border: 2px solid white;
  border-radius: 4px;
  background-color: transparent;
  appearance: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative; /* To position the checkmark inside */
}

.custom-checkbox:checked {
  background-color: transparent;
  border-color: white; /* Ensure the border color is white when checked */
}

.custom-checkbox:checked::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 4px;
  width: 4px;
  height: 7px;
  border: solid white;
  border-width: 0 3px 3px 0;
  transform: rotate(45deg); /* Make the checkmark */
}

.ml-2 {
  margin-left: 8px;
}

.d-flex {
  display: flex;
}

.align-center {
  align-items: center;
}
/* ensure placeholder and input text readable */
:deep(.v-field__input) {
  color: #fff !important;
}
:deep(.v-field__label) {
  color: rgba(255, 255, 255, 0.9) !important;
}

/* give the filled input a subtle translucent background to stand out on the video */
:deep(.v-field--variant-filled .v-field__control) {
  background: rgba(0, 0, 0, 0.35) !important;
  border-radius: 6px;
  padding-left: 0.5rem;
}
/* Adjust spacing inside the card form */
.v-card-text {
  padding: 40px 40px !important;
}

/* Reduce spacing between form fields */
.v-input {
  margin-bottom: 30px !important;
}

/* Reduce space before the button */
.v-btn.gradient-btn {
  margin-top: 15px !important;
}
/* Move entire email field down or up */
.v-text-field:first-of-type {
  margin-top: 20px !important; /* increase to move down, decrease to move up */
}
.btn-cyan {
  display: inline-block;
  padding: 0.25rem 0.8rem; /* smaller padding */
  min-width: 15px; /* ensures a minimum width */
  height: 20px; /* fixed height */
  background-color: transparent; /* transparent background */
  color: rgb(255, 255, 255);
  font-weight: 700;
  font-size: 0.6rem; /* smaller text */
  border: 1px solid white; /* added white border */
  border-radius: 0rem;
  text-align: center;
  text-decoration: none;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;
}

.btn-cyan:hover {
  background-color: rgba(255, 255, 255, 0.1); /* subtle hover effect */
  transform: translateY(-1px);
}
.adjustable-button {
  position: absolute;
  top: var(--button-top, 50%); /* Default to center vertically */
  left: var(--button-left, 50%); /* Default to center horizontally */
  transform: translate(-50%, -50%); /* Center the button exactly */
  width: 130px;
  height: 50px;
  background: transparent;
  border: 2px solid white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.1em;
  color: white;
  font-weight: 500;
  transition: 0.5s;
}

.adjustable-button:hover {
  background: #fff;
  color: #162938;
}

.adjustable-button:disabled {
  pointer-events: none;
}

.adjustable button:active {
  box-shadow: none;
  transform: translateY(0);
}

/* Responsive adjustments */
.adjustable-button {
  position: absolute;
  top: var(--button-top, 60%); /* Default to center vertically */
  left: var(--button-left, 85%); /* Default to center horizontally */
  transform: translate(-50%, -50%); /* Center the button exactly */
  width: 130px;
  height: 50px;
  background: transparent;
  border: 2px solid white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.1em;
  color: white;
  font-weight: 500;
  transition: 0.5s;
}

.adjustable-button:hover {
  background: #fff;
  color: #162938;
}

.adjustable-button:disabled {
  pointer-events: none;
}

.adjustable button:active {
  box-shadow: none;
  transform: translateY(0);
}
/* 🔥 Add fade-slide animation for the form */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
