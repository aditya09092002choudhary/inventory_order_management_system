export default function AlertBanner({ type = 'info', message, onClose }) {
  if (!message) return null

  return (
    <div className={`alert-banner alert-${type}`}>
      <span>{message}</span>
      {onClose ? (
        <button type="button" className="icon-button" onClick={onClose} aria-label="Dismiss message">
          ×
        </button>
      ) : null}
    </div>
  )
}
