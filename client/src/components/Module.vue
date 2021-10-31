<template>
  <div class="accordion-item">
    <h2 class="accordion-header" v-bind:id="`module-heading-${index}`">
      <button v-bind:class="`accordion-button ${isActive() ? '' : 'collapsed'}`"
              type="button" data-bs-toggle="collapse"
              v-bind:data-bs-target="`#collapse-${index}`"
              v-bind:aria-expanded="isActive() ? 'true' : 'false'"
              v-bind:aria-controls="`collapse-${index}`">
            {{ module.name }}
      </button>
    </h2>
    <div v-bind:id="`collapse-${index}`"
         v-bind:class="`accordion-collapse collapse ${isActive() ? 'show' : '' }`"
         v-bind:aria-labelledby="`module-heading-${index}`"
         data-bs-parent="#accordionIndex">
      <div class="accordion-body">
        <div class="list-group list-group-flush list-group">
          <Unit v-for="(unit, index) in module.units"
                  v-bind:unit="unit"
                  v-bind:index="index"
                  v-bind:key="unit.name"
                  v-bind:selected="isSelected(unit)">
          </Unit>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Unit from './Unit.vue'

  export default {
    components: {
      Unit
    },
    props: {
      index: {
        type: Number,
        required: true
      },
      module: {
        type: Object,
        required: true
      },
      selectedUnitId: {
        required: true
      }
    },

    methods: {
      isActive: function () {
        // True if there is a non-empty selectedUnitId
        return this.selectedUnitId
      },
      isSelected: function (unit) {
        const selected = this.selectedUnitId &&
          this.selectedUnitId === unit.id
        return selected
      }
    }
  }
</script>
