import { id } from "zod/locales";

interface CartoesPromise {
  id: number;
  bank: string;
  type: string;
  bander: string;
  color: string;
}

export async function GetCartoes(): Promise<CartoesPromise[]> {
  const data: CartoesPromise[] = [
    {
      id: 1,
      bank: "Banco 1",
      type: "Cartao 1",
      bander: "Bander 1",
      color: "green",
    },
    {
      id: 2,
      bank: "Banco 2",
      type: "Cartao 2",
      bander: "Bander 2",
      color: "black",
    },
    {
      id: 3,
      bank: "Banco 3",
      type: "Cartao 3",
      bander: "Bander 3",
      color: "orange",
    },
    {
      id: 4,
      bank: "Banco 4",
      type: "Cartao 4",
      bander: "Bander 4",
      color: "blueviolet",
    },
  ];

  return new Promise<CartoesPromise[]>((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 1000);
  });
}
