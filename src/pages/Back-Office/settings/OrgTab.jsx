import { useRef } from "react";
import { COUNTRIES, ENTITY_TYPES, MONTHS, ROLES, STEPS } from "./DataSet";
import { Button, Card, SelectField, TextField } from "./UiSet";

export default function OrgTab({ org, tax, progress, update, changeCountry, onExport, onImport, onReset, notify }) {
  const importRef = useRef(null);
  const country = COUNTRIES[org.country] ?? COUNTRIES.IN;

  const setOrg = (patch) => update("org", patch);
  const setStep = (step) => setOrg({ step: Math.max(0, Math.min(STEPS.length - 1, step)) });

  const listChange = (key, index, patch) =>
    setOrg({ [key]: org[key].map((row, i) => (i === index ? { ...row, ...patch } : row)) });
  const listAdd = (key, blank) => setOrg({ [key]: [...org[key], blank] });
  const listRemove = (key, index) => setOrg({ [key]: org[key].filter((_, i) => i !== index) });

  return (
    <>
      <nav className="stg-stepper" aria-label="Setup steps">
        {STEPS.map((label, i) => {
          const cls =
            i === org.step ? "stg-stepper__item stg-stepper__item--current"
            : i < org.step ? "stg-stepper__item stg-stepper__item--done"
            : "stg-stepper__item";
          return (
            <button key={label} type="button" className={cls} onClick={() => setStep(i)}>
              {label}
            </button>
          );
        })}
      </nav>

      <Card>
        {org.step === 0 && (
          <div className="stg-grid">
            <TextField label="Legal name" value={org.legal} placeholder="Registered company name" onChange={(v) => setOrg({ legal: v })} />
            <TextField label="Trading name (printed on bills)" value={org.trade} onChange={(v) => setOrg({ trade: v })} />
            <SelectField label="Entity type" value={org.entity} options={ENTITY_TYPES} onChange={(v) => setOrg({ entity: v })} />
            <TextField label="Phone" type="tel" value={org.phone} onChange={(v) => setOrg({ phone: v })} />
            <TextField label="Email" type="email" value={org.email} onChange={(v) => setOrg({ email: v })} />
            <TextField label="Website" value={org.web} onChange={(v) => setOrg({ web: v })} />
          </div>
        )}

        {org.step === 1 && (
          <>
            <div className="stg-grid">
              <SelectField
                label="Country"
                value={org.country}
                options={Object.entries(COUNTRIES).map(([value, c]) => ({ value, label: c.name }))}
                onChange={changeCountry}
              />
              <TextField label={country.idLabel} value={org.taxId} onChange={(v) => setOrg({ taxId: v })} />
              <TextField label="Registered address" value={org.addr} onChange={(v) => setOrg({ addr: v })} />
              {org.country === "IN" && (
                <TextField label="FSSAI licence number" value={org.fssai} onChange={(v) => setOrg({ fssai: v })} />
              )}
              <SelectField label="Financial year starts" value={org.fy} options={MONTHS} onChange={(v) => setOrg({ fy: v })} />
              <TextField label="Time zone" value={org.tz} onChange={(v) => setOrg({ tz: v })} />
            </div>
            <p className="stg-hint">
              Changing the country resets the tax type, rate and financial year to that country's defaults. Check them under Tax.
            </p>
          </>
        )}

        {org.step === 2 && (
          <>
            {org.outlets.map((o, i) => (
              <div className="stg-row stg-row--gap" key={i}>
                <input className="stg-input" placeholder="Name" value={o.name} onChange={(e) => listChange("outlets", i, { name: e.target.value })} />
                <input className="stg-input" placeholder="City" value={o.city} onChange={(e) => listChange("outlets", i, { city: e.target.value })} />
                <input className="stg-input stg-input--narrow" type="number" min="0" placeholder="Seats" value={o.seats} onChange={(e) => listChange("outlets", i, { seats: Number(e.target.value) })} />
                <Button icon="trash" onClick={() => listRemove("outlets", i)}>Remove</Button>
              </div>
            ))}
            <Button variant="primary" icon="plus" onClick={() => listAdd("outlets", { name: "", city: "", seats: 0 })}>Add outlet</Button>
          </>
        )}

        {org.step === 3 && (
          <>
            {org.team.map((m, i) => (
              <div className="stg-row stg-row--gap" key={i}>
                <input className="stg-input" placeholder="Name" value={m.name} onChange={(e) => listChange("team", i, { name: e.target.value })} />
                <select className="stg-input" value={m.role} onChange={(e) => listChange("team", i, { role: e.target.value })}>
                  {ROLES.map((r) => <option key={r}>{r}</option>)}
                </select>
                <input className="stg-input" type="tel" placeholder="Mobile" value={m.mobile} onChange={(e) => listChange("team", i, { mobile: e.target.value })} />
                <Button icon="trash" onClick={() => listRemove("team", i)}>Remove</Button>
              </div>
            ))}
            <Button variant="primary" icon="plus" onClick={() => listAdd("team", { name: "", role: "Cashier", mobile: "" })}>Add team member</Button>
          </>
        )}

        {org.step === 4 && (
          <div className="stg-grid">
            <Card title="Summary">
              <div className="stg-summary">
                <span>{org.trade || "—"}</span>
                <span>{country.name} · {tax.type} ({tax.rate}%) · {country.idLabel} {org.taxId || "—"}</span>
                <span>{org.outlets.length} outlet(s) · {org.team.length} team member(s)</span>
                <span>Setup {progress}% complete</span>
              </div>
            </Card>
            <Card title="Data">
              <div className="stg-row stg-row--wrap">
                <Button icon="download" onClick={onExport}>Export settings</Button>
                <Button onClick={() => importRef.current?.click()}>Import settings</Button>
                <input ref={importRef} type="file" accept=".json" hidden onChange={onImport} />
                <Button variant="danger" onClick={onReset}>Reset</Button>
              </div>
              <p className="stg-hint">
                Exports organisation, tax, branding, printing and IoT setup as JSON. Sales and stock data in this prototype are demo data.
              </p>
            </Card>
          </div>
        )}

        <div className="stg-row stg-row--between stg-row--top">
          <Button disabled={org.step === 0} onClick={() => setStep(org.step - 1)}>Back</Button>
          {org.step < STEPS.length - 1 ? (
            <Button variant="primary" onClick={() => setStep(org.step + 1)}>Next</Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => { setOrg({ done: true }); notify("Organisation setup saved"); }}
            >
              Finish setup
            </Button>
          )}
        </div>
      </Card>
    </>
  );
}
