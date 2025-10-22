"use client";

import MainLayout from "../components/mainLayout";
import { Input, Checkbox, Select } from "../components/UI/input";
import { PrimaryButton, SecundaryButton } from "../components/UI/buttons";
import { List } from "react-window";
import { type RowComponentProps } from "react-window";
import { zodResolver } from "@hookform/resolvers/zod";
import { hammersmithOne } from "../components/mainLayout";
import { trasnferFilterForm, trasnferFilter } from "../transfers/page";
import { RowProps } from "../transfers/page";
import { CardComponent } from "../components/cardComponent";
import { CardForm, CardFormsType, TypeEnum } from "../components/modalAddCard";
import { useForm, UseFormRegister } from "react-hook-form";
import { CardDetailType, CardType } from "../@types/cardType";
import { useEffect, useState } from "react";
import { TransferMounthType } from "../@types/transferType";
import {
  TransferDay,
  TransferMounth,
  Trasnsfer,
} from "../components/trasnfersByMounth";
import { toast } from "sonner";
import { EditCard } from "../http/editCard";
import { queryClient } from "../helper/useQuery";
import { Trash } from "./UI/trash";
import { ModalDelete, useModelTransition } from "./modalDelete";
import DeleteCard from "../http/deleteCard";
import { useRouter } from "next/navigation";

const Row = ({ index, style, filteredData }: RowComponentProps<RowProps>) => {
  return (
    <div
      className="w-full h-full flex flex-row justify-start items-start"
      key={index}
      style={style}
    >
      <TransferMounth mounth={Number(filteredData[index].mounth)}>
        {filteredData[index].days.map((day, index) => (
          <div
            key={index}
            className="w-full h-full flex flex-col justify-start items-start"
          >
            <TransferDay date={day.day} valueTot={day.valueTot} />
            {day.transfers.map((transfer, index) => (
              <Trasnsfer
                key={index}
                value={transfer.value}
                desc={transfer.desc ? transfer.desc : ""}
                methood={transfer.payment_method}
                type={transfer.type_transfer}
              />
            ))}
          </div>
        ))}
      </TransferMounth>
    </div>
  );
};

const rowHeight = (index: number, { filteredData }: RowProps) => {
  const trasnfer = filteredData[index].days;
  const trasnferHeight = trasnfer.length;
  const day = trasnfer.flatMap((d) => d.transfers);
  const dayHeight = day.length;
  return 32 + trasnferHeight * 32 + dayHeight * 60;
};

