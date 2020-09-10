<template>
  <div>
    <v-menu :offset-y="true">
      <template v-slot:activator="{ on, attrs }">

        <v-btn 
        v-bind="attrs" 
        v-on="on"
        dark
        @click="selectorClick" 
        >
          <a style="padding-right:10px" dark class="white--text">Source select</a>
          <v-icon color="white">mdi-filmstrip</v-icon>
        </v-btn>

      </template>

      <v-list>
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          @click="sourceClick"
        >
          <v-list-item-title>{{ item }}</v-list-item-title>
        </v-list-item>
      </v-list>

    </v-menu>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'Selector',
  methods: {
    selectorClick() {
      axios.get("http://localhost:8081/vid").then(resp => {
        this.items = resp.data.vid;
      })
      .catch(err => {console.log(err)});

      return this.items
    },

    sourceClick(data) {
      var selection = data.target.innerText;
      // ensure valid selection
      if (this.items.indexOf(selection) > -1) {
        this.$store.state.client.load(selection);
      }
    }

  },
  data() {
      return {
        items: []
    }
  }
}
</script>
