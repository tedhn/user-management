"use client";

import { toast as sonnerToast } from "sonner";
import { Button } from "./button";
import {
  InfoIcon,
  CircleCheckIcon,
  TriangleAlertIcon,
  OctagonXIcon,
} from "lucide-react";
import { Spinner } from "./spinner";

type ToastVariant = "info" | "success" | "warning" | "error" | "loading";

const iconTypes = {
  info: <InfoIcon className="size-4 text-blue-500" />,
  success: <CircleCheckIcon className="size-4 text-green-500" />,
  warning: <TriangleAlertIcon className="size-4 text-yellow-500" />,
  error: <OctagonXIcon className="size-4 text-red-500" />,
  loading: <Spinner className="size-4" />,
} as const;

const buttonStyles: Record<
  "success" | "warning" | "error" | "info" | "default",
  string
> = {
  success: "bg-green-50 text-green-600 hover:bg-green-100",
  warning: "bg-amber-50 text-amber-600 hover:bg-amber-100",
  error: "bg-red-50 text-red-600 hover:bg-red-100",
  info: "bg-blue-50 text-blue-600 hover:bg-blue-100",
  default: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100",
};

export function toast(toast: Omit<ToastProps, "id">) {
  return sonnerToast.custom((id) => (
    <Toast
      id={id}
      title={toast.title}
      description={toast.description}
      variant={toast.variant}
      button={toast.button}
    />
  ));
}

// --- Variant helpers ---
toast.info = (opts: Omit<ToastProps, "id" | "variant">) =>
  toast({ ...opts, variant: "info" });

toast.success = (opts: Omit<ToastProps, "id" | "variant">) =>
  toast({ ...opts, variant: "success" });

toast.warning = (opts: Omit<ToastProps, "id" | "variant">) =>
  toast({ ...opts, variant: "warning" });

toast.error = (opts: Omit<ToastProps, "id" | "variant">) =>
  toast({ ...opts, variant: "error" });

toast.loading = (opts: Omit<ToastProps, "id" | "variant">) =>
  toast({ ...opts, variant: "loading" });

function Toast({
  id,
  title,
  description,
  variant = "info",
  button,
}: ToastProps) {
  const icon = iconTypes[variant];

  return (
    <div className="flex rounded-lg bg-white shadow-lg ring-1 ring-black/5 w-full md:max-w-[364px] items-center p-4">
      <div className="flex flex-1 items-center">
        {icon && <div className="mr-4">{icon}</div>}
        <div className="w-full">
          <p className="text-sm font-medium text-gray-900">{title}</p>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
      </div>
      {button && (
        <div className="ml-5 shrink-0">
          <Button
            className={`rounded px-3 py-1 text-sm font-semibold ${
              buttonStyles[variant as keyof typeof buttonStyles] ||
              buttonStyles.default
            }`}
            onClick={() => {
              button.onClick();
              sonnerToast.dismiss(id);
            }}
          >
            {button.label}
          </Button>
        </div>
      )}
    </div>
  );
}

interface ToastProps {
  id: string | number;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  variant?: ToastVariant;
  button?: {
    label: string;
    onClick: () => void;
  };
}
