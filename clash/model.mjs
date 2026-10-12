// The real behaviour of a Clash-style rule router, as a small pure module.
// Every number and name here is the one the figure draws and reads out.

// Rules are an ordered list; the first one that matches decides the outbound.
export const RULES = [
  { type: "DOMAIN-SUFFIX", value: "lan", target: "DIRECT" },
  { type: "DOMAIN-KEYWORD", value: "ads", target: "REJECT" },
  { type: "DST-PORT", value: "22", target: "DIRECT" },
  { type: "DOMAIN-SUFFIX", value: "example.com", target: "PROXY" },
  { type: "GEOIP", value: "CN", target: "DIRECT" },
  { type: "MATCH", value: "", target: "PROXY" },
];

export const MODES = ["rule", "global", "direct"];

export const GROUPS = ["url-test", "fallback", "load-balance"];
export const GROUP_INFO = {
  "url-test": { test: "lowest latency wins", scans: true },
  fallback: { test: "first alive in the list wins", scans: false },
  "load-balance": { test: "destination hash, sticky per host", scans: false },
};

// url-test tolerance and health-check interval, milliseconds and seconds.
export const TOLERANCE = 50;
export const INTERVAL = 300;
export const FAKE_RANGE = "198.18.0.1/16";
export const FAKE_FILTER = ["*.lan", "*.local", "*.home.arpa", "*.msftconnecttest.com"];

// The node list, in config order. Latency is a measured round trip, or absent when dead.
export const NODES = [
  { id: "JP-02", ms: 92, alive: true },
  { id: "HK-01", ms: 48, alive: true },
  { id: "US-03", ms: 0, alive: false },
  { id: "SG-04", ms: 210, alive: true },
];

// Six connections, one per rule, so every head of the bank is the one that trips.
export const PACKETS = [
  { host: "router.lan", ip: "192.168.1.1", port: 80, real: "192.168.1.1" },
  { host: "ads.example.com", ip: "198.18.0.7", port: 443 },
  { host: "ssh.example.net", ip: "198.18.0.11", port: 22 },
  { host: "www.example.com", ip: "198.18.0.5", port: 443 },
  { host: "223.5.5.5", ip: "223.5.5.5", port: 443, literal: true },
  { host: "api.example.org", ip: "198.18.0.9", port: 443 },
];

// Stand-in for the GeoIP database: only this destination in the figure is looked up.
const CN = ["223.5.5.5", "223.6.6.6", "114.114.114.114"];
export const geoipOf = (packet) => (CN.includes(packet.real ?? packet.ip) ? "CN" : "");

const glob = (host, pattern) =>
  new RegExp(
    "^" + pattern.split(".").map((part) => (part === "*" ? "[^.]+" : part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))).join("\\.") + "$",
    "i",
  ).test(host);

// fake-ip: the answer is handed out at once and the name is remembered.
export function dnsOf(packet) {
  if (packet.literal) return { kind: "literal", ip: packet.ip, why: "literal ip, no query" };
  if (FAKE_FILTER.some((pattern) => glob(packet.host, pattern))) return { kind: "real", ip: packet.real ?? packet.ip, why: "fake-ip-filter" };
  return { kind: "fake", ip: packet.ip, why: FAKE_RANGE };
}

export function match(packet) {
  const host = packet.host.toLowerCase();
  for (let index = 0; index < RULES.length; index++) {
    const rule = RULES[index];
    let hit = false;
    if (rule.type === "DOMAIN-SUFFIX") hit = host === rule.value || host.endsWith("." + rule.value);
    else if (rule.type === "DOMAIN-KEYWORD") hit = host.includes(rule.value);
    else if (rule.type === "DST-PORT") hit = String(packet.port) === rule.value;
    else if (rule.type === "GEOIP") hit = geoipOf(packet) === rule.value;
    else hit = true;
    if (hit) return { index, rule };
  }
  return { index: -1, rule: null };
}

const hash = (text) => {
  let value = 2166136261;
  for (let index = 0; index < text.length; index++) value = Math.imul(value ^ text.charCodeAt(index), 16777619);
  return value >>> 0;
};

// Which node a proxy group settles on, given the group's own rule.
export function pick(nodes = NODES, group = "url-test", current = null, host = "") {
  const alive = nodes.filter((node) => node.alive);
  if (!alive.length) return { node: null, why: "no node alive" };
  if (group === "url-test") {
    const best = alive.reduce((low, node) => (node.ms < low.ms ? node : low));
    if (current && current.alive && Math.abs(current.ms - best.ms) <= TOLERANCE)
      return { node: current, why: `keep ${current.id}, ${Math.abs(current.ms - best.ms)} ≤ ${TOLERANCE} ms` };
    return { node: best, why: `lowest latency` };
  }
  if (group === "fallback") return { node: alive[0], why: `first alive` };
  const node = alive[hash(host) % alive.length];
  return { node, why: `hash ${hash(host) % alive.length}` };
}

// mode rule  -> the ordered rules decide
// mode global-> every connection goes to the group
// mode direct-> every connection goes out locally
export function route(packet, { mode = "rule", group = "url-test", node = null } = {}) {
  const dns = dnsOf(packet);
  if (mode === "direct") return { dns, mode, ruleIndex: -1, rule: null, target: "DIRECT", node: null, why: "mode direct" };
  if (mode === "global") {
    const chosen = pick(NODES, group, node, packet.host);
    return { dns, mode, ruleIndex: -1, rule: null, target: "PROXY", node: chosen.node, nodeWhy: chosen.why, why: "mode global" };
  }
  const found = match(packet);
  if (found.rule.target === "PROXY") {
    const chosen = pick(NODES, group, node, packet.host);
    return { dns, mode, ruleIndex: found.index, rule: found.rule, target: "PROXY", node: chosen.node, nodeWhy: chosen.why };
  }
  return { dns, mode, ruleIndex: found.index, rule: found.rule, target: found.rule.target, node: null };
}

export const ruleLabel = (rule) => (rule ? `${rule.type}${rule.value ? " " + rule.value : ""}` : "—");
