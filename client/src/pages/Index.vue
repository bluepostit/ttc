<template>
  <div>
    <h1 class="text-center">Modules</h1>
    <div class="accordion" id="accordionIndex">
      <Module v-for="(module, index) in store.modules"
              v-bind:module="module"
              v-bind:index="index"
              v-bind:key="module.name"
              v-bind:selectedUnitId="getSelectedUnitId(module)">
      </Module>
    </div>
  </div>
</template>

<script>
  import Module from '../components/Module.vue'

  export default {
    components: {
      Module
    },
    data: function () {
      return {
        store: this.$root.$options.store
      }
    },

    methods: {
      getSelectedUnitId: function (module) {
        if (this.store.lastUnit && this.store.lastUnit.module.id === module.id) {
          return this.store.lastUnit.id
        }
        return null
      }
    }
  }
</script>
