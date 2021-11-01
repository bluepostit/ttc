<template>
  <div>
    <h1 class="text-center">{{ unit.module.name }}</h1>
    <h2>{{ unit.name }} </h2>
    <h3>Resources</h3>
    <div class="list-group ">
      <a v-for="(resource, index) in unit.resources"
          v-bind:key="index"
          v-bind:href="resource.url"
          class="list-group-item list-group-item-action">
        <i class="bi bi-file-earmark-richtext resource-list-item-icon"></i>
        {{ resource.name }}
      </a>
    </div>
  </div>
</template>

<script>
import { ModuleStore } from '../module-storage'

const findUnit = (moduleData, moduleId, unitId) => {
  const module = moduleData.modules.find(module => module.id === moduleId)
  if (module) {
    return module.units.find(unit => unit.id === unitId)
  }
}

export default {
  data: function () {
    return {
      unitId: null,
      moduleId: null,
      unit: {
        name: null,
        resources: [],
        module: { name: null }
      }
    }
  },

  mounted: function () {
    this.setIdsFromHtml()
    this.loadLocalData()
    this.fetchData()
  },

  methods: {
    setIdsFromHtml: function () {
      const parentNode = this.$el.parentNode
      this.unitId = parentNode.dataset.unitId
      this.moduleId = parentNode.dataset.moduleId
    },

    loadLocalData: function () {
      const moduleData = ModuleStore.retrieve()
      if (moduleData) {
        this.unit = findUnit(moduleData, this.moduleId, this.unitId)
      }
    },

    fetchData: function () {
      const url = `/api/v1/modules/${this.moduleId}/units/${this.unitId}`
      fetch(url, {
        headers: {
          Accept: 'application/json'
        }
      }).then(res => res.json())
        .then((data) => {
          this.unit = data.unit
          // ModuleStore.store(data)
        })
    }
  }
}
</script>
