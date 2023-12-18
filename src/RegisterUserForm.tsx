import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm, SubmitHandler } from "react-hook-form";
import * as stylex from "@stylexjs/stylex";

import { registerUserSchema, RegisterUser } from "./schema";

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
      <div {...stylex.props(styles.textboxRow)}>
        <label htmlFor="email">email</label>
        <div {...stylex.props(styles.textboxContainer)}>
          <input
            id="email"
            type="email"
            {...register("email")}
            {...stylex.props(styles.textbox)}
          />
          {errors.email && (
            <p {...stylex.props(styles.errorMsg)}>{errors.email.message}</p>
          )}
        </div>
      </div>
      <div {...stylex.props(styles.textboxRow)}>
        <label htmlFor="password">password</label>
        <div {...stylex.props(styles.textboxContainer)}>
          <input
            id="password"
            type="password"
            {...register("password")}
            {...stylex.props(styles.textbox)}
          />
          {errors.password && (
            <p {...stylex.props(styles.errorMsg)}>{errors.password.message}</p>
          )}
        </div>
      </div>
      <div {...stylex.props(styles.checkboxRow)}>
        <input
          id="should-stay-logged-in"
          type="checkbox"
          {...register("shouldStayLoggedIn")}
        />
        <label htmlFor="should-stay-logged-in">
          次回から自動的にログインする
        </label>
      </div>
      <button type="submit" {...stylex.props(styles.button)}>
        会員登録する
      </button>
    </form>
  );
}

const styles = stylex.create({
  textboxRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 24,
    marginTop: 32,
  },
  textboxContainer: {
    textAlign: "left",
  },
  textbox: {
    fontSize: 16,
    paddingLeft: 16,
    paddingRight: 16,
    width: 400,
    height: 44,
  },
  checkboxRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 32,
  },
  errorMsg: {
    color: "#ff0000",
    height: 0,
    margin: 0,
  },
  button: {
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: "#00a745",
    width: "100%",
    height: 56,
    marginTop: 32,
  },
});
