export function CockpitSkeleton() {
  return (
    <div className="skeleton-wrap" aria-busy="true" aria-label="Carregando cockpit">
      <div className="skeleton-block skeleton-hero" />
      <div className="skeleton-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div className="skeleton-block skeleton-kpi" key={i} />
        ))}
      </div>
      <div className="skeleton-block skeleton-panel" />
      <div className="skeleton-block skeleton-panel" />
    </div>
  );
}
