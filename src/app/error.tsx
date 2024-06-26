"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mt-10 w-full max-w-7xl mx-auto">
      <Card className="text-center h-96 flex flex-col items-center justify-center">
        <CardHeader>
          <CardTitle className="flex item-center justify-center">
            <h2 className="w-full  scroll-m-20 text-lg sm:text-2xl md:text-3xl font-semibold tracking-tight text-center pl-5 text-rose-600">
              Oops! Something went wrong.
            </h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <p className="leading-6 sm:leading-7 text-sm sm:text-base">
            We apologize for the inconvenience.
          </p>

          <Button
            onClick={() => location.reload()}
            size={"lg"}
            variant={"destructive"}
          >
            Refresh
            <RefreshCcw className="w-5 h-5 ml-2"></RefreshCcw>
          </Button>

          <p className="leading-6 sm:leading-7 text-sm sm:text-base">
            If the issue persists. Kindly get in touch with the web admin for
            further assistance.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
