// import * as md6 from 'https://deno.land/x/md6/mod.ts'
import * as md6 from '../mod.ts'

let doc = `
<div>
This is a div
</div>

<!-- This is comment -->

# Chapter

<div> xxx </div>

\`\`\`
pub6 <path_to_folder> <port>
\`\`\`

## Section 1

A link to [YouTube](http://tw.youtube.com) that you may click

![Image1](../img/image.jpg)

</body>
`

let html = md6.toHtml(doc)

console.log(html)

