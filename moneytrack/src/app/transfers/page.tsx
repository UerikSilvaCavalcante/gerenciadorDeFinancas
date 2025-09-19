"use client";
import { Hammersmith_One, Montserrat } from "next/font/google";
import MainLayout from "../components/mainLayout";
import {
  TransferDay,
  TransferMounth,
  Trasnsfer,
} from "../components/trasnfersByMounth";
import { Input, Checkbox, Select } from "../components/UI/input";
import { PrimaryButton, SecundaryButton } from "../components/UI/buttons";
import { List } from "react-window";
import { type RowComponentProps } from "react-window";
import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormRegister } from "react-hook-form";
import { useState } from "react";
import {hammersmithOne, montserrat} from "../components/mainLayout";

const trasnferFilter = z.object({
  min: z.number().min(0, { message: "O valor mínimo é 0" }).optional(),
  max: z.number().min(0, { message: "O valor mínimo é 0" }).optional(),
  type: z.array(z.string()).optional(),
  de: z.date().optional(),
  ate: z.date().optional(),
});

export type trasnferFilterForm = z.infer<typeof trasnferFilter>;


export type dataProps = {
  mounth: number;
  trasnsfers: {
    day: string;
    valueTot: number;
    trasnfer: {
      desc: string;
      methood: string;
      type: number;
      value: number;
    }[];
  }[];
};

export type RowProps = {
  filteredData: dataProps[];
};

const data: dataProps[] = [
  {
    mounth: 0,
    trasnsfers: [
      {
        day: "2025-01-22",
        valueTot: 100,
        trasnfer: [
          {
            desc: "desc 1",
            methood: "methood 1",
            type: 0,
            value: 100,
          },
        ],
      },
      {
        day: "2025-01-24",
        valueTot: 150,
        trasnfer: [
          {
            desc: "desc 1",
            methood: "methood 1",
            type: 2,
            value: 100,
          },
          {
            desc: "desc 1",
            methood: "methood 1",
            type: 3,
            value: 50,
          },
        ],
      },
    ],
  },
  {
    mounth: 1,
    trasnsfers: [
      {
        day: "2025-02-22",
        valueTot: 100,
        trasnfer: [
          {
            desc: "desc 1",
            methood: "methood 1",
            type: 0,
            value: 100,
          },
        ],
      },
      {
        day: "2025-02-24",
        valueTot: 50,
        trasnfer: [
          {
            desc: "desc 1",
            methood: "methood 1",
            type: 1,
            value: 50,
          },
        ],
      },
      {
        day: "2025-02-24",
        valueTot: 50,
        trasnfer: [
          {
            desc: "desc 1",
            methood: "methood 1",
            type: 4,
            value: 50,
          },
        ],
      },
    ],
  },
  {
    mounth: 2,
    trasnsfers: [
      {
        day: "2025-03-22",
        valueTot: 100,
        trasnfer: [
          {
            desc: "desc 1",
            methood: "methood 1",
            type: 4,
            value: 100,
          },
        ],
      },
      {
        day: "2025-03-24",
        valueTot: 50,
        trasnfer: [
          {
            desc: "desc 1",
            methood: "methood 1",
            type: 1,
            value: 50,
          },
        ],
      },
      {
        day: "2025-03-24",
        valueTot: 50,
        trasnfer: [
          {
            desc: "desc 1",
            methood: "methood 1",
            type: 3,
            value: 50,
          },
        ],
      },
    ],
  },
];
export default function Transfer() {
  const [filteredData, setFilteredData] = useState<dataProps[]>(data);

  const { register, handleSubmit, reset, formState } =
    useForm<trasnferFilterForm>({
      resolver: zodResolver(trasnferFilter),
    });

  const handleSubmitFilter = (filterForm: trasnferFilterForm) => {
    let filtered = data;
    

    filtered = data.map((item) => {
      const trasnfers = item.trasnsfers
        .map((day) => {
          const filteredTransfers = day.trasnfer.filter((transfer) => {
            // sem filtro de tipo -> aceita todos
            if (!filterForm.type || filterForm.type.length <= 0) {
              return true;
            }

            const allowed = filterForm.type
              ? new Set(filterForm.type.map(Number))
              : null;
            return allowed?.has(Number(transfer.type));
          });
          const newValueTot = filteredTransfers.reduce(
            (s, t) => s + (t.value ?? 0),
            0
          );
          return {
            ...day,
            trasnfer: filteredTransfers,
            valueTot: newValueTot,
          };
        })
        .filter((day) => day.trasnfer && day.trasnfer.length > 0)
        .filter((day) => {
          const minOk =
            filterForm.min == undefined || day.valueTot >= filterForm.min;
          const maxOk =
            filterForm.max == undefined || day.valueTot <= filterForm.max;
          return minOk && maxOk;
        })
        .filter((day) => day.trasnfer && day.trasnfer.length > 0)
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
        trasnsfers: trasnfers,
      };
    });

   
    
    setFilteredData(filtered);
  };

  const Row = ({ index, style, filteredData }: RowComponentProps<RowProps>) => {
    return (
      <div
        className="w-full flex flex-row justify-center items-center"
        key={index}
        style={style}
      >
        <TransferMounth mounth={filteredData[index].mounth}>
          {filteredData[index].trasnsfers.map((trasnfer, index) => (
            <div
              key={index}
              className="w-full flex flex-col justify-start items-start"
            >
              <TransferDay date={trasnfer.day} valueTot={trasnfer.valueTot} />
              {trasnfer.trasnfer.map((transfer, index) => (
                <Trasnsfer
                  key={index}
                  value={transfer.value}
                  desc={transfer.desc}
                  methood={transfer.methood}
                  type={transfer.type}
                />
              ))}
            </div>
          ))}
        </TransferMounth>
      </div>
    );
  };

  const rowHeight = (index: number, { filteredData }: RowProps) => {
    const trasnfer = filteredData[index].trasnsfers;
    const trasnferHeight = trasnfer.length;
    const day = trasnfer.flatMap((d) => d.trasnfer);
    const dayHeight = day.length;
    return (trasnferHeight + dayHeight) * 60;
  };
  return (
    <MainLayout title="Transfers">
      <div className="flex flex-row h-full w-[80vw] gap-2.5 p-2.5 ">
        <div className=" h-full w-full flex flex-col justify-center items-center p-2 bg-green-100 gap-2">
          <div className="h-full w-full ">
            <List
              rowComponent={Row}
              rowCount={filteredData.length}
              rowHeight={rowHeight}
              rowProps={{ filteredData }}
            />
          </div>
        </div>
        <div className="h-full w-[500px] flex flex-col justify-between items-center bg-green-400 rounded-md p-2.5">
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
                  reset();
                  setFilteredData(data);
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
