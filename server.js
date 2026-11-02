const { WebSocketServer } = require('ws');
const wss = new WebSocketServer({ port: process.env.PORT || 8080 });
const users = new Map();

wss.on('connection', ws => {
  ws.on('message', raw => {
    let m;
    try { m = JSON.parse(raw); } catch { return; }
    if (m.t === 'hello') { ws.id = m.id; users.set(m.id, ws); return; }
    const peer = users.get(m.to);
    if (peer) peer.send(JSON.stringify({ ...m, from: ws.id }));
  });
  ws.on('close', () => { if (ws.id) users.delete(ws.id); });
});
