import person from "../assets/person.svg";
import gear from "../assets/gear.svg";
import Image from "next/image";
import { Hammersmith_One } from "next/font/google";
import Link from "next/link";
import { lazy, Suspense, useContext } from "react";
import { AuthContext } from "../action/valid";
const hammersmithOne = Hammersmith_One({
  weight: "400",
  subsets: ["latin"],
});
const User = lazy(() => import("./user"));

export const ToollBar = () => {

  return (
    <div className="bg-green-500 flex flex-row justify-center items-center    px-4 py-1.5 gap-1 rounded-full  absolute top-2 left-2 z-50">
      <div className=" flex flex-row justify-center items-center p-0 m-0">
        <Image src={person} width={24} height={24} alt="person" />
      </div>
      <Suspense fallback={<div className="w-[300px] h-7 bg-green-900 animate-pulse rounded-md"></div>}>
        <User />
      </Suspense>
      <Link href="/config">
        <Image src={gear} width={20} height={20} alt="config" />
      </Link>
    </div>
  );
};
