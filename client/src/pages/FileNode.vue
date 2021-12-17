<template>
  <div>
    <TableOfContents></TableOfContents>
    <div v-html="content" class="node-content"></div>
    <div v-if="nextNode">
      <hr>
      <FileNodeLink v-bind:node="nextNode" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FileNodeLink from '../components/FileNodeLink.vue'
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
    FileNodeLink,
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
