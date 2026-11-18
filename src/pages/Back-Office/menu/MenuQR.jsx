import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../../../assets/styles/back-office/menu.css";
import { RAW, toItem, TABS, INITIAL_ADDONS, INITIAL_SCREENS } from "./MenuData";
import IntelligenceTab from "./tabs/IntelligenceTab";
import MasterTab from "./tabs/MasterTab";
import ControllerTab from "./tabs/ControllerTab";
import ScreensTab from "./tabs/ScreensTab";
import DesignTab from "./tabs/DesignTab";
import QrTab from "./tabs/QrTab";
import LiveFloorTab from "./tabs/LiveFloorTab";
import AnalyticsTab from "./tabs/AnalyticsTab";
import EditDishModal from "./EditDishModal";
import OfferModal from "./OfferModal";
import QrPrintModal from "./QrPrintModal";
import GuestViewModal, { NEXT_STATUS } from "./GuestViewModal";
import TableModal from "./TableModal";
import { unitPrice } from "./GuestPreview";
import { PLAYER_PATH, publishSnapshot, onlineIds } from "./ScreenStore";
import PlaylistModal, { playlistSeconds } from "./PlaylistModal";
import { getFloorsTables } from "../../../redux/Floors/FloorSlice";
import { flattenFloors } from "./FloorUtils";
import { Plus } from "lucide-react";
import CreateFloorModal from "./CreateFloorModal";

// sample playlists matching the slide counts and seconds already shown on the Screens tab
const PLAYLISTS = {
  S1: [{ type: "welcome", sec: 10 }, { type: "offer", sec: 8 }, { type: "special", sec: 8 }],
  S2: [{ type: "welcome", sec: 10 }, { type: "best", sec: 8 }, { type: "menu", sec: 10 }, { type: "offer", sec: 8 }, { type: "special", sec: 8 }],
  S3: [{ type: "menu", sec: 12 }, { type: "offer", sec: 8 }, { type: "special", sec: 8 }],
  S4: [{ type: "best", sec: 8 }, { type: "offer", sec: 8 }],
  S5: [{ type: "welcome", sec: 12 }],
};

// change this to the path of your cashier billing route
const BILLING_PATH = "/cashier/billing";

