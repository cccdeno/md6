import C from './compiler.js'
import G from './generator.js'

export function parse(md) {
  return C.compile(md, G.treeGen)
}

export function newHtmlRender(options) {
  return new G.HtmlGenerator(options)
}

export const defaultHtmlRender = newHtmlRender({})

export function mdToHtml(md) {
  return defaultHtmlRender.render(md)
}

export function mdFix(doc) {
  let list = []
  const regex = /(```([\S\s]*)```)|(`.*?`)|([^`]+)/gmi
  let m = null
  while ((m = regex.exec(doc)) !== null) {
    var token = m[0]
    if (token.startsWith('`')) {
      list.push(token.replace(/</gmi, "&lt;").replace(/>/gmi, "&gt;"))
    } else {
      list.push(token)
    }
  }
  return list.join("");
}

export function htmlScan(doc) {
    let tokens = []
    const regex = /(<!--[\S\s]*?-->)|(<script\s?[^>]*>[\S\s]*?<\/script>)|(<style\s?[^>]*>[\S\s]*<\/style>)|(<svg\s?[^>]*>[\S\s]*<\/svg>)|(<\/?\w+[^>]*>)|([^<>]+)/gmi
    let m = null
    while ((m = regex.exec(doc)) !== null) {
        tokens.push(m[0])
    }
    return tokens
}

export function toHtml(doc) {
  doc = mdFix(doc)
  console.log('mdFix: doc=', doc)
  // Deno.exit();
  let list = []
  let tokens = htmlScan(doc)
  let len = tokens.length
  for (let i=0; i<len; i++) {
    if (tokens[i].trim()==="") {
      continue
    } else if (tokens[i].startsWith("<")) {
      list.push(tokens[i])
    } else {
      list.push(mdToHtml(tokens[i]))
    }
  }
  return list.join('\n')
}

/*
let xml = `
<style>
div { margin: 0px; }
</style>
<body>
  <script>
    console.log("hello!")
  </script>

  <svg width="100" height="100">
  <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />
  </svg>
<!--
This is comment
-->
<!-- This is comment -->

# Chapter

<div> xxx </div>

## Section 1

A link to [YouTube](http://tw.youtube.com) that you may click

![Image1](../img/image.jpg)

</body>
`

// var reg = /(<!--[^-]*-->)/gmi 
// var reg = /(<!--[\S\s]*?-->)/gmi 
// var m = xml.match(reg)
// console.log(m)

let outHtml = toHtml(xml)
console.log(outHtml)
*/
