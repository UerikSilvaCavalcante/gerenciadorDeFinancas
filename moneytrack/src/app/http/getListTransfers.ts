import { TransferMounthType } from "../@types/transferType";

export async function getListTransfers(
  id: number,
  token: string
): Promise<TransferMounthType[]> {
  const response = await fetch(
    `http://127.0.0.1:8000/api/transfer/list/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (response.ok) {
    const data: TransferMounthType[] = await response.json();
    return data;
  }
  return []
}
