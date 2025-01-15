import { Loader } from "lucide-react";

export const LoadingSpinner = ({ text = "Loading..." }) => (
  <div className="h-screen flex flex-col items-center justify-center p-4">
    <Loader className="h-8 w-8 text-blue-500 animate-spin" />
    <p className="mt-2 text-sm text-gray-600">{text}</p>
  </div>
);

export const LoadingOverlay = ({ text }: { text: string }) => (
  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
    <LoadingSpinner text={text} />
  </div>
);
