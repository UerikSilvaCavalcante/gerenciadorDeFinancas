import { cookies } from "next/headers";
import { getTransferDetail } from "../../http/getTransferDetail";
import MainLayout, { hammersmithOne } from "../../components/mainLayout";
import { notFound } from "next/navigation";
import { FormTrasnfer } from "../../components/formTrasnfer";

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
        <div className="w-full h-dvh flex justify-start items-center bg-green-200 rounded-xl">
          <div className="w-[80vw] lg:w-[500px] h-[90%] flex flex-col justify-start items-center gap-2.5 py-2.5 ">
            <h1
              className={`${hammersmithOne.className} text-green-900 text-3xl font-bold text-center w-full `}
            >
              Informação do Gasto
            </h1>

            <div className="w-full h-[50%] flex justify-center items-center">
              <FormTrasnfer storedTransfer={data} />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
}
