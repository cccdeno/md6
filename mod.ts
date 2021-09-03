import C from './src/compiler.js'
import G from './src/generator.js'

export function parse(md:string) {
  return C.compile(md, G.treeGen)
}

export function newHtmlRender(options:object) {
  return new G.HtmlGenerator(options)
}

export const defaultHtmlRender = newHtmlRender({})

export function toHtml(md:string) {
  return defaultHtmlRender.render(md)
}
