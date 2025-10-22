"use client";

import {
  Dialog,
  DialogPanel,
  DialogBackdrop,
} from "@headlessui/react";
import { useState } from "react";
import { hammersmithOne } from "./mainLayout";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PaymentMethodEnum, TypeTransferEnum } from "../enums/TransferEnums";
import { TransferType } from "../@types/transferType";
import { parseCookies } from "nookies";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { AddTransfer } from "../http/addTransfer";
import { queryClient } from "../helper/useQuery";
import { FormTrasnfer } from "./formTrasnfer";
export const useModelTransition = () => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
};

const trasnferForm = z.object({
  value: z
    .number({ message: "O valor mínimo é 0" })
    .min(0, { message: "O valor mínimo é 0" }),
  type: z.nativeEnum(TypeTransferEnum, {
    message: "Selecione pelo menos um tipo",
  }),
  methood: z.nativeEnum(PaymentMethodEnum, {
    message: "Selecione pelo menos um método",
  }),
  data: z.date({ message: "A data deve ser futura" }),
  cartaoId: z.number(),
  desc: z.string().optional(),
});

type transferFormType = z.infer<typeof trasnferForm>;

export const ModalAddTransfer = ({
  isOpen,
  close,
}: {
  isOpen: boolean;
  close: () => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError
  } = useForm<transferFormType>({
    resolver: zodResolver(trasnferForm),
  });

  const data = queryClient.getQueryData(["cards"]);

  const handleSubmitForm = (data: transferFormType) => {
    if (data.methood == PaymentMethodEnum.Credito && data.cartaoId <= 0) {
      setError("cartaoId", { message: "Selecione um cartão" });
      return;
    }
    const { token } = parseCookies();
    if (token) {
      const decode = jwtDecode<{
        id: string;
        exp: number;
      }>(token);
      const transfer: TransferType = {
        id: 0,
        user_id: Number(decode.id),
        value: data.value,
        description: data.desc || "",
        type_transfer: data.type,
        payment_method: data.methood,
        card_id: data.cartaoId,
        date: new Date(data.data),
      };
      toast.promise(
        AddTransfer(transfer, token).then((res) => {
          if (res) {
            queryClient.invalidateQueries({ queryKey: ["transferList"] });
            queryClient.invalidateQueries({ queryKey: ["graphType"] });
            queryClient.invalidateQueries({ queryKey: ["graphMounth"] });

            reset();
            close();
          }
        }),
        {
          loading: "Adicionando transferência",
          success: "Transferência adicionada com sucesso",
          error: "Erro ao adicionar transferência",
        }
      );
    }
  };
  return (
    <Dialog
      open={isOpen}
      onClose={close}
      as="div"
      className="fixed inset-0 z-10 overflow-y-auto relative "
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-transparent backdrop-blur-md transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
      <div className="fixed inset-0 flex w-screen items-center justify-end p-4 text-green-950">
        <DialogPanel className="max-w-lg w-[400px] h-full space-y-4 border bg-green-200 p-2.5 flex flex-col rounded-md shadow-lg justify-between items-center text-center">
          <div className="w-full flex  justify-center items-center ">
            <div className="w-[20px] h-[20px] bg-green-900 rounded-full "></div>
            <div className="w-full h-1 bg-green-600 rounded-full"></div>
            <div className="w-[20px] h-[20px] bg-green-900 rounded-full "></div>
          </div>
          <h1
            className={`${hammersmithOne.className} text-green-900 text-2xl text-center w-full`}
          >
            Adicionar Gasto
          </h1>
          <FormTrasnfer close={close} />
          <div className="w-full flex  justify-center items-center ">
            <div className="w-[20px] h-[20px] bg-green-900 rounded-full "></div>
            <div className="w-full h-1 bg-green-600 rounded-full"></div>
            <div className="w-[20px] h-[20px] bg-green-900 rounded-full "></div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
