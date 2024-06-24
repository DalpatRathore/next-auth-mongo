"use client";
import { signOut, useSession } from "next-auth/react";
import { User } from "next-auth";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { LogIn, LogOut } from "lucide-react";

const Header = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <header className="w-full max-w-7xl mx-auto border-b px-2 py-4 flex items-center justify-between">
      <div className="logo">
        <Link href={"/"}>
          <Image src={"/logo.svg"} width={125} height={125} alt="logo"></Image>
        </Link>
      </div>
      <nav>
        {session ? (
          <div className="flex items-center justify-center gap-2">
            <p className="">
              Welcome,{" "}
              <span className="font-bold italic">
                {user?.username || user?.email}
              </span>{" "}
              !
            </p>
            <Button onClick={() => signOut()} variant={"outline"}>
              <LogOut className="w-4 h-4 mr-2"></LogOut>
              Logout
            </Button>
          </div>
        ) : (
          <>
            <Link href={"/sign-in"}>
              <Button>
                <LogIn className="w-4 h-4 mr-2"></LogIn>
                Login
              </Button>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
