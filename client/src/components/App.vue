<template>
  <div>
    <Nav></Nav>
    <div class="container doc-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Nav from './Nav.vue'

export default {
  components: {
    Nav
  },

  computed: {
    ...mapState('auth', {
      authActive: state => state.active,
      signedIn: state => state.active && state.signedIn,
    })
  },

  created: async function () {
    await this.$store.dispatch('auth/load')
    if (this.authActive && !this.signedIn) {
      this.$root.$router.push({ name: 'login' })
    } else {
      this.$store.dispatch('modules/load')
    }
  }
}
</script>
