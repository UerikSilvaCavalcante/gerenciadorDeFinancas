import { CardType } from "../@types/cardType";
import { ResponseProps } from "../@types/IResponse";

export async function AddCard(
  card: CardType,
  token: string
): Promise<ResponseProps> {
  const response = await fetch("http://127.0.0.1:8000/api/card/add", {
    method: "POST",
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
      message: "Cartão adicionado com sucesso",
    };
  }
  throw new Error(data.message);
}
