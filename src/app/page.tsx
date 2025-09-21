import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MadeWithDyad } from "@/components/made-with-dyad";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight lg:text-5xl mb-6">
        Welcome to Campus Admin Agent
      </h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
        Interact with the AI agent to get campus information or view student analytics.
      </p>
      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link href="/chat">Start Chatting</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/dashboard">View Dashboard</Link>
        </Button>
      </div>
      <div className="absolute bottom-4">
        <MadeWithDyad />
      </div>
    </div>
  );
}