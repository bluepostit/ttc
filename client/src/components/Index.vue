<template>
  <div class="accordion" id="accordionIndex">
    <Module v-for="(module, index) in data.modules"
            v-bind:module="module"
            v-bind:index="index"
            v-bind:key="module.name"
            v-bind:selectedUnitId="getSelectedUnitId(module)">
    </Module>
  </div>
</template>

<script>
  import { ModuleStore } from '../module-storage'
  import Module from './Module.vue'

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
        const url = '/modules'
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
