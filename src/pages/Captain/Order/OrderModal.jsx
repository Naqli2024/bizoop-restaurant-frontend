function OrderModal({
  title,
  size = "sm",
  onClose,
  footer,
  children,
}) {
  return (
    <div
      className="modal-bg"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={`modal ${size}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h3>{title}</h3>

        {children}

        <div className="modal-act">{footer}</div>
      </div>
    </div>
  );
}

export default OrderModal;