"use client";

import { toast as sonnerToast } from "sonner";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface CustomToastOptions {
  title: string | ReactNode;
  description?: string | ReactNode;
  action?: ReactNode;
  closeButton?: boolean;
  duration?: number;
  onClose?: () => void;
}

export function useToast() {
  const custom = (
    type: "success" | "error" | "warning" | "info",
    options: CustomToastOptions
  ) => {
    const {
      title,
      description,
      action,
      closeButton = false,
      duration,
      onClose,
    } = options;

    return baseToast({
      type,
      title: typeof title === "string" ? title : "",
      description: typeof description === "string" ? description : undefined,
      button: action
        ? {
            label: "",
            onClick: () => {},
          }
        : undefined,
    });
  };

  const info = (options: CustomToastOptions | string) => {
    if (typeof options === "string") {
      return baseToast.info(options);
    }
    return custom("info", options);
  };

  const success = (options: CustomToastOptions | string) => {
    if (typeof options === "string") {
      return baseToast.success(options);
    }
    return custom("success", options);
  };

  const error = (options: CustomToastOptions | string) => {
    if (typeof options === "string") {
      return baseToast.error(options);
    }
    return custom("error", options);
  };

  const warning = (options: CustomToastOptions | string) => {
    if (typeof options === "string") {
      return baseToast.warning(options);
    }
    return custom("warning", options);
  };

  const promise = baseToast.promise;

  // Custom JSX toast (for complex content)
  const jsx = (
    content: ReactNode,
    options?: { duration?: number; onClose?: () => void }
  ) => {
    return sonnerToast.custom(
      (id) => (
        <div className="flex rounded-lg bg-white shadow-lg ring-1 ring-black/5 dark:bg-gray-800 dark:ring-white/10 w-full md:max-w-[420px] p-4">
          <div className="flex-1">{content}</div>
          {options?.onClose && (
            <button
              onClick={() => {
                sonnerToast.dismiss(id);
                options.onClose?.();
              }}
              className="ml-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      ),
      {
        duration: options?.duration,
      }
    );
  };

  return {
    success,
    error,
    warning,
    info,
    promise,
    jsx,
    dismiss: sonnerToast.dismiss,
  };
}
