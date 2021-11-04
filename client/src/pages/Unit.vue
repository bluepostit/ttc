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
import { mapGetters } from 'vuex'

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

  computed: {
    ...mapGetters('modules', {
      unit: 'lastUnit'
    })
  },

  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.loadData()
    })
  },

  methods: {
    loadData: function () {
      this.$store.commit('modules/setCurrentUnit',
        { moduleId: this.moduleId, unitId: this.unitId })
    }
  }
}
</script>
