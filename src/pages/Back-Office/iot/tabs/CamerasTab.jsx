import { Icon } from "../SharedIot";

export default function CamerasTab({ cameras, onView, onEdit }) {
  return (
    <div className="iot-body">
      <div className="iot-grid-3">
        {cameras.map((c) => (
          <div className="iot-card" key={c.id}>
            <div className="iot-cam">
              <b>{c.name}</b>
              {!c.online ? "Camera offline" : c.streamUrl ? <video src={c.streamUrl} autoPlay muted controls /> : "Live view needs a stream URL"}
            </div>
            <div className="iot-row iot-row--between">
              <span><i className={`iot-dot ${c.online ? "iot-dot--on" : "iot-dot--off"}`} />{c.zone}</span>
              <span>
                <button className="iot-btn iot-btn--sm" onClick={() => onView(c)}>View</button>{" "}
                <button className="iot-btn iot-btn--sm" onClick={() => onEdit(c.id)}><Icon name="pen" />Edit</button>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
