"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Product, ProductFormData } from "@/types/productTypes";
import { useToast } from "@/components/ui/toaster";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";

interface ProductDialogProps {
  show: boolean;
  mode: "create" | "edit";
  initialProduct?: Product;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => Promise<void>;
}

const emptyForm: ProductFormData = {
  name: "",
  barcode: "",
  description: "",
  price: 0,
  clientId: 0,
};

const ProductDialog: React.FC<ProductDialogProps> = ({
  show,
  mode,
  initialProduct,
  onClose,
  onSubmit,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ProductFormData>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!show) return;

    if (mode === "edit" && initialProduct) {
      setFormData({
        name: initialProduct.name,
        barcode: initialProduct.barcode,
        description: initialProduct.description ?? "",
        price: initialProduct.price,
        clientId: initialProduct.clientId,
      });
      return;
    }

    setFormData(emptyForm);
  }, [show, mode, initialProduct]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "price" || name === "clientId") {
      const numericValue = value === "" ? 0 : Number(value);
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({ variant: "destructive", title: "Name is required" });
      return;
    }
    if (!formData.barcode.trim()) {
      toast({ variant: "destructive", title: "Barcode is required" });
      return;
    }
    if (!formData.clientId || formData.clientId <= 0) {
      toast({ variant: "destructive", title: "Client ID is required", description: "Enter a valid client ID." });
      return;
    }
    if (formData.price == null || Number.isNaN(formData.price) || formData.price < 0) {
      toast({ variant: "destructive", title: "Invalid price", description: "Price must be 0 or greater." });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      const msg = getApiErrorMessage(error);
      toast({ variant: "destructive", title: msg.title, description: msg.description });
    } finally {
      setIsSubmitting(false);
    }
  };

  const title = mode === "create" ? "Add Product" : "Edit Product";
  const submitLabel = mode === "create" ? "Create" : "Save";

  return (
    <Dialog show={show} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogHeader className="mb-4">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Input
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            name="barcode"
            placeholder="Barcode"
            value={formData.barcode}
            onChange={handleChange}
            required
          />
          <Input
            name="description"
            placeholder="Description (optional)"
            value={formData.description ?? ""}
            onChange={handleChange}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              name="price"
              type="number"
              step="0.01"
              placeholder="Price"
              value={String(formData.price)}
              onChange={handleChange}
              required
            />
            <Input
              name="clientId"
              type="number"
              placeholder="Client ID"
              value={String(formData.clientId)}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <DialogFooter className="mt-6 gap-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};

export default ProductDialog;
