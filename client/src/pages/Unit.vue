<template>
  <div class="module-unit">
    <h1 class="text-center">{{ store.lastUnit.module.name }}</h1>
    <h2>{{ store.lastUnit.name }} </h2>
    <h3>Resources</h3>
    <div class="list-group ">
      <router-link
        v-for="(resource, index) in store.lastUnit.resources"
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
      store: this.$root.$options.store
    }
  },

  created: function () {
    this.loadData()
  },

  methods: {
    loadData: function () {
      this.store.loadUnit(this.moduleId, this.unitId)
    }
  }
}
</script>
