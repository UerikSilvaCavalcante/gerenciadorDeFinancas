"use client";
import { ReactNode } from "react";
import Head from "../head";
import { ToollBar } from "./toolbar";
import { NavBar } from "./navBar";
import { Hammersmith_One, Montserrat } from "next/font/google";
import { ModalAddTransfer, useModelTransition } from "./modalAddTransfer";
import ClientProvider from "./clientProvider";

export const hammersmithOne = Hammersmith_One({
  weight: "400",
  subsets: ["latin"],
});
export const montserrat = Montserrat({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});
export default function MainLayout({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  const { isOpen, open, close } = useModelTransition();

  return (
    <div className="flex flex-col justify-center overflow-y-scroll items-center h-screen  w-screen bg-zinc-100 relative  ">
      <ClientProvider>
        <Head title={title} />
        <ToollBar />
        <div className="flex flex-col p-0 m-0 w-fit min-h-[85%] lg:max-h-[80%] max-w-[80vw]  drop-shadow-2xl shadow-2xl rounded-md bg-zinc-50">
          {children}
        </div>
        <ModalAddTransfer isOpen={isOpen} close={close} />
        <NavBar route={title} isOpen={isOpen} open={open} />
      </ClientProvider>
    </div>
  );
}
