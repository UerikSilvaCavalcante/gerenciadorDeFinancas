"use client";

import MainLayout from "../components/mainLayout";
import {
  TransferDay,
  TransferMounth,
  Trasnsfer,
} from "../components/trasnfersByMounth";
import { Input, Checkbox } from "../components/UI/input";
import { PrimaryButton, SecundaryButton } from "../components/UI/buttons";
import { List  } from "react-window";
import { type RowComponentProps } from "react-window";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormRegister } from "react-hook-form";
import { useEffect, useState } from "react";
import { hammersmithOne } from "../components/mainLayout";
import { useQuery } from "@tanstack/react-query";
import { TransferMounthType } from "../@types/transferType";
import { parseCookies } from "nookies";
import { getListTransfers } from "../http/getListTransfers";
import Loader from "../components/loader";
import { jwtDecode } from "jwt-decode";
import { MenuOptions } from "../components/UI/menuOptions";

export const trasnferFilter = z.object({
  min: z.number().min(0, { message: "O valor mínimo é 0" }).optional(),
  max: z.number().min(0, { message: "O valor mínimo é 0" }).optional(),
  type: z.array(z.string()).optional(),
  de: z.date().optional(),
  ate: z.date().optional(),
});

export type trasnferFilterForm = z.infer<typeof trasnferFilter>;



export const Row = ({
  index,
  style,
  filteredData,
}: RowComponentProps<RowProps>) => {
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
              <div className="w-full h-[60px] flex justify-items-center " key={index}>
                <Trasnsfer
                
                value={transfer.value}
                desc={transfer.desc ? transfer.desc : ""}
                methood={transfer.payment_method}
                type={transfer.type_transfer}
              />
              <MenuOptions id={transfer.id} />
              </div>
            ))}
          </div>
        ))}
      </TransferMounth>
    </div>
  );
};

export const rowHeight = (index: number, { filteredData }: RowProps) => {
  const trasnfer = filteredData[index].days;
  const trasnferHeight = trasnfer.length;
  const day = trasnfer.flatMap((d) => d.transfers);
  const dayHeight = day.length;
  return 32 + (trasnferHeight * 32 )+ (dayHeight * 60);
};

export type RowProps = {
  filteredData: TransferMounthType[];
};

export default function Transfer() {
  const { data, isLoading } = useQuery({
    queryKey: ["transfers"],
    queryFn: () => {
      const { token } = parseCookies();
      if (token) {
        const decode = jwtDecode<{
          id: string;
          exp: number;
        }>(token);
        return getListTransfers(parseInt(decode.id), token);
      }
      return [];
    },
  });

  const [filteredData, setFilteredData] = useState<TransferMounthType[] | null>(
    null
  );
  useEffect(() => {
    if (data != undefined) {
      setFilteredData(data);
    }
  }, [data]);

  const { register, handleSubmit, reset, formState } =
    useForm<trasnferFilterForm>({
      resolver: zodResolver(trasnferFilter),
    });

  const handleSubmitFilter = (filterForm: trasnferFilterForm) => {
    if (data) {
      let filtered = data;

      filtered = data.map((item) => {
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
              filterForm.min == undefined || Number(day.valueTot) >= filterForm.min;
            const maxOk =
              filterForm.max == undefined || Number(day.valueTot) <= filterForm.max;
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
      }).filter((item) =>  item.days && item.days.length > 0);
      setFilteredData(filtered);
    }
  };

  return (
    <MainLayout title="Transfers">
      <div className="flex flex-col lg:flex-row h-full w-[95vw] gap-2.5 p-2.5 ">
        <div className=" h-[70vh] lg:h-full lg:w-[70%] w-full  flex flex-col justify-center items-center p-2 bg-green-100 gap-2">
          <div className="h-full w-full ">
            {isLoading ? (
              <div className="w-full h-full flex justify-center items-center ">
                <Loader />
              </div>
            ) : (
              filteredData && filteredData.length > 0 ? (
                <List
                  rowComponent={Row}
                  rowCount={filteredData.length}
                  rowProps={{ filteredData }}
                  rowHeight={rowHeight}
                />
              ) : (
                <div className="w-full h-full flex justify-center items-center">
                  <h1
                    className={`${hammersmithOne.className} text-green-900 text-sm text-center`}
                  >
                    Nenhum Gasto encontrado
                  </h1>
                </div>
              )
            )}
          </div>
        </div>
        <div className="h-[30%] lg:h-full w-full lg:w-[30%] flex flex-col justify-between items-center bg-green-400 rounded-md p-2.5">
          <div className="w-full flex  justify-center items-center ">
            <div className="w-[20px] h-[20px] bg-green-900 rounded-full "></div>
            <div className="w-full h-1 bg-green-600 rounded-full"></div>
            <div className="w-[20px] h-[20px] bg-green-900 rounded-full "></div>
          </div>
          <form
            action=""
            className="w-full h-full flex flex-col justify-start items-center gap-2 p-2.5 "
          >
            <h1
              className={`${hammersmithOne.className} text-green-900 text-sm w-full text-left`}
            >
              Intervalor de Gastos
            </h1>
            <div className="flex justify-center items-center w-full gap-2.5 p-2.5">
              {formState.errors.min && (
                <span className="text-red-600">
                  {formState.errors.min.message}
                </span>
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
            <div className="w-full flex flex-col justify-center items-start p-2.5 gap-2.5">
              <div className="w-fit h-fit flex flex-row justify-start items-center gap-2.5  ">
                <Checkbox
                  id="alimentacao"
                  register={register as UseFormRegister<trasnferFilterForm>}
                  value="2"
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
                  value="4"
                />
                <h2
                  className={`${hammersmithOne.className} text-green-900 text-sm w-full text-left`}
                >
                  Transporte
                </h2>
              </div>
              <div className="w-fit h-fit flex flex-row justify-start items-center gap-2.5  ">
                <Checkbox
                  id="saude"
                  cl="type"
                  value="3"
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
            <div className="h-full "></div>
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
                  reset();
                  if (data != undefined) {
                    setFilteredData(data);
                  }
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
