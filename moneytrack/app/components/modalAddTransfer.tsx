"use client";

import { Dialog, DialogPanel, DialogBackdrop } from "@headlessui/react";
import { useState } from "react";
import { hammersmithOne } from "./mainLayout";
import { FormTrasnfer } from "./formTrasnfer";
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
