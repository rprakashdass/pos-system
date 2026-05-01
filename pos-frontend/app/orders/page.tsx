"use client";

import { useEffect, useState } from "react";
import { ClipboardList, Plus } from "lucide-react";
import { Order, OrderFormData } from "@/types/orderTypes";
import orderService from "@/services/orderService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import AddOrderDialog from "@/components/orders/AddOrderDialog";
import { useToast } from "@/components/ui/toaster";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await orderService.getAll();
            setOrders(data);
        } catch (error) {
            const msg = getApiErrorMessage(error);
            toast({ variant: "destructive", title: "Failed to load orders", description: msg.description ?? msg.title });
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (data: OrderFormData) => {
        await orderService.create(data);
        await fetchOrders();
    };

    const handleDelete = async (order: Order) => {
        const ok = window.confirm(`Delete order ID ${order.id}?`);
        if (!ok) return;
        try {
            await orderService.delete(order.id);
            toast({ title: "Order deleted" });
            await fetchOrders();
        } catch (error) {
            const msg = getApiErrorMessage(error);
            toast({ variant: "destructive", title: msg.title, description: msg.description });
        }
    };

    return (
        <PageContainer>
            <PageHeader
                title="Orders"
                description="Create and manage customer orders"
                icon={ClipboardList}
            >
                <Button className="flex items-center gap-1" onClick={() => setDialogOpen(true)}>
                    <Plus size={18} />
                    Add Order
                </Button>
            </PageHeader>

            <AddOrderDialog
                show={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onSubmit={handleCreate}
            />

            <Card>
                <CardHeader>
                    <CardTitle>Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Client ID</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead>Total Price</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10">
                                        Loading orders...
                                    </TableCell>
                                </TableRow>
                            ) : orders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10">
                                        No orders found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                orders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">{order.id}</TableCell>
                                        <TableCell>{order.clientId}</TableCell>
                                        <TableCell>{order.status}</TableCell>
                                        <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                                        <TableCell>{order.totalPrice}</TableCell>
                                        <TableCell className="space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500"
                                                onClick={() => handleDelete(order)}
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
