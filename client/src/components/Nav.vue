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
          <a @click.prevent="clearHistory()" v-if="hasLastUnit" href="#">
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
      hasLastUnit: state => state.lastUnit && state.lastUnit.id
    }),

    ...mapState('auth', {
      showSignIn: state => state.active && !state.signedIn,
      showSignOut: state => state.active && state.signedIn,
    })
  },

  methods: {
    goBack: function () {
      let newRoute
      switch (this.currentRoute.name) {
        case 'resource':
          newRoute = { name: 'unit', params: this.currentRoute.params }
          break;
        case 'unit':
          newRoute = { name: 'root' }
          break;
      }
      if (newRoute) {
        this.$root.$router.push(newRoute)
      } else {
        window.history.back()
      }
    },

    canGoBack: function () {
      return this.currentRoute.name !== 'root'
    },

    clearHistory: function () {
      this.$store.commit('modules/clearLastUnit')
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
