"use client";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";

import { PrimaryButton, SecundaryButton } from "./UI/buttons";
import { useState } from "react";
import { hammersmithOne, montserrat } from "./mainLayout";
import DeleteCard from "../http/deleteCard";
import { toast } from "sonner";
import { ResponseProps } from "../http/editCard";
import { useRouter } from "next/navigation";
export const useModelTransition = () => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
};

export const ModalDelete = ({
  id,
  token,
  isOpen,
  close,
}: {
  id: number;
  token:string;
  isOpen: boolean;
  close: () => void;
}) => {

  const router = useRouter();
  const handleDelete = async () => {
    const res = await DeleteCard(id, token);
    if (res.success) {
      close();
      toast.success("Cartão excluido com sucesso");
      router.push("/home");
      return ;
    }
    toast.error(`Erro ao excluir cartão ${res.message}`);
    return ;

  }
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
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4 text-green-950">
        <DialogPanel className="max-w-lg  space-y-4 border bg-green-200 p-2.5 flex flex-col rounded-md shadow-lg justify-between items-center text-center">
          <DialogTitle className={`${hammersmithOne.className} text-green-900 text-2xl text-center`}>
           
              Deseja Excluir ?
          </DialogTitle>
          <Description className={`${montserrat.className} flex flex-col items-center justify-center `}>
            Essa ação não pode ser revertida!
          </Description>
          <div className="w-[80%] flex flex-row justify-between gap-2.5 items-center">
            <button className="bg-red-500 rounded-sm p-1.5 text-green-100 active:bg-red-600 transition-colors text-sm cursor-pointer w-full " onClick={handleDelete}>
              Sim
            </button>
            <PrimaryButton content="Não" width="w-full" onClick={close} />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
