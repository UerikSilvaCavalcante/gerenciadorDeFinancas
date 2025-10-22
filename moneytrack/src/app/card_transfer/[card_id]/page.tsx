import { cookies } from "next/headers";
import { GetCard } from "@/app/http/detailCard";
import { RenderCardDetail } from "@/app/components/renderCard";
import { notFound } from "next/navigation";

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
  else {
    return notFound()
  }
}
