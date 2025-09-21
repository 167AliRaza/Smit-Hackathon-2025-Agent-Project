"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { chatAgent, chatAgentStream } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "agent";
  content: string;
}

export function ChatComponent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      if (isStreaming) {
        let agentResponseContent = "";
        setMessages((prev) => [...prev, { role: "agent", content: "" }]); // Add a placeholder for streaming
        await chatAgentStream(
          input,
          (delta) => {
            agentResponseContent += delta;
            setMessages((prev) => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1].content = agentResponseContent;
              return newMessages;
            });
          },
          () => {
            setIsLoading(false);
            scrollToBottom();
          },
          (error) => {
            toast.error("Failed to get streaming response.");
            setIsLoading(false);
            setMessages((prev) => prev.slice(0, prev.length - 1)); // Remove placeholder if error
          }
        );
      } else {
        const response = await chatAgent(input);
        const agentMessage: Message = { role: "agent", content: response.response };
        setMessages((prev) => [...prev, agentMessage]);
        toast.success("Response received!");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to get response from agent.");
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-10rem)] max-w-3xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-2xl font-bold">Chat with Campus Agent</CardTitle>
        <div className="flex items-center space-x-2">
          <Label htmlFor="streaming-mode">Streaming</Label>
          <Switch
            id="streaming-mode"
            checked={isStreaming}
            onCheckedChange={setIsStreaming}
            disabled={isLoading}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-10">
                Start a conversation with the Campus Admin Agent!
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                  message.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {message.content}
              </div>
            ))}
            {isLoading && isStreaming && messages[messages.length - 1]?.role === "agent" && (
              <div className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-muted">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
          <Input
            id="message"
            placeholder="Type your message..."
            className="flex-1"
            autoComplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}