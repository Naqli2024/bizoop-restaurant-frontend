
import { STATE_LABEL, STATE_CLASS } from "./OrderData";
import { inr, noteOf, pad4 } from "./OrderHelpers";

const CartRow = ({
  i,
  onQty,
  onHold,
  onRemove,
  onModify,
  onCancel,
}) => {
  const status =
    i.state === "void"
      ? "void"
      : !i.sent && i.hold
        ? "hold"
        : i.state;

  const canEditSent =
    i.sent && i.state !== "void" && i.state !== "served";

  return (
    <div className={`ci ${i.state === "void" ? "void" : ""}`}>
      <div className="ci-info">
        <div className="ci-name">
          {i.name}{" "}
          <span className={`st st-${STATE_CLASS[status] || status}`}>
            {STATE_LABEL[status] || status}
          </span>
        </div>

        <div className="ci-meta">
          {noteOf(i) || "\u00A0"}
          {i.kot ? ` · KOT-${pad4(i.kot)}` : ""}
        </div>
      </div>

      <div className="ci-right">
        <div className="qty-ctrl">
          {!i.sent && (
            <button type="button" className="mini" onClick={() => onQty(i.uid, -1)}>
              −
            </button>
          )}

          <span className="qn">{i.qty}</span>

          {!i.sent && (
            <button type="button" className="mini" onClick={() => onQty(i.uid, 1)}>
              +
            </button>
          )}
        </div>

        <div className="ci-total">{inr(i.price * i.qty)}</div>
      </div>

      <div className="ci-act">
        {!i.sent && (
          <>
            <button type="button" className="mini" onClick={() => onHold(i.uid)}>
              {i.hold ? "▶" : "⏸"}
            </button>
            <button type="button" className="mini" onClick={() => onRemove(i.uid)}>
              ✕
            </button>
          </>
        )}

        {canEditSent && (
          <>
            <button type="button" className="mini" onClick={() => onModify(i)}>
              ✎
            </button>
            <button type="button" className="mini" onClick={() => onCancel(i)}>
              ✕
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CartRow;
