/* Shares data between the back office and the screen player tabs on the same device. */
export const PLAYER_PATH = "/back-office/screen-player";          // route that renders <ScreenPlayer />
export const SNAP_KEY = "rm-screen-snapshot";
const beatKey = (id) => `rm-screen-beat-${id}`;

export const publishSnapshot = (data) => {
  try { localStorage.setItem(SNAP_KEY, JSON.stringify(data)); } catch { /* storage full or blocked */ }
};
export const readSnapshot = () => {
  try { return JSON.parse(localStorage.getItem(SNAP_KEY)); } catch { return null; }
};

// a running player writes a heartbeat every few seconds; the back office reads it to show Online
export const beat = (id) => { try { localStorage.setItem(beatKey(id), String(Date.now())); } catch { /* ignore */ } };
export const clearBeat = (id) => { try { localStorage.removeItem(beatKey(id)); } catch { /* ignore */ } };
export const onlineIds = (ids, maxAge = 12000) =>
  ids.filter((id) => Date.now() - Number(localStorage.getItem(beatKey(id)) || 0) < maxAge);