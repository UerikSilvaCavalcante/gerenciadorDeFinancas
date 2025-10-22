"use server";
import { RespnseTransferType } from "../types/transferType";

export async function getTransferDetail(
  id: number,
  token: string
): Promise<RespnseTransferType | null> {
  const url = process.env.API_URL;

  const response = await fetch(`${url}/transfer/detail/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    const data: RespnseTransferType = await response.json();
    return data;
  }
  return null;
}
