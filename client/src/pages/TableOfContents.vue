<template>
  <div id="toc-collapsible">
    <button class="btn btn-outline-secondary d-block" type="button"
            @click.prevent="onToggleClick">
      <i class="bi bi-card-list"></i>
    </button>
    <nav class="collapse" id="toc-contents">
    </nav>
  </div>
</template>

<style lang="scss">

#toc-collapsible {
  position: fixed;
  top: 46px;
  right: 0;

  button {
    margin: 5px 5px 3px auto;
  }
}

#toc-contents {
  background-color: rgba(0,0,0,0.9);
  color: rgb(240, 240, 240);
  box-shadow: -2px 2px 5px rgba(0,0,0,0.6);
  border-radius: 4px;
}

#toc-contents > ul > li {
  list-style: none;
}

#toc-collapsible {
  .toc-link::before {
      display: none;
      height: 1.8em;
    }
  .is-active-link::before {
    height: 1.6em;
    display: inline-block;
    width: 0.3em;
  }
}
</style>

<script>
import { Collapse } from 'bootstrap'
import tocbot from 'tocbot'
import { mapState } from 'vuex'

const COLLAPSE_TIMEOUT = 2000
const AUTO_COLLAPSE = true

export default {
  data: function () {
    return {
      collapse: null,
      collapseTimeout: null
    }
  },

  computed: {
    ...mapState('nodes', {
      content: state => state.currentNodeContent
    })
  },

  watch: {
    'content': function () {
      this.updateToc()
    }
  },

  mounted: function () {
    this.createCollapse()
    this.createToc()
  },

  updated: function () {
    this.updateToc()
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

    updateToc: function () {
      tocbot.refresh()
    },

    createCollapse: function () {
      const tocContents = this.$el.querySelector('#toc-contents')
      const collapse = new Collapse(tocContents, { toggle: false })

      // tocContents.addEventListener('shown.bs.collapse', (e) => {
      //   this.startCollapseTimeout()
      // })
      tocContents.addEventListener('pointerleave', (e) => {
        AUTO_COLLAPSE && this.startCollapseTimeout()
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
