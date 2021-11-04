<template>
  <div v-html="content" class="unit-resource">
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
    },
    resourceId: {
      type: String,
      required: true
    }
  },

  data: function () {
    return {
      content: ''
    }
  },

  mounted: function () {
    this.$store.commit('modules/setCurrentUnit',
      { moduleId: this.moduleId, unitId: this.unitId })
    this.fetchData()
  },

  methods: {
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
