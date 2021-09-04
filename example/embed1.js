// import * as md6 from 'https://deno.land/x/md6/mod.ts'
import * as md6 from '../mod.ts'

let doc = `
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

let html = md6.toHtml(doc)

console.log(html)

