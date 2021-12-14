<template>
  <div class="accordion-item">
    <h2 class="accordion-header" v-bind:id="`node-heading-${index}`">
      <button v-bind:class="`accordion-button ${isActive() ? '' : 'collapsed'}`"
              type="button" data-bs-toggle="collapse"
              v-bind:data-bs-target="`#collapse-${index}`"
              v-bind:aria-expanded="isActive() ? 'true' : 'false'"
              v-bind:aria-controls="`collapse-${index}`">
            {{ node.name }}
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
                  v-bind:selected="isSelected(child)">
          </IndexNodeChild>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import IndexNodeChild from './IndexNodeChild.vue'

  export default {
    components: {
      IndexNodeChild
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
      isActive: function () {
        // True if there is a non-empty selectedUnitId
        return false
      },
      isSelected: function (unit) {
        return false
      }
    }
  }
</script>
