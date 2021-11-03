<template>
  <div class="module-unit">
    <h1 class="text-center">{{ unit.module.name }}</h1>
    <h2>{{ unit.name }} </h2>
    <h3>Resources</h3>
    <div class="list-group ">
      <router-link
        v-for="(resource, index) in unit.resources"
        v-bind:key="index"
        :to="{ name: 'resource', params: { moduleId, unitId, resourceId: resource.id }}"
        class="list-group-item list-group-item-action">
          <i class="bi bi-file-earmark-richtext resource-list-item-icon"></i>
          {{ resource.name }}
      </router-link>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    unitId: {
      type: String,
      required: true
    },
    moduleId: {
      type: String,
      required: true
    }
  },

  data: function () {
    return {
      store: this.$root.$options.store,
      unit: this.$root.$options.store.lastUnit
    }
  },

  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.loadData()
      vm.unit = vm.store.lastUnit
    })
  },

  methods: {
    loadData: function () {
      this.store.loadUnit(this.moduleId, this.unitId)
    }
  }
}
</script>
