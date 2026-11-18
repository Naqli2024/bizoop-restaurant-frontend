import { Switch } from "../Shared";
import { CHANNELS, CHANNEL_LABEL, inr } from "../MenuData";

export default function ControllerTab({ items, patchItem, setChannel, parts, setPart, emergency, setEmergency, offers, outlet, setOutlet, onPublish, onPushAlert, onClearAlert,onAddOffer,onEditOffer}) {
  return (
    <>
      <div className="rm-row rm-row--between" style={{ marginBottom: 12 }}>
        <span className="rm-muted">Status and channel ticks decide where each dish appears. Sold-out dishes disappear everywhere automatically.</span>
        <button className="rm-btn rm-btn--primary" onClick={onPublish}>Publish now</button>
      </div>

      <div className="rm-table-wrap">
        <table className="rm-table">
          <thead><tr>
            <th>Dish</th><th>Status</th>
            {CHANNELS.map((c) => <th key={c}>{CHANNEL_LABEL[c]}</th>)}
            <th>Available</th>
          </tr></thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id}>
                <td>{i.icon} {i.name}</td>
                <td>
                  <select className="rm-input" value={i.status} onChange={(e) => patchItem(i.id, { status: e.target.value })}>
                    <option value="pub">Published</option><option value="draft">Draft</option>
                  </select>
                </td>
                {CHANNELS.map((c) => (
                  <td key={c}>
                    <input type="checkbox" aria-label={CHANNEL_LABEL[c]} checked={i.channels[c]}
                      onChange={(e) => setChannel(i.id, c, e.target.checked)} />
                  </td>
                ))}
                <td><Switch checked={i.available} onChange={(v) => patchItem(i.id, { available: v })} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rm-grid2 rm-gap-top">
        <div className="rm-card">
          <div className="rm-card__head">Menu by time of day</div>
          {parts.map((p, idx) => (
            <div className="rm-row" style={{ marginBottom: 6 }} key={idx}>
              <input className="rm-input" value={p.n} onChange={(e) => setPart(idx, { n: e.target.value })} />
              <input className="rm-input" style={{ width: 70 }} type="number" min="0" max="24" value={p.a} onChange={(e) => setPart(idx, { a: +e.target.value })} />
              <span>to</span>
              <input className="rm-input" style={{ width: 70 }} type="number" min="0" max="24" value={p.b} onChange={(e) => setPart(idx, { b: +e.target.value })} />
            </div>
          ))}
          <div className="rm-muted">Dishes tagged with a time slot show only during it. Screens switch automatically.</div>
        </div>

        <div className="rm-card">
          <div className="rm-card__head">Emergency message</div>
          <label className="rm-field">Message shown on every screen and the QR menu
            <input className="rm-input" value={emergency.text} placeholder="Mutton biryani temporarily unavailable"
              onChange={(e) => setEmergency({ ...emergency, text: e.target.value })} />
          </label>
          <label className="rm-field">Colour
            <select className="rm-input" value={emergency.tone} onChange={(e) => setEmergency({ ...emergency, tone: e.target.value })}>
              <option value="red">Red alert</option><option value="green">Green highlight</option>
            </select>
          </label>
          <div className="rm-row">
            <button className="rm-btn rm-btn--primary" onClick={onPushAlert}>Push now</button>
            <button className="rm-btn" onClick={onClearAlert}>🗑 Clear</button>
          </div>
        </div>
      </div>

      <div className="rm-card rm-gap-top">
        <div className="rm-card__head">Offers <button className="rm-btn rm-btn--primary" onClick={onAddOffer}>+ Add offer</button></div>
        {offers.map((o) => (
          <div className="rm-item" key={o.id}>
            <div><b>{o.name}</b><span className="rm-sub">{inr(o.price)} · {o.dishes.join(" + ")} · {o.hours} · {o.days}</span></div>
            <span className="rm-row"><span className="rm-pill rm-pill--ok">{o.state}</span>
              <button className="rm-btn" onClick={()=>onEditOffer(o.id)}>✎ Edit</button></span>
          </div>
        ))}
      </div>

      <div className="rm-card rm-gap-top">
        <div className="rm-card__head">Outlet overrides</div>
        <label className="rm-field">Editing
          <select className="rm-input" value={outlet} onChange={(e) => setOutlet(e.target.value)}>
            <option value="">Master menu (all outlets)</option><option>Anna Nagar</option>
          </select>
        </label>
        <div className="rm-muted">Pick an outlet to override price or visibility. Everything else is inherited from the master menu. This app instance is treated as that outlet while selected.</div>
      </div>
    </>
  );
}
