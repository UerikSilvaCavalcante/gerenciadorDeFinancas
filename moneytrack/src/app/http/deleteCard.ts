import { ResponseProps } from "./editCard"
interface DeleteCardProps {
    success: boolean
    message: string
}

export default async function DeleteCard(id:number, token:string):Promise<DeleteCardProps> {
    const response = await fetch(`http://127.0.0.1:8000/api/card/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    
    const data = await response.json();
    return data

}

