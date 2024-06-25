import React from "react";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full max-w-7xl mx-auto py-10">
      <div className="flex flex-col items-center gap-4 rounded-lg bg-[#002D62] p-6 shadow-lg sm:flex-row sm:justify-between">
        <strong className="text-xl text-white sm:text-xl">
          Make Your Next Move With the <Button> NEXT.js</Button>
        </strong>

        <a href="https://www.linkedin.com/in/dalpatrathore">
          <Button variant={"secondary"} size={"lg"}>
            Get Started
            <ArrowRight className="w-4 h-4 ml-1"></ArrowRight>
          </Button>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
