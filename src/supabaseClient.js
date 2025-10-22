// supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rybbjoqqeasumfdbgscc.supabase.co'
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5YmJqb3FxZWFzdW1mZGJnc2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5Mzc1MjgsImV4cCI6MjA3NjUxMzUyOH0.3xa5uyik0syA6HwhETVMAs4s8wFGCzKkkHJRhznw4Us'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Success Notification
function successNotification(message, seconds = 0) {
  document.querySelector('.alert-success').classList.remove('d-none')
  document.querySelector('.alert-success').classList.add('d-block')
  document.querySelector('.alert-success').innerHTML = message

  if (seconds != 0) {
    setTimeout(function () {
      document.querySelector('.alert-success').classList.remove('d-block')
      document.querySelector('.alert-success').classList.add('d-none')
    }, seconds * 1000)
  }
}

// Error Notification
function errorNotification(message, seconds = 0) {
  document.querySelector('.alert-danger').classList.remove('d-none')
  document.querySelector('.alert-danger').classList.add('d-block')
  document.querySelector('.alert-danger').innerHTML = message

  if (seconds != 0) {
    setTimeout(function () {
      document.querySelector('.alert-danger').classList.remove('d-block')
      document.querySelector('.alert-danger').classList.add('d-none')
    }, seconds * 1000)
  }
}

export { supabase, successNotification, errorNotification }
