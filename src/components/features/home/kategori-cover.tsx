import { Gamepad2 } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  KATEGORI_ICON,
  getKategoriGradient,
} from "@/lib/catalog/kategori-visual";

/**
 * Stand-in for real product/cover art (see kategori-visual.ts) — a gradient
 * tile with the Kategori icon, dot-grid texture for depth, sized like a
 * game-store product thumbnail.
 *
 * Looks up KATEGORI_ICON directly (not the getKategoriIcon() helper) so the
 * icon component reference comes from a plain property access rather than a
 * function call — react-hooks/static-components flags JSX tags resolved
 * from a call expression as "components created during render".
 */
export function KategoriCover({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const Icon = KATEGORI_ICON[slug] ?? Gamepad2;
  const gradient = getKategoriGradient(slug);

  return (
    <div
      className={cn(
        "relative flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br",
        gradient,
        className,
      )}
    >
      <div
        className="absolute inset-0 opacity-30 [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:12px_12px] text-foreground/20"
        aria-hidden
      />
      <Icon className="relative size-8 text-foreground/70" strokeWidth={1.5} />
    </div>
  );
}
