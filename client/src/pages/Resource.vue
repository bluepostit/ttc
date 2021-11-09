<template>
  <div>
    <TableOfContents></TableOfContents>
    <div v-html="content" class="unit-resource">
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TableOfContents from './TableOfContents.vue'

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

  components: {
    TableOfContents
  },

  computed: {
    ...mapState('modules', {
      content: state => state.currentResourceData.content
    })
  },

  mounted: async function () {
    await this.$store.dispatch('modules/loadResource',{
      moduleId: this.moduleId,
      unitId: this.unitId,
      resourceId: this.resourceId
    })
  }
}
</script>
