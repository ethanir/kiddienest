"use client";

import { createContext, useContext, type ReactNode } from "react";

export type AppRole = "admin" | "staff" | "parent" | null;

const RoleContext = createContext<AppRole>(null);

export function RoleProvider({
  role,
  children,
}: {
  role: AppRole;
  children: ReactNode;
}) {
  return <RoleContext.Provider value={role}>{children}</RoleContext.Provider>;
}

export function useRole(): AppRole {
  return useContext(RoleContext);
}
