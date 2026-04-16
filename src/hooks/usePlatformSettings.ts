import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SmtpSettings {
  enabled: boolean;
  host: string;
  port: number;
  user: string;
  password: string;
  secure: boolean;
  from_name: string;
  from_email: string;
  reply_to: string;
  verified_at: string | null;
}

export interface GeneralSettingsValue {
  app_name: string;
  support_email: string;
  logo_url: string;
  company_name: string;
}

export function usePlatformSetting<T = any>(key: string) {
  const [value, setValue] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("platform_settings")
      .select("value")
      .eq("key", key)
      .maybeSingle();
    setValue((data?.value ?? null) as T | null);
    setLoading(false);
  }, [key]);

  useEffect(() => { reload(); }, [reload]);

  const save = useCallback(async (newValue: T) => {
    const { error } = await supabase
      .from("platform_settings")
      .update({ value: newValue as any })
      .eq("key", key);
    if (!error) setValue(newValue);
    return { error };
  }, [key]);

  return { value, loading, save, reload };
}
