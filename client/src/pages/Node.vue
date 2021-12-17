<template>
  <div class="module-unit" v-if="node">
    <h1 class="text-center">{{ node.parent.name }}</h1>
    <h2>{{ node.name }} </h2>
    <div v-if="node.children && node.children.length > 0">
      <div class="list-group ">
        <NodeRouterLink
          v-for="(child, index) in node.children"
          v-bind:key="index"
          v-bind:node="child"
          v-bind:index="index"
        >
        </NodeRouterLink>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import NodeRouterLink from '../components/NodeRouterLink.vue'

export default {
  components: {
    NodeRouterLink
  },

  props: {
    path: {
      type: String,
      required: true
    }
  },

  computed: {
    ...mapGetters('nodes', {
      node: 'currentNode'
    })
  },

  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.setCurrentNode()
    })
  },

  methods: {
    setCurrentNode: function () {
      this.$store.commit('nodes/setCurrentNode', { path: this.path })
    }
  }
}
</script>
