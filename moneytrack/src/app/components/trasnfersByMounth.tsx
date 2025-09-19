import { Hammersmith_One, Montserrat } from "next/font/google";
import { ReactNode } from "react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

import Image from "next/image";
import alimentacao from "../assets/tipos_transfers/alimentacao.svg";
import lazer from "../assets/tipos_transfers/lazer.svg";
import saude from "../assets/tipos_transfers/saude.svg";
import transporte from "../assets/tipos_transfers/transporte.svg";
import outros from "../assets/tipos_transfers/outros.svg";

dayjs.locale("pt-br");

const types = [alimentacao, lazer, saude, transporte, outros];

const hammersmithOne = Hammersmith_One({
  weight: "400",
  subsets: ["latin"],
});
const montserrat = Montserrat({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});
const TransferMounth = ({
  mounth,
  children,
}: {
  mounth: number;
  children: ReactNode;
}) => (
  <div className="w-full p-1.5 flex flex-col justify-start items-start gap-2">
    <div className="  w-full px-2 flex flex-row justify-between items-end ">
      <h1
        className={`${hammersmithOne.className} text-green-900 text-2xl text-center w-fit `}
      >
        {dayjs().month(mounth).format("MMMM").toLocaleUpperCase()}
      </h1>
    </div>
    <div className=" w-full px-2 flex flex-col justify-start items-start">
      {children}
    </div>
  </div>
);

const TransferDay = ({
  date,
  valueTot,
}: {
  date: string;
  valueTot: number;
}) => {
  return (
    <div className=" w-[100%] px-2 flex flex-row justify-between items-start  border-b-2 border-green-900">
      <h1
        className={`${hammersmithOne.className} text-green-900 text-xl text-center w-fit `}
      >
        {dayjs(date)
          .day(parseInt(date.split("-")[2]))
          .format("ddd")}{" "}
        - {date}
      </h1>
      <p
        className={`${montserrat.className} text-green-900  text-center w-fit`}
      >
        R$ {valueTot}
      </p>
    </div>
  );
};

const Trasnsfer = ({
  value,
  desc,
  methood,
  type,
}: {
  value: number;
  desc: string;
  methood: string;
  type: number;
}) => (
  <div className="w-full  flex flex-row justify-start items-start px-3.5 py-2 gap-2.5">
    <div className="flex flex-col h-full w-fit justify-center items-center p-0 ">
      <div className="w-8 h-8 rounded-full p-2 bg-green-300 border-2 border-green-900">
        <Image
          src={types[type] ?? types[0]}
          width={70}
          height={70}
          alt=" "
        />
      </div>
    </div>
    <div className="flex flex-col justify-center items-start w-full h-[38px] px-2">
      <h1
        className={`${hammersmithOne.className} text-green-900 text-[16px] text-right font-bold`}
      >
        {desc}
      </h1>
      <h1
        className={`${montserrat.className} text-green-900 text-sm text-right`}
      >
        {methood}
      </h1>
    </div>
    <div className="w-full h-[38px] px-2 justify-center items-end flex flex-col ">
      <h1
        className={`${montserrat.className} text-green-800 text-sm text-right font-bold`}
      >
        R$ {value}
      </h1>
    </div>
  </div>
);

export { TransferMounth, TransferDay, Trasnsfer };
