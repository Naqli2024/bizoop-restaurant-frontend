import { useState } from "react";
import { Switch } from "../Shared";
import GuestPreview from "../GuestPreview";
import { FLOOR } from "../MenuData";

export default function DesignTab({ items, cats, design, setDesign, offers = [] }) {
  // default to the first free table, like the "Guest view" button does
  const [tableId, setTableId] = useState(
    () => (FLOOR.find((t) => t.state === "free") ?? FLOOR[0]).id
  );
  const table = FLOOR.find((t) => t.id === tableId);

  const onCover = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setDesign({ ...design, cover: r.result });
    r.readAsDataURL(f);
  };

  return (
    <div className="rm-grid2">
      <div className="rm-card" style={{ alignSelf: "start" }}>
        <div className="rm-card__head">Digital menu design</div>

          <label className="rm-field">Layout
          <select className="rm-input" value={design.layout} onChange={(e) => setDesign({ ...design, layout: e.target.value })}>
            <option value="grid">Grid</option>
            <option value="list">List</option>
            <option value="large">Large image cards</option>
            <option value="prem">Premium</option>
            <option value="min">Minimal</option>
          </select>
        </label>

        <label className="rm-field">Tagline
          <input className="rm-input" value={design.tag} onChange={(e) => setDesign({ ...design, tag: e.target.value })} />
        </label>  

        <Switch line checked={design.showImg} onChange={(v) => setDesign({ ...design, showImg: v })} label="Show dish photos" />

        <label className="rm-btn" style={{ margin: "12px 0" }}>⭱ Cover image
          <input type="file" accept="image/*" hidden onChange={onCover} />
        </label>

        <div className="rm-muted">
          Logo, brand colour and font come from Settings → Brand &amp; layout. Languages: English, Tamil and Hindi, stored against each dish.
        </div>
      </div>

      <GuestPreview items={items} cats={cats} design={design} table={table} offers={offers} />
    </div>
  );
}
