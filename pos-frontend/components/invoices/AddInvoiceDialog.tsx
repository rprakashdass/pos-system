"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InvoiceFormData } from "@/types/invoiceTypes";
import { useToast } from "@/components/ui/toaster";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";

interface AddInvoiceDialogProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: InvoiceFormData) => Promise<void>;
}

const AddInvoiceDialog: React.FC<AddInvoiceDialogProps> = ({ show, onClose, onSubmit }) => {
  const { toast } = useToast();
  const [orderId, setOrderId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!show) return;
    setOrderId("");
  }, [show]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!orderId || Number(orderId) <= 0) {
      toast({ variant: "destructive", title: "Order ID is required", description: "Enter a valid order ID." });
      return;
    }
    const payload: InvoiceFormData = { orderId: Number(orderId) };

    setIsSubmitting(true);
    try {
      await onSubmit(payload);
      toast({ title: "Invoice created" });
      onClose();
    } catch (error) {
      const msg = getApiErrorMessage(error);
      toast({ variant: "destructive", title: msg.title, description: msg.description });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog show={show} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogHeader className="mb-4">
          <DialogTitle>Create Invoice</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Input
            type="number"
            placeholder="Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            required
          />
        </div>

        <DialogFooter className="mt-6 gap-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};

export default AddInvoiceDialog;
