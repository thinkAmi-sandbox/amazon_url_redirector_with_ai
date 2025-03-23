# 解決すべき問題

amazon.co.jpドメインのWebサイト(以降、Amazonと呼びます)は、アクセスしたときの方法により、複数のURLが同一のWebページを指しています。他人にAmazonのページを紹介したいときにChromeのアドレスバーをコピー＆ペースとしますが、場合によっては長いURLの共有になり、お互い分かりづらいURLとなってしまいます。

そこで、Chrome拡張機能で制御することにより、常に同一のURLをアドレスバーに表示できるようにします。


# Chrome拡張の機能

- Amazonへアクセスした際、`https://www.amazon.co.jp/dp/<ASIN>` という「一番短いAmazonのURL形式」に正規表現でマッチしているかにより、処理を分岐します。
  - マッチしている場合、何もしません
  - マッチしていない場合、以下の「AmazonのURL形式のパターンについて」で記載されているパターンに正規表現でマッチしているかを確認します
    - 「AmazonのURL形式のパターンについて」にマッチした場合、 `https://www.amazon.co.jp/dp/<ASIN>` 形式のURLへリダイレクトします
    - 「AmazonのURL形式のパターンについて」にマッチしない場合、何もしません


# AmazonのURL形式のパターンについて

[出典](https://unoh.github.io/2008/03/25/amazonurlasin.html)によると、以下のパターンがあると考えられます。 `<ASIN>` の部分には商品ごとに異なるASINやISBNの値が設定されます。

- `https://www.amazon.co.jp/exec/obidos/ASIN/<ASIN>`
- `https://www.amazon.co.jp/o/ASIN/<ASIN>`
- `https://www.amazon.co.jp/exec/obidos/ISBN=<ASIN>`
- `https://www.amazon.co.jp/exec/obidos/ISBN%3D<ASIN>`
- `https://www.amazon.co.jp/o/ISBN=<ASIN>`
- `https://www.amazon.co.jp/exec/obidos/tg/detail/-/<ASIN>`
- `https://www.amazon.co.jp/exec/obidos/tg/detail/-/Elements-Style/<ASIN>`
- `https://www.amazon.co.jp/o/tg/detail/-/<ASIN>`
- `https://www.amazon.co.jp/o/tg/detail/-/Elements-Style/<ASIN>`
- `https://www.amazon.co.jp/gp/product/<ASIN>`
- `https://www.amazon.co.jp/gp/product/product-description/<ASIN>`
- `https://www.amazon.co.jp/dp/<ASIN>`
- `https://www.amazon.co.jp/Elements-Style/dp/<ASIN>`
- `https://www.amazon.co.jp/Elements-Style/dp/product-description/<ASIN>`
- `https://www.amazon.co.jp/%E3%83%97%E3%83%AD%E3%82%B0%E3%83%A9%E3%83%9F%E3%83%B3%E3%82%B0Rust-%E7%AC%AC2%E7%89%88-Jim-Blandy/dp/<ASIN>`

# Chrome拡張の動作に関する期待値について

次の表のように動作することを期待します。

|番号|URL|動作|
|---|---|---|
|1|https://www.amazon.co.jp/exec/obidos/ASIN/020530902X|`https://www.amazon.co.jp/dp/020530902X` へリダイレクト|
|2|https://www.amazon.co.jp/o/ASIN/020530902X|`https://www.amazon.co.jp/dp/020530902X` へリダイレクト|
|3|https://www.amazon.co.jp/exec/obidos/ISBN=020530902X|`https://www.amazon.co.jp/dp/020530902X` へリダイレクト|
|4|https://www.amazon.co.jp/exec/obidos/ISBN%3D020530902X|`https://www.amazon.co.jp/dp/020530902X` へリダイレクト|
|5|https://www.amazon.co.jp/o/ISBN=020530902X|`https://www.amazon.co.jp/dp/020530902X` へリダイレクト|
|6|https://www.amazon.co.jp/exec/obidos/tg/detail/-/020530902X|`https://www.amazon.co.jp/dp/020530902X` へリダイレクト|
|7|https://www.amazon.co.jp/exec/obidos/tg/detail/-/Elements-Style/020530902X|`https://www.amazon.co.jp/dp/020530902X` へリダイレクト|
|8|https://www.amazon.co.jp/o/tg/detail/-/020530902X|`https://www.amazon.co.jp/dp/020530902X` へリダイレクト|
|9|https://www.amazon.co.jp/o/tg/detail/-/Elements-Style/020530902X|`https://www.amazon.co.jp/dp/020530902X` へリダイレクト|
|10|https://www.amazon.co.jp/gp/product/020530902X|`https://www.amazon.co.jp/dp/020530902X` へリダイレクト|
|11|https://www.amazon.co.jp/gp/product/product-description/020530902X|`https://www.amazon.co.jp/dp/020530902X` へリダイレクト|
|12|https://www.amazon.co.jp/dp/020530902X|何もしない|
|13|https://www.amazon.co.jp/Elements-Style/dp/020530902X|`https://www.amazon.co.jp/dp/020530902X` へリダイレクト|
|14|https://www.amazon.co.jp/Elements-Style/dp/product-description/020530902X|`https://www.amazon.co.jp/dp/020530902X` へリダイレクト|
|15|https://www.amazon.co.jp/%E3%83%97%E3%83%AD%E3%82%B0%E3%83%A9%E3%83%9F%E3%83%B3%E3%82%B0Rust-%E7%AC%AC2%E7%89%88-Jim-Blandy/dp/4873119782/|`https://www.amazon.co.jp/dp/020530902X` へリダイレクト|
|16|https://www.amazon.co.jp/s?k=%E3%83%97%E3%83%AD%E3%82%B0%E3%83%A9%E3%83%9F%E3%83%B3%E3%82%B0+rust+%E7%AC%AC2%E7%89%88|何もしない|
|17|https://www.amazon.co.jp/dp/B09KZJXDN1?tag=hatena-22&linkCode=osi&th=1&psc=1/|`https://www.amazon.co.jp/dp/B09KZJXDN1` へリダイレクト|