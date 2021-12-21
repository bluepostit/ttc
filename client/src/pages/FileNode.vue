<template>
  <div v-if="content === null || content === undefined" class="d-flex flex-column justify-content-center align-items-center spinner-wrapper">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <span class="mt-1">Loading...</span>
  </div>
  <div v-else>
    <TableOfContents></TableOfContents>
    <div v-if="content" v-html="content" class="node-content"></div>
    <div v-else class="d-flex flex-column justify-content-center align-items-center spinner-wrapper">
      <span class="mt-1">This file is empty</span>
      <div v-if="nextNode && nextNode.extension">
        <hr>
        <FileNodeLink v-bind:node="nextNode" />
      </div>
    </div>
    <div v-if="content && nextNode && nextNode.extension">
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
