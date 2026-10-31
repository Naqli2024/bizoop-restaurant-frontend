
import OrderModal from "./OrderModal";
import { ADDONS, SPICE_LEVELS, SPICY, STATIONS } from "./OrderData";
import { inr } from "./OrderHelpers";

const OrderOptionsModal = ({
  modal,
  patchModal,
  closeModal,
  addLine,
}) => {
  if (!modal) return null;

  const { m } = modal;
  const addonsForCategory = ADDONS[m.category] || [];

  const addonTotal = modal.addons.reduce((sum, name) => {
    const addon = addonsForCategory.find((item) => item[0] === name);
    return sum + (addon ? addon[1] : 0);
  }, 0);

  const toggleAddon = (name) => {
    patchModal({
      addons: modal.addons.includes(name)
        ? modal.addons.filter((item) => item !== name)
        : [...modal.addons, name],
    });
  };

  return (
    <OrderModal
      title={`${m.icon} ${m.name}`}
      size="md"
      onClose={closeModal}
      footer={
        <>
          <button type="button" className="btn" onClick={closeModal}>
            Cancel
          </button>

          <button
            type="button"
            className="btn modal-ok"
            onClick={() => {
              addLine(m, modal.qty, {
                spice: modal.spice,
                addons: modal.addons,
                note: modal.note.trim(),
                hold: modal.hold,
              });
              closeModal();
            }}
          >
            Add {modal.qty} · {inr((m.price + addonTotal) * modal.qty)}
          </button>
        </>
      }
    >
      <div className="row between">
        <span className="tag">
          Routes to {STATIONS[m.station]?.label}
        </span>
        <b className="accent">{inr(m.price)}</b>
      </div>

      <div className="fl">Quantity</div>
      <div className="qty-ctrl big-qty">
        <button
          type="button"
          className="mini"
          onClick={() => patchModal({ qty: Math.max(1, modal.qty - 1) })}
        >
          −
        </button>
        <span className="qn">{modal.qty}</span>
        <button
          type="button"
          className="mini"
          onClick={() => patchModal({ qty: modal.qty + 1 })}
        >
          +
        </button>
      </div>

      {SPICY.includes(m.category) && (
        <>
          <div className="fl">Spice level</div>
          <div className="row wrap">
            {SPICE_LEVELS.map((spice) => (
              <button
                type="button"
                key={spice}
                className={`chip ${modal.spice === spice ? "sel" : ""}`}
                onClick={() => patchModal({ spice })}
              >
                {spice}
              </button>
            ))}
          </div>
        </>
      )}

      {addonsForCategory.length > 0 && (
        <>
          <div className="fl">Add-ons &amp; modifiers</div>
          <div className="row wrap">
            {addonsForCategory.map(([name, price]) => (
              <button
                type="button"
                key={name}
                className={`chip ${modal.addons.includes(name) ? "sel" : ""}`}
                onClick={() => toggleAddon(name)}
              >
                {name}{price ? ` +${inr(price)}` : ""}
              </button>
            ))}
          </div>
        </>
      )}

      <label className="fl" htmlFor="order-cooking-note">
        Cooking note / special instruction
      </label>
      <textarea
        id="order-cooking-note"
        className="inp"
        rows={2}
        value={modal.note}
        placeholder="e.g. less oil, no onion"
        onChange={(event) => patchModal({ note: event.target.value })}
      />

      <label className="chk">
        <input
          type="checkbox"
          checked={modal.hold}
          onChange={(event) => patchModal({ hold: event.target.checked })}
        />
        Hold — don't fire to kitchen yet
      </label>
    </OrderModal>
  );
};

export default OrderOptionsModal;
