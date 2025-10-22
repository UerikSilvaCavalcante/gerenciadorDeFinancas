"use server";
import { ResponseProps } from "../types/IResponse";

export default async function DeleteTransfer(
  id: number,
  token: string
): Promise<ResponseProps> {
  const url = process.env.API_URL;
  const response = await fetch(`${url}/transfer/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (response.ok) {
    return {
      success: true,
      message: data.message,
    };
  }
  throw new Error(data.message);
}
