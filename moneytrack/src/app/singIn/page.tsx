"use client";
import { Hammersmith_One, Montserrat } from "next/font/google";
import eyeC from "../assets/eye-fill.svg";
import eyeO from "../assets/eye-fill-o.svg";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AddUser, ResponseError } from "../http/addUser";
import { UserType } from "../../@types/userType";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Loader from "../components/loader";
const hammersmithOne = Hammersmith_One({
  weight: "400",
  subsets: ["latin"],
});
const montserrat = Montserrat({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const getRegister = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  confirmPassword: z.string().min(1, "Confirm Password is required"),
  email: z.string().email("Email Invalido"),
});

type LoginForm = z.infer<typeof getRegister>;

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const [validPassword, setValidPassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState } = useForm<LoginForm>({
    resolver: zodResolver(getRegister),
  });

  const handleCompar = () => {
    const password = document.getElementById("password") as HTMLInputElement;
    const confirmPassword = document.getElementById(
      "confirmPassword"
    ) as HTMLInputElement;
    setValidPassword(password.value == confirmPassword.value);
  };

  const router = useRouter();
  async function handleSubmitForm(data: LoginForm) {
    if (validPassword) {
      setIsLoading(true);
      const newUser: UserType = {
        id: 0,
        name: data.username,
        username: data.username,
        email: data.email,
        password: data.password,
      };

      const res = await AddUser(newUser);
      if (res == true) {
        router.push("login");
      } else {
        setIsLoading(false);
        toast.error("Erro ao cadastrar\n" + (res as ResponseError).message);
      }
    } else {
      toast.error("Senhas não são iguais");
    }
  }

  return (
    <div className="bg-zinc-100 flex items-center justify-center h-screen w-screen py-12">
      <div className="bg-green-500 flex flex-col justify-around drop-shadow-xl rounded-md w-[450px] h-full px-20 py-0 ">
        <div className="flex flex-col items-center justify-center w-full h-fit">
          <h1
            className={`${hammersmithOne.className} text-green-50 text-5xl text-center pt-10`}
          >
            CADASTRAR
          </h1>
        </div>
        <form action="" className="flex flex-col items-center justify-center ">
          <div className="flex flex-col w-full  gap-2.5">
            <label
              htmlFor="username"
              className={`text-sm ${montserrat.className} text-green-50`}
            >
              Username{" "}
              {formState.errors.username && (
                <span className="text-red-500">Campo Obrigatorio</span>
              )}
            </label>
            <input
              type="text"
              className="border border-gray-900 bg-zinc-50 rounded-full p-1 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 drop-shadow-2xl"
              placeholder={`Enter your Username`}
              {...register("username")}
            />
          </div>
          <div className="flex flex-col w-full  gap-2.5">
            <label
              htmlFor="email"
              className={`text-sm ${montserrat.className} text-green-50`}
            >
              Email{" "}
              {formState.errors.email && (
                <span className="text-red-500">
                  Campo Obrigatorio {formState.errors.email.message}
                </span>
              )}
            </label>
            <input
              type="text"
              className="border border-gray-900 bg-zinc-50 rounded-full p-1 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 drop-shadow-2xl"
              placeholder={`Enter your email`}
              {...register("email")}
            />
          </div>
          <div className="flex flex-col w-full  gap-2.5 relative">
            <label
              htmlFor="password"
              className={`text-sm ${montserrat.className} text-green-50`}
            >
              Senha{" "}
              {formState.errors.password && (
                <span className="text-red-500">Campo Obrigatorio</span>
              )}
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="border border-gray-900 bg-zinc-50 rounded-full p-1 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 drop-shadow-2xl"
              placeholder={`Enter your Password`}
              {...register("password")}
            />
            <div
              className="absolute right-3 top-1/2 transform -translate-x-3.5 -translate-0.5 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              <Image
                src={showPassword ? eyeO : eyeC}
                alt="Toggle password visibility"
                width={20}
                height={20}
              />
            </div>
          </div>
          <div className="flex flex-col w-full  gap-2.5 relative">
            <label
              htmlFor="confirmPassword"
              className={`text-sm ${montserrat.className} text-green-50`}
            >
              Confirmar Senha{" "}
              {formState.errors.confirmPassword && (
                <span className="text-red-500">Campo Obrigatorio</span>
              )}{" "}
              {!validPassword && (
                <span className="text-red-700">Senhas não conferem</span>
              )}
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              className="border border-gray-900 bg-zinc-50 rounded-full p-1 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 drop-shadow-2xl"
              placeholder={`Enter your Password`}
              {...register("confirmPassword")}
              onChange={handleCompar}
            />
            <div
              className="absolute right-3 top-1/2 transform -translate-x-3.5 -translate-0.5 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              <Image
                src={showPassword ? eyeO : eyeC}
                alt="Toggle password visibility"
                width={20}
                height={20}
              />
            </div>
          </div>
        </form>
        <div className="flex gap-7 flex-col w-full justify-center items-center  p-3.5 ">
          <button
            type="submit"
            onClick={handleSubmit(handleSubmitForm)}
            className="bg-green-50 text-green-500 cursor-pointer rounded-full py-1 px-4 w-full hover:bg-green-100  transition duration-300 ease-in-out drop-shadow-2xl"
          >
            {isLoading ? (
              <div className="w-full h-full flex justify-center items-center">
                <Loader />
              </div>
            ) : (
              <p>Salvar</p>
            )}
          </button>
          <Link href="/login" className="w-full ">
            <button className="bg-green-500 text-green-50 border-green-50 border-2 cursor-pointer rounded-full py-1 px-4 w-full drop-shadow-2xl">
              Entrar
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
