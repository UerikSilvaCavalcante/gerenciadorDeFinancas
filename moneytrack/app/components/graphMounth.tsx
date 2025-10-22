"use client";
import { useQuery } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { parseCookies } from "nookies";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getGraphMounth } from "../http/graphMounth";
import { hammersmithOne } from "./mainLayout";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
dayjs.locale("pt-br");

export const ChartMounth = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["graphMounth"],
    queryFn: () => {
      const { token } = parseCookies();
      if (token) {
        const decode = jwtDecode<{
          id: string;
          exp: number;
        }>(token);
        return getGraphMounth(parseInt(decode.id), token);
      }
      return [];
    },
  });

  const now = dayjs().month();
  
  return (
    <div style={{ width: "100%", height: "100%" }}>
      {!isLoading ? (
        data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                type="number"
                domain={[data[0].day, data[data?.length - 1].day]}
                // ticks={[1, 5, 10, 15, 20, 25, 30, 31]}
                label={{
                  value: "Dia do Mês",
                  position: "insideBottom",
                  offset: -5,
                }}
              />
              <YAxis
                label={{
                  value: "Gasto (R$)",
                  angle: -90,
                  position: "insideLeft",
                  offset: 0,
                }}
                domain={["dataMin", "dataMax + 5"]}
              />
              <Tooltip
                formatter={(value) =>
                  value == null ? "-" : `R$ ${Number(value).toFixed(2)}`
                }
                labelFormatter={(label) => `Dia ${label}`}
              />
              <Legend verticalAlign="top" align="right" />
              {/* Julho: verde claro */}
              <Line
                type="monotone"
                dataKey="act_mounth"
                stroke="#032e15"
                strokeWidth={3}
                dot={true}
                activeDot={{ r: 6 }}
                connectNulls={false}
                name={dayjs().month(now ).format("MMMM").toLocaleUpperCase()}
              />
              {/* Junho: verde escuro */}
              <Line
                type="monotone"
                dataKey="past_mounth"
                stroke="#05df72"
                strokeWidth={3}
                dot={true}
                activeDot={{ r: 6 }}
                connectNulls={false}
                name={dayjs().month(now - 1).format("MMMM").toLocaleUpperCase()}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex justify-center items-center ">
            <h1
              className={`${hammersmithOne.className} text-green-900 text-2xl text-center w-fit`}
            >
              Nenhum Gasto Cadastrado
            </h1>
          </div>
        )
      ) : (
        <div className="w-full h-full flex justify-center items-center rounded-md bg-green-950 opacity-15 animate-pulse  "></div>
      )}
    </div>
  );
};
