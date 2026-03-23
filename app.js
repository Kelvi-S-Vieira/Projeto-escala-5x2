/* ============================================================
   Simulador de Escala 5x2 — App Logic
   ============================================================ */

// ── Setores ──────────────────────────────────────────────────
const SETORES_SEP = ["Ilhas", "Ruas", "Restrita", "Encabidados"];
const SETORES_REC = ["Lar-Têxtil", "Vestuário", "Eletro/Eletrônico", "Beleza"];
const SETORES_EXP = ["Ilhas", "Ruas", "Restrita", "Encabidados"];

// ── Metas semanais ────────────────────────────────────────────
const META_SEP_61 = [881191, 141479, 87258.72, 942870];
const META_SEP_52 = [881191, 141479, 87258.72, 942870];
const META_REC_61 = [521730, 1085348, 18276, 78488];
const META_REC_52 = [521730, 1085348, 18276, 78488];
const META_EXP_61 = [881191, 141479, 87258.72, 942870];
const META_EXP_52 = [881191, 141479, 87258.72, 942870];

// ── Produtividade por operador/hora ───────────────────────────
const PROD_SEP = [300, 66, 150, 250];
const PROD_REC = [856, 856, 856, 856];
const PROD_EXP = [300, 66, 150, 250];

// ── Quadros padrão — Capacidade produtiva ────────────────────
const QUADRO_CAP_SEP = [27, 17, 8, 11];
const QUADRO_CAP_REC = [3, 5, 1, 3];
const QUADRO_CAP_EXP = [12, 2, 4, 13];

// ── Uso de pack médio por área ────────────────────────────────
const USA_PACK_SEP = [true, true, false, true];
const USA_PACK_REC = [false, false, false, false];
const USA_PACK_EXP = [true, true, false, true];

/* ── Helpers ─────────────────────────────────────────────────── */
function rup(v)  { return Math.ceil(v); }
function fmt(v)  { return Math.round(v).toLocaleString("pt-BR"); }
function fmth(v) { return v.toFixed(1).replace(".", ",") + " h"; }

/* ── Build simulation block ────────────────────────────────────
   Quadro = ROUNDUP( Média diária ÷ Produtividade ÷ hProd )
   6×1: hProd fixo = 6  |  5×2: hProd = carga/5 − 1,8
*/
function buildBlock(meta, prod, usaPack, dias, pack, hProd) {
  return meta.map((m, i) => {
    const vol = usaPack[i] ? rup(m / pack) : m;
    const med = rup(vol / dias);
    const qdr = rup(med / prod[i] / hProd);
    return { meta: m, vol, med, qdr };
  });
}

/* ── Render data table ───────────────────────────────────────── */
function renderTable(id, setores, data) {
  const tot = k => data.reduce((a, b) => a + b[k], 0);
  document.getElementById(id).innerHTML = `
    <thead><tr>
      <th>Setor</th><th>Meta/sem</th><th>Vol. pack</th><th>Média/dia</th><th>Quadro</th>
    </tr></thead>
    <tbody>
      ${setores.map((s, i) => `
        <tr>
          <td>${s}</td>
          <td>${fmt(data[i].meta)}</td>
          <td>${fmt(data[i].vol)}</td>
          <td>${fmt(data[i].med)}</td>
          <td class="highlight">${fmt(data[i].qdr)}</td>
        </tr>`).join("")}
      <tr>
        <td>Total</td>
        <td>${fmt(tot("meta"))}</td>
        <td>${fmt(tot("vol"))}</td>
        <td>${fmt(tot("med"))}</td>
        <td>${fmt(tot("qdr"))}</td>
      </tr>
    </tbody>`;
}

/* ── Render diff table ───────────────────────────────────────── */
function diffTable(id, setores, d61, d52) {
  const dmTot = d52.reduce((a,b)=>a+b.med,0) - d61.reduce((a,b)=>a+b.med,0);
  const dqTot = d52.reduce((a,b)=>a+b.qdr,0) - d61.reduce((a,b)=>a+b.qdr,0);
  document.getElementById(id).innerHTML = `
    <thead><tr>
      <th>Setor</th><th>Δ Média/dia</th><th>Δ Quadro</th>
    </tr></thead>
    <tbody>
      ${setores.map((s, i) => {
        const dm = d52[i].med - d61[i].med;
        const dq = d52[i].qdr - d61[i].qdr;
        return `<tr>
          <td>${s}</td>
          <td class="${dm>0?"pos":dm<0?"neg":""}">${dm>0?"+":""}${fmt(dm)}</td>
          <td class="${dq>0?"pos":dq<0?"neg":""}">${dq>0?"+":""}${fmt(dq)}</td>
        </tr>`;
      }).join("")}
      <tr>
        <td>Total</td>
        <td class="${dmTot>0?"pos":dmTot<0?"neg":""}">${dmTot>0?"+":""}${fmt(dmTot)}</td>
        <td class="${dqTot>0?"pos":dqTot<0?"neg":""}">${dqTot>0?"+":""}${fmt(dqTot)}</td>
      </tr>
    </tbody>`;
}

