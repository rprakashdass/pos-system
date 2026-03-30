"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer = ({ children, className }: PageContainerProps) => {
  return (
    <div className={cn("container p-6 space-y-6 mx-auto", className)}>
      {children}
    </div>
  );
};

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ElementType;
  children?: React.ReactNode;
}

export const PageHeader = ({ title, description, icon: Icon, children }: PageHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center">
          {Icon && <Icon size={24} className="mr-2 text-primary" />}
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          {children}
        </div>
      )}
    </div>
  );
};
