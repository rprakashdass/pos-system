"use client";

import { useEffect, useState } from "react";
import { Package, Plus } from "lucide-react";
import { Product, ProductFormData } from "@/types/productTypes";
import productService from "@/services/productService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import ProductDialog from "@/components/products/ProductDialog";
import { useToast } from "@/components/ui/toaster";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await productService.getAll();
            setProducts(data);
        } catch (error) {
            const msg = getApiErrorMessage(error);
            toast({ variant: "destructive", title: "Failed to load products", description: msg.description ?? msg.title });
        } finally {
            setLoading(false);
        }
    };

    const openCreate = () => {
        setDialogMode("create");
        setSelectedProduct(undefined);
        setDialogOpen(true);
    };

    const openEdit = (product: Product) => {
        setDialogMode("edit");
        setSelectedProduct(product);
        setDialogOpen(true);
    };

    const handleSubmit = async (data: ProductFormData) => {
        if (dialogMode === "create") {
            await productService.create(data);
            toast({ title: "Product created" });
        } else if (selectedProduct) {
            await productService.update(selectedProduct.id, data);
            toast({ title: "Product updated" });
        }
        await fetchProducts();
    };

    const handleDelete = async (product: Product) => {
        const ok = window.confirm(`Delete product "${product.name}" (ID: ${product.id})?`);
        if (!ok) return;
        try {
            await productService.delete(product.id);
            toast({ title: "Product deleted" });
            await fetchProducts();
        } catch (error) {
            const msg = getApiErrorMessage(error);
            toast({ variant: "destructive", title: msg.title, description: msg.description });
        }
    };

    return (
        <PageContainer>
            <PageHeader
                title="Products"
                description="Manage your product catalog"
                icon={Package}
            >
                <Button className="flex items-center gap-1" onClick={openCreate}>
                    <Plus size={18} />
                    Add Product
                </Button>
            </PageHeader>

            <ProductDialog
                show={dialogOpen}
                mode={dialogMode}
                initialProduct={selectedProduct}
                onClose={() => setDialogOpen(false)}
                onSubmit={handleSubmit}
            />

            <Card>
                <CardHeader>
                    <CardTitle>Products</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Barcode</TableHead>
                                <TableHead>Client ID</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10">
                                        Loading products...
                                    </TableCell>
                                </TableRow>
                            ) : products.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10">
                                        No products found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                products.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell>{product.barcode}</TableCell>
                                        <TableCell>{product.clientId}</TableCell>
                                        <TableCell>{product.price}</TableCell>
                                        <TableCell>{product.description ?? ""}</TableCell>
                                        <TableCell className="space-x-2">
                                            <Button variant="ghost" size="sm" onClick={() => openEdit(product)}>
                                                Edit
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500"
                                                onClick={() => handleDelete(product)}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </PageContainer>
    );
}
