<template>
  <nav class="navbar sticky-top navbar-light">
    <div class="container-fluid"><!-- flex -->
      <div>
        <a @click="goBack" v-if="canGoBack()" class="navbar-brand back-button" href="#">
          <i class="bi bi-chevron-left"></i>
        </a>
        <router-link :to="{ name: 'index' }" class="navbar-brand">
          <i class="bi bi-house"></i> Home
        </router-link>
      </div>
      <div>
          <a @click.prevent="clearHistory()" v-if="lastUnit && lastUnit.id" href="#">
            <i class="bi bi-clock-history"></i> Clear
          </a>
          <a v-if="showSignOut()" href="/auth/logout">
            <i class="bi bi-door-closed"></i> Sign out
          </a>
          <a v-if="showSignIn()" href="/auth/login">
            <i class="bi bi-door-open"></i> Sign in
          </a>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data: function () {
    return {
      store: this.$root.$options.store,
      lastUnit: this.$root.$options.store.lastUnit,
      currentRoute: this.$root.$router.currentRoute
    }
  },

  created: function () {
    this.$root.$router.afterEach((to, from) => {
      this.currentRoute = to
      this.lastUnit = this.$root.$options.store.lastUnit
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
          newRoute = { name: 'index' }
          break;
      }
      newRoute && this.$root.$router.push(newRoute)
    },

    canGoBack: function () {
      return this.currentRoute.name !== 'index'
    },

    clearHistory: function () {
      this.store.clearLastUnit()
      this.lastUnit = null
    },

    showSignIn: function () {
      return this.store.authData.active && !this.store.authData.signedIn
    },

    showSignOut: function () {
      return this.store.authData.active && this.store.authData.signedIn
    }
  }
}
</script>
