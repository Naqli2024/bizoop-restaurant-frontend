import { COUNTRIES } from "./DataSet";

/** Paper wrapper – width follows the 58 / 80 mm setting. */
function Paper({ paper = "80", size = "normal", children }) {
  return (
    <div className="stg-thermal" data-paper={paper} data-size={size}>
      {children}
    </div>
  );
}

const Rule = () => <hr className="stg-thermal__rule" />;

/* ------------------------------------------------------------------ */

const RECEIPT_ITEMS = [
  { qty: 2, name: "Butter Naan" },
  { qty: 1, name: "Paneer Tikka" },
];

export function ReceiptTicket({ receipt, org, brand }) {
  const country = COUNTRIES[org.country] ?? COUNTRIES.IN;
  const name = (brand.name || org.trade || "Your restaurant").toUpperCase();

  return (
    <Paper paper={receipt.paper}>
      {receipt.showLogo && brand.logo && (
        <div className="stg-thermal__center">
          <img className="stg-thermal__logo" src={brand.logo} alt="" />
        </div>
      )}
      <div className="stg-thermal__center stg-thermal__big">{name}</div>
      <div className="stg-thermal__center">{receipt.hdr}</div>
      <Rule />
      {RECEIPT_ITEMS.map((i) => (
        <div className="stg-thermal__item" key={i.name}>
          <span className="stg-thermal__qty">{i.qty}×</span>
          <span>{i.name}</span>
        </div>
      ))}
      <Rule />
      {receipt.showTaxId && org.taxId && (
        <div className="stg-thermal__center">{country.idLabel} {org.taxId}</div>
      )}
      <div className="stg-thermal__center">{receipt.ftr}</div>
    </Paper>
  );
}

/* ------------------------------------------------------------------ */

const KOT_ITEMS = [
  { qty: 2, name: "Chicken 65", note: "less spicy" },
  { qty: 1, name: "Garlic Naan" },
];

export function KotTicket({ kot, org, brand }) {
  const name = brand.name || org.trade || "Your restaurant";

  return (
    <Paper paper={kot.paper} size={kot.fontSize}>
      <div className="stg-thermal__center stg-thermal__big">{name}</div>
      <div className="stg-thermal__center stg-thermal__bold">** KITCHEN ORDER TICKET **</div>
      <div className="stg-thermal__center">Table T4 · KOT-0001</div>
      <Rule />
      {KOT_ITEMS.map((i) => (
        <div className="stg-thermal__item" key={i.name}>
          <span className="stg-thermal__qty">{i.qty}×</span>
          <span>
            {i.name}
            {kot.notes && i.note && (
              <>
                <br />
                <i>› {i.note}</i>
              </>
            )}
          </span>
        </div>
      ))}
    </Paper>
  );
}

/* ------------------------------------------------------------------ */

export function PrinterTestTicket({ printer, paper }) {
  return (
    <Paper paper={paper}>
      <div className="stg-thermal__center stg-thermal__big">TEST PAGE</div>
      <div className="stg-thermal__center stg-thermal__bold">{printer.name}</div>
      <Rule />
      <div>Model: {printer.model}</div>
      <div>Station: {printer.station}</div>
      <div>IP: {printer.ip}</div>
      <Rule />
      <div className="stg-thermal__center">If you can read this, the printer is connected.</div>
    </Paper>
  );
}
