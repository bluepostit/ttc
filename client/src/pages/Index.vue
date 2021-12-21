<template>
  <div v-if="rootNode">
    <h1 class="text-center">{{ rootNode.name }}</h1>
    <div class="accordion" id="accordionIndex">
      <IndexNode v-for="(node, index) in rootNode.children"
              v-bind:node="node"
              v-bind:index="index"
              v-bind:key="node.name || node.path"
      >
      </IndexNode>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

  import IndexNode from '../components/IndexNode.vue'

  export default {
    components: {
      IndexNode
    },

    computed: {
      ...mapState('nodes', {
        rootNode: state => state.nodes,
        // lastUnit: state => state.modules.lastUnit
      }),

      // ...mapGetters('nodes', ['getSelectedUnitId'])
    }
  }
</script>
