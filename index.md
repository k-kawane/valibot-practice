# Valibot と同じ作者のフォームライブラリ Modular Forms を試してみた

## はじめに

こんにちは。株式会社 JMDC の川根です。
プロダクト開発部で製薬企業向けサービスの web フロントエンドの設計・開発を担当しています。

本記事は、JMDC Advent Calendar 2023 20 日目の記事です。
[https://qiita.com/advent-calendar/2023/jmdc]

現在、上記サービスのフロントエンドの堅牢性やメンテナビリティを向上させるため、リアーキテクト・リファクタリングに取り組んでいます。
それに伴い、フォームのスキーマ検証に使用している Yup をより Type Safe な Zod や Valibot へ置き換えることを検討していました。

Zod を業務で使用したことはありますが、Valibot を使用したことはありませんでした。
Zod に比べバンドルサイズを大幅に計量化できると噂の Valibot が気になり、調査を進めるうちに Modular Forms の存在を知りました。せっかくなので、Valibot と合わせて Modular Forms を試してみました。

## Modular Forms とは

主にフォームの状態管理と入力検証を処理するライブラリで、作者は Valibot と同じ [Fabian Hiller](https://github.com/fabian-hiller) という方です。
公式ドキュメントのトップには以下のようにハイライトが記載されています。

- Small bundle size
- Fully type safe
- Fine-grained updates
- Validate everything
- Headless design
- Powerful features

こちらも Valibot のようにバンドルサイズはかなり小さく、公式には 3 KB〜と記載がありますね。

[https://modularforms.dev/]
[https://valibot.dev/]

## 使ってみた

例として以下のような会員登録フォームを作成するとします。

- メールアドレスを入力するテキストボックス
- パスワードを入力するテキストボックス
- 次回から自動的にログインするかどうかを選択するチェックボックス
- フォームを送信するボタン

### スキーマ定義

まずは Valibot でスキーマを定義します。

```.ts
import {
  type Output,
  boolean,
  coerce,
  email,
  maxLength,
  minLength,
  object,
  regex,
  string,
} from 'valibot';

export const registerUserSchema = object({
  email: string([
    minLength(1, 'メールアドレスを入力してください'),
    email('有効なメールアドレスを入力してください'),
  ]),
  password: string([
    minLength(1, 'パスワードを入力してください'),
    minLength(8, 'パスワードは8文字以上で入力してください'),
    maxLength(100, 'パスワードは100文字以内で入力してください'),
    regex(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,100}$/i,
      'パスワードは半角英数字混合で入力してください'
    ),
  ]),
  shouldStayLoggedIn: coerce(boolean(), (input) => JSON.parse(`${input}`)),
});

export type RegisterUser = Output<typeof registerUserSchema>;
```

Zod とそんなに変わりませんね。
メールアドレスは valibot の email() でバリデートし、パスワードは 8 文字以上 100 文字以内の半角英数字、次回から自動的にログインするかどうかは checkbox から string で受け取った入力を `JSON.parse` で boolean に変換しています。

ではこれを使ってフォームを作成します。

### React Hook Form で書いてみる

まずは多くの方が慣れているであろう React Hook Form で書いていきます。

```.tsx
import { valibotResolver } from '@hookform/resolvers/valibot';
import { type SubmitHandler, useForm } from 'react-hook-form';

import { type RegisterUser, registerUserSchema } from './schema';

export function RegisterUserForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterUser>({
    defaultValues: {
      shouldStayLoggedIn: false,
    },
    resolver: valibotResolver(registerUserSchema),
  });

  const onSubmit: SubmitHandler<RegisterUser> = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="email">email</label>
      <input id="email" type="email" {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}
      <label htmlFor="password">password</label>
      <input id="password" type="password" {...register('password')} />
      {errors.password && <p>{errors.password.message}</p>}
      <input id="should-stay-logged-in" type="checkbox" {...register('shouldStayLoggedIn')} />
      <label htmlFor="should-stay-logged-in">次回から自動的にログインする</label>
      <button type="submit">会員登録する</button>
    </form>
  );
}
```

こんな感じになるかと思います。
zodResolver のように valibotResolver が用意されているので、Zod と同じように使えますね。（style は本題と関係ないのでコードから省略しています）

### Modular Forms で書いてみる

これを Modular Forms で書いてみるとこうなります

※ `@modular-forms/react` に加え、内部実装に使用されている ​​ `@preact/signals-react` を合わせて install する必要があります

```.tsx
import { type SubmitHandler, useForm, valiForm } from '@modular-forms/react';

import { type RegisterUser, registerUserSchema } from './schema';

export const RegisterUserForm = () => {
  const [registerUserForm, { Form, Field }] = useForm<RegisterUser>({
    initialValues: {
      shouldStayLoggedIn: false,
    },
    validate: valiForm(registerUserSchema),
  });

  const handleSubmit: SubmitHandler<RegisterUser> = (data) => {
    console.log(data);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <label htmlFor="email">email</label>
      <Field name="email">
        {(field, props) => (
          <>
            <input {...props} id="email" type="email" />
            {field.error ? <p>{field.error}</p> : null}
          </>
        )}
      </Field>
      <label htmlFor="password">password</label>
      <Field name="password">
        {(field, props) => (
          <>
            <input {...props} id="password" type="password" />
            {field.error ? <p>{field.error}</p> : null}
          </>
        )}
      </Field>
      <Field name="shouldStayLoggedIn" type="boolean">
        {(_, props) => <input {...props} id="should-stay-logged-in" type="checkbox" />}
      </Field>
      <label htmlFor="should-stay-logged-in">次回から自動的にログインする</label>
      <button type="submit">会員登録する</button>
    </Form>
  );
};
```

少し印象が変わりましたね。ポイントはいくつかあって、

- useForm の戻り値がタプルなこと
  - 例では使っていませんが、タプルの一つ目の値には form の store が格納されています。（これは例えばローディング表示に使う `registerUserForm.submitting` のような値が取得できます）
- Form と Field というヘッドレスなコンポーネントを用いて JSX を作成すること
- Field コンポーネントが RenderProps パターンを採用していること

あたりです。その他は React Hook Form とそんなに変わらないですね。
こんな感じで問題なく動かすことができました。

## おわりに

今回は比較的新しいスキーマ検証ライブラリの Valibot と、同じ作者の Modular Forms に React Hook Form から置き換える方法をご紹介しました。
プロダクションコードに反映するには周辺のエコシステムがどのくらい整っているかも考慮する必要がありますが、単体では React Hook Form のように問題なく使えそうという印象です。

明日 24 日目は、谷脇さんによる「サーベイメール一斉送信の負荷対策」です。お楽しみに！

JMDC では、ヘルスケア領域の課題解決に一緒に取り組んでいただける方を積極採用中です！
フロントエンド /バックエンド/ データベースエンジニア等、様々なポジションで募集をしています。
詳細は下記の募集一覧からご確認ください。
[https://hrmos.co/pages/jmdc:embed:cite]

まずはカジュアルに JMDC メンバーと話してみたい／経験が活かせそうなポジションの話を聞いてみたい等ございましたら、下記よりエントリーいただけますと幸いです。
[https://hrmos.co/pages/jmdc/jobs/engineer-open:embed:cite]

★ 最新記事のお知らせはぜひ X（Twitter）をご覧ください！
[https://twitter.com/jmdc_tech]
