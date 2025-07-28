import { ReactNode } from "react";
import Head from "../head";
import { ToollBar } from "./toolbar";
export default function MainLayout({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen bg-zinc-100 relative ">
      <Head title={title} />
      <ToollBar />
      <div className="flex flex-col p-0 m-0 w-fit h-fit max-w-[1000px]  drop-shadow-2xl shadow-2xl rounded-md bg-zinc-50">
        {children}
      </div>
    </div>
  );
}
