import * as z from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";
import { Checkbox } from "./components/ui/checkbox";
const SignUpSchema = z.object({
  firstName: z.string().min(1, "Field is required"),
  lastName: z.string().min(2, "Field is required"),
  email: z.string().email("Enter valid email"),
  password: z
    .string()
    .min(6, "Password should be atleast 6 characters long")
    .max(20, "Password should be atmost 20 characters long"),
});
type signin = z.infer<typeof SignUpSchema>;
const SignUp = () => {
  const [doc, setDoc] = useState(false);
  const [loading, setLoading] = useState(false);
  const [specialty, setSpec] = useState("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signin>({ resolver: zodResolver(SignUpSchema) });
  const onSubmit: SubmitHandler<signin> = async (data) => {
    console.log(data);
    toast("Signing Up a user");
    setLoading(true);
    try {
      const body = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        specialty: specialty,
      };
      const res = await axios.post(
        `https://steps-ai.onrender.com/api/${doc ? "doc" : "patient"}/register`,
        body,
        {
          withCredentials: true,
        }
      );
      console.log(res.data);
      toast.success("Signed up successfully");
      setLoading(false);
      navigate("/signin");
    } catch (err) {
      console.log(err);
      toast.error("something went wrong while signing in!");
      setLoading(false);
    }
  };
  return (
    <div className="min-h-[80dvh] flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form flex flex-col gap-3 md:w-1/2  w-full py-4 px-6 "
      >
        <p className="text-center">
          Already registered?{"   "}
          <Link to="/signIn" className="underline">
            SignIn
          </Link>
        </p>
        <div className="flex flex-col gap-2 items-start">
          <label>First Name</label>
          <Input type="text" placeholder="Arpit" {...register("firstName")} />
          {errors.firstName && (
            <span className="text-red-500">{errors.firstName.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-2 items-start">
          <label>Last Name</label>
          <Input type="text" placeholder="Blagan" {...register("lastName")} />
          {errors.lastName && (
            <span className="text-red-500">{errors.lastName.message}</span>
          )}
        </div>
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
            type="text"
            placeholder="@123arpit"
            {...register("password")}
          />
          {errors.password && (
            <span className="text-red-500">{errors.password.message}</span>
          )}
        </div>
        <div className="flex items-center justify-end gap-3">
          <Checkbox
            checked={doc}
            onCheckedChange={() => {
              setDoc(!doc);
            }}
          />
          <label className="text-gray-600 text-sm">As A Doctor</label>
        </div>
        {doc && (
          <div className="flex flex-col gap-2 items-start">
            <label>Specialty</label>
            <Input
              type="text"
              placeholder="cardiology"
              value={specialty}
              onChange={(e) => {
                setSpec(e.target.value);
              }}
            />
          </div>
        )}
        <Button disabled={loading}>{loading ? "Signing up" : "SignUp"}</Button>
      </form>
    </div>
  );
};

export default SignUp;
