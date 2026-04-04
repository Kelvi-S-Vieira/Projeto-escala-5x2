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
const PROD_REC = [778, 1100, 778, 1200];
const PROD_EXP = [300, 300, 300, 300];

// ── Quadros padrão — Capacidade produtiva ────────────────────
const QUADRO_CAP_SEP = [27, 17, 8, 11];
const QUADRO_CAP_REC = [3, 5, 1, 3];
const QUADRO_CAP_EXP = [12, 2, 4, 13];

// ── Uso de pack médio por área ────────────────────────────────
const USA_PACK_SEP = [true, true, false, true];
const USA_PACK_REC = [true, true, false, false];
const USA_PACK_EXP = [true, true, false, true];

/* ── Helpers ─────────────────────────────────────────────────── */
function rup(v)  { return Math.ceil(v); }
function fmt(v)  { return Math.round(v).toLocaleString("pt-BR"); }
function fmth(v) { return v.toFixed(1).replace(".", ",") + " h"; }

/* ── Build simulation block ────────────────────────────────────
   Quadro = ROUNDUP( Média diária ÷ Produtividade ÷ hProd )
   6×1: hProd fixo = 6  |  5×2: hProd = carga/5 − 1,8
   pack: array com pack médio por setor (ou número único)
*/
function buildBlock(meta, prod, usaPack, dias, pack, hProd) {
  return meta.map((m, i) => {
    const p   = Array.isArray(pack) ? (pack[i] || 1) : pack;
    const vol = usaPack[i] ? rup(m / p) : m;
    const med = rup(vol / dias);
    const qdr = rup(med / prod[i] / hProd);
    return { meta: m, vol, med, qdr };
  });
}

// ── Dados de embalagem por semana ────────────────────────────
// Vestuário: CABIDE / CAIXA
const EMB_VESTUARIO = {
   1: {CABIDE:0.00,  CAIXA:100.00},
   5: {CABIDE:0.00,  CAIXA:100.00},
   6: {CABIDE:0.00,  CAIXA:100.00},
   7: {CABIDE:0.00,  CAIXA:100.00},
   9: {CABIDE:10.68, CAIXA:89.32},
  10: {CABIDE:93.09, CAIXA:6.91},
  11: {CABIDE:21.32, CAIXA:78.68},
  12: {CABIDE:15.27, CAIXA:84.73},
  13: {CABIDE:40.24, CAIXA:59.76},
  14: {CABIDE:41.79, CAIXA:58.21},
  15: {CABIDE:49.95, CAIXA:50.05},
  16: {CABIDE:49.31, CAIXA:50.69},
  17: {CABIDE:42.17, CAIXA:57.83},
  18: {CABIDE:45.02, CAIXA:54.98},
  19: {CABIDE:46.65, CAIXA:53.35},
  20: {CABIDE:37.71, CAIXA:62.29},
  21: {CABIDE:33.09, CAIXA:66.91},
  22: {CABIDE:49.08, CAIXA:50.92},
  23: {CABIDE:52.52, CAIXA:47.48},
  24: {CABIDE:42.30, CAIXA:57.70},
  25: {CABIDE:34.59, CAIXA:65.41},
  26: {CABIDE:32.16, CAIXA:67.84},
  27: {CABIDE:50.56, CAIXA:49.44},
  28: {CABIDE:44.73, CAIXA:55.27},
  29: {CABIDE:49.74, CAIXA:50.26},
  30: {CABIDE:39.11, CAIXA:60.89},
  31: {CABIDE:36.06, CAIXA:63.94},
  32: {CABIDE:39.06, CAIXA:60.94},
  33: {CABIDE:64.39, CAIXA:35.61},
  34: {CABIDE:29.91, CAIXA:70.09},
  35: {CABIDE:37.42, CAIXA:62.58},
  36: {CABIDE:38.73, CAIXA:61.27},
  37: {CABIDE:36.31, CAIXA:63.69},
  38: {CABIDE:32.90, CAIXA:67.10},
  39: {CABIDE:20.86, CAIXA:79.14},
  40: {CABIDE:39.97, CAIXA:60.03},
  41: {CABIDE:41.71, CAIXA:58.29},
  42: {CABIDE:88.41, CAIXA:11.59},
  43: {CABIDE:83.92, CAIXA:16.08},
  44: {CABIDE:39.39, CAIXA:60.61},
  45: {CABIDE:33.67, CAIXA:66.33},
  46: {CABIDE:64.79, CAIXA:35.21},
  47: {CABIDE:100.00,CAIXA:0.00},
  48: {CABIDE:33.24, CAIXA:66.76},
  49: {CABIDE:2.90,  CAIXA:97.10},
  50: {CABIDE:0.00,  CAIXA:100.00},
  51: {CABIDE:64.54, CAIXA:35.46},
  52: {CABIDE:22.76, CAIXA:77.24},
};

