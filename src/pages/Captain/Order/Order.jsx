import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { getKitchenStation } from "../../../redux/Kitchen/KotSlice";
import { getAllFoodItems } from "../../../redux/FoodMenus/MenuSlice";

import {
  addDineIn,
  addCartItem,
  updateCartQty,
  removeCartItem,
  toggleCartHold,
  clearSentCartItems,
} from "../../../redux/Order/OrderSlice";

import "../../../assets/styles/order.css";

const STN_COLOR = {
  MAIN: "#F59E0B",
  TANDOOR: "#F97316",
  BAR: "#3B82F6",
  DESSERT: "#EC4899",
};

const DEFAULT_COLOR = "#6B7280";
const SPICY = /starter|main course|biri?yani/i;

/* ====================== HELPERS ====================== */

const money = (n) =>
  "₹" +
  Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const rupee = (n) =>
  "₹" + Number(n || 0).toLocaleString("en-IN");

const itemNote = (i) =>
  [
    i.spice && `Spice: ${i.spice}`,
    ...(i.addons || []).map((a) => a.name),
    i.note,
  ]
    .filter(Boolean)
    .join(" · ");

const Cross = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

/* ====================== COMPONENT ====================== */

export default function Order({ onBackToFloor }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  /* ====================== REDUX ORDER ====================== */

  const { items = [] } = useSelector((s) => s.order);

  /* ====================== TABLE DETAILS ====================== */

  const navTable = location.state?.table;

  const tableName =
    navTable?.tableName ||
    navTable?.name ||
    "";

  const floorName = navTable?.floorName || "";

  const guests = location.state?.guests || 1;

  const customerName =
    location.state?.customerName || "Customer";

  /* ====================== KITCHEN STATIONS ====================== */

  const { stations } = useSelector((s) => s.stations);

  useEffect(() => {
    dispatch(getKitchenStation());
  }, [dispatch]);

  const stnMap = useMemo(() => {
    const map = {};

    [...(stations || [])]
      .filter((s) => s.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .forEach((s) => {
        map[s.code.toLowerCase()] = {
          id: s._id,
          code: s.code,
          name: s.name,
          color: STN_COLOR[s.code] || DEFAULT_COLOR,
        };
      });

    return map;
  }, [stations]);

  const tabs = useMemo(
    () => [
      { key: "All", name: "All" },
      ...Object.entries(stnMap).map(([key, s]) => ({
        key,
        name: s.name,
      })),
    ],
    [stnMap]
  );

  /* ====================== FOOD MENU ====================== */

  const { menus } = useSelector((s) => s.menus);

  useEffect(() => {
    dispatch(getAllFoodItems());
  }, [dispatch]);

  const menu = useMemo(() => {
    const codeById = {};

    Object.entries(stnMap).forEach(([key, st]) => {
      codeById[st.id] = key;
    });

    const rows = Array.isArray(menus)
      ? menus
      : menus?.data || [];

    return rows
      .filter((f) => {
        const availableFor = f.availableFor || [];

        return (
          f.isActive !== false &&
          f.isAvailable !== false &&
          availableFor.includes("Dine-In")
        );
      })
      .sort(
        (a, b) =>
          (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
      )
      .map((f) => {
        const foodMenuId = f._id;

        return {
          id: foodMenuId,
          foodMenuId: foodMenuId,
          name: f.itemName,
          price: Number(f.price) || 0,
          gstRate: Number(f.gstRate) || 0,
          cat: f.categoryId?.categoryName || "",
          icon: "🍽",
          image: f.image || "",

          stn:
            codeById[
              f.kitchenStationId?._id || f.kitchenStationId
            ] || "main",

          veg: f.foodType === "Veg",
          fav: false,
          off: false,
          left: null,

          availableFor: f.availableFor || [],
        };
      })
      .filter((f) => f.foodMenuId);
  }, [menus, stnMap]);

  const getStn = (key) =>
    stnMap[key] || {
      id: null,
      code: String(key).toUpperCase(),
      name: key,
      color: DEFAULT_COLOR,
    };

  /* ====================== MENU STATE ====================== */

  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [fav, setFav] = useState(false);

  /* ====================== NAVIGATION ====================== */

  function goToFloor() {
    if (onBackToFloor) {
      onBackToFloor();
    } else {
      navigate("/captain/floor");
    }
  }

  /* ====================== DERIVED VALUES ====================== */

  const list = useMemo(() => {
    const search = q.trim().toLowerCase();

    return menu.filter(
      (m) =>
        (cat === "All" || m.stn === cat) &&
        (!fav || m.fav) &&
        (!search || m.name.toLowerCase().includes(search))
    );
  }, [menu, q, cat, fav]);

  const fire = items.filter((i) => !i.hold);

  const sub = items.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  // GST calculated per item using its own gstRate
  const gst = items.reduce(
    (total, item) =>
      total +
      (item.price * item.qty * (Number(item.gstRate) || 0)) / 100,
    0
  );

  const hasAny = items.length > 0;

  const qtyOf = (id) =>
    items
      .filter((item) => item.id === id)
      .reduce((total, item) => total + item.qty, 0);

  /* ====================== ADD ITEMS ====================== */

  function itemClick(m) {
    if (!m.foodMenuId) {
      toast.error("Food Menu ID is missing.");
      console.log("Invalid food item:", m);
      return;
    }

    if (m.off || m.left === 0) {
      toast.warning(`${m.name} is unavailable right now.`);
      return;
    }

    if (m.left != null && qtyOf(m.id) + 1 > m.left) {
      toast.warning(`Only ${m.left} ${m.name} available.`);
      return;
    }

    const spice = SPICY.test(m.cat) ? "Medium" : "";
    const key = [m.foodMenuId, spice].join("|");

    dispatch(
      addCartItem({
        uid: crypto.randomUUID(),
        key,
        id: m.foodMenuId,
        foodMenuId: m.foodMenuId,
        name: m.name,
        price: m.price,
        gstRate: m.gstRate,
        qty: 1,
        spice,
        addons: [],
        note: "",
        hold: false,
        stn: m.stn,
        cat: m.cat,
      })
    );
  }

  /* ====================== EDIT CART ITEMS ====================== */

  function qtyChg(l, d) {
    if (d > 0) {
      const m = menu.find(
        (x) => x.foodMenuId === (l.foodMenuId || l.id)
      );

      if (m?.left != null && qtyOf(l.id) + 1 > m.left) {
        toast.warning(`Only ${m.left} ${m.name} available.`);
        return;
      }
    }

    dispatch(
      updateCartQty({
        uid: l.uid,
        change: d,
      })
    );
  }

  const rmItem = (uid) => {
    dispatch(removeCartItem(uid));
  };

  function holdTog(l) {
    dispatch(toggleCartHold(l.uid));

    toast.info(
      l.hold
        ? `${l.name} released.`
        : `${l.name} held.`
    );
  }

  /* ====================== ADD DINE-IN API ====================== */

  async function sendKOT() {
    // Support different possible key names from the table object
    const floorId =
      navTable?.floorId || navTable?.floor?._id || navTable?.floor;
    const tableId =
      navTable?.tableId || navTable?._id || navTable?.id;

    if (!floorId || !tableId) {
      toast.error("Floor ID or Table ID is missing.");
      return;
    }

    if (!fire.length) {
      toast.warning("No items to send.");
      return;
    }

    const payload = {
      floorId: String(floorId),
      tableId: String(tableId),
      customerName: String(customerName || "Customer").trim(),
      numberOfGuests: Number(guests) || 1,

      items: fire.map((item) => ({
        foodMenuId: String(item.foodMenuId),
        quantity: Number(item.qty),
        specialInstructions: itemNote(item), // spice + addons + note
      })),
    };
    try {
      const response = await dispatch(addDineIn(payload)).unwrap();
      dispatch(clearSentCartItems());

      toast.success(
        response?.message || "Dine-in order created successfully."
      );
    } catch (error) {
      console.error("Dine-in order API error:", error);

      toast.error(
        typeof error === "string"
          ? error
          : error?.message || "Failed to create Dine-in order."
      );
    }
  }

  /* ====================== KEYBOARD ====================== */

  const keyAdd = (e, m) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      itemClick(m);
    }
  };

  /* ====================== RENDER ====================== */

  return (
    <div className="pnl act" id="p-order">
      <div className="pos-wrap">

        {/* ================= LEFT: MENU ================= */}

        <div className="pos-left">
          <div className="scan-bar">
            <input
              className="scan-inp"
              id="o-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="🔍 Search dish…"
              aria-label="Search dishes"
            />

            <button
              type="button"
              className={`btn${fav ? " selected" : ""}`}
              onClick={() => setFav((f) => !f)}
            >
              ⭐ Favs
            </button>

            <button
              type="button"
              className="btn"
              onClick={goToFloor}
            >
              ⬅ Tables
            </button>
          </div>

          <div className="cat-row" id="o-cats">
            {tabs.map((t) => (
              <button
                type="button"
                key={t.key}
                className={`cpill${
                  cat === t.key && !fav ? " act" : ""
                }`}
                onClick={() => {
                  setCat(t.key);
                  setFav(false);
                }}
              >
                {t.name}
              </button>
            ))}
          </div>

          <div className="prod-grid" id="o-grid">
            {list.map((m) => {
              const off = m.off || m.left === 0;

              const count = items
                .filter((i) => i.id === m.id)
                .reduce((total, i) => total + i.qty, 0);

              const station = getStn(m.stn);

              return (
                <div
                  key={m.id}
                  className={`pc${off ? " off" : ""}`}
                  role="button"
                  tabIndex={off ? -1 : 0}
                  aria-disabled={off}
                  aria-label={`${m.name} ₹${m.price}`}
                  onClick={() => itemClick(m)}
                  onKeyDown={(e) => keyAdd(e, m)}
                >
                  {count > 0 && (
                    <span className="pc-count">{count}</span>
                  )}

                  <div className="pc-top">
                    <span
                      className={`veg${m.veg ? "" : " nv"}`}
                      title={m.veg ? "Veg" : "Non-veg"}
                    />

                    {m.fav && (
                      <span className="pc-fav">⭐</span>
                    )}
                  </div>

                  {m.image ? (
                    <img
                      className="pc-icon"
                      src={m.image}
                      alt=""
                      style={{
                        width: 40,
                        height: 40,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                  ) : (
                    <span className="pc-icon">{m.icon}</span>
                  )}

                  <div className="pc-name">{m.name}</div>
                  <div className="pc-price">₹{m.price}</div>

                  <div
                    className="stn"
                    style={{ color: station.color }}
                  >
                    {station.name}
                  </div>

                  {off ? (
                    <span className="off-t">UNAVAILABLE</span>
                  ) : (
                    m.left != null && (
                      <span className="left">
                        {m.left} left
                      </span>
                    )
                  )}
                </div>
              );
            })}

            {list.length === 0 && (
              <div className="no-results">
                No dishes match your search
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT: CART ================= */}

        <div className="pos-right" id="o-cart">
          <div className="cart-top">
            <div className="cart-av">
              {String(tableName).slice(0, 2)}
            </div>

            <div className="cart-info">
              <div className="cart-cname">
                Table {tableName} · {floorName}
              </div>

              <div className="cart-cmeta">
                {guests} pax · {customerName}
              </div>
            </div>

            <button
              type="button"
              className="floor-link"
              onClick={goToFloor}
            >
              Floor ›
            </button>
          </div>

          <div className="cart-body">
            {!hasAny && (
              <div className="cart-empty">
                <div className="ic">🍽</div>
                <div>No items yet</div>
                <div className="sub">
                  Tap a dish to add it to this order
                </div>
              </div>
            )}

            {items.length > 0 && (
              <>
                <div className="sec">
                  New items · not sent ({items.length})
                </div>

                {items.map((l) => (
                  <div className="cart-item" key={l.uid}>
                    <div>
                      <div className="ci-name">
                        {l.name}

                        <span
                          className={`badge${
                            l.hold ? " pre" : " grey"
                          }`}
                        >
                          {l.hold ? "HELD" : "NOT SENT"}
                        </span>
                      </div>

                      <div className="ci-sub">
                        ₹{l.price} each
                      </div>
                    </div>

                    <div className="ci-right">
                      <div className="ci-r step">
                        <button
                          type="button"
                          onClick={() => qtyChg(l, -1)}
                          aria-label={`Remove one ${l.name}`}
                        >
                          −
                        </button>

                        <span className="ci-qty">{l.qty}</span>

                        <button
                          type="button"
                          onClick={() => qtyChg(l, 1)}
                          aria-label={`Add one ${l.name}`}
                        >
                          +
                        </button>
                      </div>

                      <div className="ci-r">
                        <span className="ci-price">
                          {rupee(l.price * l.qty)}
                        </span>

                        <button
                          type="button"
                          className="ico"
                          title={l.hold ? "Release hold" : "Hold item"}
                          onClick={() => holdTog(l)}
                          aria-label={
                            l.hold
                              ? `Release ${l.name}`
                              : `Hold ${l.name}`
                          }
                        >
                          {l.hold ? "▶" : "⏸"}
                        </button>

                        <button
                          type="button"
                          className="ico"
                          title="Remove"
                          onClick={() => rmItem(l.uid)}
                          aria-label={`Delete ${l.name}`}
                        >
                          <Cross />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* ================= BILL ================= */}

          <div className="bill-sum">
            <div className="sr">
              <span>Subtotal</span>
              <span>{money(sub)}</span>
            </div>

            <div className="sr">
              <span>GST</span>
              <span>{money(gst)}</span>
            </div>

            <div className="sr grand">
              <span>Running total</span>
              <span>{rupee(Math.round(sub + gst))}</span>
            </div>

            <button
              type="button"
              className="charge-btn"
              disabled={!fire.length}
              onClick={sendKOT}
            >
              🖨 Send KOT
              {fire.length
                ? ` (${fire.length} item${
                    fire.length > 1 ? "s" : ""
                  })`
                : ""}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
