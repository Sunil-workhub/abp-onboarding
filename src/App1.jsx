import { useState, useCallback, useMemo } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const PROJECTS_DATA = {
  PW001: {
    id: "PW001",
    name: "Skyline Infrastructure Build",
    rows: [
      {
        id: "r1",
        order: "OA1",
        product: "A1",
        salesValue: 100,
        materialCost: 20,
        foc: 2,
        freight: 3,
        packing: 2,
      },
      {
        id: "r2",
        order: "OA1",
        product: "B1",
        salesValue: 200,
        materialCost: 30,
        foc: 0,
        freight: 0,
        packing: 0,
      },
      {
        id: "r3",
        order: "OA2",
        product: "C1",
        salesValue: 400,
        materialCost: 60,
        foc: 1,
        freight: 0,
        packing: 0,
      },
      {
        id: "r4",
        order: "OA2",
        product: "D1",
        salesValue: 300,
        materialCost: 40,
        foc: 0,
        freight: 0,
        packing: 0,
      },
    ],
  },
  PW002: {
    id: "PW002",
    name: "Meridian Commercial Complex",
    rows: [
      {
        id: "r5",
        order: "OB1",
        product: "X1",
        salesValue: 500,
        materialCost: 120,
        foc: 5,
        freight: 10,
        packing: 5,
      },
      {
        id: "r6",
        order: "OB1",
        product: "X2",
        salesValue: 350,
        materialCost: 80,
        foc: 3,
        freight: 0,
        packing: 0,
      },
      {
        id: "r7",
        order: "OB2",
        product: "Y1",
        salesValue: 620,
        materialCost: 200,
        foc: 8,
        freight: 15,
        packing: 8,
      },
      {
        id: "r8",
        order: "OB2",
        product: "Y2",
        salesValue: 280,
        materialCost: 90,
        foc: 2,
        freight: 0,
        packing: 0,
      },
    ],
  },
  PW003: {
    id: "PW003",
    name: "Apex Industrial Fitout",
    rows: [
      {
        id: "r9",
        order: "OC1",
        product: "M1",
        salesValue: 800,
        materialCost: 300,
        foc: 10,
        freight: 20,
        packing: 12,
      },
      {
        id: "r10",
        order: "OC1",
        product: "M2",
        salesValue: 450,
        materialCost: 150,
        foc: 5,
        freight: 0,
        packing: 0,
      },
      {
        id: "r11",
        order: "OC2",
        product: "N1",
        salesValue: 960,
        materialCost: 410,
        foc: 15,
        freight: 25,
        packing: 10,
      },
    ],
  },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmt = (n) =>
  Number(n).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

function calcRow(row, inputs) {
  const commission = Number(inputs?.commission ?? 0);
  const ovc = Number(inputs?.ovc ?? 0);
  const other = Number(inputs?.other ?? 0);
  const fixedCost = Number(inputs?.fixedCost ?? 0);
  const throughput = row.salesValue - row.materialCost - row.foc;
  const varTotal = commission + row.freight + row.packing + ovc + other;
  const contribution = throughput - varTotal;
  const opProfit = contribution - fixedCost;
  return {
    throughput,
    commission,
    ovc,
    other,
    fixedCost,
    varTotal,
    contribution,
    opProfit,
  };
}

// ─── LIGHT THEME COLORS ──────────────────────────────────────────────────────
const COLORS = {
  bg: "#f0f4f8",
  surface: "#ffffff",
  surfaceHover: "#f8fafc",
  surfaceAlt: "#f1f5f9",
  border: "#e2e8f0",
  borderLight: "#cbd5e1",
  cyan: "#0284c7",
  cyanDim: "#0369a1",
  violet: "#7c3aed",
  violet2: "#7c3aed",
  emerald: "#059669",
  emeraldDim: "#047857",
  amber: "#d97706",
  rose: "#e11d48",
  sky: "#0284c7",
  text: "#0f172a",
  textMuted: "#64748b",
  textDim: "#475569",
  totalRow: "#eff6ff",
  totalBorder: "#bfdbfe",
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const S = {
  app: {
    minHeight: "100vh",
    background: COLORS.bg,
    color: COLORS.text,
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    fontSize: 14,
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 28px",
    height: 56,
    background: COLORS.surface,
    borderBottom: `1px solid ${COLORS.border}`,
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  navLogo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontWeight: 700,
    fontSize: 17,
    color: COLORS.text,
    letterSpacing: "-0.3px",
  },
  logoBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    background: `linear-gradient(135deg, ${COLORS.cyan}, ${COLORS.violet2})`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 800,
    color: "#fff",
  },
  page: { padding: "28px 28px" },
  pageHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: COLORS.text,
    marginBottom: 4,
    letterSpacing: "-0.4px",
  },
  pageSub: { fontSize: 13, color: COLORS.textMuted },

  btn: (variant = "ghost") => ({
    cursor: "pointer",
    border: `1px solid ${
      variant === "primary"
        ? "transparent"
        : variant === "danger"
          ? COLORS.rose
          : COLORS.borderLight
    }`,
    borderRadius: 8,
    padding: "7px 16px",
    fontSize: 13,
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background:
      variant === "primary"
        ? `linear-gradient(135deg, ${COLORS.cyan}, ${COLORS.violet2})`
        : variant === "emerald"
          ? `linear-gradient(135deg, ${COLORS.emerald}, ${COLORS.sky})`
          : variant === "amber"
            ? `rgba(217,119,6,0.10)`
            : variant === "danger"
              ? `rgba(225,29,72,0.08)`
              : `rgba(0,0,0,0.04)`,
    color:
      variant === "primary"
        ? "#fff"
        : variant === "emerald"
          ? "#fff"
          : variant === "amber"
            ? COLORS.amber
            : variant === "danger"
              ? COLORS.rose
              : COLORS.textDim,
    transition: "all 0.15s",
    outline: "none",
    whiteSpace: "nowrap",
  }),

  metricGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: 14,
    marginBottom: 28,
  },
  metricCard: {
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 12,
    padding: "16px 18px",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  metricLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.6px",
    marginBottom: 8,
  },
  metricValue: { fontSize: 24, fontWeight: 700, letterSpacing: "-0.5px" },

  tableWrap: {
    overflowX: "auto",
    borderRadius: 12,
    border: `1px solid ${COLORS.border}`,
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  },
  table: { width: "100%", borderCollapse: "collapse", minWidth: 1100 },
  th: (accent) => ({
    padding: "10px 12px",
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: accent || COLORS.textMuted,
    background: "#f8fafc",
    borderBottom: `1px solid ${COLORS.border}`,
    whiteSpace: "nowrap",
    textAlign: "right",
  }),
  thLeft: { textAlign: "left" },
  td: {
    padding: "9px 12px",
    fontSize: 13,
    borderBottom: `1px solid ${COLORS.border}`,
    textAlign: "right",
    color: COLORS.text,
  },
  tdLeft: { textAlign: "left" },

  numInput: {
    width: 72,
    background: "#f8fafc",
    border: `1px solid ${COLORS.borderLight}`,
    borderRadius: 6,
    padding: "4px 7px",
    fontSize: 12,
    color: COLORS.text,
    textAlign: "right",
    outline: "none",
  },

  badge: (color) => ({
    display: "inline-flex",
    alignItems: "center",
    padding: "3px 9px",
    borderRadius: 100,
    fontSize: 11,
    fontWeight: 700,
    background:
      color === "green"
        ? "rgba(5,150,105,0.12)"
        : color === "red"
          ? "rgba(225,29,72,0.10)"
          : "rgba(217,119,6,0.12)",
    color:
      color === "green"
        ? COLORS.emerald
        : color === "red"
          ? COLORS.rose
          : COLORS.amber,
  }),

  select: {
    background: COLORS.surface,
    border: `1px solid ${COLORS.borderLight}`,
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: 13,
    color: COLORS.text,
    cursor: "pointer",
    outline: "none",
    minWidth: 200,
  },

  // Total row highlight
  totalRow: {
    background: COLORS.totalRow,
    borderTop: `2px solid ${COLORS.totalBorder}`,
  },
  totalTd: (isProfit) => ({
    padding: "10px 12px",
    fontSize: 13,
    fontWeight: 700,
    textAlign: "right",
    borderBottom: `1px solid ${COLORS.border}`,
    background: COLORS.totalRow,
    color:
      isProfit === true
        ? COLORS.emerald
        : isProfit === false
          ? COLORS.rose
          : COLORS.text,
  }),
};

