import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

const createSessionSchema = object({
  email: string()
    .nonempty({
      message: "Email is required",
    })
    .email("Enter a valid Email"),
  password: string().nonempty({
    message: "Password is required",
  }),
});

type CreateSessionInput = TypeOf<typeof createSessionSchema>;

function LogingPage() {
  const router = useRouter();
  const [loginError, setLoginError] = useState(null);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateSessionInput>({
    resolver: zodResolver(createSessionSchema),
  });

  async function onSubmit(values: CreateSessionInput) {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/sessions`,
        values,
        { withCredentials: true }
      );
      router.push("/");
    } catch (e: any) {
      console.log("error", e);
      setLoginError(e.response.data);
    }
  }

  return (
    <>
      <p>{loginError}</p>
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
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="*********"
            {...register("password")}
          />
          <p>{errors.password?.message}</p>
        </div>

        <button type="submit">SUBMIT</button>
      </form>
    </>
  );
}

export default LogingPage;
