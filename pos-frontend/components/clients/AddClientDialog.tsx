"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ClientFormData } from "@/types/clientTypes";
import { useToast } from "@/components/ui/toaster";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";

interface AddClientDialogProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (client: ClientFormData) => Promise<void>;
}

const AddClientDialog: React.FC<AddClientDialogProps> = ({
  show,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<ClientFormData>({
    name: "",
    email: "",
    phoneNumber: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({ variant: "destructive", title: "Client name is required" });
      return;
    }
    if (!formData.email.trim()) {
      toast({ variant: "destructive", title: "Email is required" });
      return;
    }
    if (!formData.phoneNumber.trim()) {
      toast({ variant: "destructive", title: "Phone number is required" });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      toast({ title: "Client created" });
      setFormData({ name: "", email: "", phoneNumber: "" });
      onClose();
    } catch (error) {
      const msg = getApiErrorMessage(error);
      toast({ variant: "destructive", title: msg.title, description: msg.description });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog show={show} onClose={onClose}>
      <form onSubmit={handleFormSubmit}>
        <DialogHeader className="mb-4">
          <DialogTitle>Add New Client</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              name="email"
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <DialogFooter className="mt-6 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Client"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};

export default AddClientDialog;