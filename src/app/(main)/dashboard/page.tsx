"use client";
import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/model/user";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ApiResponse } from "../../../../types/api-response";
import { User } from "next-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Copy,
  Link,
  Loader2,
  MessageCircleOff,
  RefreshCcw,
} from "lucide-react";
import MessageCard from "@/components/MessageCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter(message => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessages: false,
    },
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitching(true);
    try {
      const response = await axios.get("/api/accept-messages");
      // console.log(response);
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to fetch message settings",
        variant: "destructive",
      });
    } finally {
      setIsSwitching(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitching(true);
      try {
        const response = await axios.get("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: "Refreshed Messages",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message ||
            "Failed to fetch message settings",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsSwitching(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchAcceptMessage();
    fetchMessages();
  }, [session, fetchAcceptMessage, fetchMessages]);

  const handleSwitchChange = async () => {
    // console.log(acceptMessages);
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: response.data.message,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to fetch message settings",
        variant: "destructive",
      });
    }
  };

  if (!session || !session.user) {
    return (
      <div className="mt-10 w-full max-w-7xl mx-auto">
        <Card className="text-center h-96 flex flex-col items-center justify-center">
          <CardHeader>
            <CardTitle className="flex item-center justify-center">
              <Loader2 className="w-16 h-16 animate-spin"></Loader2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground italic">Fetching Messages...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/user/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL Copied",
      description: "Profile URL copied to clipboard",
    });
  };

  return (
    <div className="mt-10 w-full max-w-7xl mx-auto px-3">
      <h1 className="text-lg md:text-3xl font-bold mb-4">Dashboard</h1>
      <div className="w-full flex flex-col md:flex-row items-center justify-start gap-1 my-10">
        <Link></Link>
        <h2 className="text-lg font-semibold shrink-0">Unique Link:</h2>
        <Input type="text" value={profileUrl} disabled />
        <Button onClick={copyToClipboard}>
          <Copy className="w-4 h-4 mr-1"></Copy>
          Copy
        </Button>
      </div>

      <Separator className="my-5" />

      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="">
          <Switch
            {...register("acceptMessages")}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitching}
          />
          <span className="ml-2">
            Accept Messages: {acceptMessages ? "ON" : "OFF"}
          </span>
        </div>
        <Button
          title="Fetch latest messages"
          className="mt-4"
          variant="outline"
          onClick={e => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCcw className="w-4 h-4" />
          )}
        </Button>
      </div>

      <Separator className="my-5" />

      {isLoading ? (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
          {new Array(6).fill(null).map((_, index) => (
            <SkeletonLoading key={index}></SkeletonLoading>
          ))}
        </div>
      ) : messages.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
          {messages.map(message => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))}
        </div>
      ) : (
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="flex item-center justify-center">
              <MessageCircleOff className="w-16 h-16 text-muted-foreground"></MessageCircleOff>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground italic">
              No Messages to display
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardPage;

const SkeletonLoading = () => {
  return (
    <div className="mx-auto max-w-lg w-full border rounded-xl p-2 space-y-2">
      <Skeleton className="h-12 w-12" />

      <Skeleton className="h-[125px] w-full rounded-xl" />
      <div className="space-y-2 flex items-center justify-between gap-2">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-10 w-10" />
      </div>
    </div>
  );
};
