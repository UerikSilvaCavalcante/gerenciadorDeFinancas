"use client";
import menu from "../../assets/three-dots-vertical.svg";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ModalDelete } from "../modalDelete";
import { useModelTransition } from "../modalDelete";
import { parseCookies } from "nookies";
import { toast } from "sonner";
import DeleteTransfer from "@/app/http/deleteTransfer";
import { queryClient } from "@/app/helper/useQuery";

export const MenuOptions = ({ id }: { id: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const {
    isOpen: isOpenModal,
    open: openModal,
    close: closeModal,
  } = useModelTransition();
  const { token } = parseCookies();

  const handleDelete = () => {
    toast.promise(
      DeleteTransfer(id, token as string).then((res) => {
        if (res.success) {
          queryClient.invalidateQueries({ queryKey: ["transfers"] });
          queryClient.invalidateQueries({ queryKey: ["graphMounth"] });
          queryClient.invalidateQueries({ queryKey: ["graphType"] });
        }
        close();
        closeModal()
        return res.message;
      }),
      {
        loading: "Excluindo transferencia",
        success: "Transferencia excluida com sucesso",
        error: "Erro ao excluir transferencia",
      }
    );
  };
  return (
    <div
      className="flex flex-col h-full mt-3.5 justify-items-center relative"
      onDrop={close}
    >
      <ModalDelete
        close={closeModal}
        isOpen={isOpenModal}
        handleDelete={handleDelete}
      />
      <Image
        src={menu}
        alt="menu"
        width={25}
        height={25}
        onClick={isOpen ? close : open}
        color="#0d542b"
      />
      <div
        className={`origin-top-right absolute right-2 top-5 mt-2    rounded-md shadow-lg  w-[70px] h-[68px] flex flex-col scale-0 justify-items-center gap-1.5 transition-all duration-500 bg-green-400 z-20 ${
          isOpen && "scale-100"
        } `}
        onDrop={close}
      >
        <ul className="w-fit h-fit p-2 justify-items-center gap-2">
          <li>
            <Link href={`/transfers/${id}`}>Editar</Link>
          </li>
          <li className="cursor-pointer" onClick={openModal}>
            Excluir
          </li>
        </ul>
      </div>
    </div>
  );
};
