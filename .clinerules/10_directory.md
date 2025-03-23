# ディレクトリ構造について

このプロジェクトでのディレクトリ構造は次の通りです。

```
.clinerules/    # 複数のcline rulesを入れたディレクトリ
.devcontainer/  # devContainer設定ファイル。修正不可。
src/            # Chrome拡張のソースコード
node_modules/   # Node.jsのモジュール。修正不可。
```

利用上の注意です。

- `src` ディレクトリの中は自由に読み込み・書き込み可能です。
- 他のディレクトリは参照のみです。修正不可です。

