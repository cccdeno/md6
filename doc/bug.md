# bug

1. 已經處理 html tag，但若 markdown 中有 <...> 會被誤認為 html tag 導致呈現錯誤！

修改想法：先找出 ```...``` 的區段，與 `...` 的區段，將其中的 < 改為 &lt; > 改為 &gt;
