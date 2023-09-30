const MarkdownIt = require("markdown-it")
const hljs = require("highlight.js")
const fs = require("fs")

const markdown = new MarkdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<div class="code-container"><div class="code-header"><span class="code-lang">${lang}</span><button class="code-copy" onclick="copyCode(event, \`${markdown.utils.escapeHtml(str).replace(/`/g, "\\`").replace(/\$/g, "\\$")}\`)">Copy</button></div><div class="hljs">${hljs.highlight(str, { language: lang }).value}<div></div>`
      } catch { }
    }
    return `<div class="code-container"><div class="code-header"><span class="code-lang">${lang}</span><button class="code-copy" onclick="copyCode(event, \`${markdown.utils.escapeHtml(str).replace(/`/g, "\\`").replace(/\$/g, "\\$")}\`)">Copy</button></div><div class="hljs">${markdown.utils.escapeHtml(str)}</div></div>`
  },
  linkify: true,
  typographer: true,
  quotes: "“”‘’",
})

const markdownText = fs.readFileSync(process.argv[2], "utf8")

const htmlDocument = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="style.css">
  <script>
    function copyCode(event, str) {
      navigator.clipboard.writeText(str)
      event.target.innerHTML = 'Copied'
      setTimeout(() => {
        event.target.innerHTML = 'Copy'
      }, 1000)
    }
  </script>
</head>
<body>
  ${markdown.render(markdownText)}
</body>
</html>`

fs.writeFileSync(process.argv[3], htmlDocument)