/* ── Render capacity table with editable quadro ──────────────── */
function renderCapTable(id, prefix, setores, quadroDefault, prod, usaPack, hProd, pack) {
  const colors  = ["b1", "b2", "b3", "b4"];
  const already = !!document.getElementById(`cap-${prefix}-0`);

  const quadros = setores.map((_, i) => {
    const el = document.getElementById(`cap-${prefix}-${i}`);
    return el ? (parseInt(el.value) || 0) : quadroDefault[i];
  });

  const rows = setores.map((setor, i) => {
    const q      = quadros[i];
    const capDia = q * hProd * prod[i];
    const volSem = capDia * 5;
    const pecas  = usaPack[i] ? volSem * pack : volSem;
    return { setor, q, capDia, volSem, pecas, i, color: colors[i] };
  });

  const maxPecas = Math.max(...rows.map(r => r.pecas));
  const totCap   = rows.reduce((a, r) => a + r.capDia, 0);
  const totVol   = rows.reduce((a, r) => a + r.volSem, 0);
  const totPecas = rows.reduce((a, r) => a + r.pecas, 0);
  const totQ     = rows.reduce((a, r) => a + r.q, 0);

  if (!already) {
    document.getElementById(id).innerHTML = `
      <table>
        <thead><tr>
          <th>Setor</th><th>Quadro</th><th>H. produtivas</th>
          <th>Cap. diária</th><th>Vol. semanal</th><th>Peças/sem</th>
          <th style="width:100px">Dist.</th>
        </tr></thead>
        <tbody>
          ${rows.map(r => `
            <tr>
              <td>${r.setor}</td>
              <td><input class="cap-input" id="cap-${prefix}-${r.i}"
                type="number" value="${r.q}" min="0" max="200" step="1"
                oninput="recalcCap()"></td>
              <td id="cap-hprod-${prefix}-${r.i}">${fmth(hProd)}</td>
              <td id="cap-dia-${prefix}-${r.i}">${fmt(r.capDia)}</td>
              <td id="cap-vol-${prefix}-${r.i}">${fmt(r.volSem)}</td>
              <td class="highlight" id="cap-pec-${prefix}-${r.i}">${fmt(r.pecas)}</td>
              <td><div class="bar-track" style="height:12px">
                <div class="bar-fill ${r.color}" id="cap-bar-${prefix}-${r.i}"
                  style="width:${maxPecas>0?Math.round(r.pecas/maxPecas*100):0}%;font-size:9px;padding-left:4px">
                  ${maxPecas>0?Math.round(r.pecas/maxPecas*100)+"%":""}
                </div>
              </div></td>
            </tr>`).join("")}
          <tr>
            <td>Total</td>
            <td id="cap-tot-q-${prefix}">${fmt(totQ)}</td>
            <td>—</td>
            <td id="cap-tot-dia-${prefix}">${fmt(totCap)}</td>
            <td id="cap-tot-vol-${prefix}">${fmt(totVol)}</td>
            <td id="cap-tot-pec-${prefix}">${fmt(totPecas)}</td>
            <td></td>
          </tr>
        </tbody>
      </table>`;
    return;
  }

  rows.forEach(r => {
    document.getElementById(`cap-hprod-${prefix}-${r.i}`).textContent = fmth(hProd);
    document.getElementById(`cap-dia-${prefix}-${r.i}`).textContent   = fmt(r.capDia);
    document.getElementById(`cap-vol-${prefix}-${r.i}`).textContent   = fmt(r.volSem);
    document.getElementById(`cap-pec-${prefix}-${r.i}`).textContent   = fmt(r.pecas);
    const bar = document.getElementById(`cap-bar-${prefix}-${r.i}`);
    const pct = maxPecas > 0 ? Math.round(r.pecas / maxPecas * 100) : 0;
    bar.style.width = pct + "%";
    bar.textContent = pct + "%";
  });
  document.getElementById(`cap-tot-q-${prefix}`).textContent   = fmt(totQ);
  document.getElementById(`cap-tot-dia-${prefix}`).textContent = fmt(totCap);
  document.getElementById(`cap-tot-vol-${prefix}`).textContent = fmt(totVol);
  document.getElementById(`cap-tot-pec-${prefix}`).textContent = fmt(totPecas);
}

