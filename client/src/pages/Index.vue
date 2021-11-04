<template>
  <div>
    <h1 class="text-center">Modules</h1>
    <div class="accordion" id="accordionIndex">
      <Module v-for="(module, index) in modules"
              v-bind:module="module"
              v-bind:index="index"
              v-bind:key="module.name"
              v-bind:selectedUnitId="getSelectedUnitId(module)">
      </Module>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

  import Module from '../components/Module.vue'

  export default {
    components: {
      Module
    },

    computed: {
      ...mapState({
        modules: state => state.modules.modules,
        lastUnit: state => state.modules.lastUnit
      }),

      ...mapGetters('modules', ['getSelectedUnitId'])
    }
  }
</script>
