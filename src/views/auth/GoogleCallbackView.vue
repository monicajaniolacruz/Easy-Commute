<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'

const router = useRouter()

onMounted(async () => {
  console.log('=== Google Callback Started ===')

  // Exchange ?code=... for a real session
  const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href)

  console.log('exchange result:', data)
  console.log('exchange error:', error)

  // ---- IMPORTANT ----
  // Wait until Supabase stores session internally
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
      console.log('Session detected → Redirecting...')
      router.replace('/home')
    }
  })

  // Fallback (if nothing happens after 3 seconds)
  setTimeout(async () => {
    const { data } = await supabase.auth.getSession()
    if (data.session) {
      router.replace('/home')
    } else {
      router.replace('/')
    }
  }, 3000)
})
</script>

<template>
  <div
    style="
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      font-size: 1.5rem;
      font-weight: bold;
      color: white;
    "
  >
    Signing you in...
  </div>
</template>
