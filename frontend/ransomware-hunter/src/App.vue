<template>
  <div id="app" class="magicpattern">
    <!-- If the user is logged in, show the Navbar and main content; otherwise, show the Login component -->
    <div v-if="isLoggedIn">
      <Navbar /> <!-- Import and display the Navbar component -->
      <main class="content">
        <router-view></router-view> <!-- Display routed content based on the current route -->
      </main>
    </div>

    <!-- If the user is not logged in, show the Login component -->
    <div v-else>
      <Login @loginSuccess="handleLoginSuccess" /> <!-- Listen for login success event from Login component -->
    </div>

    <!-- Footer with copyright and GitHub repository link -->
    <footer>
      <p>Developed by <strong>2024 UOttawa Capstone Group 18</strong></p>
      <p>Link to GitHub repository: <a id="repo-link" target="_blank" href="https://github.com/fredjkhar/beacons-hunting"><strong>threat-hunting</strong></a></p>
    </footer>
  </div>
</template>

<script>
// Import necessary components for Navbar and Login
import Navbar from './components/Navbar.vue';
import Login from './components/Login.vue';

export default {
  components: {
    Navbar, // Register the Navbar component
    Login,  // Register the Login component
  },
  data() {
    return {
      // Check if the user is logged in based on sessionStorage value
      isLoggedIn: sessionStorage.getItem("isLoggedIn") === "true",
    };
  },
  methods: {
    // Method to handle login success and update the logged-in status
    handleLoginSuccess() {
      this.isLoggedIn = true; // Set the logged-in status to true
      sessionStorage.setItem("isLoggedIn", "true"); // Store the login state in sessionStorage
    },
  },
};
</script>

<style>
/* Reset and global styles */
html,
body {
  padding: 0 !important; /* Remove any default padding */
  margin: 0; /* Remove any default margin */
  font-family: 'Poppins', sans-serif; /* Set the global font */
  color: #333; /* Default text color */
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Ensure full height of the page is used */
}

/* Magic pattern background styling */
.magicpattern {
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  background-size: cover; /* Cover the entire background area */
  background-position: center center; /* Center the background image */
  background-repeat: repeat; /* Repeat the background */
  background-image: url("data:image/svg+xml;utf8,%3Csvg width=%222000%22 height=%221400%22 xmlns=%22http:%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cdefs%3E%3ClinearGradient id=%22a%22 gradientTransform=%22rotate(90)%22%3E%3Cstop offset=%225%25%22 stop-color=%22%23fff%22%2F%3E%3Cstop offset=%2295%25%22 stop-color=%22%23fff%22%2F%3E%3C%2FlinearGradient%3E%3ClinearGradient id=%22b%22 gradientTransform=%22rotate(90)%22%3E%3Cstop offset=%225%25%22 stop-color=%22%23efefef%22%2F%3E%3Cstop offset=%2295%25%22 stop-color=%22%23f3f3f3%22%2F%3E%3C%2FlinearGradient%3E%3ClinearGradient id=%22c%22 gradientTransform=%22rotate(90)%22%3E%3Cstop offset=%225%25%22 stop-color=%22%23e5e5e5%22%2F%3E%3Cstop offset=%2295%25%22 stop-color=%22%23ebebeb%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Cpath fill=%22%23e1e1e1%22 d=%22M0 0h2000v1400H0z%22%2F%3E%3Cpath d=%22M0 350c42.983 15.56 85.965 31.12 137 13s110.121-69.918 167-87c56.879-17.082 111.55.553 162 17s96.68 31.707 145 34c48.32 2.293 98.727-8.382 147-3 48.273 5.382 94.41 26.82 150 31s120.635-8.898 172-2c51.365 6.898 89.052 33.77 141 24 51.948-9.77 118.159-56.185 176-68 57.841-11.815 107.314 10.97 156 13 48.686 2.03 96.586-16.693 140-26 43.414-9.307 82.342-9.198 140 20s134.045 87.485 165 98c30.955 10.515 16.477-26.743 42-64l-40 1050H0Z%22 fill=%22url(%23a)%22%2F%3E%3Cpath d=%22M0 700c41.506-30.036 83.013-60.071 138-40 54.987 20.071 123.456 90.249 178 100 54.544 9.751 95.163-40.923 139-64 43.837-23.077 90.891-18.555 146-26 55.109-7.445 118.272-26.855 176-27 57.728-.145 110.02 18.975 160 28 49.98 9.025 97.647 7.956 146 21 48.353 13.044 97.39 40.201 149 62s105.792 38.24 157 3 99.443-122.158 151-122c51.557.158 106.438 87.393 156 98s93.805-55.413 151-65c57.195-9.587 127.341 37.261 155 52 27.659 14.739 12.83-2.63 38-20l-40 700H0Z%22 fill=%22url(%23b)%22%2F%3E%3Cpath d=%22M0 1050c52.814-16.792 105.628-33.584 157-51 51.372-17.416 101.301-35.456 154-25 52.699 10.456 108.166 49.408 160 77s100.034 43.824 151 32c50.966-11.824 104.696-51.705 153-42 48.304 9.705 91.18 68.997 137 72 45.82 3.003 94.585-50.284 151-81 56.415-30.716 120.48-38.862 175-33 54.52 5.862 99.492 25.733 147 58 47.508 32.267 97.55 76.93 149 57 51.45-19.93 104.306-104.456 157-102 52.694 2.456 105.225 91.892 160 111 54.775 19.108 111.793-32.112 137-56 25.207-23.888 18.604-20.444 52-17l-40 350H0Z%22 fill=%22url(%23c)%22%2F%3E%3C%2Fsvg%3E");
}

/* Overall layout */
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Ensure the app takes the full height of the viewport */
}

/* Main content area */
main.content {
  flex: 1; /* Allows content to expand and fill the available space */
  padding: 20px; /* Add padding around the content */
  display: flex;
  justify-content: center; /* Center the content horizontally */
  align-items: center; /* Center the content vertically */
  justify-content: space-between; /* Spread content evenly */
}

/* Footer styling */
footer {
  text-align: center; /* Center the text in the footer */
  padding: 15px; /* Add padding to the footer */
  background: #333; /* Dark background color */
  font-size: 0.9rem;
  color: #aaa;
  box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.2);
  /* Add a top shadow for better separation */
  margin-top: auto;
  /* Push footer to the bottom if content is short */
}

/* Footer link highlight */
footer strong {
  color: #f2f2f2;
}

#repo-link {
  color: white;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  footer {
    font-size: 0.8rem;
  }

  main.content {
    padding: 10px;
  }
}
</style>
