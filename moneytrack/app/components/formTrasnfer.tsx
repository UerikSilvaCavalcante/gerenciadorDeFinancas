"use client";
import { hammersmithOne } from "./mainLayout";
import { Input, Select } from "./UI/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PaymentMethodEnum, TypeTransferEnum } from "../enums/TransferEnums";
import { TransferType } from "../types/transferType";
import { parseCookies } from "nookies";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { AddTransfer } from "../http/addTransfer";
import { queryClient } from "../helper/useQuery";
import { PrimaryButton, SecundaryButton } from "./UI/buttons";
import { RespnseTransferType } from "../types/transferType";
import { useQuery } from "@tanstack/react-query";
import { GetCartoes } from "../http/getCartões";
import { useEffect } from "react";
import editTransfer from "../http/editTransfer";

const trasnferForm = z.object({
  value: z
    .number({ message: "O valor mínimo é 0" })
    .min(0, { message: "O valor mínimo é 0" }),
  type: z.nativeEnum(TypeTransferEnum, {
    message: "Selecione pelo menos um tipo",
  }),
  methood: z.nativeEnum(PaymentMethodEnum, {
    message: "Selecione pelo menos um método",
  }),
  data: z.date({ message: "A data deve ser futura" }),
  cartao_id: z.number(),
  desc: z.string().optional(),
});

type transferFormType = z.infer<typeof trasnferForm>;

