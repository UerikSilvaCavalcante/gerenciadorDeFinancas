import React from "react";
import Image from "next/image";
import Link from "next/link";
import house from "../assets/navBar/house.svg";
import list from "../assets/navBar/list.svg";
import plus from "../assets/navBar/plus.svg";

export const NavBar = ({
  route,
  open,
  isOpen,
}: {
  route: string;
  open: () => void;
  isOpen: boolean;
}) => {
  return (
    <div className="absolute bottom-3  z-20">
      <div className="flex justify-center items-center relative transition-all duration-[450ms] ease-in-out w-auto ">
        <article className="border border-solid border-green-950 w-full ease-in-out duration-500 left-0 rounded-2xl flex shadow-lg shadow-black/15 bg-green-500">
          <Link href="/home">
            <label
              className="has-[:checked]:shadow-lg relative w-full h-16 p-4 ease-in-out duration-300 border-solid border-black/10 has-[:checked]:border group flex flex-row gap-3 items-center justify-center text-black rounded-xl"
              htmlFor="home"
            >
              <input
                id="home"
                name="path"
                type="radio"
                className="hidden peer/expand"
                {...(route === "Home" && { defaultChecked: true })}
              />
              <Image
                src={house}
                alt="plus"
                className="peer-hover/expand:scale-125 peer-hover/expand:text-green-50 peer-hover/expand:fill-green-50 peer-checked/expand:text-green-50 peer-checked/expand:fill-green-50 text-2xl peer-checked/expand:scale-125 ease-in-out duration-300"
                width={24}
                height={24}
              />
            </label>
          </Link>

          <Link href="#" onClick={open}>
            <label
              className="has-[:checked]:shadow-lg relative w-full h-16 p-4 ease-in-out duration-300 border-solid border-black/10 has-[:checked]:border group flex flex-row gap-3 items-center justify-center text-black rounded-xl"
              htmlFor="add"
            >
              <input
                id="add"
                name="path"
                type="radio"
                className="hidden peer/expand"
                defaultChecked={isOpen}
              />
              <Image
                src={plus}
                alt="plus"
                className="peer-hover/expand:scale-125 peer-hover/expand:text-green-50 peer-hover/expand:fill-green-50 peer-checked/expand:text-green-50 peer-checked/expand:fill-green-50 text-2xl peer-checked/expand:scale-125 ease-in-out duration-300"
                width={24}
                height={24}
              />
              {/* <svg viewBox="0 0 24 24" height={24} width={24} xmlns={plus} className="peer-hover/expand:scale-125 peer-hover/expand:text-green-50 peer-hover/expand:fill-green-50 peer-checked/expand:text-green-50 peer-checked/expand:fill-green-50 text-2xl peer-checked/expand:scale-125 ease-in-out duration-300">
            <path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z" />
          </svg> */}
            </label>
          </Link>

          <Link href="/transfers">
            <label
              className="has-[:checked]:shadow-lg relative w-full h-16 p-4 ease-in-out duration-300 border-solid border-black/10 has-[:checked]:border group flex flex-row gap-3 items-center justify-center text-black rounded-xl"
              htmlFor="transfers"
            >
              <input
                id="transfers"
                name="path"
                type="radio"
                className="hidden peer/expand"
                defaultChecked={route === "Transfers"}
              />
              <Image
                src={list}
                alt="plus"
                className="peer-hover/expand:scale-125 peer-hover/expand:text-green-50 peer-hover/expand:fill-green-50 peer-checked/expand:text-green-50 peer-checked/expand:fill-green-50 text-2xl peer-checked/expand:scale-125 ease-in-out duration-300"
                width={24}
                height={24}
              />
            </label>
          </Link>
        </article>
      </div>
    </div>
  );
};
