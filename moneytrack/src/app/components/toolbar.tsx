import person from "../assets/person.svg";
import gear from "../assets/gear.svg";
import Image from "next/image";
import logout from "../assets/box-arrow-right.svg";
import { Hammersmith_One } from "next/font/google";
import Link from "next/link";
import { lazy, Suspense, useContext } from "react";
import { AuthContext } from "../action/valid";
import { useRouter } from "next/navigation";
const hammersmithOne = Hammersmith_One({
  weight: "400",
  subsets: ["latin"],
});
const User = lazy(() => import("./user"));

export const ToollBar = () => {
  const { Logout } = useContext(AuthContext);
  const router = useRouter();
  const handleLogout = () => {
    Logout();
    router.push("/");
  };

  return (
    <div className="bg-green-500 flex flex-row justify-center items-center    px-2 py-1.5 gap-2 rounded-full  fixed top-2 left-2 z-50">
      <div className=" flex flex-row justify-center items-center p-0 m-0">
        <Image src={person} width={30} height={30} alt="person" />
      </div>
      <Suspense
        fallback={
          <div className="w-[200px] h-7 bg-green-900 animate-pulse rounded-md"></div>
        }
      >
        <User />
      </Suspense>
      <Link href="/config">
        <Image src={gear} width={25} height={25} alt="config" />
      </Link>
      <Image
        src={logout}
        width={20}
        height={20}
        style={{ cursor: "pointer", color: "white" }}
        alt="logout"
        onClick={handleLogout}
      />
    </div>
  );
};
