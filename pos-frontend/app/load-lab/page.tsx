"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  DatabaseZap,
  FlaskConical,
  Layers3,
  Play,
  RefreshCcw,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";

import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toaster";
import clientService from "@/services/clientService";
import invoiceService from "@/services/invoiceService";
import inventoryService from "@/services/inventoryService";
import orderService from "@/services/orderService";
import productService from "@/services/productService";
import apiService from "@/services/apiService";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import type { ClientFormData } from "@/types/clientTypes";
import type { InventoryCreateForm } from "@/types/inventoryTypes";
import type { OrderFormData } from "@/types/orderTypes";
import type { ProductFormData } from "@/types/productTypes";

type RunTone = "info" | "success" | "warning" | "error";

type RunLog = {
  id: number;
  tone: RunTone;
  title: string;
  detail: string;
  time: string;
};

type Counts = {
  clients: number;
  products: number;
  inventory: number;
  orders: number;
  invoices: number;
};

const initialCounts: Counts = {
  clients: 0,
  products: 0,
  inventory: 0,
  orders: 0,
  invoices: 0,
};

const endpointCoverage = [
  "POST /clients",
  "GET /clients",
  "POST /products",
  "POST /inventory",
  "POST /orders",
  "POST /invoices",
  "GET /inventory",
  "GET /orders",
  "GET /invoices",
];

const makeTimestamp = () => new Date().toLocaleTimeString();

const buildOrderItems = (productId: number): OrderFormData["items"] => [
  { productId, quantity: 1 },
];

