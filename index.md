# Valibot practice

## 概要
フォームのバリデーションライブラリにZodを使っていたが、最近よく聞くValibotを試してみた。

### 動機

Zodでtransformすると、react hook formでtransform前後の型の不整合エラーが起き、asでアサーションしなければいけない。
この不満がvalibotで置き換えることによって発生しまくなればいいな、と思い検証してみる。
Zodよりバンドルサイズが大幅に小さいという評判もあるので、そのへんのメリットも享受できるといいな。

## 環境構築

まずはLTS最新版のNodeをinstall(2023年12月17日現在)
```.sh
% fnm install 20.10.0
```
（Nodeのパッケージマネージャーにはfnmを使用）

package.jsonの作成
```.sh
% pnpm init
```
（NPMパッケージのパッケージマネージャーにはpnpmを使用）

## まずはZodやってみる

## 参考