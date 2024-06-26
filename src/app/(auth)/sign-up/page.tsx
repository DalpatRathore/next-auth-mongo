"use client";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/schemas/signUpSchema";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "../../../../types/api-response";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const SignUpPage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewPassword, setViewPassword] = useState(false);

  const debounced = useDebounceCallback(setUsername, 300);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUniqueUsername = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-unique-user?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUniqueUsername();
  }, [username]);

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    // console.log(values);
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", values);
      toast({
        title: "Success",
        description: response.data.message,
      });
      router.push(`/verify/${username}`);
    } catch (error) {
      console.log("Error in signing up of user");
      const axiosError = error as AxiosError<ApiResponse>;

      toast({
        title: "Sign failed",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-[90%] px-5">
      <Card className="mx-auto max-w-lg w-full">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription className="italic">
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Please enter your username"
                        {...field}
                        onChange={e => {
                          field.onChange(e);
                          debounced(e.target.value);
                        }}
                        // onChange={e => debounced(e.target.value)}
                      />
                    </FormControl>
                    {isCheckingUsername ? (
                      <Loader2 className="animate-spin"></Loader2>
                    ) : (
                      <p
                        className={cn(
                          `text-sm`,
                          usernameMessage === "username is available"
                            ? "text-green-500"
                            : "text-destructive"
                        )}
                      >
                        {username} {usernameMessage}
                      </p>
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Please enter your email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="flex items-center gap-1">
                      <FormControl>
                        <Input
                          type={`${viewPassword ? "text" : "password"}`}
                          placeholder="Please provide password"
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        size={"icon"}
                        variant={"outline"}
                        onClick={() => setViewPassword(prev => !prev)}
                      >
                        {viewPassword ? (
                          <Eye className="w-5 h-5"></Eye>
                        ) : (
                          <EyeOff className="w-5 h-5"></EyeOff>
                        )}
                      </Button>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Create an account"
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/sign-in" className="underline text-blue-600 font-bold">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;
