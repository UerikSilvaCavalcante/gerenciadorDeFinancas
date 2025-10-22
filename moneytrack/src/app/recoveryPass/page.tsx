"use client";
import Link from "next/link";
import Image from "next/image";
import back from "../assets/arrow-left-circle.svg";
import { Input } from "../components/UI/input";
import { hammersmithOne } from "../components/mainLayout";
import { PrimaryButton } from "../components/UI/buttons";
import getCode from "../http/getCode";
import verifyCode from "../http/verifyCode";
import { toast } from "sonner";
import { useState } from "react";
import eyeC from "../assets/eye-fill.svg";
import eyeO from "../assets/eye-fill-o.svg";
import changePassword from "../http/changePassword";
import { useRouter } from "next/navigation";
import Loader from "../components/loader";
const EmailField = ({
  handleEmail,
  handleLoad,
  togleField,
}: {
  handleEmail: (email: string) => void;
  handleLoad: (load:boolean) => void;
  togleField: () => void;
}) => {
  
  const handleSubmit = async () => {
    handleLoad(true);
    const email = document.getElementById("email") as HTMLInputElement;
    const res = await getCode(email.value);
    if (res.success) {
      toast.success(res.message);
      handleEmail(email.value)
      handleLoad(false);
      togleField();
      return;
    }
    toast.error(res.message);
    
    handleLoad(false);
  };

  return (
    <div className="flex flex-col p-2.5 justify-center items-center w-full gap-2">
      <div className="flex flex-col justify-center items-center gap-2">
        <h1 className={`${hammersmithOne.className} text-xl font-bold`}>
          Confirmar Email
        </h1>
        <p>Digite o email cadastrado para recuperar a senha!</p>
      </div>
      <div className="flex flex-col justify-center items-start">
        <label htmlFor="email">Email</label>
        <Input type="email" id="email" />
      </div>
      <div className="flex flex-col justify-center w-full items-center">
        <PrimaryButton
          type="button"
          width="w-full"
          content="Enviar"
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};

const CodeField = ({
  email,
  handleLoad,
  togleField,
}: {
  email:string,
  handleLoad: (load:boolean) => void;
  togleField: () => void;
}) => {
  const router = useRouter()
  const handleSubmit = async () => {
    handleLoad(true);
    const code = document.getElementById("code") as HTMLInputElement;
    
    const res = await verifyCode(email, code.value);
    if (res.success) {
      toast.success(res.message);
      handleLoad(false);
      togleField();
      return;
    }
    toast.error(res.message);
    if(res.message.includes("Codigo expirado")) {
      router.push("/")
    };
    handleLoad(false);

  };

  return (
    <div className="flex flex-col p-2.5 justify-center items-center w-full gap-2">
      <div className="flex flex-col justify-center items-center gap-2">
        <h1 className={`${hammersmithOne.className} text-xl font-bold`}>
          Codigo enviado!
        </h1>
        <p>
          Um codigo foi enviado para o seu email, verifique e insira o codigo
          abaixo!
        </p>
      </div>
      <div className="flex flex-col justify-center items-start">
        <label htmlFor="email">Codigo</label>
        <Input type="text" id="code" />
      </div>
      <div className="flex flex-col justify-center items-center w-full">
        <PrimaryButton
          type="button"
          content="Enviar"
          width="w-full"
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};


const PasswordField = ({email , handleLoad }: {email:string, handleLoad: (load:boolean) => void }) => {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const handleSubmit = () => {
    handleLoad(true);
    const password = document.getElementById("password") as HTMLInputElement;

    toast.promise(
      changePassword(email, password.value).then((res) => {
        handleLoad(false);
        router.push("/");
        return res;
      }),
      {
        loading: "Alterando...",
        success: "Alterado com sucesso",
        error: `Erro ao alterar`,
      }
    );
  };

  return (
    <div className="flex flex-col p-2.5 justify-center items-center w-full gap-2">
      <div className="flex flex-col justify-center items-center gap-2">
        <h1 className={`${hammersmithOne.className} text-xl font-bold`}>
          Redefinir Senha!
        </h1>
        <p>Digite uma nova senha!</p>
      </div>
      <div className="flex flex-col justify-center items-start relative">
        <label htmlFor="password">Senha</label>

        <Input id="password" type={showPass ? "text" : "password"} />
        <div
          className="absolute right-3 top-8   transform  -translate-0.5 cursor-pointer"
          onClick={() => setShowPass(!showPass)}
        >
          <Image
            src={showPass ? eyeO : eyeC}
            alt="Toggle password visibility"
            width={20}
            height={20}
          />
        </div>
      </div>
      <div className="flex flex-col justify-center items-center">
        <PrimaryButton type="button" content="Enviar" onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default function RecoveryPass() {
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [emai , setEmail] = useState("");

  const handleEmail = (email:string) => {
    setEmail(email)
  }


  const handleLoad = (load:boolean) => {
    setIsLoading(load);
  };
  const togleField = () => {
    setIndex(index + 1);
  };
  const Fields = [
    <EmailField key={0} handleEmail={handleEmail} handleLoad={handleLoad} togleField={togleField} />,
    <CodeField key={1} email={emai} handleLoad={handleLoad} togleField={togleField} />,
    <PasswordField key={2} email={emai} handleLoad={handleLoad} />,
  ];

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="bg-green-500 flex flex-row justify-center items-center    px-4 py-1.5 gap-1 rounded-full  absolute top-2 left-2 z-50">
        <Link href="/config">
          <Image src={back} width={24} height={24} alt="voltar" />
        </Link>
      </div>
      <div className="flex flex-col p-0 m-0 w-[30vw]  max-w-[80vw]  drop-shadow-2xl shadow-2xl rounded-md bg-zinc-50 justify-center items-center">
        {!isLoading ? (
          Fields[index]
        ) : (
          <div className="w-full h-[50vh] flex justify-center items-center">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
}
