// A routing bench for Clash: a packet rides a rail under a bank of rule heads; the first
// head that matches trips the lockout shaft and throws the turnout, which sends the car to
// the local depot (DIRECT), the crusher (REJECT) or one of the four tunnels (PROXY), where
// the selector head tests the nodes and drops its probe on the one the group chooses.
//
//   node build.mjs            -> clash.html
//   node build.mjs --light    -> clash-light.html
//   node build.mjs --audit    -> the geometry audit
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../.kimi-code/skills/anatomy/kit/iso-kit.mjs";
import * as A from "../.kimi-code/skills/anatomy/kit/audit.mjs";
import { kitScript } from "../.kimi-code/skills/anatomy/scripts/inline-kit.mjs";
import { NODES, PACKETS } from "./model.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const theme = process.argv.includes("--light") ? "light" : "dark";

// ---------------------------------------------------------------- layout (world units, z up)
const WIDTH = 720;
const HEIGHT = 372;
const PAD = 30;

const BASE = { x: -208, y: -126, w: 426, d: 222, r: 12 };
const BASE_Z = -16;
const FOOT_H = 5;

const PLINTH_H = 6;
const GAUGE = 5.6;
const BED_HW = 7.8;
const BED_H = PLINTH_H + 2.2;
const RAIL_TOP = BED_H + 1.6;

const CAR = { x: -18, y: -9, w: 36, d: 18, r: 1.6 };
const DECK_Z = BED_H;
const DECK_TOP = BED_H + 6;
const WBILL = { x: -16.5, y: -7.8, w: 33, d: 14, r: 1 };
const WBILL_TOP = DECK_TOP + 1.2;
const READ = { x: -16.5, y: -7.8, w: 33, d: 2.6, r: 0.8 };
const READ_TOP = WBILL_TOP + 0.7;

const HEADS = [-160, -128, -96, -64, -32, 0];
const HEAD_Y = -6.4;
const HEAD_D = 14;
const HEAD_W = 22;
const BODY_TOP = 38;
const BEAM_Z = 46;
const BEAM_TOP = 52;
const GANTRY_X = [-160, 22];
const GANTRY_Y = -26;

const BLADE_X = 34;
const PIVOT = [28, 0];
const BLADE_ANGLE = 0.6;
const BLADE_Z = PLINTH_H + 3.1;

const NODE_Y = [-18, -48, -78, -108];
const NODE_X = 176;
const TUN_X0 = 136;
const TUN_X1 = 212;
const TUN_HW = 11;
const WALL_W = 4;
const WALL_TOP = 26;
const ROOF_TOP = 30;
const SOCK_TOP = 44;
const BUSH_TOP = 48;
const MAST_TOP = 60;
const SELECTOR_Z = 80;

const ROUTES = {
  lead: [[-184, 0], [-20, 0], [BLADE_X, 0]],
  reject: [[BLADE_X, 0], [78, 0]],
  direct: [[BLADE_X, 0], [50, 12], [66, 26], [100, 34], [130, 36]],
  transit: [[BLADE_X, 0], [46, -14], [56, -30], [66, -44], [76, -53], [98, -57]],
};
const bez = (a, b, c, d, n = 9) => {
  const out = [];
  for (let i = 1; i <= n; i++) {
    const t = i / n, u = 1 - t;
    out.push([
      u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0],
      u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1],
    ]);
  }
  return out;
};
const proxyRoute = (index) => {
  const y = NODE_Y[index];
  return [...ROUTES.transit, ...bez([98, -57], [122, -57], [128, y], [152, y]), [TUN_X1 - 4, y]];
};

// ---------------------------------------------------------------- projection
const extent = [
  ...k.boxCorners(BASE, BASE_Z - FOOT_H, 0),
  ...k.boxCorners({ x: NODE_X - 7, y: -120, w: 14, d: 12, r: 2 }, SELECTOR_Z, SELECTOR_Z + 8),
  [BASE.x + BASE.w, 82, 30],
  [0, NODE_Y[3] - 17, WALL_TOP],
  [NODE_X, NODE_Y[3], SELECTOR_Z + 8],
];
const P = k.fitProjection(extent, WIDTH, HEIGHT, { pad: PAD, azimuth: 40, elevation: 33 });
const V = A.cameraBasis(P).V;

const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const dots3 = (points, style) => D(k.pointsAt(points, P), style);
const style = (tone, o = {}) => ({ tone, crease: o.crease ?? "faint", lit: o.lit, halo: o.halo, flat: o.flat, inner: o.inner });

// ---------------------------------------------------------------- recorder
const R = A.recorder(P, {});
const record = (shape) => R.solid(shape);
function put(name, svg, shapes, opts = {}) {
  R.put({ name, svg, shapes, piece: opts.piece, at: opts.at, bias: opts.bias ?? 0 });
}
function slabItem(name, plan, z, h, tone, o = {}) {
  const steps = o.steps ?? 4;
  const inner = Array.isArray(o.inner) ? o.inner.join("") : o.inner ?? "";
  put(name, S(k.slabOf(plan, z, h, P, steps, o.bevel ?? 0.6), style(tone, { ...o, inner })), [record(A.slab(plan, z, h, { name, owner: o.owner }, steps))], {
    at: o.at ?? [plan.x + plan.w / 2, plan.y + plan.d / 2, z + h / 2], bias: o.bias, piece: o.piece,
  });
}
function cylItem(name, cx, cy, r, z, h, tone, o = {}) {
  put(name, S(k.cylinder(cx, cy, r, z, h, P, o.steps ?? 20, o.bevel ?? 0), style(tone, o)), [record(A.cylinder(cx, cy, r, z, h, { name, owner: o.owner }))], {
    at: [cx, cy, z + h / 2], bias: o.bias, piece: o.piece,
  });
}
function extrudeItem(name, ring, z, h, tone, o = {}) {
  put(name, S(k.extrude(ring, z, h, P, { convex: o.convex ?? true, bevel: o.bevel ?? 0 }), style(tone, o)), [record(A.extruded(ring, z, h, { name, owner: o.owner }))], {
    at: o.at, bias: o.bias, piece: o.piece,
  });
}
function ribbon(points, halfW) {
  const left = [], right = [];
  for (let i = 0; i < points.length; i++) {
    const a = points[Math.max(0, i - 1)], b = points[Math.min(points.length - 1, i + 1)], p = points[i];
    const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
    left.push([p[0] - (dy / len) * halfW, p[1] + (dx / len) * halfW]);
    right.push([p[0] + (dy / len) * halfW, p[1] - (dx / len) * halfW]);
  }
  return [...left, ...right.reverse()];
}
const offsetLine = (points, off) => points.map((p, i) => {
  const a = points[Math.max(0, i - 1)], b = points[Math.min(points.length - 1, i + 1)];
  const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
  return [p[0] - (dy / len) * off, p[1] + (dx / len) * off];
});
const railPair = (points, z) => L(k.onTop(offsetLine(points, -GAUGE), z, P), { tone: "mid" }) + L(k.onTop(offsetLine(points, GAUGE), z, P), { tone: "mid" });
function tieMarks(points, z, every = 12, half = GAUGE) {
  let acc = 0;
  const marks = [];
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1], b = points[i];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    for (let s = every - (acc % every); s < len - 2; s += every) {
      const t = s / len, dx = (b[0] - a[0]) / len, dy = (b[1] - a[1]) / len;
      const px = a[0] + (b[0] - a[0]) * t, py = a[1] + (b[1] - a[1]) * t;
      marks.push(k.onTop([[px - dy * half, py + dx * half], [px + dy * half, py - dx * half]], z, P));
    }
    acc += len;
  }
  return marks.join("");
}
// the ballast is a low plinth with a track bed on top, so a pipe or a duct can pass beside it
function bedParts(points, o = {}) {
  const halfW = o.halfW ?? BED_HW;
  const cap = (p, grow) => k.onTop([[p[0] - grow, p[1] - halfW * 0.82], [p[0] - grow, p[1] + halfW * 0.82]], BED_H + 0.06, P);
  const ends = o.ends === false ? "" : L(cap(points[0], 0.6) + cap(points[points.length - 1], -0.6), { tone: "faint" });
  const inner = (o.rails === false ? "" : railPair(points, BED_H + 0.2)) + L(tieMarks(points, BED_H + 0.03, o.every ?? 12), { tone: "faint" }) + ends;
  const plinth = ribbon(points, halfW + 2);
  const top = ribbon(points, halfW);
  return {
    svg: S(k.extrude(plinth, 0, PLINTH_H, P, { bevel: 0 }), style("lo", { crease: "none" })) +
      S(k.extrude(top, PLINTH_H, BED_H - PLINTH_H, P, { bevel: 0 }), style("lo", { crease: "none", inner })),
    shapes: [record(A.extruded(plinth, 0, PLINTH_H, { name: o.name ?? "yard.bed", owner: "yard" })),
             record(A.extruded(top, PLINTH_H, BED_H - PLINTH_H, { name: `${o.name ?? "yard.bed"}.top`, owner: "yard" }))],
    inner,
  };
}
function bed(name, points, o = {}) {
  const parts = bedParts(points, { ...o, name });
  put(name, parts.svg, parts.shapes, { at: o.at, bias: o.bias ?? 0, piece: "yard" });
}

