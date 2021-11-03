<template>
  <div>
    <Nav></Nav>
    <div class="container doc-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Nav from './Nav.vue'

export default {
  components: {
    Nav
  },

  data: function () {
    return {
      store: this.$root.$options.store
    }
  },

  created: function () {
    this.store.loadLocalData()
  },

  mounted: function () {
    this.store.fetchData()
  }
}
</script>
