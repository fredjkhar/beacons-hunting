<!-- App.vue -->
<template>
  <Navbar />
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'; // Corrected relative path
export default {
  components: {
    Navbar,
  },
};
</script>
