import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { Loader2, Plus, Copy, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [selectedEmbedId, setSelectedEmbedId] = useState<number | null>(null);
  const [showCodeDialog, setShowCodeDialog] = useState(false);

  const { data: embeds, isLoading, refetch } = trpc.embeds.list.useQuery(undefined, {
    enabled: !!user,
  });

  const { data: embedCode } = trpc.embeds.getEmbedCode.useQuery(
    { id: selectedEmbedId! },
    { enabled: !!selectedEmbedId && showCodeDialog }
  );

  const deleteMutation = trpc.embeds.delete.useMutation({
    onSuccess: () => {
      toast.success("Embed deleted successfully");
      refetch();
    },
    onError: () => {
      toast.error("Failed to delete embed");
    },
  });

  const handleCopyCode = () => {
    if (embedCode?.code) {
      navigator.clipboard.writeText(embedCode.code);
      toast.success("Embed code copied to clipboard!");
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this embed?")) {
      deleteMutation.mutate({ id });
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="container max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Embeds</h1>
            <p className="text-gray-600">Manage your before/after embeds</p>
          </div>
          <Link href="/designer">
            <Button size="lg">
              <Plus className="mr-2 h-4 w-4" />
              Create New Embed
            </Button>
          </Link>
        </div>

        {embeds && embeds.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-600 mb-4">You haven't created any embeds yet</p>
              <Link href="/designer">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Embed
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {embeds?.map((embed) => (
              <Card key={embed.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={embed.beforeImageUrl}
                    alt={embed.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    BEFORE
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="truncate">{embed.name}</CardTitle>
                  <CardDescription>
                    {embed.width}x{embed.height}px
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setSelectedEmbedId(embed.id);
                        setShowCodeDialog(true);
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Get Code
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(embed.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Embed Code</DialogTitle>
            <DialogDescription>
              Copy this code and paste it into your website where you want the embed to appear
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{embedCode?.code || "Loading..."}</code>
              </pre>
              <Button
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleCopyCode}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

