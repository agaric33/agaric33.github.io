import { h } from 'hastscript'
import { visit } from 'unist-util-visit'

// Obsidian 风格的图片尺寸语法：![alt|300](src)、![alt|50%](src)
const altWithSizePattern = /^(.*?)\|(\d+(?:\.\d+)?%?)$/i

export function rehypeImage() {
  return function (tree) {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName === 'p' && node.children.length === 1) {
        const child = node.children[0]
        if (child.tagName === 'img') {
          parent.children[index] = buildFigure(child)
        }
      } else if (node.tagName === 'img') {
        parent.children[index] = buildImage(node)
      }
    })
  }
}

function parseAltSize(alt) {
  if (typeof alt !== 'string') {
    return { alt, width: undefined }
  }

  const match = alt.match(altWithSizePattern)
  if (!match) {
    return { alt, width: undefined }
  }

  return { alt: match[1], width: match[2] }
}

function buildImage(node) {
  const { alt, width } = parseAltSize(node.properties.alt)
  const imgProps = { ...node.properties, loading: 'lazy' }

  if (width) {
    imgProps.alt = alt
    if (width.endsWith('%')) {
      imgProps.style = `width:${width}`
    } else {
      imgProps.width = width
    }
  }

  return h('img', imgProps)
}

function buildFigure(node) {
  let imgTitle = node.properties.title
  if (imgTitle) {
    imgTitle = imgTitle.trim()
  }

  return h('figure', null, [buildImage(node), imgTitle ? h('figcaption', imgTitle) : null])
}
