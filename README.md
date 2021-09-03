# md6: A Deno Package Converts Markdown into HTML

md6 support math plugin syntax for [pandoc](https://pandoc.org/MANUAL.html#math) and [gitlab](https://docs.gitlab.com/ee/user/markdown.html#math) .

## Example 1

File : ex1.js

```js
import * as md6 from '../mod.ts'

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
```

## Run

```
$ deno run ex1.js

<h1> Chapter</h1>

<h2> Section 1</h2>

<p>A link to <a href="http://tw.youtube.com" alt="">YouTube</a> that you may click</p>

<p><figure>
  <img src="../img/image.jpg" alt=""></img>
<figcaption>Image1</figcaption></figure>
</p>

<h1>This is an H1</h1>

<h2>This is an H2</h2>

<h2> Math</h2>

<p>Support pandoc and gitlab extension</p>

<h3> Pandoc syntax</h3>

<p>An embedded \(int f(x) dx\) math expression.</p>     

\[int f(x) dx\]

<h3> Gitlab syntax</h3>

<p>An embedded \(int f(x) dx\) math expression.</p>     

\[int f(x) dx\]

<h2> Conclustion</h2>

<p>End</p>
<p></p>
```

## Show Math in Browser

You may use MathJax or KaTex to render the output html of md6.

The MathJax Example:

```html
<script>
MathJax = {
  tex: {
    inlineMath: [['\\(', '\\)']],
    displayMath: [ ['\\[','\\]'] ]
  }
}
</script>


<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js">

...
```
