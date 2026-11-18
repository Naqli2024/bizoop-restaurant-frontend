import { QRCodeCanvas } from "qrcode.react";
import Modal from "../menu/MenuModal";
import { FLOOR } from "./MenuData";
import { Printer } from "lucide-react";

export default function QrPrintModal({ urlFor, restaurant = "Spice Route", onClose }) {
  return (
    <Modal
      title="Table QR codes"
      size="lg"
      onClose={onClose}
      footer={
        <>
          <button className="rm-btn" onClick={onClose}>✕ Close</button>
          <button className="rm-btn rm-btn--primary" onClick={() => window.print()}><Printer size={16}/>Print</button>
        </>
      }
    >
      <div className="rm-qr-grid">
        {FLOOR.map((t) => (
          <div className="rm-card rm-qr" key={t.id} title={urlFor(t.id)}>
            <div className="rm-qr__brand">{restaurant}</div>
            <div className="rm-qr__code"><QRCodeCanvas value={urlFor(t.id)} size={110} /></div>
            <b>Table {t.id}</b>
            <div className="rm-muted">{t.zone}</div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
