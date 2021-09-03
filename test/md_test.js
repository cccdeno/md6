import {ok} from 'https://deno.land/x/tdd/mod.ts'
import * as md6 from '../mod.ts'

const md = `
[PARC]:https://en.wikipedia.org/wiki/PARC_(company)

* [PARC]

* [ABC]


user | description
-----|-------------
ccc  | abc <br/> def

aaa http://misavo.com bbb
aaa <http://misavo.com> bbb

http://misavo.com

<script>
  window.location.href = 'http://misavo.com'
</script>


\`\`\`
<script>
  window.location.href = 'http://misavo.com'
</script>
\`\`\`
`

Deno.test('md convert', function() {
  let html = md6.toHtml(md)
  console.log('html=', html)
  ok(html.indexOf('>PARC<') > 0)
})
