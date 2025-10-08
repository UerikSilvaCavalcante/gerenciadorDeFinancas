import { CardType, ResponseCardType } from "../@types/cardType";



export async function GetCartoes(id:number, token:string): Promise<ResponseCardType[]> {
  const response = await fetch(`http://127.0.0.1:8000/api/card/list/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if(response.ok) {

    const data: ResponseCardType[] = await response.json();
    return data
  }

  return []
}
