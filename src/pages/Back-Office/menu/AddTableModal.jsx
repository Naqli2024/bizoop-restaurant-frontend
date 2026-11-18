import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addTable, getFloorsTables } from "../../../redux/Floors/FloorSlice";
import MenuModal from "./MenuModal"; // adjust path

export default function AddTableModal({ floors = [], defaultFloorId = "", onClose }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((s) => s.floors);

  const [floorId, setFloorId] = useState(defaultFloorId || floors[0]?._id || "");
  const [form, setForm] = useState({ tableName: "", seatingCapacity: 4, displayOrder: 1 });

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    
    const payload = {
      tableName: form.tableName.trim(),
      seatingCapacity: Number(form.seatingCapacity) || 1,
      displayOrder: Number(form.displayOrder) || 0,
    };

    try {
      await dispatch(addTable({ floorId, payload })).unwrap();
      toast.success(`Table "${payload.tableName}" added successfully`);
      dispatch(getFloorsTables()); // refresh floors + tables
      onClose();
    } catch (err) {
      toast.error(typeof err === "string" ? err : err?.message || "Could not add table.");
    }
  };

  return (
    <MenuModal
      title="Add table"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="rm-btn" disabled={loading} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" form="add-table-form" className="rm-btn rm-btn--primary" disabled={loading}>
            {loading ? "Adding…" : "Add table"}
          </button>
        </>
      }
    >
      <form id="add-table-form" className="cl-grid" onSubmit={submit}>
        <label className="rm-field cl-grid__full">
          <span>Floor</span>
          <select
            className="rm-input"
            value={floorId}
            disabled={loading}
            onChange={(e) => setFloorId(e.target.value)}
          >
            {floors.map((f) => (
              <option key={f._id} value={f._id}>{f.floorName}</option>
            ))}
          </select>
        </label>

        <label className="rm-field cl-grid__full">
          <span>Table name</span>
          <input
            className="rm-input"
            value={form.tableName}
            disabled={loading}
            onChange={(e) => setField("tableName", e.target.value)}
            placeholder="R3"
          />
        </label>

        <label className="rm-field">
          <span>Seating capacity</span>
          <input
            className="rm-input"
            type="number"
            min="1"
            value={form.seatingCapacity}
            disabled={loading}
            onChange={(e) => setField("seatingCapacity", e.target.value)}
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
      </form>
    </MenuModal>
  );
}