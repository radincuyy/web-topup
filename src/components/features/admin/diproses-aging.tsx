"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";

import { getAgingLevel, AGING_LEVEL_CLASS } from "@/lib/orders/aging";

/**
 * Same client-only-after-mount deferral as RelativeTime, plus the
 * amber/red aging color — both depend on Date.now().
 */
export function DiprosesAging({ updatedAt }: { updatedAt: string }) {
  const [state, setState] = useState<{ text: string; levelClass: string } | null>(
    null,
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial sync read of Date.now(), not derivable at render/server time
    setState({
      text: formatDistanceToNow(new Date(updatedAt), { locale: localeId }),
      levelClass: AGING_LEVEL_CLASS[getAgingLevel(updatedAt)],
    });
  }, [updatedAt]);

  if (!state) return null;

  return (
    <span className={`text-xs ${state.levelClass}`}>menunggu {state.text}</span>
  );
}
