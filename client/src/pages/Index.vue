<template>
  <div>
    <h1 class="text-center">Modules</h1>
    <div class="accordion" id="accordionIndex">
      <Module v-for="(module, index) in data.modules"
              v-bind:module="module"
              v-bind:index="index"
              v-bind:key="module.name"
              v-bind:selectedUnitId="getSelectedUnitId(module)">
      </Module>
    </div>
  </div>
</template>

<script>
  import { ModuleStore } from '../module-storage'
  import Module from '../components/Module.vue'

  export default {
    components: {
      Module
    },
    data: function () {
      return {
        data: {
          modules: [],
          lastUnit: null
        }
      }
    },

    created: function () {
      this.loadLocalData()
    },

    mounted: function () {
      this.fetchData()
    },

    methods: {
      loadLocalData: function () {
        const data = ModuleStore.retrieve()
        if (data) {
          console.log('loading data from local storage')
          this.data = data
        }
      },
      fetchData: function () {
        const url = '/api/v1/modules'
        fetch(url, {
          headers: {
            Accept: 'application/json'
          }
        }).then(res => res.json())
          .then((data) => {
            this.data = data
            ModuleStore.store(data)
          })
      },

      getSelectedUnitId: function (module) {
        if (this.data.lastUnit && this.data.lastUnit.moduleId === module.id) {
          return this.data.lastUnit.unitId
        }
        return null
      }
    }
  }
</script>
