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
import { useRouter } from "next/navigation";
import { getlogin } from "../http/login";
import { LoginType } from "../../@types/userType";
import { AuthContext } from "../action/valid";
import { useContext } from "react";
import Loader from "../components/loader";
const hammersmithOne = Hammersmith_One({
  weight: "400",
  subsets: ["latin"],
});
const montserrat = Montserrat({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const getLogin = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof getLogin>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messageError, setMessageError] = useState("");
  const { register, handleSubmit, formState } = useForm<LoginForm>({
    resolver: zodResolver(getLogin),
  });

  const router = useRouter();
  const { Login } = useContext(AuthContext);

  async function handleSubmitForm(data: LoginForm) {
    setIsLoading(true);
    const response = await getlogin(data as LoginType);
    if (response.access_token) {
      await Login(response.access_token);
      router.push("/home");
      return;
    }
    setMessageError("Usuário ou senha inválidos");
    setIsLoading(false);
    return;
  }

  return (
    <div className="bg-zinc-100 flex items-center justify-center h-screen w-screen py-12">
      <div className="bg-zinc-50 flex flex-col  drop-shadow-xl rounded-md w-[480px] h-full px-20 py-0 justify-center items-center">
        <div>
          <h1
            className={`${hammersmithOne.className} text-green-700 text-6xl text-center pt-10`}
          >
            LOGIN
          </h1>
        </div>
        <form
          action=""
          className="flex flex-col items-center justify-center w-full"
        >
          <div className="flex flex-col w-full p-3.5 gap-2.5">
            <label
              htmlFor="username"
              className={`text-sm ${montserrat.className} text-green-950`}
            >
              Username{" "}
              {formState.errors.username && (
                <span className="text-red-500">Campo Obrigatorio</span>
              )}
            </label>
            <input
              type="text"
              className="border border-gray-900 bg-zinc-50 rounded-full p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 drop-shadow-2xl"
              placeholder={`Enter your Username`}
              {...register("username")}
            />
          </div>
          <div className="flex flex-col w-full p-3.5 gap-2.5 relative">
            <label
              htmlFor="password"
              className={`text-sm ${montserrat.className} text-green-950`}
            >
              Senha{" "}
              {formState.errors.password && (
                <span className="text-red-500">Campo Obrigatorio</span>
              )}
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className="border border-gray-900 bg-zinc-50 rounded-full p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 drop-shadow-2xl"
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
        </form>
        <div className="flex gap-7 flex-col w-full justify-center items-center  p-3.5">
          {messageError && (
            <p className="text-red-500 text-sm">{messageError}</p>
          )}
          <button
            type="submit"
            onClick={handleSubmit(handleSubmitForm)}
            className="bg-green-500 text-zinc-50 cursor-pointer rounded-full py-1 px-4 w-full hover:bg-green-600 h-[30px] transition duration-300 ease-in-out drop-shadow-2xl flex justify-center items-center"
          >
            {isLoading ? <Loader /> : <p>Entrar</p>}
          </button>
          <Link href="/singIn" className="w-full">
            <button className="bg-green-50 text-green-500 border-green-500 border-2 cursor-pointer rounded-full py-1 px-4 w-full drop-shadow-2xl">
              Cadastrar
            </button>
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p
            className={`${montserrat.className} text-sm text-center text-green-700 underline mt-4`}
          >
            <Link href="/recoveryPass">Esqueci minha senha</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
