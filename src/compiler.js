/* 以下的 . 都不包含 \n 字元，但是 .. 可包含 \n 字元
----------基本語法---------------
MD = (LINE | BLOCK)*
LINE = (#*)? INLINE*\n
INLINE = ITALIC | BOLD | ICODE | IMATH | LINK | URL? | <URL> |  | .*
BLOCK = LIST? | HLINE? | SECTION | REF | CODE | MARK | TABBLOCK | TABLE | MATH
ICODE = `(.*)`
ITALIC = *(.*)*
BOLD = **(.*)**
CODE = \n```(\w+)\n(..*)\n```
MARK = (\n>.*)+
TABBLOCK = (\n(TAB).*)+

----------延伸語法----------------
TABLE = ROW \n(-+|)+(.*) ROW+
ROW   = \n(.* |)+(.*)
IMATH = $(.*)$
MATH  = \n$$(..*)\n$$
*/
const M = {}
export default M

var lines, lineIdx, lineTop, paragraph, gen, refMap

M.compile = function (md, fgen) {
  lines = (md+'\n').replace(/\r/g, '').replace(/\t/g, '    ').split('\n'); lineTop = lines.length; lineIdx = 0; paragraph={ type:'paragraph', childs:[] }
  gen = fgen
  M.refMap = refMap = {}
  let tree = MD()
  return tree
}

let line = function () {
  return lines[lineIdx]
}

let genLine = function (line) {
  return gen({type:'line', childs: inline(line)})
}

