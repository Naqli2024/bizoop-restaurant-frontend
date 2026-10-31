import { useState } from "react";
import { X } from "lucide-react";

const VENDORS = [
  "Sri Lakshmi Traders",
  "Fresh Poultry Co.",
  "Aavin Dairy",
  "Sakthi Masala",
  "Kumbakonam Coffee",
  "Koyambedu Market",
  "Kasimedu Fish Mkt",
  "PackWell",
  "Sister Concern - Central Kitchen",
  "Sister Concern - Dairy Unit",
];

const ITEMS = [
  { value: "rice", label: "Basmati Rice" },
  { value: "chk", label: "Chicken" },
  { value: "mut", label: "Mutton" },
  { value: "pan", label: "Paneer" },
  { value: "mas", label: "Biryani Masala" },
  { value: "oil", label: "Cooking Oil" },
  { value: "cur", label: "Curd" },
  { value: "flr", label: "Wheat Flour (Maida)" },
  { value: "mlk", label: "Milk" },
  { value: "cof", label: "Coffee Decoction" },
  { value: "onn", label: "Onion" },
  { value: "tom", label: "Tomato" },
  { value: "fsh", label: "Seer Fish" },
  { value: "btr", label: "Butter" },
  { value: "egg", label: "Eggs" },
  { value: "pkg", label: "Packaging Box" },
];


const PurchaseModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    vendor: "Sri Lakshmi Traders",
    item: "rice",
    quantity: 10,
    rate: 100,
    gst: 0,
    payment: "Cash",
  });

  const updateForm = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const amount = Number(form.quantity) * Number(form.rate);
  const gstAmount = (amount * Number(form.gst)) / 100;
  const total = amount + gstAmount;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (Number(form.quantity) <= 0 || Number(form.rate) < 0) {
      return;
    }

    const purchase = {
      id: `PB-${Date.now()}`,
      vendor: form.vendor,
      item: `${form.quantity} × ${
        ITEMS.find((item) => item.value === form.item)?.label
      }`,
      amount: total,
      paid: form.payment === "Credit" ? 0 : total,
      mode: form.payment,
      sister: form.vendor.startsWith("Sister Concern"),
    };

    onSave(purchase);
    onClose();
  };

  return (
    <div className="purchase-modal-overlay" onClick={onClose}>
      <div
        className="purchase-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="purchase-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="purchase-modal-header">
          <h3 id="purchase-modal-title">New purchase bill</h3>

          <button
            type="button"
            className="purchase-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="purchase-modal-body">
            <div className="purchase-modal-grid">
              <label>
                Vendor
                <select
                  name="vendor"
                  value={form.vendor}
                  onChange={updateForm}
                >
                  {VENDORS.map((vendor) => (
                    <option key={vendor} value={vendor}>
                      {vendor}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Item
                <select name="item" value={form.item} onChange={updateForm}>
                  {ITEMS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Quantity
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  value={form.quantity}
                  onChange={updateForm}
                  required
                />
              </label>

              <label>
                Rate / unit (₹)
                <input
                  type="number"
                  name="rate"
                  min="0"
                  step="0.01"
                  value={form.rate}
                  onChange={updateForm}
                  required
                />
              </label>

              <label>
                GST %
                <select name="gst" value={form.gst} onChange={updateForm}>
                  {[0, 5, 12, 18].map((gst) => (
                    <option key={gst} value={gst}>
                      {gst}%
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Payment
                <select
                  name="payment"
                  value={form.payment}
                  onChange={updateForm}
                >
                  {["Cash", "UPI", "Bank transfer", "Credit"].map(
                    (payment) => (
                      <option key={payment} value={payment}>
                        {payment}
                      </option>
                    )
                  )}
                </select>
              </label>
            </div>
          </div>

          <div className="purchase-modal-footer">
            <button
              type="button"
              className="purchase-modal-cancel"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className="purchase-modal-submit">
              Book bill &amp; add to store
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default PurchaseModal;