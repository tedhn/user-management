import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";

interface ErrorStateProps {
  error?: Error | { message: string };
  onRetry?: () => void;
  onGoBack?: () => void;
  onGoHome?: () => void;
}

export const NotFoundComponet = ({ error, onRetry }: ErrorStateProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 p-4">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="mt-2">
          {error?.message || "Failed to load data."}
        </AlertDescription>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="mt-4"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        )}
      </Alert>
    </div>
  );
};
