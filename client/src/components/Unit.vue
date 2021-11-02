<template>
  <router-link
    :to="{ name: 'unit', params: { moduleId, unitId: unit.id } }"
    v-bind:class="linkClass()">
      {{ index + 1 }}. {{ unit.name }}
  </router-link>
</template>

<script>
  export default {
    props: {
      index: {
        type: Number,
        required: true
      },
      unit: {
        type: Object,
        required: true
      },
      moduleId: {
        type: String,
        required: true
      },
      selected: {
        required: true,
        default: false
      }
    },

    methods: {
      linkClass: function () {
        const extraClass = this.selected ? 'list-group-item-primary' : ''
        return `list-group-item list-group-item-action ${extraClass}`
      }
    }
  }
</script>
