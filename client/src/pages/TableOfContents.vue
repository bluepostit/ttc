<template>
  <div id="toc-collapsible">
    <button class="btn btn-secondary d-block" type="button"
            @click.prevent="onToggleClick">
      Contents
    </button>
    <nav class="collapse" id="toc-contents">
    </nav>
  </div>
</template>

<style lang="scss" scoped>

#toc-collapsible {
  position: fixed;
  top: 46px;
  right: 0;
}

#toc-contents {
  background-color: rgba(0,0,0,0.6);
  color: rgb(240, 240, 240);
}

button {
  margin: 5px 5px 3px auto;
}
</style>

<script>
import { Collapse } from 'bootstrap'
import tocbot from 'tocbot'
const COLLAPSE_TIMEOUT = 2000

export default {
  // Not actually needed. But will trigger an update when they change.
  props: {
    contents: {
      required: true
    }
  },

  data: function () {
    return {
      collapse: null,
      expanded: false,
      collapseTimeout: null
    }
  },

  mounted: function () {
    this.createToc()
    this.createCollapse()
    window.setTimeout(() => {
      tocbot.refresh()
    }, 200)
  },

  updated: function () {
    tocbot.refresh()
  },

  methods: {
    createToc: function () {
      try {
        tocbot.destroy()
      } catch (e) { }

      tocbot.init({
        tocSelector: '#toc-contents',
        contentSelector: '.unit-resource',
        headingSelector: 'h1, h2, h3, h4, h5',
        collapseDepth: 1,
        orderedList: false,
        headingsOffset: 100
      })
    },

    createCollapse: function () {
      const tocContents = this.$el.querySelector('#toc-contents')
      const collapse = new Collapse(tocContents)

      // tocContents.addEventListener('shown.bs.collapse', (e) => {
      //   this.startCollapseTimeout()
      // })
      tocContents.addEventListener('pointerleave', (e) => {
        this.startCollapseTimeout()
      })
      this.collapse = collapse
    },

    onToggleClick: function () {
      this.collapse.toggle()
    },

    startCollapseTimeout: function () {
      this.collapseTimeout && window.clearTimeout(this.collapseTimeout)
      this.collapseTimeout = window.setTimeout(() => {
        this.collapse.hide()
      }, COLLAPSE_TIMEOUT)
    }
  }
}
</script>
