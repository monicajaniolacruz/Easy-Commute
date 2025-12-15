<template>
  <div>
    <div class="video-container">
      <video autoplay muted loop class="background-video">
        <source src="/public/images/background.mp4" type="video/mp4" />
      </video>
    </div>

    <!-- Routes Section -->
    <div class="routes-container">
      <v-col cols="12" class="text-center">
        <h1>ROUTES FOR Multicab</h1>
      </v-col>
      <div class="routes-grid">
        <div v-for="(route, index) in routes" :key="index" class="route-card group">
          <button @click="openRouteModal(route)" class="route-button">
            <div class="route-icon group-hover:bg-black">
              <i class="mdi mdi-jeepney group-hover:text-white"></i>
            </div>
            <span>Route {{ route.id }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal for Route -->
    <div v-if="isModalOpen" class="modal">
      <div class="modal-content">
        <span class="close-btn" @click="closeRouteModal">&times;</span>
        <h2>Route {{ selectedRoute.id }} - Set Locations</h2>

        <!-- Search Input -->
        <div id="search-container">
          <select v-model="startingLocation" @change="updateMap">
            <option value="" disabled selected>Starting Location</option>
            <option
              v-for="(barangay, index) in selectedRoute.barangays"
              :key="index"
              :value="barangay.name"
            >
              {{ barangay.name || barangay }}
            </option>
          </select>

          <select v-model="endLocation" @change="updateMap">
            <option value="" disabled selected>End Location</option>
            <option
              v-for="(barangay, index) in selectedRoute.barangays"
              :key="index"
              :value="barangay.name"
            >
              {{ barangay.name || barangay }}
            </option>
          </select>
        </div>

        <!-- Map -->
        <div id="map" style="height: 70vh; margin-top: 10px"></div>

        <!-- Close Modal Button -->
        <button @click="closeRouteModal" class="close-modal-button">Close Modal</button>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/utils/supabase'
import L from 'leaflet' // Import Leaflet
import 'leaflet-routing-machine' // Import Leaflet Routing Machine
import { ref, onMounted, watch } from 'vue'

export default {
  data() {
    return {
      routes: [
        {
          id: '1',
          barangays: [
            { name: 'Dumalagan Butuan' },
            { name: 'ZCC Central Mall' },
            { name: 'Ester Luna Street' },
            { name: 'R. Tiu Building' },
            { name: 'Don Lodge' },

            { name: 'Santo Niño Shrine ' },
            { name: 'GSIS Butuan Branch' },
            { name: 'Robinsons Place Butuan' },
            { name: 'Philippine Statistics Authority' },
            { name: 'SM City Butuan' },
            { name: 'ZCC Central Mall' },
            { name: 'Amigotell (T. Calo St.' },
            // Column 2
            { name: 'Bancasi Covered Court ' },
            { name: 'Libertad Pedestrian Overpass' },
            { name: 'Timber City Academiy' },
            { name: 'Flor-Al Mansion' },
            { name: 'Police Box (ACLC)' },
            { name: 'Butuan City Sports Complex' },
            { name: 'Butuan Airport Terminal' },
            { name: 'San Vicente Memorial Park' },
          ],
        },
        {
          id: '2',
          barangays: [
            { name: 'Dumalagan' },
            { name: 'Bancasi Covered Court' },
            { name: 'Libertad Pedestrian Overpass' },
            { name: 'J.C Aquino Avenue' },
            { name: 'A. D. Curato St. Butuan' },
            { name: 'T. Sanchez St. Butuan' },
            { name: 'M. Calo St.' },
            { name: 'G. Flores St. Butuan' },
            { name: 'Rosales St. ' },
            { name: 'North Montilla Blvd. ' },
            { name: 'Langihan Public Market' },
            { name: 'Holy Redeemer Barangay Hall' },
            { name: 'Butuan City Hall' },
            { name: 'Gaisano Butuan' },
          ],
        },
        {
          id: '3',
          barangays: [
            { name: 'Dumalagan Butuan' },
            { name: 'BMC Road' },
            { name: 'Magsaysay Viaduct Bridge 1' },
            { name: 'Ampayon' },
            { name: 'J.C. Aquino Ave. Butuan' },
          ],
        },
        {
          id: '4',
          barangays: [
            { name: 'De Oro Butuan' },
            { name: 'Taligaman Butuan' },
            { name: 'Antongalon Elem. School Butuan' },
            { name: 'LTFRB Butuan' },
            { name: 'Ampayon Butuan' },
            { name: 'Caraga State University' },
            { name: 'Philippine Science High School Butuan' },
            { name: 'Tiniwisan Butuan' },
            { name: 'Butuan Medical Center' },
            { name: 'Baan Butuan' },
            // Column 2
            { name: 'M. Calo St.' },
            { name: 'G. Flores St.' },
            { name: 'North Montilla Blvd. Butuan' },
            { name: 'Andaya St. Butuan' },
            { name: 'Langihan Public Market' },
            { name: 'Butuan City Hall' },
            { name: 'Development Bank Of The Philippines' },
            { name: 'SM Butuan' },
            { name: 'R. Calo St. Butuan' },
            { name: 'T. Sanchez St. Butuan' },
            { name: 'M. Calo St. Butuan' },
            // Column 3
            { name: 'Baan Viaduct Butuan' },
            { name: 'Baan Km. 3' },
            { name: 'Tiniwisan Butuan' },
            { name: 'Ampayon' },
            { name: 'Antongalon Butuan' },
            { name: 'Taligaman Butuan' },
          ],
        },
        {
          id: '5',
          barangays: [
            { name: 'Sto. Nino Diocesan Shrine ' },
            { name: 'Los Angeles Butuan City' },
            { name: 'Sumilihon Butuan City' },
            { name: 'Taguibo' },
            { name: 'Ampayon' },
            { name: 'Philippine Science High School Butuan' },
            { name: 'Tiniwisan' },
            { name: 'Baan Butuan City' },
            { name: 'J.C. Aquino Ave.' },
            { name: 'J. Rosales St. ' },
            { name: 'Butuan City Hall' },
            { name: 'J. Satorre St.' },
            { name: 'Jeels Masagana Farm' },
            { name: 'Salvador Calo St.' },
            { name: 'Langihan Public Market' },
            { name: 'Magsaysay St. Butuan' },
            { name: 'Andaya St.' },
            { name: 'North Montilla Blvd.' },
            { name: "McDonald's Butuan Downtown" },
            { name: 'R. Calo St.' },
            { name: 'T. Sanchez St.' },
            { name: 'M. Calo St.' },
            { name: 'Baan Viaduct' },
            { name: 'Baan Km. 3' },
            { name: 'Ampayon' },
            { name: 'Taguibo' },
            { name: 'Sumilihon' },
          ],
        },
        {
          id: '6',
          barangays: [{ name: 'Agusan Del Norte Provincial Capitol' }, { name: 'Maguinda' }],
        },
        {
          id: '7',
          barangays: [
            { name: 'Amparo Butuan' },
            { name: 'North Montilla Boulevard' },
            { name: 'Holy Redeemer Parish Church' },
            { name: 'Butuan City Hall' },
            { name: 'Gaisano Butuan' },
            { name: 'South Montilla Boulevard' },
            { name: 'San Vicente Butuan City' },
            { name: 'Mandacpan Butuan City' },
            { name: 'Bit-os' },
            { name: 'Vice versa' },
          ],
        },
      ],
      isModalOpen: false, // Modal state
      selectedRoute: null, // Selected route
      startingLocation: '',
      endLocation: '',
      map: null,
      markers: [], // Array to store markers
      routeControl: null, // Routing control instance
    }
  },
  methods: {
    async getCoordinatesFromGeocodingAPI(location) {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&addressdetails=1`
      const response = await fetch(url)
      const data = await response.json()
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat)
        const lon = parseFloat(data[0].lon)
        return { lat, lon }
      } else {
        throw new Error(`Coordinates not found for location: ${location}`)
      }
    },

    async useGeolocation() {
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(resolve, reject)
        } else {
          reject(new Error('Geolocation is not supported by this browser.'))
        }
      })
    },

    async updateMap() {
      // Clear previous markers and routing
      this.markers.forEach((marker) => this.map.removeLayer(marker))
      this.markers = []
      if (this.routeControl) {
        this.map.removeControl(this.routeControl)
      }

      const locations = []

      // Add current location marker if geolocation is available
      try {
        const position = await this.useGeolocation()
        const currentLocation = L.latLng(position.coords.latitude, position.coords.longitude)
        const startMarker = L.marker(currentLocation).bindPopup(
          'Starting Location: Your Current Location',
        )
        this.markers.push(startMarker)
        locations.push(currentLocation)
        startMarker.addTo(this.map)
      } catch (error) {
        console.error('Error getting geolocation:', error)
      }

      // Get coordinates for the starting location
      if (this.startingLocation) {
        try {
          const startCoords = await this.getCoordinatesFromGeocodingAPI(this.startingLocation)
          const startLatLng = L.latLng(startCoords.lat, startCoords.lon)
          const startMarker = L.marker(startLatLng).bindPopup(
            `Starting Location: ${this.startingLocation}`,
          )
          this.markers.push(startMarker)
          locations.push(startLatLng)
          startMarker.addTo(this.map)
        } catch (error) {
          console.error('Error fetching coordinates for starting location:', error)
        }
      }

      // Get coordinates for the end location
      if (this.endLocation) {
        try {
          const endCoords = await this.getCoordinatesFromGeocodingAPI(this.endLocation)
          const endLatLng = L.latLng(endCoords.lat, endCoords.lon)
          const endMarker = L.marker(endLatLng).bindPopup(`End Location: ${this.endLocation}`)
          this.markers.push(endMarker)
          locations.push(endLatLng)
          endMarker.addTo(this.map)
        } catch (error) {
          console.error('Error fetching coordinates for end location:', error)
        }
      }

      // If both locations are selected, draw a route
      if (locations.length === 2) {
        this.routeControl = L.Routing.control({
          waypoints: locations,
        }).addTo(this.map)

        const routingContainer = document.querySelector('.leaflet-routing-container')
        if (routingContainer) {
          routingContainer.style.width = '200px' // Adjust the width
          routingContainer.style.fontSize = '12px' // Adjust font size
        }
      }
    },
    openRouteModal(route) {
      this.selectedRoute = route
      this.isModalOpen = true
      this.showRoute() // Corrected: Ensure showRoute is called here
    },

    async showRoute() {
      // Ensure the locations array is properly populated with coordinates of the barangays
      const locations = []

      // Process each barangay one at a time
      for (const barangay of this.selectedRoute.barangays) {
        try {
          const coords = await this.getCoordinatesFromGeocodingAPI(barangay.name)

          // If coordinates are found, add to the locations
          if (coords) {
            const latLng = L.latLng(coords.lat, coords.lon)
            locations.push(latLng)
          } else {
            console.error(`Coordinates not found for barangay: ${barangay.name}`)
            continue // Skip to the next barangay if this one fails
          }

          // Only create the route when you have at least 5 coordinates
          if (locations.length >= 5 && !this.routeControl) {
            // Create and add the routing control to the map
            this.routeControl = L.Routing.control({
              waypoints: locations,
              routeWhileDragging: true, // Enable route dragging
            }).addTo(this.map)

            // Hide route instructions immediately after the route is found
            this.routeControl.on('routesfound', () => {
              this.routeControl.getContainer().style.display = 'none'
            })

            // Break out of the loop once the route control is created
            break
          }
        } catch (error) {
          console.error(`Error fetching coordinates for barangay: ${barangay.name}`, error)
          continue // Continue searching for the next barangay if an error occurs
        }
      }

      // Optional: Check if no valid route was found after processing all barangays
      if (locations.length < 5) {
        console.log('Not enough valid coordinates to create a route.')
      }
    },
    closeRouteModal() {
      this.isModalOpen = false
      // Reset locations when modal is closed
      this.startingLocation = ''
      this.endLocation = ''
      this.resetRoute()
      if (this.map) {
        this.map.remove()
        this.map = null
      }
    },
    resetRoute() {
      if (this.routeControl) {
        this.map.removeControl(this.routeControl) // Remove the route from the map
        this.routeControl = null // Clear the route control reference
      }

      // Optionally, clear any other markers or data
      // Example: if you have a markerLayer for other markers
      if (this.markerLayer) {
        this.markerLayer.clearLayers() // Clear any other markers
      }

      // Clear the locations array
      this.locations = []
    },

    async saveRoute(startingLocation, endLocation) {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) {
          console.error('Error retrieving user:', userError.message)
          return
        }

        if (!user || !user.id) {
          console.error('User ID is missing, cannot save route data.')
          return
        }

        const userId = user.id

        const { data: routeData, error: routeError } = await supabase
          .from('routes')
          .insert([
            {
              RoutNTricC: this.selectedRoute.id,
              origin: startingLocation,
              destination: endLocation,
              vehicle_type: 'multicab',
              v_id: userId,
            },
          ])
          .select()

        if (routeError) {
          console.error('Error saving route:', routeError)
          return
        }

        const routeId = routeData[0].id

        const { data: tripData, error: tripError } = await supabase
          .from('trips')
          .insert([
            {
              route_id: routeId,
              date_of_trip: new Date().toISOString(),
            },
          ])
          .select()

        if (tripError) {
          console.error('Error saving trip:', tripError)
          return
        }

        alert('Trip saved successfully with route_id:', routeId)
      } catch (error) {
        console.error('Error saving route and trip:', error)
      }
    },
  },

  watch: {
    isModalOpen(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          if (!this.map) {
            this.map = L.map('map').setView([8.9492, 125.5435], 13)
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 19,
              attribution:
                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }).addTo(this.map)
          } else {
            this.map.invalidateSize()
          }

          this.updateMap()
        })
      }
    },
  },
}
</script>

<style scoped>
/* Modal Styles */

@media (max-width: 600px) {
  .leaflet-routing-container {
    width: 150px;
    font-size: 5px;
  }
}

.background-video {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: -1;
  /* Ensure the video stays in the background */
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

.save-button {
  background-color: #4caf50; /* Green */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}

.save-button:hover {
  background-color: #45a049;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 251, 251, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 600px;
  box-shadow: 0px 4px 6px rgba(240, 238, 238, 0.91);
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 30px;
  cursor: pointer;
}

.close-modal-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.close-modal-button:hover {
  background-color: #d32f2f;
}

/* Search Container */
#search-container {
  display: flex;
  gap: 10px;
  padding: 10px;
  background: white;
  z-index: 1000;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(255, 254, 254, 0.1);
}

#search-container select {
  flex: 1;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.routes-container,
.text-center {
  position: relative;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 20px;
}

.routes-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.route-card {
  background-color: #1a1a1a;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s;
}

.route-card:hover {
  transform: scale(1.05);
  background-color: #00bfff;
  color: #000;
}

#map {
  height: 70vh;
  margin-top: 10px;
  width: 100%;
}

@media (max-width: 768px) {
  .routes-grid {
    grid-template-columns: 1fr; /* Stack cards vertically on smaller screens */
  }

  .modal-content {
    width: 90%; /* Increase the width on smaller screens */
    padding: 15px; /* Adjust padding */
    max-height: 50vh; /* Smaller max height for medium screens */
    overflow-y: auto; /* Enable scrolling if content overflows */
  }

  .save-button,
  .close-modal-button {
    font-size: 14px; /* Make buttons smaller on mobile */
    padding: 8px 16px;
  }

  #search-container {
    flex-direction: column; /* Stack search inputs on smaller screens */
    gap: 15px;
  }

  #search-container select {
    font-size: 12px; /* Smaller font size for mobile */
    padding: 6px;
  }

  .route-card {
    padding: 15px; /* Adjust padding for mobile */
  }

  #map {
    height: 40vh; /* Adjust map size for mobile */
  }
}

@media (max-width: 480px) {
  .save-button,
  .close-modal-button {
    font-size: 12px;
    padding: 6px 12px; /* Even smaller buttons on very small screens */
  }

  .modal-content {
    width: 95%; /* Allow modal content to take more space on very small screens */
    padding: 10px;
    max-height: 90vh; /* Further reduce max height on very small screens */
    overflow-y: auto; /* Enable scrolling if content overflows */
  }

  .route-card {
    padding: 12px; /* Further reduce padding on small screens */
  }

  #map {
    height: 30vh; /* Adjust map size for very small screens */
  }
}
</style>
