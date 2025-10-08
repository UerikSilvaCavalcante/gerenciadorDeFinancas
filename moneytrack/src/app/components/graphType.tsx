"use client";
import { useQuery } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { parseCookies } from "nookies";
import { getGrauphType } from "../http/graphType";
import React from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { hammersmithOne } from "./mainLayout";
import Loader from "./loader";

export const ChartType = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["graphType"],
    queryFn: () => {
      const { token } = parseCookies();
      if (token) {
        const decode = jwtDecode<{
          id: string;
          exp: number;
        }>(token);
        return getGrauphType(parseInt(decode.id), token);
      }
      return [];
    },
  });

  return (
    <div className="w-full h-full ">
      {!isLoading ? ((data && data.length > 0) ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart width={150} height={40} data={data}>
            <XAxis dataKey="categoria" />
            <YAxis />
            <Tooltip formatter={(val) => `R$ ${Number(val).toFixed(2)}`} />
            <Bar dataKey="gasto" fill="#2e8b57" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="w-full h-full flex flex-col justify-center items-center">

          <h1 className={`${hammersmithOne.className} text-green-950 text-2xl`}>Nenhum dado ainda</h1>
        </div>
      )) : (
        <div className="w-full h-full flex justify-center items-center rounded-md bg-green-950 opacity-15 animate-pulse">
        </div>
      )}
    </div>
  );
};
