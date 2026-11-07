import { useCallback, useMemo, useState } from "react";
import "../../../assets/styles/crm.css"
import CustomerProfileModal from "./CustomerProfileModal";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CUSTOMERS = [
  { id: 4, name: "Meera Subramanian", initials: "MS", birthday: true, fav: "Paneer Butter Masala, Garlic Naan", mobile: "9962011478", whatsapp: true, visits: 31, spend: 68900, lastVisit: "Today", branch: "Anna Nagar", points: 3120, segments: ["VIP"] },
  { id: 2, name: "Lakshmi Narayanan", initials: "LN", birthday: true, fav: "Mutton Biryani, Tandoori Chicken (Half)", mobile: "9840155021", whatsapp: true, visits: 26, spend: 52600, lastVisit: "Today", branch: "Anna Nagar", points: 2480, segments: ["VIP"] },
  { id: 7, name: "Mohammed Irfan", initials: "MI", birthday: false, fav: "Chicken Biryani, Chicken Tikka", mobile: "9840770012", whatsapp: true, visits: 22, spend: 38120, lastVisit: "3 d ago", branch: "T Nagar", points: 1530, segments: ["VIP"] },
  { id: 1, name: "Suresh Rajan", initials: "SR", birthday: false, fav: "Chicken Biryani, Butter Naan", mobile: "9841022334", whatsapp: true, visits: 18, spend: 31480, lastVisit: "1 d ago", branch: "Anna Nagar", points: 1240, segments: ["VIP"] },
  { id: 12, name: "Fathima Begum", initials: "FB", birthday: false, fav: "Mutton Biryani, Brownie with Ice Cream", mobile: "9962887340", whatsapp: true, visits: 14, spend: 24780, lastVisit: "6 d ago", branch: "Anna Nagar", points: 1010, segments: ["VIP"] },
  { id: 6, name: "Divya Prakash", initials: "DP", birthday: true, fav: "Veg Biryani, Gobi Manchurian", mobile: "9003344581", whatsapp: true, visits: 12, spend: 17640, lastVisit: "5 d ago", branch: "Anna Nagar", points: 760, segments: ["Regular"] },
  { id: 3, name: "Arjun Venkat", initials: "AV", birthday: false, fav: "Kothu Parotta, Mint Mojito", mobile: "9884412765", whatsapp: true, visits: 9, spend: 11250, lastVisit: "2 d ago", branch: "T Nagar", points: 410, segments: ["Regular"] },
  { id: 14, name: "Gayathri Iyer", initials: "GI", birthday: false, fav: "Dal Tadka, Tandoori Roti", mobile: "9884560231", whatsapp: true, visits: 8, spend: 10940, lastVisit: "12 d ago", branch: "Anna Nagar", points: 450, segments: ["Regular"] },
  { id: 9, name: "Prakash Kumar", initials: "PK", birthday: false, fav: "Butter Chicken, Butter Naan", mobile: "9789123450", whatsapp: true, visits: 7, spend: 9330, lastVisit: "18 d ago", branch: "OMR", points: 380, segments: ["Regular"] },
  { id: 10, name: "Sangeetha M", initials: "SM", birthday: false, fav: "Idli (2 pcs), Filter Coffee", mobile: "9941255612", whatsapp: false, visits: 5, spend: 5980, lastVisit: "34 d ago", branch: "Anna Nagar", points: 210, segments: ["Regular", "Lapsed"] },
  { id: 5, name: "Karthikeyan S", initials: "KS", birthday: false, fav: "Chicken 65, Masala Chai", mobile: "9791288340", whatsapp: false, visits: 3, spend: 2860, lastVisit: "41 d ago", branch: "OMR", points: 120, segments: ["Lapsed"] },
  { id: 11, name: "Naveen Chandran", initials: "NC", birthday: false, fav: "Chicken 65, Mint Mojito", mobile: "9840631187", whatsapp: true, visits: 2, spend: 2210, lastVisit: "2 d ago", branch: "T Nagar", points: 90, segments: ["New"] },
  { id: 8, name: "Anitha Rao", initials: "AR", birthday: false, fav: "Masala Dosa, Filter Coffee", mobile: "9884090921", whatsapp: true, visits: 1, spend: 1420, lastVisit: "Today", branch: "Anna Nagar", points: 60, segments: ["New"] },
  { id: 13, name: "Rahul Menon", initials: "RM", birthday: false, fav: "Paneer Tikka, Fresh Lime Soda", mobile: "9003911276", whatsapp: true, visits: 1, spend: 980, lastVisit: "Today", branch: "OMR", points: 40, segments: ["New"] },
];

