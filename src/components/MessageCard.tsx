"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { CalendarDays, MessagesSquare, Trash2 } from "lucide-react";
import { useToast } from "./ui/use-toast";
import axios from "axios";
import { ApiResponse } from "../../types/api-response";
import { Message } from "@/model/user";
import { formatDateTime } from "@/helpers/format";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const { toast } = useToast();

  const handleDeleteConfirm = async () => {
    const response = await axios.delete<ApiResponse>(
      `/api/delete-message/${message._id}`
    );
    toast({
      title: "Message deleted",
      description: response.data.message,
    });
    onMessageDelete(message._id);
  };

  return (
    <Card className="mx-auto max-w-lg w-full relative">
      <CardHeader>
        <CardTitle>
          <MessagesSquare className="w-10 h-10"></MessagesSquare>
        </CardTitle>
        <AlertDialog>
          <AlertDialogTrigger asChild className="absolute bottom-2 right-2">
            <Button variant={"destructive"} size={"icon"}>
              <Trash2 className="w-5 h-5"></Trash2>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent>{message.content}</CardContent>
      <CardFooter>
        <p className="flex items-center justify-center text-muted-foreground text-sm">
          <CalendarDays className="w-5 h-5 mr-2"></CalendarDays>
          {formatDateTime(message.createdAt)}
        </p>
      </CardFooter>
    </Card>
  );
};

export default MessageCard;
