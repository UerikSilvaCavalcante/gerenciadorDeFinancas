import { GraphMounthType } from "../@types/graphType";

export async function getGraphMounth(id: number, token: string) {
    const response = await fetch(`http://127.0.0.1:8000/api/dashboard/plts/mes/${id}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const data: GraphMounthType = await response.json();
    return data;
}

