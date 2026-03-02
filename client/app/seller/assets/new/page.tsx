'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Upload,
    Image as ImageIcon,
    FileBox,
    CheckCircle2,
    Loader2,
    AlertCircle,
    HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';
import axios from 'axios';
import { toast } from 'sonner';

export default function NewAssetPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        categoryId: '',
    });

    const [files, setFiles] = useState<{
        asset: File | null;
        preview: File | null;
    }>({ asset: null, preview: null });

    useEffect(() => {
        api.get('/categories').then((res) => setCategories(res.data));
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'asset' | 'preview') => {
        if (e.target.files?.[0]) {
            setFiles({ ...files, [type]: e.target.files[0] });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!files.asset || !files.preview || !formData.categoryId) {
            alert('Please fill all fields and select both files.');
            return;
        }

        setIsSubmitting(true);
        setUploadProgress(10);

        try {
            // 1. Get presigned URLs
            const { data: uploadInfo } = await api.post('/assets/upload-url');
            setUploadProgress(30);

            // 2. Upload asset file to private bucket
            await axios.put(uploadInfo.fileUploadUrl, files.asset, {
                headers: { 'Content-Type': files.asset.type },
            });
            setUploadProgress(60);

            // 3. Upload preview file to public bucket
            await axios.put(uploadInfo.previewUploadUrl, files.preview, {
                headers: { 'Content-Type': files.preview.type },
            });
            setUploadProgress(80);

            // 4. Create asset record in DB
            await api.post('/assets', {
                title: formData.title,
                description: formData.description,
                price: Number(formData.price),
                categoryId: formData.categoryId,
                fileKey: uploadInfo.fileKey,
                previewUrl: uploadInfo.previewPublicUrl,
            });

            setUploadProgress(100);
            alert('Asset uploaded successfully! It is now pending moderation.');
            router.push('/seller/assets');
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Button
                variant="ghost"
                className="pl-0 hover:bg-transparent text-muted-foreground font-bold"
                onClick={() => router.back()}
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
            </Button>

            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black tracking-tight">Create New <span className="text-primary italic">Asset</span></h1>
                <p className="text-muted-foreground">List your digital masterpiece on the ProSets marketplace.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Main Info */}
                    <div className="md:col-span-2 space-y-6">
                        <Card className="border-none bg-background shadow-md rounded-3xl p-6">
                            <CardContent className="p-0 space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="font-bold">Asset Title</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        placeholder="e.g. Low Poly Knight Character"
                                        className="h-12 rounded-xl"
                                        required
                                        value={formData.title}
                                        onChange={handleInputChange}
                                    />
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider px-1">Use a descriptive title for better SEO</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description" className="font-bold">Description</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Describe your asset, its features, and how to use it..."
                                        className="min-h-[150px] rounded-xl resize-none"
                                        required
                                        value={formData.description}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Card className="border-none bg-background shadow-md rounded-3xl p-6">
                                <div className="space-y-2">
                                    <Label htmlFor="categoryId" className="font-bold">Category</Label>
                                    <Select onValueChange={(val) => setFormData({ ...formData, categoryId: val })}>
                                        <SelectTrigger className="h-12 rounded-xl">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id} className="rounded-lg">
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </Card>

                            <Card className="border-none bg-background shadow-md rounded-3xl p-6">
                                <div className="space-y-2">
                                    <Label htmlFor="price" className="font-bold">Price (USD)</Label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-primary">$</span>
                                        <Input
                                            id="price"
                                            name="price"
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            className="h-12 pl-8 rounded-xl font-black text-lg"
                                            required
                                            value={formData.price}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Uploads */}
                    <div className="space-y-6">
                        {/* Asset File */}
                        <Card className="border-none bg-background shadow-md rounded-3xl p-6">
                            <Label className="font-bold block mb-4">The Asset File</Label>
                            <div className={`relative border-2 border-dashed rounded-2xl p-6 transition-all text-center ${files.asset ? 'border-primary/50 bg-primary/5' : 'border-muted hover:border-primary/30'}`}>
                                <input
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={(e) => handleFileChange(e, 'asset')}
                                />
                                {files.asset ? (
                                    <div className="flex flex-col items-center">
                                        <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-2">
                                            <CheckCircle2 className="h-6 w-6" />
                                        </div>
                                        <p className="text-xs font-bold truncate max-w-full">{files.asset.name}</p>
                                        <Button variant="link" size="sm" className="h-auto p-0 mt-1 text-[10px] text-muted-foreground uppercase font-black">Change File</Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center py-4">
                                        <FileBox className="h-10 w-10 text-muted-foreground mb-2" />
                                        <p className="text-xs font-bold uppercase tracking-wider">Upload ZIP/Code</p>
                                        <p className="text-[10px] text-muted-foreground mt-1 px-4 leading-tight">Main asset file buyers will receive</p>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Preview Image */}
                        <Card className="border-none bg-background shadow-md rounded-3xl p-6">
                            <Label className="font-bold block mb-4">Preview Media</Label>
                            <div className={`relative border-2 border-dashed rounded-2xl p-6 transition-all text-center ${files.preview ? 'border-primary/50 bg-primary/5' : 'border-muted hover:border-primary/30'}`}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={(e) => handleFileChange(e, 'preview')}
                                />
                                {files.preview ? (
                                    <div className="flex flex-col items-center">
                                        <div className="relative h-20 w-32 rounded-lg overflow-hidden mb-2 border">
                                            <img src={URL.createObjectURL(files.preview)} alt="Preview" className="object-cover w-full h-full" />
                                        </div>
                                        <p className="text-xs font-bold truncate max-w-full">{files.preview.name}</p>
                                        <Button variant="link" size="sm" className="h-auto p-0 mt-1 text-[10px] text-muted-foreground uppercase font-black">Change Image</Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center py-4">
                                        <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                                        <p className="text-xs font-bold uppercase tracking-wider">Upload Image</p>
                                        <p className="text-[10px] text-muted-foreground mt-1 px-4 leading-tight">High-quality thumbnail for your asset</p>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Tips */}
                        <div className="p-4 rounded-2xl bg-muted/50 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2 mb-2 font-bold uppercase tracking-wider text-foreground">
                                <HelpCircle className="h-4 w-4 text-primary" /> Tips
                            </div>
                            <ul className="space-y-1 list-disc pl-4">
                                <li>Use a square (1:1) or 4:3 image aspect ratio.</li>
                                <li>Maximum file size for asset is 100MB.</li>
                                <li>Assets are released after admin review.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <div className="flex flex-col items-center gap-4">
                    <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="w-full md:w-auto min-w-[300px] h-14 rounded-2xl text-lg font-black shadow-2xl shadow-primary/30"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-3">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Uploading... {uploadProgress}%
                            </div>
                        ) : (
                            "Submit for Moderation"
                        )}
                    </Button>
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest flex items-center gap-1.5 leading-none">
                        <ShieldCheck className="h-3 w-3" /> Secure blockchain-verified marketplace
                    </p>
                </div>
            </form>
        </div>
    );
}

function ShieldCheck(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}
