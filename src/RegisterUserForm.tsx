import * as stylex from "@stylexjs/stylex";
import { useForm, SubmitHandler, valiForm } from "@modular-forms/react";
import { registerUserSchema, RegisterUser } from "./schema";

export function RegisterUserForm() {
  const [registerUserForm, { Form, Field }] = useForm<RegisterUser>({
    validate: valiForm(registerUserSchema),
  });

  const onSubmit: SubmitHandler<RegisterUser> = (data) => {
    console.log(data);
  };

  return (
    <Form onSubmit={onSubmit}>
      <div {...stylex.props(styles.textboxRow)}>
        <label htmlFor="email">email</label>
        <div {...stylex.props(styles.textboxContainer)}>
          <Field name="email">
            {(field, props) => (
              <>
                <input
                  {...props}
                  id="email"
                  type="email"
                  {...stylex.props(styles.textbox)}
                />
                {field.error && (
                  <p {...stylex.props(styles.errorMsg)}>{field.error}</p>
                )}
              </>
            )}
          </Field>
        </div>
      </div>
      <div {...stylex.props(styles.textboxRow)}>
        <label htmlFor="password">password</label>
        <div {...stylex.props(styles.textboxContainer)}>
          <Field name="password">
            {(field, props) => (
              <>
                <input
                  {...props}
                  id="password"
                  type="password"
                  {...stylex.props(styles.textbox)}
                />
                {field.error && (
                  <p {...stylex.props(styles.errorMsg)}>{field.error}</p>
                )}
              </>
            )}
          </Field>
        </div>
      </div>
      <div {...stylex.props(styles.checkboxRow)}>
        <Field name="shouldStayLoggedIn" type="boolean">
          {(_, props) => (
            <input {...props} id="should-stay-logged-in" type="checkbox" />
          )}
        </Field>
        <label htmlFor="should-stay-logged-in">
          次回から自動的にログインする
        </label>
      </div>
      <button type="submit" {...stylex.props(styles.button)}>
        会員登録する
      </button>
    </Form>
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