// Lar-Têxtil: CAIXA / FARDO / PACOTE
const EMB_LAR = {
   4: {CAIXA:100.00, FARDO:0.00,  PACOTE:0.00},
   5: {CAIXA:100.00, FARDO:0.00,  PACOTE:0.00},
   8: {CAIXA:100.00, FARDO:0.00,  PACOTE:0.00},
  10: {CAIXA:100.00, FARDO:0.00,  PACOTE:0.00},
  11: {CAIXA:71.45,  FARDO:28.55, PACOTE:0.00},
  12: {CAIXA:95.96,  FARDO:2.16,  PACOTE:1.88},
  13: {CAIXA:71.12,  FARDO:23.02, PACOTE:5.86},
  14: {CAIXA:76.87,  FARDO:19.36, PACOTE:3.76},
  15: {CAIXA:81.62,  FARDO:15.97, PACOTE:2.41},
  16: {CAIXA:77.24,  FARDO:19.64, PACOTE:3.12},
  17: {CAIXA:72.16,  FARDO:24.26, PACOTE:3.58},
  18: {CAIXA:79.55,  FARDO:17.16, PACOTE:3.30},
  19: {CAIXA:73.54,  FARDO:22.92, PACOTE:3.54},
  20: {CAIXA:74.79,  FARDO:21.84, PACOTE:3.37},
  21: {CAIXA:67.06,  FARDO:24.80, PACOTE:8.14},
  22: {CAIXA:82.85,  FARDO:15.22, PACOTE:1.92},
  23: {CAIXA:76.50,  FARDO:20.61, PACOTE:2.90},
  24: {CAIXA:79.14,  FARDO:18.28, PACOTE:2.58},
  25: {CAIXA:74.04,  FARDO:21.67, PACOTE:4.29},
  26: {CAIXA:78.27,  FARDO:17.89, PACOTE:3.84},
  27: {CAIXA:84.85,  FARDO:14.97, PACOTE:0.17},
  28: {CAIXA:69.45,  FARDO:20.04, PACOTE:10.51},
  29: {CAIXA:83.01,  FARDO:16.99, PACOTE:0.00},
  30: {CAIXA:46.23,  FARDO:53.77, PACOTE:0.00},
  31: {CAIXA:88.21,  FARDO:6.71,  PACOTE:5.08},
  32: {CAIXA:80.02,  FARDO:18.35, PACOTE:1.63},
  33: {CAIXA:67.71,  FARDO:30.47, PACOTE:1.82},
  34: {CAIXA:56.04,  FARDO:43.96, PACOTE:0.00},
  35: {CAIXA:89.49,  FARDO:4.87,  PACOTE:5.64},
  36: {CAIXA:80.48,  FARDO:19.52, PACOTE:0.00},
  37: {CAIXA:38.87,  FARDO:61.13, PACOTE:0.00},
  38: {CAIXA:36.99,  FARDO:63.01, PACOTE:0.00},
  39: {CAIXA:38.64,  FARDO:61.36, PACOTE:0.00},
  40: {CAIXA:76.80,  FARDO:23.20, PACOTE:0.00},
  41: {CAIXA:81.44,  FARDO:18.56, PACOTE:0.00},
  42: {CAIXA:13.88,  FARDO:78.23, PACOTE:7.89},
  43: {CAIXA:59.66,  FARDO:40.34, PACOTE:0.00},
  44: {CAIXA:91.70,  FARDO:8.30,  PACOTE:0.00},
  45: {CAIXA:52.90,  FARDO:47.10, PACOTE:0.00},
  46: {CAIXA:74.73,  FARDO:25.27, PACOTE:0.00},
  47: {CAIXA:5.46,   FARDO:94.54, PACOTE:0.00},
  48: {CAIXA:39.80,  FARDO:60.20, PACOTE:0.00},
  49: {CAIXA:96.54,  FARDO:3.46,  PACOTE:0.00},
  50: {CAIXA:0.00,   FARDO:100.00,PACOTE:0.00},
  51: {CAIXA:0.00,   FARDO:0.00,  PACOTE:100.00},
  52: {CAIXA:95.85,  FARDO:0.00,  PACOTE:4.15},
};