/* ── Recalc capacity only (triggered by quadro inputs) ────────── */
function recalcCap() {
  const carga = parseFloat(document.getElementById("in-carga").value) || 40;
  const pack  = parseFloat(document.getElementById("in-pack").value)  || 7.2;
  const hProd = (carga / 5) - 1.8;
  renderCapTable("cap-sep", "sep", SETORES_SEP, QUADRO_CAP_SEP, PROD_SEP, USA_PACK_SEP, hProd, pack);
  renderCapTable("cap-rec", "rec", SETORES_REC, QUADRO_CAP_REC, PROD_REC, USA_PACK_REC, hProd, pack);
  renderCapTable("cap-exp", "exp", SETORES_EXP, QUADRO_CAP_EXP, PROD_EXP, USA_PACK_EXP, hProd, pack);
  renderBars(hProd, pack);
}

/* ── Render distribution bar chart (Separação) ───────────────── */
function renderBars(hProd, pack) {
  const colors = ["b1", "b2", "b3", "b4"];
  const cap = SETORES_SEP.map((setor, i) => {
    const el  = document.getElementById(`cap-sep-${i}`);
    const q   = el ? (parseInt(el.value) || QUADRO_CAP_SEP[i]) : QUADRO_CAP_SEP[i];
    const pec = q * hProd * PROD_SEP[i] * 5 * (USA_PACK_SEP[i] ? pack : 1);
    return { setor, q, pecas: pec, color: colors[i] };
  });
  const maxP = Math.max(...cap.map(d => d.pecas));
  document.getElementById("bars-sep").innerHTML = cap.map(d => `
    <div class="bar-row">
      <div class="bar-label">${d.setor}</div>
      <div class="bar-track">
        <div class="bar-fill ${d.color}" style="width:${maxP>0?Math.round(d.pecas/maxP*100):0}%">
          ${fmt(d.pecas)}
        </div>
      </div>
      <div class="bar-ops">${d.q} op.</div>
    </div>`).join("");
}

/* ── Render schedule ─────────────────────────────────────────── */
function renderSched(carga, modelo) {
  const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const eq1  = modelo === "Segunda a Sexta" ? [1,1,1,1,1,0,0] : [1,1,1,1,1,1,0];
  const eq2  = modelo === "Segunda a Sexta" ? [0,0,0,0,0,0,0] : [0,1,1,1,1,1,0];
  let html = "<div></div>";
  days.forEach(d => { html += `<div class="sched-head">${d}</div>`; });
  ["Equipe 1", "Equipe 2"].forEach((eq, ei) => {
    html += `<div class="sched-label">${eq}</div>`;
    (ei === 0 ? eq1 : eq2).forEach((v, di) => {
      let cls;
      if (di === 6) {
        cls = "sched-cell weekend"; // Domingo: sempre cinza
      } else if (di === 5) {
        cls = v ? "sched-cell on" : "sched-cell saturday-off"; // Sábado: azul se trabalha, amarelo se não
      } else {
        cls = v ? "sched-cell on" : "sched-cell off-day"; // Seg-Sex: azul ou branco
      }
      html += `<div class="${cls}">${v ? fmth(carga / 5) : "—"}</div>`;
    });
  });
  document.getElementById("sched").innerHTML = html;
}

/* ── Render KPIs ─────────────────────────────────────────────── */
function renderKPIs(s61, s52, r61, r52, e61, e52) {
  const sum = (arr, k) => arr.reduce((a,b) => a + b[k], 0);
  const kpi = (label, val61, val52) => {
    const d = val52 - val61;
    return `
      <div class="kpi">
        <div class="kpi-label">${label} 6×1</div>
        <div class="kpi-val">${fmt(val61)}</div>
        <div class="kpi-delta">operadores</div>
      </div>
      <div class="kpi">
        <div class="kpi-label">${label} 5×2</div>
        <div class="kpi-val">${fmt(val52)}</div>
        <div class="kpi-delta ${d>0?"pos":"neg"}">${d>0?"+":""}${fmt(d)} vs 6×1</div>
      </div>`;
  };
  document.getElementById("kpi-row").innerHTML =
    kpi("Separação", sum(s61,"qdr"), sum(s52,"qdr")) +
    kpi("Recebimento", sum(r61,"qdr"), sum(r52,"qdr")) +
    kpi("Expedição", sum(e61,"qdr"), sum(e52,"qdr"));
}

