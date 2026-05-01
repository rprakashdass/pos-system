"use client";

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "default" | "destructive";

export type ToastInput = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  durationMs?: number;
};

type ToastItem = ToastInput & {
  id: string;
};

type ToastContextValue = {
  toasts: ToastItem[];
  toast: (input: ToastInput) => void;
  dismiss: (id: string) => void;
  clear: () => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION_MS = 4500;

function makeId() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<string, number>>(new Map());

  const dismiss = useCallback((id: string) => {
    const handle = timersRef.current.get(id);
    if (handle) {
      window.clearTimeout(handle);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clear = useCallback(() => {
    timersRef.current.forEach((handle) => window.clearTimeout(handle));
    timersRef.current.clear();
    setToasts([]);
  }, []);

  const toast = useCallback(
    (input: ToastInput) => {
      const id = makeId();
      const durationMs = input.durationMs ?? DEFAULT_DURATION_MS;

      const item: ToastItem = {
        id,
        variant: input.variant ?? "default",
        title: input.title,
        description: input.description,
        durationMs,
      };

      setToasts((prev) => [item, ...prev].slice(0, 5));

      const handle = window.setTimeout(() => dismiss(id), durationMs);
      timersRef.current.set(id, handle);
    },
    [dismiss]
  );

  const value = useMemo<ToastContextValue>(() => ({ toasts, toast, dismiss, clear }), [toasts, toast, dismiss, clear]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed right-4 top-4 z-60 flex w-full max-w-sm flex-col gap-2">
      {toasts.map((t) => {
        const isDestructive = t.variant === "destructive";

        return (
          <div
            key={t.id}
            className={cn(
              "rounded-lg border bg-background text-foreground shadow-lg",
              "p-4",
              isDestructive ? "border-destructive/40" : "border-border"
            )}
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className={cn("text-sm font-semibold", isDestructive && "text-destructive")}>{t.title}</div>
                {t.description ? (
                  <div className="mt-1 text-sm text-muted-foreground wrap-break-word">{t.description}</div>
                ) : null}
              </div>
              <button
                type="button"
                className={cn(
                  "rounded-md p-1 text-muted-foreground hover:text-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-ring"
                )}
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
