"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

const formSchema = z.object({
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
});

const ContentPage = ({ params }: { params: { username: string } }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <div className="mt-10 w-full max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">Public Profile Link</h1>
      <div className="max-w-5xl border-l-8 pl-8 mx-8 my-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Send Anonymous Message to @
                    <span className="underline text-base">
                      {params.username}
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Textarea rows={6} placeholder="Type your message here." />
                  </FormControl>
                  <FormDescription>
                    You will only be able to send a message if the user is
                    accepting anonymous messages.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center">
              <Button type="submit" size={"lg"}>
                Send
                <Send className="w-4 h-4 ml-1"></Send>
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ContentPage;
