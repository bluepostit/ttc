<template>
  <div class="d-flex justify-content-end align-items-center">
    <div class="d-flex align-items-center btn btn-secondary resource-link">
      <i class="bi bi-box-arrow-in-right d-inline-block me-2"></i>
      <router-link
        :to="{ name: 'file-node', params: { path: node.absolutePath }}">
        {{ node.name }}
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    node: {
      required: true,
      type: Object
    }
  }
}
</script>
