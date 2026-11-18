
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "../../../assets/styles/floor.css";

import { getFloorsTables } from "../../../redux/Floors/FloorSlice";

import { FloorHeader } from "./FloorHeader";
import { FloorLegend } from "./FloorLegend";
import { FloorTable } from "./FloorTable";
import { FloorModal } from "./FloorModal";

const Floor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { floors = [], loading } = useSelector(
    (state) => state.floors
  );

  const [section, setSection] = useState("All");
  const [myTables, setMyTables] = useState(false);

  const [modalType, setModalType] = useState("");
  const [selectedTable, setSelectedTable] = useState(null);
  const [guests, setGuests] = useState(1);

  const [customerName, setCustomerName] = useState("");
  const [mobile, setMobile] = useState("");
  const [channel, setChannel] = useState("Swiggy");

  /* ====================== GET FLOORS ====================== */

  useEffect(() => {
    dispatch(getFloorsTables());
  }, [dispatch]);

  /* ====================== NORMALIZE FLOORS ====================== */

  const normalizedFloors = useMemo(
    () =>
      [...floors]
        .sort(
          (a, b) =>
            (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
        )
        .map((floor) => ({
          id: floor._id,
          floorId: floor._id,
          name: floor.floorName,
          tables: [...(floor.tables || [])]
            .sort(
              (a, b) =>
                (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
            )
            .map((table) => ({
              id: table._id,
              tableId: table._id,
              tableName: table.tableName,
              name: table.tableName,

              floorId: floor._id,
              floorName: floor.floorName,

              seats: table.seatingCapacity,
              occupiedSeats: table.occupiedSeats,
              availableSeats: table.availableSeats,
              occupancyStatus: table.occupancyStatus,

              orders: (table.currentOrders || []).map((order) => ({
                id: order._id,
                tableId: order.tableId,
                pax: order.numberOfGuests,
                status: order.orderStatus,
                paymentStatus: order.paymentStatus,
                cust: {
                  name: order.customerName,
                },
                items: order.items || [],
                total: order.totalAmount,
                created: order.createdAt
                  ? new Date(order.createdAt).getTime()
                  : null,
              })),
            })),
        })),
    [floors]
  );

  /* ====================== FLOOR SECTIONS ====================== */

  const sections = useMemo(
    () => [
      "All",
      ...normalizedFloors.map((floor) => floor.name),
    ],
    [normalizedFloors]
  );

  const allTables = useMemo(
    () => normalizedFloors.flatMap((floor) => floor.tables),
    [normalizedFloors]
  );

  const getStatus = (table) => table.occupancyStatus;

  /* ====================== HELPERS ====================== */

  function getMinutes(created) {
    if (!created) return null;

    return Math.max(
      0,
      Math.floor((Date.now() - created) / 60000)
    );
  }

  function getTotal(order) {
    if (order?.total != null) {
      return Number(order.total) || 0;
    }

    return (order?.items || []).reduce(
      (sum, item) =>
        sum +
        (Number(item.price) || 0) *
          (Number(item.qty) || 0),
      0
    );
  }

  /* ====================== OPEN TABLE ====================== */

  function openTable(table) {
    setSelectedTable(table);

    setGuests(
      Math.max(
        1,
        Math.min(
          2,
          Number(table.availableSeats) || 1
        )
      )
    );

    setCustomerName("");
    setModalType("table");
  }

  /* ====================== CLOSE MODAL ====================== */

  function closeModal() {
    setModalType("");
    setSelectedTable(null);
  }

  /* ====================== START NEW DINE-IN ORDER ====================== */

  function startOrder({
      customerName: tableCustomerName,
  }) {
    if (!selectedTable) {
      toast.error("Please select a table.");
      return;
    }

    const table = selectedTable;

    if (!Number(guests) || Number(guests) < 1) {
      toast.warning("Enter at least 1 guest.");
      return;
    }

    if (Number(guests) > Number(table.availableSeats)) {
      toast.warning(
        `Only ${table.availableSeats} seats available.`
      );
      return;
    }

    if (!table.floorId || !table.tableId) {
      toast.error("Floor ID or Table ID is missing.");
     return;
    }

    const tableData = {
      floorId: table.floorId,
      tableId: table.tableId,
      tableName: table.tableName,
      floorName: table.floorName,
    };

    navigate("/captain/order", {
      state: {
        table: tableData,
        guests: Number(guests),
        customerName: tableCustomerName?.trim() || "Customer",
      },
    });

    closeModal();
  }

  /* ====================== TAKEAWAY / DELIVERY ====================== */

  function openTakeaway(type) {
    setCustomerName("");
    setMobile("");
    setChannel("Swiggy");
    setModalType(type);
  }

  function startTakeawayOrder() {
    if (modalType !== "take" && modalType !== "del") {
      return;
    }

    navigate("/captain/order", {
      state: {
        type: modalType,
        customer: {
          name: customerName.trim(),
          mobile: mobile.trim(),
        },
        customerName: customerName.trim(),
        channel: modalType === "del" ? channel : null,
      },
    });

    closeModal();
  }

  /* ====================== VISIBLE FLOORS ====================== */

  const visibleFloors =
    section === "All"
      ? normalizedFloors
      : normalizedFloors.filter(
          (floor) => floor.name === section
        );

  const occupied = allTables.filter(
    (table) => table.orders.length > 0
  ).length;

  /* ====================== RENDER ====================== */

  return (
    <section
      className="floor-pnl floor-act"
      id="p-floor"
    >
      <FloorHeader
        sections={sections}
        section={section}
        setSection={setSection}
        occupied={occupied}
        totalTables={allTables.length}
        myTables={myTables}
        setMyTables={setMyTables}
        onTakeaway={() => openTakeaway("take")}
        onDelivery={() => openTakeaway("del")}
      />

      <FloorLegend
        tables={allTables}
        getStatus={getStatus}
      />

      <div className="floor-scroll floor-pad">
        {loading && floors.length === 0 && (
          <div className="floor-sec-h">
            Loading floors…
          </div>
        )}
    

        {!loading  && floors.length === 0 && (
          <div className="floor-sec-h">
            No floors found.
          </div>
        )}

        {visibleFloors.map((floor, index) => (
          <div key={floor.id}>
            <div
              className="floor-sec-h"
              style={{
                marginTop: index === 0 ? 0 : 14,
              }}
            >
              {floor.name}
            </div>

            <div className="floor-tgrid">
              {floor.tables.map((table) => {
                const order = table.orders[0] || null;

                return (
                  <FloorTable
                    key={table.tableId}
                    table={table}
                    order={order}
                    status={getStatus(table)}
                    getMinutes={getMinutes}
                    getTotal={getTotal}
                    onClick={() => openTable(table)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <FloorModal
        modalType={modalType}
        selectedTable={selectedTable}
        guests={guests}
        setGuests={setGuests}
        customerName={customerName}
        setCustomerName={setCustomerName}
        mobile={mobile}
        setMobile={setMobile}
        channel={channel}
        setChannel={setChannel}
        onClose={closeModal}
        onCreateTable={startOrder}
        onCreateTakeaway={startTakeawayOrder}
      />
    </section>
  );
};

export default Floor;
