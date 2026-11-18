import { useMemo } from "react";
import { COUNTRIES } from "./DataSet";
import { Button, Card, NumberField, SelectField, TextField } from "./UiSet";

const TAX_TYPES = [
  { value: "GST", label: "GST (CGST + SGST)" },
  { value: "IGST", label: "IGST (one line)" },
  { value: "VAT", label: "VAT" },
  { value: "NONE", label: "No tax" },
];
export default function TaxTab({ org, tax, update, changeCountry }) {
  const country = COUNTRIES[org.country] ?? COUNTRIES.IN;

  const lines = useMemo(() => {
    const rate = Number(tax.rate) || 0;
    const fmt = (n) => `${country.cur}${n.toFixed(2)}`;
    if (tax.type === "GST") return [[`CGST ${rate / 2}%`, fmt(rate / 2)], [`SGST ${rate / 2}%`, fmt(rate / 2)]];
    if (tax.type === "IGST") return [[`IGST ${rate}%`, fmt(rate)]];
    if (tax.type === "VAT") return [[`VAT ${rate}%`, fmt(rate)]];
    return [["No tax", fmt(0)]];
  }, [tax.type, tax.rate, country.cur]);

  return (
    <div className="stg-grid">
      <Card title={`Tax for ${country.name}`}>
        <SelectField label="Tax type" value={tax.type} options={TAX_TYPES} onChange={(v) => update("tax", { type: v })} />
        <NumberField
          label="Standard rate %"
          min={0}
          max={30}
          step={0.5}
          value={tax.rate}
          onChange={(v) => update("tax", { rate: v })}
        />
        <TextField label={country.idLabel} value={org.taxId} onChange={(v) => update("org", { taxId: v })} />
        <Button onClick={() => changeCountry(org.country)}>Use {country.name} defaults</Button>
      </Card>

      <Card title={`On the bill, for a ${country.cur}100 sale`}>
        {lines.map(([label, amount]) => (
          <div className="stg-line" key={label}>
            <span>{label}</span>
            <span>{amount}</span>
          </div>
        ))}
        <p className="stg-hint">
          Menu items at the standard rate follow this setting; items set to another rate keep theirs. Currency follows the country.
        </p>
        {org.country === "IN" && (
          <p className="stg-hint">
            Standalone restaurants charge 5% GST without input credit. Restaurants inside hotels with room tariff above ₹7,500 charge 18% with credit. Alcohol sits outside GST.
          </p>
        )}
      </Card>
    </div>
  );
}
