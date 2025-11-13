"use client";

import { Loader2 } from "lucide-react";

export const LoadingComponent = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100">
      <div className="text-center space-y-4">
        <Loader2 className="size-8 animate-spin mx-auto" />
        <div className="space-y-2">
          <p className="text-lg font-semibold text-slate-900">Loading...</p>
          <p className="text-sm text-slate-500">This will only take a moment</p>
        </div>
      </div>
    </div>
  );
};
