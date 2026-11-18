import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SNAP_KEY, readSnapshot, beat, clearBeat } from "./ScreenStore";
import "../../../assets/styles/back-office/screen-player.css"

const LETTERS = ["B", "L", "S", "D"];   // Breakfast, Lunch, Snacks, Dinner (same order as "Menu by time of day")
const money = (n) => "₹" + Number(n).toLocaleString("en-IN");
const clock = (d) => d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
const isLive = (o) => {
  const n = new Date();
  return o.on && (o.dayNums ?? []).includes(n.getDay()) && n.getHours() >= o.from && n.getHours() < o.to;
};

function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

/* one dish row; each tile animates in a little after the previous one */
const Tile = ({ item, n }) => (
  <div className="rm-pl-tile" style={{ animationDelay: `${n * 70}ms` }}>
    <span className="rm-pl-tile__name">
      {item.icon} {item.name}
      {item.ta && <small>{item.ta}</small>}
    </span>
    <b>{money(item.price)}</b>
  </div>
);
const Empty = ({ text }) => <div className="rm-pl-tile rm-pl-wide">{text}</div>;
const Grid = ({ title, children }) => (
  <section className="rm-pl-grid"><h2>{title}</h2>{children}</section>
);

export default function ScreenPlayer() {
  const [params] = useSearchParams();
  const screenId = params.get("screen");
  const now = useNow();

  const [snap, setSnap] = useState(readSnapshot);
  const [idx, setIdx] = useState(0);
  const [loop, setLoop] = useState(0);
  const [leaving, setLeaving] = useState(false);

  // pick up changes published from the back office tab
  useEffect(() => {
    const onStorage = (e) => e.key === SNAP_KEY && setSnap(readSnapshot());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // heartbeat so the Screens tab shows this player as Online
  useEffect(() => {
    if (!screenId) return;
    beat(screenId);
    const t = setInterval(() => beat(screenId), 4000);
    const bye = () => clearBeat(screenId);
    window.addEventListener("beforeunload", bye);
    return () => { clearInterval(t); window.removeEventListener("beforeunload", bye); bye(); };
  }, [screenId]);

  const screen = snap?.screens?.find((s) => s.id === screenId);
  const playlist = screen?.playlist ?? [];
  const cur = playlist.length ? playlist[idx % playlist.length] : null;

  // advance through the playlist; fade out half a second before the switch
  useEffect(() => {
    if (!cur) return undefined;
    setLeaving(false);
    const ms = cur.sec * 1000;
    const fade = setTimeout(() => setLeaving(true), Math.max(0, ms - 500));
    const next = setTimeout(() => {
      setIdx((i) => {
        if (i + 1 >= playlist.length) { setLoop((l) => l + 1); return 0; }
        return i + 1;
      });
    }, ms);
    return () => { clearTimeout(fade); clearTimeout(next); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, loop, playlist.length, cur?.sec]);

  if (!snap || !screen || !cur) {
    return (
      <div className="rm-pl rm-pl--idle">
        <div>
          <h1>{!snap ? "Nothing published yet" : !screen ? `Screen ${screenId ?? ""} not found` : "This playlist is empty"}</h1>
          <p>Open Menu &amp; QR → Screens, set a playlist and press Publish now.</p>
        </div>
      </div>
    );
  }

  /* day part and the dishes allowed right now */
  const hour = now.getHours();
  const partIdx = snap.parts.findIndex((p) => hour >= p.a && hour < p.b);
  const label = snap.parts[partIdx]?.n ?? "Menu";
  const letter = LETTERS[partIdx];
  const pool = snap.items.filter((i) => !i.meals?.length || !letter || i.meals.includes(letter));

  const slideBody = () => {
    switch (cur.type) {
      case "welcome":
        return (
          <div className="rm-pl-center">
            <div className="rm-pl-welcome">Welcome to {snap.restaurant}</div>
            <div className="rm-pl-sub">{label} menu</div>
          </div>
        );
      case "best": {
        const list = pool.filter((i) => i.sold > 0 || i.fav).sort((a, b) => b.sold - a.sold).slice(0, 7);
        return <Grid title="Bestsellers">{list.length ? list.map((i, n) => <Tile key={i.id} item={i} n={n} />) : <Empty text="Nothing available right now" />}</Grid>;
      }
      case "menu":
        return <Grid title={`${label} menu`}>{pool.slice(0, 12).map((i, n) => <Tile key={i.id} item={i} n={n} />)}</Grid>;
      case "cat": {
        const cats = snap.cats.filter((c) => pool.some((i) => i.cat === c));
        const c = cats[loop % Math.max(1, cats.length)];
        return <Grid title={c ?? "Category"}>{pool.filter((i) => i.cat === c).slice(0, 12).map((i, n) => <Tile key={i.id} item={i} n={n} />)}</Grid>;
      }
      case "offer": {
        const live = snap.offers.filter(isLive);
        return (
          <Grid title="Offers">
            {live.length ? live.map((o, n) => (
              <div className="rm-pl-tile" key={o.id} style={{ animationDelay: `${n * 90}ms` }}>
                <span className="rm-pl-tile__name">{o.name}<small>{o.dishes.join(" + ")}</small></span>
                <b>{money(o.price)}</b>
              </div>
            )) : <Empty text="No offers right now" />}
          </Grid>
        );
      }
      case "special": {
        const list = pool.filter((i) => i.chef);
        return <Grid title="Chef's specials">{list.length ? list.map((i, n) => <Tile key={i.id} item={i} n={n} />) : <Empty text="Nothing available right now" />}</Grid>;
      }
      case "text":
      default:
        return (
          <div className="rm-pl-center">
            <div className="rm-pl-welcome">{snap.emergency?.live && snap.emergency.text ? snap.emergency.text : cur.text || `Welcome to ${snap.restaurant}`}</div>
          </div>
        );
    }
  };

  const slideKey = `${loop}-${idx}`;
  const alert = snap.emergency?.live && snap.emergency.text;

  return (
    <div className="rm-pl" onDoubleClick={() => document.documentElement.requestFullscreen?.()}>
      <header className="rm-pl-head">
        <span>{snap.restaurant}</span>
        <span>{label} · {clock(now)}</span>
      </header>
      {alert && <div className={`rm-pl-alert rm-pl-alert--${snap.emergency.tone}`}>{snap.emergency.text}</div>}
      <main key={slideKey} className={"rm-pl-slide" + (leaving ? " rm-pl-slide--out" : "")}>{slideBody()}</main>
      <div className="rm-pl-progress"><i key={slideKey} style={{ animationDuration: `${cur.sec}s` }} /></div>
    </div>
  );
}