// ---------------------------------------------------------------- base
function base() {
  const out = [`<path class="iso-halo" d="${k.haloOf(BASE, BASE_Z - FOOT_H, 14, P)}"/>`];
  const shapes = [];
  const feet = [...k.corners(BASE, 26)].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
  for (const [x, cy] of feet) {
    out.push(S(k.cylinder(x, cy, 10, BASE_Z - FOOT_H, 2, P, 28), style("lo")));
    out.push(S(k.cylinder(x, cy, 7.6, BASE_Z - FOOT_H + 2, FOOT_H - 2, P, 28), style("mid")));
    shapes.push(record(A.cylinder(x, cy, 10, BASE_Z - FOOT_H, 2, { name: "stand.foot", owner: "stand" })));
    shapes.push(record(A.cylinder(x, cy, 7.6, BASE_Z - FOOT_H + 2, FOOT_H - 2, { name: "stand.foot", owner: "stand" })));
  }
  out.push(S(k.slabOf(BASE, BASE_Z, 16, P, 8, 1.6), style("mid")));
  shapes.push(record(A.slab(BASE, BASE_Z, 16, { name: "stand.base" }, 8)));
  out.push(L(k.planOutline(k.insetPlan(BASE, 5), 0, P), { tone: "lo" }));
  out.push(L(k.sideSeam(BASE, BASE_Z + 4, P, 8), { tone: "faint" }));
  const screws = k.corners(BASE, 13);
  out.push(L(screws.map(([x, cy]) => k.ring(x, cy, 2.6, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(dots3(screws.map(([x, cy]) => [x, cy, 0]), { size: 0.55 }));
  put("stand.base", out.join(""), shapes, { at: [0, 0, -8] });

  const strip = { x: -196, y: 84, w: 168, d: 7, r: 1 };
  const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 4.2, 5, strip.y + 0.9, 0.8, [2, 3.7], P);
  slabItem("stand.ruler", strip, 0, 0.8, "lo", {
    steps: 3, crease: "none",
    inner: L(ticks.minor, { tone: "lo" }) + L(ticks.major, { tone: "mid" }) + dots3([[strip.x + 3, strip.y + 3.5, 0.8], [strip.x + strip.w - 3, strip.y + 3.5, 0.8]], { size: 0.45 }),
  });
  const plate = { x: -46, y: 84, w: 84, d: 10, r: 1.2 };
  put("stand.nameplate",
    S(k.slabOf(plate, 0, 1, P, 4, 0.4), style("lo", { crease: "none" })) +
    L(k.planOutline(k.insetPlan(plate, 1.8), 1, P), { tone: "faint" }) +
    L([
      k.lineOnTop([plate.x + 5, plate.y + 3], [plate.x + 54, plate.y + 3], 1, P),
      k.lineOnTop([plate.x + 5, plate.y + 5.4], [plate.x + 41, plate.y + 5.4], 1, P),
      k.lineOnTop([plate.x + 5, plate.y + 7.8], [plate.x + 25, plate.y + 7.8], 1, P),
    ].join(""), { tone: "lo", free: true }) +
    dots3([[plate.x + 3, plate.y + 5, 1], [plate.x + plate.w - 3, plate.y + 5, 1]], { size: 0.45 }),
    [record(A.slab(plate, 0, 1, { name: "stand.nameplate", owner: "stand" }, 4))], { at: [plate.x + 42, plate.y + 5, 0.5] });
}

// ---------------------------------------------------------------- intake: hood, buffer, ticket drum
const HOOD = { x: -206, y: -17, w: 34, d: 34, r: 2 };
function intake() {
  const out = [];
  const shapes = [];
  const nearOut = [];
  const nearShapes = [];
  for (const [x, cy] of [[HOOD.x + 3, HOOD.y + 2], [HOOD.x + 31, HOOD.y + 2]]) {
    out.push(S(k.cylinder(x, cy, 2.2, 0, 39.9, P, 16), style("mid")));
    shapes.push(record(A.cylinder(x, cy, 2.2, 0, 39.9, { name: "intake.post", owner: "intake" })));
  }
  for (const [x, cy] of [[HOOD.x + 3, HOOD.y + 32], [HOOD.x + 31, HOOD.y + 32]]) {
    nearOut.push(S(k.cylinder(x, cy, 2.2, 0, 39.9, P, 16), style("mid")));
    nearShapes.push(record(A.cylinder(x, cy, 2.2, 0, 39.9, { name: "intake.post", owner: "intake" })));
  }
  out.push(S(k.slabOf(HOOD, 40, 5, P, 5, 0.8), style("mid")));
  shapes.push(record(A.slab(HOOD, 40, 5, { name: "intake.roof", owner: "intake" }, 5)));
  const near = { x: HOOD.x, y: HOOD.y + HOOD.d - 3, w: HOOD.w, d: 3, r: 1 };
  put("intake.near",
    nearOut.join("") + S(k.slabOf(near, 0, 39.9, P, 4, 0.6), style("mid", { inner: "" })) +
    L(k.planOutline(k.insetPlan(near, 1), 39.9, P, 3), { tone: "faint" }),
    [...nearShapes, record(A.slab(near, 0, 39.9, { name: "intake.near", owner: "intake" }, 4))], { at: [HOOD.x + 16, HOOD.y + HOOD.d - 1, 20] });
  const far = { x: HOOD.x, y: HOOD.y, w: HOOD.w, d: 3, r: 1 };
  out.push(S(k.slabOf(far, 0, 40, P, 4, 0.6), style("mid")));
  shapes.push(record(A.slab(far, 0, 40, { name: "intake.far", owner: "intake" }, 4)));
  put("intake.hood", out.join(""), shapes, { at: [HOOD.x + 16, HOOD.y + 17, 20] });

  const buffer = { x: -204, y: -9, w: 6, d: 18, r: 1 };
  const bOut = [S(k.slabOf(buffer, 0, 9, P, 3, 0.5), style("mid")), L(k.planOutline(k.insetPlan(buffer, 1.2), 9, P, 3), { tone: "faint" })];
  bOut.push(dots3([[-202, -6, 9], [-202, 6, 9]], { size: 0.5 }));
  put("intake.buffer", bOut.join(""), [record(A.slab(buffer, 0, 9, { name: "intake.buffer", owner: "intake" }, 3))], { at: [-201, 0, 5], bias: 0.3 });

  const drum = { cx: -176, cy: 48 };
  const dOut = [];
  const dShapes = [];
  dOut.push(S(k.cylinder(drum.cx, drum.cy, 11, 0, 26, P, 48, 0.8), style("mid", { inner: L(k.sideArc(drum.cx, drum.cy, 11, 22, P, 36), { tone: "faint" }) })));
  dShapes.push(record(A.cylinder(drum.cx, drum.cy, 11, 0, 26, { name: "ticket.drum", owner: "ticket" })));
  dOut.push(S(k.cylinder(drum.cx, drum.cy, 3.4, 26, 2.4, P, 24), style("lo")));
  dShapes.push(record(A.cylinder(drum.cx, drum.cy, 3.4, 26, 2.4, { name: "ticket.hub", owner: "ticket" })));
  const marks = k.radialTicks(drum.cx, drum.cy, 9, 8, 1, 26, [2.4, 4.2], P, 0, Math.PI * 2);
  dOut.push(L(marks.minor, { tone: "faint" }) + L(marks.major, { tone: "mid" }));
  dOut.push(`<g data-part="ticket"><path class="iso-line" data-tone="lit" d="${k.lineOnTop([drum.cx, drum.cy], [drum.cx, drum.cy + 8.4], 26.4, P)}"/></g>`);
  const chute = { x: drum.cx - 4, y: drum.cy - 22, w: 8, d: 18, r: 1 };
  dOut.push(S(k.slabOf(chute, 0, 4.4, P, 3, 0.5), style("mid")));
  dShapes.push(record(A.slab(chute, 0, 4.4, { name: "ticket.chute", owner: "ticket" }, 3)));
  put("ticket.drum", dOut.join(""), dShapes, { at: [drum.cx, drum.cy, 14] });
}

// ---------------------------------------------------------------- the six waybills in their rack
const RACK = { x: -200, y: 60, w: 156, d: 22, r: 2 };
function rack() {
  const out = [];
  const shapes = [];
  const tray = { x: RACK.x, y: RACK.y, w: RACK.w, d: 5, r: 1 };
  out.push(S(k.slabOf(tray, 0, 6, P, 4, 0.5), style("lo", { crease: "none" })));
  shapes.push(record(A.slab(tray, 0, 6, { name: "rack.tray", owner: "rack" }, 4)));
  for (const [x, y, w, d] of [[RACK.x, RACK.y - 3, 3, 8], [RACK.x, RACK.y, 3, RACK.d], [RACK.x + RACK.w - 3, RACK.y, 3, RACK.d]]) {
    const bar = { x, y, w, d, r: 0.8 };
    out.push(S(k.slabOf(bar, 6, 2.6, P, 3, 0.4), style("mid")));
    shapes.push(record(A.slab(bar, 6, 2.6, { name: "rack.bar", owner: "rack" }, 3)));
  }
  put("rack.frame", out.join(""), shapes, { at: [RACK.x + RACK.w / 2, RACK.y + 11, 7] });

  PACKETS.forEach((packet, index) => {
    const plan = { x: RACK.x + index * 26 + 3, y: RACK.y + 2.5, w: 22, d: 17, r: 1 };
    const svg =
      `<g data-slip="${index}" tabindex="-1" role="button" aria-label="发送 ${packet.host}:${packet.port}">` +
      S(k.slabOf(plan, 6, 1.6, P, 3, 0.6), style("hi", { crease: "lo" })) +
      L(k.planOutline(k.insetPlan(plan, 1.4), 7.6, P), { tone: "faint" }) +
      k.faceTextSvg(k.topMatrix([plan.x + 1.4, plan.y + 12], 7.6, P, "x"), packet.host, { size: 2.0, tone: "lo" }) +
      dots3([[plan.x + plan.w - 2.4, plan.y + 3, 7.6]], { size: 0.45, tone: "lo" }) +
      `</g>`;
    put(`rack.slip${index + 1}`, svg, [record(A.slab(plan, 6, 1.6, { name: `rack.slip${index + 1}`, owner: "rack" }, 3))], {
      at: [plan.x + 11, plan.y + 8, 6.8], bias: 0.6, piece: "rack",
    });
  });
}

// ---------------------------------------------------------------- cabinets, duct, stores
function cabinets() {
  // the rule store: config and rule sets, in drawers
  const C = { x: -152, y: -74, w: 94, d: 40, r: 2 };
  const out = [];
  const shapes = [];
  const base = { x: C.x + 3, y: C.y + 3, w: C.w - 6, d: C.d - 6, r: 1.5 };
  out.push(S(k.slabOf(base, 0, PLINTH_H, P, 4, 0.5), style("lo", { crease: "none" })));
  shapes.push(record(A.slab(base, 0, PLINTH_H, { name: "store.plinth", owner: "store" }, 4)));
  out.push(S(k.slabOf(C, PLINTH_H, 36, P, 5, 0.8), style("mid", { inner: "" })));
  shapes.push(record(A.slab(C, PLINTH_H, 36, { name: "store.body", owner: "store" }, 5)));
  const cap = k.insetPlan(C, 2.4);
  out.push(S(k.slabOf(cap, 42, 4.4, P, 4, 0.6), style("mid")));
  shapes.push(record(A.slab(cap, 42, 4.4, { name: "store.cap", owner: "store" }, 4)));
  out.push(L(k.planOutline(k.insetPlan(cap, 2), 46.4, P, 4), { tone: "faint" }));
  out.push(L(k.lineOnTop([cap.x, cap.y + cap.d / 2], [cap.x + cap.w, cap.y + cap.d / 2], 46.4, P), { tone: "faint" }));
  for (const dx of [10, 28]) {
    out.push(L(k.planOutline({ x: cap.x + dx, y: cap.y + 6, w: 12, d: 6, r: 1 }, 46.4, P, 3), { tone: "lo" }));
    out.push(L(k.planOutline({ x: cap.x + dx + 1.6, y: cap.y + 7.6, w: 8.8, d: 2.8, r: 0.6 }, 46.4, P, 3), { tone: "faint" }));
  }
  out.push(dots3([[cap.x + 4, cap.y + 4, 46.4], [cap.x + cap.w - 4, cap.y + 4, 46.4], [cap.x + 4, cap.y + cap.d - 4, 46.4], [cap.x + cap.w - 4, cap.y + cap.d - 4, 46.4]], { size: 0.5 }));
  [12, 22, 32].forEach((z, i) => {
    const front = { x: C.x + 5, y: C.y + C.d - 1.2, w: C.w - 10, d: 2.4, r: 0.8 };
    out.push(S(k.slabOf(front, z, 7, P, 3, 0.5), style("hi", { crease: "lo" })));
    shapes.push(record(A.slab(front, z, 7, { name: `store.drawer${i + 1}`, owner: "store" }, 3)));
    out.push(L(k.planOutline(k.insetPlan(front, 1), z + 7, P, 3), { tone: "faint" }));
    const pull = { x: C.x + 24, y: C.y + C.d + 1.2, w: 26, d: 2.4, r: 0.8 };
    out.push(S(k.slabOf(pull, z + 3.4, 2.2, P, 3, 0.4), style("mid")));
    shapes.push(record(A.slab(pull, z + 3.4, 2.2, { name: `store.pull${i + 1}`, owner: "store" }, 3)));
    out.push(dots3([[C.x + 22, C.y + C.d + 2.4, z + 4.5], [C.x + 52, C.y + C.d + 2.4, z + 4.5]], { size: 0.45 }));
  });
  const tag = { x: C.x + 6, y: C.y + C.d + 0.2, w: 26, d: 1.4, r: 0.4 };
  out.push(S(k.slabOf(tag, 34, 5, P, 3, 0.4), style("lo", { crease: "none" })));
  shapes.push(record(A.slab(tag, 34, 5, { name: "store.tag", owner: "store" }, 3)));
  out.push(L([
    k.lineOnTop([tag.x + 2, tag.y + 2.4], [tag.x + 20, tag.y + 2.4], 39, P),
    k.lineOnTop([tag.x + 2, tag.y + 4.2], [tag.x + 13, tag.y + 4.2], 39, P),
  ].join(""), { tone: "lo", free: true }));
  put("store", out.join(""), shapes, { at: [C.x + 47, C.y + 20, 26] });

  // the duct from the store to the gantry pier
  const duct = { x: -56, y: -56, w: 44, d: 6, r: 1 };
  const dOut = [];
  const dShapes = [];
  const dTop = PLINTH_H + 1.8;
  dOut.push(S(k.slabOf(duct, PLINTH_H, 1.8, P, 3, 0.4), style("lo", { crease: "lo" })));
  dShapes.push(record(A.slab(duct, PLINTH_H, 1.8, { name: "duct", owner: "duct" }, 3)));
  for (const cx of [-46, -26]) {
    const clamp = { x: cx - 5, y: -58, w: 10, d: 10, r: 1.2 };
    dOut.push(S(k.slabOf(clamp, PLINTH_H, 3.2, P, 3, 0.4), style("mid")));
    dShapes.push(record(A.slab(clamp, PLINTH_H, 3.2, { name: "duct.clamp", owner: "duct" }, 3)));
  }
  put("duct", dOut.join(""), dShapes, { at: [-34, -53, dTop] });
  const junction = { x: -14, y: -60, w: 14, d: 14, r: 2 };
  const jOut = [S(k.slabOf(junction, 0, 12, P, 4, 0.6), style("mid", { inner: L(k.sideSeam(junction, 9, P, 4), { tone: "faint" }) }))];
  jOut.push(L(k.planOutline(k.insetPlan(junction, 2), 12, P, 3), { tone: "faint" }));
  jOut.push(dots3([[-11, -57, 12], [-3, -57, 12]], { size: 0.5 }));
  put("duct.box", jOut.join(""), [record(A.slab(junction, 0, 12, { name: "duct.box", owner: "duct" }, 4))], { at: [-7, -53, 6] });

  // crates and a spare rail beside the drum
  const sOut = [];
  const sShapes = [];
  for (const [cx, cy, w, d, h] of [[-138, 24, 26, 16, 14], [-124, 44, 16, 14, 9], [-148, 46, 14, 14, 11]]) {
    const crate = { x: cx, y: cy, w, d, r: 1 };
    sOut.push(S(k.slabOf(crate, 0, h, P, 4, 0.6), style("hi", { inner: L(k.sideSeam(crate, h * 0.55, P, 4), { tone: "faint" }) })));
    sShapes.push(record(A.slab(crate, 0, h, { name: "spare.crate", owner: "spare" }, 4)));
  }
  put("spare", sOut.join(""), sShapes, { at: [-136, 34, 6] });

  const rail = { x: -196, y: 22, w: 40, d: 4, r: 1 };
  const rOut = [S(k.slabOf(rail, 0, 2.6, P, 3, 0.4), style("mid")), dots3([[-193, 24, 2.6], [-159, 24, 2.6]], { size: 0.45 })];
  put("spare.rail", rOut.join(""), [record(A.slab(rail, 0, 2.6, { name: "spare.rail", owner: "spare" }, 3))], { at: [-176, 24, 1.3] });

  // the controller: the two levers stand on its top
  const K = { x: 40, y: 52, w: 80, d: 42, r: 2 };
  const kOut = [];
  const kShapes = [];
  const kBase = { x: K.x + 3, y: K.y + 3, w: K.w - 6, d: K.d - 6, r: 1.5 };
  kOut.push(S(k.slabOf(kBase, 0, 5, P, 4, 0.5), style("lo", { crease: "none" })));
  kShapes.push(record(A.slab(kBase, 0, 5, { name: "control.plinth", owner: "control" }, 4)));
  kOut.push(S(k.slabOf(K, 5, 20, P, 5, 0.8), style("mid", { inner: L(k.sideSeam(K, 22, P, 5), { tone: "faint" }) })));
  kShapes.push(record(A.slab(K, 5, 20, { name: "control.body", owner: "control" }, 5)));
  const kCap = k.insetPlan(K, 2);
  kOut.push(S(k.slabOf(kCap, 25, 3, P, 4, 0.5), style("mid")));
  kShapes.push(record(A.slab(kCap, 25, 3, { name: "control.cap", owner: "control" }, 4)));
  const face = { x: K.x + 5, y: K.y + K.d - 1, w: K.w - 10, d: 2, r: 0.8 };
  kOut.push(S(k.slabOf(face, 10, 11, P, 3, 0.4), style("lo", { crease: "none" })));
  kShapes.push(record(A.slab(face, 10, 11, { name: "control.face", owner: "control" }, 3)));
  kOut.push(L([
    k.lineOnTop([face.x + 2, face.y + 2], [face.x + 34, face.y + 2], 21, P),
    k.lineOnTop([face.x + 2, face.y + 4], [face.x + 22, face.y + 4], 21, P),
  ].join(""), { tone: "lo", free: true }));
  put("control", kOut.join(""), kShapes, { at: [K.x + 42, K.y + 21, 18] });

  const lamp = { cx: 80, cy: 62 };
  const lOut = [
    S(k.cylinder(lamp.cx, lamp.cy, 2, 28, 2.4, P, 20), style("hi")),
    L(k.ring(lamp.cx, lamp.cy, 2, 30.4, P, 20), { tone: "lo" }),
  ];
  put("control.lamp", lOut.join(""), [record(A.cylinder(lamp.cx, lamp.cy, 2, 28, 2.4, { name: "control.lamp", owner: "control" }))], { at: [lamp.cx, lamp.cy, 29] });
}

// ---------------------------------------------------------------- gantry over the rule bank
function gantry() {
  const beam = { x: GANTRY_X[0] - 10, y: HEAD_Y - HEAD_D / 2, w: GANTRY_X[1] - GANTRY_X[0] + 20, d: HEAD_D, r: 2 };
  for (const x of GANTRY_X) {
    const out = [];
    const shapes = [];
    for (const cy of [GANTRY_Y]) {
      const foot = { x: x - 5.4, y: cy - 5.4, w: 10.8, d: 10.8, r: 2 };
      out.push(S(k.slabOf(foot, 0, 3.4, P, 4, 0.5), style("mid")));
      shapes.push(record(A.slab(foot, 0, 3.4, { name: "gantry.foot" }, 4)));
      const arm = { x: x - 3, y: -24, w: 6, d: 12, r: 1.5 };
      out.push(S(k.slabOf(arm, 40, 6, P, 3, 0.5), style("mid")));
      shapes.push(record(A.slab(arm, 40, 6, { name: "gantry.arm", owner: "gantry" }, 3)));
      out.push(S(k.cylinder(x, cy, 5.4, 3.4, BEAM_Z - 3.4, P, 28), style("mid", { inner: L([16, 30].map((z) => k.sideArc(x, cy, 5.4, z, P, 16)).join(""), { tone: "faint" }) })));
      shapes.push(record(A.cylinder(x, cy, 5.4, 3.4, BEAM_Z - 3.4, { name: "gantry.post", owner: "gantry" })));
    }
    put(`gantry.pier${x}`, out.join(""), shapes, { at: [x, GANTRY_Y, 24] });
  }
  const bOut = [S(k.slabOf(beam, BEAM_Z, BEAM_TOP - BEAM_Z, P, 5, 0.8), style("mid", { inner: "" })),
    L(k.planOutline(k.insetPlan(beam, 2.5), BEAM_Z + 6, P, 4), { tone: "faint" }),
    S(k.slabOf({ x: beam.x + 5, y: beam.y, w: beam.w - 10, d: beam.d, r: 1.5 }, BEAM_TOP, 2.4, P, 4, 0.5), style("mid"))];
  put("gantry.beam", bOut.join(""), [
    record(A.slab(beam, BEAM_Z, BEAM_TOP - BEAM_Z, { name: "gantry.beam", owner: "beam" }, 5)),
    record(A.slab({ x: beam.x + 5, y: beam.y, w: beam.w - 10, d: beam.d, r: 1.5 }, BEAM_TOP, 2.4, { name: "gantry.cap", owner: "beam" }, 4)),
  ], { at: [-70, -6, 50] });
}

// ---------------------------------------------------------------- the rule bank
function headParts(hx, index) {
  const body = { x: hx - HEAD_W / 2, y: HEAD_Y - HEAD_D / 2, w: HEAD_W, d: HEAD_D, r: 2 };
  const out = [];
  const shapes = [];
  out.push(S(k.cylinder(hx, HEAD_Y, 2.4, BODY_TOP, BEAM_Z - BODY_TOP - 0.1, P, 20), style("mid")));
  shapes.push(record(A.cylinder(hx, HEAD_Y, 2.4, BODY_TOP, BEAM_Z - BODY_TOP - 0.1, { name: "head.neck", owner: "head" })));
  out.push(S(k.slabOf(body, 24, BODY_TOP - 24, P, 5, 0.8), style("mid", { inner: "" })));
  shapes.push(record(A.slab(body, 24, BODY_TOP - 24, { name: "head.body", owner: "head" }, 5)));
  const plate = { x: hx - 10, y: HEAD_Y + HEAD_D / 2 - 0.6, w: 20, d: 1.6, r: 0.4 };
  out.push(S(k.slabOf(plate, 26, 8, P, 3, 0.4), style("hi", { crease: "lo" })));
  shapes.push(record(A.slab(plate, 26, 8, { name: "head.plate", owner: "head" }, 3)));
  out.push(L(k.planOutline(k.insetPlan(plate, 1.1), 34, P, 3), { tone: "faint" }));
  const dots = [];
  for (let i = 0; i <= index; i++) dots.push([hx - 6 + i * (12 / Math.max(1, index)), plate.y + plate.d + 0.15, 30]);
  out.push(dots3(dots, { size: 0.62 }));
  return { svg: out.join(""), shapes };
}
function feelerParts(hx, index) {
  const out = [];
  const shapes = [];
  out.push(S(k.cylinder(hx, HEAD_Y, 2.0, 20, 9, P, 20), style("hi", { crease: "lo" })));
  shapes.push(record(A.cylinder(hx, HEAD_Y, 2.0, 20, 9, { name: `head.sleeve${index + 1}`, owner: "head" })));
  out.push(S(k.cylinder(hx, HEAD_Y, 2.9, 18.8, 1.3, P, 20), style("mid")));
  shapes.push(record(A.cylinder(hx, HEAD_Y, 2.9, 18.8, 1.3, { name: `head.collar${index + 1}`, owner: "rule" })));
  out.push(S(k.cylinder(hx, HEAD_Y, 1.0, 16.3, 2.5, P, 16), style("hi")));
  shapes.push(record(A.cylinder(hx, HEAD_Y, 1.0, 16.3, 2.5, { name: `head.pin${index + 1}`, owner: "rule" })));
  return { svg: out.join(""), shapes };
}
function buildHeads() {
  HEADS.forEach((hx, index) => {
    const head = headParts(hx, index);
    put(`head${index + 1}`, head.svg, head.shapes, { at: [hx, HEAD_Y, 32], piece: "rule" });
    const feeler = feelerParts(hx, index);
    put(`feeler${index + 1}`, `<g data-part="feeler" data-i="${index}" data-fallback="1" transform="${k.translateAlong(P, [0, 0, 24])}"></g>`, feeler.shapes, {
      at: [hx, HEAD_Y, 3], piece: "rule",
    });
  });
  const bar = { x: HEADS[0] - 9.6, y: -14, w: HEADS[HEADS.length - 1] - HEADS[0] + 17.6, d: 2.6, r: 0.6 };
  const out = [];
  const shapes = [];
  out.push(S(k.slabOf(bar, 18.6, 2.6, P, 3, 0.5), style("mid")));
  shapes.push(record(A.slab(bar, 18.6, 2.6, { name: "lock.bar", owner: "lock" }, 3)));
  out.push(S(k.cylinder(HEADS[0] - 9, -12.7, 2.4, 0, 22, P, 20), style("mid")));
  shapes.push(record(A.cylinder(HEADS[0] - 9, -12.7, 2.4, 0, 22, { name: "lock.pivot", owner: "lock" })));
  const arms = HEADS.map((hx) => `<path class="iso-line" data-arm="${hx}" data-tone="mid" d="${k.segment([hx, -12.7, 19.9], [hx, HEAD_Y, 19.9], P)}"/>`).join("");
  put("lock.bar", out.join("") + `<g data-part="arms">${arms}</g>`, shapes, { at: [-88, -12, 20] });
}

// ---------------------------------------------------------------- turnout
function bladeRing(angle) {
  const c = Math.cos(angle), s = Math.sin(angle);
  const pts = [[34, 0], [6, -2.6], [2, -3.1], [2, -15], [-4, -15], [-4, 3.1], [6, 2.6]];
  return pts.map(([u, v]) => [PIVOT[0] + u * c - v * s, PIVOT[1] + u * s + v * c]);
}
function bladePaths(angle) {
  const paths = k.extrude(bladeRing(angle), BLADE_Z, 1.4, P, { bevel: 0.4 });
  return (
    `<path class="iso-fill" d="${paths.fill}"/>` +
    paths.shades.map((d, i) => `<path class="iso-shade" data-shade="${i}" d="${d ?? ""}"/>`).join("") +
    `<path class="iso-top" d="${paths.top}"/>` +
    `<path class="iso-line iso-crease" data-tone="faint" d="${paths.crease ?? ""}"/>` +
    `<path class="iso-line iso-edge" data-tone="hi" d="${paths.outline}"/>`
  );
}
function turnout() {
  const out = [];
  const shapes = [];
  const heel = { x: PIVOT[0] - 10, y: -12, w: 22, d: 24, r: 2 };
  out.push(S(k.slabOf(heel, BED_H, 0.8, P, 4, 0.5), style("mid")));
  shapes.push(record(A.slab(heel, BED_H, 0.8, { name: "blade.heel", owner: "yard" }, 4)));
  out.push(S(k.cylinder(PIVOT[0], PIVOT[1], 2.6, BLADE_Z + 1.4, 4, P, 20), style("hi")));
  shapes.push(record(A.cylinder(PIVOT[0], PIVOT[1], 2.6, BLADE_Z + 1.4, 4, { name: "blade.pin", owner: "blade" })));
  put("blade.heel", out.join(""), shapes, { at: [PIVOT[0], 0, 8] });
  put("blade", `<g class="iso-solid" data-part="blade" data-lit="">${bladePaths(0)}</g>`, [record(A.extruded(bladeRing(0), BLADE_Z, 1.4, { name: "blade", owner: "blade" }))], {
    at: [PIVOT[0] + 10, -5, 11],
  });

  // the point machine under the bench edge behind the turnout, and the rod that throws the blade
  const box = { x: 26, y: -44, w: 20, d: 12, r: 1.5 };
  const mOut = [];
  const mShapes = [];
  const mount = { x: 29, y: -47, w: 14, d: 18, r: 1.5 };
  mOut.push(S(k.slabOf(mount, 0, PLINTH_H, P, 4, 0.5), style("lo", { crease: "none" })));
  mShapes.push(record(A.slab(mount, 0, PLINTH_H, { name: "point.mount", owner: "point" }, 4)));
  mOut.push(S(k.slabOf(box, PLINTH_H, 10, P, 4, 0.6), style("mid", { inner: "" })));
  mShapes.push(record(A.slab(box, PLINTH_H, 10, { name: "point.box", owner: "point" }, 4)));
  mOut.push(L(k.planOutline(k.insetPlan(box, 2.4), PLINTH_H + 10, P, 3), { tone: "faint" }));
  mOut.push(dots3([[box.x + 3, box.y + 3, PLINTH_H + 10], [box.x + box.w - 3, box.y + box.d - 3, PLINTH_H + 10]], { size: 0.5 }));
  put("point.machine", mOut.join(""), mShapes, { at: [36, -38, PLINTH_H + 5] });

  const rodFrom = [46, -38, PLINTH_H + 5];
  const rodTo = (angle) => [PIVOT[0] - 1 * Math.cos(angle) + 15 * Math.sin(angle), -15 * Math.cos(angle) - 1 * Math.sin(angle), BLADE_Z + 0.6];
  const rest = rodTo(0);
  put("point.rod", `<g data-part="rod"><path class="iso-line" data-tone="mid" data-rod="1" d="${k.segment(rodFrom, rest, P)}"/>` +
    `<circle class="iso-wire-end" data-rod-a r="1.3" cx="${k.iso(rodFrom, P)[0].toFixed(2)}" cy="${k.iso(rodFrom, P)[1].toFixed(2)}"/>` +
    `<circle class="iso-wire-end" data-rod-b r="1.3" cx="${k.iso(rest, P)[0].toFixed(2)}" cy="${k.iso(rest, P)[1].toFixed(2)}"/></g>`,
    [record(A.tube([rodFrom, rest], 1.4, { name: "point.rod", owner: "point", tips: [rodFrom, rest] }))], { at: [40, -26, PLINTH_H + 5] });
}

// ---------------------------------------------------------------- the yard
function yard() {
  const tracks = [ROUTES.lead, ROUTES.reject, ROUTES.direct, ROUTES.transit].map((points) => bedParts(points, { name: "yard.bed" }));
  put("yard.tracks", tracks.map((part) => part.svg).join(""), tracks.flatMap((part) => part.shapes), { at: [-40, 0, 4] });

  // the concrete apron under the tunnel fan, with the branch rails cast into it
  const apron = { x: 96, y: -124, w: 118, d: 118, r: 3 };
  const branch = (index) => {
    const points = proxyRoute(index).filter((p) => p[0] >= 96);
    return [[98, -57], ...points];
  };
  const fanRails = NODE_Y.map((ny, index) => {
    const points = branch(index);
    const end = points[points.length - 1];
    return railPair(points, BED_H + 0.2) + L(tieMarks(points, BED_H + 0.06, 14, GAUGE), { tone: "faint" }) +
      L(k.onTop([[end[0], end[1] - GAUGE], [end[0], end[1] + GAUGE]], BED_H + 0.08, P), { tone: "faint" });
  }).join("");
  put("yard.apron",
    S(k.slabOf(apron, 0, PLINTH_H, P, 6, 0.8), style("lo", { crease: "none", inner: fanRails })),
    [record(A.slab(apron, 0, PLINTH_H, { name: "yard.apron", owner: "yard" }, 6))], { at: [150, -57, 4] });

  const out = [];
  const shapes = [];
  for (const cy of [-16, 22]) {
    out.push(S(k.cylinder(78, cy, 2.4, BED_H, 40 - BED_H, P, 20), style("mid")));
    shapes.push(record(A.cylinder(78, cy, 2.4, BED_H, 40 - BED_H, { name: "crusher.column", owner: "crusher" })));
  }
  const cross = { x: 58, y: -20, w: 40, d: 44, r: 2 };
  out.push(S(k.slabOf(cross, 40, 6, P, 5, 0.8), style("mid", { inner: "" })));
  shapes.push(record(A.slab(cross, 40, 6, { name: "crusher.cross", owner: "crusher" }, 5)));
  const pad = { x: 62, y: -11, w: 32, d: 22, r: 2 };
  out.push(S(k.slabOf(pad, BED_H, 0.4, P, 4), style("lo", { crease: "none" })));
  shapes.push(record(A.slab(pad, BED_H, 0.4, { name: "crusher.pad", owner: "crusher" }, 4)));
  out.push(L(k.planOutline({ x: 66, y: -9, w: 24, d: 18, r: 1.5 }, BED_H + 0.4, P, 3), { tone: "mid" }));
  out.push(L([-9, 0, 9].map((dy) => k.lineOnTop([66, dy], [90, dy], BED_H + 0.4, P)).join(""), { tone: "faint" }));
  put("crusher.frame", out.join(""), shapes, { at: [78, 0, 34] });

  put("crusher.ram", `<g data-part="ram">${S(k.slabOf({ x: 58, y: -15, w: 40, d: 34, r: 2 }, 25, 14, P, 5, 0.8), style("hi", { crease: "lo", lit: true })) + S(k.slabOf({ x: 61, y: -9, w: 34, d: 24, r: 1.5 }, 23.6, 1.6, P, 3, 0.4), style("lit", { crease: "none" }))}</g>`,
    [record(A.slab({ x: 58, y: -15, w: 40, d: 34, r: 2 }, 25, 14, { name: "crusher.ram", owner: "crusher" }, 5))], { at: [78, 3, 31], bias: 0.6, piece: "crusher" });

  // the local depot: a goods shed the track runs into
  const dOut = [];
  const dShapes = [];
  const platform = { x: 132, y: 14, w: 68, d: 66, r: 2 };
  dOut.push(S(k.slabOf(platform, 0, BED_H, P, 5, 0.6), style("lo", { crease: "none" })));
  dShapes.push(record(A.slab(platform, 0, BED_H, { name: "depot.platform", owner: "depot" }, 5)));
  const backWall = { x: 192, y: 14, w: 8, d: 66, r: 1.5 };
  dOut.push(S(k.slabOf(backWall, BED_H, 19, P, 4, 0.6), style("mid", { inner: "" })));
  dShapes.push(record(A.slab(backWall, BED_H, 19, { name: "depot.back", owner: "depot" }, 4)));
  const nearWall = { x: 132, y: 76, w: 68, d: 5, r: 1 };
  dOut.push(S(k.slabOf(nearWall, BED_H, 19, P, 4, 0.6), style("mid", { inner: "" })));
  dShapes.push(record(A.slab(nearWall, BED_H, 19, { name: "depot.near", owner: "depot" }, 4)));
  const farWall = { x: 132, y: 13, w: 68, d: 5, r: 1 };
  dOut.push(S(k.slabOf(farWall, BED_H, 19, P, 4, 0.6), style("mid")));
  dShapes.push(record(A.slab(farWall, BED_H, 19, { name: "depot.far", owner: "depot" }, 4)));
  const roof = { x: 126, y: 8, w: 82, d: 76, r: 2 };
  dOut.push(S(k.slabOf(roof, 21, 4, P, 5, 0.8), style("mid", { inner: L(k.sideSeam(roof, 23.5, P, 5), { tone: "faint" }) })));
  dShapes.push(record(A.slab(roof, 21, 4, { name: "depot.roof", owner: "depot" }, 5)));
  dOut.push(L(k.planOutline(k.insetPlan(roof, 3), 25, P, 4), { tone: "faint" }));
  dOut.push(L(k.lineOnTop([roof.x + 6, roof.y + roof.d / 2], [roof.x + roof.w - 6, roof.y + roof.d / 2], 25, P), { tone: "faint" }));
  for (const dx of [10, 34, 58]) {
    dOut.push(L(k.planOutline({ x: roof.x + dx, y: roof.y + 6, w: 14, d: 8, r: 1.5 }, 25, P, 3), { tone: "lo" }));
    for (let i = 1; i <= 3; i++) {
      dOut.push(L(k.planOutline({ x: roof.x + dx + 2, y: roof.y + 5.4 + i * 2, w: 10, d: 1.2, r: 0.5 }, 25, P, 2), { tone: "faint" }));
    }
  }
  dOut.push(dots3([[roof.x + 5, roof.y + 5, 25], [roof.x + roof.w - 5, roof.y + 5, 25], [roof.x + 5, roof.y + roof.d - 5, 25], [roof.x + roof.w - 5, roof.y + roof.d - 5, 25]], { size: 0.5 }));
  for (const [cx, cy, w, d, h] of [[146, 22, 22, 14, 12], [172, 22, 16, 14, 8], [152, 64, 18, 12, 10]]) {
    const crate = { x: cx, y: cy, w, d, r: 1 };
    dOut.push(S(k.slabOf(crate, BED_H, h, P, 4, 0.6), style("hi", { inner: L(k.sideSeam(crate, BED_H + h * 0.55, P, 4), { tone: "faint" }) })));
    dShapes.push(record(A.slab(crate, BED_H, h, { name: "depot.crate", owner: "depot" }, 4)));
  }
  put("depot", dOut.join(""), dShapes, { at: [164, 46, 12] });
}

// ---------------------------------------------------------------- the stub siding and its signal
function sidings() {
  bed("yard.stub", [[-84, 34], [30, 34]], { at: [-30, 34, 1], convex: true, every: 13 });
  const buffer = { x: -92, y: 26, w: 8, d: 16, r: 1 };
  const bOut = [S(k.slabOf(buffer, 0, 9, P, 3, 0.5), style("mid")), L(k.planOutline(k.insetPlan(buffer, 1.6), 9, P, 3), { tone: "faint" })];
  bOut.push(dots3([[-89, 29, 9], [-89, 39, 9]], { size: 0.5 }));
  put("yard.buffer", bOut.join(""), [record(A.slab(buffer, 0, 9, { name: "yard.buffer", owner: "yard" }, 3))], { at: [-86, 34, 6] });

  const parked = carPaths(0);
  const px = -44, py = 34;
  const svg = parked.svg.replace(/data-car="[^"]*"/g, "").replace(">—<", ">api.example.org<").replace(">—<", ">198.18.0.9<");
  put("car.parked", `<g transform="${k.translateAlong(P, [px, py, 0])}">${svg}</g>`, parked.shapes.map((shape) => record(A.moved(shape, [px, py, 0]))), {
    at: [px, py, 8], bias: 4, piece: "parked",
  });

  const sOut = [];
  const sShapes = [];
  const base = { x: 40, y: 28, w: 11, d: 11, r: 1.5 };
  sOut.push(S(k.slabOf(base, 0, 2.4, P, 3, 0.4), style("mid")));
  sShapes.push(record(A.slab(base, 0, 2.4, { name: "signal.base", owner: "signal" }, 3)));
  sOut.push(S(k.cylinder(45.5, 33.5, 1.8, 2.4, 30, P, 16), style("mid", { inner: L([10, 20].map((z) => k.sideArc(45.5, 33.5, 1.8, z, P, 12)).join(""), { tone: "faint" }) })));
  sShapes.push(record(A.cylinder(45.5, 33.5, 1.8, 2.4, 30, { name: "signal.mast", owner: "signal" })));
  const head = { x: 40.5, y: 30, w: 10, d: 7, r: 1 };
  sOut.push(S(k.slabOf(head, 32, 11, P, 3, 0.5), style("hi", { crease: "lo" })));
  sShapes.push(record(A.slab(head, 32, 11, { name: "signal.head", owner: "signal" }, 3)));
  sOut.push(L(k.planOutline(k.insetPlan(head, 1.4), 43, P, 3), { tone: "faint" }));
  sOut.push(dots3([[42.5, 39.5, 43], [48.5, 39.5, 43]], { size: 0.85, tone: "hi" }));
  put("signal", sOut.join(""), sShapes, { at: [45.5, 33.5, 18] });

  const duct = { x: 43, y: 39, w: 6, d: 16, r: 1 };
  const dOut = [S(k.slabOf(duct, 0, 1.8, P, 3, 0.4), style("lo", { crease: "lo" }))];
  for (const cy of [44, 52]) dOut.push(S(k.slabOf({ x: 41, y: cy - 3, w: 10, d: 6, r: 1 }, 0, 3, P, 3, 0.4), style("mid")));
  put("signal.duct", dOut.join(""), [
    record(A.slab(duct, 0, 1.8, { name: "signal.duct", owner: "signal" }, 3)),
    record(A.slab({ x: 41, y: 41, w: 10, d: 6, r: 1 }, 0, 3, { name: "signal.clamp", owner: "signal" }, 3)),
    record(A.slab({ x: 41, y: 49, w: 10, d: 6, r: 1 }, 0, 3, { name: "signal.clamp", owner: "signal" }, 3)),
  ], { at: [46, 47, 1.5] });
}

// ---------------------------------------------------------------- the four tunnels
function tunnelParts(ny) {
  const out = [];
  const shapes = [];
  const floor = { x: TUN_X0, y: ny - TUN_HW, w: TUN_X1 - TUN_X0, d: TUN_HW * 2, r: 1 };
  out.push(S(k.slabOf(floor, PLINTH_H, BED_H - PLINTH_H, P, 4), style("lo", { crease: "none" })));
  shapes.push(record(A.slab(floor, PLINTH_H, BED_H - PLINTH_H, { name: "tunnel.floor", owner: "tunnel" }, 4)));
  for (const dy of [-1, 1]) {
    const wall = { x: TUN_X0, y: ny + dy * TUN_HW - (dy < 0 ? 0 : WALL_W), w: TUN_X1 - TUN_X0, d: WALL_W, r: 1 };
    out.push(S(k.slabOf(wall, BED_H, WALL_TOP - BED_H, P, 5, 0.7), style("mid", { inner: L(k.sideSeam(wall, WALL_TOP - 4, P, 5), { tone: "faint" }) })));
    shapes.push(record(A.slab(wall, BED_H, WALL_TOP - BED_H, { name: "tunnel.wall", owner: "tunnel" }, 5)));
  }
  const portal = { x: TUN_X0 - 5, y: ny - TUN_HW - 2, w: 5, d: (TUN_HW + 2) * 2, r: 1.5 };
  out.push(S(k.slabOf(portal, BED_H, WALL_TOP - BED_H + 2, P, 4, 0.6), style("hi", { inner: "" })));
  shapes.push(record(A.slab(portal, BED_H, WALL_TOP - BED_H + 2, { name: "tunnel.portal", owner: "tunnel" }, 4)));
  const roof = { x: TUN_X0 - 4, y: ny - TUN_HW - WALL_W, w: TUN_X1 - TUN_X0 + 10, d: (TUN_HW + WALL_W) * 2, r: 2 };
  out.push(S(k.slabOf(roof, WALL_TOP, ROOF_TOP - WALL_TOP, P, 6, 0.8), style("mid", { inner: "" })));
  shapes.push(record(A.slab(roof, WALL_TOP, ROOF_TOP - WALL_TOP, { name: "tunnel.roof", owner: "tunnel" }, 6)));
  out.push(L(k.planOutline(k.insetPlan(roof, 2.6), ROOF_TOP, P, 5), { tone: "faint" }));
  const hatch = { x: roof.x + 16, y: roof.y + 3, w: 22, d: roof.d - 6, r: 1 };
  out.push(L(k.planOutline(hatch, ROOF_TOP, P, 3), { tone: "lo" }));
  out.push(dots3([[hatch.x + 3, hatch.y + hatch.d / 2, ROOF_TOP], [hatch.x + 19, hatch.y + hatch.d / 2, ROOF_TOP]], { size: 0.5 }));
  out.push(L(k.lineOnTop([roof.x, roof.y + roof.d / 2], [roof.x + roof.w, roof.y + roof.d / 2], ROOF_TOP, P), { tone: "faint" }));
  return { svg: out.join(""), shapes };
}
function tunnels() {
  NODE_Y.forEach((ny, index) => {
    const shell = tunnelParts(ny);
    put(`tunnel.shell${index + 1}`, shell.svg, shell.shapes, { at: [176, ny, 14] });
  });
}

// ---------------------------------------------------------------- one node on the roof
const gaugeZ = (node) => (node.alive ? SOCK_TOP + 3 + (node.ms / 240) * 12 : MAST_TOP - 2);
function nodeParts(ny, index) {
  const node = NODES[index];
  const owner = `node${index + 1}`;
  const out = [];
  const shapes = [];
  const sock = { x: NODE_X - 11, y: ny - 7, w: 22, d: 14, r: 1.5 };
  out.push(S(k.slabOf(sock, ROOF_TOP, SOCK_TOP - ROOF_TOP, P, 4, 0.6), style("hi", { inner: "" })));
  shapes.push(record(A.slab(sock, ROOF_TOP, SOCK_TOP - ROOF_TOP, { name: `node.socket${index + 1}`, owner }, 4)));
  if (node.alive) {
    out.push(S(k.cylinder(NODE_X, ny, 4.4, SOCK_TOP, 4, P, 24), style("hi", { crease: "lo" })));
    shapes.push(record(A.cylinder(NODE_X, ny, 4.4, SOCK_TOP, 4, { name: `node.plug${index + 1}`, owner })));
    out.push(L(k.ring(NODE_X, ny, 2.6, BUSH_TOP, P, 20), { tone: "lo" }));
  } else {
    out.push(S(k.cylinder(NODE_X, ny, 5, SOCK_TOP, 2.4, P, 24), style("mid", { crease: "lo" })));
    shapes.push(record(A.cylinder(NODE_X, ny, 5, SOCK_TOP, 2.4, { name: `node.cap${index + 1}`, owner })));
    out.push(L(k.lineOnTop([NODE_X - 3.4, ny - 3.4], [NODE_X + 3.4, ny + 3.4], SOCK_TOP + 2.4, P), { tone: "mid" }));
    out.push(L(k.lineOnTop([NODE_X - 3.4, ny + 3.4], [NODE_X + 3.4, ny - 3.4], SOCK_TOP + 2.4, P), { tone: "mid" }));
  }
  const plate = { x: NODE_X - 9, y: ny + 7.1, w: 18, d: 1.4, r: 0.3 };
  out.push(S(k.slabOf(plate, ROOF_TOP + 3, 6, P, 3, 0.4), style("hi", { crease: "lo" })));
  shapes.push(record(A.slab(plate, ROOF_TOP + 3, 6, { name: `node.plate${index + 1}`, owner }, 3)));
  out.push(k.faceTextSvg(k.sideMatrix([NODE_X + 8, ny + 8.6], ROOF_TOP + 5.6, P, "left"), node.id, { size: 2.4, tone: "hi", anchor: "end" }));
  const gx = NODE_X + 15;
  const mast = { x: gx, y: ny - 3.5, w: 5, d: 7, r: 1 };
  out.push(S(k.slabOf(mast, ROOF_TOP, MAST_TOP - ROOF_TOP, P, 3, 0.5), style("mid", { crease: "lo" })));
  shapes.push(record(A.slab(mast, ROOF_TOP, MAST_TOP - ROOF_TOP, { name: `gauge.mast${index + 1}`, owner }, 3)));
  const ticks = [];
  for (let i = 0; i <= 4; i++) ticks.push(k.lineOnTop([gx + 0.4, ny - 3.1], [i === 4 ? gx + 4.4 : gx + 3.4, ny - 3.1], ROOF_TOP + 6 + i * 4, P));
  out.push(L(ticks.join(""), { tone: "faint" }));
  return { svg: out.join(""), shapes };
}
function gaugeBlock(ny, index) {
  const node = NODES[index];
  const h = gaugeZ(node) - ROOF_TOP;
  const block = { x: NODE_X + 14.6, y: ny + 3.6, w: 5.8, d: 1, r: 0.3 };
  return {
    svg: `<g data-part="gblock" data-i="${index}" data-fallback="1" transform="${k.translateAlong(P, [0, 0, h])}"></g>`,
    shapes: [record(A.slab(block, gaugeZ(node), 2, { name: `gauge.block${index + 1}`, owner: `gauge${index + 1}` }, 3))],
    at: [NODE_X + 17.5, ny + 4, gaugeZ(node) + 1],
  };
}
function buildNodes() {
  NODE_Y.forEach((ny, index) => {
    const node = nodeParts(ny, index);
    put(`node${index + 1}`, node.svg, node.shapes, { at: [NODE_X, ny, SOCK_TOP], piece: `node${index + 1}` });
    const block = gaugeBlock(ny, index);
    put(`gauge.block${index + 1}`, block.svg, block.shapes, { at: block.at, bias: 0.8, piece: `node${index + 1}` });
  });
}

// ---------------------------------------------------------------- the selector gantry over the shells
const POST_Y = [-96, -6];
function postParts(ny) {
  const plan = { x: NODE_X - 3, y: ny - 3, w: 6, d: 6, r: 1.5 };
  return {
    svg: S(k.slabOf(plan, ROOF_TOP + 0.1, SELECTOR_Z - ROOF_TOP - 0.1, P, 4, 0.6), style("mid", { inner: L(k.sideSeam(plan, SELECTOR_Z - 12, P, 4), { tone: "faint" }) })) +
      L(k.planOutline(k.insetPlan(plan, 1.2), SELECTOR_Z, P, 3), { tone: "faint" }),
    shapes: [record(A.slab(plan, ROOF_TOP + 0.1, SELECTOR_Z - ROOF_TOP - 0.1, { name: "selector.post", owner: "bank" }, 4))],
  };
}
function selector() {
  POST_Y.forEach((ny, index) => {
    const post = postParts(ny);
    put(`selector.post${index + 1}`, post.svg, post.shapes, { at: [NODE_X, ny, 55] });
  });
  const beam = { x: NODE_X - 6, y: POST_Y[0] - 6, w: 12, d: POST_Y[1] - POST_Y[0] + 12, r: 2 };
  const bOut = [S(k.slabOf(beam, SELECTOR_Z, 7, P, 5, 0.8), style("mid", { inner: L(k.sideSeam(beam, SELECTOR_Z + 2.6, P, 5), { tone: "faint" }) }))];
  bOut.push(L(k.planOutline(k.insetPlan(beam, 2.5), SELECTOR_Z + 7, P, 3), { tone: "faint" }));
  put("selector.beam", bOut.join(""), [record(A.slab(beam, SELECTOR_Z, 7, { name: "selector.beam", owner: "bank" }, 5))], { at: [NODE_X, (POST_Y[0] + POST_Y[1]) / 2, SELECTOR_Z + 3.5] });

  const hOut = [];
  const hShapes = [];
  const block = { x: NODE_X - 9, y: NODE_Y[0] - 6, w: 18, d: 12, r: 2 };
  hOut.push(S(k.slabOf(block, SELECTOR_Z - 12, 12, P, 4, 0.6), style("hi", { crease: "lo", inner: "" })));
  hShapes.push(record(A.slab(block, SELECTOR_Z - 12, 12, { name: "selector.head", owner: "selector" }, 4)));
  hOut.push(S(k.cylinder(NODE_X, NODE_Y[0], 2.8, 62, 12, P, 20), style("mid")));
  hShapes.push(record(A.cylinder(NODE_X, NODE_Y[0], 2.8, 62, 12, { name: "selector.sleeve", owner: "selector" })));
  put("selector.head", `<g data-part="shead" data-fallback="1" transform="${k.translateAlong(P, [0, NODE_Y[0], 0])}"></g>` +
    `<g data-part="probe" data-fallback="1" transform="${k.translateAlong(P, [0, 0, 0])}"></g>`,
    [...hShapes, record(A.cylinder(NODE_X, NODE_Y[0], 1.4, 56, 20, { name: "selector.probe", owner: "selector" }))], { at: [NODE_X, NODE_Y[1], 68] });
}

// ---------------------------------------------------------------- the two control levers
function lever(name, cx, cy, count, z0) {
  const out = [];
  const shapes = [];
  const plate = { x: cx - 16, y: cy - 8, w: 32, d: 16, r: 2 };
  out.push(S(k.slabOf(plate, z0, 3, P, 4, 0.6), style("mid", { inner: L(k.planOutline(k.insetPlan(plate, 2.5), z0 + 3, P, 4), { tone: "faint" }) })));
  shapes.push(record(A.slab(plate, z0, 3, { name: `${name}.base`, owner: name }, 4)));
  for (let i = 0; i < count; i++) {
    const angle = -0.7 + (i * 1.4) / (count - 1);
    const nx = cx + Math.sin(angle) * 9.5, ny = cy + Math.cos(angle) * 9.5;
    const notch = { x: nx - 1.4, y: ny - 1.4, w: 2.8, d: 2.8, r: 0.6 };
    out.push(S(k.slabOf(notch, z0 + 3, 1.2, P, 2, 0.3), style("lo", { crease: "none" })));
    shapes.push(record(A.slab(notch, z0 + 3, 1.2, { name: `${name}.notch`, owner: name }, 2)));
  }
  out.push(S(k.cylinder(cx, cy, 4.4, z0 + 3, 2.4, P, 24), style("hi")));
  shapes.push(record(A.cylinder(cx, cy, 4.4, z0 + 3, 2.4, { name: `${name}.hub`, owner: name })));
  out.push(`<g data-part="${name}"><path class="iso-line" data-tone="lit" data-lever="1" data-free="start" d="${k.lineOnTop([cx, cy], [cx, cy + 9.5], z0 + 5.6, P)}"/>` +
    `<g data-part="${name}-knob"><path class="iso-fill" d=""/><path class="iso-shade" data-shade="0" d=""/><path class="iso-shade" data-shade="1" d=""/><path class="iso-shade" data-shade="2" d=""/><path class="iso-shade" data-shade="3" d=""/><path class="iso-top" d=""/><path class="iso-line iso-crease" data-tone="faint" d=""/><path class="iso-line iso-edge" data-tone="hi" d=""/><path class="iso-line" data-knurl="1" data-tone="lo" d=""/></g></g>`);
  put(`${name}.lever`, out.join(""), shapes, { at: [cx, cy, z0 + 4], piece: name });
}

// ---------------------------------------------------------------- the packet car (rebuilt per frame at any heading)
function carPaths(angle) {
  const c = Math.cos(angle), s = Math.sin(angle);
  const rot = ([px, py]) => [px * c - py * s, px * s + py * c];
  const ring = (plan, steps) => k.roundedPlan(plan, steps).map(rot);
  const box = (plan, z, h, steps, bevel) => k.extrude(ring(plan, steps), z, h, P, { bevel });
  const out = [];
  const shapes = [];
  out.push(`<path class="iso-halo" d="${box(k.insetPlan(CAR, 3), DECK_Z, 0.1, 3, 0).fill}" style="filter:blur(4px)"/>`);
  out.push(S(box(CAR, DECK_Z, DECK_TOP - DECK_Z, 5, 0.8), style("hi", { crease: "lo", lit: true, inner: L(k.onTop(ring(k.insetPlan(CAR, 2.4), 5), DECK_TOP - 2.4, P), { tone: "faint" }) })));
  shapes.push(record(A.extruded(ring(CAR, 5), DECK_Z, DECK_TOP - DECK_Z, { name: "car.deck", owner: "car" })));
  for (const [bx, by] of [[-15, -6.6], [9, -6.6], [-15, 6.6], [9, 6.6]]) {
    const bogie = { x: bx - 3, y: by - 2.4, w: 6, d: 4.8, r: 1 };
    out.push(S(box(bogie, DECK_Z, 1.6, 3, 0.4), style("mid", { crease: "none" })));
    shapes.push(record(A.extruded(ring(bogie, 3), DECK_Z, 1.6, { name: "car.bogie", owner: "car" })));
  }
  out.push(S(box(WBILL, DECK_TOP, WBILL_TOP - DECK_TOP, 4, 0.6), style("hi", { crease: "lo" })));
  shapes.push(record(A.extruded(ring(WBILL, 4), DECK_TOP, WBILL_TOP - DECK_TOP, { name: "car.waybill", owner: "car" })));
  out.push(S(box(READ, WBILL_TOP, READ_TOP - WBILL_TOP, 3, 0.4), style("mid", { crease: "none" })));
  shapes.push(record(A.extruded(ring(READ, 3), WBILL_TOP, READ_TOP - WBILL_TOP, { name: "car.read", owner: "car" })));
  const xv = k.axisVector(P, [1, 0, 0]), yv = k.axisVector(P, [0, 1, 0]);
  const flat = (lx, ly, z) => {
    const q = rot([lx, ly]);
    const o = k.iso([q[0], q[1], z], P);
    const u = [xv[0] * c + yv[0] * s, xv[1] * c + yv[1] * s];
    const v = [-xv[0] * s + yv[0] * c, -xv[1] * s + yv[1] * c];
    return `matrix(${u[0]} ${u[1]} ${v[0]} ${v[1]} ${o[0]} ${o[1]})`;
  };
  out.push(`<text class="iso-face-text" data-tone="hi" data-car="host" transform="${flat(WBILL.x + 1.8, WBILL.y + 8.2, WBILL_TOP)}" font-size="2.6">—</text>`);
  out.push(`<text class="iso-face-text" data-tone="mid" data-car="ip" transform="${flat(WBILL.x + 1.8, WBILL.y + 12.4, WBILL_TOP)}" font-size="2.2">—</text>`);
  out.push(L(k.onTop(ring(k.insetPlan(WBILL, 1.2), 4), WBILL_TOP, P, true), { tone: "faint" }));
  out.push(dots3([[-15, 7.4, DECK_TOP], [-7, 7.4, DECK_TOP], [1, 7.4, DECK_TOP], [9, 7.4, DECK_TOP]].map(([px, py, pz]) => { const q = rot([px, py]); return [q[0], q[1], pz]; }), { size: 0.42, tone: "lo" }));
  const coupler = { x: CAR.x + CAR.w, y: -2, w: 4, d: 4, r: 1 };
  out.push(S(box(coupler, DECK_Z + 1, 2.4, 3, 0), style("mid", { crease: "none" })));
  shapes.push(record(A.extruded(ring(coupler, 3), DECK_Z + 1, 2.4, { name: "car.coupler", owner: "car" })));
  return { svg: out.join(""), shapes };
}
const CAR_REST = carPaths(0);

// ---------------------------------------------------------------- assemble
base();
intake();
rack();
cabinets();
gantry();
buildHeads();
turnout();
yard();
sidings();
tunnels();
buildNodes();
selector();
lever("mode", 56, 74, 3, 28);
lever("group", 100, 74, 3, 28);
put("car", `<g data-part="car"></g>`, CAR_REST.shapes, { at: [0, 0, 8], bias: 4 });

A.settle(R, P);
A.auditOrExit(R, P, {
  allow: [
    ["rack.slip6", "rack.frame"],      // the last waybill lies in the tray
    ["blade.heel", "blade"],           // the blade turns on the heel plate
    ["point.machine", "point.rod"],    // the rod is pinned to the machine
    ["yard.tracks", "yard.apron"],     // the fan's rails are cast into the apron
    ["crusher.frame", "crusher.ram"],  // the ram runs between its columns
    ["yard.tracks", "intake.hood"],    // the lead passes through the hood, a sliver at its edge
    ["yard.tracks", "lock.bar"],       // the shaft hangs over the lead, a sliver at its edge
  ],
});
const items = R.items.slice().sort((a, b) => a.key - b.key);
const art = items.map((item) => `<g data-k="${item.key.toFixed(2)}">${item.svg}</g>`).join("");

const figure = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    "一台规则路由台。一节报文小车沿单轨向右行驶，经过六个规则检测头：每个头按顺序检测车上的运单，第一个相符的头会落下探针并转动联锁轴，从而扳动道岔。道岔把小车送往本地货棚（DIRECT）、粉碎机（REJECT）或隧道库（PROXY）；隧道库上方的选路头依次检测四个节点，把探针落在代理组选中的节点上，小车随后驶入那条隧道。",
  body: `<g data-art>${art}</g>`,
});

const DATA = {
  P,
  HEADS,
  HEAD_Y,
  BODY_Z: 24,
  READ_TOP,
  NODE_X,
  NODE_Y,
  ROOF_TOP,
  SOCK_TOP,
  MAST_TOP,
  SELECTOR_Z,
  PIVOT,
  BLADE_ANGLE,
  BLADE_Z,
  ROUTES,
  PROXY: NODE_Y.map((_, index) => proxyRoute(index)),
  GAUGE: NODES.map((node) => ({ id: node.id, alive: node.alive, ms: node.ms, z: gaugeZ(node) })),
  LEVER_Z: 28,
  LEVER_X: { mode: 56, group: 100 },
  LEVER_Y: 74,
  CAR,
  DECK_Z,
  DECK_TOP,
  WBILL,
  WBILL_TOP,
  READ,
  READ_TOP,
  SPEED: 96,
  STILL: 1.1,
};

const live = readFileSync(join(HERE, "live.js"), "utf8");
const model = readFileSync(join(HERE, "model.mjs"), "utf8").replace(/^export /gm, "");

writeFileSync(
  join(HERE, theme === "light" ? "clash-light.html" : "clash.html"),
  k.pageHtml({
    title: "Clash：规则路由台",
    theme,
    body: k.plateHtml({
      fig: "图 1",
      title: "Clash：规则如何选路",
      hint: "悬停运单 · ←→ 报文 · S 组 · M 模式",
      readout: "启动中",
      keys: [
        { mark: "lit", label: "报文小车，以及命中它的那条规则" },
        { mark: "raised", label: "六个规则头按顺序检测（1 点 … 6 点）：先匹配者胜" },
        { mark: "edge", label: "联锁轴：第一条命中的规则扳动它，后面的规则再也落不下来" },
        { mark: "dim", label: "三个出口：货棚 = DIRECT，粉碎机 = REJECT，隧道 = PROXY" },
      ],
      caption:
        "Clash 是一个基于规则的隧道。报文带着一个名字进来：fake-ip 应答（198.18.0.0/16）或嗅探出的域名把它还原出来。规则表从上往下读——DOMAIN-SUFFIX、DOMAIN-KEYWORD、DST-PORT、GEOIP、MATCH——第一条命中的规则决定出口：DIRECT、REJECT，或者一个代理组。代理组按自己的规则选节点：url-test 在 50 ms 容差内取延迟最低者，fallback 取列表中第一个还活着的，load-balance 按目标地址做哈希。其余的部分都一样：这一个报文，最终只进一条隧道。",
      body: `<div class="iso-stage" tabindex="0" role="group" aria-label="规则路由台：方向键选择报文，S 切换代理组，M 切换模式"><style>.iso-stage{touch-action:pan-y}.iso-stage [data-slip]{cursor:pointer}.iso-stage [data-slip]:hover .iso-top{fill:var(--anatomy-lit-top)}.iso-stage [data-slip]:hover .iso-edge{stroke:var(--anatomy-lit)}.iso-live{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}</style>${figure}<span class="iso-live" aria-live="polite" data-live></span></div>`,
    }),
    script: `const DATA = ${JSON.stringify(DATA)};\n` + kitScript() + model + live,
  }),
);
console.log("wrote", theme === "light" ? "clash-light.html" : "clash.html", `· ${R.solids.length} solids · ${R.items.length} items`);
