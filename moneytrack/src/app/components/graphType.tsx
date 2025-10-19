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
      {!isLoading ? (
        data && data.length > 0 ? (
          <div className="w-full h-full flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%" className="flex justify-start items-start pt-5 pr-9">
            <BarChart width={100} height={40} data={data}>
              <XAxis dataKey="categoria" />
              <YAxis />
              <Tooltip formatter={(val) => `R$ ${Number(val).toFixed(2)}`} />
              <Bar dataKey="gasto" fill="#2e8b57" />
            </BarChart>
          </ResponsiveContainer>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col justify-center items-center">
            <h1
              className={`${hammersmithOne.className} text-green-950 text-2xl`}
            >
              Nenhum dado ainda
            </h1>
          </div>
        )
      ) : (
        <div className="w-full h-full flex flex-col justify-center items-end p-2">
         <div className="w-full h-full flex justify-between items-end gap-1">
           <div className="h-full w-[150px] bg-green-900 opacity-15 rounded-sm animate-pulse"></div>
          <div className="h-1/2 w-[150px] bg-green-900 opacity-15 rounded-sm animate-pulse"></div>
          <div className="h-[80%] w-[150px] bg-green-900 opacity-15 rounded-sm animate-pulse"></div>
         </div>
          <div className="w-full h-1 bg-green-900 ">

          </div>
        </div>
      )}
    </div>
  );
};
