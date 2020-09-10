<template>
  <v-app>
    <div id="app">
      <v-app-bar dark prominant tile>
        <v-spacer></v-spacer>
        <b>ARGUS</b>
        <v-spacer></v-spacer>
        <Selector></Selector>
        <v-spacer></v-spacer>
      </v-app-bar>
      <router-view/>
    </div>
  </v-app>
</template>

<script>
import Selector from '@/components/Selector';
  
export default {
  name: 'Home',
  components: {
    Selector
  }
}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

</style>
