const md = require('markdown-it')
const emoji = require('markdown-it-emoji')
const highlightjs = require('markdown-it-highlightjs')
const toc = require('markdown-it-table-of-contents')
const anchor = require('markdown-it-anchor')

const MarkdownIt = md({ html: true })

MarkdownIt.use(emoji)
MarkdownIt.use(highlightjs)
MarkdownIt.use(anchor)
MarkdownIt.use(toc, {
  includeLevel: [1, 2, 3]
})

module.exports = MarkdownIt
