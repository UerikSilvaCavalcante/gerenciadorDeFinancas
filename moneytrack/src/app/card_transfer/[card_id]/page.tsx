import MainLayout from "../../components/mainLayout";
import { Input, Checkbox, Select } from "../../components/UI/input";
import { PrimaryButton, SecundaryButton } from "../../components/UI/buttons";
import { List } from "react-window";
import { type RowComponentProps } from "react-window";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { hammersmithOne, montserrat } from "../../components/mainLayout";
import { trasnferFilterForm, trasnferFilter } from "../../transfers/page";
import { dataProps, RowProps, rowHeight, Row } from "../../transfers/page";
import { CardComponent } from "../../components/cardComponent";
import {
  
  TypeEnum,
} from "../../components/modalAddCard";
import { cookies } from "next/headers";
import { GetCard } from "@/app/http/detailCard";
import { useForm, UseFormRegister } from "react-hook-form";
import { RenderCardDetail } from "@/app/components/renderCard";
export const CardForm = z.object({
  brand: z.string().min(1, "Campo obrigatório"),
  type: z.nativeEnum(TypeEnum, { message: "Campo obrigatório" }),
  bank: z.string().min(1, "Campo obrigatório"),
  limit: z.number().optional(),
  color: z.string(),
});

export type CardFormsType = z.infer<typeof CardForm>;



export default async function CardTransferId({
  params,
}: {
  params: Promise<{ card_id: string }>;
}) {
  const { card_id } = await params;

  const token = await (await cookies()).get("token")?.value;
  const card = await GetCard(Number(card_id), token as string);
  if (token && card) {

    return (
      <RenderCardDetail card={card} token={token}/>
    )
  }
}
