"use client";
import { jwtDecode } from "jwt-decode";
// import { cookies } from "next/headers";
import { ReactNode, useEffect, useState } from "react";
import { createContext } from "react";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import { ResponseUserType } from "@/types/userType";
import { getUserById } from "../http/getUserbyId";

type AuthContextProps = {
  isAuthenticaded: boolean;
  user: ResponseUserType | null;
  Login: (data: string) => Promise<boolean>;
  Logout: () => void;
};

export const AuthContext = createContext({} as AuthContextProps);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ResponseUserType | null>(null);
  const isAuthenticaded = !!user;
  useEffect(() => {
    const { token } = parseCookies();
    if (token) {
      try {
        const decode = jwtDecode<{
          id: string;
          exp: number;
        }>(token);
        getUserById(parseInt(decode.id), token).then((user) => {
          setUser({
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            valorGasto: user.valorGasto,
          });
        });
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
      }
    } else {
      console.log("Token não encontrado nos cookies");
    }
  }, []);

  async function Login(token: string) {
    const TOKEN_KEY = token;

    setCookie(undefined, "token", TOKEN_KEY, {
      maxAge: 60 * 60 * 1,
    });

    const decode = jwtDecode<{
      id: string;
      exp: number;
    }>(TOKEN_KEY);

    const user = await getUserById(parseInt(decode.id), TOKEN_KEY);
    setUser({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      valorGasto: user.valorGasto,
    });
    return true;
  }

  function Logout() {
    destroyCookie(undefined, "token");
  }

  return (
    <AuthContext.Provider value={{ isAuthenticaded, user, Login, Logout }}>
      {children}
    </AuthContext.Provider>
  );
}
