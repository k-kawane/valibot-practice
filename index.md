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

ViteのReactテンプレートを使用
```.sh
pnpm create vite valibot-practice --template react
```

ここで色々エラーが発生
```.sh
 WARN  GET https://registry.npmjs.org/@types%2Freact error (ERR_INVALID_THIS). Will retry in 1 minute. 1 retries left.
 WARN  GET https://registry.npmjs.org/@types%2Freact-dom error (ERR_INVALID_THIS). Will retry in 1 minute. 1 retries left.
 WARN  GET https://registry.npmjs.org/@vitejs%2Fplugin-react error (ERR_INVALID_THIS). Will retry in 1 minute. 1 retries left.
 WARN  GET https://registry.npmjs.org/vite error (ERR_INVALID_THIS). Will retry in 1 minute. 1 retries left.
 WARN  GET https://registry.npmjs.org/react error (ERR_INVALID_THIS). Will retry in 1 minute. 1 retries left.
 WARN  GET https://registry.npmjs.org/react-dom error (ERR_INVALID_THIS). Will retry in 1 minute. 1 retries left.
 ERR_PNPM_META_FETCH_FAIL  GET https://registry.npmjs.org/@types%2Freact-dom: Value of "this" must be of type URLSearchParams
 ERR_PNPM_META_FETCH_FAIL  GET https://registry.npmjs.org/@types%2Freact: Value of "this" must be of type URLSearchParams
 ERR_PNPM_META_FETCH_FAIL  GET https://registry.npmjs.org/vite: Value of "this" must be of type URLSearchParams
```

https://github.com/pnpm/pnpm/issues/6424

Nodeのバージョンを下げてみる
```.sh
% fnm list-remote
% fnm install 19.9.0
```

無事`pnpm dev`成功

## まずはZodでやってみる
 ```.sh
 % pnpm install react-hook-form zod
 ```

こんな年齢確認をフォームを想定
```.tsx
import './App.css'
import {useForm, SubmitHandler} from "react-hook-form"

type FormValues = {
  age: number
}

function App() {
  const { register, handleSubmit} = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p>年齢を入力してください</p>
      <input placeholder='20' {...register("age")} />
      <button type='submit'>submit</button>
    </form>
  )
}

export default App
```

文字列をZodで数字に変換してみる
```.sh
% pnpm install @hookform/resolvers
```

```.ts
import { z } from "zod"

export const ageVerification = z.object({
  age: z.coerce.number()
})

export type AgeVerification = z.infer<typeof ageVerification>
```

```.ts
import './App.css'
import { useForm, SubmitHandler } from "react-hook-form"
import { AgeVerification, ageVerification } from './schema'
import { zodResolver } from '@hookform/resolvers/zod';


function App() {
  const { register, handleSubmit } = useForm<AgeVerification>({
    resolver: zodResolver(ageVerification),
    defaultValues: {
      age: 20
    }
  });

  const onSubmit: SubmitHandler<AgeVerification> = (data) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p>年齢を入力してください</p>
      <input placeholder='20' {...register("age")} />
      <button type='submit'>submit</button>
    </form>
  )
}

export default App
```

簡単な型変換ならそれでいいが、transformするとasを書かないといけなくなる
```.ts
import { z } from "zod"

export const ageVerification = z.object({
  age: z.string()
}).transform((values)=> {
  return {
    age: Number(values.age)
  }
})

export type AgeVerification = z.infer<typeof ageVerification>
```

```.tsx
import './App.css'
import { useForm, SubmitHandler } from "react-hook-form"
import { AgeVerification, ageVerification } from './schema'
import { zodResolver } from '@hookform/resolvers/zod';


function App() {
  const { register, handleSubmit, formState: {errors} } = useForm<AgeVerification>({
    resolver: zodResolver(ageVerification),
    defaultValues: {
      age: "20" as unknown as number
    }
  });

  const onSubmit: SubmitHandler<AgeVerification> = (data) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p>年齢を入力してください</p>
      <input {...register("age")} />
      {errors.age?.message && <p style={{color: 'red'}}>{errors.age.message}</p>}
      <button type='submit'>submit</button>
    </form>
  )
}

export default App
```

### valibot使ってみた

## 参考