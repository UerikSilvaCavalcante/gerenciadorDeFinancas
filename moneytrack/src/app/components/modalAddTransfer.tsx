"use client";

import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";
import { useState } from "react";
import { PrimaryButton, SecundaryButton } from "./UI/buttons";
import { hammersmithOne, montserrat } from "./mainLayout";
import { Input } from "./UI/input";
export const useModelTransition = () => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
};

export const ModalAddTransfer = ({
  isOpen,
  close,
}: {
  isOpen: boolean;
  close: () => void;
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={close}
      as="div"
      className="fixed inset-0 z-10 overflow-y-auto relative "
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
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
            Adicionara Gasto
          </h1>
          <form
            action=""
            className="h-full w-full flex flex-col justify-between items-center p-2  "
          >
            <div className="w-full flex flex-col justify-center items-center">
              <div className="w-full flex flex-col justify-start items-start">
                <label
                  className={`${hammersmithOne.className} text-green-900 text-sm text-left w-full`}
                  htmlFor="valor"
                >
                  Valor
                </label>
                <Input
                  id="valor"
                  type="number"
                  placeholder="R$ 0,00"
                  width="w-full"
                  min={0}
                  step={0.01}
                  required
                />
              </div>
            </div>
            <div className="w-full p-2 flex flex-row justify-center items-center gap-2.5">
              <PrimaryButton type="submit" width="w-full" content="Adicionar" />
              <SecundaryButton type="reset" width="w-full" content="Cancelar" />
            </div>
          </form>
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
