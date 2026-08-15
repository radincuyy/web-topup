"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";

/**
 * "Time ago" text computed only after mount. formatDistanceToNow reads
 * Date.now() internally — calling that during server render trips Next's
 * Cache Components prerender-shell check (unstable value), same as
 * site-footer.tsx's copyright year. Unlike the year, this value is meant to
 * be genuinely live, so the fix here is client-only deferral instead of
 * "use cache".
 */
export function RelativeTime({
  date,
  addSuffix = true,
  className,
}: {
  date: string;
  addSuffix?: boolean;
  className?: string;
}) {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial sync read of Date.now(), not derivable at render/server time
    setText(formatDistanceToNow(new Date(date), { addSuffix, locale: localeId }));
  }, [date, addSuffix]);

  return (
    <span className={className} title={new Date(date).toLocaleString("id-ID")}>
      {text ?? "-"}
    </span>
  );
}
