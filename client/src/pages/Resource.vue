<template>
  <div>
    <TableOfContents></TableOfContents>
    <div v-html="content" class="unit-resource"></div>
    <div v-if="nextResource">
      <hr>
      <div class="d-flex justify-content-end align-items-center">
        <div class="d-flex align-items-center btn btn-secondary resource-link">
          <i class="bi bi-box-arrow-in-right d-inline-block me-2"></i>
          <ResourceLink
            v-bind:moduleId="moduleId"
            v-bind:unitId="unitId"
            v-bind:resource="nextResource">
          </ResourceLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import ResourceLink from '../components/ResourceLink.vue'
import TableOfContents from './TableOfContents.vue'

export default {
  beforeRouteUpdate: function (to, from, next) {
    this.loadResource(to.params.resourceId)
    next()
  },

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
    ResourceLink,
    TableOfContents
  },

  computed: {
    ...mapState('modules', {
      content: state => state.currentResourceData.content
    }),

    ...mapGetters('modules', ['nextResource'])
  },

  methods: {
    loadResource: async function (resourceId = this.resourceId) {
      await this.$store.dispatch('modules/loadResource', {
        moduleId: this.moduleId,
        unitId: this.unitId,
        resourceId
      })
    }
  },

  mounted: async function () {
    this.loadResource()
  }
}
</script>
