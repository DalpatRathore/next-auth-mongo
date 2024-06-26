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
import { Loader2, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { ApiResponse } from "../../../../../types/api-response";

const formSchema = z.object({
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
});

const UsernamePage = ({ params }: { params: { username: string } }) => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const data = {
      username: params.username,
      content: values.content,
    };
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", data);

      if (response.data.success) {
        toast({
          title: "Message sent successfully",
        });
        form.reset();
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed send to message",
        description: "User not accepting messages. Please try after some time",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-10 w-full max-w-7xl mx-auto">
      <h1 className="text-lg md:text-3xl font-bold mb-4">
        Public Profile Link
      </h1>
      <div className="max-w-5xl border-l-4 pl-4 md:border-l-8 md:pl-8 mx-4 md:mx-8 my-10">
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
                    <Textarea
                      rows={6}
                      placeholder="Type your message here."
                      {...field}
                    />
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
              <Button type="submit" size={"lg"} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2"></Loader2>
                    Sending...
                  </>
                ) : (
                  <>
                    Send
                    <Send className="w-4 h-4 ml-1"></Send>
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UsernamePage;