const FILTERS = ["All", "VIP", "Regular", "New", "Lapsed", "Birthday"];

const PROFILE_DETAILS = {
  4: {
    birthday: "02 Nov",
    anniversary: "22 May",
    since: "14 Apr",
    favourites: ["Paneer Butter Masala", "Garlic Naan", "Mango Lassi"],
    feedback: [
      { stars: 5, text: "Great service by Priya." },
      { stars: 4, text: "AC was a bit cold." },
    ],
    bills: [
      { no: "AN-0020", amount: 851 },
      { no: "AN-0014", amount: 462 },
      { no: "OM-0022", amount: 567 },
    ],
    messagesToday: 2,
  },
  2: {
    birthday: "05 Nov",
    anniversary: "12 Feb",
    since: "03 Mar",
    feedback: [{ stars: 5, text: "Biryani was perfect as always." }],
    bills: [{ no: "AN-0021", amount: 1240 }],
    messagesToday: 1,
  },
  7: {
    birthday: "19 Aug",
    since: "21 May",
    feedback: [{ stars: 4, text: "Tikka was slightly dry." }],
    messagesToday: 0,
  },
  1: {
    birthday: "08 Jan",
    anniversary: "30 Nov",
    since: "11 Jun",
    feedback: [{ stars: 5, text: "Quick delivery of the order." }],
    messagesToday: 0,
  },
  12: {
    birthday: "14 Sep",
    since: "02 Jul",
    feedback: [
      { stars: 5, text: "Loved the brownie." },
      { stars: 3, text: "Waited 20 minutes for a table." },
    ],
    messagesToday: 0,
  },
  6: {
    birthday: "07 Nov",
    since: "18 Jul",
    feedback: [{ stars: 4, text: "Good veg options." }],
    messagesToday: 1,
  },
  3: { birthday: "23 Mar", since: "09 Aug", messagesToday: 0 },
  14: {
    birthday: "29 Jun",
    since: "15 Aug",
    feedback: [{ stars: 4, text: "Dal Tadka was tasty." }],
    messagesToday: 0,
  },
  9: { birthday: "01 Dec", since: "27 Aug", messagesToday: 0 },
  10: {
    birthday: "16 Apr",
    since: "05 Sep",
    feedback: [{ stars: 3, text: "Coffee was lukewarm." }],
    messagesToday: 0,
  },
  5: { birthday: "11 Oct", since: "20 Sep", messagesToday: 0 },
  11: { birthday: "25 Jul", since: "28 Oct", messagesToday: 0 },
  8: {
    birthday: "13 May",
    since: "03 Nov",
    bills: [{ no: "AN-0019", amount: 1420 }],
    messagesToday: 0,
  },
  13: {
    birthday: "09 Feb",
    since: "03 Nov",
    bills: [{ no: "OM-0018", amount: 980 }],
    messagesToday: 0,
  },
};

const SEGMENT_CLASS = {
  VIP: "crm-pill--vip",
  Regular: "crm-pill--regular",
  New: "crm-pill--new",
  Lapsed: "crm-pill--lapsed",
};

const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

function matchesFilter(c, filter) {
  if (filter === "All") return true;
  if (filter === "Birthday") return c.birthday;
  return c.segments.includes(filter);
}

