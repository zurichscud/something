// Live behaviour of the routing bench. Read after the data, the kit and the model.
(() => {
  const PLINTH = 6;
  const stage = document.querySelector(".iso-stage");
  const svg = stage.querySelector("svg");
  const readout = document.querySelector("[data-readout]");
  const region = document.querySelector("[data-live]");
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const P = DATA.P;
  const $ = (selector) => svg.querySelector(selector);
  const $$ = (selector) => [...svg.querySelectorAll(selector)];
  const at = (point) => iso(point, P);
  const clamp = (value, low, high) => Math.min(high, Math.max(low, value));

  // ---------------------------------------------------------------- geometry the page keeps live
  const led = (tone, inner) => ({ tone, crease: "lo", inner });
  const knurlArt = (cx, cy, r, z0, z1, count, inset) => lineSvg(knurl(cx, cy, r, z0, z1, count, P, inset), { tone: "lo" });
  function feelerArt(hx) {
    return solidSvg(cylinder(hx, DATA.HEAD_Y, 2.0, -4, 9, P, 20), led("hi")) +
      solidSvg(cylinder(hx, DATA.HEAD_Y, 2.9, -5.2, 1.3, P, 20), { tone: "mid" }) +
      solidSvg(cylinder(hx, DATA.HEAD_Y, 1.0, -7.7, 2.5, P, 16), { tone: "hi" });
  }
  function gaugeArt(ny) {
    const block = { x: DATA.NODE_X + 14.6, y: ny + 3.6, w: 5.8, d: 1, r: 0.3 };
    return solidSvg(slabOf(block, DATA.ROOF_TOP, 2, P, 3, 0.4), { tone: "lit", crease: "none", lit: true });
  }
  function knobArt(cx, cy, z0) {
    return solidSvg(cylinder(cx, cy + 9.5, 3, z0 + 5.6, 4, P, 24), led("hi", knurlArt(cx, cy + 9.5, 3, z0 + 5.6, z0 + 9.6, 20, 0.4)));
  }
  function carArt(angle) {
    const c = Math.cos(angle), s = Math.sin(angle);
    const rot = ([px, py]) => [px * c - py * s, px * s + py * c];
    const ring = (plan, steps) => roundedPlan(plan, steps).map(rot);
    const box = (plan, z, h, steps, bevel) => extrude(ring(plan, steps), z, h, P, { bevel });
    const out = [];
    out.push(`<path class="iso-halo" d="${box(insetPlan(DATA.CAR, 3), DATA.DECK_Z, 0.1, 3, 0).fill}" style="filter:blur(4px)"/>`);
    out.push(solidSvg(box(DATA.CAR, DATA.DECK_Z, DATA.DECK_TOP - DATA.DECK_Z, 5, 0.8), { tone: "hi", crease: "lo", lit: true, inner: lineSvg(onTop(ring(insetPlan(DATA.CAR, 2.4), 5), DATA.DECK_TOP - 2.4, P), { tone: "faint" }) }));
    for (const [bx, by] of [[-15, -6.6], [9, -6.6], [-15, 6.6], [9, 6.6]]) {
      out.push(solidSvg(box({ x: bx - 3, y: by - 2.4, w: 6, d: 4.8, r: 1 }, DATA.DECK_Z, 1.6, 3, 0.4), { tone: "mid", crease: "none" }));
    }
    out.push(solidSvg(box(DATA.WBILL, DATA.DECK_TOP, DATA.WBILL_TOP - DATA.DECK_TOP, 4, 0.6), { tone: "hi", crease: "lo" }));
    out.push(solidSvg(box(DATA.READ, DATA.WBILL_TOP, DATA.READ_TOP - DATA.WBILL_TOP, 3, 0.4), { tone: "mid", crease: "none" }));
    const xv = axisVector(P, [1, 0, 0]), yv = axisVector(P, [0, 1, 0]);
    const flat = (lx, ly, z) => {
      const q = rot([lx, ly]);
      const o = iso([q[0], q[1], z], P);
      const u = [xv[0] * c + yv[0] * s, xv[1] * c + yv[1] * s];
      const v = [-xv[0] * s + yv[0] * c, -xv[1] * s + yv[1] * c];
      return `matrix(${u[0]} ${u[1]} ${v[0]} ${v[1]} ${o[0]} ${o[1]})`;
    };
    out.push(`<text class="iso-face-text" data-tone="hi" data-car="host" transform="${flat(DATA.WBILL.x + 1.8, DATA.WBILL.y + 8.2, DATA.WBILL_TOP)}" font-size="2.6">—</text>`);
    out.push(`<text class="iso-face-text" data-tone="mid" data-car="ip" transform="${flat(DATA.WBILL.x + 1.8, DATA.WBILL.y + 12.4, DATA.WBILL_TOP)}" font-size="2.2">—</text>`);
    out.push(lineSvg(onTop(ring(insetPlan(DATA.WBILL, 1.2), 4), DATA.WBILL_TOP, P, true), { tone: "faint" }));
    out.push(dotsSvg(pointsAt([[-15, 7.4, DATA.DECK_TOP], [-7, 7.4, DATA.DECK_TOP], [1, 7.4, DATA.DECK_TOP], [9, 7.4, DATA.DECK_TOP]].map(([px, py, pz]) => { const q = rot([px, py]); return [q[0], q[1], pz]; }), P), { size: 0.42, tone: "lo" }));
    out.push(solidSvg(box({ x: DATA.CAR.x + DATA.CAR.w, y: -2, w: 4, d: 4, r: 1 }, DATA.DECK_Z + 1, 2.4, 3, 0), { tone: "mid", crease: "none" }));
    return out.join("");
  }

  // fill the parts the page draws itself, so the audit still sees the whole figure
  DATA.HEADS.forEach((hx, i) => {
    const feeler = $(`[data-part="feeler"][data-i="${i}"]`);
    if (feeler) { feeler.innerHTML = feelerArt(hx); feeler.removeAttribute("data-fallback"); }
  });
  DATA.NODE_Y.forEach((ny, i) => {
    const block = $(`[data-part="gblock"][data-i="${i}"]`);
    if (block) { block.innerHTML = gaugeArt(ny); block.removeAttribute("data-fallback"); }
  });
  {
    const block = { x: DATA.NODE_X - 9, y: -6, w: 18, d: 12, r: 2 };
    const head = $(`[data-part="shead"]`);
    if (head) {
      head.innerHTML = solidSvg(slabOf(block, DATA.SELECTOR_Z - 12, 12, P, 4, 0.6), led("hi", lineSvg(sideSeam(block, DATA.SELECTOR_Z - 8, P, 4), { tone: "faint" }))) +
        solidSvg(cylinder(DATA.NODE_X, 0, 2.8, 62, 12, P, 20), { tone: "mid" });
      head.removeAttribute("data-fallback");
    }
    const probe = $(`[data-part="probe"]`);
    if (probe) { probe.innerHTML = solidSvg(cylinder(DATA.NODE_X, 0, 1.4, 56, 20, P, 16), { tone: "lit", crease: "none", lit: true }); probe.removeAttribute("data-fallback"); }
  }
  for (const name of ["mode", "group"]) {
    const knob = $(`[data-part="${name}-knob"]`);
    if (knob) knob.innerHTML = knobArt(DATA.LEVER_X[name], DATA.LEVER_Y, DATA.LEVER_Z);
  }

  // ---------------------------------------------------------------- refs (after the fill)
  const carWrap = $('[data-part="car"]').parentElement;
  const car = $('[data-part="car"]');
  const art = $("[data-art]");
  const feelers = $$('[data-part="feeler"]');
  const ram = $('[data-part="ram"]');
  const blade = $('[data-part="blade"]');
  const armPaths = $$('[data-part="arms"] path');
  const probe = $('[data-part="probe"]');
  const shead = $('[data-part="shead"]');
  const gauges = $$('[data-part="gblock"]');
  const ticket = $('[data-part="ticket"] path');
  const rodPath = $('[data-rod]');
  const rodA = $('[data-rod-a]');
  const rodB = $('[data-rod-b]');
  const leverLine = { mode: $('[data-part="mode"] [data-lever]'), group: $('[data-part="group"] [data-lever]') };
  const leverKnob = { mode: $('[data-part="mode-knob"]'), group: $('[data-part="group-knob"]') };
  let hostText = car.querySelector('[data-car="host"]');
  let ipText = car.querySelector('[data-car="ip"]');

  // ---------------------------------------------------------------- helpers
  const LEAD = DATA.ROUTES.lead;
  const follow = (now, target, dt, tau, calm) => (calm ? target : now + (target - now) * (1 - Math.exp(-dt / tau)));
  const spring = (o, target, dt, k, d, calm) => {
    if (calm) { o.x = target; o.v = 0; return true; }
    for (let i = 0; i < 4; i++) { o.v += ((target - o.x) * k - o.v * d) * (dt / 4); o.x += o.v * (dt / 4); }
    if (Math.abs(target - o.x) < 0.002 && Math.abs(o.v) < 0.004) { o.x = target; o.v = 0; return true; }
    return false;
  };
  const burst = (age, rise, fall) => {
    if (age <= 0) return 0;
    const t = Math.min(1, age / rise);
    return age < rise ? t * t * (3 - 2 * t) : Math.exp(-(age - rise) / fall);
  };
  const lengthOf = (points) => {
    let sum = 0;
    for (let i = 1; i < points.length; i++) sum += Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
    return sum;
  };
  function sample(points, cum, s) {
    const value = clamp(s, 0, cum[cum.length - 1]);
    let i = 1;
    while (i < cum.length - 1 && cum[i] < value) i++;
    const span = cum[i] - cum[i - 1] || 1;
    const t = (value - cum[i - 1]) / span;
    const a = points[i - 1], b = points[i];
    return { x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t, heading: Math.atan2(b[1] - a[1], b[0] - a[0]) };
  }

  // ---------------------------------------------------------------- state
  let packetIndex = 3;
  let modeIndex = 0;
  let groupIndex = 0;
  let current = null;
  let tickets = 0;
  let ticketAngle = 0;
  let clock = 0;
  let plan = null;
  let carAngle = 999;
  let touring = !still.matches;
  let visible = false;
  let frame = 0;
  let last = 0;
  let idleTimer = 0;
  let announced = "";
  const feelerState = DATA.HEADS.map(() => ({ x: 0, v: 0 }));
  const bladeState = { x: 0, v: 0 };
  const lockState = { x: 0, v: 0 };
  const probeState = { x: 0, z: 0 };
  const jiggle = DATA.NODE_Y.map(() => ({ x: 0, v: 0 }));
  const leverState = { mode: { x: -0.7, v: 0 }, group: { x: -0.7, v: 0 } };

  function build(index) {
    const packet = PACKETS[index];
    const result = route(packet, { mode: MODES[modeIndex], group: GROUPS[groupIndex], node: current });
    let points;
    let nodeIndex = -1;
    if (result.target === "DIRECT") points = [...LEAD, ...DATA.ROUTES.direct.slice(1)];
    else if (result.target === "REJECT") points = [...LEAD, ...DATA.ROUTES.reject.slice(1)];
    else {
      nodeIndex = NODES.indexOf(result.node);
      points = [...LEAD, ...DATA.PROXY[nodeIndex].slice(1)];
    }
    const cum = [0];
    for (let i = 1; i < points.length; i++) cum.push(cum[i - 1] + Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]));
    const start = LEAD[0][0];
    const tAt = (s) => 0.34 + s / DATA.SPEED;
    const headTimes = DATA.HEADS.map((x) => tAt(x - start));
    const matchTime = result.mode === "rule" && result.ruleIndex >= 0 ? headTimes[result.ruleIndex] : Infinity;
    const bladeTime = tAt(lengthOf(LEAD));
    const endTime = tAt(cum[cum.length - 1]);
    const base = Math.max(0.5, Math.min(matchTime, bladeTime) + 0.2);
    const trail = [];
    if (result.target === "PROXY") {
      const landings = [];
      if (GROUPS[groupIndex] === "url-test") {
        DATA.NODE_Y.forEach((_, i) => landings.push({ i, t: base + i * 0.32 }));
        landings.push({ i: nodeIndex, t: base + DATA.NODE_Y.length * 0.32 });
      } else landings.push({ i: nodeIndex, t: base });
      let from = DATA.NODE_Y[0];
      for (const stop of landings) {
        trail.push({ from, to: DATA.NODE_Y[stop.i], t0: stop.t - 0.24, t1: stop.t, node: stop.i });
        from = DATA.NODE_Y[stop.i];
      }
    }
    return { index, packet, result, points, cum, total: cum[cum.length - 1], headTimes, matchTime, bladeTime, endTime, ramAt: endTime + 0.3, trail, nodeIndex };
  }
  const durationOf = (p) => (p.result.target === "REJECT" ? p.ramAt + 1.5 : p.endTime + DATA.STILL);
  const bladeTargetOf = (p) => (p.result.target === "DIRECT" ? DATA.BLADE_ANGLE : p.result.target === "PROXY" ? -DATA.BLADE_ANGLE : 0);
  function probeAt(p, t) {
    if (!p.trail.length) return { y: DATA.NODE_Y[0], drop: 0 };
    let y = p.trail[0].from;
    let drop = 0;
    for (const leg of p.trail) {
      if (t < leg.t0) break;
      const k = clamp((t - leg.t0) / Math.max(0.01, leg.t1 - leg.t0), 0, 1);
      y = leg.from + (leg.to - leg.from) * clamp(k * 1.5, 0, 1);
      drop = k < 0.5 ? 0 : k < 0.88 ? -6 : 0;
    }
    const last = p.trail[p.trail.length - 1];
    if (t >= last.t1) { y = last.to; drop = -6; }
    return { y, drop };
  }
  function makeText() {
    const dns = plan.result.dns;
    if (hostText) hostText.textContent = plan.packet.host;
    if (ipText) ipText.textContent = dns.kind === "literal" ? "literal ip" : dns.ip;
  }
  function load(index) {
    plan = build(index);
    clock = 0;
    announced = "";
    carAngle = 999;
    makeText();
  }
  const say = (text) => { if (readout.textContent !== text) readout.textContent = text; };
  const announce = (text) => { if (announced !== text) { announced = text; region.textContent = text; } };
  function readoutText(p) {
    const r = p.result;
    const rule = r.rule ? `规则${r.ruleIndex + 1} ${ruleLabel(r.rule)}` : `模式 ${r.mode}`;
    const dns = r.dns.kind === "fake" ? "fake-ip" : r.dns.kind === "real" ? "真 IP" : "IP";
    const out = r.target === "PROXY" && r.node ? `${r.target}(${GROUPS[groupIndex]}) ${r.node.id} ${r.node.ms}ms` : r.target === "REJECT" ? "REJECT 丢弃" : r.target;
    if (innerWidth < 560) return `规则${r.rule ? r.ruleIndex + 1 : "—"} → ${r.target === "PROXY" && r.node ? `${r.node.id} ${r.node.ms}ms` : r.target}`;
    return `${dns} ${r.dns.ip} · ${rule} → ${out}`;
  }

  // ---------------------------------------------------------------- draw
  function place(key) {
    let before = null;
    for (const node of art.children) {
      if (node === carWrap) continue;
      if (Number(node.dataset.k) > key) { before = node; break; }
    }
    if (before ? carWrap.nextElementSibling !== before : art.lastElementChild !== carWrap) art.insertBefore(carWrap, before);
  }
  function draw(dt) {
    const calm = still.matches;
    const p = plan;
    const t = clock;
    const s = Math.max(0, (t - 0.34) * DATA.SPEED);
    const here = sample(p.points, p.cum, s);
    const ahead = sample(p.points, p.cum, Math.min(p.total, s + 7));
    const heading = Math.abs(ahead.heading - here.heading) > 0.02 ? ahead.heading : here.heading;
    if (Math.abs(heading - carAngle) > 0.008) {
      car.innerHTML = carArt(heading);
      hostText = car.querySelector('[data-car="host"]');
      ipText = car.querySelector('[data-car="ip"]');
      makeText();
      carAngle = heading;
    }
    car.setAttribute("transform", translateAlong(P, [here.x, here.y, 0]));
    car.setAttribute("opacity", (s < 1 ? 0 : clamp(s / 11, 0, 1) * clamp((p.total - s) / 22, 0, 1)).toFixed(2));
    place(depthOf([here.x, here.y, 7], P) + 4);
    // the rule bank
    spring(lockState, p.result.mode === "rule" ? (t > p.matchTime + 0.07 ? 1 : 0) : 1, dt, 240, 27, calm);
    const armAngle = -0.62 * lockState.x;
    const spread = Math.abs(DATA.HEAD_Y + 12.7);
    armPaths.forEach((path, i) => {
      const hx = DATA.HEADS[i];
      path.setAttribute("d", segment([hx, -12.7, 19.9], [hx, -12.7 + spread * Math.cos(armAngle), 19.9 - spread * Math.sin(armAngle)], P));
    });
    feelers.forEach((element, i) => {
      const isMatch = i === p.result.ruleIndex && p.result.mode === "rule";
      const target = isMatch ? 1 : t > p.headTimes[i] && t < p.headTimes[i] + 0.3 ? 1 : 0;
      spring(feelerState[i], target, dt, 560, 25, calm);
      element.setAttribute("transform", translateAlong(P, [0, 0, DATA.BODY_Z - feelerState[i].x * 3.5]));
      const solid = element.querySelector(".iso-solid");
      if (solid) solid.toggleAttribute("data-lit", isMatch);
    });
    // the turnout and the point machine
    spring(bladeState, bladeTargetOf(p), dt, 180, 23, calm);
    const floor = (bladeState.x * Math.PI) / 180;
    const paths = extrude(bladeRingLive(floor), DATA.BLADE_Z, 1.4, P, { bevel: 0.4 });
    const kids = blade.children;
    kids[0].setAttribute("d", paths.fill);
    paths.shades.forEach((d, i) => kids[1 + i].setAttribute("d", d ?? ""));
    kids[5].setAttribute("d", paths.top);
    kids[6].setAttribute("d", paths.crease ?? "");
    kids[7].setAttribute("d", paths.outline);
    const rodFrom = [46, -38, PLINTH + 5];
    const rodTo = [DATA.PIVOT[0] - Math.cos(floor) + 15 * Math.sin(floor), -15 * Math.cos(floor) - Math.sin(floor), DATA.BLADE_Z + 0.6];
    if (rodPath) rodPath.setAttribute("d", segment(rodFrom, rodTo, P));
    const rodScreen = at(rodTo);
    if (rodB) { rodB.setAttribute("cx", rodScreen[0].toFixed(2)); rodB.setAttribute("cy", rodScreen[1].toFixed(2)); }
    if (rodA && !rodA.getAttribute("cx")) { const a = at(rodFrom); rodA.setAttribute("cx", a[0].toFixed(2)); rodA.setAttribute("cy", a[1].toFixed(2)); }
    // the selector over the shells
    if (p.result.target === "PROXY") {
      const want = probeAt(p, t);
      probeState.x = follow(probeState.x, want.y, dt, 0.1, calm);
      probeState.z = follow(probeState.z, want.drop, dt, 0.08, calm);
      shead.setAttribute("transform", translateAlong(P, [0, probeState.x - DATA.NODE_Y[0], 0]));
      probe.setAttribute("transform", translateAlong(P, [0, 0, probeState.z]));
    }
    gauges.forEach((element, i) => {
      const node = DATA.GAUGE[i];
      const leg = p.trail.find((l) => l.node === i);
      const bump = leg && node.alive ? burst(t - leg.t1, 0.05, 0.3) : 0;
      spring(jiggle[i], bump, dt, 320, 20, calm);
      element.setAttribute("transform", translateAlong(P, [0, 0, node.z - DATA.ROOF_TOP + jiggle[i].x * 1.6]));
    });
    if (p.result.dns.kind === "fake" && p.drumFor !== p.index) { p.drumFor = p.index; tickets += 1; }
    ticketAngle = follow(ticketAngle, tickets * (Math.PI / 4), dt, 0.25, calm);
    ticket.setAttribute("d", lineOnTop([-176, 48], [-176 + Math.sin(ticketAngle) * 8.4, 48 + Math.cos(ticketAngle) * 8.4], 26.4, P));
    // the two levers
    for (const name of ["mode", "group"]) {
      const index = name === "mode" ? modeIndex : groupIndex;
      spring(leverState[name], -0.7 + (index * 1.4) / 2, dt, 190, 23, calm);
      const cx = DATA.LEVER_X[name], cy = DATA.LEVER_Y, z = DATA.LEVER_Z + 5.6;
      const ang = leverState[name].x;
      if (leverLine[name]) leverLine[name].setAttribute("d", lineOnTop([cx, cy], [cx + Math.sin(ang) * 9.5, cy + Math.cos(ang) * 9.5], z, P));
      if (leverKnob[name]) leverKnob[name].setAttribute("transform", translateAlong(P, [Math.sin(ang) * 9.5, Math.cos(ang) * 9.5 - 9.5, 0]));
    }
    // the crusher's ram
    ram.setAttribute("transform", translateAlong(P, [0, 0, -26 * (p.result.target === "REJECT" ? clamp(burst(t - p.ramAt, 0.17, 0.36) * 1.2, 0, 1) : 0)]));
    say(readoutText(p));
    if (t < 0.4) announce(`${p.packet.host} 发车`);
    else if (p.result.ruleIndex >= 0 && t < p.matchTime + 0.5) announce(`命中规则 ${p.result.ruleIndex + 1} ${ruleLabel(p.result.rule)}`);
    else if (t < p.bladeTime + 0.6) announce(`道岔扳向 ${p.result.target}`);
    else if (p.result.target === "PROXY" && t < p.endTime) announce(`探针落在 ${p.result.node.id} · ${p.result.node.ms} ms`);
    return t < durationOf(p);
  }
  function bladeRingLive(angle) {
    const c = Math.cos(angle), s = Math.sin(angle);
    const pts = [[34, 0], [6, -2.6], [2, -3.1], [2, -15], [-4, -15], [-4, 3.1], [6, 2.6]];
    return pts.map(([u, v]) => [DATA.PIVOT[0] + u * c - v * s, DATA.PIVOT[1] + u * s + v * c]);
  }

  // ---------------------------------------------------------------- the loop
  function advance() {
    packetIndex = (packetIndex + 1) % PACKETS.length;
    load(packetIndex);
    last = 0;
    frame = visible ? requestAnimationFrame(tick) : 0;
  }
  function tick(now) {
    frame = 0;
    const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
    last = now;
    clock += dt;
    const more = draw(dt);
    if (!more) {
      if (touring) { advance(); return; }
      return;
    }
    if (visible) frame = requestAnimationFrame(tick);
  }
  const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
  function idle() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { if (!still.matches) { touring = true; advance(); run(); } }, 4200);
  }
  function steer(index) {
    packetIndex = index;
    touring = false;
    load(index);
    if (still.matches) { clock = durationOf(plan) * 0.62; draw(0.016); return; }
    idle();
    run();
  }
  function retune() {
    touring = false;
    current = null;
    if (still.matches) { steer(packetIndex); return; }
    load(packetIndex);
    idle();
    run();
  }
  new IntersectionObserver((entries) => {
    visible = entries[entries.length - 1].isIntersecting;
    if (visible) run();
  }, { rootMargin: "120px 0px" }).observe(stage);

  $$("[data-slip]").forEach((slip) => {
    const index = Number(slip.dataset.slip);
    slip.addEventListener("pointerenter", () => { slip.setAttribute("data-on", ""); steer(index); });
    slip.addEventListener("pointerleave", () => slip.removeAttribute("data-on"));
    slip.addEventListener("click", () => steer(index));
  });
  stage.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") { steer((packetIndex + 1) % PACKETS.length); event.preventDefault(); }
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") { steer((packetIndex + PACKETS.length - 1) % PACKETS.length); event.preventDefault(); }
    else if (event.key === "s" || event.key === "S") { groupIndex = (groupIndex + 1) % GROUPS.length; retune(); event.preventDefault(); }
    else if (event.key === "m" || event.key === "M") { modeIndex = (modeIndex + 1) % MODES.length; retune(); event.preventDefault(); }
    else if (event.key === " " || event.key === "Enter") { steer(packetIndex); event.preventDefault(); }
  });

  load(packetIndex);
  if (still.matches) { touring = false; clock = durationOf(plan) * 0.62; draw(0.016); }
  else { draw(0.016); run(); }
})();
