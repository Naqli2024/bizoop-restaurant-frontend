import { useState } from "react";
import {
    Plus,
    CreditCard,
    Pencil,
} from "lucide-react";
import '../../assets/styles/backoffice.css';
import PurchaseModal from "./PurchaseModal";
import PurchasePayModal from "./PurchasePayModal";
const INITIAL_PURCHASES = [
    {
        id: "PB-001",
        vendor: "Sri Lakshmi Traders",
        item: "50 × Basmati Rice",
        amount: 6195,
        paid: 6195,
        mode: "Credit",
        sister: false,
    },
    {
        id: "PB-002",
        vendor: "Sister Concern – Central Kitchen",
        item: "30 × Chicken",
        amount: 6000,
        paid: 2000,
        mode: "Credit",
        sister: true,
    },
];

const getTodayDate = () => new Date().toISOString().split("T")[0];
const formatCurrency = (amount) =>
    `₹${amount.toLocaleString("en-IN")}`;

function BackOffice() {
    const [purchases, setPurchases] = useState(INITIAL_PURCHASES);
    const [activeTab, setActiveTab] = useState("all");
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [selectedPayBill, setSelectedPayBill] = useState(null);

    const handlePay = ({ billId, amount, mode }) => {
        setPurchases((prev) =>
            prev.map((bill) =>
                bill.id === billId
                    ? {
                        ...bill,
                        paid: Number(bill.paid) + amount,
                        mode,
                    }
                    : bill
            )
        );

        setSelectedPayBill(null);
    };

    const totalPurchases = purchases.reduce(
        (sum, bill) => sum + bill.amount,
        0
    );

    const totalPaid = purchases.reduce(
        (sum, bill) => sum + bill.paid,
        0
    );

    const totalDue = purchases.reduce(
        (sum, bill) => sum + bill.amount - bill.paid,
        0
    );

    const sisterTotal = purchases
        .filter((bill) => bill.sister)
        .reduce((sum, bill) => sum + bill.amount, 0);

    const filteredPurchases = purchases.filter((bill) => {
        if (activeTab === "sister") return bill.sister;
        if (activeTab === "credit") return bill.amount > bill.paid;
        return true;
    });

    const handlePurchase = (purchase) => {
        setPurchases((prev) => {
            const nextNumber =
                prev.reduce((max, bill) => {
                    const number = Number(bill.id.replace("PB-", ""));
                    return Math.max(max, number);
                }, 0) + 1;

            const newPurchase = {
                ...purchase,
                id: `PB-${String(nextNumber).padStart(3, "0")}`,
            };

            return [newPurchase, ...prev];
        });

        setShowPurchaseModal(false);
    };

    return (
        <div className="isPurchase">
            <div className="isPurchase-header">
                <div className="isPurchase-heading">
                    <h2>Purchase</h2>
                    <span className="isPurchase-badge">
                        Bills · Sister concern · Credit
                    </span>
                </div>

                <button
                    className="isPurchase-btn isPurchase-btn-primary"
                    onClick={() => setShowPurchaseModal(true)}
                >
                    <Plus size={16} />
                    Purchase bill
                </button>
            </div>

            <div className="isPurchase-tabs">
                <button
                    className={activeTab === "all" ? "active" : ""}
                    onClick={() => setActiveTab("all")}
                >
                    All bills
                </button>

                <button
                    className={activeTab === "sister" ? "active" : ""}
                    onClick={() => setActiveTab("sister")}
                >
                    Sister concern
                </button>

                <button
                    className={activeTab === "credit" ? "active" : ""}
                    onClick={() => setActiveTab("credit")}
                >
                    <Pencil size={14} />
                    Credit / payables
                </button>
            </div>

            <div className="isPurchase-content">
                <div className="isPurchase-summary">
                    <div className="isPurchase-card">
                        <span>Total purchases</span>
                        <strong>{formatCurrency(totalPurchases)}</strong>
                    </div>

                    <div className="isPurchase-card payable">
                        <span>Payable (credit)</span>
                        <strong>{formatCurrency(totalDue)}</strong>
                    </div>

                    <div className="isPurchase-card sister">
                        <span>From sister concern</span>
                        <strong>{formatCurrency(sisterTotal)}</strong>
                    </div>

                    <div className="isPurchase-card bills">
                        <span>Bills</span>
                        <strong>{purchases.length}</strong>
                    </div>
                </div>

                <div className="isPurchase-table-wrapper">
                    <table className="isPurchase-table">
                        <thead>
                            <tr>
                                <th>Bill</th>
                                <th>Date</th>
                                <th>Vendor</th>
                                <th>Item</th>
                                <th className="num">Amount</th>
                                <th className="num">Paid</th>
                                <th className="num">Due</th>
                                <th>Mode</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredPurchases.map((bill) => {
                                const due = bill.amount - bill.paid;

                                return (
                                    <tr key={bill.id}>
                                        <td className="isPurchase-bill-id">
                                            {bill.id}
                                        </td>

                                        <td>{getTodayDate()}</td>

                                        <td>
                                            <div className="isPurchase-vendor">
                                                {bill.vendor}
                                                {bill.sister && (
                                                    <span className="isPurchase-tag">
                                                        Sister
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        <td>{bill.item}</td>

                                        <td className="num">
                                            {formatCurrency(bill.amount)}
                                        </td>

                                        <td className="num">
                                            {formatCurrency(bill.paid)}
                                        </td>

                                        <td
                                            className={`num ${due === 0 ? "isPurchase-settled-due" : "isPurchase-due"
                                                }`}
                                        >
                                            {formatCurrency(due)}
                                        </td>

                                        <td>
                                            <span className="isPurchase-mode">
                                                {bill.mode}
                                            </span>
                                        </td>

                                        <td>
                                            {due > 0 ? (
                                                <button
                                                    className="isPurchase-pay-btn"
                                                    onClick={() => setSelectedPayBill(bill)}
                                                >
                                                    <CreditCard size={14} />
                                                    Pay
                                                </button>
                                            ) : (
                                                <span className="isPurchase-paid-label">
                                                    Settled
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}

                            {filteredPurchases.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="9"
                                        className="isPurchase-empty"
                                    >
                                        No purchase bills found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {showPurchaseModal && (
                <PurchaseModal
                    onClose={() => setShowPurchaseModal(false)}
                    onSave={handlePurchase}
                />
            )}
            {selectedPayBill && (
                <PurchasePayModal
                    bill={selectedPayBill}
                    onClose={() => setSelectedPayBill(null)}
                    onPay={handlePay}
                />
            )}
        </div>
    );
}

export default BackOffice;
