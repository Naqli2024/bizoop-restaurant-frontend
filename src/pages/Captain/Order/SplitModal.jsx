
import OrderModal from "./OrderModal";
import { inr } from "./OrderHelpers";

const SplitModal = ({
  modal,
  live,
  freeTables,
  patchModal,
  closeModal,
  doSplit,
}) => {
  if (!modal) return null;

  return (
    <OrderModal
      title="✂ Split order"
      size="md"
      onClose={closeModal}
      footer={
        <>
          <button type="button" className="btn" onClick={closeModal}>
            Cancel
          </button>
          <button type="button" className="btn modal-ok" onClick={doSplit}>
            Split
          </button>
        </>
      }
    >
      <p>Select the items to move to another table.</p>

      {live.map((item) => (
        <label className="chk split-row" key={item.uid}>
          <input
            type="checkbox"
            checked={!!modal.sel[item.uid]}
            onChange={(event) =>
              patchModal({
                sel: {
                  ...modal.sel,
                  [item.uid]: event.target.checked,
                },
              })
            }
          />

          {item.qty}× {item.name}
          <span className="right">{inr(item.price * item.qty)}</span>
        </label>
      ))}

      <div className="fl">Move to table</div>

      <div className="row wrap">
        {freeTables.map((table) => (
          <button
            type="button"
            key={table}
            className={`chip ${modal.to === table ? "sel" : ""}`}
            onClick={() => patchModal({ to: table })}
          >
            {table}
          </button>
        ))}
      </div>
    </OrderModal>
  );
};

export default SplitModal;
