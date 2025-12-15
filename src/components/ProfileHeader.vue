<script setup>
import { supabase, formActionDefault } from '@/utils/supabase'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'

const router = useRouter()

// User state
const userData = ref({
  initials: '',
  email: '',
  fullname: '',
})

const formAction = ref({
  ...formActionDefault,
})

// Logout
const onLogout = async () => {
  formAction.value = { ...formActionDefault, formProcess: true }

  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Error during logout:', error)
    return
  }

  formAction.value.formProcess = false
  router.replace('/')
}

// Helper to generate initials from first and last name or full name
const getAvatarText = (firstName = '', lastName = '', fullNameFallback = '') => {
  firstName = (firstName || '').trim()
  lastName = (lastName || '').trim()

  if (firstName && lastName) return (firstName[0] + lastName[0]).toUpperCase()
  if (firstName) return firstName.slice(0, 2).toUpperCase()
  if (lastName) return lastName.slice(0, 2).toUpperCase()

  // fallback: use fullName
  if (fullNameFallback) {
    const parts = fullNameFallback.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  return ''
}

// Load user (supports Google login properly)
const getUser = async () => {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) return

  const user = data.user
  const meta = user.user_metadata || {}

  // Extract first and last name
  const firstName = meta.given_name || meta.first_name || ''
  const lastName = meta.family_name || meta.last_name || ''

  // Fallback if both missing
  let fullName = ''
  if (firstName || lastName) {
    fullName = `${firstName} ${lastName}`.trim()
  } else if (meta.full_name) {
    fullName = meta.full_name
  } else if (meta.name) {
    fullName = meta.name
  } else {
    fullName = user.email?.split('@')[0] || ''
  }

  userData.value.fullname = fullName
  userData.value.email = user.email || ''
  // Pass fullName as fallback so initials always appear
  userData.value.initials = getAvatarText(firstName, lastName, fullName)

  console.log('FULL NAME:', fullName)
  console.log('INITIALS:', userData.value.initials)
}

onMounted(() => {
  getUser()
})
</script>

<template>
  <v-menu min-width="100px" rounded location="bottom center" transition="fade-transition">
    <template #activator="{ props }">
      <v-btn icon v-bind="props" class="avatar-btn">
        <v-avatar color="blue" size="40" class="avatar-icon">
          <span class="text-h6">{{ userData.initials || '?' }}</span>
        </v-avatar>
      </v-btn>
    </template>

    <v-card class="custom-card mt-1">
      <v-card-text>
        <v-list class="center-list">
          <v-list-item
            :title="userData.fullname || 'User'"
            :subtitle="userData.email"
            class="dropdown-item"
          >
            <template #prepend>
              <v-avatar color="blue" size="40" class="avatar-icon">
                <span class="text-h6">{{ userData.initials || '?' }}</span>
              </v-avatar>
            </template>
          </v-list-item>
        </v-list>

        <v-divider class="my-3 divider-custom" />

        <v-btn prepend-icon="mdi-cog" variant="plain" to="/profile" class="dropdown-item">
          Account Settings
        </v-btn>

        <v-divider class="my-3 divider-custom" />

        <v-btn
          prepend-icon="mdi-logout"
          variant="plain"
          @click="onLogout"
          :loading="formAction.formProcess"
          :disabled="formAction.formProcess"
          class="dropdown-item"
        >
          Logout
        </v-btn>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<style scoped>
:deep(.custom-card),
:deep(.custom-card .v-card),
:deep(.custom-card .v-card-text),
:deep(.custom-card .v-list),
:deep(.custom-card .v-list-item),
:deep(.custom-card .v-list-item__content) {
  background-color: #000 !important;
  color: #fff !important;
  text-align: center !important;
}

:deep(.avatar-icon) {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  background-color: #0f5b75 !important;
  border-radius: 50% !important;
  width: 40px !important;
  height: 40px !important;
}

:deep(.avatar-icon span) {
  font-size: 20px !important;
  color: #fff !important;
}

:deep(.center-list) {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  flex-direction: column !important;
  text-align: center !important;
}

:deep(.dropdown-item),
:deep(.dropdown-item .v-btn__content),
:deep(.v-list-item__title),
:deep(.v-list-item__subtitle) {
  color: #fff !important;
  text-align: center !important;
  font-weight: 500 !important;
}

:deep(.dropdown-item:hover) {
  background-color: rgb(6, 62, 122) !important;
  color: #fff !important;
}

:deep(.divider-custom) {
  border-color: rgba(255, 255, 255, 0.2) !important;
}

:deep(.avatar-btn) {
  background: transparent !important;
}
</style>
