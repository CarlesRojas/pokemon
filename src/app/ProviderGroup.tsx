"use client";

import { EventProvider } from "@/app/context/Event";
import { ReactNode } from "react";

export const ProviderGroup = ({ children }: { children: ReactNode }) => {
    return <EventProvider>{children}</EventProvider>;
};
