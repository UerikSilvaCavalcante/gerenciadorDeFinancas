import {CardDetailType} from '../@types/cardType'

export async function GetCard(id:number, token:string):Promise<CardDetailType | null>  {
    const response = await fetch(`http://127.0.0.1:8000/api/card/detail/${id}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    if (response.ok){

        const data: CardDetailType = await response.json();
        return data;
    }
    return null
    
}