<template>
    <nav class="navbar">
        <div class="project-name">Ransomeware Hunter</div>
        <div class="menu-items">
            <div class="item"><router-link to="/">Home</router-link></div>
            <div class="item"><router-link to="/generate">Generate Report</router-link></div>
            <div class="item"><router-link to="/">View Report</router-link></div>
            <div class="item"><router-link to="/whitelist">Whitelist Items</router-link></div>
        </div>
    </nav>
</template>

<script>

</script>

<style>
body{
    margin: 0;
}

.navbar {
  overflow: hidden;
  background-color: #333;
}

.project-name {
  float: left;
  color: #f2f2f2;
  text-align: center;
  padding: 14px 16px;
  font-weight: bold;
  text-decoration: none;
  font-size: 17px;
}

.menu-items {
    display: flex;
    float: right;
    margin-left: auto; 
    margin-right: 0;
}

.item a {
  float: left;
  color: #f2f2f2;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  font-size: 17px;
}

.item a:hover {
  background-color: #ddd;
  color: black;
}

.item a.active {
  background-color: #04AA6D;
  color: white;
}
</style>