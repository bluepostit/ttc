<template>
  <router-view></router-view>
</template>

<script>
export default {
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