let inline = function (text) {
  var regexp = /(``(?<code2>.*?)``)|(`(?<code1>.*?)`)|(__(?<under2>.*)?__)|(_(?<under1>.*?)_)|(\$[`$]?(?<math1>.*?)[`$]?\$)|(<?(?<urlfull>(\w*:\/\/[^\s>]*))>?)|(?<image>!\[(?<itext>[^\]]*?)\]\((?<ihref>[^\"\]]*?)("(?<ialt>[^\"\]]?)")?\))|(?<link>\[(?<text>[^\]]*?)\]\((?<href>[^\"\]]*?)("(?<alt>[^\"\]]?)")?\))|(\*\*(?<star2>.*?)\*\*)|(\*(?<star1>.*?)\*)|(\[(?<ref1>.*?)\])/g
  var m, lastIdx = 0, len = text.length
  var r = []
  while ((m = regexp.exec(text)) !== null) {
    if (m.index > lastIdx) r.push(gen({type:'text', body:text.substring(lastIdx, m.index)}))
    let obj = {}, type, body
    for (let key in m.groups) {
      let value = m.groups[key]
      if (value != null) {
        obj[key] = value
        type = key
        body = value
      }
    }
    if (obj.image != null)
      obj = {type:'image', text:obj.itext, href:obj.ihref, alt:obj.ialt||''}
    else if (obj.link != null)
      obj = {type:'link', text:obj.text, href:obj.href, alt:obj.alt||''}
    else 
      obj = {type, body}

    r.push(gen(obj))
    lastIdx = regexp.lastIndex
  }
  if (len > lastIdx) r.push(gen({type:'text', body:text.substring(lastIdx, len)}))
  return r
}

// MD = (BLOCK)*
let MD = function () {
  let r = {type:'blocks', childs:[]}
  while (lineIdx < lineTop) {
    let e = BLOCK()
    r.childs = r.childs.concat(e)
  }
  return gen(r)
}

// BLOCK = CODE | MARK | TABBLOCK | TABLE? | MATH? | TITLE | PARAGRAPH
let BLOCK = function () {
  var r = null // ,blockStart = lineIdx
  if (r == null) r = EMPTY()
  if (r == null) r = MATH()
  if (r == null) r = CODE()
  if (r == null) r = MARK()
  if (r == null) r = TABBLOCK()
  if (r == null) r = REF()
  if (r == null) r = HEADER()
  if (r == null) r = HLINE()
  if (r == null) r = LIST()
  if (r == null) r = TABLE()
  if (r == null) {
    paragraph.childs.push(genLine(lines[lineIdx++]))
    return []
  } else { // 有比對到某種 BLOCK
    let list = []
    if (paragraph.childs.length > 0) list.push(gen(paragraph))
    list.push(gen(r))
    paragraph = {type:'paragraph', childs:[]}
    return list
  }
}

let lineUntil = function (regexp, options={}) {
  let list = []
  for (lineIdx++; lineIdx < lineTop; lineIdx++) {
    let line1 = line()
    if (line().match(regexp)) break
    if (options.compile) line1 = inline(line1)
    list.push(line1)
  }
  return list
}

// EMPTY = \s*
let EMPTY = function () {
  if (line().trim().length !== 0) return null
  let emptyCount = 1
  for (lineIdx++; lineIdx < lineTop; lineIdx++) {
    if (line().trim().length != 0) break
    emptyCount ++
  }
  return {type:'empty', count: emptyCount}
}

// CODE = ```\n.*\n```
let CODE = function () {
  let line1 = line()
  if (!line1.startsWith('```')) return null
  let lang = line1.match(/^```(\S*)/)[1]
  let childs = lineUntil(/^```/)
  lineIdx ++
  return gen({type:'code', lang, body:childs.join('\n')})
}

// MARK = (\n>.*)+
let MARK = function () {
  if (!line().startsWith('>')) return null
  let childs = []
  for (; lineIdx < lineTop; lineIdx++) {
    let line1 = line()
    if (!line().startsWith('>')) break
    childs.push(genLine(line1.substr(1)))
  }
  return gen({type:'mark', childs})
}

// TABBLOCK = (\n(TAB).*)+
let TABBLOCK = function () {
  if (!line().startsWith('    ')) return null
  let childs = []
  for (; lineIdx < lineTop; lineIdx++) {
    let line1 = line()
    if (!line().startsWith('    ') && line().trim().length > 0) break
    childs.push(line1.substr(4))
  }
  return gen({type:'tabBlock', childs})
}

// MATH = \n$$(\w+)\n(..*)\n$$
let MATH = function () {
  if (line() !== '$$' && line() !== '```math') return null
  let childs = lineUntil(/^((\$\$)|(```))/)
  lineIdx ++
  return gen({type:'math', body:childs.join('\n')})
}

// [id]: url/to/image  "Optional title attribute"
// REF = \n[.*]:
let REF = function () {
  let m = line().match(/^\[(.*?)\]:\s*(.*?)(\s*"(.*?)")?$/)
  if (m == null) return null
  lineIdx++
  const [id, href, title] = [m[1], m[2], m[4]]
  refMap[id] = href
  return gen({ type: 'ref', id, href, title })
}

let REF1 = function () {
  let m = line().match(/^\[(.*?)]$/)
  if (m == null) return null
  return gen({ type: 'ref1', id: m[1] })
}

let HEADER = function () {
  let line1 = lines[lineIdx], line2 = lines[lineIdx+1]
  let m = line1.match(/^(#+)(.*)$/) // # ....
  if (m != null) {
    let r = {type:'header', level:m[1].length, childs:inline(m[2])}
    lineIdx++
    return gen(r)
  }
  if (line2 == null) return null
  m = line2.match(/^((===+)|(---+))$/)
  if (m == null) return null
  lineIdx += 2
  let level = (m[1].startsWith('=')) ? 1 : 2
  return gen({type:'header', level, childs:inline(line1)})
}

let HLINE = function () {
  let m = line().match(/^((---+)|(\*\*\*+))$/)
  if (m == null) return null
  lineIdx++
  return gen({type:'hline', level:m[1].length, body:m[2]})
}

let TABLE = function () {
  let line1 = lines[lineIdx]
  if (line1.indexOf('|') < 0) return null
  let line2 = lines[lineIdx+1]
  let m = line2.match(/^(\-*?\|)+\-*?$/)
  if (m == null) return null
  let childs = [ genLine(line1), genLine(line2) ]
  for (lineIdx+=2; lineIdx < lineTop; lineIdx++) {
    let tline = line()
    if (tline.indexOf('|')<0) break
    childs.push(genLine(tline))
  }
  return gen({type:'table', childs})
}

let LIST = function (level=0) {
  let m = line().match(/^(\s*)((\*)|(\d+\.))\s/)
  if (m == null) return null
  if (m[1].length < level*4) return null
  let childs = []
  let listType = (m[2][0]==='*') ? 'ul' : 'ol'
  for (; lineIdx < lineTop; lineIdx++) {
    let tline = line(), tChilds = null
    if (tline.trim().length === 0) continue
    m = tline.match(/^(\s*)((\*)|(\d+\.))\s(.*)$/)
    if (m == null) break
    if (m[1].length >= (level+1)*4) {
      tChilds = LIST(level+1)
      childs.push(tChilds)
      let line1 = line()
      if (line1 == null) break
      m = line1.match(/^(\s*)((\*)|(\d+\.))\s(.*)$/)
      if (m == null) break
    }
    if (m[1].length < level * 4) break
    let tType = (m[2][0]==='*') ? 'ul' : 'ol'
    if (tType !== listType) break
    childs.push(gen({type:'li', level, childs: inline(m[5])}))
  }
  return gen({type:'list', level, listType, childs})
}
