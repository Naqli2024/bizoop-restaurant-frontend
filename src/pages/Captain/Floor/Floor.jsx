
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../assets/styles/floor.css";

import {
  SECTIONS,
  INITIAL_TABLES,
  INITIAL_ORDERS,
} from "../Floor/FloorData";

import { FloorHeader } from "./FloorHeader";
import { FloorLegend } from "./FloorLegend";
import { FloorTable } from "./FloorTable";
import { FloorOrder } from "./FloorOrder";
import { FloorModal } from "./FloorModal";

const Floor = () => {
  const navigate = useNavigate();

  const [tables, setTables] = useState(INITIAL_TABLES);
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  const [section, setSection] = useState("All");
  const [myTables, setMyTables] = useState(false);
  const [currentCaptain, setCurrentCaptain] = useState("Ravi K.");

  const [modalType, setModalType] = useState("");
  const [selectedTable, setSelectedTable] = useState(null);
  const [guests, setGuests] = useState(2);

  const [customerName, setCustomerName] = useState("");
  const [mobile, setMobile] = useState("");
  const [channel, setChannel] = useState("Swiggy");

  const [nextOrderNumber, setNextOrderNumber] = useState(7);
  const [takeawayNumber, setTakeawayNumber] = useState(2);
  const [deliveryNumber, setDeliveryNumber] = useState(2);

  function getStatus(table) {
    const order = table.order ? orders[table.order] : null;
    if (order) return order.status;
    return table.res ? "res" : "free";
  }

  function getMinutes(created) {
    return Math.max(
      0,
      Math.floor((Date.now() - created) / 60000)
    );
  }

  function getTotal(order) {
    return (order?.items || []).reduce(
      (sum, item) =>
        sum + (Number(item.price) || 0) * (Number(item.qty) || 0),
      0
    );
  }

  const takeawayOrders = Object.values(orders).filter(
    (order) => order.type === "take" || order.type === "del"
  );

  function openOrder(orderId) {
    const selectedOrder = orders[orderId];

    if (!selectedOrder) return;

    navigate("/captain/order", {
      state: {
        order: selectedOrder,
        orderId: selectedOrder.id,
      },
    });
  }

  function openTable(table) {
    setSelectedTable(table);
    setGuests(Math.min(2, table.seats));
    setModalType("table");
  }

  function createTableOrder() {
    if (!selectedTable) return;

    const table = tables.find(
      (item) => item.id === selectedTable.id
    );

    if (!table || table.order) return;

    const id = `ORD-${String(nextOrderNumber).padStart(2, "0")}`;

    const order = {
      id,
      label: table.id,
      table: table.id,
      section: table.sec,
      type: "dine",
      captain: currentCaptain,
      pax: Math.max(1, Number(guests) || 2),
      status: "ordering",
      cust: {},
      items: [],
      created: Date.now(),
    };

    setOrders((previous) => ({
      ...previous,
      [id]: order,
    }));

    setTables((previous) =>
      previous.map((item) =>
        item.id === table.id
          ? { ...item, order: id, res: null }
          : item
      )
    );

    setNextOrderNumber((previous) => previous + 1);
    setModalType("");
    setSelectedTable(null);

    // Pass the new order directly because React state updates asynchronously.
    navigate("/captain/order", {
      state: {
        order,
        orderId: id,
      },
    });
  }

  function seatReservation(table) {
    if (!table.res) return;

    setSelectedTable({
      ...table,
      reservation: { ...table.res },
    });

    setGuests(table.res.p);
    setModalType("reservation");
  }

  function confirmReservation() {
    if (!selectedTable) return;

    const tableId = selectedTable.id;
    const reservedGuests = selectedTable.reservation?.p || 2;

    setTables((previous) =>
      previous.map((table) =>
        table.id === tableId
          ? { ...table, res: null }
          : table
      )
    );

    setSelectedTable({
      ...selectedTable,
      res: null,
      reservation: null,
    });

    setGuests(reservedGuests);
    setModalType("table");
  }

  function createTakeaway(type) {
    setCustomerName("");
    setMobile("");
    setChannel("Swiggy");
    setModalType(type);
  }

  function createTakeawayOrder() {
    const type = modalType;

    if (type !== "take" && type !== "del") return;

    const id = `ORD-${String(nextOrderNumber).padStart(2, "0")}`;

    const label =
      type === "take"
        ? `TA-${String(takeawayNumber).padStart(2, "0")}`
        : `DEL-${String(deliveryNumber).padStart(2, "0")}`;

    const order = {
      id,
      label,
      table: null,
      type,
      platform: type === "del" ? channel : "",
      captain: currentCaptain,
      pax: 1,
      status: "ordering",
      cust: {
        name: customerName.trim(),
        mobile: mobile.trim(),
      },
      items: [],
      created: Date.now(),
    };

    setOrders((previous) => ({
      ...previous,
      [id]: order,
    }));

    if (type === "take") {
      setTakeawayNumber((previous) => previous + 1);
    } else {
      setDeliveryNumber((previous) => previous + 1);
    }

    setNextOrderNumber((previous) => previous + 1);
    setModalType("");

    navigate("/captain/order", {
      state: {
        order,
        orderId: id,
      },
    });
  }

  const filteredSections =
    section === "All" ? SECTIONS.slice(1) : [section];

  const occupied = tables.filter(
    (table) => table.order && orders[table.order]
  ).length;

  return (
    <section className="floor-pnl floor-act" id="p-floor">
      <FloorHeader
        section={section}
        setSection={setSection}
        myTables={myTables}
        setMyTables={setMyTables}
        occupied={occupied}
        totalTables={tables.length}
        onTakeaway={() => createTakeaway("take")}
        onDelivery={() => createTakeaway("del")}
      />

      <FloorLegend
        tables={tables}
        getStatus={getStatus}
      />

      <div className="floor-scroll floor-pad">
        {filteredSections.map((sec, index) => {
          const sectionTables = tables.filter(
            (table) => table.sec === sec
          );

          return (
            <div key={sec}>
              <div
                className="floor-sec-h"
                style={{ marginTop: index === 0 ? 0 : 14 }}
              >
                {sec}
              </div>

              <div className="floor-tgrid">
                {sectionTables.map((table) => {
                  const status = getStatus(table);
                  const order = table.order
                    ? orders[table.order]
                    : null;

                  const dim =
                    myTables &&
                    order &&
                    order.captain !== currentCaptain;

                  return (
                    <FloorTable
                      key={table.id}
                      table={table}
                      order={order}
                      status={status}
                      dim={Boolean(dim)}
                      getMinutes={getMinutes}
                      getTotal={getTotal}
                      onClick={() => {
                        if (order) {
                          openOrder(order.id);
                        } else if (table.res) {
                          seatReservation(table);
                        } else {
                          openTable(table);
                        }
                      }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}

        {takeawayOrders.length > 0 && (
          <>
            <div className="floor-sec-h">
              Takeaway &amp; delivery
            </div>

            <div className="floor-tgrid">
              {takeawayOrders.map((order) => (
                <FloorOrder
                  key={order.id}
                  order={order}
                  getMinutes={getMinutes}
                  getTotal={getTotal}
                  onClick={() => openOrder(order.id)}
                />
              ))}
            </div>
          </>
        )}
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
        captain={currentCaptain}
        setCaptain={setCurrentCaptain}
        onClose={() => {
          setModalType("");
          setSelectedTable(null);
        }}
        onCreateTable={createTableOrder}
        onCreateTakeaway={createTakeawayOrder}
        onConfirmReservation={confirmReservation}
      />
    </section>
  );
};

export default Floor;
