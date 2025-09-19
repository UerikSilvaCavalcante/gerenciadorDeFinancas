"use client";

import MainLayout from "../components/mainLayout";
import { ToollBar } from "../components/toolbar";

import Image from "next/image";
import Link from "next/link";
import plus from "../assets/plus.svg";
import { CardComponent } from "../components/cardComponent";
import React, { Component } from "react";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { dataProps, RowProps } from "../transfers/page";
import {
  TransferDay,
  TransferMounth,
  Trasnsfer,
} from "../components/trasnfersByMounth";
import { List, type RowComponentProps } from "react-window";
import {hammersmithOne} from "../components/mainLayout";

const SliderTyped = Slider as unknown as React.ComponentClass<Settings>;


const data = [
  {
    bank: "Banco 1",
    type: "Cartao 1",
    bander: "Bander 1",
    color: "green",
  },
  {
    bank: "Banco 2",
    type: "Cartao 2",
    bander: "Bander 2",
    color: "black",
  },
  {
    bank: "Banco 3",
    type: "Cartao 3",
    bander: "Bander 3",
    color: "orange",
  },
  {
    bank: "Banco 4",
    type: "Cartao 4",
    bander: "Bander 4",
    color: "blueviolet",
  },
];

const filteredData: dataProps[] = [
  {
    mounth: 0,
    trasnsfers: [
      {
        day: "2025-01-22",
        valueTot: 100,
        trasnfer: [
          {
            desc: "desc 1",
            methood: "methood 1",
            type: 0,
            value: 100,
          },
        ],
      },
      {
        day: "2025-01-24",
        valueTot: 150,
        trasnfer: [
          {
            desc: "desc 1",
            methood: "methood 1",
            type: 2,
            value: 100,
          },
          {
            desc: "desc 1",
            methood: "methood 1",
            type: 3,
            value: 50,
          },
        ],
      },
    ],
  },
  {
    mounth: 1,
    trasnsfers: [
      {
        day: "2025-02-22",
        valueTot: 100,
        trasnfer: [
          {
            desc: "desc 1",
            methood: "methood 1",
            type: 0,
            value: 100,
          },
        ],
      },
      {
        day: "2025-02-24",
        valueTot: 50,
        trasnfer: [
          {
            desc: "desc 1",
            methood: "methood 1",
            type: 1,
            value: 50,
          },
        ],
      },
      {
        day: "2025-02-24",
        valueTot: 50,
        trasnfer: [
          {
            desc: "desc 1",
            methood: "methood 1",
            type: 4,
            value: 50,
          },
        ],
      },
    ],
  },
  {
    mounth: 2,
    trasnsfers: [
      {
        day: "2025-03-22",
        valueTot: 100,
        trasnfer: [
          {
            desc: "desc 1",
            methood: "methood 1",
            type: 4,
            value: 100,
          },
        ],
      },
      {
        day: "2025-03-24",
        valueTot: 50,
        trasnfer: [
          {
            desc: "desc 1",
            methood: "methood 1",
            type: 1,
            value: 50,
          },
        ],
      },
      {
        day: "2025-03-24",
        valueTot: 50,
        trasnfer: [
          {
            desc: "desc 1",
            methood: "methood 1",
            type: 3,
            value: 50,
          },
        ],
      },
    ],
  },
];

export default function Home() {
  var settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,

    slidesToScroll: 1,
    centerMode: true,
  };
  const Row = ({ index, style, filteredData }: RowComponentProps<RowProps>) => {
    return (
      <div
        className="w-full flex flex-row justify-center items-center"
        key={index}
        style={style}
      >
        <TransferMounth mounth={filteredData[index].mounth}>
          {filteredData[index].trasnsfers.map((trasnfer, index) => (
            <div
              key={index}
              className="w-full flex flex-col justify-start items-start"
            >
              <TransferDay date={trasnfer.day} valueTot={trasnfer.valueTot} />
              {trasnfer.trasnfer.map((transfer, index) => (
                <Trasnsfer
                  key={index}
                  value={transfer.value}
                  desc={transfer.desc}
                  methood={transfer.methood}
                  type={transfer.type}
                />
              ))}
            </div>
          ))}
        </TransferMounth>
      </div>
    );
  };

  const rowHeight = (index: number, { filteredData }: RowProps) => {
    const trasnfer = filteredData[index].trasnsfers;
    const trasnferHeight = trasnfer.length;
    const day = trasnfer.flatMap((d) => d.trasnfer);
    const dayHeight = day.length;
    return (trasnferHeight + dayHeight) * 55;
  };

  return (
    <MainLayout title="Home">
      <div className="flex flex-col justify-center items-center gap-2.5 bg-transparent">
        <div className="w-full h-full flex flex-row justify-around gap-6 rounded-md items-center bg-transparent p-2.5 ">
          <div className="w-full flex flex-row justify-around h-full p-6 bg-green-200 drop-shadow-2xl shadow-2xl  ">
            <div className="w-[300px] h-[200px] bg-green-500"></div>
            <div className="w-[300px] h-[200px] bg-green-700"></div>
          </div>
        </div>
        <div className="w-full h-full flex flex-row justify-around gap-6 rounded-md items-center bg-transparent p-2.5 ">
          <div className="flex flex-col w-1/2 h-full gap-6 bg-green-200 drop-shadow-2xl shadow-2xl rounded-md">
            <div className="w-full h-full p-3 flex flex-row ">
              <h1
                className={`${hammersmithOne.className} text-green-900 text-2xl text-center w-full`}
              >
                Cartões Utilizados
              </h1>
              <Link href="/addCartoes">
                <Image src={plus} width={24} height={24} alt="person" />
              </Link>
            </div>
            <div className="w-full h-full p-3 flex flex-row border-b-2 border-t-2 border-green-800">
              <SliderTyped {...settings}>
                {data.map((item, index) => (
                  <CardComponent
                    key={index}
                    bank={item.bank}
                    type={item.type}
                    bander={item.bander}
                    color={item.color}
                  />
                ))}
              </SliderTyped>
            </div>
          </div>
          <div className="w-full h-full flex flex-col justify-center items-center  gap-6 bg-green-200 drop-shadow-2xl shadow-2xl rounded-md ">
            <h1
              className={`${hammersmithOne.className} text-green-900 text-2xl text-center w-full p-3`}
            >
              Ultimas Trasnferencias
            </h1>
            <div className="h-full w-full max-h-[160px] border-t-2 border-green-950">
              <List
                rowComponent={Row}
                rowHeight={rowHeight}
                rowProps={{ filteredData }}
                rowCount={filteredData.length}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
