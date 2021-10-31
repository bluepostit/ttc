<template>
  <div class="accordion" id="accordionIndex">
    <Module v-for="(module, index) in modules"
            v-bind:module="module"
            v-bind:index="index"
            v-bind:key="module.name"
            v-bind:selectedUnitId="getSelectedUnitId(module)">
    </Module>
  </div>
</template>

<script>
  import Module from './Module.vue'

  export default {
    components: {
      Module
    },
    data: function () {
      return {
        modules: [],
        lastUnit: null
      }
    },

    created: function () {
      this.fetchData()
    },

    methods: {
      fetchData: function () {
        const url = '/modules'
        fetch(url, {
          headers: {
            Accept: 'application/json'
          }
        }).then(res => res.json())
          .then((data) => {
            this.modules = data.modules
            this.lastUnit = data.lastUnit
          })
      },

      getSelectedUnitId: function (module) {
        if (this.lastUnit && this.lastUnit.moduleId === module.id) {
          return this.lastUnit.unitId
        }
        return null
      }
    }
  }
</script>
