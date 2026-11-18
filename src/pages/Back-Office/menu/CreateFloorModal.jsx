import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addFloor, getFloorsTables } from "../../../redux/Floors/FloorSlice";
import MenuModal from "./MenuModal"; // adjust path

export default function CreateFloorModal({ onClose }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((s) => s.floors);

  const [form, setForm] = useState({
    floorName: "",
    floorCode: "",
    description: "",
    displayOrder: 1,
  });

  const [table, setTable] = useState({
    tableName: "",
    seatingCapacity: "",
    displayOrder: 1,
  });

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setTableField = (k, v) => setTable((t) => ({ ...t, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // a blank table name means no table is sent
    const hasTable = table.tableName.trim() !== "";


    const payload = {
      floorName: form.floorName.trim(),
      floorCode: form.floorCode.trim().toUpperCase(),
      description: form.description.trim(),
      displayOrder: Number(form.displayOrder) || 0,
      tables: hasTable
        ? [
            {
              tableName: table.tableName.trim(),
              seatingCapacity: Number(table.seatingCapacity),
              displayOrder: Number(table.displayOrder) || 1,
            },
          ]
        : [],
    };

    try {
      await dispatch(addFloor(payload)).unwrap();
      toast.success(`Floor "${payload.floorName}" created successfully`);
      dispatch(getFloorsTables()); // refresh floors + tables
      onClose();
    } catch (err) {
      toast.error(typeof err === "string" ? err : err?.message || "Could not create floor.");
    }
  };

  return (
    <MenuModal
      title="Create floor"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="rm-btn" disabled={loading} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" form="create-floor-form" className="rm-btn rm-btn--primary" disabled={loading}>
            {loading ? "Saving…" : "Create floor"}
          </button>
        </>
      }
    >
      <form id="create-floor-form" className="cl-grid" onSubmit={submit}>
        <label className="rm-field">
          <span>Floor name</span>
          <input
            className="rm-input"
            value={form.floorName}
            disabled={loading}
            onChange={(e) => setField("floorName", e.target.value)}
            placeholder="Terrace"
          />
        </label>

        <label className="rm-field">
          <span>Floor code</span>
          <input
            className="rm-input"
            value={form.floorCode}
            disabled={loading}
            onChange={(e) => setField("floorCode", e.target.value)}
            placeholder="TERRACE"
          />
        </label>

        <label className="rm-field">
          <span>Display order</span>
          <input
            className="rm-input"
            type="number"
            min="0"
            value={form.displayOrder}
            disabled={loading}
            onChange={(e) => setField("displayOrder", e.target.value)}
          />
        </label>

        <label className="rm-field cl-grid__full">
          <span>Description</span>
          <textarea
            className="rm-input rm-textarea"
            rows={3}
            value={form.description}
            disabled={loading}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="Outdoor dining area"
          />
        </label>

        {/* Table */}
        <div className="rm-table-row cl-grid__full">
          <label className="rm-field">
            <span>Table name</span>
            <input
              className="rm-input"
              placeholder="R1"
              value={table.tableName}
              disabled={loading}
              onChange={(e) => setTableField("tableName", e.target.value)}
            />
          </label>

          <label className="rm-field">
            <span>Seating capacity</span>
            <input
              className="rm-input"
              type="number"
              min="1"
              placeholder="e.g. 4"
              value={table.seatingCapacity}
              disabled={loading}
              onChange={(e) => setTableField("seatingCapacity", e.target.value)}
            />
          </label>

          <label className="rm-field">
            <span>Display order</span>
            <input
              className="rm-input"
              type="number"
              min="0"
              value={table.displayOrder}
              disabled={loading}
              onChange={(e) => setTableField("displayOrder", e.target.value)}
            />
          </label>
        </div>
      </form>
    </MenuModal>
  );
}