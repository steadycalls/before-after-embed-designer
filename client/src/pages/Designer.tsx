import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, Upload, Palette, Type, Download } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function Designer() {
  const [, setLocation] = useLocation();
  const [embedName, setEmbedName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [beforeImage, setBeforeImage] = useState<{ file: File; preview: string } | null>(null);
  const [afterImage, setAfterImage] = useState<{ file: File; preview: string } | null>(null);
  const [colors, setColors] = useState<string[]>([]);
  const [fonts, setFonts] = useState<string[]>([]);
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(400);
  const [isScrapingWebsite, setIsScrapingWebsite] = useState(false);

  const scrapeMutation = trpc.scraper.scrapeWebsite.useMutation();
  const createMutation = trpc.embeds.create.useMutation();

  const onDropBefore = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setBeforeImage({
        file,
        preview: URL.createObjectURL(file),
      });
    }
  }, []);

  const onDropAfter = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setAfterImage({
        file,
        preview: URL.createObjectURL(file),
      });
    }
  }, []);

  const { getRootProps: getBeforeRootProps, getInputProps: getBeforeInputProps, isDragActive: isBeforeDragActive } = useDropzone({
    onDrop: onDropBefore,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
    multiple: false,
  });

  const { getRootProps: getAfterRootProps, getInputProps: getAfterInputProps, isDragActive: isAfterDragActive } = useDropzone({
    onDrop: onDropAfter,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
    multiple: false,
  });

  const handleScrapeWebsite = async () => {
    if (!websiteUrl) {
      toast.error("Please enter a website URL");
      return;
    }

    setIsScrapingWebsite(true);
    try {
      const result = await scrapeMutation.mutateAsync({ url: websiteUrl });
      setColors(result.colors);
      setFonts(result.fonts);
      toast.success("Website styles extracted successfully!");
    } catch (error) {
      toast.error("Failed to extract website styles");
    } finally {
      setIsScrapingWebsite(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
    });
  };

  const handleCreateEmbed = async () => {
    if (!embedName || !beforeImage || !afterImage || colors.length === 0 || fonts.length === 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const beforeBase64 = await fileToBase64(beforeImage.file);
      const afterBase64 = await fileToBase64(afterImage.file);

      await createMutation.mutateAsync({
        name: embedName,
        beforeImage: {
          data: beforeBase64,
          mimeType: beforeImage.file.type,
        },
        afterImage: {
          data: afterBase64,
          mimeType: afterImage.file.type,
        },
        websiteUrl,
        colors,
        fonts,
        width,
        height,
      });

      toast.success("Embed created successfully!");
      setLocation("/dashboard");
    } catch (error) {
      toast.error("Failed to create embed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="container max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Your Embed</h1>
          <p className="text-gray-600">Design an interactive before/after comparison for your case study</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Column - Configuration */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Give your embed a name and configure its appearance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="embedName">Embed Name</Label>
                  <Input
                    id="embedName"
                    placeholder="My awesome case study"
                    value={embedName}
                    onChange={(e) => setEmbedName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="width">Width (px)</Label>
                    <Input
                      id="width"
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Height (px)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Website Styling
                </CardTitle>
                <CardDescription>Extract colors and fonts from your website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="websiteUrl">Website URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="websiteUrl"
                      placeholder="https://example.com"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                    />
                    <Button onClick={handleScrapeWebsite} disabled={isScrapingWebsite}>
                      {isScrapingWebsite ? <Loader2 className="h-4 w-4 animate-spin" /> : "Extract"}
                    </Button>
                  </div>
                </div>

                {colors.length > 0 && (
                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <Palette className="h-4 w-4" />
                      Extracted Colors
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {colors.map((color, idx) => (
                        <div
                          key={idx}
                          className="w-12 h-12 rounded border-2 border-gray-300"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {fonts.length > 0 && (
                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <Type className="h-4 w-4" />
                      Extracted Fonts
                    </Label>
                    <div className="space-y-1">
                      {fonts.map((font, idx) => (
                        <div key={idx} className="text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded">
                          {font}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Image Upload */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Before Image</CardTitle>
                <CardDescription>Upload the "before" state image</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  {...getBeforeRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isBeforeDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input {...getBeforeInputProps()} />
                  {beforeImage ? (
                    <img src={beforeImage.preview} alt="Before" className="max-w-full h-auto rounded" />
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-12 w-12 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-600">Drag & drop or click to upload</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>After Image</CardTitle>
                <CardDescription>Upload the "after" state image</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  {...getAfterRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isAfterDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input {...getAfterInputProps()} />
                  {afterImage ? (
                    <img src={afterImage.preview} alt="After" className="max-w-full h-auto rounded" />
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-12 w-12 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-600">Drag & drop or click to upload</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button
            size="lg"
            onClick={handleCreateEmbed}
            disabled={createMutation.isPending}
            className="px-8"
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Create Embed
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

