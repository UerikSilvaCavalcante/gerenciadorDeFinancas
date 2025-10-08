export type TransferType = {
  id: number;
  user_id: number;
  value: number;
  description: string;
  date: Date;
  type_transfer: number;
  payment_method: number;
  card_id: number | null;
};

export type RespnseTransferType = {
  id: number;
  value: number;
  date: string;
  description: string;
  type_transfer: number;
  payment_method: string;
  card_id: string | null;
};

export type TransferListItemType = {
  id: number;
  value: number;
  type_transfer: number;
  payment_method: string;
  desc: string | null;
};

export type TransferDayType = {
  day: string;
  valueTot: number;
  transfers: TransferListItemType[];
};

export type TransferMounthType = {
  mounth: string;
  days: TransferDayType[];
};
