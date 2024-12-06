<template>
  <nav class="navbar">
    <div class="project-name" @click="goHome">Beacons Hunter</div>
    <div class="menu-items">
      <div class="item"><router-link to="/">Home</router-link></div>
      <div class="item"><router-link to="/generate">Generate Report</router-link></div>
      <div class="item"><router-link to="/report">View Report</router-link></div>
      <div class="item"><router-link to="/whitelist">Whitelist Items</router-link>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      pageTitle: null,
    }
  },
  methods: {
    goHome() {
      this.$router.push("/")
    }
  },
}
</script>

<style>
.navbar {
  overflow: hidden;
  background-color: #333;
  width: 100vw;
  display: flex;
  align-items: center;
  height: 7vh;
}

.project-name {
  color: #f2f2f2;
  padding: 14px 16px;
  font-weight: bold;
  text-decoration: none;
  font-size: 30px;
}

.menu-items {
  display: flex;
  margin-left: auto;
  margin-right: 0;
}

.item a {
  display: flex;
  /* Make the anchor a flex container */
  align-items: center;
  /* Center the text vertically */
  justify-content: center;
  /* Center the text horizontally */
  color: #f2f2f2;
  padding: 0 16px;
  /* Use horizontal padding only */
  text-decoration: none;
  font-size: 17px;
  height: 100%;
  /* Make the anchor span the full height of the navbar */
}

.item a:hover {
  background-color: #ddd;
  color: black;
  height: 100vh;
}

.item a.active {
  background-color: #04AA6D;
  color: white;
}

.pageTitle {
  padding-top: 1%;
  text-align: center;
}
</style>