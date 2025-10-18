"use client";
import MainLayout, {
  hammersmithOne,
  montserrat,
} from "../components/mainLayout";
import person from "../assets/person.svg";
import Image from "next/image";
import { AuthContext } from "../action/valid";
import { useContext, useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../components/UI/input";
import { ResponseUserType, UserType } from "../@types/userType";
import { useQuery } from "@tanstack/react-query";
import { parseCookies } from "nookies";
import { getUserById } from "../http/getUserbyId";
import { jwtDecode } from "jwt-decode";
import Loader from "../components/loader";
import { PrimaryButton, SecundaryButton } from "../components/UI/buttons";
import Link from "next/link";
import back from "../assets/arrow-left-circle.svg";
import { toast } from "sonner";
import editUser from "../http/editUser";
import { ModalDelete, useModelTransition } from "../components/modalDelete";
import {
  ModalChangePass,
  useModelTransition as useModelTransitionPass,
} from "../components/modalChangePass";
import { useRouter } from "next/navigation";
import deleteUser from "../http/deleteUser";
import { verify } from "crypto";
import verifyCode from "../http/verifyCode";
import getCode from "../http/getCode";
import { id } from "zod/locales";
const userForm = z.object({
  id: z.number(),
  username: z.string().min(1, "Campo Obrigatorio"),
  name: z.string().min(1, "Campo Obrigatorio"),
  email: z.string().min(1, "Campo Obrigatorio"),
});

type UserForm = z.infer<typeof userForm>;

export default function Config() {
  const { token } = parseCookies();
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, open, close } = useModelTransition();
  const {
    isOpen: isOpenPass,
    open: openPass,
    close: closePass,
  } = useModelTransitionPass();
  const router = useRouter();
  const { Logout } = useContext(AuthContext);

  const [user, setUser] = useState<ResponseUserType | null>(null);
  const getUser = async () => {
    const decode = jwtDecode<{
      id: string;
      exp: number;
    }>(token as string);
    const user = await getUserById(parseInt(decode.id), token);
    setUser(user);
    setIsLoading(false);
    return user;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserForm>({
    resolver: zodResolver(userForm),
    defaultValues: async () => {
      return await getUser();
    },
  });

  const handleSubmitForm = (data: UserForm) => {
    const newUser: UserType = {
      id: data.id,
      name: data.name,
      username: data.username,
      email: data.email,
      password: data.name,
    };
    toast.promise(
      editUser(newUser, token as string).then((res) => {
        return res;
      }),
      {
        loading: "Editando...",
        success: "Editado com sucesso",
        error: `Erro ao editar`,
      }
    );
  };


  const handleDelete = () => {
    toast.promise(
      deleteUser(user?.id as number, token as string).then((res) => {
        Logout();
        router.push("/");
        return res.message;
      }),
      {
        loading: "Deletando...",
        success: "Deletado com sucesso",
        error: `Erro ao deletar`,
      }
    );
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <ModalDelete close={close} isOpen={isOpen} handleDelete={handleDelete} />
      <div className="bg-green-500 flex flex-row justify-center items-center    px-4 py-1.5 gap-1 rounded-full  absolute top-2 left-2 z-50">
        <Link href="/home">
          <Image src={back} width={24} height={24} alt="voltar" />
        </Link>
      </div>
      <div className="flex flex-col p-0 m-0 w-fit  max-w-[80vw]  drop-shadow-2xl shadow-2xl rounded-md bg-zinc-50 ">
        <div className="bg-green-600 w-[30vw] min-h-[50vh] p-2.5 flex flex-col justify-start items-center rounded-md">
          {isLoading ? (
            <div className="w-full h-[50vh] flex justify-center items-center">
              <Loader />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col justify-start items-center gap-2.5">
              <div className="flex w-full flex-col justify-start gap-2.5 items-center  ">
                <div className="flex justify-center items-center gap-2.5 ">
                  <Image src={person} width={24} height={24} alt="person" />
                  <div
                    className={`flex flex-row justify-around p-2.5 text-xl text-zinc-50 ${hammersmithOne.className}`}
                  >
                    Usuario: {user?.name}
                  </div>
                </div>

                <div className="flex justify-center items-center gap-2.5 rounded-md">
                  <p
                    className={`text-zinc-50 ${hammersmithOne.className} text-xl`}
                  >
                    Valor gasto no mês R$: {user?.valorGasto}
                  </p>
                </div>
              </div>
              <div className="h-0.5 bg-zinc-50 w-full "></div>
              <h1
                className={`${hammersmithOne.className} text-zinc-50 text-2xl text-center w-full p-2`}
              >
                Editar Perfil
              </h1>
              <form
                className="w-full flex flex-col justify-items-start gap-2.5 "
                onSubmit={handleSubmit(handleSubmitForm)}
              >
                <div className="w-full flex flex-col justify-around items-start gap-2.5 p-1.5">
                  <label
                    htmlFor="name"
                    className={`${montserrat.className} text-zinc-50 text-lg`}
                  >
                    Nome
                    {errors.name && (
                      <span className="text-red-500">
                        {errors.name.message}
                      </span>
                    )}
                  </label>

                  <Input
                    id="name"
                    type="text"
                    width="w-full"
                    placeholder="Name"
                    {...register("name")}
                  />
                  <label
                    htmlFor="username"
                    className={`${montserrat.className} text-zinc-50 text-lg`}
                  >
                    Username{" "}
                    {errors.username && (
                      <span className="text-red-500">
                        {errors.username.message}
                      </span>
                    )}
                  </label>
                  <Input
                    id="username"
                    type="text"
                    width="w-full"
                    placeholder="Username"
                    {...register("username")}
                  />
                  <label
                    htmlFor="email"
                    className={`${montserrat.className} text-zinc-50 text-lg`}
                  >
                    Email{" "}
                    {errors.email && (
                      <span className="text-red-500">
                        {errors.email.message}
                      </span>
                    )}
                  </label>

                  <Input
                    id="email"
                    type="email"
                    width="w-full"
                    placeholder="Email"
                    {...register("email")}
                  />
                </div>
                <div className="w-full flex justify-center items-center gap-2.5 ">
                  <PrimaryButton width="w-full" content="Salvar" />
                  <SecundaryButton
                    width="w-full"
                    content="Cancelar"
                    onClick={() => reset()}
                  />
                </div>
              </form>
              <Link href="/recoveryPass">
                <PrimaryButton width="w-full" content="Redefinir Senha" />
              </Link>
              <PrimaryButton
                width="w-full border-2 border-red-500 bg-transparent text-red-500 hover:bg-red-500 hover:text-zinc-50 transition-colors durations-300 font-bold"
                content="Excluir Conta"
                onClick={open}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
