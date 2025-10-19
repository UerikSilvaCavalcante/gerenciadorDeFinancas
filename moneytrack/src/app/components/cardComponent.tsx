import { Hammersmith_One } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import info from "../assets/info-circle-fill.svg";

const hammersmithOne = Hammersmith_One({
  weight: "400",
  subsets: ["latin"],
});

export const CardComponent = ({
  id,
  bank,
  type,
  bander,
  color,
  className
}: {
  id:number;
  bank: string;
  type: string;
  bander: string;
  color: string;
  className?:string
}) => {

  return (
    <div
      className={`flex flex-col justify-around items-center min-w-[250px] min-h-[120px] max-w-[300px] max-h-[200px] rounded-lg drop-shadow-2xl shadow-2xl ${className}`}
      style={{ backgroundColor: color }}
    >
      <div className="flex flex-col w-full p-2.5 gap-1">
        <div className="flex flex-row justify-between items-center w-full">
          <h1
            className={`${hammersmithOne.className} text-zinc-50 text-md text-left w-full`}
          >
            {bank}
          </h1>
          <Link href={`card_transfer/${id}`} className="cursor-pointer">
            <Image src={info} alt="Info" width={20} height={20} title="Info" />
          </Link>
        </div>
        <div className="flex flex-row justify-between w-full">
          <h1
            className={`${hammersmithOne.className} text-zinc-50 text-md text-left w-full`}
          >
            {type}
          </h1>
        </div>
      </div>
      <div className="flex flex-row justify-between items-center p-2.5 w-full">
        <h1
          className={`${hammersmithOne.className} text-zinc-50 text-md text-right w-full`}
        >
          {bander}
        </h1>
      </div>
    </div>
  );
};
