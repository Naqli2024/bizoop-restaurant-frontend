import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../../../assets/styles/back-office/inventory.css"
import { TABS, STOCK, PO_INIT, INDENT_INIT, KITCHEN_INIT, WASTAGE, MOVEMENTS, STORE_INIT, SUPPLIER, UNIT_COST } from "./InventoryData";

import { PlusIcon } from "./SharedInvent";
import WasteModal from "./modals/WasteModal";
import IndentModal from "./modals/IndentModal";
import IssueModal from "./modals/IssueModal";
import ReturnModal from "./modals/ReturnModal";
import GrnModal from "./modals/GrnModal";
import FlowTab from "./tabs/FlowTab";
import StockTab from "./tabs/StockTab";
import PoTab from "./tabs/PoTab";
import IssueTab from "./tabs/IssueTab";
import GrnTab from "./tabs/GrnTab";
import ConsumptionTab from "./tabs/ConsumptionTab";
import WasteTab from "./tabs/WasteTab";

const stamp = () =>
    new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }).toLowerCase();

export default function Inventory({
    onStoreCount = () => { },   // (itemId, value)
}) {
     const [searchParams] = useSearchParams();
    const [tab, setTab] = useState(
        searchParams.get("tab") || "flow"
    );
    const [pos, setPos] = useState(PO_INIT);
    const [indents, setIndents] = useState(INDENT_INIT);
    const [kitchen, setKitchen] = useState(KITCHEN_INIT);
    const [store, setStore] = useState(STORE_INIT);          // numeric store quantity per item
    const [wastage, setWastage] = useState(WASTAGE);
    const [movements, setMovements] = useState(MOVEMENTS);
    const [wasteOpen, setWasteOpen] = useState(false);
    const [indentOpen, setIndentOpen] = useState(false);
    const [issueId, setIssueId] = useState(null);            // indent being issued (null = closed)
    const [grns, setGrns] = useState([]);
    const [grnFor, setGrnFor] = useState(null);             // { mode, poId } while the GRN modal is open
    const [focusPos, setFocusPos] = useState([]);           // PO ids to highlight after clicking Order
    const [returnFor, setReturnFor] = useState(null);
     // { itemId, station } being returned (null = closed)

    /* ---------- wastage ---------- */
    const openWaste = () => setWasteOpen(true);
    const saveWaste = (entry) => {
        setWastage((l) => [...l, entry]);
        setMovements((m) => [
            {
                time: entry.time,
                type: "WASTE",
                tone: "danger",
                item: entry.item,
                qty: entry.qty,
                route: `${entry.where} → Waste`,
                ref: entry.reason,
            },
            ...m,
        ]);
        setWasteOpen(false);
    };

    /* ---------- indents & issue ---------- */
    const openIndent = () => setIndentOpen(true);
    const nextIndentId = () => `IND-${Math.max(0, ...indents.map((d) => Number(d.id.split("-")[1]) || 0)) + 1}`;

    // store -> station: reduce store stock and log one ISSUE movement per line
    const applyIssue = (id, station, lines) => {
        const time = stamp();
        setStore((s) => {
            const n = { ...s };
            lines.forEach((l) => (n[l.itemId] = +Math.max(0, (n[l.itemId] || 0) - l.qty).toFixed(2)));
            return n;
        });
        setMovements((m) => [
            ...lines.map((l) => {
                const it = STOCK.find((s) => s.id === l.itemId);
                return { time, type: "ISSUE", tone: "info", item: it.name, qty: `${l.qty} ${it.unit}`, route: `Store → ${station}`, ref: id };
            }),
            ...m,
        ]);
    };

    const saveIndent = ({ station, lines, issueNow }) => {
        const id = nextIndentId();
        const items = lines.map((l) => `${STOCK.find((s) => s.id === l.itemId).name} ${l.qty}`).join(", ");
        if (issueNow) applyIssue(id, station, lines);
        setIndents((l) => [
            { id, station, by: "Back office", items, lines, status: issueNow ? "issued" : "requested", issued: issueNow ? lines : undefined },
            ...l,
        ]);
        setIndentOpen(false);
    };

    const issuing = indents.find((d) => d.id === issueId);
    const confirmIssue = (lines) => {
        applyIssue(issuing.id, issuing.station, lines);
        setIndents((l) => l.map((d) => (d.id === issuing.id ? { ...d, status: "issued", issued: lines } : d)));
        setIssueId(null);
    };

    // "Received" by the kitchen adds the issued quantities to that station
    const setIndent = (id, status) => {
        const d = indents.find((x) => x.id === id);
        setIndents((l) => l.map((x) => (x.id === id ? { ...x, status } : x)));
        if (status === "received" && d?.issued) {
            d.issued.forEach((ln) =>
                setKitchen((k) => ({
                    ...k,
                    [ln.itemId]: { ...k[ln.itemId], [d.station]: +((Number(k[ln.itemId]?.[d.station]) || 0) + ln.qty).toFixed(2) },
                }))
            );
        }
    };

    /* ---------- reorder: Order button -> draft PO(s) -> PO tab ---------- */
    const tomorrow = () => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    };

    // itemId given  -> the row's Order button; no itemId -> "Draft POs from low stock" (every "Order TODAY" item)
    const draftPos = (itemId) => {
        const targets = typeof itemId === "string"
            ? STOCK.filter((s) => s.id === itemId)
            : STOCK.filter((s) => s.alert === "today");

        const focus = [];   // POs that already cover an item: just show them
        const fresh = [];   // items that still need a new draft
        targets.forEach((it) => {
            const open = pos.filter((p) => (p.status === "draft" || p.status === "sent") && p.items.includes(it.name));
            if (open.length) open.forEach((p) => focus.push(p.id));
            else fresh.push(it);
        });

        // one draft PO per supplier
        const groups = {};
        fresh.forEach((it) => {
            const sup = SUPPLIER[it.id] || "Other supplier";
            (groups[sup] = groups[sup] || []).push(it);
        });

        let n = Math.max(0, ...pos.map((p) => Number(p.id.split("-")[1]) || 0));
        const created = Object.entries(groups).map(([supplier, its]) => {
            const lines = its.map((it) => {
                const qty = Math.max(1, Math.ceil(parseFloat(it.min) * 2 - it.total));   // top up to 2 x minimum
                return { text: `${it.name} ${qty} ${it.unit}`, cost: qty * (UNIT_COST[it.id] || 0) };
            });
            return {
                id: `PO-${++n}`,
                supplier,
                expected: tomorrow(),
                items: lines.map((l) => l.text).join(", "),
                value: lines.reduce((a, l) => a + l.cost, 0),
                status: "draft",
            };
        });

        if (created.length) setPos((l) => [...created, ...l]);
        setFocusPos([...focus, ...created.map((p) => p.id)]);
        setTimeout(() => setFocusPos([]), 3000);
        setTab("po");
    };

    /* ---------- GRN (goods received note) ---------- */
    const openGrn = (mode = "po", poId = "") => setGrnFor({ mode, poId });

    const postGrn = (g) => {
        const id = `GRN-${Math.max(3000, ...grns.map((x) => Number(x.id.split("-")[1]) || 0)) + 1}`;
        const time = stamp();
        const accepted = (l) => +(l.rec - l.rej).toFixed(2);

        setGrns((l) => [{ ...g, id, time }, ...l]);
        if (g.poId) setPos((l) => l.map((p) => (p.id === g.poId ? { ...p, status: "received" } : p)));
        setStore((s) => {                                    // accepted goods enter the store
            const n = { ...s };
            g.lines.forEach((l) => { if (accepted(l) > 0) n[l.itemId] = +((n[l.itemId] || 0) + accepted(l)).toFixed(2); });
            return n;
        });
        setMovements((m) => [
            ...g.lines.filter((l) => accepted(l) > 0).map((l) => {
                const it = STOCK.find((s) => s.id === l.itemId);
                return { time, type: "RECEIPT", tone: "ok", item: it.name, qty: `${accepted(l)} ${it.unit}`, route: `${g.supplier} → Store`, ref: id };
            }),
            ...m,
        ]);
        setGrnFor(null);
    };

    /* ---------- return to store ---------- */
    const kitchenQty = (itemId, station) => Number(kitchen[itemId]?.[station]) || 0;
    const openReturn = (itemId, station) => {
        if (kitchenQty(itemId, station) > 0) setReturnFor({ itemId, station });   // nothing to return otherwise
    };
    const saveReturn = (qty) => {
        const { itemId, station } = returnFor;
        const it = STOCK.find((s) => s.id === itemId);
        setKitchen((k) => ({
            ...k,
            [itemId]: { ...k[itemId], [station]: +Math.max(0, kitchenQty(itemId, station) - qty).toFixed(2) },
        }));
        setStore((s) => ({ ...s, [itemId]: +((s[itemId] || 0) + qty).toFixed(2) }));
        setMovements((m) => [
            { time: stamp(), type: "RETURN", tone: "warn", item: it.name, qty: `${qty} ${it.unit}`, route: `${station} → Store`, ref: "Kitchen return" },
            ...m,
        ]);
        setReturnFor(null);
    };

    /* ---------- purchase orders & kitchen counts ---------- */
    const setPo = (id, status) => setPos((l) => l.map((p) => (p.id === id ? { ...p, status } : p)));
    const kCount = (id, station, v) =>
        setKitchen((k) => ({ ...k, [id]: { ...k[id], [station]: v === "" ? "" : Number(v) } }));

    const openPo = pos.filter((p) => p.status === "sent").length;
    const draftPo = pos.filter((p) => p.status === "draft").length;
    const waiting = indents.filter((d) => d.status === "requested").length;

    const pipeline = [
        { title: "Reorder", sub: "8 to order today", tab: "stock" },
        { title: "Purchase order", sub: `${openPo} open · ${draftPo} draft`, tab: "po" },
        { title: "GRN", sub: `${grns.length} received today`, tab: "grn" },
        { title: "Store", sub: "₹28,717", tab: "stock" },
        { title: "Indent & issue", sub: `${waiting} waiting`, tab: "issue" },
        { title: "Kitchen", sub: "₹9,998", tab: "issue" },
        { title: "Consumption", sub: "0 sales today", tab: "cons" },
        { title: "Waste & counts", sub: `${wastage.length} logged today`, tab: "waste" },
    ];

    return (
        <section className="inv-panel">
            <header className="inv-head">
                <span className="inv-title">
                    📦 Inventory
                    <span className="inv-flow-badge">reorder → PO → GRN → store → kitchen → consumption</span>
                </span>
                <div className="inv-actions">
                    <button className="inv-btn inv-btn--sm" onClick={openWaste}>Log wastage</button>
                    <button className="inv-btn inv-btn--sm" onClick={openIndent}><PlusIcon />Indent</button>
                    <button className="inv-btn inv-btn--sm inv-btn--primary" onClick={() => openGrn("po")}><PlusIcon />GRN</button>
                </div>
            </header>

            <nav className="inv-tabs">
                {TABS.map((t) => (
                    <button key={t.id} className={`inv-tab${tab === t.id ? " is-active" : ""}`} onClick={() => setTab(t.id)}>
                        {t.label}
                    </button>
                ))}
            </nav>

            <div className="inv-scroll">
                {tab === "flow" && <FlowTab pipeline={pipeline} go={setTab} movements={movements} />}
                {tab === "stock" && <StockTab onOrder={draftPos} onCount={onStoreCount} />}
                {tab === "po" && <PoTab pos={pos} setPo={setPo} onDraft={draftPos} highlight={focusPos} onReceive={(id) => openGrn("po", id)} />}
                {tab === "grn" && <GrnTab grns={grns} onReceive={openGrn} />}
                {tab === "issue" && (
                    <IssueTab indents={indents} setIndent={setIndent} onIssue={setIssueId} onNewIndent={openIndent}
                        kitchen={kitchen} onKCount={kCount} onReturn={openReturn} />
                )}
                {tab === "cons" && <ConsumptionTab />}
                {tab === "waste" && <WasteTab entries={wastage} onLog={openWaste} />}
            </div>

            {wasteOpen && <WasteModal onClose={() => setWasteOpen(false)} onSave={saveWaste} />}
            {indentOpen && <IndentModal kitchen={kitchen} store={store} onClose={() => setIndentOpen(false)} onSave={saveIndent} />}
            {grnFor && (
                <GrnModal mode={grnFor.mode} poId={grnFor.poId} pos={pos} onClose={() => setGrnFor(null)} onPost={postGrn} />
            )}
            {returnFor && (
                <ReturnModal itemId={returnFor.itemId} station={returnFor.station}
                    max={kitchenQty(returnFor.itemId, returnFor.station)}
                    onClose={() => setReturnFor(null)} onSave={saveReturn} />
            )}
            {issuing && <IssueModal indent={issuing} store={store} onClose={() => setIssueId(null)} onConfirm={confirmIssue} />}
        </section>
    );
}
