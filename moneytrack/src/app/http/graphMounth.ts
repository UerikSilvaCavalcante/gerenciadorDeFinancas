"use server";
import { GraphMounthType } from "../types/graphType";

export async function getGraphMounth(id: number, token: string) {
  const url = process.env.API_URL;

  const response = await fetch(`${url}/dashboard/plts/mes/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data: GraphMounthType = await response.json();
  return data;
}
