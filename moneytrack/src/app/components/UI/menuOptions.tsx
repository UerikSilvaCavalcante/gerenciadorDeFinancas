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
import { montserrat } from "../mainLayout";
import Edit from "../../assets/edit"
import Delete from "@/app/assets/delete";

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
        return res;
      }),
      {
        loading: "Excluindo transferencia",
        success: "Transferencia excluida com sucesso",
        error: (data) => {
          return data.message;
        },
      }
    );
  };
  return (
    <div
      className="flex flex-col h-full mt-3.5 justify-items-center relative cursor-pointer"
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
        className={`origin-bottom-right absolute right-4 bottom-10 mt-2    rounded-md shadow-lg  w-[100px] h-[80px]  scale-0 justify-center items-center gap-1.5 transition-all duration-500 bg-green-400 z-50 ${
          isOpen && "scale-100"
        } `}
        onDrop={close}
      >
        <ul className={`flex flex-col  w-full h-full  justify-around items-start text-green-50  p-1.5 ${montserrat.className} font-bold`}>
          <li className="w-full">
            <Link href={`/transfers/${id}`} className="w-full flex flex-row justify-around items-start"><Edit width={20} height={20} /> Editar</Link>
          </li>
          <li className="cursor-pointer w-full flex flex-row justify-around items-start" onClick={openModal}>
            <Delete width={20} height={20} />
            Excluir
          </li>
        </ul>
      </div>
    </div>
  );
};
