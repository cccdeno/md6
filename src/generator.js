import * as path from "https://deno.land/std/path/mod.ts";
import C from './compiler.js'
const G = {}
export default G

G.treeGen = function (node) {
  return node
}

let rs = function rewriteSpecial(str) {
  if (str == null) return ''
  let len = str.length
  let r = []
  for (let i=0; i<len; i++) {
    let ch = str[i], toStr=ch
    switch (ch) {
      case '<': toStr = '&lt;'; break
      case '>': toStr = '&gt;'; break
      case '&': 
        if (!/^&\w+;/.test(str.substring(i))) toStr = '&amp;'
        break
    }
    r.push(toStr)
  }
  return r.join('')
}

export class Generator {
  constructor(options={}) {
    this.options = options
  }
  gen(node) { // 對每個節點的轉換動作！
    if (node.type == null) return node
    return this[node.type](node)
  }
  render(md) { // 將 md 轉換為輸出 (ex: html)
    let self = this
    return C.compile(md, function (node) {
      return self.gen(node)
    })
  }
}

export class HtmlGenerator extends Generator {
  // inline
  text(x) { return x.body }
  code2(x) { return `<code>${rs(x.body)}</code>` }
  code1(x) { return `<code>${rs(x.body)}</code>` }
  star2(x) { return `<strong>${rs(x.body)}</strong>` }
  star1(x) { return `<strong>${rs(x.body)}</strong>` }
  under2(x) { return `<em>${rs(x.body)}</em>` }
  under1(x) { return `<em>${rs(x.body)}</em>` }
  url(x) { return `<a href="${x.body}">${x.body}</a>` }
  urlfull(x) { return `<a href="${x.body}">${x.body}</a>` }
  math1(x) { return '\\('+ x.body +'\\)'} // `<span class="math inline">${x.body}</span>`
  math(x) { return '\\['+ x.body + '\\]' } // <p><span class="math display">\n${x.body}\n</span></p>
  link(x) {
    let defExt = this.options.defaultExt || ''
    let ext = path.extname(x.href)
    if (x.href.indexOf('://') < 0 && ext === '')
      return `<a href="${x.href}${defExt}" alt="${x.alt}">${x.text}</a>`
    else
      return `<a href="${x.href}" alt="${x.alt}">${x.text}</a>`
  }
  image(x) {
    return `<figure>\n  <img src="${x.href}" alt="${x.alt}"></img>\n<figcaption>${rs(x.text)}</figcaption></figure>\n`
  }

  // block
  blocks(x) { return x.childs.join('\n') }
  header(x) { return `<h${x.level}>${x.childs.join('')}</h${x.level}>` }
  line(x) { return `${x.childs.join('')}` }
  empty(x) { return `<p></p>\n`.repeat(x.count-1) }
  code(x) { return `<pre class="code"><code class="${x.lang}">${rs(x.body)}\n</code></pre>`}
  mark(x) { return `<blockquote>\n<p>${x.childs.join('</p>\n<p>')}</p>\n</blockquote>` }
  tabBlock(x) { return `<pre class="tab">${x.childs.join('\n')}\n</pre>` }
  hline(x) { return '<hr>' }
  ref(x) { return '' }
  ref1(x) { 
    const ref = C.refMap[x.body]
    return (ref != null) ? `<a href="${ref}">${rs(x.body)}</a>` : `[${rs(x.body)}]`
  }
  paragraph(x) { return `<p>${x.childs.join('\n')}</p>` }
  list(x) { return `${'    '.repeat(x.level)}<${x.listType}>\n${x.childs.join('\n')}\n${'    '.repeat(x.level)}</${x.listType}>`}
  li(x) { return `${'    '.repeat(x.level+1)}<li>${x.childs.join('')}</li>` }
  table(x) {
    let len = x.childs.length, list=[]
    for (let ri=0; ri<len; ri++) {
      let row = x.childs[ri] // .trim()
      let m = row.match(/^\|?(.*?)\|?$/) // 去除前後的 | 
      if (m != null) row = m[1]
      let rowHtml = ''
      switch (ri) {
        case 0: rowHtml = `<tr><th>${row.replace(/\|/g, '</th><th>')}</th></tr>`; break;
        case 1: rowHtml = ''; break
        default: rowHtml = `<tr><td>${row.replace(/\|/g, '</td><td>')}</td></tr>`; break;
      }
      list.push(rowHtml)
    }
    return `<table class="table">\n${list.join('\n')}\n</table>`
  }
}

G.HtmlGenerator = HtmlGenerator
