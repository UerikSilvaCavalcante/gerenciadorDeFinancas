import { ResponseCardType, CardType } from "../@types/cardType";
export interface ResponseProps {
    message:string
}
export async function EditCard(
  card: CardType,
  token: string
): Promise<ResponseCardType | ResponseProps> {
  const response = await fetch(`http://127.0.0.1:8000/api/card/${card.id}`, {
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
  return data
}
