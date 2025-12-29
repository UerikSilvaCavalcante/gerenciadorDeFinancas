"use client";
import { AuthContext } from "../action/valid";
import { useContext } from "react";
import { hammersmithOne } from "./mainLayout";

const User = () => {
  const { user } = useContext(AuthContext);

  if (user) {
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
  }
  return (
    <div className="w-[200px] h-7 bg-green-900 animate-pulse rounded-md"></div>
  );
};

export default User;
