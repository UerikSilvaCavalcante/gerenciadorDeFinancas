import { cookies } from "next/headers";
import { getTransferDetail } from "@/app/http/getTransferDetail";
import MainLayout, {
  hammersmithOne,
} from "@/app/components/mainLayout";
import { notFound } from "next/navigation";
import { FormTrasnfer } from "@/app/components/formTrasnfer";

// garante que sempre seja dinâmico (e cookies possam ser acessados)
export const dynamic = "force-dynamic";


export default async function Page({
  params,
}: {
  params: Promise<{ transferId: string }>;
}) {
  const { transferId } = await params;
  const token = await (await cookies()).get("token")?.value;
  const data = await getTransferDetail(Number(transferId), token as string);
  if (!data) {
    return notFound();
  } else {
    return (
      <MainLayout title="Detalhes da transferência">
       <div className="w-full h-screen flex justify-center items-center">
         <div className="w-[80vw] lg:w-[500px] h-full flex flex-col justify-center items-center gap-2.5 py-2.5">
          <h1
            className={`${hammersmithOne.className} text-green-900 text-3xl font-bold text-center w-full `}
          >
            Informação do Gasto
          </h1>

          <FormTrasnfer storedTransfer={data} />
        </div>
       </div>
      </MainLayout>
    );
  }
}
