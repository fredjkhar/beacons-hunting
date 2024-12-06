<template>
    <div>
      <nav>
        <div
          style="background-color: #333; color: #f2f2f2; padding: 14px 16px; font-weight: bold; text-decoration: none; font-size: 30px; text-align: center;">
          <h1>Ransomware Hunter</h1>
        </div>
      </nav>
      <div class="login-layout">
        <strong class="message-layout">Generate beacons hunting reports for your organization. </strong>
          <strong class="message-layout"> Please request access by sending an email to fkhar048@uottawa.ca</strong>
        <h3>Log in to start generating reports</h3>
        <input id="username" type="text" v-model="username" placeholder="Username" />
        <input id="password" type="password" v-model="password" placeholder="Password" />
  
        <button @click="login">Log In</button>
  
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: "",
        password: "",
        errorMessage: "",
      };
    },
    methods: {
      login() {
        // Example validation logic
        if (this.username === "admin" && this.password === "password") {
          sessionStorage.setItem("isLoggedIn", "true");
          this.$emit("loginSuccess"); // Emit event to parent
        } else {
          this.errorMessage = "Invalid username or password.";
        }
      },
    },
  };
  </script>
  
  <style scoped>
  h3 {
    color: #38678F;
  }
  .message-layout {
    font-size: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .login-layout {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 80vh; /* Center vertically */
    gap: 15px; /* Add spacing between elements */
  }
  
  .login-layout label {
    font-size: 1.2rem;
    color: #333;
  }
  
  .login-layout input {
    padding: 10px;
    font-size: 1rem;
    width: 80%;
    max-width: 400px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .login-layout button {
    padding: 10px 20px;
    font-size: 1rem;
    color: white;
    background-color: #38678F;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .login-layout button:hover {
    background-color: #38678F;
  }
  
  .error-message {
    color: red;
    font-size: 0.9rem;
    margin-top: 10px;
  }
  </style>
  