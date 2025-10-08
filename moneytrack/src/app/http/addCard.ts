import { CardType } from "../@types/cardType";

export async function AddCard(
  card: CardType,
  token: string
): Promise<boolean | null> {
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
  if (response.ok) {
    return true;
  }
  return null;
}
