"use client";

import { CardComponent } from "../components/cardComponent";
import React from "react";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function SampleNextArrow(props:any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props:any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style}}
      onClick={onClick}
    />
  );
}

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

export default function Test() {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    nextArrow: <SampleNextArrow  />,
    prevArrow: <SamplePrevArrow  />,

    slidesToScroll: 1,
    centerMode: true,
  };

  return (
    <div className="flex flex-col h-screen w-screen justify-center items-center bg-zinc-200 ">
      <div className="w-1/2 h-1/2 bg-zinc-50 drop-shadow-2xl rounded-2xl justify-center items-center">
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
  );
}
