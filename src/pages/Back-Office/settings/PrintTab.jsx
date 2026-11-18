import { useState } from "react";
import { Button, Card, NumberField, SelectField, TextField, Toggle } from "./UiSet";
import Modal from "./SettingModal";
import { KotTicket, PrinterTestTicket, ReceiptTicket } from "./ThermalTickets";

const PAPER = [{ value: "58", label: "58 mm" }, { value: "80", label: "80 mm" }];
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

export default function PrintTab({ receipt, kot, printers, org, brand, update, updatePrinter }) {
  // null | { type: "receipt" } | { type: "kot" } | { type: "printer", printer }
  const [preview, setPreview] = useState(null);
  const closePreview = () => setPreview(null);

  const setReceipt = (patch) => update("receipt", patch);
  const setKot = (patch) => update("kot", patch);
  const printerOptions = printers.map((p) => ({ value: p.id, label: p.name }));

  return (
    <div className="stg-grid">
      <Card title="Billing receipt">
        <SelectField label="Bill printer" value={receipt.printer} options={printerOptions} onChange={(v) => setReceipt({ printer: v })} />
        <SelectField label="Connection" value={receipt.conn} options={["LAN", "USB", "Bluetooth", "Cloud print"]} onChange={(v) => setReceipt({ conn: v })} />
        <SelectField label="Paper width" value={receipt.paper} options={PAPER} onChange={(v) => setReceipt({ paper: v })} />
        <NumberField label="Copies" min={1} max={5} value={receipt.copies} onChange={(v) => setReceipt({ copies: clamp(v, 1, 5) })} />
        <SelectField
          label="Paper cut"
          value={receipt.cut}
          options={[{ value: "full", label: "Full cut" }, { value: "partial", label: "Partial cut" }, { value: "none", label: "No cut" }]}
          onChange={(v) => setReceipt({ cut: v })}
        />
        <SelectField label="Provisional bill printer" value={receipt.provPrinter} options={printerOptions} onChange={(v) => setReceipt({ provPrinter: v })} />
        <SelectField label="Z-report printer" value={receipt.zPrinter} options={printerOptions} onChange={(v) => setReceipt({ zPrinter: v })} />
        <TextField label="Header line" value={receipt.hdr} placeholder="Address, phone" onChange={(v) => setReceipt({ hdr: v })} />
        <TextField label="Footer line" value={receipt.ftr} onChange={(v) => setReceipt({ ftr: v })} />

        <Toggle label="Open cash drawer on cash payment" checked={receipt.drawer} onChange={(v) => setReceipt({ drawer: v })} />
        <Toggle label="Print UPI / payment QR" checked={receipt.qr} onChange={(v) => setReceipt({ qr: v })} />
        <Toggle label="Print logo" checked={receipt.showLogo} onChange={(v) => setReceipt({ showLogo: v })} />
        <Toggle label="Print tax number" checked={receipt.showTaxId} onChange={(v) => setReceipt({ showTaxId: v })} />
        <Toggle label="Print automatically after payment" checked={receipt.autoPrint} onChange={(v) => setReceipt({ autoPrint: v })} />

        <div className="stg-row--top">
          <Button variant="primary" icon="printer" onClick={() => setPreview({ type: "receipt" })}>Print test receipt</Button>
        </div>
      </Card>

      <Card title="Kitchen order tickets (KOT)">
        <SelectField
          label="Print mode"
          value={kot.mode}
          options={[{ value: "station", label: "One ticket per station" }, { value: "all", label: "One ticket for the whole order" }]}
          onChange={(v) => setKot({ mode: v })}
        />
        <SelectField label="Paper width" value={kot.paper} options={PAPER} onChange={(v) => setKot({ paper: v })} />
        <SelectField
          label="Font size"
          value={kot.fontSize}
          options={[{ value: "normal", label: "Normal" }, { value: "large", label: "Large" }]}
          onChange={(v) => setKot({ fontSize: v })}
        />
        <NumberField label="Copies per ticket" min={1} max={3} value={kot.copies} onChange={(v) => setKot({ copies: clamp(v, 1, 3) })} />

        <Toggle label="Print when items are sent to the kitchen" checked={kot.auto} onChange={(v) => setKot({ auto: v })} />
        <Toggle label="Print item instructions" checked={kot.notes} onChange={(v) => setKot({ notes: v })} />
        <Toggle label="Beep on new ticket" checked={kot.beep} onChange={(v) => setKot({ beep: v })} />

        <div className="stg-row--top">
          <Button variant="primary" icon="printer" onClick={() => setPreview({ type: "kot" })}>Print test KOT</Button>
        </div>
      </Card>

      <Card title="Printers" wide>
        <div className="stg-table-wrap">
          <table className="stg-table">
            <thead>
              <tr>
                <th>Printer</th>
                <th>Station</th>
                <th>IP address</th>
                <th>On</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {printers.map((p) => (
                <tr key={p.id}>
                  <td>
                    <b>{p.name}</b>
                    <span className="stg-table__sub">{p.model}</span>
                  </td>
                  <td>{p.station}</td>
                  <td>
                    <input
                      className="stg-input stg-input--ip"
                      value={p.ip}
                      onChange={(e) => updatePrinter(p.id, { ip: e.target.value })}
                    />
                  </td>
                  <td>
                    <label className="stg-toggle stg-toggle--bare">
                      <input type="checkbox" checked={p.on} onChange={(e) => updatePrinter(p.id, { on: e.target.checked })} />
                      <i aria-hidden="true" />
                    </label>
                  </td>
                  <td>
                    <Button icon="printer" onClick={() => setPreview({ type: "printer", printer: p })}>Test</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="stg-hint">
          A browser cannot reach LAN thermal printers directly. Live printing needs a print service or WebUSB; these settings are saved for it.
        </p>
      </Card>

      {preview?.type === "receipt" && (
        <Modal title="Test receipt" onClose={closePreview} onPrint={() => window.print()}>
          <ReceiptTicket receipt={receipt} org={org} brand={brand} />
        </Modal>
      )}
      {preview?.type === "kot" && (
        <Modal title="Test KOT" onClose={closePreview} onPrint={() => window.print()}>
          <KotTicket kot={kot} org={org} brand={brand} />
        </Modal>
      )}
      {preview?.type === "printer" && (
        <Modal title={`Test ${preview.printer.name}`} onClose={closePreview} onPrint={() => window.print()}>
          <PrinterTestTicket printer={preview.printer} paper={receipt.paper} />
        </Modal>
      )}
    </div>
  );
}
