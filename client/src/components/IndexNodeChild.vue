<template>
  <NodeRouterLink v-bind:node="node" v-bind:index="index"></NodeRouterLink>
</template>

<script>
  import NodeRouterLink from './NodeRouterLink.vue'

  export default {
    components: {
      NodeRouterLink
    },

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
        const extraClass = this.selected ? 'list-group-item-primary' : ''
        return `list-group-item list-group-item-action ${extraClass}`
      }
    }
  }
</script>
