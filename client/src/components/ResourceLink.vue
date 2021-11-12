<template>
  <div v-bind:class="cssClass">
    <router-link
      :to="{ name: 'resource', params: { moduleId, unitId, resourceId: resource.id }}">
      {{ resource.name }}
    </router-link>
  </div>
</template>

<script>
export default {
  props: {
    moduleId: {
      required: true
    },
    unitId: {
      required: true
    },
    resource: {
      required: true,
      type: Object
    },
    cssClass: {
      type: String
    }
  }
}
</script>