export function RenderCardDetail({
  card,
  token,
}: {
  card: CardDetailType;
  token: string;
}) {
  const [filteredData, setFilteredData] = useState<TransferMounthType[] | null>(
    card.transfers
  );

  useEffect(() => {
    if (card) {
      setFilteredData(card.transfers);
    }
  }, []);

  const cardF: CardFormsType = {
    bank: card?.card.bank,
    type:
      card?.card.type_card == "Credito"
        ? TypeEnum.CREDIT
        : card?.card.type_card == "Debito"
        ? TypeEnum.DEBIT
        : TypeEnum.CREDIT_DEBIT,
    brand: card?.card.bander,
    limit: card?.card.limit,
    color: card?.card.color,
  };

  const {
    register: registerCard,
    handleSubmit: handleSubmitCard,
    formState: { errors: errorsCard },
    setError,
    reset: resetCard,
  } = useForm<CardFormsType>({
    resolver: zodResolver(CardForm),
    defaultValues: cardF,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<trasnferFilterForm>({
    resolver: zodResolver(trasnferFilter),
  });

  const handleSubumitForm = (data: CardFormsType) => {
    if (
      (data.type == TypeEnum.CREDIT_DEBIT || data.type == TypeEnum.CREDIT) &&
      !data.limit
    ) {
      setError("limit", { message: "Campo obrigatório" });
      return;
    }

    const cardPut: CardType = {
      id: card.card.id,
      user_id: card.card.user,
      bank: data.bank,
      type_card: data.type,
      bander: data.brand,
      limit: data.limit ?? 0,
      color: data.color,
    };
    toast.promise(
      EditCard(cardPut, token).then((res) => {
        if (res.success) {
          queryClient.invalidateQueries({ queryKey: ["cards"] });
          window.location.reload();
        }
      }),
      {
        loading: "Editando cartão",
        success: "Cartão editado com sucesso",
        error: (data) => {
          return data.message;
        },
      }
    );
  };

  const utilitedLimit = (card.limit / card.card.limit) * 100;
  const handleSubmitFilter = (filterForm: trasnferFilterForm) => {
    if (filteredData) {
      let filtered = filteredData;

      filtered = filteredData
        ?.map((item) => {
          const trasnfers = item.days
            .map((day) => {
              const filteredTransfers = day.transfers.filter((transfer) => {
                // sem filtro de tipo -> aceita todos
                if (!filterForm.type || filterForm.type.length <= 0) {
                  return true;
                }

                const allowed = filterForm.type
                  ? new Set(filterForm.type.map(Number))
                  : null;
                return allowed?.has(Number(transfer.type_transfer));
              });
              const newValueTot = filteredTransfers.reduce(
                (s, t) => Number(s) + (Number(t.value) ?? 0),
                0
              );
              return {
                ...day,
                valueTot: newValueTot,
                transfers: filteredTransfers,
              };
            })
            .filter((day) => day.transfers && day.transfers.length > 0)
            .filter((day) => {
              const minOk =
                filterForm.min == undefined ||
                Number(day.valueTot) >= filterForm.min;
              const maxOk =
                filterForm.max == undefined ||
                Number(day.valueTot) <= filterForm.max;
              return minOk && maxOk;
            })
            .filter((day) => day.transfers && day.transfers.length > 0)
            .filter((day) => {
              const minDate =
                filterForm.de == null ||
                new Date(day.day) >= new Date(filterForm.de);
              const maxDate =
                filterForm.ate == null ||
                new Date(day.day) <= new Date(filterForm.ate);
              return minDate && maxDate;
            });

          return {
            ...item,
            days: trasnfers,
          };
        })
        .filter((item) => item.days && item.days.length > 0);

      setFilteredData(filtered);
    }
  };
  const { isOpen, open, close } = useModelTransition();
  const router = useRouter();
  const handleDelete = () => {
    toast.promise(
      DeleteCard(card.card.id, token).then((res) => {
        if (res.success) {
          queryClient.invalidateQueries({ queryKey: ["cards"] });
          router.push("/home");
        }
        return res;
      }),
      {
        loading: "Deletando cartão",
        success: "Cartão deletado com sucesso",
        error: (data) => {
          return data.message;
        },
      }
    );
  };
  return (
    <MainLayout title="Card Transfer">
      <ModalDelete close={close} isOpen={isOpen} handleDelete={handleDelete} />
      <div className="flex flex-col lg:flex-row h-full w-[95vw] lg:w-[70vw] gap-2.5 p-2.5 ">
        <div className=" h-[90vh] lg:h-full w-full flex flex-col justify-center items-center p-2  gap-2.5 relative ">
          <div className="w-full lg:h-[40%] bg-green-100 rounded-md flex flex-col lg:flex-row  justify-around  items-center p-2.5 gap-2 ">
            <CardComponent
              id={card.card.id}
              bank={card.card.bank}
              type={card.card.type_card}
              bander={card.card.bander}
              color={card.card.color}
              className="lg:w-[500px] lg:h-[100px] h-[90px] w-[50px]"
            />
            <div
              className="absolute top-2 right-2 cursor-pointer"
              onClick={open}
            >
              <Trash />
            </div>
            <div className=" h-full flex w-full flex-col justify-center items-center">
              <h1
              className={`${hammersmithOne.className} text-green-900 text-center text-[12px] lg:text-xl`}
            >
              Limite disponivel do Cartão
            </h1>
            <div className="w-full  flex justify-center items-center gap-1 relative">
              <div className="relative w-[100px] h-[100px] lg:w-[150px] lg:h-[150px] -rotate-90">
                <svg className="relative w-full h-full">
                  <circle
                    className="progressbar stroke-green-300"
                    cx="50%"
                    cy="50%"
                    r="40%"
                  ></circle>
                  <circle
                    className="progressbar__svg stroke-green-700"
                    style={{
                      strokeDasharray: card.card.limit,
                      strokeDashoffset: card.card.limit - utilitedLimit,
                    }}
                    cx="50%"
                    cy="50%"
                    r="40%"
                  ></circle>

                  {/* <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl text-green-900 rotate-90">
                  {card.card.limit - card.limit}
                </span> */}
                </svg>
                <span className="absolute top-[50%] left-1/2 transform -translate-x-[40%] -translate-y-[20%] text-[12px] lg:text-sm text-green-900 rotate-90">
                  R${Number(card.card.limit - card.limit).toFixed(2)}
                </span>
              </div>
            </div>
            </div>
          </div>
          <div className="w-full h-[60%] bg-green-100 rounded-md">
            {filteredData && filteredData.length > 0 ? (
              <div className=" w-full h-full ">
                <List
                  rowComponent={Row}
                  rowCount={filteredData.length}
                  rowProps={{ filteredData }}
                  rowHeight={rowHeight}
                />
              </div>
            ) : (
              <div className="w-full h-full flex justify-center items-center">
                <h1
                  className={`${hammersmithOne.className} text-green-900 text-sm text-center`}
                >
                  Nenhum Gasto encontrado
                </h1>
              </div>
            )}
          </div>
        </div>

        <div className="lg:h-full h-[30%] lg:w-[40%] w-full flex flex-col justify-start items-start bg-green-400 rounded-md p-2.5">
          <div className="w-full flex  justify-center items-center ">
            <div className="w-[20px] h-[20px] bg-green-900 rounded-full "></div>
            <div className="w-full h-1 bg-green-600 rounded-full"></div>
            <div className="w-[20px] h-[20px] bg-green-900 rounded-full "></div>
          </div>
          <form
            action=""
            onSubmit={handleSubmitCard(handleSubumitForm)}
            className="h-full w-full flex flex-col justify-between items-center p-1 "
          >
            <div className="w-full flex flex-col justify-center items-center gap-1">
              <div className="w-full flex flex-col justify-start gap-1 items-start ">
                <label
                  className={`${hammersmithOne.className} text-green-900 text-sm text-left w-full`}
                  htmlFor="brand"
                >
                  Bandeira{" "}
                  {errorsCard.brand && (
                    <span className="text-red-600">
                      {errorsCard.brand.message}
                    </span>
                  )}
                </label>
                <Input
                  id="brand"
                  type="text"
                  placeholder="MasterCard"
                  width="w-full"
                  {...registerCard("brand")}
                />
              </div>
              <div className="w-full flex justify-between items-center gap-1">
                <div className="w-full flex flex-col justify-start items-start  gap-1">
                  <label
                    className={`${hammersmithOne.className} text-green-900 text-sm text-left w-full`}
                    htmlFor="type"
                  >
                    Tipo de Cartão{" "}
                    {errorsCard.type && (
                      <span className="text-red-600">
                        {errorsCard.type.message}
                      </span>
                    )}
                  </label>
                  <Select
                    id="type"
                    width="w-full"
                    {...registerCard("type", { valueAsNumber: true })}
                  >
                    <option value="0">Selecione</option>
                    <option value={1}>Credito</option>
                    <option value={2}>Debito</option>
                    <option value={3}>Credito e Debito</option>
                  </Select>
                </div>
                <div className="w-full flex flex-col justify-start items-start ">
                  <label
                    className={`${hammersmithOne.className} text-green-900 text-sm text-left w-full`}
                    htmlFor="bank"
                  >
                    Banco{" "}
                    {errorsCard.bank && (
                      <span className="text-red-600">
                        {errorsCard.bank.message}
                      </span>
                    )}
                  </label>
                  <Input
                    id="bank"
                    type="text"
                    placeholder="Inter"
                    width="w-full"
                    {...registerCard("bank")}
                  />
                </div>
              </div>
              <div className="w-full flex justify-between items-center gap-1">
                <div className="w-full flex flex-col justify-start items-start ">
                  <label
                    className={`${hammersmithOne.className} text-green-900 text-sm text-left w-full`}
                    htmlFor="limit"
                  >
                    Limite{" "}
                    {errorsCard.limit && (
                      <span className="text-red-600">
                        {errorsCard.limit.message}
                      </span>
                    )}
                  </label>
                  <Input
                    id="limit"
                    type="number"
                    width="w-full"
                    min={0}
                    step={0.01}
                    {...registerCard("limit", {
                      setValueAs: (v) => (v === "" ? undefined : Number(v)),
                    })}
                  />
                </div>
                <div className="w-full flex flex-col justify-start items-start ">
                  <label
                    htmlFor="color"
                    className={`${hammersmithOne.className} text-green-900 text-sm text-left w-full`}
                  >
                    Cor
                  </label>
                  <Input
                    id="color"
                    type="color"
                    width="w-full h-[30px]"
                    {...registerCard("color")}
                  />
                </div>
              </div>
            </div>

            <div className="w-full p-2 flex flex-row justify-center items-center gap-2.5">
              <PrimaryButton type="submit" width="w-full" content="Salvar" />
              <SecundaryButton
                type="button"
                width="w-full"
                content="Cancelar"
                onClick={() => resetCard()}
              />
            </div>
          </form>
          <form
            action=""
            className="w-full h-full flex flex-col justify-between items-center gap-0.5 p-1 "
          >
            <h1
              className={`${hammersmithOne.className} text-green-900 text-sm w-full text-left`}
            >
              Intervalor de Gastos
            </h1>
            <div className="flex justify-center items-center w-full gap-2.5 p-2.5">
              {errors.min && (
                <span className="text-red-600">{errors.min.message}</span>
              )}
              <Input
                type="number"
                width="w-full"
                placeholder="Minimo"
                id="min"
                {...register("min", {
                  setValueAs: (v) => (v === "" ? undefined : Number(v)),
                })}
              />
              <div className="w-full h-1 bg-green-950 rounded-full"></div>
              <Input
                type="number"
                width="w-full"
                placeholder="Maximo"
                id="max"
                {...register("max", {
                  setValueAs: (v) => (v === "" ? undefined : Number(v)),
                })}
              />
            </div>
            <h1
              className={`${hammersmithOne.className} text-green-900 text-sm w-full text-left`}
            >
              Tipo de Gasto
            </h1>
            <div className="w-full flex flex-row justify-center items-start p-1 gap-0.5">
              <div className="w-full flex flex-col justify-center items-start gap-0.5">
                <div className="w-fit h-fit flex flex-row justify-start items-center gap-2.5  ">
                  <Checkbox
                    id="alimentacao"
                    register={register as UseFormRegister<trasnferFilterForm>}
                    value="0"
                    cl="type"
                  />

                  <h2
                    className={`${hammersmithOne.className} text-green-900 text-sm w-full text-left`}
                  >
                    Alimentação
                  </h2>
                </div>
                <div className="w-fit h-fit flex flex-row justify-start items-center gap-2.5  ">
                  <Checkbox
                    id="lazer"
                    cl="type"
                    register={register as UseFormRegister<trasnferFilterForm>}
                    value="1"
                  />
                  <h2
                    className={`${hammersmithOne.className} text-green-900 text-sm w-full text-left`}
                  >
                    Lazer
                  </h2>
                </div>
                <div className="w-fit h-fit flex flex-row justify-start items-center gap-2.5  ">
                  <Checkbox
                    id="transporte"
                    cl="type"
                    register={register as UseFormRegister<trasnferFilterForm>}
                    value="3"
                  />
                  <h2
                    className={`${hammersmithOne.className} text-green-900 text-sm w-full text-left`}
                  >
                    Transporte
                  </h2>
                </div>
              </div>
              <div className="w-full flex flex-col justify-center items-start gap-0.5 ">
                <div className="w-fit h-fit flex flex-row justify-start items-center gap-2.5  ">
                  <Checkbox
                    id="saude"
                    cl="type"
                    value="2"
                    register={register as UseFormRegister<trasnferFilterForm>}
                  />
                  <h2
                    className={`${hammersmithOne.className} text-green-900 text-sm w-full text-left`}
                  >
                    Saude
                  </h2>
                </div>
                <div className="w-fit h-fit flex flex-row justify-start items-center gap-2.5  ">
                  <Checkbox
                    id="contas"
                    cl="type"
                    register={register as UseFormRegister<trasnferFilterForm>}
                    value="5"
                  />
                  <h2
                    className={`${hammersmithOne.className} text-green-900 text-sm w-full text-left`}
                  >
                    Contas
                  </h2>
                </div>
                <div className="w-fit h-fit flex flex-row justify-start items-center gap-2.5  ">
                  <Checkbox
                    id="outros"
                    cl="type"
                    value="4"
                    register={register as UseFormRegister<trasnferFilterForm>}
                  />
                  <h2
                    className={`${hammersmithOne.className} text-green-900 text-sm w-full text-left`}
                  >
                    Outros
                  </h2>
                </div>
              </div>
            </div>
            <h1
              className={`${hammersmithOne.className} text-green-900 text-sm w-full text-left`}
            >
              Datas
            </h1>
            <div className="w-full flex flex-col justify-center items-start gap-2.5  ">
              <div className="w-full flex justify-center items-center gap-2">
                <Input
                  type="date"
                  width="w-full"
                  placeholder="De:"
                  {...register("de", {
                    setValueAs: (v) => (v == "" ? undefined : new Date(v)),
                  })}
                />
                <Input
                  type="date"
                  width="w-full"
                  placeholder="Ate:"
                  {...register("ate", {
                    setValueAs: (v) => (v == "" ? undefined : new Date(v)),
                  })}
                />
              </div>
            </div>
            <div className="w-full flex justify-center items-center gap-2.5">
              <PrimaryButton
                type="submit"
                onClick={handleSubmit(handleSubmitFilter)}
                content="Buscar"
                width="w-full"
              />
              <SecundaryButton
                type="reset"
                onClick={() => {
                  setFilteredData(card.transfers);
                  reset();
                }}
                content="Limpar"
                width="w-full"
              />
            </div>
          </form>
          <div className="w-full flex  justify-center items-center ">
            <div className="w-[20px] h-[20px] bg-green-900 rounded-full "></div>
            <div className="w-full h-1 bg-green-600 rounded-full"></div>
            <div className="w-[20px] h-[20px] bg-green-900 rounded-full "></div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
