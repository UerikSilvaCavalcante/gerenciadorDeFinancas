"use server";
import { ResponseProps } from "../types/IResponse";
import { TransferType } from "../types/transferType";

export default async function editTransfer(
  id: number,
  token: string,
  transfer: TransferType
): Promise<ResponseProps> {
  const url = process.env.API_URL;

  const response = await fetch(`${url}/transfer/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id_id: transfer.user_id,
      value: transfer.value,
      date: transfer.date,
      description: transfer.description,
      type_transfer: transfer.type_transfer,
      payment_method: transfer.payment_method,
      card_id_id: transfer.card_id,
    }),
  });
  // const data = await response.json();
  // console.table(data)
  if (response.ok) {
    return {
      success: true,
      message: "Transferência alterada com sucesso",
    };
  }
  const data = await response.json();
  throw new Error(data.message);
}
