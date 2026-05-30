"use client";

import React, { useEffect, useState } from "react";
import { Users, Plus, Search, Mail, Phone, MoreHorizontal } from "lucide-react";
import clientService from "@/services/clientService";
import { Client, ClientFormData } from "@/types/clientTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import AddClientDialog from "@/components/clients/AddClientDialog";
import { useToast } from "@/components/ui/toaster";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";

const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await clientService.getAll();
      setClients(data);
    } catch (error) {
      const msg = getApiErrorMessage(error);
      toast({
        variant: "destructive",
        title: "Failed to load clients",
        description: msg.description ?? msg.title,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async (clientData: ClientFormData) => {
    await clientService.create(clientData);
    await fetchClients();
  };


  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phoneNumber.includes(searchQuery)
  );

  return (
    <PageContainer>

      {/* Header Section */}
      <PageHeader 
        title="Clients" 
        description="Manage and view your customer database"
        icon={Users}
      >
        <Button
          className="flex items-center gap-1"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus size={18} />
          Add Client
        </Button>
      </PageHeader>

      <AddClientDialog
          show={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmit={handleAddClient}
      />

      {/* Main Content */}
      <div className="space-y-6">
        <div className="flex items-center max-w-md">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              placeholder="Search clients..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Contact Information</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10">
                      Loading clients...
                    </TableCell>
                  </TableRow>
                ) : filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{client.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ID: #{client.id}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail size={14} className="text-muted-foreground" />
                            {client.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone size={14} className="text-muted-foreground" />
                            {client.phoneNumber}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="success">Active</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal size={18} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center text-center">
                        <Users className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="font-medium">No clients found</h3>
                        <p className="text-sm text-muted-foreground">
                          Try adjusting your search or add a new client.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default ClientsPage;