<template>
  <div class="footer text-center mb-2">
    <strong>{{ versionInfo.version }}</strong> · {{ versionInfo.date }}
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('auth', {
      versionInfo: state => state.versionInfo
    })
  }
}
</script>
