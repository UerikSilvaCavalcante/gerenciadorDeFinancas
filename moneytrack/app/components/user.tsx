"use client";
import { AuthContext } from "../action/valid";
import { memo, useContext } from "react";
import { hammersmithOne } from "./mainLayout";

const User = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="w-full flex justify-center items-center">
      <div
        className={`flex flex-row justify-around p-2 text-sm text-zinc-50 ${hammersmithOne.className}`}
      >
        Olá {user?.name}
      </div>
      <div
        className={`flex flex-row justify-around p-2 text-sm text-zinc-50 ${hammersmithOne.className}`}
      >
        Total Gasto R$ {user?.valorGasto}
      </div>
    </div>
  );
};

export default memo(User);