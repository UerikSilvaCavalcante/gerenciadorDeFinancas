import person from "../assets/person.svg";
import gear from "../assets/gear.svg";
import Image from "next/image";
import { Hammersmith_One } from "next/font/google";
import Link from "next/link";
const hammersmithOne = Hammersmith_One({
  weight: "400",
  subsets: ["latin"],
});
export const ToollBar = () => {
  return (
    <div className="bg-green-500 flex flex-row justify-center items-center    px-4 py-1.5 gap-1 rounded-full  absolute top-2 left-2 z-50">
      <div className=" flex flex-row justify-center items-center p-0 m-0">
        <Image src={person} width={24} height={24} alt="person" />
      </div>
      <div
        className={`flex flex-row justify-around p-2.5 text-sm text-zinc-50 ${hammersmithOne.className}`}
      >
        Olá User
      </div>
      <div
        className={`flex flex-row justify-around p-2.5 text-sm text-zinc-50 ${hammersmithOne.className}`}
      >
        Total Gasto R$ 0,00
      </div>
      <Link href="/config">
        <Image src={gear} width={20} height={20} alt="config" />
      </Link>
    </div>
  );
};