export default function CRM() {
  const [filter, setFilter] = useState("All");
  const [customers, setCustomers] = useState(CUSTOMERS);
  const [selectedId, setSelectedId] = useState(null);
  const navigate=useNavigate()

  const selected = useMemo(() => {
    const c = customers.find((x) => x.id === selectedId);
    if (!c) return null;
    return {
      favourites: c.fav.split(", "),
      ...c,
      ...PROFILE_DETAILS[c.id],
    };
  }, [customers, selectedId]);

  const closeModal = useCallback(() => setSelectedId(null), []);


  const counts = useMemo(() => {
    return Object.fromEntries(
      FILTERS.map((f) => [
        f,
        customers.filter((c) => matchesFilter(c, f)).length,
      ])
    );
  }, [customers]);


  const stats = useMemo(() => {
    const n = customers.length || 1;
    const totalSpend = customers.reduce((s, c) => s + c.spend, 0);
    const totalVisits = customers.reduce((s, c) => s + c.visits, 0);
    return {
      ltv: totalSpend / n,
      avgBill: totalSpend / (totalVisits || 1),
      repeat: Math.round((customers.filter((c) => c.visits > 1).length / n) * 100),
      optIn: Math.round((customers.filter((c) => c.whatsapp).length / n) * 100),
    };
  }, [customers]);

  const rows = useMemo(() => customers.filter((c) => matchesFilter(c, filter)), [customers, filter]);

  const metrics = [
    { label: "Lifetime value (avg)", value: inr(stats.ltv), tone: "amber" },
    { label: "Avg bill value", value: inr(stats.avgBill), tone: "blue" },
    { label: "Repeat rate", value: stats.repeat + "%", tone: "green" },
    { label: "WhatsApp opt-in", value: stats.optIn + "%", tone: "whatsapp" },
  ];

  return (
    <section className="crm-panel">
      <header className="crm-header">
        <h2 className="crm-title">
          <span aria-hidden="true">👥</span> Customer CRM
          <span className="crm-count-badge">{customers.length} profiles</span>
        </h2>

        <div className="crm-filters" role="group" aria-label="Filter customers">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className={"crm-filter" + (filter === f ? " crm-filter--active" : "")}
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f}
              <span className="crm-filter__count">{counts[f]}</span>
            </button>
          ))}
        </div>
      </header>

      <div className="crm-metrics">
        {metrics.map((m) => (
          <div key={m.label} className={`crm-metric crm-metric--${m.tone}`}>
            <div className="crm-metric__label">{m.label}</div>
            <div className="crm-metric__value">{m.value}</div>
          </div>
        ))}
      </div>

      <div className="crm-table-wrap">
        <table className="crm-table">
          <thead>
            <tr>
              <th>Guest</th>
              <th>Mobile</th>
              <th className="crm-right">Visits</th>
              <th className="crm-right">Total spend</th>
              <th className="crm-right">Avg bill</th>
              <th>Last visit</th>
              <th>Branch</th>
              <th className="crm-right">Points</th>
              <th>Segment</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id}>
                <td>
                  <div className="crm-guest">
                    <span className="crm-avatar">{c.initials}</span>
                    <div className="crm-guest__text">
                      <span className="crm-guest__name">
                        {c.name} {c.birthday && <span title="Birthday soon">🎂</span>}
                      </span>
                      <span className="crm-guest__fav">Fav: {c.fav}</span>
                    </div>
                  </div>
                </td>
                <td className="crm-mono">
                  {c.mobile}{" "}
                  {c.whatsapp && <span className="crm-wa-dot" title="WhatsApp opt-in">●</span>}
                </td>
                <td className="crm-mono crm-right">{c.visits}</td>
                <td className="crm-mono crm-right">{inr(c.spend)}</td>
                <td className="crm-mono crm-right">{inr(c.spend / c.visits)}</td>
                <td>{c.lastVisit}</td>
                <td>{c.branch}</td>
                <td className="crm-mono crm-right">{c.points}</td>
                <td>
                  {c.segments.map((s) => (
                    <span key={s} className={`crm-pill ${SEGMENT_CLASS[s]}`}>{s}</span>
                  ))}
                </td>
                <td>
                  <button type="button" className="crm-profile-btn" onClick={() => setSelectedId(c.id)}>
                    Profile
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={10} className="crm-empty">No customers in this segment.</td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
         <div className="customer-actions">
          <button onClick={() => navigate('/admin/customers')} className="staff-back-btn">
            <ArrowLeft size={14} />  Customers
          </button>
        </div>
      {selectedId &&
        <CustomerProfileModal customer={selected} onClose={closeModal} />}
    </section>
  );
}