/* ── Render produtividade reference panel ────────────────────── */
function renderProdPanel() {
  const colors = ["b1", "b2", "b3", "b4"];
  const maxSep = Math.max(...PROD_SEP);
  const maxRec = Math.max(...PROD_REC);
  const bar = (s, prod, max, i) => `
    <div class="prod-row">
      <span class="prod-setor">${s}</span>
      <div class="bar-track" style="height:16px;flex:1">
        <div class="bar-fill ${colors[i]}" style="width:${Math.round(prod/max*100)}%;font-size:10px">${prod}</div>
      </div>
      <span class="prod-val">${prod} pç/h</span>
    </div>`;
  document.getElementById("prod-panel").innerHTML = `
    <div class="prod-grid" style="grid-template-columns:1fr 1fr 1fr">
      <div class="prod-block">
        <div class="prod-block-title">Separação — peças/operador/hora</div>
        ${SETORES_SEP.map((s,i) => bar(s, PROD_SEP[i], maxSep, i)).join("")}
      </div>
      <div class="prod-block">
        <div class="prod-block-title">Expedição — peças/operador/hora</div>
        ${SETORES_EXP.map((s,i) => bar(s, PROD_EXP[i], maxSep, i)).join("")}
      </div>
      <div class="prod-block">
        <div class="prod-block-title">Recebimento — peças/operador/hora</div>
        ${SETORES_REC.map((s,i) => bar(s, PROD_REC[i], maxRec, i)).join("")}
      </div>
    </div>`;
}

/* ── Main recalc ─────────────────────────────────────────────── */
function recalc() {
  const carga  = parseFloat(document.getElementById("in-carga").value) || 40;
  const pack   = parseFloat(document.getElementById("in-pack").value)  || 7.2;
  const modelo = document.getElementById("in-modelo").value;
  const hProd  = (carga / 5) - 1.8;

  document.getElementById("cv-carga").textContent  = carga + " h";
  document.getElementById("cv-pack").textContent   = pack.toFixed(1).replace(".", ",");
  document.getElementById("cv-hprod").textContent  = fmth(hProd);
  document.getElementById("cv-modelo").textContent = modelo === "Segunda a Sexta" ? "Seg–Sex" : "Revezando";
  document.getElementById("modelo-badge").textContent = modelo;

  const s61 = buildBlock(META_SEP_61, PROD_SEP, USA_PACK_SEP, 6, pack, 6);
  const r61 = buildBlock(META_REC_61, PROD_REC, USA_PACK_REC, 6, pack, 6);
  const e61 = buildBlock(META_EXP_61, PROD_EXP, USA_PACK_EXP, 6, pack, 6);
  const s52 = buildBlock(META_SEP_52, PROD_SEP, USA_PACK_SEP, 5, pack, hProd);
  const r52 = buildBlock(META_REC_52, PROD_REC, USA_PACK_REC, 5, pack, hProd);
  const e52 = buildBlock(META_EXP_52, PROD_EXP, USA_PACK_EXP, 5, pack, hProd);

  renderTable("tbl-sep-61", SETORES_SEP, s61);
  renderTable("tbl-sep-52", SETORES_SEP, s52);
  renderTable("tbl-rec-61", SETORES_REC, r61);
  renderTable("tbl-rec-52", SETORES_REC, r52);
  renderTable("tbl-exp-61", SETORES_EXP, e61);
  renderTable("tbl-exp-52", SETORES_EXP, e52);

  diffTable("tbl-diff-sep", SETORES_SEP, s61, s52);
  diffTable("tbl-diff-rec", SETORES_REC, r61, r52);
  diffTable("tbl-diff-exp", SETORES_EXP, e61, e52);

  renderCapTable("cap-sep", "sep", SETORES_SEP, QUADRO_CAP_SEP, PROD_SEP, USA_PACK_SEP, hProd, pack);
  renderCapTable("cap-rec", "rec", SETORES_REC, QUADRO_CAP_REC, PROD_REC, USA_PACK_REC, hProd, pack);
  renderCapTable("cap-exp", "exp", SETORES_EXP, QUADRO_CAP_EXP, PROD_EXP, USA_PACK_EXP, hProd, pack);
  renderBars(hProd, pack);

  renderKPIs(s61, s52, r61, r52, e61, e52);
  renderProdPanel();
  renderSched(carga, modelo);
}

document.addEventListener("DOMContentLoaded", recalc);
