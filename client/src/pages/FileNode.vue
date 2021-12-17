<template>
  <div>
    <TableOfContents></TableOfContents>
    <div v-html="content" class="unit-resource"></div>
    <!-- <div v-if="nextResource">
      <hr>
      <div class="d-flex justify-content-end align-items-center">
        <div class="d-flex align-items-center btn btn-secondary resource-link">
          <i class="bi bi-box-arrow-in-right d-inline-block me-2"></i>
          <ResourceLink
            v-bind:moduleId="moduleId"
            v-bind:unitId="unitId"
            v-bind:node="nextNode">
          </ResourceLink>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ResourceLink from '../components/ResourceLink.vue'
import TableOfContents from '../components/TableOfContents.vue'

export default {
  beforeRouteUpdate: function (to, from, next) {
    this.loadNodeContent(to.params.path)
    next()
  },

  props: {
    path: {
      type: String,
      required: true
    }
  },

  components: {
    ResourceLink,
    TableOfContents
  },

  computed: {
    ...mapGetters('nodes', {
      nextNode: 'nextNode',
      content: 'currentNodeContent'
    })
  },

  methods: {
    loadNodeContent: async function (path = this.path) {
      await this.$store.dispatch('nodes/loadNodeContent', {
        path
      })
    }
  },

  mounted: async function () {
    this.loadNodeContent()
  }
}
</script>
