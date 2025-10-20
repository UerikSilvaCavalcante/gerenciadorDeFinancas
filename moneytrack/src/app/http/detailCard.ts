"use server";
import {CardDetailType} from '../@types/cardType'

export async function GetCard(id:number, token:string):Promise<CardDetailType | null>  {
    const url = process.env.API_URL

    const response = await fetch(`${url}/card/detail/${id}`, {
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