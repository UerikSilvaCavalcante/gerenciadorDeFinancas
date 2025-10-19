import { TransferType } from "../@types/transferType";

interface ResponseProps {
  success: boolean;
  message: string;
}

export async function AddTransfer(
  transfer: TransferType,
  token: string
): Promise<ResponseProps> {
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

  const data = await reponse.json();
  if (reponse.ok) {
    return {
      success: true,
      message: "Transferência adicionada com sucesso",
    };
  }
  throw new Error(data.message);
}
