<template>
    <router-link v-if="node.extension"
      :to="{ name: 'file-node', params: { path: node.absolutePath } }"
      v-bind:class="linkClass()">
        <i class="bi bi-file-earmark-richtext resource-list-item-icon"></i>
        {{ index + 1 }}. {{ node.name }}
    </router-link>
    <router-link v-else
      :to="{ name: 'node', params: { path: node.absolutePath } }"
      v-bind:class="linkClass()">
        {{ index + 1 }}. {{ node.name }}
    </router-link>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    props: {
      index: {
        type: Number,
        required: true
      },
      node: {
        type: Object,
        required: true
      }
    },

    computed: {
      ...mapGetters('nodes', {
        isSelectedNode: 'isSelected'
      })
    },

    methods: {
      linkClass: function () {
        const extraClass = this.isSelectedNode(this.node) ? 'list-group-item-primary' : ''
        return `list-group-item list-group-item-action ${extraClass}`
      }
    }
  }
</script>
