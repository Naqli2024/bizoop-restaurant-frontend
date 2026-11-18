/* ---------- data ---------- */
// [id, icon, name, category, price, cost|null, portionsLeft|null, veg, sold, class, subtitle]
export const RAW = [
  [1,"🍗","Chicken 65","Starters",220,52,110,0,32,"star"],
  [2,"🥦","Gobi Manchurian","Starters",170,null,null,1,0,"star"],
  [3,"🐟","Fish Fry","Starters",280,163,0,0,0,"dog"],
  [4,"🧀","Paneer Tikka","Starters",240,56,30,1,26,"star","பனீர் டிக்கா · पनीर टिक्का"],
  [5,"🍢","Chicken Tikka","Starters",260,47,110,0,0,"puzzle"],
  [6,"🍗","Tandoori Chicken (Half)","Starters",300,80,62,0,28,"star"],
  [7,"🧀","Paneer Butter Masala","Main Course",280,73,30,1,30,"star"],
  [8,"🍛","Butter Chicken","Main Course",320,71,75,0,29,"star"],
  [9,"🌶","Chicken Chettinad","Main Course",300,57,100,0,0,"puzzle"],
  [10,"🥣","Dal Tadka","Main Course",190,7,150,1,0,"puzzle"],
  [11,"🥘","Veg Kurma","Main Course",180,null,null,1,0,"puzzle"],
  [12,"🍚","Chicken Biryani","Biryani",220,96,55,0,0,"star","சிக்கன் பிரியாணி · चिकन बिरयानी"],
  [13,"🥩","Mutton Biryani","Biryani",320,234,16,0,28,"horse"],
  [14,"🍚","Veg Biryani","Biryani",180,45,55,1,0,"puzzle"],
  [15,"🥚","Egg Biryani","Biryani",190,51,55,0,0,"puzzle"],
  [16,"🫓","Butter Naan","Breads",60,10,180,1,50,"horse","பட்டர் நான் · बटर नान"],
  [17,"🫓","Garlic Naan","Breads",70,13,180,1,0,"horse"],
  [18,"🫓","Tandoori Roti","Breads",35,4,225,1,0,"dog"],
  [19,"🥞","Kerala Parotta","Breads",30,7,180,1,51,"horse"],
  [20,"🍳","Kothu Parotta","Tiffin",190,18,120,0,19,"star"],
  [21,"🥞","Masala Dosa","Tiffin",110,null,null,1,0,"dog","மசாலா தோசை · मसाला डोसा"],
  [22,"⚪","Idli (2 pcs)","Tiffin",60,null,null,1,0,"dog","இட்லி · इडली"],
  [23,"🍲","Ghee Pongal","Tiffin",90,null,null,1,0,"dog"],
  [24,"☕","Filter Coffee","Beverages",50,15,150,1,34,"horse","ஃபில்டர் காபி · फ़िल्टर कॉफ़ी"],
  [25,"🍵","Masala Chai","Beverages",40,7,208,1,0,"dog"],
  [26,"🍋","Fresh Lime Soda","Beverages",70,null,null,1,41,"horse"],
  [27,"🍹","Mint Mojito","Beverages",120,null,null,1,0,"puzzle"],
  [28,"🥭","Mango Lassi","Beverages",90,13,80,1,0,"dog"],
  [29,"🧋","Cold Coffee","Beverages",110,18,125,1,17,"horse"],
  [30,"🍡","Gulab Jamun (2)","Desserts",90,null,null,1,29,"horse","குலாப் ஜாமூன் · गुलाब जामुन"],
  [31,"🥥","Elaneer Payasam","Desserts",100,null,null,1,0,"dog"],
  [32,"🍨","Ice Cream Sundae","Desserts",140,null,null,1,0,"puzzle"],
  [33,"🍫","Brownie with Ice Cream","Desserts",160,null,null,1,25,"star"],
];
export const CHANNELS = ["qr", "waiter", "pos", "board", "kiosk", "web"];
export const CHANNEL_LABEL = { qr:"QR", waiter:"Waiter", pos:"POS", board:"Board", kiosk:"Kiosk", web:"Web" };
export const toItem = ([id, icon, name, cat, price, cost, left, veg, sold, cls, sub = ""]) => ({
  id, icon, name, cat, price, cost, left, veg: !!veg, sold, cls, sub,
  status: "pub", available: left !== 0,
  channels: Object.fromEntries(CHANNELS.map((c) => [c, true])),
});
export const margin = (i) => (i.cost == null ? null : Math.round(((i.price - i.cost) / i.price) * 100));
export const inr = (n) => "₹" + n.toLocaleString("en-IN");

