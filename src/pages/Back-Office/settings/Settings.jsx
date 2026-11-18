import { useEffect, useMemo, useRef, useState } from "react";
import "../../../assets/styles/back-office/setting.css"
import { COUNTRIES, INITIAL, STORAGE_KEY, TABS } from "./DataSet";
import OrgTab from "./OrgTab";
import TaxTab from "./TaxTab";
import BrandTab from "./BrandTab";
import PrintTab from "./PrintTab";

function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? { ...INITIAL, ...JSON.parse(raw) } : INITIAL;
    } catch {
        return INITIAL;
    }
}

export default function Settings() {
    const [state, setState] = useState(loadState);
    const [toast, setToast] = useState("");
    const toastTimer = useRef(null);

    const { tab, org, tax, brand, receipt, kot, printers } = state;

    /* ---------- side effects ---------- */
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch {
            /* storage unavailable – ignore */
        }
    }, [state]);



    useEffect(() => () => clearTimeout(toastTimer.current), []);

    /* ---------- shared actions passed to tabs ---------- */
    const notify = (msg) => {
        setToast(msg);
        clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToast(""), 2200);
    };

    const update = (section, patch) =>
        setState((s) => ({ ...s, [section]: { ...s[section], ...patch } }));

    const updatePrinter = (id, patch) =>
        setState((s) => ({
            ...s,
            printers: s.printers.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        }));

    const changeCountry = (code) => {
        const c = COUNTRIES[code];
        setState((s) => ({
            ...s,
            org: { ...s.org, country: code, fy: c.fy, tz: c.tz },
            tax: { type: c.tax, rate: c.rate },
        }));
    };

    const progress = useMemo(() => {
        const checks = [
            org.legal, org.trade, org.phone, org.email,
            org.taxId, org.addr, org.fssai,
            org.outlets.length > 0, org.team.length > 0,
            brand.logo, receipt.hdr, org.done,
        ];
        return Math.round((checks.filter(Boolean).length / checks.length) * 100);
    }, [org, brand.logo, receipt.hdr]);

    /* ---------- data actions (used by OrgTab review step) ---------- */
    const exportSettings = () => {
        const { tab: _tab, ...data } = state;
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "bizoop-settings.json";
        a.click();
        URL.revokeObjectURL(url);
        notify("Settings exported");
    };

    const importSettings = (e) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const data = JSON.parse(reader.result);
                setState((s) => ({ ...INITIAL, ...data, tab: s.tab }));
                notify("Settings imported");
            } catch {
                notify("That file is not valid settings JSON");
            }
        };
        reader.readAsText(file);
    };

    const resetSettings = () => {
        if (window.confirm("Reset all settings to their defaults?")) {
            setState(INITIAL);
            notify("Settings reset");
        }
    };

    /* ---------- render ---------- */
    return (
        <div className="stg-panel">
            <header className="stg-header">
                <h2 className="stg-header__title">
                    <span aria-hidden="true">⚙</span> Settings
                    <span className="stg-badge">organisation ready</span>
                </h2>
            </header>

            <div className="stg-tabs" role="tablist">
                {TABS.map((t) => (
                    <button
                        key={t.id}
                        type="button"
                        role="tab"
                        aria-selected={tab === t.id}
                        className={`stg-tabs__item${tab === t.id ? " stg-tabs__item--active" : ""}`}
                        onClick={() => setState((s) => ({ ...s, tab: t.id }))}
                    >
                        {t.label}
                    </button>
                ))}
            </div>
            <div className="stg-scroll">
                <div className="stg-body">
                    {tab === "org" && (
                        <OrgTab
                            org={org}
                            tax={tax}
                            progress={progress}
                            update={update}
                            changeCountry={changeCountry}
                            onExport={exportSettings}
                            onImport={importSettings}
                            onReset={resetSettings}
                            notify={notify}
                        />
                    )}
                    {tab === "tax" && <TaxTab org={org} tax={tax} update={update} changeCountry={changeCountry} />}
                    {tab === "brand" && <BrandTab brand={brand} tradeName={org.trade} update={update} />}
                    {tab === "print" && (
                        <PrintTab
                            receipt={receipt}
                            kot={kot}
                            printers={printers}
                            org={org}
                            brand={brand}
                            update={update}
                            updatePrinter={updatePrinter}
                            notify={notify}
                        />
                    )}
                </div>
            </div>
            {toast && <div className="stg-toast" role="status">{toast}</div>}
        </div>
    );
}
