import { useState } from "react";
import { inr } from "./MenuData";

const LANGS = [["en", "English"], ["ta", "தமிழ்"], ["hi", "हिन्दी"]];
const NAV = [["menu", "🍽 Menu"], ["cart", "🛒 Order"], ["status", "⏱ Status"], ["help", "🛎 Help"]];

// dine-in price override from the Edit dish popup, else the normal price
export const unitPrice = (i) => i.dine ?? i.price;

// an offer is "live" when it is on and today's day and the current hour fall inside its schedule
export const isLive = (o) => {
  const now = new Date();
  return o.on && (o.dayNums ?? []).includes(now.getDay()) && now.getHours() >= o.from && now.getHours() < o.to;
};

/* ---------- phone frame: header, body slot, bottom nav ---------- */
export function GuestShell({ table, layout = "grid", lang, setLang, screen, setScreen, cartCount = 0, overlay, children }) {
  return (
    <div className={`rm-guest rm-guest--${layout}`}>
      <div className="rm-guest__bar">
        <b>Spice Route</b>
        <span className="rm-muted">Table {table?.id ?? "—"}</span>
        <span className="rm-row">
          {LANGS.map(([k, l]) => (
            <button key={k} className={"rm-btn rm-chips" + (lang === k ? " rm-chip--on" : "")} onClick={() => setLang(k)}>{l}</button>
          ))}
        </span>
      </div>
      <div className="rm-guest__body">{children}</div>
      <div className="rm-guest__nav">
        {NAV.map(([k, label]) =>
          setScreen ? (
            <button key={k} className={"rm-nav" + (screen === k ? " rm-nav--on" : "")} onClick={() => setScreen(k)}>
              {label}{k === "cart" && cartCount > 0 && <em className="rm-nav__badge">{cartCount}</em>}
            </button>
          ) : (
            <span key={k}>{label}</span>
          )
        )}
      </div>
      {overlay}
    </div>
  );
}

/* ---------- menu list: offers, search, chips and the chosen layout ---------- */
export function MenuView({ items, cats, design, offers = [], lang, onItem, onOffer, qty = {} }) {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const { layout = "grid", showImg = true, tag = "", cover = null } = design;

  const shown = items.filter(
    (i) => i.available && (cat === "All" || i.cat === cat) && i.name.toLowerCase().includes(q.toLowerCase())
  );
  const groups = cats.map((c) => [c, shown.filter((i) => i.cat === c)]).filter(([, list]) => list.length);
  const activeOffers = offers.filter((o) => o.on);

  const subOf = (i) => (lang === "en" || !i.sub ? "" : i.sub.split(" · ")[lang === "ta" ? 0 : 1] || "");
  const diet = (veg) => <i className={"rm-diet " + (veg ? "rm-diet--veg" : "rm-diet--non")} />;
  // makes a dish tappable and shows a quantity badge when it is in the cart
  const tap = (i, base) => ({
    className: base + (onItem ? " rm-tap" : ""),
    onClick: onItem ? () => onItem(i) : undefined,
    "data-qty": qty[i.id] || undefined,
  });

  const gridItem = (i) => (
    <div {...tap(i, "rm-dish")} key={i.id}>
      {showImg && <div className="rm-dish__img">{i.img ? <img src={i.img} alt="" /> : i.icon}</div>}
      <div className="rm-dish__txt">
        <b>{diet(i.veg)}{i.name}</b>
        {subOf(i) && <span className="rm-muted">{subOf(i)}</span>}
        <b>{inr(unitPrice(i))}</b>
      </div>
    </div>
  );
  const listItem = (i) => (
    <div {...tap(i, "rm-lrow")} key={i.id}>
      {showImg && <span className="rm-lrow__img">{i.icon}</span>}
      <div className="rm-lrow__txt">
        <b>{diet(i.veg)}{i.name}</b>
        {subOf(i) && <span className="rm-muted">{subOf(i)}</span>}
      </div>
      <b className="rm-lrow__price">{inr(unitPrice(i))}</b>
    </div>
  );
  const largeItem = (i) => (
    <article {...tap(i, "rm-big")} key={i.id}>
      {showImg && <div className="rm-big__img">{i.icon}</div>}
      <div className="rm-big__body">
        <div className="rm-big__top"><b>{diet(i.veg)}{i.name}</b><b>{inr(unitPrice(i))}</b></div>
        {subOf(i) && <span className="rm-muted">{subOf(i)}</span>}
      </div>
    </article>
  );
  const premiumItem = (i) => (
    <div {...tap(i, "rm-prem__row")} key={i.id}>
      {showImg && <span className="rm-prem__img">{i.icon}</span>}
      <div className="rm-prem__txt">
        <div className="rm-prem__line">
          <span className="rm-prem__name">{i.name}</span><span className="rm-prem__dots" />
          <span className="rm-prem__price">{inr(unitPrice(i))}</span>
        </div>
        {subOf(i) && <span className="rm-prem__sub">{subOf(i)}</span>}
      </div>
    </div>
  );
  const minimalItem = (i) => (
    <div {...tap(i, "rm-min__row")} key={i.id}>
      <span>{diet(i.veg)}{i.name}</span><span>{inr(unitPrice(i))}</span>
    </div>
  );

  const renderMenu = () => {
    if (!shown.length) return <div className="rm-muted">No dishes found.</div>;
    switch (layout) {
      case "list": return <div className="rm-lrows">{shown.map(listItem)}</div>;
      case "large": return <div className="rm-bigs">{shown.map(largeItem)}</div>;
      case "prem":
        return groups.map(([c, list]) => (
          <section className="rm-prem__sec" key={c}><h4 className="rm-prem__title">{c}</h4>{list.map(premiumItem)}</section>
        ));
      case "min":
        return groups.map(([c, list]) => (
          <section className="rm-min__sec" key={c}><h4 className="rm-min__title">{c}</h4>{list.map(minimalItem)}</section>
        ));
      default: return <div className="rm-dishes rm-dishes--grid">{shown.map(gridItem)}</div>;
    }
  };

  return (
    <>
      {cover && <div className="rm-guest__cover" style={{ backgroundImage: `url(${cover})` }} />}
      {tag && <div className={layout === "prem" ? "rm-prem__tag" : "rm-muted"}>{tag}</div>}
      {activeOffers.map((o) => (
        <div className="rm-offer" key={o.id}>
          <span className="rm-offer__txt">
            <b>{o.name}</b>
            <span className="rm-muted">{o.dishes.join(" + ")}</span>
            {!isLive(o) && <span className="rm-pill rm-pill--grey">{o.days} · {o.hours}</span>}
          </span>
          <button className="rm-btn rm-btn--primary" disabled={!!onOffer && !isLive(o)} onClick={() => onOffer?.(o)}>
            {inr(o.price)} · Add
          </button>
        </div>
      ))}
      <input className="rm-input" placeholder="Search dishes" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="rm-chips">
        {["All", ...cats].map((c) => (
          <button key={c} className={"rm-btn" + (cat === c ? " rm-chip--on" : "")} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>
      {renderMenu()}
    </>
  );
}

/* ---------- static preview used by the Digital menu tab (unchanged API) ---------- */
export default function GuestPreview({ items, cats, design, table, offers = [] }) {
  const [lang, setLang] = useState("en");
  return (
    <GuestShell table={table} layout={design.layout} lang={lang} setLang={setLang}>
      <MenuView items={items} cats={cats} design={design} offers={offers} lang={lang} />
    </GuestShell>
  );
}
