<template>
  <a v-bind:href="unit.url"
     v-bind:class="`list-group-item list-group-item-action ${selected ? 'list-group-item-primary' : ''}`">
    {{ index + 1 }}. {{ unit.name }}
  </a>
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
      selected: {
        required: true,
        default: false
      }
    }
  }
</script>
