"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { OrderFormData, OrderItemFormData } from "@/types/orderTypes";
import { useToast } from "@/components/ui/toaster";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";

interface AddOrderDialogProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: OrderFormData) => Promise<void>;
}

const AddOrderDialog: React.FC<AddOrderDialogProps> = ({ show, onClose, onSubmit }) => {
  const { toast } = useToast();
  const [clientId, setClientId] = useState<string>("");
  const [items, setItems] = useState<Array<{ productId: string; quantity: string }>>([
    { productId: "", quantity: "1" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!show) return;
    setClientId("");
    setItems([{ productId: "", quantity: "1" }]);
  }, [show]);

  const updateItem = (index: number, patch: Partial<{ productId: string; quantity: string }>) => {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  };

  const addItemRow = () => {
    setItems((prev) => [...prev, { productId: "", quantity: "1" }]);
  };

  const removeItemRow = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const toOrderItemForm = (row: { productId: string; quantity: string }): OrderItemFormData => {
    return {
      productId: Number(row.productId),
      quantity: Number(row.quantity),
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientId || Number(clientId) <= 0) {
      toast({ variant: "destructive", title: "Client ID is required", description: "Enter a valid client ID." });
      return;
    }

    if (!items.length) {
      toast({ variant: "destructive", title: "Add at least one item", description: "An order must contain at least one product." });
      return;
    }

    const parsedItems = items.map(toOrderItemForm);

    if (parsedItems.some((it) => !it.productId || it.productId <= 0)) {
      toast({ variant: "destructive", title: "Missing product", description: "Each item must have a valid Product ID." });
      return;
    }

    if (parsedItems.some((it) => !it.quantity || it.quantity <= 0)) {
      toast({ variant: "destructive", title: "Invalid quantity", description: "Quantity must be at least 1." });
      return;
    }

    const payload: OrderFormData = {
      clientId: Number(clientId),
      items: parsedItems,
    };

    setIsSubmitting(true);
    try {
      await onSubmit(payload);
      toast({ title: "Order created" });
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
          <DialogTitle>Create Order</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Input
            name="clientId"
            type="number"
            placeholder="Client ID"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            required
          />

          <div className="space-y-3">
            {items.map((row, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center">
                <div className="md:col-span-3">
                  <Input
                    type="number"
                    placeholder="Product ID"
                    value={row.productId}
                    onChange={(e) => updateItem(idx, { productId: e.target.value })}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={row.quantity}
                    onChange={(e) => updateItem(idx, { quantity: e.target.value })}
                    required
                    min={1}
                  />
                </div>
                <div className="md:col-span-1 flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeItemRow(idx)}
                    disabled={items.length === 1}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}

            <div>
              <Button type="button" variant="outline" onClick={addItemRow}>
                Add Item
              </Button>
            </div>
          </div>
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

export default AddOrderDialog;
