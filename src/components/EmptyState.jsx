import Button from "./Button";

export default function EmptyState({ title, subtitle, ctaLabel, onCta }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
      {ctaLabel && onCta ? (
        <div className="mt-4">
          <Button onClick={onCta}>{ctaLabel}</Button>
        </div>
      ) : null}
    </div>
  );
}