<template>
  <div v-html="content">
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      moduleId: null,
      unitId: null,
      resourceId: null,
      content: ''
    }
  },

  mounted: function () {
    this.setIdsFromHtml()
    this.fetchData()
  },

  methods: {
    setIdsFromHtml: function () {
      const parentNode = this.$el.parentNode
      this.moduleId = parentNode.dataset.moduleId
      this.unitId = parentNode.dataset.unitId
      this.resourceId = parentNode.dataset.resourceId
    },

    fetchData: function () {
      const url = `/api/v1/modules/${this.moduleId}/units/${this.unitId}/${this.resourceId}`
      fetch(url, {
        headers: {
          Accept: 'application/json'
        }
      }).then(res => res.json())
        .then((data) => {
          this.content = data.content
          // ModuleStore.store(data)
        })
    }
  }
}
</script>
