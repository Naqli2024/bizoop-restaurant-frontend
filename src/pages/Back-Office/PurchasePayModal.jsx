import { useState } from "react";
import { X, CreditCard } from "lucide-react";

const PurchasePayModal = ({ bill, onClose, onPay }) => {
    const due = Number(bill.amount) - Number(bill.paid);

    const [amount, setAmount] = useState(due);
    const [mode, setMode] = useState("Cash");

    const handleSubmit = (e) => {
        e.preventDefault();

        const paymentAmount = Number(amount);

        if (paymentAmount <= 0 || paymentAmount > due) {

            return;
        }

        onPay({
            billId: bill.id,
            amount: paymentAmount,
            mode,
        });
    };

    return (
        <div
            className="purchase-pay-backdrop"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                className="purchase-pay-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="purchase-pay-title"
            >
                <div className="purchase-pay-header">
                    <h3 id="purchase-pay-title">Pay {bill.vendor}</h3>

                    <button
                        type="button"
                        className="purchase-pay-close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="purchase-pay-body">
                        <label>
                            Amount (due ₹{due.toLocaleString("en-IN")})
                            <input
                                type="number"
                                min="1"
                                max={due}
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </label>

                        <label>
                            Mode
                            <select
                                value={mode}
                                onChange={(e) => setMode(e.target.value)}
                            >
                                <option>Cash</option>
                                <option>UPI</option>
                                <option>Bank transfer</option>
                            </select>
                        </label>
                    </div>

                    <div className="purchase-pay-footer">
                        <button
                            type="button"
                            className="purchase-pay-cancel"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button type="submit" className="purchase-pay-submit">
                            <CreditCard size={16} />
                            Pay &amp; issue voucher
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PurchasePayModal;