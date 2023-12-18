import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm, SubmitHandler } from "react-hook-form";

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
      <div>
        <p>email</p>
        <input type="email" {...register("email")} />
        {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
      </div>
      <div>
        <p>password</p>
        <input type="password" {...register("password")} />
        {errors.password && (
          <p style={{ color: "red" }}>{errors.password.message}</p>
        )}
      </div>
      <div>
        <p>次回から自動的にログインする</p>
        <input type="checkbox" {...register("shouldStayLoggedIn")} />
      </div>
      <button type="submit">会員登録する</button>
    </form>
  );
}
