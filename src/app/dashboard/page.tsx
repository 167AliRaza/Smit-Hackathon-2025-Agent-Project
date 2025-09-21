import { MadeWithDyad } from "@/components/made-with-dyad";

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight lg:text-5xl mb-6">
        Analytics Dashboard
      </h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
        This is where your student analytics will be displayed.
      </p>
      <div className="absolute bottom-4">
        <MadeWithDyad />
      </div>
    </div>
  );
}