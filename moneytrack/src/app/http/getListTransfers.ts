"use server";
import { TransferMounthType } from "../../types/transferType";

export async function getListTransfers(
  id: number,
  token: string
): Promise<TransferMounthType[]> {
  const url = process.env.API_URL;

  const response = await fetch(`${url}/transfer/list/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) {
    const data: TransferMounthType[] = await response.json();
    return data;
  }
  return [];
}
