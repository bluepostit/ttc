<template>
  <nav class="navbar sticky-top navbar-light">
    <div class="container-fluid"><!-- flex -->
      <div>
        <a @click.prevent="goBack" v-if="canGoBack()" class="navbar-brand back-button" href="#">
          <i class="bi bi-chevron-left"></i>
        </a>
        <router-link :to="{ name: 'root' }" class="navbar-brand">
          <i class="bi bi-house"></i> Home
        </router-link>
      </div>
      <div>
          <a @click.prevent="clearHistory()" v-if="hasLastFileNode" href="#">
            <i class="bi bi-clock-history"></i> Clear
          </a>
          <a v-if="showSignOut" @click.prevent="signOut()" href="/auth/logout">
            <i class="bi bi-door-closed"></i> Sign out
          </a>
          <a v-if="showSignIn" @click.prevent="goToSignIn()" href="/auth/login">
            <i class="bi bi-door-open"></i> Sign in
          </a>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data: function () {
    return {
      currentRoute: this.$root.$router.currentRoute
    }
  },

  created: function () {
    this.$root.$router.afterEach((to, from) => {
      this.currentRoute = to
    })
  },

  computed: {
    ...mapState('nodes', {
      hasLastFileNode: state => state.lastFileNode
    }),

    ...mapState('auth', {
      showSignIn: state => state.active && !state.signedIn,
      showSignOut: state => state.active && state.signedIn,
    })
  },

  methods: {
    goBack: function () {
      const nextRoute = this.getNextRoute()
      if (nextRoute) {
        this.$router.push(nextRoute)
      } else {
        window.history.back()
      }
    },

    getNextRoute: function () {
      const routeName = this.currentRoute.name
      let nextRoute
      if (routeName === 'node' || routeName == 'file-node') {
        const currentNode = this.$store.getters['nodes/currentNode']
        const parentNode = currentNode.parent
        if (parentNode) {
          if (parentNode.absolutePath) {
            nextRoute = {
              name: 'node',
              params: { path: parentNode.absolutePath }
            }
          } else {
            nextRoute = { name: 'root' }
          }
        }
      }
      return nextRoute
    },

    canGoBack: function () {
      return this.currentRoute.name !== 'root'
    },

    clearHistory: function () {
      this.$store.commit('nodes/clearLastFileNode')
      if (this.canGoBack()) {
        this.$root.$router.push({ name: 'root' })
      }
    },

    signOut: function () {
      this.$store.dispatch('auth/signOut')
        .then(() => {
          if (this.showSignIn) {
            this.$root.$router.push({ name: 'login' })
          } else if (this.canGoBack()) {
            this.$root.$router.push({ name: 'root' })
          }
        })
    },

    goToSignIn: function () {
      if (this.currentRoute.name !== 'login') {
        this.$root.$router.push({ name: 'login' })
      }
    }
  }
}
</script>
