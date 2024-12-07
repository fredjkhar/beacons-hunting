<template>
  <div>
    <!-- Navigation bar with a background color and centered title -->
    <nav>
      <div
        style="background-color: #333; color: #f2f2f2; padding: 14px 16px; font-weight: bold; text-decoration: none; font-size: 30px; text-align: center;">
        <h1>Beacon Hunter</h1> <!-- Main title of the app -->
      </div>
    </nav>
    
    <!-- Login layout with instructions and input fields for username and password -->
    <div class="login-layout">
      <strong class="message-layout">Generate beacons hunting reports for your organization. </strong>
      <strong class="message-layout"> Please request access by sending an email to fkhar048@uottawa.ca</strong>
      
      <h3>Log in to start generating reports</h3> <!-- Login instructions -->
      <input id="username" type="text" v-model="username" placeholder="Username" /> <!-- Username input -->
      <input id="password" type="password" v-model="password" placeholder="Password" /> <!-- Password input -->
  
      <button @click="login">Log In</button> <!-- Button that triggers the login method -->
  
      <!-- Error message display if login fails -->
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p> 
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // Define initial data properties for username, password, and error message
      username: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    // Method for handling login logic
    login() {
      // Example validation logic for username and password
      if (this.username === "admin" && this.password === "password") {
        // If login is successful, store the login state in sessionStorage
        sessionStorage.setItem("isLoggedIn", "true");
        
        // Emit a custom event to inform parent component of the successful login
        this.$emit("loginSuccess");
      } else {
        // If validation fails, display an error message
        this.errorMessage = "Invalid username or password.";
      }
    },
  },
};
</script>

<style scoped>
/* Style for the header (h3 element) */
h3 {
  color: #38678F;
}

/* Styling for the message layout with larger font size and centered text */
.message-layout {
  font-size: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

/* Layout styling for the login section */
.login-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh; /* Center vertically */
  gap: 15px; /* Add spacing between elements */
}

/* Label styling inside the login layout */
.login-layout label {
  font-size: 1.2rem;
  color: #333;
}

/* Input field styling */
.login-layout input {
  padding: 10px;
  font-size: 1rem;
  width: 80%;
  max-width: 400px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

/* Button styling */
.login-layout button {
  padding: 10px 20px;
  font-size: 1rem;
  color: white;
  background-color: #38678F;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

/* Hover effect for the button */
.login-layout button:hover {
  background-color: #38678F;
}

/* Error message styling */
.error-message {
  color: red;
  font-size: 0.9rem;
  margin-top: 10px;
}
</style>
