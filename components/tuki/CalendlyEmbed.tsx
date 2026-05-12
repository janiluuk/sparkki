type Props = {
  embedUrl: string;
  title: string;
};

/** Full Calendly embed URL (e.g. from Calendly “Inline embed”). */
export function CalendlyEmbed({ embedUrl, title }: Props) {
  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-edge bg-card">
      <iframe
        title={title}
        src={embedUrl}
        className="h-[700px] w-full min-h-[520px] border-0"
        loading="lazy"
      />
    </div>
  );
}
