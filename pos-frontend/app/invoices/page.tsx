"use client";

import { useEffect, useState } from "react";
import { FileText, Plus } from "lucide-react";
import { Invoice, InvoiceFormData } from "@/types/invoiceTypes";
import invoiceService from "@/services/invoiceService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import AddInvoiceDialog from "@/components/invoices/AddInvoiceDialog";
import { useToast } from "@/components/ui/toaster";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const data = await invoiceService.getAll();
            setInvoices(data);
        } catch (error) {
            const msg = getApiErrorMessage(error);
            toast({ variant: "destructive", title: "Failed to load invoices", description: msg.description ?? msg.title });
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (data: InvoiceFormData) => {
        await invoiceService.create(data);
        await fetchInvoices();
    };

    return (
        <PageContainer>
            <PageHeader
                title="Invoices"
                description="Generate invoices for orders"
                icon={FileText}
            >
                <Button className="flex items-center gap-1" onClick={() => setDialogOpen(true)}>
                    <Plus size={18} />
                    Create Invoice
                </Button>
            </PageHeader>

            <AddInvoiceDialog
                show={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onSubmit={handleCreate}
            />

            <Card>
                <CardHeader>
                    <CardTitle>Invoices</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice ID</TableHead>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Created At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-10">
                                        Loading invoices...
                                    </TableCell>
                                </TableRow>
                            ) : invoices.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-10">
                                        No invoices found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                invoices.map((invoice) => (
                                    <TableRow key={invoice.id}>
                                        <TableCell className="font-medium">{invoice.id}</TableCell>
                                        <TableCell>{invoice.orderId}</TableCell>
                                        <TableCell>{new Date(invoice.createdAt).toLocaleString()}</TableCell>
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
