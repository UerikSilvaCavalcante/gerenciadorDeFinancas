import { id } from "zod/locales";
import { TransferType } from "../@types/transferType";

export async function AddTransfer(
  transfer: TransferType,
  token: string
): Promise<boolean | null> {
  const reponse = await fetch("http://127.0.0.1:8000/api/transfer/add", {
    method: "POST",
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

  if (reponse.ok) {
    return await reponse.json();
  }
  return null;
}
