"use client";

import MainLayout from "../components/mainLayout";
import { ToollBar } from "../components/toolbar";
import { Hammersmith_One } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import plus from "../assets/plus.svg";
import { CardComponent } from "../components/cardComponent";
import React, { Component } from "react";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SliderTyped = Slider as unknown as React.ComponentClass<Settings>;


const hammersmithOne = Hammersmith_One({
  weight: "400",
  subsets: ["latin"],
});

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

export default function Home() {
  var settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    
    slidesToScroll: 1,
    centerMode: true,
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
          <div className="flex flex-col w-full h-full gap-6 bg-green-200 drop-shadow-2xl shadow-2xl rounded-md ">
            Tranfers
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
