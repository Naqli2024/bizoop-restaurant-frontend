import { useRef } from "react";
import { FONTS, SWATCHES } from "./DataSet";
import { Button, Card, SelectField, TextField } from "./UiSet";

export default function BrandTab({ brand, tradeName, update }) {
  const logoRef = useRef(null);
  const setBrand = (patch) => update("brand", patch);

  const uploadLogo = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setBrand({ logo: reader.result });
    reader.readAsDataURL(file);
  };

  return (
    <div className="stg-grid">
      <Card title="Brand">
        <div className="stg-row stg-row--gap">
          <div className="stg-logo">
            {brand.logo ? <img src={brand.logo} alt="Logo preview" /> : "No logo"}
          </div>
          <div>
            <Button variant="primary" icon="upload" onClick={() => logoRef.current?.click()}>Upload logo</Button>
            <input ref={logoRef} type="file" accept="image/*" hidden onChange={uploadLogo} />
            <p className="stg-hint">PNG or JPG. Shown in the top bar and on receipts.</p>
          </div>
        </div>
        <TextField
          label="Name printed on receipts"
          value={brand.name}
          placeholder={tradeName || "Spice Route"}
          onChange={(v) => setBrand({ name: v })}
        />
      </Card>

      <Card title="Layout">
        <span className="stg-field__label">Brand colour</span>
        <div className="stg-row stg-row--wrap stg-swatches">
          {SWATCHES.map((c) => (
            <button
              key={c}
              type="button"
              className={`stg-swatch${brand.color.toLowerCase() === c.toLowerCase() ? " stg-swatch--on" : ""}`}
              style={{ background: c }}
              aria-label={`Use ${c}`}
              onClick={() => setBrand({ color: c })}
            />
          ))}
          <input
            className="stg-colour-input"
            type="color"
            value={brand.color}
            aria-label="Custom colour"
            onChange={(e) => setBrand({ color: e.target.value })}
          />
        </div>
        <SelectField
          label="Theme"
          value={brand.theme}
          options={[{ value: "dark", label: "Dark" }, { value: "light", label: "Light" }]}
          onChange={(v) => setBrand({ theme: v })}
        />
        <SelectField label="Font" value={brand.font} options={FONTS} onChange={(v) => setBrand({ font: v })} />
        <SelectField
          label="Corners"
          value={String(brand.radius)}
          options={[{ value: "3", label: "Sharp" }, { value: "8", label: "Soft" }, { value: "14", label: "Round" }]}
          onChange={(v) => setBrand({ radius: Number(v) })}
        />
      </Card>
    </div>
  );
}
