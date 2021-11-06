<template>
  <div class="col-12 col-md-8 justify-content-center">
    <h1>Sign in</h1>
    <div class="errors" v-if="errors.length > 0">
      <div v-for="(error, index) in errors" v-bind:key="index" class="alert alert-warning">
        {{ error }}
      </div>
    </div>
    <form action="/auth/login" method="post" @submit.prevent="submit">
      <div class="form-group">
        <label for="email">User name</label>
        <input v-model="email" type="text" id="email" name="email" class="form-control" />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input v-model="password" type="password" id="password" name="password" class="form-control" />
      </div>
      <button type="submit" class="btn btn-primary mt-2 w-100">Login</button>
    </form>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data: function () {
    return {
      email: null,
      password: null
    }
  },

  mounted: function () {
    if (this.signedIn || !this.authActive) {
      this.goToIndex()
    }
  },

  computed: {
    ...mapState('auth', {
      authActive: state => state.active,
      signedIn: state => state.active && state.signedIn,
      errors: state => state.errors
    }),
  },


  methods: {
    submit: function () {
      const data = {
        email: this.email,
        password: this.password
      }
      this.$store.dispatch('auth/signIn', data)
        .then((successful) => {
          if (successful) {
            this.goToIndex()
          }
        })
    },

    goToIndex: function () {
      this.$root.$router.push({ name: 'index' })
    }
  }
}
</script>