// ─── EXPORT HELPERS ──────────────────────────────────────────────────────────
function exportToCSV(project, allInputs) {
  const rows = project.rows;
  const headers = [
    "Order",
    "Product",
    "Sales Value",
    "Material Cost",
    "FOC",
    "Throughput",
    "Commission",
    "Freight",
    "Packing",
    "OVC",
    "Other Direct",
    "Var Total",
    "Contribution",
    "Fixed Cost",
    "Op. Profit",
  ];
  const lines = [headers.join(",")];
  rows.forEach((row) => {
    const calc = calcRow(row, allInputs[row.id]);
    lines.push(
      [
        row.order,
        row.product,
        row.salesValue,
        row.materialCost,
        row.foc,
        calc.throughput,
        calc.commission,
        row.freight,
        row.packing,
        calc.ovc,
        calc.other,
        calc.varTotal,
        calc.contribution,
        calc.fixedCost,
        calc.opProfit,
      ].join(","),
    );
  });
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${project.name.replace(/ /g, "_")}_profitability.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportToPDF(project, allInputs) {
  const rows = project.rows;
  const orders = [...new Set(rows.map((r) => r.order))];
  let html = `<html><head><style>
    body{font-family:'Segoe UI',sans-serif;font-size:12px;margin:24px;color:#111}
    h1{font-size:20px;margin-bottom:4px}
    h2{font-size:13px;color:#555;font-weight:400;margin-bottom:20px}
    h3{font-size:13px;margin:18px 0 6px;color:#333}
    table{width:100%;border-collapse:collapse;margin-bottom:16px}
    th{background:#1e3a5f;color:#fff;padding:7px 10px;font-size:10px;text-align:right;white-space:nowrap}
    th:first-child,th:nth-child(2){text-align:left}
    td{padding:6px 10px;border-bottom:1px solid #eee;text-align:right}
    td:first-child,td:nth-child(2){text-align:left}
    .total-row{background:#eff6ff;font-weight:700;border-top:2px solid #bfdbfe}
    .pos{color:#059669}.neg{color:#e11d48}
    .summary{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-top:20px}
    .sm{border:1px solid #e2e8f0;border-radius:8px;padding:10px 12px;background:#fff}
    .sl{font-size:10px;color:#888;margin-bottom:4px}
    .sv{font-size:16px;font-weight:700}
  </style></head><body>
  <h1>${project.name} — Profitability Report</h1>
  <h2>Generated on ${new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}</h2>`;

  let tSales = 0,
    tTP = 0,
    tVC = 0,
    tC = 0,
    tFC = 0,
    tOP = 0;

  orders.forEach((order) => {
    const orderRows = rows.filter((r) => r.order === order);
    html += `<h3>Order: ${order}</h3><table>
    <thead><tr>
      <th>Product</th><th>Sales Value</th><th>Mat. Cost</th><th>FOC</th>
      <th>Throughput</th><th>Commission</th><th>Freight</th><th>Packing</th>
      <th>OVC</th><th>Other</th><th>Var Total</th><th>Contribution</th>
      <th>Fixed Cost</th><th>Op. Profit</th>
    </tr></thead><tbody>`;
    orderRows.forEach((row) => {
      const c = calcRow(row, allInputs[row.id]);
      tSales += row.salesValue;
      tTP += c.throughput;
      tVC += c.varTotal;
      tC += c.contribution;
      tFC += c.fixedCost;
      tOP += c.opProfit;
      html += `<tr>
        <td>${row.product}</td><td>${fmt(row.salesValue)}</td><td>${fmt(row.materialCost)}</td>
        <td>${fmt(row.foc)}</td><td class="pos">${fmt(c.throughput)}</td>
        <td>${fmt(c.commission)}</td><td>${fmt(row.freight)}</td><td>${fmt(row.packing)}</td>
        <td>${fmt(c.ovc)}</td><td>${fmt(c.other)}</td><td>${fmt(c.varTotal)}</td>
        <td class="${c.contribution >= 0 ? "pos" : "neg"}">${fmt(c.contribution)}</td>
        <td>${fmt(c.fixedCost)}</td>
        <td class="${c.opProfit >= 0 ? "pos" : "neg"}">${fmt(c.opProfit)}</td>
      </tr>`;
    });
    html += `</tbody></table>`;
  });

  html += `<div class="summary">
    <div class="sm"><div class="sl">Total Sales</div><div class="sv">${fmt(tSales)}</div></div>
    <div class="sm"><div class="sl">Throughput</div><div class="sv pos">${fmt(tTP)}</div></div>
    <div class="sm"><div class="sl">Var. Cost</div><div class="sv">${fmt(tVC)}</div></div>
    <div class="sm"><div class="sl">Contribution</div><div class="sv ${tC >= 0 ? "pos" : "neg"}">${fmt(tC)}</div></div>
    <div class="sm"><div class="sl">Op. Profit</div><div class="sv ${tOP >= 0 ? "pos" : "neg"}">${fmt(tOP)}</div></div>
  </div></body></html>`;

  const w = window.open("", "_blank", "width=1100,height=800");
  w.document.write(html);
  w.document.close();
  w.print();
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function MetricCard({ label, value, color, accent }) {
  return (
    <div
      style={{
        ...S.metricCard,
        borderTop: `2px solid ${accent || COLORS.borderLight}`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 60,
          height: 60,
          background: `radial-gradient(circle at top right, ${accent ? accent + "18" : "transparent"}, transparent)`,
          pointerEvents: "none",
        }}
      />
      <div style={S.metricLabel}>{label}</div>
      <div style={{ ...S.metricValue, color: color || COLORS.text }}>
        {value}
      </div>
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function DashboardScreen({ onNavigate, savedInputs }) {
  const projects = Object.values(PROJECTS_DATA);

  const totals = useMemo(() => {
    let tRev = 0,
      tTP = 0,
      tC = 0,
      tOP = 0;
    projects.forEach((p) => {
      p.rows.forEach((row) => {
        const c = calcRow(row, savedInputs[p.id]?.[row.id]);
        tRev += row.salesValue;
        tTP += c.throughput;
        tC += c.contribution;
        tOP += c.opProfit;
      });
    });
    return { tRev, tTP, tC, tOP };
  }, [savedInputs]);

  return (
    <div style={S.page}>
      <div style={S.pageHeader}>
        <div>
          <div style={S.pageTitle}>Projects Overview</div>
          <div style={S.pageSub}>
            Track profitability across all active projects
          </div>
        </div>
        <button style={S.btn("primary")} onClick={() => onNavigate("create")}>
          <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> New Analysis
        </button>
      </div>

      <div style={S.metricGrid}>
        <MetricCard
          label="Total Projects"
          value={projects.length}
          accent={COLORS.violet2}
        />
        <MetricCard
          label="Total Revenue"
          value={`₹${fmt(totals.tRev)}`}
          accent={COLORS.cyan}
        />
        <MetricCard
          label="Total Throughput"
          value={`₹${fmt(totals.tTP)}`}
          accent={COLORS.sky}
          color={COLORS.sky}
        />
        <MetricCard
          label="Total Contribution"
          value={`₹${fmt(totals.tC)}`}
          accent={COLORS.emerald}
          color={totals.tC >= 0 ? COLORS.emerald : COLORS.rose}
        />
        <MetricCard
          label="Operating Profit"
          value={`₹${fmt(totals.tOP)}`}
          accent={totals.tOP >= 0 ? COLORS.emerald : COLORS.rose}
          color={totals.tOP >= 0 ? COLORS.emerald : COLORS.rose}
        />
      </div>

      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead>
            <tr>
              {[
                "Project",
                "Orders",
                "Revenue",
                "Throughput",
                "Contribution",
                "Op. Profit",
                "Status",
                "",
              ].map((h, i) => (
                <th key={i} style={{ ...S.th(), ...(i < 2 ? S.thLeft : {}) }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => {
              let rev = 0,
                tp = 0,
                c = 0,
                op = 0;
              p.rows.forEach((row) => {
                const calc = calcRow(row, savedInputs[p.id]?.[row.id]);
                rev += row.salesValue;
                tp += calc.throughput;
                c += calc.contribution;
                op += calc.opProfit;
              });
              const orders = [...new Set(p.rows.map((r) => r.order))].length;
              const status = op > 0 ? "green" : op === 0 ? "amber" : "red";
              const statusLabel =
                op > 0 ? "Profitable" : op === 0 ? "Break-even" : "Loss";
              return (
                <tr
                  key={p.id}
                  style={{ background: COLORS.surface }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = COLORS.surfaceHover)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = COLORS.surface)
                  }
                >
                  <td
                    style={{
                      ...S.td,
                      ...S.tdLeft,
                      fontWeight: 600,
                      color: COLORS.text,
                    }}
                  >
                    {p.name}
                  </td>
                  <td style={{ ...S.td, ...S.tdLeft, color: COLORS.textMuted }}>
                    {orders} orders · {p.rows.length} products
                  </td>
                  <td style={S.td}>₹{fmt(rev)}</td>
                  <td style={{ ...S.td, color: COLORS.sky }}>₹{fmt(tp)}</td>
                  <td
                    style={{
                      ...S.td,
                      color: c >= 0 ? COLORS.emerald : COLORS.rose,
                    }}
                  >
                    ₹{fmt(c)}
                  </td>
                  <td
                    style={{
                      ...S.td,
                      fontWeight: 700,
                      color: op >= 0 ? COLORS.emerald : COLORS.rose,
                    }}
                  >
                    ₹{fmt(op)}
                  </td>
                  <td style={S.td}>
                    <span style={S.badge(status)}>{statusLabel}</span>
                  </td>
                  <td style={S.td}>
                    <button
                      style={S.btn()}
                      onClick={() => onNavigate("view", p.id)}
                    >
                      Open →
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── VIEW SCREEN (read-only) ──────────────────────────────────────────────────
function ViewScreen({ onNavigate, savedInputs, pid }) {
  const project = PROJECTS_DATA[pid];
  const allInputs = savedInputs[pid] || {};

  const projectTotals = useMemo(() => {
    let tSales = 0,
      tTP = 0,
      tVC = 0,
      tC = 0,
      tFC = 0,
      tOP = 0;
    project.rows.forEach((row) => {
      const c = calcRow(row, allInputs[row.id]);
      tSales += row.salesValue;
      tTP += c.throughput;
      tVC += c.varTotal;
      tC += c.contribution;
      tFC += c.fixedCost;
      tOP += c.opProfit;
    });
    return { tSales, tTP, tVC, tC, tFC, tOP };
  }, [project, allInputs]);

  const orders = [...new Set(project.rows.map((r) => r.order))];

  const colHeaderStyle = (color) => ({
    ...S.th(color),
    borderBottom: `2px solid ${color}`,
    paddingBottom: 9,
  });

  // Grand total across all rows
  const grandTotal = useMemo(() => {
    let sales = 0,
      matCost = 0,
      foc = 0,
      tp = 0,
      commission = 0,
      freight = 0,
      packing = 0,
      ovc = 0,
      other = 0,
      varTotal = 0,
      contribution = 0,
      fixedCost = 0,
      opProfit = 0;
    project.rows.forEach((row) => {
      const c = calcRow(row, allInputs[row.id]);
      sales += row.salesValue;
      matCost += row.materialCost;
      foc += row.foc;
      tp += c.throughput;
      commission += c.commission;
      freight += row.freight;
      packing += row.packing;
      ovc += c.ovc;
      other += c.other;
      varTotal += c.varTotal;
      contribution += c.contribution;
      fixedCost += c.fixedCost;
      opProfit += c.opProfit;
    });
    return {
      sales,
      matCost,
      foc,
      tp,
      commission,
      freight,
      packing,
      ovc,
      other,
      varTotal,
      contribution,
      fixedCost,
      opProfit,
    };
  }, [project, allInputs]);

  return (
    <div style={S.page}>
      <div style={S.pageHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            style={{ ...S.btn(), padding: "7px 12px" }}
            onClick={() => onNavigate("dashboard")}
          >
            ← Back
          </button>
          <div>
            <div style={S.pageTitle}>{project.name}</div>
            <div style={S.pageSub}>Project profitability — view only</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            style={S.btn("amber")}
            onClick={() => exportToCSV(project, allInputs)}
          >
            ⬇ CSV
          </button>
          <button
            style={S.btn("amber")}
            onClick={() => exportToPDF(project, allInputs)}
          >
            ⬇ PDF
          </button>
          <button
            style={S.btn("primary")}
            onClick={() => onNavigate("create", pid)}
          >
            ✏ Edit Analysis
          </button>
        </div>
      </div>

      {/* Summary metrics — unchanged */}
      <div
        style={{
          ...S.metricGrid,
          gridTemplateColumns: "repeat(6,1fr)",
          marginBottom: 20,
        }}
      >
        <MetricCard
          label="Total Sales"
          value={`₹${fmt(projectTotals.tSales)}`}
          accent={COLORS.cyan}
        />
        <MetricCard
          label="Throughput"
          value={`₹${fmt(projectTotals.tTP)}`}
          accent={COLORS.sky}
          color={COLORS.sky}
        />
        <MetricCard
          label="Var. Cost"
          value={`₹${fmt(projectTotals.tVC)}`}
          accent={COLORS.violet2}
          color={COLORS.violet2}
        />
        <MetricCard
          label="Contribution"
          value={`₹${fmt(projectTotals.tC)}`}
          accent={projectTotals.tC >= 0 ? COLORS.emerald : COLORS.rose}
          color={projectTotals.tC >= 0 ? COLORS.emerald : COLORS.rose}
        />
        <MetricCard
          label="Fixed Cost"
          value={`₹${fmt(projectTotals.tFC)}`}
          accent={COLORS.amber}
          color={COLORS.amber}
        />
        <MetricCard
          label="Op. Profit"
          value={`₹${fmt(projectTotals.tOP)}`}
          accent={projectTotals.tOP >= 0 ? COLORS.emerald : COLORS.rose}
          color={projectTotals.tOP >= 0 ? COLORS.emerald : COLORS.rose}
        />
      </div>

      {/* Read-only table */}
      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead>
            <tr>
              <th
                colSpan={2}
                style={{
                  ...S.th(),
                  ...S.thLeft,
                  borderBottom: `2px solid ${COLORS.borderLight}`,
                }}
              >
                Order / Product
              </th>
              <th
                colSpan={3}
                style={{
                  ...S.th(COLORS.textMuted),
                  textAlign: "center",
                  borderBottom: `2px solid ${COLORS.borderLight}`,
                  background: "rgba(100,116,139,0.06)",
                }}
              >
                Pre-defined
              </th>
              <th
                colSpan={1}
                style={{
                  ...S.th(COLORS.sky),
                  textAlign: "center",
                  borderBottom: `2px solid ${COLORS.sky}`,
                  background: "rgba(2,132,199,0.06)",
                }}
              >
                Throughput
              </th>
              <th
                colSpan={5}
                style={{
                  ...S.th(COLORS.violet2),
                  textAlign: "center",
                  borderBottom: `2px solid ${COLORS.violet2}`,
                  background: "rgba(124,58,237,0.05)",
                }}
              >
                Variable Costs
              </th>
              <th
                colSpan={1}
                style={{
                  ...S.th(COLORS.violet2),
                  textAlign: "center",
                  borderBottom: `2px solid ${COLORS.violet2}`,
                  background: "rgba(124,58,237,0.05)",
                }}
              >
                Total
              </th>
              <th
                colSpan={1}
                style={{
                  ...S.th(COLORS.emerald),
                  textAlign: "center",
                  borderBottom: `2px solid ${COLORS.emerald}`,
                  background: "rgba(5,150,105,0.05)",
                }}
              >
                Contribution
              </th>
              <th
                colSpan={1}
                style={{
                  ...S.th(COLORS.amber),
                  textAlign: "center",
                  borderBottom: `2px solid ${COLORS.amber}`,
                  background: "rgba(217,119,6,0.05)",
                }}
              >
                Fixed
              </th>
              <th
                colSpan={1}
                style={{
                  ...S.th(COLORS.cyan),
                  textAlign: "center",
                  borderBottom: `2px solid ${COLORS.cyan}`,
                  background: "rgba(2,132,199,0.05)",
                }}
              >
                Op. Profit
              </th>
            </tr>
            <tr>
              <th style={{ ...S.th(), ...S.thLeft }}>Order</th>
              <th style={{ ...S.th(), ...S.thLeft }}>Product</th>
              <th style={colHeaderStyle(COLORS.textMuted)}>Sales Val</th>
              <th style={colHeaderStyle(COLORS.textMuted)}>Mat. Cost</th>
              <th style={colHeaderStyle(COLORS.textMuted)}>FOC</th>
              <th style={colHeaderStyle(COLORS.sky)}>= TP</th>
              <th style={colHeaderStyle(COLORS.violet2)}>Commission</th>
              <th style={colHeaderStyle(COLORS.violet2)}>Freight</th>
              <th style={colHeaderStyle(COLORS.violet2)}>Packing</th>
              <th style={colHeaderStyle(COLORS.violet2)}>OVC</th>
              <th style={colHeaderStyle(COLORS.violet2)}>Other Direct</th>
              <th style={colHeaderStyle(COLORS.violet2)}>Σ Var</th>
              <th style={colHeaderStyle(COLORS.emerald)}>TP - Total</th>
              <th style={colHeaderStyle(COLORS.amber)}>Fixed Cost</th>
              <th style={colHeaderStyle(COLORS.cyan)}>Cont - FC</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const orderRows = project.rows.filter((r) => r.order === order);
              return orderRows.map((row, ri) => {
                const c = calcRow(row, allInputs[row.id]);
                return (
                  <tr
                    key={row.id}
                    style={{
                      background:
                        ri % 2 === 0 ? COLORS.surface : COLORS.surfaceAlt,
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = COLORS.surfaceHover)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        ri % 2 === 0 ? COLORS.surface : COLORS.surfaceAlt)
                    }
                  >
                    <td
                      style={{
                        ...S.td,
                        ...S.tdLeft,
                        color: COLORS.amber,
                        fontWeight: 600,
                        fontSize: 12,
                      }}
                    >
                      {row.order}
                    </td>
                    <td style={{ ...S.td, ...S.tdLeft, fontWeight: 600 }}>
                      {row.product}
                    </td>
                    <td style={S.td}>₹{fmt(row.salesValue)}</td>
                    <td style={{ ...S.td, color: COLORS.textMuted }}>
                      ₹{fmt(row.materialCost)}
                    </td>
                    <td style={{ ...S.td, color: COLORS.textMuted }}>
                      ₹{fmt(row.foc)}
                    </td>
                    <td style={{ ...S.td, color: COLORS.sky, fontWeight: 700 }}>
                      ₹{fmt(c.throughput)}
                    </td>
                    <td style={{ ...S.td, color: COLORS.textDim }}>
                      ₹{fmt(c.commission)}
                    </td>
                    <td style={{ ...S.td, color: COLORS.textDim }}>
                      ₹{fmt(row.freight)}
                    </td>
                    <td style={{ ...S.td, color: COLORS.textDim }}>
                      ₹{fmt(row.packing)}
                    </td>
                    <td style={{ ...S.td, color: COLORS.textDim }}>
                      ₹{fmt(c.ovc)}
                    </td>
                    <td style={{ ...S.td, color: COLORS.textDim }}>
                      ₹{fmt(c.other)}
                    </td>
                    <td style={{ ...S.td, color: COLORS.violet2 }}>
                      ₹{fmt(c.varTotal)}
                    </td>
                    <td
                      style={{
                        ...S.td,
                        fontWeight: 700,
                        color:
                          c.contribution >= 0 ? COLORS.emerald : COLORS.rose,
                      }}
                    >
                      ₹{fmt(c.contribution)}
                    </td>
                    <td style={{ ...S.td, color: COLORS.textDim }}>
                      ₹{fmt(c.fixedCost)}
                    </td>
                    <td
                      style={{
                        ...S.td,
                        fontWeight: 700,
                        color: c.opProfit >= 0 ? COLORS.cyan : COLORS.rose,
                        background:
                          c.opProfit >= 0
                            ? "rgba(2,132,199,0.05)"
                            : "rgba(225,29,72,0.05)",
                      }}
                    >
                      ₹{fmt(c.opProfit)}
                    </td>
                  </tr>
                );
              });
            })}

            {/* ── Grand Total Row ── */}
            <tr style={S.totalRow}>
              <td
                colSpan={2}
                style={{
                  ...S.totalTd(),
                  ...S.tdLeft,
                  color: COLORS.text,
                  fontSize: 12,
                  letterSpacing: "0.4px",
                  textTransform: "uppercase",
                }}
              >
                🔢 Grand Total
              </td>
              <td style={S.totalTd()}>₹{fmt(grandTotal.sales)}</td>
              <td style={S.totalTd()}>₹{fmt(grandTotal.matCost)}</td>
              <td style={S.totalTd()}>₹{fmt(grandTotal.foc)}</td>
              <td style={{ ...S.totalTd(), color: COLORS.sky }}>
                ₹{fmt(grandTotal.tp)}
              </td>
              <td style={S.totalTd()}>₹{fmt(grandTotal.commission)}</td>
              <td style={S.totalTd()}>₹{fmt(grandTotal.freight)}</td>
              <td style={S.totalTd()}>₹{fmt(grandTotal.packing)}</td>
              <td style={S.totalTd()}>₹{fmt(grandTotal.ovc)}</td>
              <td style={S.totalTd()}>₹{fmt(grandTotal.other)}</td>
              <td style={{ ...S.totalTd(), color: COLORS.violet2 }}>
                ₹{fmt(grandTotal.varTotal)}
              </td>
              <td style={S.totalTd(grandTotal.contribution >= 0)}>
                ₹{fmt(grandTotal.contribution)}
              </td>
              <td style={S.totalTd()}>₹{fmt(grandTotal.fixedCost)}</td>
              <td style={S.totalTd(grandTotal.opProfit >= 0)}>
                ₹{fmt(grandTotal.opProfit)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── CREATE / EDIT SCREEN ────────────────────────────────────────────────────
function CreateScreen({
  onNavigate,
  savedInputs,
  onSaveInputs,
  initialPid = "",
}) {
  const [selectedPid, setSelectedPid] = useState(initialPid);
  const [localInputs, setLocalInputs] = useState(
    initialPid && savedInputs[initialPid]
      ? JSON.parse(JSON.stringify(savedInputs[initialPid]))
      : {},
  );

  const project = selectedPid ? PROJECTS_DATA[selectedPid] : null;

  const handleSelect = (pid) => {
    setSelectedPid(pid);
    setLocalInputs(
      savedInputs[pid] ? JSON.parse(JSON.stringify(savedInputs[pid])) : {},
    );
  };

  const setVal = (rowId, field, val) => {
    setLocalInputs((prev) => ({
      ...prev,
      [rowId]: { ...(prev[rowId] || {}), [field]: val },
    }));
  };

  const save = () => {
    onSaveInputs(selectedPid, localInputs);
    onNavigate("dashboard");
  };

  const projectTotals = useMemo(() => {
    if (!project) return null;
    let tSales = 0,
      tTP = 0,
      tVC = 0,
      tC = 0,
      tFC = 0,
      tOP = 0;
    project.rows.forEach((row) => {
      const c = calcRow(row, localInputs[row.id]);
      tSales += row.salesValue;
      tTP += c.throughput;
      tVC += c.varTotal;
      tC += c.contribution;
      tFC += c.fixedCost;
      tOP += c.opProfit;
    });
    return { tSales, tTP, tVC, tC, tFC, tOP };
  }, [project, localInputs]);

  const orders = project ? [...new Set(project.rows.map((r) => r.order))] : [];

  // Grand total for edit table
  const grandTotal = useMemo(() => {
    if (!project) return null;
    let sales = 0,
      matCost = 0,
      foc = 0,
      tp = 0,
      commission = 0,
      freight = 0,
      packing = 0,
      ovc = 0,
      other = 0,
      varTotal = 0,
      contribution = 0,
      fixedCost = 0,
      opProfit = 0;
    project.rows.forEach((row) => {
      const c = calcRow(row, localInputs[row.id]);
      sales += row.salesValue;
      matCost += row.materialCost;
      foc += row.foc;
      tp += c.throughput;
      commission += c.commission;
      freight += row.freight;
      packing += row.packing;
      ovc += c.ovc;
      other += c.other;
      varTotal += c.varTotal;
      contribution += c.contribution;
      fixedCost += c.fixedCost;
      opProfit += c.opProfit;
    });
    return {
      sales,
      matCost,
      foc,
      tp,
      commission,
      freight,
      packing,
      ovc,
      other,
      varTotal,
      contribution,
      fixedCost,
      opProfit,
    };
  }, [project, localInputs]);

  const INPUT_FIELD = (row, field, label) => (
    <input
      type="number"
      min={0}
      style={S.numInput}
      value={localInputs[row.id]?.[field] ?? ""}
      placeholder="0"
      onChange={(e) => setVal(row.id, field, e.target.value)}
      aria-label={label}
    />
  );

  const colHeaderStyle = (color) => ({
    ...S.th(color),
    borderBottom: `2px solid ${color}`,
    paddingBottom: 9,
  });

  return (
    <div style={S.page}>
      <div style={S.pageHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            style={{ ...S.btn(), padding: "7px 12px" }}
            onClick={() => onNavigate("dashboard")}
          >
            ← Back
          </button>
          <div>
            <div style={S.pageTitle}>
              {project ? project.name : "New Analysis"}
            </div>
            <div style={S.pageSub}>
              Input variable costs · auto-calculate profits
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <select
            style={S.select}
            value={selectedPid}
            onChange={(e) => handleSelect(e.target.value)}
          >
            <option value="">— Select project —</option>
            {Object.values(PROJECTS_DATA).map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          {project && (
            <>
              <button
                style={S.btn("amber")}
                onClick={() => exportToCSV(project, localInputs)}
              >
                ⬇ CSV
              </button>
              <button
                style={S.btn("amber")}
                onClick={() => exportToPDF(project, localInputs)}
              >
                ⬇ PDF
              </button>
              <button style={S.btn("primary")} onClick={save}>
                Save to Dashboard
              </button>
            </>
          )}
        </div>
      </div>

      {!project && (
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
            color: COLORS.textMuted,
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              marginBottom: 6,
              color: COLORS.textDim,
            }}
          >
            Select a project to begin
          </div>
          <div style={{ fontSize: 13 }}>
            Choose a project from the dropdown above to load order-product
            combinations
          </div>
        </div>
      )}

      {project && (
        <>
          {/* Summary metrics */}
          <div
            style={{
              ...S.metricGrid,
              gridTemplateColumns: "repeat(6,1fr)",
              marginBottom: 20,
            }}
          >
            <MetricCard
              label="Total Sales"
              value={`₹${fmt(projectTotals.tSales)}`}
              accent={COLORS.cyan}
            />
            <MetricCard
              label="Throughput"
              value={`₹${fmt(projectTotals.tTP)}`}
              accent={COLORS.sky}
              color={COLORS.sky}
            />
            <MetricCard
              label="Var. Cost"
              value={`₹${fmt(projectTotals.tVC)}`}
              accent={COLORS.violet2}
              color={COLORS.violet2}
            />
            <MetricCard
              label="Contribution"
              value={`₹${fmt(projectTotals.tC)}`}
              accent={projectTotals.tC >= 0 ? COLORS.emerald : COLORS.rose}
              color={projectTotals.tC >= 0 ? COLORS.emerald : COLORS.rose}
            />
            <MetricCard
              label="Fixed Cost"
              value={`₹${fmt(projectTotals.tFC)}`}
              accent={COLORS.amber}
              color={COLORS.amber}
            />
            <MetricCard
              label="Op. Profit"
              value={`₹${fmt(projectTotals.tOP)}`}
              accent={projectTotals.tOP >= 0 ? COLORS.emerald : COLORS.rose}
              color={projectTotals.tOP >= 0 ? COLORS.emerald : COLORS.rose}
            />
          </div>

          {/* Editable table */}
          <div style={S.tableWrap}>
            <table style={S.table}>
              <thead>
                <tr>
                  <th
                    colSpan={2}
                    style={{
                      ...S.th(),
                      ...S.thLeft,
                      borderBottom: `2px solid ${COLORS.borderLight}`,
                    }}
                  >
                    Order / Product
                  </th>
                  <th
                    colSpan={3}
                    style={{
                      ...S.th(COLORS.textMuted),
                      textAlign: "center",
                      borderBottom: `2px solid ${COLORS.borderLight}`,
                      background: "rgba(100,116,139,0.06)",
                    }}
                  >
                    Pre-defined
                  </th>
                  <th
                    colSpan={1}
                    style={{
                      ...S.th(COLORS.sky),
                      textAlign: "center",
                      borderBottom: `2px solid ${COLORS.sky}`,
                      background: "rgba(2,132,199,0.06)",
                    }}
                  >
                    Throughput
                  </th>
                  <th
                    colSpan={5}
                    style={{
                      ...S.th(COLORS.violet2),
                      textAlign: "center",
                      borderBottom: `2px solid ${COLORS.violet2}`,
                      background: "rgba(124,58,237,0.05)",
                    }}
                  >
                    Variable Costs
                  </th>
                  <th
                    colSpan={1}
                    style={{
                      ...S.th(COLORS.violet2),
                      textAlign: "center",
                      borderBottom: `2px solid ${COLORS.violet2}`,
                      background: "rgba(124,58,237,0.05)",
                    }}
                  >
                    Total
                  </th>
                  <th
                    colSpan={1}
                    style={{
                      ...S.th(COLORS.emerald),
                      textAlign: "center",
                      borderBottom: `2px solid ${COLORS.emerald}`,
                      background: "rgba(5,150,105,0.05)",
                    }}
                  >
                    Contribution
                  </th>
                  <th
                    colSpan={1}
                    style={{
                      ...S.th(COLORS.amber),
                      textAlign: "center",
                      borderBottom: `2px solid ${COLORS.amber}`,
                      background: "rgba(217,119,6,0.05)",
                    }}
                  >
                    Fixed
                  </th>
                  <th
                    colSpan={1}
                    style={{
                      ...S.th(COLORS.cyan),
                      textAlign: "center",
                      borderBottom: `2px solid ${COLORS.cyan}`,
                      background: "rgba(2,132,199,0.05)",
                    }}
                  >
                    Op. Profit
                  </th>
                </tr>
                <tr>
                  <th style={{ ...S.th(), ...S.thLeft }}>Order</th>
                  <th style={{ ...S.th(), ...S.thLeft }}>Product</th>
                  <th style={colHeaderStyle(COLORS.textMuted)}>Sales Val</th>
                  <th style={colHeaderStyle(COLORS.textMuted)}>Mat. Cost</th>
                  <th style={colHeaderStyle(COLORS.textMuted)}>FOC</th>
                  <th style={colHeaderStyle(COLORS.sky)}>= TP</th>
                  <th style={colHeaderStyle(COLORS.violet2)}>Commission</th>
                  <th style={colHeaderStyle(COLORS.violet2)}>Freight</th>
                  <th style={colHeaderStyle(COLORS.violet2)}>Packing</th>
                  <th style={colHeaderStyle(COLORS.violet2)}>OVC</th>
                  <th style={colHeaderStyle(COLORS.violet2)}>Other Direct</th>
                  <th style={colHeaderStyle(COLORS.violet2)}>Σ Var</th>
                  <th style={colHeaderStyle(COLORS.emerald)}>TP - Total</th>
                  <th style={colHeaderStyle(COLORS.amber)}>Fixed Cost</th>
                  <th style={colHeaderStyle(COLORS.cyan)}>Cont - FC</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const orderRows = project.rows.filter(
                    (r) => r.order === order,
                  );
                  return orderRows.map((row, ri) => {
                    const c = calcRow(row, localInputs[row.id]);
                    return (
                      <tr
                        key={row.id}
                        style={{
                          background:
                            ri % 2 === 0 ? COLORS.surface : COLORS.surfaceAlt,
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            COLORS.surfaceHover)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background =
                            ri % 2 === 0 ? COLORS.surface : COLORS.surfaceAlt)
                        }
                      >
                        <td
                          style={{
                            ...S.td,
                            ...S.tdLeft,
                            color: COLORS.amber,
                            fontWeight: 600,
                            fontSize: 12,
                          }}
                        >
                          {row.order}
                        </td>
                        <td style={{ ...S.td, ...S.tdLeft, fontWeight: 600 }}>
                          {row.product}
                        </td>
                        <td style={S.td}>₹{fmt(row.salesValue)}</td>
                        <td style={{ ...S.td, color: COLORS.textMuted }}>
                          ₹{fmt(row.materialCost)}
                        </td>
                        <td style={{ ...S.td, color: COLORS.textMuted }}>
                          ₹{fmt(row.foc)}
                        </td>
                        <td
                          style={{
                            ...S.td,
                            color: COLORS.sky,
                            fontWeight: 700,
                          }}
                        >
                          ₹{fmt(c.throughput)}
                        </td>
                        <td style={S.td}>
                          {INPUT_FIELD(row, "commission", "Commission")}
                        </td>
                        <td style={{ ...S.td, color: COLORS.textDim }}>
                          ₹{fmt(row.freight)}
                        </td>
                        <td style={{ ...S.td, color: COLORS.textDim }}>
                          ₹{fmt(row.packing)}
                        </td>
                        <td style={S.td}>{INPUT_FIELD(row, "ovc", "OVC")}</td>
                        <td style={S.td}>
                          {INPUT_FIELD(row, "other", "Other Direct")}
                        </td>
                        <td style={{ ...S.td, color: COLORS.violet2 }}>
                          ₹{fmt(c.varTotal)}
                        </td>
                        <td
                          style={{
                            ...S.td,
                            fontWeight: 700,
                            color:
                              c.contribution >= 0
                                ? COLORS.emerald
                                : COLORS.rose,
                          }}
                        >
                          ₹{fmt(c.contribution)}
                        </td>
                        <td style={S.td}>
                          {INPUT_FIELD(row, "fixedCost", "Fixed Cost")}
                        </td>
                        <td
                          style={{
                            ...S.td,
                            fontWeight: 700,
                            color: c.opProfit >= 0 ? COLORS.cyan : COLORS.rose,
                            background:
                              c.opProfit >= 0
                                ? "rgba(2,132,199,0.05)"
                                : "rgba(225,29,72,0.05)",
                          }}
                        >
                          ₹{fmt(c.opProfit)}
                        </td>
                      </tr>
                    );
                  });
                })}

                {/* ── Grand Total Row ── */}
                {grandTotal && (
                  <tr style={S.totalRow}>
                    <td
                      colSpan={2}
                      style={{
                        ...S.totalTd(),
                        ...S.tdLeft,
                        color: COLORS.text,
                        fontSize: 12,
                        letterSpacing: "0.4px",
                        textTransform: "uppercase",
                      }}
                    >
                      🔢 Grand Total
                    </td>
                    <td style={S.totalTd()}>₹{fmt(grandTotal.sales)}</td>
                    <td style={S.totalTd()}>₹{fmt(grandTotal.matCost)}</td>
                    <td style={S.totalTd()}>₹{fmt(grandTotal.foc)}</td>
                    <td style={{ ...S.totalTd(), color: COLORS.sky }}>
                      ₹{fmt(grandTotal.tp)}
                    </td>
                    <td style={S.totalTd()}>₹{fmt(grandTotal.commission)}</td>
                    <td style={S.totalTd()}>₹{fmt(grandTotal.freight)}</td>
                    <td style={S.totalTd()}>₹{fmt(grandTotal.packing)}</td>
                    <td style={S.totalTd()}>₹{fmt(grandTotal.ovc)}</td>
                    <td style={S.totalTd()}>₹{fmt(grandTotal.other)}</td>
                    <td style={{ ...S.totalTd(), color: COLORS.violet2 }}>
                      ₹{fmt(grandTotal.varTotal)}
                    </td>
                    <td style={S.totalTd(grandTotal.contribution >= 0)}>
                      ₹{fmt(grandTotal.contribution)}
                    </td>
                    <td style={S.totalTd()}>₹{fmt(grandTotal.fixedCost)}</td>
                    <td style={S.totalTd(grandTotal.opProfit >= 0)}>
                      ₹{fmt(grandTotal.opProfit)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

// ─── APP ROOT ────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("dashboard");
  const [activePid, setActivePid] = useState("");
  const [savedInputs, setSavedInputs] = useState({});

  const navigate = useCallback((to, pid = "") => {
    setScreen(to);
    setActivePid(pid);
  }, []);

  const handleSave = useCallback((pid, inputs) => {
    setSavedInputs((prev) => ({ ...prev, [pid]: inputs }));
  }, []);

  return (
    <div style={S.app}>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <nav style={S.nav}>
        <div style={S.navLogo}>
          <div style={S.logoBadge}></div>
          Project Profitability
          <span
            style={{
              fontSize: 11,
              color: COLORS.textMuted,
              fontWeight: 400,
              marginLeft: 2,
            }}
          >
            Project Profitability
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            style={{
              ...S.btn(screen === "dashboard" ? "primary" : "ghost"),
              padding: "6px 14px",
              fontSize: 12,
            }}
            onClick={() => navigate("dashboard")}
          >
            Dashboard
          </button>
          <button
            style={{
              ...S.btn(screen === "create" ? "primary" : "ghost"),
              padding: "6px 14px",
              fontSize: 12,
            }}
            onClick={() => navigate("create")}
          >
            + Analysis
          </button>
        </div>
      </nav>

      {screen === "dashboard" && (
        <DashboardScreen onNavigate={navigate} savedInputs={savedInputs} />
      )}
      {screen === "view" && (
        <ViewScreen
          key={activePid}
          pid={activePid}
          onNavigate={navigate}
          savedInputs={savedInputs}
        />
      )}
      {screen === "create" && (
        <CreateScreen
          key={activePid}
          initialPid={activePid}
          onNavigate={navigate}
          savedInputs={savedInputs}
          onSaveInputs={handleSave}
        />
      )}
    </div>
  );
}
