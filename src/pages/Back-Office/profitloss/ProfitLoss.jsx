import { useState } from "react";
import "../../../assets/styles/back-office/profitloss.css"

const inr = (n) => `₹${n.toLocaleString("en-IN")}`;
const pct = (n, base) => `${((n / base) * 100).toFixed(1)}%`;

const DATA = {
    netSales: 98064,
    cogs: 22484,
    expenses: [
        { label: "Salaries & wages (paid vouchers)", amount: 42000 },
        { label: "Rent", amount: 85000 },
        { label: "Gas / LPG", amount: 10800 },
    ],
    memo: {
        discounts: 1354,
        purchases: 15765,
        sisterConcern: 6000,
        creditPayable: 10195,
    },
};

export default function ProfitLoss() {

    const [data, setData] = useState(DATA);
    const { netSales, cogs, expenses, memo } = data;

    const grossProfit = netSales - cogs;
    const operatingCost = expenses.reduce((sum, e) => sum + e.amount, 0);
    const netProfit = grossProfit - operatingCost;
    const profitTone = netProfit >= 0 ? "pl-tone-gain" : "pl-tone-loss";

    const rows = [
        { label: "Net sales (ex-GST, POS bills)", value: netSales, strong: true },
        { label: "Less: cost of goods sold (recipe SOP × sales)", value: -cogs },
        { label: "Gross profit", value: grossProfit, strong: true, tone: "pl-tone-gain" },
        ...expenses.map((e) => ({ label: e.label, value: -e.amount })),
        { label: "Net profit / (loss)", value: netProfit, strong: true, tone: profitTone },
    ];

    return (
        <section className="pl-page">
            <header className="pl-head">
                <h1 className="pl-head__title">
                    <span aria-hidden="true">📊</span> Profit &amp; Loss
                    <span className="pl-head__tag">recipe-based COGS</span>
                </h1>
            </header>

            <div className="pl-body">
                <div className="pl-stats">
                    <div className="pl-stat">
                        <div className="pl-stat__label">Net sales</div>
                        <div className="pl-stat__value">{inr(netSales)}</div>
                    </div>
                    <div className="pl-stat">
                        <div className="pl-stat__label">Gross profit</div>
                        <div className="pl-stat__value pl-tone-gain">{inr(grossProfit)}</div>
                    </div>
                    <div className="pl-stat">
                        <div className="pl-stat__label">Operating cost</div>
                        <div className="pl-stat__value pl-tone-warn">{inr(operatingCost)}</div>
                    </div>
                    <div className="pl-stat">
                        <div className="pl-stat__label">Net profit</div>
                        <div className={`pl-stat__value ${profitTone}`}>{inr(netProfit)}</div>
                    </div>
                </div>

                <div className="pl-split">
                    <div className="pl-ledger">
                        <table className="pl-ledger__table">
                            <thead>
                                <tr>
                                    <th>Particulars</th>
                                    <th className="pl-cell--right">Amount</th>
                                    <th className="pl-cell--right">% of sales</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((r) => (
                                    <tr key={r.label}>
                                        <td className={r.strong ? "pl-cell--strong" : ""}>{r.label}</td>
                                        <td
                                            className={`pl-cell--right pl-cell--mono ${r.strong ? "pl-cell--strong" : ""
                                                } ${r.tone || ""}`}
                                        >
                                            {inr(r.value)}
                                        </td>
                                        <td className="pl-cell--right pl-cell--mono pl-cell--dim">
                                            {pct(r.value, netSales)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <aside className="pl-memo">
                        <h2 className="pl-memo__title">Memo</h2>
                        <ul className="pl-memo__list">
                            <li>
                                Discounts given: <b>{inr(memo.discounts)}</b>
                            </li>
                            <li>
                                Purchases booked: <b>{inr(memo.purchases)}</b>
                            </li>
                            <li>
                                Of which sister concern: <b>{inr(memo.sisterConcern)}</b>
                            </li>
                            <li>
                                Credit payable: <b className="pl-tone-loss">{inr(memo.creditPayable)}</b>
                            </li>
                        </ul>
                    </aside>
                </div>
            </div>
        </section>
    );
}
