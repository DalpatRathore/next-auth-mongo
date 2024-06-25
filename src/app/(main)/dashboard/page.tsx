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
  Loader2,
  MessageCircle,
  MessageCircleHeart,
  MessageCircleOff,
  RefreshCcw,
} from "lucide-react";
import MessageCard from "@/components/MessageCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
      setValue("acceptMessages", response.data.isAcceptingMessage);
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
    // fetchMessages();
  }, [session, fetchAcceptMessage, fetchMessages]);

  const handleSwitchChange = async () => {
    console.log(acceptMessages);
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
            <p className="text-muted-foreground italic">Messages fetching...</p>
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
    <div className="mt-10 w-full max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">Dashboard</h1>

      <div className="">
        <h2 className="text-lg font-semibold">Unique Link</h2>
        <div className="flex items-center gap-2">
          <Input type="text" value={profileUrl} disabled />
          <Button onClick={copyToClipboard}>
            <Copy className="w-4 h-4 mr-1"></Copy>
            Copy
          </Button>
        </div>
      </div>

      <Separator className="my-5" />

      <div className="flex items-center justify-between">
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

      {messages.length > 0 ? (
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
