'use client';

import { useEffect, useState } from "react";
import { Invoice } from "@/types/invoiceTypes";
import invoiceService from "@/services/invoiceService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PageContainer from "@/components/layout/PageContainer";

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);

    useEffect(() => {
        invoiceService.getAll().then(setInvoices);
    }, []);

    return (
        <PageContainer>
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
                                <TableHead>Invoice Date</TableHead>
                                <TableHead>Total Amount</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices.map((invoice) => (
                                <TableRow key={invoice.id}>
                                    <TableCell>{invoice.id}</TableCell>
                                    <TableCell>{invoice.order.id}</TableCell>
                                    <TableCell>{new Date(invoice.invoiceDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{invoice.totalAmount}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm">View</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </PageContainer>
    );
}
