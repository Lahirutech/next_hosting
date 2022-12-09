import { useRouter } from "next/router";
import { type } from "os";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const createUserSchema = object({
  name: string().min(1, {
    message: "Name is required",
  }),
  password: string()
    .min(6, "Password too short - should be 6 chars minimum")
    .min(1, {
      message: "Password is required",
    }),
  passwordConfirmation: string().min(1, {
    message: "passwordConfirmation is required",
  }),
  email: string({
    required_error: "Email is required",
  })
    .email("Not a valid email")
    .min(1, {
      message: "Password is required",
    }),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Passwords do not match",
  path: ["passwordConfirmation"],
});

type CreateserInput = TypeOf<typeof createUserSchema>;

function RegisterPage() {
  const router = useRouter();
  const [registerError, setRegisterError] = useState(null);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateserInput>({
    resolver: zodResolver(createUserSchema),
  });

  const onSubmit = async (values: CreateserInput) => {
    console.log("values", values);
  };

  return (
    <>
      <p>{registerError}</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-element">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="jane.doe@example.com"
            {...register("email")}
          />
          <p>{errors.email?.message}</p>
        </div>

        <div className="form-element">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Jane Doe"
            {...register("name")}
          />
          <p>{errors.name?.message}</p>
        </div>

        <div className="form-element">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="*********"
            {...register("password")}
          />
          <p>{errors.password?.message}</p>
        </div>

        <div className="form-element">
          <label htmlFor="passwordConfirmation">Confirm password</label>
          <input
            id="passwordConfirmation"
            type="password"
            placeholder="*********"
            {...register("passwordConfirmation")}
          />
          <p>{errors.passwordConfirmation?.message}</p>
        </div>
        <button type="submit">SUBMIT</button>
      </form>
    </>
  );
}
export default RegisterPage;