export const FormTrasnfer = ({
  storedTransfer,
  close,
}: {
  storedTransfer?: RespnseTransferType;
  close?: () => void;
}) => {
  const { token } = parseCookies();

  const { data } = useQuery({
    queryKey: ["cards"],
    queryFn: () => {
      if (token) {
        const decode = jwtDecode<{
          id: string;
          exp: number;
        }>(token);
        return GetCartoes(parseInt(decode.id), token);
      }
      return [];
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<transferFormType>({
    resolver: zodResolver(trasnferForm),
    defaultValues: {
      value: storedTransfer?.value || 0,
      type: storedTransfer?.type_transfer || 0,
      methood: storedTransfer?.payment_method || 0,
      data: (storedTransfer?.date as unknown as Date) || new Date(),
      cartao_id: storedTransfer?.card_id || 0,
      desc: storedTransfer?.description || "",
    },
  });

  useEffect(() => {
    if (data != undefined) {
      reset();
    }
  }, [data]);

  const handleSubmitForm = (data: transferFormType) => {
    if (
      (data.methood == PaymentMethodEnum.Credito ||
        data.methood == PaymentMethodEnum.Debito) &&
      !data.cartao_id
    ) {
      setError("cartao_id", { message: "Selecione um cartão" });
      return;
    }
    const { token } = parseCookies();
    if (token) {
      const decode = jwtDecode<{
        id: string;
        exp: number;
      }>(token);
      const transfer: TransferType = {
        id: 0,
        user_id: Number(decode.id),
        value: data.value,
        description: data.desc || "",
        type_transfer: data.type,
        payment_method: data.methood,
        card_id: data.cartao_id,
        date: new Date(data.data),
      };
      if (storedTransfer) {
        toast.promise(
          editTransfer(storedTransfer.id, token, transfer).then((res) => {
            if (res.success) {
              queryClient.invalidateQueries({ queryKey: ["transfers"] });
              queryClient.invalidateQueries({ queryKey: ["graphType"] });
              queryClient.invalidateQueries({ queryKey: ["graphMounth"] });
              reset();
              if (close) {
                close();
              }
            }
            return res;
          }),
          {
            loading: "Editando transferência..",
            success: (data) => {
              if (data) {
                return data.message;
              }
            },
            error: (data) => {
              return data.message;
            },
          }
        );
      } else {
        toast.promise(
          AddTransfer(transfer, token)
            .then((res) => {
              if (res.success) {
                queryClient.invalidateQueries({ queryKey: ["transfers"] });
                queryClient.invalidateQueries({ queryKey: ["graphType"] });
                queryClient.invalidateQueries({ queryKey: ["graphMounth"] });
                reset();
                if (close) {
                  close();
                }
              }
              return res;
            })
            .catch((res) => {
              return res;
            }),

          {
            loading: "Adicionando transferência..",
            success: (data) => {
              if (data) {
                return data.message;
              }
            },
            error: (data) => {
              return data.message;
            },
          }
        );
      }
    }
  };

  return (
    <form
      action=""
      onSubmit={handleSubmit(handleSubmitForm)}
      className="h-full w-full flex flex-col justify-between items-center p-2  "
    >
      <div className="w-full flex flex-col justify-center items-center gap-2">
        <div className="w-full flex flex-col justify-start items-start bg-green-500 rounded-md p-2">
          <label
            className={`${hammersmithOne.className} text-green-900 text-sm text-left w-full`}
            htmlFor="value"
          >
            Valor{" "}
            {errors.value && (
              <p className="text-red-500">{errors.value.message}</p>
            )}
          </label>
          <Input
            id="value"
            type="number"
            placeholder="R$ 0,00"
            width="w-full"
            min={0}
            step={0.01}
            {...register("value", { valueAsNumber: true })}
          />
        </div>
        <div className="w-full flex justify-between items-center gap-2">
          <div className="w-full flex flex-col justify-start items-start bg-green-500 rounded-md p-2">
            <label
              className={`${hammersmithOne.className} text-green-900 text-sm text-left w-full`}
              htmlFor="type"
            >
              Tipo de Transferencia{" "}
              {errors.type && (
                <p className="text-red-500">{errors.type.message}</p>
              )}
            </label>
            <Select
              id="type"
              width="w-full"
              {...register("type", { valueAsNumber: true })}
            >
              <option value="0">Selecione</option>
              <option value={1}>Lazer</option>
              <option value={2}>Alimentação</option>
              <option value={3}>Saúde</option>
              <option value={4}>Trasnporte</option>
              <option value={5}>Conta</option>
              <option value={6}>Outro</option>
            </Select>
          </div>
          <div className="w-full flex flex-col justify-start items-start bg-green-500 rounded-md p-2">
            <label
              className={`${hammersmithOne.className} text-green-900 text-sm text-left w-full`}
              htmlFor="methood"
            >
              Metodo de Pagamento{" "}
              {errors.methood && (
                <p className="text-red-500">{errors.methood.message}</p>
              )}
            </label>
            <Select
              id="methood"
              width="w-full"
              {...register("methood", { valueAsNumber: true })}
            >
              <option value="0">Selecione</option>
              <option value={1}>Cartão de Credito</option>
              <option value={2}>Cartão de Debito</option>
              <option value={3}>Dinheiro</option>
              <option value={4}>Pix</option>
            </Select>
          </div>
        </div>
        <div className="w-full flex justify-between items-center gap-2">
          <div className="w-full flex flex-col justify-start items-start bg-green-500 rounded-md p-2">
            <label
              className={`${hammersmithOne.className} text-green-900 text-sm text-left w-full`}
              htmlFor="data"
            >
              Data{" "}
              {errors.data && (
                <p className="text-red-500">{errors.data.message}</p>
              )}
            </label>
            <Input
              id="data"
              type="date"
              width="w-full"
              {...register("data", { valueAsDate: true })}
            />
          </div>
          <div className="w-full flex flex-col justify-start items-start bg-green-500 rounded-md p-2">
            <label
              className={`${hammersmithOne.className} text-green-900 text-sm text-left w-full`}
              htmlFor="cardId"
            >
              Cartão{" "}
              {errors.cartao_id && (
                <p className="text-red-500">{errors.cartao_id.message}</p>
              )}
            </label>
            <Select
              id="cardId"
              width="w-full"
              {...register("cartao_id", { valueAsNumber: true })}
            >
              <option value={0}>Selecione</option>
              {data ? (
                data.map((cd) => (
                  <option key={cd.id} value={cd.id}>
                    {cd.bank} - {cd.type_card}
                  </option>
                ))
              ) : (
                <option value="0">Nenhum cartão cadastrado</option>
              )}
            </Select>
          </div>
        </div>
        <div className="w-full flex flex-col justify-start items-start bg-green-500 rounded-md p-2">
          <label
            className={`${hammersmithOne.className} text-green-900 text-sm text-left w-full`}
            htmlFor="desc"
          >
            Descrição{" "}
            {errors.desc && (
              <p className="text-red-500">{errors.desc.message}</p>
            )}
          </label>
          <Input
            id="desc"
            type="text"
            placeholder="Coca-cola...."
            width="w-full"
            {...register("desc")}
          />
        </div>
      </div>
      <div className="w-full p-2 flex flex-row justify-center items-center gap-2.5">
        <PrimaryButton type="submit" width="w-full" content="Salvar" />
        <SecundaryButton
          type="button"
          width="w-full"
          content="Cancelar"
          onClick={() => {
            if (close) {
              close();
            }
            reset();
          }}
        />
      </div>
    </form>
  );
};
