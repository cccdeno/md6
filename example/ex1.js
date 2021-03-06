import * as md6 from 'https://deno.land/x/md6/mod.ts'

let html = md6.toHtml(`
# Chapter

## Section 1

A link to [YouTube](http://tw.youtube.com) that you may click

![Image1](../img/image.jpg)

This is an H1
=============

This is an H2
-------------

## Math

Support pandoc and gitlab extension

### Pandoc syntax

An embedded $\int f(x) dx$ math expression.

$$
\int f(x) dx
$$

### Gitlab syntax

An embedded $\`\int f(x) dx\`$ math expression.

\`\`\`math
\int f(x) dx
\`\`\`

## Conclustion

End
`)

console.log(html)

