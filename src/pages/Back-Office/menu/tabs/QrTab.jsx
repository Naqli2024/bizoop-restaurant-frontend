import { QRCodeCanvas } from "qrcode.react"; // npm i qrcode.react
import { FLOOR, SEATS } from "../MenuData";
import { Printer } from "lucide-react";

export default function QrTab({ urlFor,onPrint,onOpen}) {
  const download = (id) => {
    const canvas = document.querySelector(`#rm-qr-${id} canvas`);
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png"); a.download = `table-${id}.png`; a.click();
  };
  return (
    <>
      <div className="rm-row rm-row--between" style={{ marginBottom: 12 }}>
        <span className="rm-muted">Each QR opens the guest menu for that table: Spice Route → Anna Nagar → floor → table.</span>
        <button className="rm-btn rm-btn--primary" onClick={onPrint}><Printer size={16}/> Print all</button>
      </div>
      <div className="rm-grid3">
        {FLOOR.map((t) => (
          <div className="rm-card rm-qr" key={t.id}>
            <div className="rm-qr__code" id={`rm-qr-${t.id}`}><QRCodeCanvas value={urlFor(t.id)} size={120} /></div>
            <b>Table {t.id}</b>
            <div className="rm-muted">{t.zone} · {SEATS[t.id]} seats</div>
            <div className="rm-row" style={{ justifyContent: "center", marginTop: 8 }}>
              <button className="rm-btn" onClick={() => download(t.id)}>⭳ Download</button>
              <button className="rm-btn" onClick={()=>onOpen(t.id)}>Open</button>
            </div>
          </div>
        ))}
      </div>
      <p className="rm-muted">Guest ordering works inside this app. Phones scanning a QR will only share orders with staff once the app runs on a shared server.</p>
    </>
  );
}
