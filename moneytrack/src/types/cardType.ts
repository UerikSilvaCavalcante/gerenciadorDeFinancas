import {TransferMounthType} from './transferType'
export type CardType ={

    id: number;
    user_id: number;
    bank: string;
    type_card: number;
    bander: string;
    color: string;
    limit: number
}

export type ResponseCardType = {
    
    id: number;
    user: number;
    bank: string;
    type_card: string;
    bander: string;
    color: string;
    limit: number
}


export type CardDetailType = {
    card: ResponseCardType;
    transfers: TransferMounthType[]
    total_value: number;
    limit: number
}
