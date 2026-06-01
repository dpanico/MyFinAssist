"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig } from "./config";

export function createSupabaseBrowserClient() {
  const config = getSupabaseConfig();

  if (!config.url || !config.publishableKey) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return createBrowserClient(config.url, config.publishableKey);
}
