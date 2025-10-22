"use server";
import { GraphType } from "../../types/graphType";

export async function getGrauphType(id: number, token: string) {
  const url = process.env.API_URL;
  const response = await fetch(`${url}/dashboard/plts/gastos/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data: GraphType = await response.json();
  return data;
}
