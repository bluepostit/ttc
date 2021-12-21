<template>
  <div v-if="node && node.extension">
    <NodeRouterLink
      v-bind:node="node"
      v-bind:index="index"
      v-bind:numbered="false">
    </NodeRouterLink>
  </div>
  <div v-else class="accordion-item">
    <h2 class="accordion-header" v-bind:id="`node-heading-${index}`">
      <button v-if="node"
              v-bind:class="`accordion-button ${isActive() ? '' : 'collapsed'}`"
              type="button" data-bs-toggle="collapse"
              v-bind:data-bs-target="`#collapse-${index}`"
              v-bind:aria-expanded="isActive() ? 'true' : 'false'"
              v-bind:aria-controls="`collapse-${index}`">
            {{ node.name || node.path }}
      </button>
    </h2>
    <div v-bind:id="`collapse-${index}`"
         v-bind:class="`accordion-collapse collapse ${isActive() ? 'show' : '' }`"
         v-bind:aria-labelledby="`node-heading-${index}`"
         data-bs-parent="#accordionIndex">
      <div class="accordion-body">
        <div class="list-group list-group-flush list-group">
          <IndexNodeChild v-for="(child, index) in node.children"
                  v-bind:node="child"
                  v-bind:index="index"
                  v-bind:key="index"
                  v-bind:numbered="shouldNumberChildren()">
          </IndexNodeChild>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import IndexNodeChild from './IndexNodeChild.vue'
  import NodeRouterLink from './NodeRouterLink.vue'

  export default {
    components: {
      IndexNodeChild,
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

    computed: {
      ...mapGetters('nodes', {
        isSelectedNode: 'isSelected'
      })
    },

    methods: {
      isActive: function () {
        return this.node && this.isSelectedNode(this.node)
      },

      shouldNumberChildren: function () {
        if (this.node.numberedChildren) {
          return true
        }
        if (this.node.numberedChildren === undefined) {
          return true
        }
        return false
      }
    }
  }
</script>
