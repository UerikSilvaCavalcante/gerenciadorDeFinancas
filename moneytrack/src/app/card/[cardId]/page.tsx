import { cookies } from "next/headers";
import { GetCard } from "@/app/http/detailCard";
import { RenderCardDetail } from "@/app/components/renderCard";
import { notFound } from "next/navigation";

export default async function CardTransferId({
  params,
}: {
  params: Promise<{ cardId: string }>;
}) {
  const { cardId } = await params;

  const token = await (await cookies()).get("token")?.value;
  const card = await GetCard(Number(cardId), token as string);
  if (token && card) {

    return (
      <RenderCardDetail card={card} token={token}/>
    )
  }
  else {
    return notFound()
  }
}
