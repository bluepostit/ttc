<template>
  <div v-html="content" class="unit-resource">
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    props: {
    unitId: {
      type: String,
      required: true
    },
    moduleId: {
      type: String,
      required: true
    },
    resourceId: {
      type: String,
      required: true
    }
  },

  computed: {
    ...mapState('modules', {
      content: state => state.currentResourceData.content
    })
  },

  mounted: function () {
    this.$store.dispatch('modules/loadResource',{
      moduleId: this.moduleId,
      unitId: this.unitId,
      resourceId: this.resourceId
    })
  }
}
</script>
