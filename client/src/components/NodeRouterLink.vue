<template>
    <router-link v-if="node.type && node.type == 'file'"
      :to="{ name: 'file-node', params: { path: node.absolutePath } }"
      class="list-group-item list-group-item-action">
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

    methods: {
      linkClass: function () {
        const extraClass = '' //this.selected ? 'list-group-item-primary' : ''
        return `list-group-item list-group-item-action ${extraClass}`
      },

      fileClass: function () {
        return
      }
    }
  }
</script>
