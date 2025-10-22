"use client";

import { Dialog, DialogPanel, DialogBackdrop } from "@headlessui/react";
import { PrimaryButton, SecundaryButton } from "./UI/buttons";
import { hammersmithOne } from "./mainLayout";
import { Input, Select } from "./UI/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CardComponent } from "./cardComponent";
import { useState } from "react";
import { toast } from "sonner";
import { parseCookies } from "nookies";
import { jwtDecode } from "jwt-decode";
import { CardType } from "../../@types/cardType";
import { AddCard } from "../http/addCard";
import { queryClient } from "../helper/useQuery";

export const useModelTransitionC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
};

export enum TypeEnum {
  CREDIT = 1,
  DEBIT = 2,
  CREDIT_DEBIT = 3,
}

export const CardForm = z.object({
  brand: z.string().min(1, "Campo obrigatório"),
  type: z.nativeEnum(TypeEnum, { message: "Campo obrigatório" }),
  bank: z.string().min(1, "Campo obrigatório"),
  limit: z.number().optional(),
  color: z.string(),
});

export type CardFormsType = z.infer<typeof CardForm>;

export const ModalAddCard = ({
  isOpen,
  close,
}: {
  isOpen: boolean;
  close: () => void;
}) => {
  const [color, setColor] = useState<string>("#000000");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<CardFormsType>({
    resolver: zodResolver(CardForm),
  });

  const handleSubumitForm = (data: CardFormsType) => {
    if (
      (data.type == TypeEnum.CREDIT_DEBIT || data.type == TypeEnum.CREDIT) &&
      !data.limit
    ) {
      setError("limit", { message: "Campo obrigatório" });
      return;
    }
    const { token } = parseCookies();
    if (token) {
      const decode = jwtDecode<{
        id: string;
        exp: number;
      }>(token);
      const newCard: CardType = {
        id: 0,
        user_id: Number(decode.id),
        bank: data.bank,
        type_card: data.type,
        bander: data.brand,
        color: color,
        limit: data.limit || 0,
      };
      toast.promise(
        AddCard(newCard, token).then((res) => {
          if (res) {
            queryClient.invalidateQueries({ queryKey: ["cards"] });
            reset();
            close();
          }
          return res;
        }),
        {
          loading: "Adicionando cartão...",
          success: "Cartão adicionado com sucesso",
          error: (data) => {
            return data.message;
          },
        }
      );
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={close}
      as="div"
      className="fixed inset-0 z-10 overflow-y-auto relative "
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-transparent backdrop-blur-md transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
      <div className="fixed inset-0 flex w-screen items-center justify-start p-4 text-green-950">
        <DialogPanel className="max-w-lg w-[400px] h-full space-y-4 border bg-green-200 p-2.5 flex flex-col rounded-md shadow-lg justify-between items-center text-center">
          <div className="w-full flex  justify-center items-center ">
            <div className="w-[20px] h-[20px] bg-green-900 rounded-full "></div>
            <div className="w-full h-1 bg-green-600 rounded-full"></div>
            <div className="w-[20px] h-[20px] bg-green-900 rounded-full "></div>
          </div>
          <h1
            className={`${hammersmithOne.className} text-green-900 text-2xl text-center w-full`}
          >
            Adicionar Cartão
          </h1>
          <form
            action=""
            onSubmit={handleSubmit(handleSubumitForm)}
            className="h-full w-full flex flex-col justify-between items-center p-2"
          >
            <div className="w-full flex flex-col justify-center items-center gap-2">
              <div className="w-full flex flex-col justify-start gap-1 items-start bg-green-500 rounded-md p-2">
                <label
                  className={`${hammersmithOne.className} text-green-900 text-sm text-left w-full`}
                  htmlFor="brand"
                >
                  Bandeira{" "}
                  {errors.brand && (
                    <span className="text-red-600">{errors.brand.message}</span>
                  )}
                </label>
                <Input
                  id="brand"
                  type="text"
                  placeholder="MasterCard"
                  width="w-full"
                  {...register("brand")}
                />
              </div>
              <div className="w-full flex justify-between items-center gap-2">
                <div className="w-full flex flex-col justify-start items-start bg-green-500 rounded-md p-2 gap-1">
                  <label
                    className={`${hammersmithOne.className} text-green-900 text-sm text-left w-full`}
                    htmlFor="type"
                  >
                    Tipo de Cartão{" "}
                    {errors.type && (
                      <span className="text-red-600">
                        {errors.type.message}
                      </span>
                    )}
                  </label>
                  <Select
                    id="type"
                    width="w-full"
                    {...register("type", { valueAsNumber: true })}
                  >
                    <option value="0">Selecione</option>
                    <option value={1}>Credito</option>
                    <option value={2}>Debito</option>
                    <option value={3}>Credito e Debito</option>
                  </Select>
                </div>
                <div className="w-full flex flex-col justify-start items-start bg-green-500 rounded-md p-2">
                  <label
                    className={`${hammersmithOne.className} text-green-900 text-sm text-left w-full`}
                    htmlFor="bank"
                  >
                    Banco{" "}
                    {errors.bank && (
                      <span className="text-red-600">
                        {errors.bank.message}
                      </span>
                    )}
                  </label>
                  <Input
                    id="bank"
                    type="text"
                    placeholder="Inter"
                    width="w-full"
                    {...register("bank")}
                  />
                </div>
              </div>
              <div className="w-full flex justify-between items-center gap-2">
                <div className="w-full flex flex-col justify-start items-start bg-green-500 rounded-md p-2">
                  <label
                    className={`${hammersmithOne.className} text-green-900 text-sm text-left w-full`}
                    htmlFor="limit"
                  >
                    Limite{" "}
                    {errors.limit && (
                      <span className="text-red-600">
                        {errors.limit.message}
                      </span>
                    )}
                  </label>
                  <Input
                    id="limit"
                    type="number"
                    width="w-full"
                    min={0}
                    step={0.01}
                    {...register("limit", {
                      setValueAs: (v) => (v === "" ? undefined : Number(v)),
                    })}
                  />
                </div>
                <div className="w-full flex flex-col justify-start items-start bg-green-500 rounded-md p-2">
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
                    {...register("color")}
                    onChange={(e) => setColor(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="w-full h-full flex justify-center items-center ">
              <CardComponent
                id={1}
                bander="Bandeira"
                bank="Banco"
                type="Tipo de Cartão"
                color={color}
              />
            </div>
            <div className="w-full p-2 flex flex-row justify-center items-center gap-2.5">
              <PrimaryButton type="submit" width="w-full" content="Adicionar" />
              <SecundaryButton
                type="reset"
                width="w-full"
                content="Cancelar"
                onClick={close}
              />
            </div>
          </form>
          <div className="w-full flex  justify-center items-center ">
            <div className="w-[20px] h-[20px] bg-green-900 rounded-full "></div>
            <div className="w-full h-1 bg-green-600 rounded-full"></div>
            <div className="w-[20px] h-[20px] bg-green-900 rounded-full "></div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
