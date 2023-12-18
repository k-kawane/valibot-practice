import {
  object,
  email,
  string,
  minLength,
  maxLength,
  regex,
  coerce,
  boolean,
  type Output,
} from "valibot";

export const registerUserSchema = object({
  email: string([
    minLength(1, "メールアドレスを入力してください"),
    email("有効なメールアドレスを入力してください"),
  ]),
  password: string([
    minLength(1, "パスワードを入力してください"),
    minLength(8, "パスワードは8文字以上で入力してください"),
    maxLength(100, "パスワードは100文字以内で入力してください"),
    regex(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,100}$/i,
      "パスワードは半角英数字混合で入力してください"
    ),
  ]),
  shouldStayLoggedIn: coerce(boolean(), (input) => JSON.parse(`${input}`)),
});

export type RegisterUser = Output<typeof registerUserSchema>;
