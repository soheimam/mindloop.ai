import { Homepage } from "@/components/Homepage";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/navigation";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f0e6f5] p-4 md:p-8 flex flex-col items-center justify-center">
      <Navigation />
      <Card className="w-full max-w-md bg-white rounded-3xl shadow-lg overflow-hidden">
        <CardContent className="p-6">
          {/* Header Section */}
          <Homepage />
        </CardContent>
      </Card>

      {/* Footer */}

    </main>
  );
}
