import { useState } from "react";

export default function ScreensTab({
  screens, groups, setScreen, removeScreen, addScreen, addGroup, onPlaylist,
  savedIds = [], notice = "", onPublish, playerHref, onOpenPlayer,
}) {
  const [groupName, setGroupName] = useState("");
  return (
    <>
      {notice && <div className="rm-alert rm-alert--green" role="status">✓ {notice}</div>}

      <div className="rm-row rm-row--between" style={{ marginBottom: 12 }}>
        <span className="rm-muted">Open a screen's player link in a TV or tablet browser on this device. Status shows Online while that player is running.</span>
        <span className="rm-row">
          <button className="rm-btn" onClick={addScreen}>+ Add screen</button>
          <button className="rm-btn rm-btn--primary" onClick={onPublish}>Publish now</button>
        </span>
      </div>
      <div className="rm-table-wrap">
        <table className="rm-table">
          <thead><tr><th>Screen</th><th>Location</th><th>Group</th><th>Status</th><th>Playlist</th><th /></tr></thead>
          <tbody>
            {screens.map((s) => (
              <tr key={s.id} className={savedIds.includes(s.id) ? "rm-flash" : undefined}>
                <td><b>{s.name}</b><span className="rm-sub">{s.id}</span></td>
                <td>{s.location}</td>
                <td>
                  <select className="rm-input" value={s.group} onChange={(e) => setScreen(s.id, { group: e.target.value })}>
                    <option value="">None</option>
                    {groups.map((g) => <option key={g}>{g}</option>)}
                  </select>
                </td>
                <td><span className={`rm-pill rm-pill--${s.online ? "ok" : "err"}`}>{s.online ? "Online" : "Offline"}</span></td>
                <td>{s.slides} slides · {s.secs} s</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <button className="rm-btn" onClick={() => onPlaylist(s.id)}>Playlist</button>{" "}
                  <a className="rm-btn" href={playerHref?.(s.id)} onClick={onOpenPlayer} target="_blank" rel="noopener noreferrer">Open player</a>{" "}
                  <button className="rm-btn" onClick={() => removeScreen(s.id)}>🗑 Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rm-card rm-gap-top">
        <div className="rm-card__head">Screen groups</div>
        <div className="rm-row">
          <input className="rm-input" placeholder="New group, e.g. Dining area" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
          <button className="rm-btn" onClick={() => { addGroup(groupName.trim()); setGroupName(""); }}>+ Add group</button>
        </div>
        <div className="rm-muted" style={{ marginTop: 8 }}>
          {groups.map((g) => `${g}: ${screens.filter((s) => s.group === g).length} screen(s)`).join(" · ")}
          {" "}In a playlist, "Save and apply" sends it to every screen in the group.
        </div>
      </div>
    </>
  );
}
