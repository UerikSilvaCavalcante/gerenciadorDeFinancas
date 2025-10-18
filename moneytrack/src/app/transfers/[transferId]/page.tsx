import { cookies } from "next/headers";
import { getTransferDetail } from "@/app/http/getTransferDetail";
import MainLayout, {
  hammersmithOne,
  montserrat,
} from "@/app/components/mainLayout";
import { notFound } from "next/navigation";
import { FormTrasnfer } from "@/app/components/formTrasnfer";

// garante que sempre seja dinâmico (e cookies possam ser acessados)
export const dynamic = "force-dynamic";

const FieldInfo = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="w-full h-full flex flex-col p-1.5 bg-green-500 rounded-md gap-1 justify-start items-start">
      <h1
        className={`${hammersmithOne.className} text-green-900 text-md text-left`}
      >
        {label}
      </h1>
      <h1
        className={`${montserrat.className} text-green-900 text-md text-left text-nowrap border-2 border-green-900 rounded-md p-1 w-full`}
      >
        {value}
      </h1>
    </div>
  );
};

export default async function Page({
  params,
}: {
  params: Promise<{ transferId: string }>;
}) {
  const { transferId } = await params;
  const token = await (await cookies()).get("token")?.value;
  const data = await getTransferDetail(Number(transferId), token as string);
  console.log(data);
  if (!data) {
    return notFound();
  } else {
    return (
      <MainLayout title="Detalhes da transferência">
        <div className="w-[500px] h-full flex flex-col justify-center items-center gap-2.5 py-2.5">
          <h1
            className={`${hammersmithOne.className} text-green-900 text-3xl font-bold text-center w-full `}
          >
            Informação do Gasto
          </h1>

          <FormTrasnfer transfer={data} />
        </div>
      </MainLayout>
    );
  }
}