export default function MenuQR() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { floors, loading: floorsLoading } = useSelector((s) => s.floors); // adjust to your store key

  const [tab, setTab] = useState("dash");
  const [items, setItems] = useState(() => RAW.map(toItem));
  const [cats, setCats] = useState(["Starters", "Main Course", "Biryani", "Breads", "Desserts", "Tiffin", "Beverages"]);
  const [addons, setAddons] = useState(INITIAL_ADDONS);
  const [autoOut, setAutoOut] = useState(true);
  const [parts, setParts] = useState([
    { n: "Breakfast", a: 7, b: 11 }, { n: "Lunch", a: 11, b: 16 }, { n: "Snacks", a: 16, b: 19 }, { n: "Dinner", a: 19, b: 24 },
  ]);
  const [emergency, setEmergency] = useState({ text: "", tone: "red", live: false });
  const [offers, setOffers] = useState([{
    id: "o2", name: "Family combo", price: 899, from: 12, to: 24, on: true, dayNums: [5, 6, 0],
    dishIds: [12, 12, 4, 26, 26],
    dishes: ["Chicken Biryani", "Chicken Biryani", "Paneer Tikka", "Fresh Lime Soda", "Fresh Lime Soda"],
    hours: "12:00 to 24:00", days: "Fri Sat Sun", state: "Scheduled",
  }]);
  const [outlet, setOutlet] = useState("");
  const [screens, setScreens] = useState(INITIAL_SCREENS.map((s) => ({ ...s, online: false, playlist: PLAYLISTS[s.id] ?? [{ type: "welcome", sec: 12 }] })));
  const [groups, setGroups] = useState(["Dining area"]);
  const [design, setDesign] = useState({ layout: "grid", tag: "", showImg: true, cover: null });
  const [editId, setEditId] = useState(null);               // which dish the edit modal is open for
  const [saved, setSaved] = useState({ ids: [], text: "" });   // rows to flash after a playlist save
  const savedTimer = useRef(null);
  const [playlistFor, setPlaylistFor] = useState(null);      // screen id for the Playlist popup
  const [tableView, setTableView] = useState(null);        // table id for the table detail popup
  const [guestTable, setGuestTable] = useState(null);      // table id for the Guest view popup
  const [guestOrders, setGuestOrders] = useState([]);      // orders placed from the guest view
  const [calls, setCalls] = useState([]);                  // waiter / bill / water requests
  const [qrPrintOpen, setQrPrintOpen] = useState(false);   // "Table QR codes" popup
  const [offerEdit, setOfferEdit] = useState(null);         // null = closed, "new" = add, or an offer id
  const [createFloorOpen, setCreateFloorOpen] = useState(false);

  /* ---- floors & tables from the API (getFloorsTables) ---- */
  const tables = useMemo(() => flattenFloors(floors), [floors]);

  useEffect(() => {
    dispatch(getFloorsTables());
  }, [dispatch]);

  const patchItem = (id, patch) => setItems((l) => l.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  const setChannel = (id, ch, v) => setItems((l) => l.map((i) => (i.id === id ? { ...i, channels: { ...i.channels, [ch]: v } } : i)));
  const moveCat = (idx, dir) => setCats((c) => {
    const j = idx + dir; if (j < 0 || j >= c.length) return c;
    const n = [...c];[n[idx], n[j]] = [n[j], n[idx]]; return n;
  });
  const setAddonPrice = (group, idx, v) => setAddons((a) => ({ ...a, [group]: a[group].map((r, k) => (k === idx ? [r[0], v] : r)) }));
  const setPart = (idx, patch) => setParts((p) => p.map((x, k) => (k === idx ? { ...x, ...patch } : x)));
  const setScreen = (id, patch) => setScreens((l) => l.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const addScreen = () => setScreens((l) => [...l, { id: `S${l.length + 1}`, name: `Screen ${l.length + 1}`, location: "", group: "", slides: 1, secs: 12, online: false, playlist: [{ type: "welcome", sec: 12 }] }]);
  const removeScreen = (id) => setScreens((l) => l.filter((s) => s.id !== id));
  const addGroup = (name) => name && setGroups((g) => (g.includes(name) ? g : [...g, name]));

  const sorted = useMemo(() => [...items].sort((a, b) => cats.indexOf(a.cat) - cats.indexOf(b.cat) || a.id - b.id), [items, cats]);
  const urlFor = (id) => `${window.location.origin}${window.location.pathname}?guest=${id}`;
  const firstFreeTable = () =>
    (tables.find((t) => t.status === "Available") ?? tables[0])?.id ?? null;

  /* ---- what the screen players show: only published, available dishes ticked for the Board ---- */
  const snapshot = useMemo(() => ({
    restaurant: "Spice Route",
    items: items
      .filter((i) => i.available && i.status === "pub" && i.channels.board)
      .map((i) => ({
        id: i.id, icon: i.icon, name: i.name, cat: i.cat, price: unitPrice(i), sold: i.sold,
        ta: i.ta ?? (i.sub || "").split(" · ")[0], chef: !!i.chef, fav: !!i.fav, meals: i.meals ?? [],
      })),
    cats,
    offers,
    parts,
    emergency,
    screens: screens.map(({ id, name, playlist }) => ({ id, name, playlist })),
  }), [items, cats, offers, parts, emergency, screens]);
  useEffect(() => { publishSnapshot(snapshot); }, [snapshot]);   // players update live

  // Online while a player tab is running (it writes a heartbeat every few seconds)
  const [online, setOnline] = useState([]);
  useEffect(() => {
    const tick = () => setOnline((prev) => {
      const next = onlineIds(screens.map((s) => s.id));
      return prev.join() === next.join() ? prev : next;
    });
    tick();
    const t = setInterval(tick, 3000);
    return () => clearInterval(t);
  }, [screens]);
  const screensView = useMemo(() => screens.map((s) => ({ ...s, online: online.includes(s.id) })), [screens, online]);
  const publishNow = () => {
    publishSnapshot(snapshot);
    setSaved({ ids: [], text: "Published to all screens" });
    clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setSaved({ ids: [], text: "" }), 3000);
  };

  const placeOrder = (o) =>
    setGuestOrders((l) => [{ ...o, id: `K${1001 + l.length}`, status: "new", at: Date.now() }, ...l]);
  const advanceOrder = (id) =>
    setGuestOrders((l) => l.map((o) => (o.id === id ? { ...o, status: NEXT_STATUS[o.status] ?? o.status } : o)));
  const savePlaylist = (id, playlist, applyToGroup) => {
    const group = screens.find((s) => s.id === id)?.group;
    const hit = screens.filter((s) => s.id === id || (applyToGroup && group && s.group === group));
    const ids = hit.map((s) => s.id);
    setScreens((l) =>
      l.map((s) => (ids.includes(s.id) ? { ...s, playlist, slides: playlist.length, secs: playlistSeconds(playlist) } : s))
    );
    setTab("scr");                                   // land on the Screens tab with the update visible
    setSaved({ ids, text: `Playlist saved for ${hit.map((s) => s.name).join(", ")}` });
    clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setSaved({ ids: [], text: "" }), 3000);
  };
  const resolveCall = (id) => setCalls((l) => l.map((c) => (c.id === id ? { ...c, open: false } : c)));
  const callWaiter = (table, type) =>
    setCalls((l) => [...l, { id: `c${Date.now()}`, table, type, at: Date.now(), open: true }]);
  const editing = items.find((i) => i.id === editId);
  const editingOffer = offerEdit && offerEdit !== "new" ? offers.find((o) => o.id === offerEdit) : null;
  const deleteOffer = (id) => setOffers((l) => l.filter((o) => o.id !== id));
  const saveOffer = (o) => setOffers((l) => (o.id ? l.map((x) => (x.id === o.id ? o : x)) : [...l, { ...o, id: `o${Date.now()}` }]));

  return (
    <div className="rm-root">
      <header className="rm-head">
        <span className="rm-title">🍽 Menu &amp; table ordering <span className="rm-badge">menu → QR → KOT → bill</span></span>
        <div className="rm-head-actions">
          <button
            className="rm-btn rm-btn--primary"
            onClick={() => setCreateFloorOpen(true)}
          >
            <Plus size={14} /> Create Floor
          </button>

          <button
            className="rm-btn rm-btn--primary"
            disabled={!tables.length}
            onClick={() => setGuestTable(firstFreeTable())}
          >
            📱 Guest view
          </button>
        </div>
      </header>

      <nav className="rm-tabs" role="tablist">
        {TABS.map(([key, label]) => (
          <button key={key} role="tab" aria-selected={tab === key}
            className={"rm-tab" + (tab === key ? " rm-tab--on" : "")} onClick={() => setTab(key)}>{label}</button>
        ))}
      </nav>

      <div className="rm-scroll">
        <main className="rm-body">
          {emergency.live && emergency.text && (
            <div className={`rm-alert rm-alert--${emergency.tone}`}>{emergency.text}</div>
          )}
          {tab === "dash" && <IntelligenceTab items={items} />}
          {tab === "master" && (
            <MasterTab items={items} cats={cats} moveCat={moveCat} addons={addons} setAddonPrice={setAddonPrice}
              autoOut={autoOut} setAutoOut={setAutoOut} onEdit={setEditId} />
          )}
          {tab === "ctl" && (
            <ControllerTab items={items} patchItem={patchItem} setChannel={setChannel} parts={parts} setPart={setPart}
              emergency={emergency} setEmergency={setEmergency} offers={offers} outlet={outlet} setOutlet={setOutlet}
              onPushAlert={() => setEmergency((e) => ({ ...e, live: true }))}
              onClearAlert={() => setEmergency({ text: "", tone: "red", live: false })}
              onAddOffer={() => setOfferEdit("new")} onEditOffer={setOfferEdit} />
          )}
          {tab === "scr" && (
            <ScreensTab screens={screensView} groups={groups} setScreen={setScreen} removeScreen={removeScreen}
              addScreen={addScreen} addGroup={addGroup} onPlaylist={setPlaylistFor} savedIds={saved.ids} notice={saved.text}
              onPublish={publishNow} onOpenPlayer={() => publishSnapshot(snapshot)} playerHref={(id) => `${PLAYER_PATH}?screen=${id}`} />
          )}
          {tab === "design" && <DesignTab items={sorted} cats={cats} design={design} setDesign={setDesign} offers={offers} />}
          {tab === "qr" && <QrTab urlFor={urlFor} onPrint={() => setQrPrintOpen(true)} onOpen={setGuestTable} />}
          {tab === "live" && (
            <LiveFloorTab
              tables={tables}
              loading={floorsLoading}
              onTable={setTableView}
              waiterCalls={calls.filter((c) => c.open)}
              onAttend={resolveCall}
            />
          )}
          {tab === "ana" && <AnalyticsTab />}
        </main>
      </div>

      {playlistFor && (
        <PlaylistModal
          key={playlistFor}
          screen={screens.find((s) => s.id === playlistFor)}
          onSave={savePlaylist}
          onClose={() => setPlaylistFor(null)}
        />
      )}

      {tableView && (
        <TableModal
          table={tables.find((t) => t.id === tableView)}
          onAddItem={setGuestTable}
          onCall={callWaiter}
          onBill={(id) => navigate(`${BILLING_PATH}?table=${encodeURIComponent(id)}`)}
          onClose={() => setTableView(null)}
        />
      )}

      {guestTable && (
        <GuestViewModal
          tableId={guestTable}
          items={sorted}
          cats={cats}
          design={design}
          offers={offers}
          addons={addons}
          orders={guestOrders.filter((o) => o.table === guestTable)}
          calls={calls.filter((c) => c.table === guestTable)}
          onPlaceOrder={placeOrder}
          onAdvance={advanceOrder}
          onCall={callWaiter}
          onClose={() => setGuestTable(null)}
        />
      )}

      {qrPrintOpen && (
        <QrPrintModal urlFor={urlFor} onClose={() => setQrPrintOpen(false)} />
      )}

      {offerEdit && (
        <OfferModal
          key={offerEdit}
          offer={editingOffer}
          items={items}
          onSave={saveOffer}
          onDelete={deleteOffer}
          onClose={() => setOfferEdit(null)}
        />
      )}

      {editing && (
        <EditDishModal
          key={editing.id}
          item={editing}
          onSave={patchItem}
          onClose={() => setEditId(null)}
        />
      )}

      {createFloorOpen && (
        <CreateFloorModal onClose={() => setCreateFloorOpen(false)} />
      )}
    </div>
  );
}