export default function LoadLabPage() {
  const [entryCount, setEntryCount] = useState(10);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<RunLog[]>([]);
  const [counts, setCounts] = useState(initialCounts);
  const [lastRunMs, setLastRunMs] = useState<number | null>(null);
  const [runStatus, setRunStatus] = useState<RunTone>("info");
  const { toast } = useToast();

  const metrics = useMemo(
    () => [
      { label: "Clients", value: counts.clients, icon: Layers3 },
      { label: "Products", value: counts.products, icon: DatabaseZap },
      { label: "Inventory", value: counts.inventory, icon: ShieldCheck },
      { label: "Orders", value: counts.orders, icon: Activity },
      { label: "Invoices", value: counts.invoices, icon: CheckCircle2 },
    ],
    [counts]
  );

  useEffect(() => {
    void refreshCounts();
  }, []);

  const addLog = (tone: RunTone, title: string, detail: string) => {
    setLogs((current) => [
      {
        id: Date.now() + Math.floor(Math.random() * 1000),
        tone,
        title,
        detail,
        time: makeTimestamp(),
      },
      ...current,
    ]);
  };

  const refreshCounts = async () => {
    try {
      const [clients, products, inventory, orders, invoices] = await Promise.all([
        clientService.getAll(),
        productService.getAll(),
        inventoryService.getAll(),
        orderService.getAll(),
        invoiceService.getAll(),
      ]);

      setCounts({
        clients: clients.length,
        products: products.length,
        inventory: inventory.length,
        orders: orders.length,
        invoices: invoices.length,
      });
    } catch (error) {
      const message = getApiErrorMessage(error);
      toast({
        variant: "destructive",
        title: "Unable to refresh live counts",
        description: message.description ?? message.title,
      });
    }
  };

  const runBulkLoad = async () => {
    if (entryCount < 1) {
      toast({
        variant: "destructive",
        title: "Invalid entry count",
        description: "Use at least 1 entry.",
      });
      return;
    }

    setRunning(true);
    setProgress(0);
    setLogs([]);
    setRunStatus("info");

    const startedAt = performance.now();
    const runSeed = Date.now();

    try {
      addLog("info", "Run started", `Submitting ${entryCount} real transaction cycles.`);

      for (let index = 0; index < entryCount; index += 1) {
        const cycle = index + 1;
        const cycleToken = `${runSeed}-${cycle}`;
        const clientEmail = `load-${cycleToken}@example.com`;

        addLog("info", `Cycle ${cycle}`, "Creating client record.");
        const clientPayload: ClientFormData = {
          name: `Load Client ${cycleToken}`,
          email: clientEmail,
          phoneNumber: `555-${String(1000 + cycle).padStart(4, "0")}`,
        };
        const createdClient = await clientService.create(clientPayload);
        const clients = await clientService.getAll();
        const clientId = createdClient.id ?? clients.find((client) => client.email === clientEmail)?.id;

        if (!clientId) {
          throw new Error(`Unable to resolve client id for ${clientEmail}`);
        }

        const productPayload: ProductFormData = {
          name: `Load Product ${cycleToken}`,
          barcode: `LB-${cycleToken}`,
          description: `Bulk load product generated for cycle ${cycle}`,
          price: Number((25 + cycle * 1.75).toFixed(2)),
          clientId,
        };

        addLog("info", `Cycle ${cycle}`, `Creating product for client #${clientId}.`);
        const createdProduct = await productService.create(productPayload);

        const inventoryPayload: InventoryCreateForm = {
          productId: createdProduct.id,
          quantity: 25,
        };

        addLog("info", `Cycle ${cycle}`, `Creating inventory row for product #${createdProduct.id}.`);
        const createdInventory = await inventoryService.create(inventoryPayload);

        const orderPayload: OrderFormData = {
          clientId,
          items: buildOrderItems(createdProduct.id),
        };

        addLog("info", `Cycle ${cycle}`, `Creating order and consuming inventory #${createdInventory.id}.`);
        const createdOrder = await orderService.create(orderPayload);

        addLog("info", `Cycle ${cycle}`, `Creating invoice for order #${createdOrder.id}.`);
        const createdInvoice = await invoiceService.create({ orderId: createdOrder.id });

        addLog(
          "success",
          `Cycle ${cycle} complete`,
          `Client #${clientId}, product #${createdProduct.id}, order #${createdOrder.id}, invoice #${createdInvoice.id} persisted.`
        );

        setProgress(Math.round(((index + 1) / entryCount) * 100));
      }

      await refreshCounts();

      const elapsed = performance.now() - startedAt;
      setLastRunMs(elapsed);
      setRunStatus("success");
      addLog("success", "Run complete", `Finished ${entryCount} cycles in ${Math.round(elapsed)}ms.`);
      toast({
        title: "Bulk load finished",
        description: `Completed ${entryCount} real transaction cycles.`,
      });
    } catch (error) {
      const message = getApiErrorMessage(error);
      setRunStatus("error");
      addLog("error", "Run failed", message.description ?? message.title);
      toast({
        variant: "destructive",
        title: "Bulk load failed",
        description: message.description ?? message.title,
      });
    } finally {
      setRunning(false);
    }
  };

  const runBulkServer = async () => {
    if (entryCount < 1) {
      toast({ variant: "destructive", title: "Invalid entry count", description: "Use at least 1 entry." });
      return;
    }

    setRunning(true);
    setProgress(0);
    setLogs([]);
    setRunStatus("info");

    const startedAt = performance.now();

    try {
      addLog("info", "Run started (server)", `Requesting server to run ${entryCount} cycles.`);
      const respAny: any = await apiService.post('/load/test/bulk', { count: entryCount });
      // resp.results is an array of per-cycle results
      const results: any[] = respAny.results || [];
      let success = 0;
      results.forEach((r, idx) => {
        if (r.status === 'success') {
          success += 1;
          addLog('success', `Cycle ${r.cycle}`, `Persisted order ${r.orderId} (client ${r.clientId})`);
        } else {
          addLog('error', `Cycle ${r.cycle} failed`, r.error || 'unknown');
        }
        setProgress(Math.round(((idx + 1) / results.length) * 100));
      });

      await refreshCounts();

      const elapsed = performance.now() - startedAt;
      setLastRunMs(elapsed);
      setRunStatus('success');
      addLog('success', 'Run complete (server)', `Server finished ${results.length} cycles (${success} succeeded).`);
      toast({ title: 'Bulk load finished', description: `Server completed ${results.length} cycles (${success} succeeded).` });
    } catch (error) {
      const message = getApiErrorMessage(error);
      setRunStatus('error');
      addLog('error', 'Run failed (server)', message.description ?? message.title);
      toast({ variant: 'destructive', title: 'Bulk load failed', description: message.description ?? message.title });
    } finally {
      setRunning(false);
    }
  };

  const clearLogs = () => setLogs([]);

  return (
    <PageContainer className="max-w-7xl pb-12">
      <PageHeader
        title="Load Lab"
        description="Run real database writes through the business endpoints and watch the system handle bulk traffic end to end."
        icon={FlaskConical}
      >
        <Button variant="outline" onClick={refreshCounts} disabled={running}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Refresh Counts
        </Button>
        <Button onClick={runBulkLoad} disabled={running}>
          <Play className="mr-2 h-4 w-4" />
          {running ? "Running..." : "Run Bulk Load"}
        </Button>
      </PageHeader>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card className="overflow-hidden border-slate-200/80 bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 text-slate-50 shadow-xl shadow-slate-950/10">
          <CardHeader className="space-y-4 border-b border-white/10 bg-white/5 pb-6">
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.22em] text-slate-300">
              <Badge variant="outline" className="border-white/20 text-slate-100">
                Live endpoints
              </Badge>
              <Badge variant="outline" className="border-white/20 text-slate-100">
                DB writes enabled
              </Badge>
              <Badge variant="outline" className="border-white/20 text-slate-100">
                Sequential transaction flow
              </Badge>
            </div>
            <div className="space-y-3">
              <CardTitle className="text-3xl font-semibold leading-tight text-white md:text-4xl">
                Stress the real stack with repeatable business data.
              </CardTitle>
              <p className="max-w-3xl text-sm leading-6 text-slate-300 md:text-base">
                Every cycle creates a client, product, inventory row, order, and invoice against the real API.
                The run is intentionally sequential so the inventory and invoice relationships stay valid while still
                generating realistic backend load.
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 p-6 md:p-8">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-300">Requested entries</p>
                <div className="mt-2 flex items-center gap-3">
                  <Input
                    type="number"
                    min={1}
                    value={entryCount}
                    onChange={(event) => setEntryCount(Number(event.target.value) || 1)}
                    className="h-12 border-white/10 bg-white/10 text-lg text-white placeholder:text-slate-400"
                  />
                </div>
                <p className="mt-2 text-xs text-slate-400">One entry equals one full transaction cycle.</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-300">Progress</p>
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-3xl font-semibold text-white">{progress}%</span>
                  <span className="pb-1 text-sm text-slate-400">complete</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-emerald-400 via-cyan-400 to-sky-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-300">Last run</p>
                <div className="mt-2 flex items-center gap-2 text-white">
                  <ArrowRight className="h-4 w-4 text-cyan-300" />
                  <span className="text-lg font-medium">
                    {lastRunMs ? `${Math.round(lastRunMs)} ms` : "No run yet"}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  Status: {runStatus === "success" ? "completed" : runStatus === "error" ? "failed" : "idle"}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {metrics.map((metric) => {
                const Icon = metric.icon;
                return (
                  <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-slate-300">{metric.label}</span>
                      <Icon className="h-4 w-4 text-cyan-300" />
                    </div>
                    <div className="mt-3 text-3xl font-semibold text-white">{metric.value}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Layers3 className="h-5 w-5 text-primary" />
                Endpoint coverage
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {endpointCoverage.map((endpoint) => (
                <Badge key={endpoint} variant="secondary" className="rounded-md px-3 py-1 text-xs">
                  {endpoint}
                </Badge>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="h-5 w-5 text-primary" />
                Run controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col gap-2">
                <Button className="w-full" onClick={runBulkLoad} disabled={running}>
                  <Play className="mr-2 h-4 w-4" />
                  {running ? "Processing real load..." : "Start real bulk processing (client)"}
                </Button>
                <Button className="w-full" variant="secondary" onClick={runBulkServer} disabled={running}>
                  <Play className="mr-2 h-4 w-4" />
                  {running ? "Processing..." : "Start bulk via server"}
                </Button>
              </div>
              <Button variant="outline" className="w-full" onClick={clearLogs} disabled={running && logs.length > 0}>
                Clear log
              </Button>
              <div className="rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">
                Each cycle writes through the live API and consumes inventory before invoicing the order.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TriangleAlert className="h-5 w-5 text-amber-500" />
                Behavior notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>This runner is sequential on purpose so the inventory and invoice dependencies stay valid.</p>
              <p>The client id is resolved from the live GET endpoint after creation, because the create response is not guaranteed to carry it.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <DatabaseZap className="h-5 w-5 text-primary" />
            Execution log
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="rounded-xl border border-dashed bg-muted/30 p-8 text-center text-sm text-muted-foreground">
              No run yet. Start the bulk load to see each API call and response chain.
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((entry) => {
                const toneClasses =
                  entry.tone === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                    : entry.tone === "error"
                      ? "border-red-200 bg-red-50 text-red-900"
                      : entry.tone === "warning"
                        ? "border-amber-200 bg-amber-50 text-amber-900"
                        : "border-slate-200 bg-slate-50 text-slate-900";

                return (
                  <div key={entry.id} className={`rounded-xl border px-4 py-3 ${toneClasses}`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="font-medium">{entry.title}</div>
                      <div className="text-xs opacity-70">{entry.time}</div>
                    </div>
                    <p className="mt-1 text-sm opacity-90">{entry.detail}</p>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}