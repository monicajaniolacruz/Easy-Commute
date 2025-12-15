<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/utils/supabase'
import AppLayout from '@/components/AppLayout.vue'

/* -----------------------------------------
  STATE
----------------------------------------- */
const profile = ref({
  id: '',
  username: '',
  fullname: '',
  phone_number: '',
  profile_image: '',
  email: '',
})

const loading = ref(false)
const editMode = ref(false)
const formSuccess = ref('')
const formError = ref('')
const fileInput = ref(null)

// GOOGLE LOGIN FLAG
const isGoogleLogin = ref(false)

// Change password fields (if needed later)
const passwordData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// Visibility toggles for eye icons
const showPassword = ref({
  current: false,
  new: false,
  confirm: false,
})

const passwordSuccess = ref('')
const passwordError = ref('')

/* -----------------------------------------
  COMPUTED INITIALS
----------------------------------------- */
const initials = computed(() => {
  let full = (profile.value.fullname || '').trim()

  if (!full) return ''

  // Clean name: remove multiple spaces and non-letter characters from initials
  const parts = full.replace(/\s+/g, ' ').split(' ').filter(Boolean)

  if (parts.length === 0) return ''

  // Take first letter of first & last word
  const first = parts[0][0]
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''

  // Only letters
  const safe = (char) => (/[A-Za-z]/.test(char) ? char.toUpperCase() : '')

  const i1 = safe(first)
  const i2 = safe(last)

  return (i1 + i2).trim()
})

/* -----------------------------------------
  LOAD PROFILE
----------------------------------------- */
const normalizeName = (name) =>
  (name || '')
    .toLowerCase()
    .replace(/\s+/g, ' ') // remove extra spaces
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase()) // capitalize first letter of each word

const getProfile = async () => {
  loading.value = true
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      loading.value = false
      return
    }

    isGoogleLogin.value = user?.app_metadata?.provider === 'google'

    const meta = user.user_metadata || {}

    const metaFullName =
      meta.full_name ||
      meta.name ||
      (meta.given_name && meta.family_name ? `${meta.given_name} ${meta.family_name}`.trim() : '')

    const metaAvatar = meta.avatar_url || meta.picture || ''

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    if (error) throw error

    if (!data) {
      const fallbackName =
        metaFullName || ((user.email || '').split('@')[0] || '').replace(/[._\-]/g, ' ')

      const cleanedName = normalizeName(fallbackName)

      const insertPayload = {
        id: user.id,
        email: user.email,
        fullname: cleanedName,
        profile_image: null,
        created_at: new Date(),
        updated_at: new Date(),
      }

      const { error: insertError } = await supabase.from('profiles').insert(insertPayload)
      if (insertError) throw insertError

      profile.value = { ...profile.value, ...insertPayload }
    } else {
      profile.value = {
        ...profile.value,
        ...data,
        fullname: normalizeName(data.fullname || metaFullName),
        email: user.email || data.email || '',
      }
    }
  } catch (err) {
    formError.value = err?.message || String(err)
  } finally {
    loading.value = false
  }
}

/* -----------------------------------------
  UPDATE PROFILE
----------------------------------------- */
const updateProfile = async () => {
  try {
    loading.value = true

    // Clean full name: sentence case, one space
    const cleanedName = (profile.value.fullname || '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase())

    // Update local profile immediately
    profile.value.fullname = cleanedName

    const { error } = await supabase
      .from('profiles')
      .update({
        fullname: cleanedName,
        phone_number: profile.value.phone_number,
        updated_at: new Date(),
      })
      .eq('id', profile.value.id)

    if (error) throw error

    await getProfile() // refresh the rest of the profile
    formSuccess.value = 'Profile updated successfully!'
    editMode.value = false
  } catch (err) {
    formError.value = err?.message || String(err)
  } finally {
    loading.value = false
  }
}

const triggerFileInput = () => {
  if (!isGoogleLogin.value) fileInput.value?.click()
}

onMounted(() => getProfile())
</script>

<template>
  <AppLayout>
    <div class="video-container">
      <video autoplay muted loop class="background-video">
        <source src="/images/background.mp4" type="video/mp4" />
      </video>
    </div>

    <v-container class="profile-container" fluid>
      <v-row justify="center">
        <v-col cols="12" md="8" lg="7">
          <v-card class="profile-card pa-6" elevation="2">
            <v-row class="align-center mb-6">
              <v-col cols="auto">
                <v-avatar
                  size="90"
                  :class="!isGoogleLogin ? 'cursor-pointer hover:opacity-80' : ''"
                  @click="triggerFileInput"
                >
                  <template v-if="isGoogleLogin || !profile.profile_image">
                    <v-avatar size="90" color="primary">
                      <span class="text-h4 font-weight-bold text-white">
                        {{ initials || '?' }}
                      </span>
                    </v-avatar>
                  </template>

                  <template v-else>
                    <v-img :src="profile.profile_image" alt="Profile Picture" cover />
                  </template>
                </v-avatar>

                <input
                  v-if="!isGoogleLogin"
                  type="file"
                  ref="fileInput"
                  accept="image/*"
                  class="d-none"
                  @change="handleImageUpload"
                />
              </v-col>

              <v-col>
                <h3 class="font-weight-bold">
                  {{ profile.fullname || 'Your Name' }}
                </h3>
                <p class="text-grey">{{ profile.email }}</p>
              </v-col>

              <v-col cols="auto">
                <v-btn color="primary" @click="editMode = !editMode">
                  {{ editMode ? 'Cancel' : 'Edit' }}
                </v-btn>
              </v-col>
            </v-row>

            <v-divider />

            <v-form class="mt-6">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="profile.fullname"
                    label="Full Name"
                    :readonly="!editMode"
                    variant="outlined"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="profile.phone_number"
                    label="Phone Number"
                    :readonly="!editMode"
                    variant="outlined"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field v-model="profile.email" label="Email" readonly variant="outlined" />
                </v-col>
              </v-row>

              <div class="text-center mt-4" v-if="editMode">
                <v-btn color="success" class="mr-3" :loading="loading" @click="updateProfile">
                  Save Changes
                </v-btn>
                <v-btn color="grey" variant="tonal" @click="editMode = false">Cancel</v-btn>
              </div>

              <v-alert v-if="formSuccess" type="success" class="mt-4" variant="tonal">
                {{ formSuccess }}
              </v-alert>
              <v-alert v-if="formError" type="error" class="mt-4" variant="tonal">
                {{ formError }}
              </v-alert>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </AppLayout>
</template>

<style scoped>
.background-video {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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

.profile-container {
  background-color: transparent;
  min-height: 100vh;
  padding-top: 100px;
}

.profile-card {
  border-radius: 16px;
  background-color: #17172a;
  color: #f5f5f5;
  backdrop-filter: blur(8px);
}

.v-text-field {
  --v-field-label-color: #cfcfcf !important;
  --v-field-input-color: #ffffff !important;
  --v-field-border-color: #3a3a5c !important;
}

.text-grey {
  color: #b0b0b0 !important;
}

.v-btn {
  font-weight: 600;
}

.v-alert {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}
</style>
