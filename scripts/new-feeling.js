import fs from 'fs'
import path from 'path'
import readline from 'readline'

const FEELINGS_DIR = './src/content/feelings'
const END_MARKER = ':wq'

// Pad number with leading zeros
function pad(n, len = 2) {
  return n.toString().padStart(len, '0')
}

// Generate local datetime string with +08:00 offset (e.g. 2026-08-04T21:52:30+08:00)
// Astro/Zod treats timezone-naive datetime as UTC, so we must include the offset
function getLocalDateTime(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}+08:00`
}

// Generate date prefix for filename (e.g. 2026-08-04)
function getDatePrefix(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

// Find the next available suffix for today (e.g. -0, -1, -2)
function getNextSuffix(datePrefix) {
  if (!fs.existsSync(FEELINGS_DIR)) {
    return 0
  }
  const files = fs.readdirSync(FEELINGS_DIR)
  let maxSuffix = -1
  for (const file of files) {
    // Match files like "2026-08-04-0.md", "2026-08-04-1.md"
    const regex = new RegExp(`^${datePrefix}-(\\d+)\\.md$`)
    const match = file.match(regex)
    if (match) {
      const suffix = parseInt(match[1], 10)
      if (suffix > maxSuffix) {
        maxSuffix = suffix
      }
    }
  }
  return maxSuffix + 1
}

// Multi-line input via readline: each Enter adds a line, type END_MARKER to submit
function promptMultiline() {
  return new Promise((resolve) => {
    const lines = []

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    function ask() {
      rl.question('> ', (answer) => {
        // Ctrl+D or Ctrl+C: abort (answer is undefined or null)
        if (answer === undefined || answer === null) {
          rl.close()
          resolve(null)
          return
        }

        // End marker: submit content
        if (answer.trim() === END_MARKER) {
          rl.close()
          resolve(lines.join('\n'))
          return
        }

        // Push the raw line (preserve empty lines for markdown paragraphs)
        lines.push(answer)
        ask()
      })
    }

    ask()
  })
}

const now = new Date()
const datePrefix = getDatePrefix(now)
const suffix = getNextSuffix(datePrefix)
const fileName = `${datePrefix}-${suffix}`
const fullPath = path.join(FEELINGS_DIR, `${fileName}.md`)
const localDateTime = getLocalDateTime(now)

console.log(`请输入随笔内容（支持 Markdown 格式）`)
console.log(`每行按 Enter 换行，输入 ${END_MARKER} 并回车提交，Ctrl+C 取消`)
console.log(``)

const content = await promptMultiline()

// Ctrl+C or Ctrl+D: abort
if (content === null) {
  console.log('\n已取消')
  process.exit(0)
}

if (!content.trim()) {
  console.log('内容为空，已取消创建')
  process.exit(0)
}

const fileContent = `---
date: ${localDateTime}
---

${content}
`

// Ensure directory exists
if (!fs.existsSync(FEELINGS_DIR)) {
  fs.mkdirSync(FEELINGS_DIR, { recursive: true })
}

fs.writeFileSync(fullPath, fileContent)
console.log(`${fullPath} 创建成功`)