const EMB_TOTAL_VEST = {CABIDE:42.91, CAIXA:57.09};
const EMB_TOTAL_LAR  = {CAIXA:76.19, FARDO:20.48, PACOTE:3.34};

/* ── Init semana selector ─────────────────────────────────────── */
function initSemanaSelector() {
  const allSemanas = [...new Set([
    ...Object.keys(EMB_VESTUARIO),
    ...Object.keys(EMB_LAR)
  ])].map(Number).sort((a,b) => a-b);

  const sel = document.getElementById("in-semana-rec");
  sel.innerHTML = `<option value="total">Total Geral</option>` +
    allSemanas.map(s => `<option value="${s}">Semana ${s}</option>`).join("");

  // Default: semana mais próxima da atual
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const currentWeek = Math.ceil(((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
  const closest = allSemanas.reduce((a,b) => Math.abs(b-currentWeek) < Math.abs(a-currentWeek) ? b : a);
  sel.value = closest;
}

/* ── Get embalagem for semana ─────────────────────────────────── */
function getEmbalagem(semana) {
  if (semana === "total") {
    return {
      lar:      EMB_TOTAL_LAR,
      vestuario:EMB_TOTAL_VEST,
    };
  }
  const s = parseInt(semana);
  return {
    lar:       EMB_LAR[s]      || EMB_TOTAL_LAR,
    vestuario: EMB_VESTUARIO[s]|| EMB_TOTAL_VEST,
  };
}

/* ── Render embalagem panel (selector cards) ──────────────────── */
function renderEmbGrid(semana) {
  const emb = getEmbalagem(semana);
  const semLabel = semana === "total" ? "Total Geral" : `Semana ${semana}`;

  // Helper: bar strip
  const strip = (items) => items.filter(it => it.pct > 0).map((it, i) => {
    const colors = ["#2E5FA3","#F4A500","#0F6E56","#854F0B"];
    return `<div style="flex:${it.pct};background:${colors[i % colors.length]};height:100%;min-width:2px" title="${it.label}: ${it.pct.toFixed(2)}%"></div>`;
  }).join("");

  const card = (title, embs) => {
    const items = Object.entries(embs).map(([k,v]) => ({label:k, pct:v})).filter(it => it.pct > 0);
    const barItems = items.map((it, i) => {
      const colors = ["#2E5FA3","#F4A500","#0F6E56","#854F0B"];
      return `<div style="display:flex;align-items:center;gap:6px;margin-bottom:5px">
        <div style="width:10px;height:10px;border-radius:2px;background:${colors[i]};flex-shrink:0"></div>
        <span style="font-size:10px;color:#3D4A5C;flex:1">${it.label}</span>
        <span style="font-size:11px;font-weight:700;color:#1B3A6B">${it.pct.toFixed(2)}%</span>
      </div>`;
    }).join("");

    return `<div class="emb-card">
      <div class="emb-card-title">${title}</div>
      <div class="emb-bar-wrap">
        <div style="display:flex;height:18px;border-radius:4px;overflow:hidden;width:100%">
          ${strip(items)}
        </div>
      </div>
      <div style="margin-top:8px">${barItems}</div>
    </div>`;
  };

  document.getElementById("emb-grid").innerHTML =
    card("Lar-Têxtil", emb.lar) +
    card("Vestuário", emb.vestuario);

  document.getElementById("emb-semana-display").textContent = semLabel;
}

/* ── Render embalagem breakdown (full table) ─────────────────── */
function renderEmbBreakdown(semana) {
  const emb     = getEmbalagem(semana);
  const metaLar  = META_REC_52[0]; // Lar-Têxtil
  const metaVest = META_REC_52[1]; // Vestuário

  // Lê pack por setor do recebimento (índices 0=Lar, 1=Vest)
  const packLar  = parseFloat(document.getElementById("in-pack-rec-0").value) || 7.2;
  const packVest = parseFloat(document.getElementById("in-pack-rec-1").value) || 7.2;

  // Cores por tipo de embalagem
  const EMB_COLORS = {CABIDE:"#2E5FA3", CAIXA:"#185FA5", FARDO:"#F4A500", PACOTE:"#0F6E56"};

  const mkRows = (embs, meta, pack, dias61, dias52) => {
    const entries = Object.entries(embs).filter(([,v]) => v > 0);
    return entries.map(([k, v], idx) => {
      const c        = EMB_COLORS[k] || "#854F0B";
      const qtdSem   = Math.round(meta * v / 100);         // Qtd peças/sem
      const volPack  = Math.round(qtdSem / pack);           // Vol. pack (sem)
      const med61    = Math.ceil(volPack / dias61);          // Média diária 6×1
      const med52    = Math.ceil(volPack / dias52);          // Média diária 5×2
      const isLast   = idx === entries.length - 1;
      const rowStyle = isLast
        ? `background:#1B3A6B;color:#fff;font-weight:700;`
        : `background:${idx % 2 === 0 ? "#fff" : "#F7FAFC"};`;

      return `<tr style="${rowStyle}">
        <td style="text-align:left;padding:7px 10px;border-bottom:1px solid #EEF2F9">
          <span style="display:inline-block;width:9px;height:9px;border-radius:2px;background:${c};margin-right:7px;flex-shrink:0;vertical-align:middle"></span>
          <span style="font-weight:600;${isLast?"color:#fff":"color:#3D4A5C"}">${k}</span>
        </td>
        <td style="padding:7px 10px;text-align:right;border-bottom:1px solid #EEF2F9;font-weight:700;color:${isLast?"#fff":c}">${v.toFixed(2)}%</td>
        <td style="padding:7px 10px;text-align:right;border-bottom:1px solid #EEF2F9;${isLast?"color:#fff":"color:#3D4A5C"}">${qtdSem.toLocaleString("pt-BR")}</td>
        <td style="padding:7px 10px;text-align:right;border-bottom:1px solid #EEF2F9;${isLast?"color:#fff":"color:#3D4A5C"}">${volPack.toLocaleString("pt-BR")}</td>
        <td style="padding:7px 10px;text-align:right;border-bottom:1px solid #EEF2F9;${isLast?"color:#fff":"color:#3D4A5C"}">${med61.toLocaleString("pt-BR")}</td>
        <td style="padding:7px 10px;text-align:right;border-bottom:1px solid #EEF2F9;font-weight:${isLast?"700":"600"};color:${isLast?"#F4A500":"#1B3A6B"}">${med52.toLocaleString("pt-BR")}</td>
      </tr>`;
    }).join("");
  };

  const thead = `
    <thead>
      <tr>
        <th style="text-align:left;padding:8px 10px;background:#1B3A6B;color:#fff;font-size:10px;font-weight:600;letter-spacing:.5px">Embalagem</th>
        <th style="padding:8px 10px;text-align:right;background:#1B3A6B;color:#fff;font-size:10px;font-weight:600;letter-spacing:.5px">% Repr.</th>
        <th style="padding:8px 10px;text-align:right;background:#1B3A6B;color:#fff;font-size:10px;font-weight:600;letter-spacing:.5px">Qtd. peças</th>
        <th style="padding:8px 10px;text-align:right;background:#1B3A6B;color:#fff;font-size:10px;font-weight:600;letter-spacing:.5px">Vol. pack</th>
        <th style="padding:8px 10px;text-align:right;background:#1B3A6B;color:#fff;font-size:10px;font-weight:600;letter-spacing:.5px">Média/dia 6×1</th>
        <th style="padding:8px 10px;text-align:right;background:#1B3A6B;color:#fff;font-size:10px;font-weight:600;letter-spacing:.5px">Média/dia 5×2</th>
      </tr>
    </thead>`;

  const block = (title, embs, meta, pack) => `
    <div>
      <div style="font-size:11px;font-weight:700;color:#1B3A6B;margin-bottom:8px">
        ${title} — Meta: <span style="color:#2E5FA3">${meta.toLocaleString("pt-BR")}</span> peças/sem
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:11px;border-radius:8px;overflow:hidden">
        ${thead}
        <tbody>${mkRows(embs, meta, pack, 6, 5)}</tbody>
      </table>
    </div>`;

  document.getElementById("emb-breakdown").innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
      ${block("Lar-Têxtil",  emb.lar,       metaLar,  packLar)}
      ${block("Vestuário",   emb.vestuario, metaVest, packVest)}
    </div>`;
}


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

/* ── Render expedição table — inclui coluna Veículos/dia ─────────
   Veículos/dia = ROUNDUP( Meta/sem ÷ dias ÷ peças_por_veiculo )
*/
function renderExpTable(id, setores, data, dias, pecasVeiculo) {
  const tot = k => data.reduce((a, b) => a + b[k], 0);
  const totVeic = data.reduce((a, b) => a + b.veic, 0);
  document.getElementById(id).innerHTML = `
    <thead><tr>
      <th>Setor</th><th>Meta/sem</th><th>Vol. pack</th>
      <th>Média/dia</th><th>Quadro</th><th>Veículos/dia</th>
    </tr></thead>
    <tbody>
      ${setores.map((s, i) => `
        <tr>
          <td>${s}</td>
          <td>${fmt(data[i].meta)}</td>
          <td>${fmt(data[i].vol)}</td>
          <td>${fmt(data[i].med)}</td>
          <td class="highlight">${fmt(data[i].qdr)}</td>
          <td class="veic-col">${fmt(data[i].veic)}</td>
        </tr>`).join("")}
      <tr>
        <td>Total</td>
        <td>${fmt(tot("meta"))}</td>
        <td>${fmt(tot("vol"))}</td>
        <td>${fmt(tot("med"))}</td>
        <td>${fmt(tot("qdr"))}</td>
        <td class="veic-col">${fmt(totVeic)}</td>
      </tr>
    </tbody>`;
}

/* ── Build expedição block — igual ao buildBlock + veículos ───── */
function buildExpBlock(meta, prod, usaPack, dias, pack, hProd, pecasVeiculo) {
  return meta.map((m, i) => {
    const p    = Array.isArray(pack) ? (pack[i] || 1) : pack;
    const vol  = usaPack[i] ? rup(m / p) : m;
    const med  = rup(vol / dias);
    const qdr  = rup(med / prod[i] / hProd);
    const veic = pecasVeiculo > 0 ? rup(m / dias / pecasVeiculo) : 0;
    return { meta: m, vol, med, qdr, veic };
  });
}
function renderCapTable(id, prefix, setores, meta, quadroDefault, prod, usaPack, hProd, pack) {
  const already = !!document.getElementById(`cap-${prefix}-0`);

  const quadros = setores.map((_, i) => {
    const el = document.getElementById(`cap-${prefix}-${i}`);
    return el ? (parseInt(el.value) || 0) : quadroDefault[i];
  });

  const rows = setores.map((setor, i) => {
    const q      = quadros[i];
    const p      = Array.isArray(pack) ? (pack[i] || 1) : pack;
    const capDia = q * hProd * prod[i];
    const volSem = capDia * 5;
    const pecas  = usaPack[i] ? volSem * p : volSem;
    const diff   = pecas - meta[i];
    return { setor, q, capDia, volSem, pecas, diff, i };
  });

  const totCap   = rows.reduce((a, r) => a + r.capDia, 0);
  const totVol   = rows.reduce((a, r) => a + r.volSem, 0);
  const totPecas = rows.reduce((a, r) => a + r.pecas, 0);
  const totMeta  = meta.reduce((a, m) => a + m, 0);
  const totDiff  = totPecas - totMeta;
  const totQ     = rows.reduce((a, r) => a + r.q, 0);

  const diffCell = (diff, cellId) => {
    const cls = diff > 0 ? "pos" : diff < 0 ? "neg" : "";
    const val = `${diff > 0 ? "+" : ""}${fmt(diff)}`;
    return cellId
      ? `<td class="${cls}" id="${cellId}">${val}</td>`
      : `<td class="${cls}">${val}</td>`;
  };

  if (!already) {
    document.getElementById(id).innerHTML = `
      <table>
        <thead><tr>
          <th>Setor</th><th>Quadro</th><th>H. produtivas</th>
          <th>Cap. diária</th><th>Vol. semanal</th><th>Peças/sem</th>
          <th>vs Meta</th>
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
              ${diffCell(r.diff, `cap-diff-${prefix}-${r.i}`)}
            </tr>`).join("")}
          <tr>
            <td>Total</td>
            <td id="cap-tot-q-${prefix}">${fmt(totQ)}</td>
            <td>—</td>
            <td id="cap-tot-dia-${prefix}">${fmt(totCap)}</td>
            <td id="cap-tot-vol-${prefix}">${fmt(totVol)}</td>
            <td id="cap-tot-pec-${prefix}">${fmt(totPecas)}</td>
            ${diffCell(totDiff, `cap-tot-diff-${prefix}`)}
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
    const dc = document.getElementById(`cap-diff-${prefix}-${r.i}`);
    dc.textContent = `${r.diff > 0 ? "+" : ""}${fmt(r.diff)}`;
    dc.className   = r.diff > 0 ? "pos" : r.diff < 0 ? "neg" : "";
  });
  document.getElementById(`cap-tot-q-${prefix}`).textContent   = fmt(totQ);
  document.getElementById(`cap-tot-dia-${prefix}`).textContent = fmt(totCap);
  document.getElementById(`cap-tot-vol-${prefix}`).textContent = fmt(totVol);
  document.getElementById(`cap-tot-pec-${prefix}`).textContent = fmt(totPecas);
  const td = document.getElementById(`cap-tot-diff-${prefix}`);
  td.textContent = `${totDiff > 0 ? "+" : ""}${fmt(totDiff)}`;
  td.className   = totDiff > 0 ? "pos" : totDiff < 0 ? "neg" : "";
}

/* ── Render capacity table para Expedição — com coluna Veículos/dia
   Veículos/dia = ROUNDUP( Peças/sem ÷ 5 dias ÷ peças_por_veiculo )
   Usa as peças/sem calculadas pelo quadro editável (não a meta)
*/
function renderCapExpTable(id, prefix, setores, meta, quadroDefault, prod, usaPack, hProd, pack, pecasVeiculo) {
  const already = !!document.getElementById(`cap-${prefix}-0`);

  const quadros = setores.map((_, i) => {
    const el = document.getElementById(`cap-${prefix}-${i}`);
    return el ? (parseInt(el.value) || 0) : quadroDefault[i];
  });

  const rows = setores.map((setor, i) => {
    const q      = quadros[i];
    const capDia = q * hProd * prod[i];
    const volSem = capDia * 5;
    const p      = Array.isArray(pack) ? (pack[i] || 1) : pack;
    const pecas  = usaPack[i] ? volSem * p : volSem;
    const diff   = pecas - meta[i];
    const veic   = pecasVeiculo > 0 ? rup(pecas / 5 / pecasVeiculo) : 0;
    return { setor, q, capDia, volSem, pecas, diff, veic, i };
  });

  const totCap   = rows.reduce((a, r) => a + r.capDia, 0);
  const totVol   = rows.reduce((a, r) => a + r.volSem, 0);
  const totPecas = rows.reduce((a, r) => a + r.pecas, 0);
  const totMeta  = meta.reduce((a, m) => a + m, 0);
  const totDiff  = totPecas - totMeta;
  const totQ     = rows.reduce((a, r) => a + r.q, 0);
  const totVeic  = rows.reduce((a, r) => a + r.veic, 0);

  const diffCell = (diff, cellId) => {
    const cls = diff > 0 ? "pos" : diff < 0 ? "neg" : "";
    const val = `${diff > 0 ? "+" : ""}${fmt(diff)}`;
    return cellId
      ? `<td class="${cls}" id="${cellId}">${val}</td>`
      : `<td class="${cls}">${val}</td>`;
  };

  if (!already) {
    document.getElementById(id).innerHTML = `
      <table>
        <thead><tr>
          <th>Setor</th><th>Quadro</th><th>H. produtivas</th>
          <th>Cap. diária</th><th>Vol. semanal</th><th>Peças/sem</th>
          <th>vs Meta</th><th>Veículos/dia</th>
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
              ${diffCell(r.diff, `cap-diff-${prefix}-${r.i}`)}
              <td class="veic-col" id="cap-veic-${prefix}-${r.i}">${r.veic > 0 ? fmt(r.veic) : "—"}</td>
            </tr>`).join("")}
          <tr>
            <td>Total</td>
            <td id="cap-tot-q-${prefix}">${fmt(totQ)}</td>
            <td>—</td>
            <td id="cap-tot-dia-${prefix}">${fmt(totCap)}</td>
            <td id="cap-tot-vol-${prefix}">${fmt(totVol)}</td>
            <td id="cap-tot-pec-${prefix}">${fmt(totPecas)}</td>
            ${diffCell(totDiff, `cap-tot-diff-${prefix}`)}
            <td class="veic-col" id="cap-tot-veic-${prefix}">${totVeic > 0 ? fmt(totVeic) : "—"}</td>
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
    const dc = document.getElementById(`cap-diff-${prefix}-${r.i}`);
    dc.textContent = `${r.diff > 0 ? "+" : ""}${fmt(r.diff)}`;
    dc.className   = r.diff > 0 ? "pos" : r.diff < 0 ? "neg" : "";
    document.getElementById(`cap-veic-${prefix}-${r.i}`).textContent = r.veic > 0 ? fmt(r.veic) : "—";
  });
  document.getElementById(`cap-tot-q-${prefix}`).textContent    = fmt(totQ);
  document.getElementById(`cap-tot-dia-${prefix}`).textContent  = fmt(totCap);
  document.getElementById(`cap-tot-vol-${prefix}`).textContent  = fmt(totVol);
  document.getElementById(`cap-tot-pec-${prefix}`).textContent  = fmt(totPecas);
  const td = document.getElementById(`cap-tot-diff-${prefix}`);
  td.textContent = `${totDiff > 0 ? "+" : ""}${fmt(totDiff)}`;
  td.className   = totDiff > 0 ? "pos" : totDiff < 0 ? "neg" : "";
  document.getElementById(`cap-tot-veic-${prefix}`).textContent = totVeic > 0 ? fmt(totVeic) : "—";
}

/* ── Recalc capacity only (triggered by quadro inputs) ────────── */
function recalcCap() {
  const carga     = parseFloat(document.getElementById("in-carga").value) || 40;
  const pecasVeic = parseFloat(document.getElementById("in-pecas-veiculo").value) || 0;
  const hProd     = (carga / 5) - 1.8;
  const packSep   = SETORES_SEP.map((_, i) => parseFloat(document.getElementById(`in-pack-sep-${i}`).value) || 7.2);
  const packRec   = SETORES_REC.map((_, i) => parseFloat(document.getElementById(`in-pack-rec-${i}`).value) || 7.2);
  const packExp   = SETORES_EXP.map((_, i) => parseFloat(document.getElementById(`in-pack-exp-${i}`).value) || 7.2);
  renderCapTable   ("cap-sep", "sep", SETORES_SEP, META_SEP_52, QUADRO_CAP_SEP, PROD_SEP, USA_PACK_SEP, hProd, packSep);
  renderCapTable   ("cap-rec", "rec", SETORES_REC, META_REC_52, QUADRO_CAP_REC, PROD_REC, USA_PACK_REC, hProd, packRec);
  renderCapExpTable("cap-exp", "exp", SETORES_EXP, META_EXP_52, QUADRO_CAP_EXP, PROD_EXP, USA_PACK_EXP, hProd, packExp, pecasVeic);
  renderBars(hProd, packSep);
}

/* ── Render distribution bar chart (Separação) ───────────────── */
function renderBars(hProd, pack) {
  const colors = ["b1", "b2", "b3", "b4"];
  const cap = SETORES_SEP.map((setor, i) => {
    const el  = document.getElementById(`cap-sep-${i}`);
    const q   = el ? (parseInt(el.value) || QUADRO_CAP_SEP[i]) : QUADRO_CAP_SEP[i];
    const p   = Array.isArray(pack) ? (pack[i] || 1) : pack;
    const pec = q * hProd * PROD_SEP[i] * 5 * (USA_PACK_SEP[i] ? p : 1);
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
  // Equipe 1: sempre Seg–Sex, nunca trabalha Sáb ou Dom
  const eq1 = [1, 1, 1, 1, 1, 0, 0];
  // Equipe 2: Ter–Sáb no revezando; folga total no Seg–Sex
  const eq2 = modelo === "Equipes revezando" ? [0, 1, 1, 1, 1, 1, 0] : [0, 0, 0, 0, 0, 0, 0];
  let html = "<div></div>";
  days.forEach(d => { html += `<div class="sched-head">${d}</div>`; });
  ["Equipe 1", "Equipe 2"].forEach((eq, ei) => {
    html += `<div class="sched-label">${eq}</div>`;
    (ei === 0 ? eq1 : eq2).forEach((v, di) => {
      const cls = v ? "sched-cell on" : (di >= 5 ? "sched-cell weekend" : "sched-cell off-day");
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
  const modelo = document.getElementById("in-modelo").value;
  const hProd  = (carga / 5) - 1.8;

  // Pack por setor — lê cada input individualmente
  const packSep = SETORES_SEP.map((_, i) => parseFloat(document.getElementById(`in-pack-sep-${i}`).value) || 7.2);
  const packRec = SETORES_REC.map((_, i) => parseFloat(document.getElementById(`in-pack-rec-${i}`).value) || 7.2);
  const packExp = SETORES_EXP.map((_, i) => parseFloat(document.getElementById(`in-pack-exp-${i}`).value) || 7.2);

  document.getElementById("cv-carga").textContent  = carga + " h";
  document.getElementById("cv-hprod").textContent  = fmth(hProd);
  document.getElementById("cv-modelo").textContent = modelo === "Segunda a Sexta" ? "Seg–Sex" : "Revezando";
  document.getElementById("modelo-badge").textContent = modelo;

  const s61 = buildBlock(META_SEP_61, PROD_SEP, USA_PACK_SEP, 6, packSep, 6);
  const r61 = buildBlock(META_REC_61, PROD_REC, USA_PACK_REC, 6, packRec, 6);
  const s52 = buildBlock(META_SEP_52, PROD_SEP, USA_PACK_SEP, 5, packSep, hProd);
  const r52 = buildBlock(META_REC_52, PROD_REC, USA_PACK_REC, 5, packRec, hProd);

  const pecasVeiculo = parseFloat(document.getElementById("in-pecas-veiculo").value) || 0;
  const e61 = buildExpBlock(META_EXP_61, PROD_EXP, USA_PACK_EXP, 6, packExp, 6,     pecasVeiculo);
  const e52 = buildExpBlock(META_EXP_52, PROD_EXP, USA_PACK_EXP, 5, packExp, hProd, pecasVeiculo);

  renderTable("tbl-sep-61", SETORES_SEP, s61);
  renderTable("tbl-sep-52", SETORES_SEP, s52);
  renderTable("tbl-rec-61", SETORES_REC, r61);
  renderTable("tbl-rec-52", SETORES_REC, r52);
  renderExpTable("tbl-exp-61", SETORES_EXP, e61, 6,     pecasVeiculo);
  renderExpTable("tbl-exp-52", SETORES_EXP, e52, 5,     pecasVeiculo);

  diffTable("tbl-diff-sep", SETORES_SEP, s61, s52);
  diffTable("tbl-diff-rec", SETORES_REC, r61, r52);
  diffTable("tbl-diff-exp", SETORES_EXP, e61, e52);

  renderCapTable   ("cap-sep", "sep", SETORES_SEP, META_SEP_52, QUADRO_CAP_SEP, PROD_SEP, USA_PACK_SEP, hProd, packSep);
  renderCapTable   ("cap-rec", "rec", SETORES_REC, META_REC_52, QUADRO_CAP_REC, PROD_REC, USA_PACK_REC, hProd, packRec);
  renderCapExpTable("cap-exp", "exp", SETORES_EXP, META_EXP_52, QUADRO_CAP_EXP, PROD_EXP, USA_PACK_EXP, hProd, packExp, pecasVeiculo);
  renderBars(hProd, packSep);

  renderKPIs(s61, s52, r61, r52, e61, e52);
  renderProdPanel();
  renderSched(carga, modelo);

  // Embalagem por semana
  const semana = document.getElementById("in-semana-rec").value;
  renderEmbGrid(semana);
  renderEmbBreakdown(semana);
}

document.addEventListener("DOMContentLoaded", () => {
  initSemanaSelector();
  recalc();
});