export const CLASSES = {
  star:   { label: "Stars",         icon: "⭐", note: "Keep prominent and protect quality.",              pill: "ok",   one: "Star" },
  horse:  { label: "Plough horses", icon: "🐴", note: "Popular, thin margin. Review price or recipe cost.", pill: "warn", one: "Plough horse" },
  puzzle: { label: "Puzzles",       icon: "🧩", note: "Profitable but slow. Give it more visibility.",    pill: "grey", one: "Puzzle" },
  dog:    { label: "Dogs",          icon: "🗑", note: "Slow and thin. Consider removing.",                pill: "grey", one: "Dog" },
};
export const FLOOR = [
  ["T1", "AC Hall", "ordering", "Ordering", "2 items", 336, 25],
  ["T2", "AC Hall", "bill", "Bill requested", "4 items", 1092, 45],
  ["T3", "AC Hall", "free", "Free", "4 seats", 0, 0],
  ["T4", "AC Hall", "ready", "Food ready", "4 items", 1008, 18],
  ["T5", "AC Hall", "kitchen", "In kitchen", "2 items", 851, 32],
  ["T6", "AC Hall", "free", "Free", "2 seats", 0, 0],
  ["F1", "Family Hall", "free", "Free", "6 seats", 0, 0],
  ["F2", "Family Hall", "kitchen", "In kitchen", "6 items", 1880, 55],
  ["F3", "Family Hall", "served", "Dining", "4 items", 872, 65],
  ["F4", "Family Hall", "reserved", "Reserved", "6 seats", 0, 0],
  ["R1", "Terrace", "kitchen", "In kitchen", "3 items", 819, 40],
  ["R2", "Terrace", "free", "Free", "4 seats", 0, 0],
].map(([id, zone, state, label, meta, amount, openMins]) => ({
  id,
  zone,
  state,
  label,
  meta,
  amount,
  openMins,
}));

export const SEATS = { T1:4,T2:4,T3:4,T4:6,T5:2,T6:2,F1:6,F2:8,F3:4,F4:6,R1:4,R2:4 };

export const TABS = [
  ["dash","Menu intelligence"],["master","Menu master"],["ctl","Menu controller"],["scr","Screens"],
  ["design","Digital menu"],["qr","Tables & QR"],["live","Live floor"],["ana","Display analytics"],
];

export const INITIAL_ADDONS = {
  Biryani: [["Extra Raita",30],["Boiled Egg",20],["Extra Gravy",40]],
  Starters: [["Extra Dip",20]],
  "Main Course": [["Extra Gravy",40],["Extra Cheese",40]],
  Breads: [],
  Tiffin: [["Extra Chutney",15],["Ghee Roast",25]],
  Beverages: [["Less Sugar",0],["No Sugar",0],["Extra Ice",0]],
  Desserts: [["Extra Scoop",40]],
};

export const INITIAL_SCREENS = [
  { id:"S1", name:"Entrance display", location:"Entrance", group:"", slides:3, secs:26 },
  { id:"S2", name:"Main counter",     location:"Counter",  group:"", slides:5, secs:44 },
  { id:"S3", name:"Dining area",      location:"Dining",   group:"Dining area", slides:3, secs:28 },
  { id:"S4", name:"Drive-through",    location:"Outside",  group:"", slides:2, secs:16 },
  { id:"S5", name:"Screen 5",         location:"",         group:"", slides:1, secs:12 },
];

export const ANALYTICS_ROWS = [
  ["Entrance display", 7, "special 3 · offer 2 · welcome 2"],
  ["Main counter", 1, "welcome 1"],
  ["Dining area", 0, "—"], ["Drive-through", 0, "—"], ["Screen 5", 0, "—"],
];

