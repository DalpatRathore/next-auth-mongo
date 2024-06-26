"use client";
import { signOut, useSession } from "next-auth/react";
import { User } from "next-auth";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, LogIn, LogOut, UserRound } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <header className="w-full max-w-7xl mx-auto border-b px-2 py-4 flex items-center justify-between">
      <div className="logo">
        <Link href={"/"} className="flex items-center">
          <Image
            src={"/logo.svg"}
            width={75}
            height={75}
            alt="logo"
            style={{ width: "auto", height: "auto" }}
          ></Image>
        </Link>
      </div>
      <nav className="flex items-start md:items-center gap-3">
        {session ? (
          <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-3">
            <p className="text-right">
              Welcome, @
              <span className="font-bold underline">
                {user?.username || user?.email}
              </span>
            </p>
            <div className="flex items-center gap-1">
              <Button onClick={() => signOut()} variant={"outline"}>
                <LogOut className="w-4 h-4 mr-2"></LogOut>
                Logout
              </Button>
              <Link href={"/dashboard"}>
                <Button title="Dashboard">
                  <LayoutDashboard className="w-4 h-4"></LayoutDashboard>
                </Button>
              </Link>
              <Link href={`/user/${user?.username}`}>
                <Button title="Public Profile Link">
                  <UserRound className="w-4 h-4"></UserRound>
                </Button>
              </Link>
            </div>
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
        <ThemeToggle></ThemeToggle>
      </nav>
    </header>
  );
};

export default Header;
