"use client";

import MainLayout from "../components/mainLayout";

import Image from "next/image";
import plus from "../assets/plus.svg";
import { CardComponent } from "../components/cardComponent";
import React from "react";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {RowProps } from "../transfers/page";
import {
  TransferDay,
  TransferMounth,
  Trasnsfer,
} from "../components/trasnfersByMounth";
import { List, type RowComponentProps } from "react-window";
import { hammersmithOne } from "../components/mainLayout";
import { ModalAddCard, useModelTransitionC } from "../components/modalAddCard";
import { ChartMounth } from "../components/graphMounth";
import { ChartType } from "../components/graphType";
import { useQuery } from "@tanstack/react-query";
import { getListTransfers } from "../http/getListTransfers";
import { GetCartoes } from "../http/getCartões";
import Loader from "../components/loader";
import { parseCookies } from "nookies";
import { jwtDecode } from "jwt-decode";

const SliderTyped = Slider as unknown as React.ComponentClass<Settings>;

export default function Home() {
  var settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    centerPadding: "0px",
    slidesToScroll: 1,
    centerMode: true,
    className:"center"
  };
  const Row = ({ index, style, filteredData }: RowComponentProps<RowProps>) => {
    return (
      <div
        className="w-full h-full flex flex-row justify-start items-start"
        key={index}
        style={style}
      >
        <TransferMounth mounth={Number(filteredData[index].mounth)}>
          {filteredData[index].days.map((day, index) => (
            <div
              key={index}
              className="w-full h-full flex flex-col justify-start items-start"
            >
              <TransferDay date={day.day} valueTot={day.valueTot} />
              {day.transfers.map((transfer, index) => (
                <Trasnsfer
                  key={index}
                  value={transfer.value}
                  desc={transfer.desc}
                  methood={transfer.payment_method}
                  type={transfer.type_transfer}
                />
              ))}
            </div>
          ))}
        </TransferMounth>
      </div>
    );
  };

  const { data: filteredData, isLoading } = useQuery({
    queryKey: ["transfers"],
    queryFn: () => {
      const { token } = parseCookies();
      if (token) {
        const decode = jwtDecode<{
          id: string;
          exp: number;
        }>(token);
        return getListTransfers(parseInt(decode.id), token);
      }
      return [];
    },
  });

  const { data: cardData, isLoading: isLoadingCard } = useQuery({
    queryKey: ["cards"],
    queryFn: () => {
      const { token } = parseCookies();
      if (token) {
        const decode = jwtDecode<{
          id: string;
          exp: number;
        }>(token);
        return GetCartoes(parseInt(decode.id), token);
      }
    },
  });

  const rowHeight = (index: number, { filteredData }: RowProps) => {
    const trasnfer = filteredData[index].days;
    const trasnferHeight = trasnfer.length;
    const day = trasnfer.flatMap((d) => d.transfers);
    const dayHeight = day.length;
  return 32 + (trasnferHeight * 32 )+ (dayHeight * 60);
  };

  const { isOpen, open, close } = useModelTransitionC();

  return (
    <MainLayout title="Home">
      <ModalAddCard isOpen={isOpen} close={close} />
      <div className="flex flex-col w-[90vw] h-full  justify-center items-center bg-transparent">
        <div className="w-full lg:h-[55%] flex lg:flex-row justify-around gap-2 rounded-md items-center bg-transparent p-1 ">
          <div className="w-full h-[700px] flex flex-col lg:flex-row justify-around lg:h-full p-1.5 gap-2 bg-green-200 drop-shadow-2xl shadow-2xl  ">
            <div className="lg:w-1/2 w-full h-full flex flex-col justify-center items-center bg-green-100 p-0.5 rounded-md">
              <h1
                className={`${hammersmithOne.className} text-green-900 text-lg text-center w-full border-b border-green-900`}
              >
                Gastos em relação ao mes passado
              </h1>
              <ChartMounth />
            </div>
            <div className="lg:w-1/2 w-full h-full flex flex-col justify-center items-center bg-green-100 p-0.5 rounded-md">
              <h1
                className={`${hammersmithOne.className} text-green-900 text-lg text-center w-full border-b border-green-900`}
              >
                Tipos de gastos mais frequentes do mes
              </h1>
              <ChartType />
            </div>
          </div>
        </div>
        <div className="w-full h-[45%]  flex flex-col lg:flex-row justify-around gap-2.5 rounded-md items-center bg-transparent p-1.5 ">
          <div className="flex flex-col w-full lg:w-[40%] h-full bg-green-200 drop-shadow-2xl shadow-2xl rounded-md">
            <div className="w-full  p-0.5 flex flex-row ">
              <h1
                className={`${hammersmithOne.className} text-green-900 text-2xl text-center w-full`}
              >
                Cartões Utilizados
              </h1>

              <Image
                src={plus}  
                width={24}
                height={24}
                alt="plus"
                className="cursor-pointer"
                onClick={open}
                title="Adicionar Cartão"
              />
            </div>
            <div className="w-full h-full p-3 flex flex-row border-b-2 border-t-2 border-green-800 justify-center items-center">
              {isLoadingCard ? (
                <div className="w-full h-full  flex flex-col justify-center items-center ">
                  <Loader />
                </div>
              ) : cardData && cardData.length > 0 ? (
                <SliderTyped {...settings}>
                  {cardData.map((item, index) => (
                    <CardComponent
                      key={index}
                      id={item.id}
                      bank={item.bank}
                      type={item.type_card}
                      bander={item.bander}
                      color={item.color}
                    />
                  ))}
                </SliderTyped>
              ) : (
                <div className="w-full h-full  flex  flex-col justify-center items-center gap-2.5">
                  <h1
                    className={`${hammersmithOne.className} text-green-900 text-2xl text-center w-full p-3`}
                  >
                    Nenhum Cartão Cadastrado
                  </h1>
                </div>
              )}
            </div>
          </div>
          <div className="lg:w-[60%] w-full h-full flex flex-col justify-between items-center   bg-green-200 drop-shadow-2xl shadow-2xl rounded-md relative">
            <h1
              className={`${hammersmithOne.className} text-green-900 text-2xl text-center w-full p-0.5`}
            >
              Ultimas Trasnferencias
            </h1>
            <div className="w-full lg:h-full h-[160px] max-h-[25vh] relative border-t-2 border-green-900">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Loader />
                </div>
              ) : filteredData && filteredData.length > 0 ? (
                <List
                  rowComponent={Row}
                  rowHeight={rowHeight}
                  rowProps={{ filteredData }}
                  rowCount={filteredData.length}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <h1
                    className={`${hammersmithOne.className} text-green-900 text-2xl text-center w-full p-3`}
                  >
                    Sem dados para mostrar
                  </h1>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
