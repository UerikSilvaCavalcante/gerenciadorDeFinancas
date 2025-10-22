"use server";
import { CardType } from "../../@types/cardType";
import { ResponseProps } from "../../@types/IResponse";
export async function EditCard(
  card: CardType,
  token: string
): Promise<ResponseProps> {
  const url = process.env.API_URL;

  const response = await fetch(`${url}/card/${card.id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: card.user_id,
      bank: card.bank,
      type_card: card.type_card,
      bander: card.bander,
      color: card.color,
      limit: card.limit,
    }),
  });
  const data = await response.json();
  if (response.ok) {
    return {
      success: true,
      message: "Cartão alterado com sucesso",
    };
  }
  throw new Error(data.message);
}
