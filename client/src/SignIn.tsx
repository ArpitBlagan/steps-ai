import * as z from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useState } from "react";
import { useContext } from "react";
import { contextt } from "./Contextt";
import { Checkbox } from "./components/ui/checkbox";
const SignInSchema = z.object({
  email: z.string().email("Enter valid email"),
  password: z
    .string()
    .min(6, "Password should be atleast 6 characters long")
    .max(20, "Password should be atmost 20 characters long"),
});
type signup = z.infer<typeof SignInSchema>;
const SignIn = () => {
  const value = useContext(contextt);
  const [loading, setLoading] = useState(false);
  const [doc, setDoc] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signup>({ resolver: zodResolver(SignInSchema) });
  const onSubmit: SubmitHandler<signup> = async (data: any) => {
    console.log(data);
    setLoading(true);
    try {
      const body = {
        email: data.email,
        password: data.password,
      };
      const res = await axios.post(
        `http://localhost:9000/api/${doc ? "doc" : "patient"}/login`,
        body,
        {
          withCredentials: true,
        }
      );
      console.log(res.data);
      value?.setInfo({
        isloggedIn: true,
        firstName: res.data.firstName,
        lastName: res.data.lastName,
        email: res.data.email,
        id: res.data.id,
        isDoctor: res.data.isDoctor,
        ws: null,
        makeConnection: true,
      });
      setLoading(false);
      toast.success("signined In successfully :) !");
      navigate("/");
    } catch (err) {
      toast.error("something went wrong while signing in :( !");
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80dvh] flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form flex flex-col gap-3 md:w-1/2   w-full py-4 px-6"
      >
        <p className="text-center">
          Don't have an account?{"   "}
          <Link to="/signUp" className="underline">
            SignUp
          </Link>
        </p>
        <div className="flex flex-col gap-2 items-start">
          <label>Email</label>
          <Input
            type="email"
            placeholder="arpit@gmail.com"
            {...register("email")}
          />
          {errors.email && (
            <span className="text-red-500">{errors.email.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-2 items-start">
          <label>Password</label>
          <Input
            type="password"
            placeholder="@123arpit"
            {...register("password")}
          />
          {errors.password && (
            <span className="text-red-500">{errors.password.message}</span>
          )}
        </div>
        <div className="flex items-center justify-start gap-4">
          <label>As a Doctor</label>
          <Checkbox
            checked={doc}
            onCheckedChange={() => {
              setDoc(!doc);
            }}
          />
        </div>
        <Button disabled={loading}>{loading ? "signing in" : "SignIn"}</Button>
      </form>
    </div>
  );
};
export default SignIn;
