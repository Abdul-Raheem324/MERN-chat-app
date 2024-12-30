import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

function ChatLoading() {
  return (
    <div className="flex items-center space-x-4 mt-5">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[175px]" />
      </div>
    </div>
  );
}

export default ChatLoading;
