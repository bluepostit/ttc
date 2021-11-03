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
          <a @click="clearHistory" href="#">
            <i class="bi bi-clock-history"></i> Clear
          </a>
        {% if useAuth %}
          {% if signedIn %}
            <a href="/auth/logout">
              <i class="bi bi-door-closed"></i> Sign out
            </a>
          {% else %}
            <a href="/auth/login">
              <i class="bi bi-door-open"></i> Sign in
            </a>
          {% endif %}
        {% endif %}
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data: function () {
    return {
      store: this.$root.$options.store,
      currentRoute: this.$root.$router.currentRoute
    }
  },

  created: function () {
    this.$root.$router.afterEach((to, from) => {
      this.currentRoute = to
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
    }
  }
}
</script>
