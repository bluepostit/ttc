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

  created: function () {
    this.$store.dispatch('auth/load')
    this.$store.dispatch('modules/load')
  }
}
</script>
