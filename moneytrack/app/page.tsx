"use client";
import Login from "./login/page";
import { getlogin } from "./http/login";

export default function Home() {
  getlogin({username: "admin", password: "admin"}).then((res) => {
    return res;
  });
  return <Login />;
}
