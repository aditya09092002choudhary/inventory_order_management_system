export default function StatCard({ label, value, tone = 'default', helper }) {
  return (
    <div className={`stat-card tone-${tone}`}>
      <div className="stat-card__top">
        <span className="stat-label">{label}</span>
        {helper ? <span className="stat-helper">{helper}</span> : null}
      </div>
      <div className="stat-value">{value}</div>
    </div>
  )
}
