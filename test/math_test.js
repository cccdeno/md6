import {ok} from 'https://deno.land/x/tdd/mod.ts'
import * as md6 from '../mod.ts'

const exp = '\int_0^{\infty} f(x) dx'

Deno.test('pandoc:embedded math', function() {
  let html = md6.toHtml('# math \nembedded math: $'+exp+'$ formula !')
  console.log('html=', html)
  ok(html.indexOf('\\(') > 0)
})

Deno.test('pandoc:blocked math', function() {
  let html = md6.toHtml('# math \n$$\n'+exp+'\n$$\n end !')
  console.log('html=', html)
  ok(html.indexOf('\\[') > 0)
})

Deno.test('gitlab: embedded math', function() {
  let html = md6.toHtml('# math \nembedded math: $`'+exp+'`$ formula !')
  console.log('html=', html)
  ok(html.indexOf('\\(') > 0)
})

Deno.test('gitlab: blocked math', function() {
  let html = md6.toHtml('# math \n```math\n'+exp+'\n```\n end !')
  console.log('html=', html)
  ok(html.indexOf('\\[') > 0)
})
