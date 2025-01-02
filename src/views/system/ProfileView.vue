<template>
  <AppLayout>
    <!-- Preloader Spinner -->
    <EpicSpinners v-if="isLoading" :color="'#0000ff'" />

    <!-- Main Content (Visible after loading) -->
    <div v-if="!isLoading">
      <!-- Background Video -->
      <div class="video-container">
        <video autoplay muted loop class="background-video">
          <source src="/public/images/background.mp4" type="video/mp4" />
        </video>
      </div>

      <!-- Edit Profile Form -->
      <div class="edit-profile-container">
        <form @submit.prevent="saveProfile" class="form-container">
          <!-- Main Form Section -->
          <div class="main-form">
            <h3>Edit Profile</h3>
            <div class="form-grid">
              <div class="form-group">
                <label>Profile Picture</label>
                <input type="file" @change="handleImageUpload" />
              </div>
              <div class="form-group">
                <label>Username</label>
                <input v-model="form.username" type="text" placeholder="Username" />
              </div>
              <div class="form-group">
                <label>First Name</label>
                <input v-model="form.firstName" type="text" placeholder="First Name" />
              </div>
              <div class="form-group">
                <label>Last Name</label>
                <input v-model="form.lastName" type="text" placeholder="Last Name" />
              </div>
            </div>
            <button type="button" class="toggle-btn" @click="toggleFields">
              {{ showAdditionalFields ? 'Hide Additional Fields' : 'Show Additional Fields' }}
            </button>
          </div>

          <!-- Additional Section with Transition -->
          <transition name="fade-slide">
            <div v-if="showAdditionalFields" class="additional-section">
              <div class="form-grid">
                <div class="form-group">
                  <label>Address</label>
                  <input v-model="form.address" type="text" placeholder="Address" />
                </div>
                <div class="form-group">
                  <label>Phone Number</label>
                  <input v-model="form.phoneNumber" type="text" placeholder="Phone Number" />
                </div>
                <div class="form-group full-width">
                  <label>About Me</label>
                  <textarea v-model="form.about" placeholder="About Me"></textarea>
                </div>
              </div>
              <button type="submit" class="save-btn">Save</button>
            </div>
          </transition>
        </form>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import EpicSpinners from '@/components/EpicSpinners.vue'
import { supabase } from '../../supabaseClient'

const form = ref({
  profileImage: null, // Store image file
  username: '',
  firstName: '',
  lastName: '',
  address: '',
  phoneNumber: '',
  about: '',
})

const showAdditionalFields = ref(false)

const toggleFields = () => {
  showAdditionalFields.value = !showAdditionalFields.value
}

// Handle file selection and update form.profileImage
const handleImageUpload = (event) => {
  const file = event.target.files[0] // Get the selected file
  if (file) {
    form.value.profileImage = file // Set the file to the form object
  }
}

const saveProfile = async () => {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error('Error fetching user:', userError?.message || 'User not authenticated')
      alert('You need to be logged in to save a profile.')
      return
    }

    // Prepare profile data object with form data
    let profileData = {
      username: form.value.username,
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      address: form.value.address,
      phoneNumber: form.value.phoneNumber,
      about: form.value.about,
      v_id: user.id, // Link to the authenticated user
    }

    // Upload image if provided
    if (form.value.profileImage) {
      console.log('Uploading image...')
      const imageFile = form.value.profileImage // The file from the form
      const timestamp = Date.now() // Adding timestamp to make the file path unique
      const filePath = `profiles/${user.id}/${timestamp}-${imageFile.name}` // Path with unique name

      // Upload the file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile-images') // Bucket name
        .upload(filePath, imageFile)

      if (uploadError) {
        console.error('Image upload failed:', uploadError.message)
        alert('Failed to upload profile image. Please try again.')
        return
      }

      // Get the public URL of the uploaded image
      const { data: publicUrlData } = await supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath)

      if (!publicUrlData?.publicUrl) {
        console.error('Failed to get public URL for uploaded image.')
        alert('Image upload succeeded, but could not retrieve its URL.')
        return
      }

      console.log('Image uploaded successfully:', publicUrlData.publicUrl)
      profileData.profile_image = publicUrlData.publicUrl // Assign the URL to profileData
    }

    // Insert or update profile data in the database
    console.log('Saving profile data:', profileData)
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profileData, { onConflict: ['id'] }) // Use `upsert` to insert or update by user_id

    if (error) {
      console.error('Error saving profile:', error.message)
      alert('Failed to save profile. Please try again.')
    } else {
      console.log('Profile saved successfully:', data)
      alert('Profile saved successfully!')
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    alert('An unexpected error occurred. Please try again.')
  }
}

const isLoading = ref(true)

onMounted(() => {
  // Simulate loading
  setTimeout(() => {
    isLoading.value = false
  }, 3000) // Adjust the duration as needed
})
</script>

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

/* Edit Profile Container */
.edit-profile-container {
  margin-top: 10vb;
  display: flex;
  padding: 20px;
  justify-content: center;
  align-items: flex-start;
  gap: 20px;
  font-family: Arial, sans-serif;
  color: #fff;
  z-index: 1;
  position: relative;
}

/* Form Layout */
.form-container {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.main-form {
  flex: 1;
  background: #17172a;
  padding: 30px;
  border-radius: 8px;
  max-width: 500px;
}

.additional-section {
  flex: 0 0 300px;
  background: #232333;
  padding: 20px;
  border-radius: 8px;
  color: #fff;
}

/* Grid Layout for Fields */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: span 2; /* Full row */
}

/* Input and Textarea Styling */
.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: #232333;
  color: #fff;
  font-size: 1rem;
}

.form-group textarea {
  resize: none;
  height: 100px;
}

/* Toggle Button */
.toggle-btn {
  background-color: #007bb5;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}

.toggle-btn:hover {
  background-color: #005f8d;
}

/* Save Button */
.save-btn {
  background-color: #007bb5;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 1.1em;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
}

.save-btn:hover {
  background-color: #005f8d;
}

/* Transition Effects */
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
/* Responsive Design */
@media (max-width: 1024px) {
  /* Tablet and smaller devices */
  .form-container {
    flex-direction: column; /* Stack the form sections vertically */
  }

  .main-form {
    width: 100%;
    max-width: 100%;
  }

  .additional-section {
    width: 100%;
    max-width: 100%;
    margin-top: 20px;
  }

  .form-grid {
    grid-template-columns: 1fr; /* Single column layout */
  }
}

@media (max-width: 500px) {
  /* Mobile devices */
  .edit-profile-container {
    padding: 15px;
  }

  .main-form {
    padding: 20px;
  }

  .form-grid {
    grid-template-columns: 1fr; /* Single column layout */
  }

  .toggle-btn,
  .save-btn {
    width: 100%;
  }
}
</style>
