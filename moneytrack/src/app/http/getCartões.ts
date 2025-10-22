"use server";
import { ResponseCardType } from "../../@types/cardType";

export async function GetCartoes(
  id: number,
  token: string
): Promise<ResponseCardType[]> {
  const url = process.env.API_URL;
  const response = await fetch(`${url}/card/list/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    const data: ResponseCardType[] = await response.json();
    return data;
  }

  return [];
}
