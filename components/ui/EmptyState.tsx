import type { ReactNode } from "react";

/**
 * Phase 5 — consistent empty / zero-result surfaces (admin and public).
 */
export function EmptyState({
  title,
  description,
  className = "",
  children,
}: {
  title: string;
  description?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      role="status"
      className={`rounded-xl border border-dashed border-em bg-sunken/25 px-6 py-10 text-center ${className}`}
    >
      <p className="text-lg font-semibold text-ink">{title}</p>
      {description ? (
        <p className="mt-2 text-base leading-relaxed text-fog">{description}</p>
      ) : null}
      {children ? (
        <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div>
      ) : null}
    </div>
  );
}
