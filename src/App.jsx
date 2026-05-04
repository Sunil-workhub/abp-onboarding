import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import ProjectProfitabilityService from "./services/projectProfitability/ProjectProfitabilityService";

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmt = (n) =>
  n == null || n === ""
    ? "—"
    : Number(n).toLocaleString("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });

const pct = (n) => (n == null || n === "" ? "—" : `${Number(n).toFixed(1)}%`);

function calcEstRow(row) {
  const offerValue = Number(row.offer_Value ?? row.sales_Value ?? 0);
  const loading = Number(row.loading_Pct ?? 0);
  const discount = Number(row.discount_Pct ?? 0);
  const salesValue = offerValue * (1 + loading / 100) * (1 - discount / 100);
  const estMatCost = Number(row.est_Mat_Cost ?? 0);
  const throughput = salesValue - estMatCost;
  const tpMargin = salesValue > 0 ? (throughput / salesValue) * 100 : 0;
  return { salesValue, estMatCost, throughput, tpMargin };
}

function calcActRow(row, inputs) {
  const actSales = Number(row.sales_Value ?? 0);
  const actMatCost = Number(row.act_Mat_Cost ?? 0);
  const foc = Number(row.mat_Cost_FOC ?? 0);
  const commission = Number(inputs?.commission ?? 0);
  const freight = Number(inputs?.freight ?? row.freight ?? 0);
  const packing = Number(inputs?.packing ?? row.packing ?? 0);
  const ovc = Number(inputs?.ovc ?? 0);
  const otherDirect = Number(inputs?.other_Direct ?? 0);
  const fixedCost = Number(inputs?.fixed_Cost ?? 0);
  const throughput = actSales - actMatCost - foc;
  const totalOVC = commission + freight + packing + ovc + otherDirect;
  const contribution = throughput - totalOVC;
  const opProfit = contribution - fixedCost;
  return {
    actSales,
    actMatCost,
    foc,
    throughput,
    commission,
    freight,
    packing,
    ovc,
    otherDirect,
    totalOVC,
    contribution,
    fixedCost,
    opProfit,
  };
}

// ─── useMaterialCosts hook ─────────────────────────────────────────────────────
function useMaterialCosts(rows) {
  const [matData, setMatData] = useState({});
  const [loadingMats, setLoadingMats] = useState(false);

  useEffect(() => {
    if (!rows || rows.length === 0) {
      setMatData({});
      return;
    }
    setLoadingMats(true);
    const unique = [];
    const seen = new Set();
    rows.forEach((row) => {
      const key = `${row.oa_No}|${row.fg_Code}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(row);
      }
    });
    Promise.all(
      unique.map((row) =>
        ProjectProfitabilityService.GetMaterialCosts(row.oa_No, row.fg_Code)
          .then((res) => {
            const key = `${row.oa_No}|${row.fg_Code}`;
            if (res?.status_Code === 200) {
              const estItems = res.data?.estimatedMaterials || [];
              const actItems = res.data?.actualMaterials || [];

              // Cost resolution: for MTO items use budgeted_Cost as fallback when cost is null/0
              const resolveItemCost = (item) => {
                const c = Number(item.cost);
                const isMissing =
                  item.cost == null ||
                  item.cost === "" ||
                  c === 0 ||
                  Math.abs(c) < 0.01;
                if (isMissing) return Number(item.budgeted_Cost ?? 0);
                return c;
              };

              const sumItems = (items) =>
                items.reduce((s, i) => {
                  const isMTO = i.mC_Type === "MTO";
                  const v = isMTO
                    ? resolveItemCost(i)
                    : Number(
                        i.cost == null || i.cost === ""
                          ? (i.budgeted_Cost ?? 0)
                          : (i.cost ?? 0),
                      );
                  return s + v;
                }, 0);

              const hasIncomplete = (items) =>
                items.some((i) => i.cost == null || i.cost === "");

              // For MTO: incomplete means cost is null/0 AND no budgeted_Cost either
              const hasMTOUnresolvable = (items) =>
                items
                  .filter((i) => i.mC_Type === "MTO")
                  .some((i) => {
                    const c = Number(i.cost);
                    const isMissing =
                      i.cost == null ||
                      i.cost === "" ||
                      c === 0 ||
                      Math.abs(c) < 0.01;
                    return (
                      isMissing &&
                      (i.budgeted_Cost == null ||
                        i.budgeted_Cost === "" ||
                        Number(i.budgeted_Cost) === 0)
                    );
                  });

              return {
                key,
                estMatCost: sumItems(estItems),
                actMatCost: sumItems(actItems),
                estIncomplete: hasIncomplete(estItems),
                // actIncomplete = true only if MTO has unresolvable missing (no cost AND no budget)
                actIncomplete: hasMTOUnresolvable(actItems),
                estItems,
                actItems,
              };
            }
            return {
              key,
              estMatCost: 0,
              actMatCost: 0,
              estIncomplete: false,
              actIncomplete: false,
              estItems: [],
              actItems: [],
            };
          })
          .catch(() => ({
            key: `${row.oa_No}|${row.fg_Code}`,
            estMatCost: 0,
            actMatCost: 0,
            estIncomplete: true,
            actIncomplete: true,
            estItems: [],
            actItems: [],
          })),
      ),
    )
      .then((results) => {
        const map = {};
        results.forEach((r) => {
          map[r.key] = r;
        });
        setMatData(map);
      })
      .finally(() => setLoadingMats(false));
  }, [rows]);

  const enrichedRows = rows.map((row) => {
    const key = `${row.oa_No}|${row.fg_Code}`;
    const d = matData[key];
    if (!d) return row;
    return {
      ...row,
      est_Mat_Cost: d.estMatCost,
      act_Mat_Cost: d.actMatCost,
      _estMatIncomplete: d.estIncomplete,
      _actMatIncomplete: d.actIncomplete,
      _estItems: d.estItems,
      _actItems: d.actItems,
    };
  });
  return { enrichedRows, matData, loadingMats };
}

// ─── COLORS ──────────────────────────────────────────────────────────────────
const C = {
  bg: "#f0f4f8",
  surface: "#ffffff",
  surfaceHover: "#f8fafc",
  surfaceAlt: "#f7f9fc",
  border: "#e2e8f0",
  borderLight: "#cbd5e1",
  cyan: "#0284c7",
  violet: "#7c3aed",
  emerald: "#059669",
  amber: "#d97706",
  rose: "#e11d48",
  sky: "#0284c7",
  text: "#0f172a",
  textMuted: "#64748b",
  textDim: "#475569",
  totalRow: "#eff6ff",
  totalBorder: "#bfdbfe",
  redCell: "#fff1f2",
  redBorder: "#fda4af",
  sectionMts: "#f0fdf4",
  sectionMtsBorder: "#bbf7d0",
  sectionMto: "#faf5ff",
  sectionMtoBorder: "#e9d5ff",
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const S = {
  app: {
    minHeight: "100vh",
    background: C.bg,
    color: C.text,
    fontFamily: "'DM Sans','Segoe UI',sans-serif",
    fontSize: 14,
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    height: 52,
    background: C.surface,
    borderBottom: `1px solid ${C.border}`,
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  navLogo: {
    display: "flex",
    alignItems: "center",
    gap: 9,
    fontWeight: 700,
    fontSize: 16,
    color: C.text,
    letterSpacing: "-0.3px",
  },
  logoBadge: {
    width: 26,
    height: 26,
    borderRadius: 7,
    background: `linear-gradient(135deg,${C.cyan},${C.violet})`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 800,
    color: "#fff",
  },
  page: {
    padding: "20px 24px",
    display: "flex",
    flexDirection: "column",
    height: "calc(100vh - 52px)",
    overflow: "hidden",
  },
  pageHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
    flexShrink: 0,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: C.text,
    marginBottom: 2,
    letterSpacing: "-0.4px",
  },
  pageSub: { fontSize: 12, color: C.textMuted },
  btn: (variant = "ghost") => ({
    cursor: "pointer",
    border: `1px solid ${variant === "primary" ? "transparent" : variant === "danger" ? C.rose : C.borderLight}`,
    borderRadius: 7,
    padding: "6px 14px",
    fontSize: 12,
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    background:
      variant === "primary"
        ? `linear-gradient(135deg,${C.cyan},${C.violet})`
        : variant === "emerald"
          ? `linear-gradient(135deg,${C.emerald},${C.sky})`
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
            ? C.amber
            : variant === "danger"
              ? C.rose
              : C.textDim,
    transition: "all 0.15s",
    outline: "none",
    whiteSpace: "nowrap",
  }),
  metricGrid: (cols = 5) => ({
    display: "grid",
    gridTemplateColumns: `repeat(${cols},1fr)`,
    gap: 10,
    marginBottom: 14,
    flexShrink: 0,
  }),
  metricCard: {
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: 9,
    padding: "10px 14px",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
  },
  metricLabel: {
    fontSize: 10,
    color: C.textMuted,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: 4,
  },
  metricValue: { fontSize: 18, fontWeight: 700, letterSpacing: "-0.4px" },
  tableWrap: {
    overflowX: "auto",
    borderRadius: 10,
    border: `1px solid ${C.border}`,
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    flex: 1,
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
  },
  tableScrollBody: { overflowY: "auto", flex: 1 },
  table: { width: "100%", borderCollapse: "collapse", minWidth: 900 },
  th: (color) => ({
    padding: "8px 10px",
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: color || C.textMuted,
    background: "#f8fafc",
    borderBottom: `1px solid ${C.border}`,
    whiteSpace: "nowrap",
    textAlign: "right",
    position: "sticky",
    top: 0,
    zIndex: 2,
  }),
  thLeft: { textAlign: "left" },
  td: {
    padding: "7px 10px",
    fontSize: 12,
    borderBottom: `1px solid ${C.border}`,
    textAlign: "right",
    color: C.text,
  },
  tdLeft: { textAlign: "left" },
  numInput: {
    width: 70,
    background: "#f8fafc",
    border: `1px solid ${C.borderLight}`,
    borderRadius: 5,
    padding: "3px 6px",
    fontSize: 11,
    color: C.text,
    textAlign: "right",
    outline: "none",
  },
  select: {
    background: C.surface,
    border: `1px solid ${C.borderLight}`,
    borderRadius: 7,
    padding: "7px 11px",
    fontSize: 13,
    color: C.text,
    cursor: "pointer",
    outline: "none",
    minWidth: 200,
  },
  totalRow: { background: C.totalRow, borderTop: `2px solid ${C.totalBorder}` },
  totalTd: (isProfit) => ({
    padding: "8px 10px",
    fontSize: 12,
    fontWeight: 700,
    textAlign: "right",
    background: C.totalRow,
    color: isProfit === true ? C.emerald : isProfit === false ? C.rose : C.text,
    position: "sticky",
    bottom: 0,
    zIndex: 2,
  }),
  tabBar: {
    display: "flex",
    gap: 3,
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: 9,
    padding: 3,
    marginBottom: 14,
    width: "fit-content",
    flexShrink: 0,
  },
  tab: (active) => ({
    padding: "6px 16px",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    border: "none",
    background: active
      ? `linear-gradient(135deg,${C.cyan},${C.violet})`
      : "transparent",
    color: active ? "#fff" : C.textMuted,
    transition: "all 0.15s",
    outline: "none",
    whiteSpace: "nowrap",
  }),
  clickableCell: {
    cursor: "pointer",
    textDecoration: "underline dotted",
    textUnderlineOffset: 3,
  },
  redCell: {
    background: C.redCell,
    border: `1px solid ${C.redBorder}`,
    borderRadius: 4,
    padding: "1px 7px",
    display: "inline-block",
    color: C.rose,
    fontWeight: 700,
  },
  greenCell: {
    background: "rgba(5,150,105,0.08)",
    border: "1px solid rgba(5,150,105,0.35)",
    borderRadius: 4,
    padding: "1px 7px",
    display: "inline-block",
    color: C.emerald,
    fontWeight: 700,
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,0.45)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    background: C.surface,
    borderRadius: 14,
    width: "min(820px, 96vw)",
    maxHeight: "88vh",
    overflow: "hidden",
    boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
    border: `1px solid ${C.border}`,
    display: "flex",
    flexDirection: "column",
  },
  modalHeader: {
    padding: "14px 18px 12px",
    borderBottom: `1px solid ${C.border}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexShrink: 0,
  },
  modalTitle: { fontSize: 14, fontWeight: 700, color: C.text },
  modalClose: {
    cursor: "pointer",
    background: "none",
    border: "none",
    fontSize: 20,
    color: C.textMuted,
    lineHeight: 1,
    padding: "0 4px",
  },
  modalBody: { overflowY: "auto", flex: 1 },
  modalFooter: {
    padding: "10px 16px",
    borderTop: `1px solid ${C.border}`,
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: C.surface,
    flexShrink: 0,
  },
  badge: (color) => ({
    display: "inline-flex",
    alignItems: "center",
    padding: "2px 8px",
    borderRadius: 100,
    fontSize: 10,
    fontWeight: 700,
    background:
      color === "green"
        ? "rgba(5,150,105,0.12)"
        : color === "red"
          ? "rgba(225,29,72,0.10)"
          : color === "violet"
            ? "rgba(124,58,237,0.10)"
            : "rgba(217,119,6,0.12)",
    color:
      color === "green"
        ? C.emerald
        : color === "red"
          ? C.rose
          : color === "violet"
            ? C.violet
            : C.amber,
  }),
  sectionHeader: (type) => ({
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "9px 16px",
    background: type === "MTS" ? C.sectionMts : C.sectionMto,
    borderTop: `1px solid ${type === "MTS" ? C.sectionMtsBorder : C.sectionMtoBorder}`,
    borderBottom: `1px solid ${type === "MTS" ? C.sectionMtsBorder : C.sectionMtoBorder}`,
    cursor: "pointer",
    userSelect: "none",
  }),
  sectionTitle: (type) => ({
    fontSize: 12,
    fontWeight: 700,
    color: type === "MTS" ? C.emerald : C.violet,
    letterSpacing: "0.2px",
  }),
  summaryRow: {
    display: "flex",
    gap: 10,
    padding: "8px 16px",
    flexWrap: "wrap",
  },
  summaryChip: (color) => ({
    display: "flex",
    flexDirection: "column",
    gap: 1,
    padding: "6px 12px",
    borderRadius: 7,
    background:
      color === "violet"
        ? "rgba(124,58,237,0.06)"
        : color === "amber"
          ? "rgba(217,119,6,0.06)"
          : "rgba(5,150,105,0.06)",
    border: `1px solid ${color === "violet" ? "rgba(124,58,237,0.2)" : color === "amber" ? "rgba(217,119,6,0.2)" : "rgba(5,150,105,0.2)"}`,
    minWidth: 90,
  }),
  summaryChipLabel: {
    fontSize: 9,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: C.textMuted,
  },
  summaryChipValue: (color) => ({
    fontSize: 13,
    fontWeight: 700,
    color:
      color === "violet" ? C.violet : color === "amber" ? C.amber : C.emerald,
  }),
  budgetInput: {
    width: 88,
    background: "#faf5ff",
    border: `1px solid ${C.sectionMtoBorder}`,
    borderRadius: 5,
    padding: "3px 6px",
    fontSize: 11,
    color: C.text,
    textAlign: "right",
    outline: "none",
  },
};

// ─── METRIC CARD ─────────────────────────────────────────────────────────────
function MetricCard({ label, value, color, accent }) {
  return (
    <div
      style={{
        ...S.metricCard,
        borderTop: `2px solid ${accent || C.borderLight}`,
      }}
    >
      <div style={S.metricLabel}>{label}</div>
      <div style={{ ...S.metricValue, color: color || C.text }}>{value}</div>
    </div>
  );
}

// ─── SCROLLABLE TABLE WRAPPER ─────────────────────────────────────────────────
function ScrollTable({ header, body, footer, minWidth = 900 }) {
  return (
    <div style={{ ...S.tableWrap }}>
      <table
        style={{
          ...S.table,
          minWidth,
          borderCollapse: "separate",
          borderSpacing: 0,
        }}
      >
        <thead>{header}</thead>
        <tbody>{body}</tbody>
        {footer && <tfoot>{footer}</tfoot>}
      </table>
    </div>
  );
}

// ─── DESCRIPTION CELL ────────────────────────────────────────────────────────
function DescCell({ text, width = 200 }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const onEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({ top: rect.bottom + 4, left: rect.left });
    setHovered(true);
  };

  return (
    <td
      ref={ref}
      style={{
        ...S.td,
        ...S.tdLeft,
        maxWidth: width,
        minWidth: 140,
        position: "relative",
      }}
      onMouseEnter={onEnter}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          lineHeight: 1.4,
          color: C.textDim,
          fontSize: 11,
        }}
      >
        {text || "—"}
      </div>
      {hovered && text && text.length > 80 && (
        <div
          style={{
            position: "fixed",
            top: pos.top,
            left: Math.min(pos.left, window.innerWidth - 320),
            zIndex: 9999,
            background: C.text,
            color: "#fff",
            fontSize: 11,
            lineHeight: 1.5,
            padding: "8px 12px",
            borderRadius: 8,
            maxWidth: 300,
            boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
            pointerEvents: "none",
          }}
        >
          {text}
        </div>
      )}
    </td>
  );
}

// ─── MATERIAL COST MODAL ──────────────────────────────────────────────────────
function MaterialCostModal({ title, items, onClose, isActual, oaNo, fgCode }) {
  const [budgetEdits, setBudgetEdits] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [mtsOpen, setMtsOpen] = useState(true);
  const [mtoOpen, setMtoOpen] = useState(true);

  const mtsItems = isActual ? items.filter((i) => i.mC_Type === "MTS") : [];

  // MTO: sort so missing-cost items appear at top
  const mtoNeedsBudget = (item) => {
    const c = Number(item.cost);
    return (
      item.cost == null || item.cost === "" || c === 0 || Math.abs(c) < 0.01
    );
  };

  const rawMtoItems = isActual ? items.filter((i) => i.mC_Type === "MTO") : [];
  const mtoItems = useMemo(() => {
    const missing = rawMtoItems.filter(mtoNeedsBudget);
    const present = rawMtoItems.filter((i) => !mtoNeedsBudget(i));
    return [...missing, ...present];
  }, [rawMtoItems]);

  const hasIncomplete = items.some((i) => i.cost == null || i.cost === "");

  const handleBudgetChange = (id, val) =>
    setBudgetEdits((prev) => ({ ...prev, [id]: val }));

  const hasEditedMTO = Object.keys(budgetEdits).length > 0;

  const handleSaveBudgets = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      const mtoEdited = mtoItems
        .filter(
          (item) =>
            mtoNeedsBudget(item) &&
            budgetEdits[item.actual_Cost_Id] !== undefined &&
            budgetEdits[item.actual_Cost_Id] !== "",
        )
        .map((item) => ({
          actual_Cost_Id: item.actual_Cost_Id,
          budgeted_Cost: Number(budgetEdits[item.actual_Cost_Id]),
        }));

      if (mtoEdited.length > 0) {
        await ProjectProfitabilityService.UpdateBudgetedCosts({
          items: mtoEdited,
        });
        setSaveMsg("✓ Budgeted costs saved");
      }
    } catch (e) {
      setSaveMsg("⚠ Failed to save");
      console.error(e);
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(""), 3000);
    }
  };

  // MTS total: raw cost only, no budget fallback
  const mtsTotal = mtsItems.reduce((s, i) => s + Number(i.cost ?? 0), 0);

  // MTO total: cost takes priority; use budgeted_Cost (or edited value) as fallback when cost is missing/zero
  const mtoTotal = mtoItems.reduce((s, i) => {
    const id = i.actual_Cost_Id;
    const edited = budgetEdits[id];
    const c = Number(i.cost);
    const isMissing = mtoNeedsBudget(i);
    const v = isMissing
      ? edited !== undefined && edited !== ""
        ? Number(edited)
        : Number(i.budgeted_Cost ?? 0)
      : c;
    return s + v;
  }, 0);

  const SummaryChip = ({ label, value, color }) => (
    <div style={S.summaryChip(color)}>
      <span style={S.summaryChipLabel}>{label}</span>
      <span style={S.summaryChipValue(color)}>{value}</span>
    </div>
  );

  // MTS: cost-only table
  const renderMTSTable = () => (
    <div style={{ padding: "0 16px 10px", overflowX: "auto" }}>
      <table style={{ ...S.table, minWidth: "unset", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ ...S.th(), ...S.thLeft, position: "sticky", top: 0 }}>
              Material
            </th>
            <th style={{ ...S.th(C.emerald), position: "sticky", top: 0 }}>
              Cost (₹)
            </th>
          </tr>
        </thead>
        <tbody>
          {mtsItems.map((item, li) => {
            const c = Number(item.cost);
            const missing = item.cost == null || item.cost === "";
            return (
              <tr
                key={item.actual_Cost_Id ?? li}
                style={{
                  background: missing
                    ? C.redCell
                    : li % 2 === 0
                      ? C.surface
                      : C.surfaceAlt,
                }}
              >
                <td
                  style={{
                    ...S.td,
                    ...S.tdLeft,
                    fontWeight: 600,
                    maxWidth: 280,
                  }}
                >
                  {item.material_Name}
                </td>
                <td
                  style={{
                    ...S.td,
                    color: missing ? C.rose : C.text,
                    fontWeight: missing ? 700 : 400,
                  }}
                >
                  {missing ? (
                    <span style={S.redCell}>Missing</span>
                  ) : (
                    `₹${fmt(c)}`
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr style={S.totalRow}>
            <td style={{ ...S.totalTd(), ...S.tdLeft }}>Total</td>
            <td style={{ ...S.totalTd(), color: C.emerald }}>
              ₹{fmt(mtsTotal)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );

  // MTO: cost column + budgeted cost input column (editable when cost is null/0), missing rows at top
  const renderMTOTable = () => (
    <div style={{ padding: "0 16px 10px", overflowX: "auto" }}>
      <table style={{ ...S.table, minWidth: "unset", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ ...S.th(), ...S.thLeft, position: "sticky", top: 0 }}>
              Material
            </th>
            <th style={{ ...S.th(C.violet), position: "sticky", top: 0 }}>
              Cost (₹)
            </th>
            <th style={{ ...S.th(C.amber), position: "sticky", top: 0 }}>
              Budgeted Cost (₹)
            </th>
          </tr>
        </thead>
        <tbody>
          {mtoItems.map((item, li) => {
            const missing = mtoNeedsBudget(item);
            return (
              <tr
                key={item.actual_Cost_Id ?? li}
                style={{
                  background: missing
                    ? C.redCell
                    : li % 2 === 0
                      ? C.surface
                      : C.surfaceAlt,
                }}
              >
                <td
                  style={{
                    ...S.td,
                    ...S.tdLeft,
                    fontWeight: 600,
                    maxWidth: 260,
                  }}
                >
                  {item.material_Name}
                  {missing && (
                    <span
                      style={{
                        marginLeft: 6,
                        fontSize: 9,
                        fontWeight: 700,
                        color: C.rose,
                        background: "rgba(225,29,72,0.10)",
                        border: `1px solid rgba(225,29,72,0.25)`,
                        borderRadius: 4,
                        padding: "1px 5px",
                        verticalAlign: "middle",
                      }}
                    >
                      NEEDS BUDGET
                    </span>
                  )}
                </td>
                <td
                  style={{
                    ...S.td,
                    color: missing ? C.rose : C.text,
                    fontWeight: missing ? 700 : 400,
                  }}
                >
                  {missing ? (
                    <span style={S.redCell}>Not Available</span>
                  ) : (
                    `₹${fmt(item.cost)}`
                  )}
                </td>
                <td style={S.td}>
                  {missing ? (
                    <input
                      type="number"
                      min={0}
                      style={S.budgetInput}
                      value={
                        budgetEdits[item.actual_Cost_Id] !== undefined
                          ? budgetEdits[item.actual_Cost_Id]
                          : (item.budgeted_Cost ?? "")
                      }
                      placeholder="Enter budget"
                      onChange={(e) =>
                        handleBudgetChange(item.actual_Cost_Id, e.target.value)
                      }
                    />
                  ) : (
                    <span style={{ color: C.textMuted, fontSize: 11 }}>—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr style={S.totalRow}>
            <td style={{ ...S.totalTd(), ...S.tdLeft }}>Total</td>
            <td style={{ ...S.totalTd(), color: C.violet }}>
              ₹{fmt(mtoTotal)}
            </td>
            <td style={S.totalTd()}></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );

  const showMTOFooter = isActual && mtoItems.length > 0;

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={S.modalHeader}>
          <div>
            <div style={S.modalTitle}>{title}</div>
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 1 }}>
              {isActual
                ? "Actual material breakdown"
                : "Estimated material breakdown"}
            </div>
          </div>
          <button style={S.modalClose} onClick={onClose}>
            ×
          </button>
        </div>

        {hasIncomplete && (
          <div style={{ padding: "8px 16px 0", flexShrink: 0 }}>
            <div
              style={{
                background: "#fff1f2",
                border: "1px solid #fda4af",
                borderRadius: 7,
                padding: "6px 10px",
                fontSize: 11,
                color: C.rose,
              }}
            >
              ⚠ Some material costs are missing or incomplete.
            </div>
          </div>
        )}

        <div style={S.modalBody}>
          {isActual ? (
            <div style={{ paddingBottom: 4 }}>
              {/* ── MTS SECTION ── */}
              {mtsItems.length > 0 && (
                <>
                  <div
                    style={S.sectionHeader("MTS")}
                    onClick={() => setMtsOpen((v) => !v)}
                  >
                    <span style={S.sectionTitle("MTS")}>
                      🟢 MTS — Make to Stock
                    </span>
                    <span style={S.badge("green")}>
                      {mtsItems.length} item{mtsItems.length !== 1 ? "s" : ""}
                    </span>
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: 13,
                        color: C.emerald,
                      }}
                    >
                      {mtsOpen ? "▲" : "▼"}
                    </span>
                  </div>
                  {mtsOpen && (
                    <>
                      <div style={S.summaryRow}>
                        <SummaryChip
                          label="Total"
                          value={`₹${fmt(mtsTotal)}`}
                          color="green"
                        />
                        <SummaryChip
                          label="Items"
                          value={mtsItems.length}
                          color="green"
                        />
                        <SummaryChip
                          label="Incomplete"
                          value={
                            mtsItems.filter(
                              (i) => i.cost == null || i.cost === "",
                            ).length
                          }
                          color={
                            mtsItems.filter(
                              (i) => i.cost == null || i.cost === "",
                            ).length > 0
                              ? "amber"
                              : "green"
                          }
                        />
                      </div>
                      {renderMTSTable()}
                    </>
                  )}
                </>
              )}

              {/* ── MTO SECTION ── */}
              {mtoItems.length > 0 && (
                <>
                  <div
                    style={{
                      ...S.sectionHeader("MTO"),
                      marginTop: mtsItems.length > 0 ? 6 : 0,
                    }}
                    onClick={() => setMtoOpen((v) => !v)}
                  >
                    <span style={S.sectionTitle("MTO")}>
                      🟣 MTO — Make to Order
                    </span>
                    <span style={S.badge("violet")}>
                      {mtoItems.length} item{mtoItems.length !== 1 ? "s" : ""}
                    </span>
                    {mtoItems.some((i) => mtoNeedsBudget(i)) && (
                      <span style={{ ...S.badge("red"), marginLeft: 6 }}>
                        Has Incomplete
                      </span>
                    )}
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: 13,
                        color: C.violet,
                      }}
                    >
                      {mtoOpen ? "▲" : "▼"}
                    </span>
                  </div>
                  {mtoOpen && (
                    <>
                      <div style={S.summaryRow}>
                        <SummaryChip
                          label="Total"
                          value={`₹${fmt(mtoTotal)}`}
                          color="violet"
                        />
                        <SummaryChip
                          label="Items"
                          value={mtoItems.length}
                          color="violet"
                        />
                        <SummaryChip
                          label="Needs Budget"
                          value={mtoItems.filter(mtoNeedsBudget).length}
                          color={
                            mtoItems.filter(mtoNeedsBudget).length > 0
                              ? "amber"
                              : "violet"
                          }
                        />
                      </div>
                      {renderMTOTable()}
                    </>
                  )}
                </>
              )}

              {mtsItems.length === 0 && mtoItems.length === 0 && (
                <div style={{ padding: "14px 16px" }}>
                  <p style={{ color: C.textMuted, fontSize: 13 }}>
                    No items found.
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Estimated: flat table */
            <div style={{ padding: "14px 16px" }}>
              <table style={{ ...S.table, minWidth: "unset" }}>
                <thead>
                  <tr>
                    <th style={{ ...S.th(), ...S.thLeft }}>Material</th>
                    <th style={S.th()}>Cost (₹)</th>
                    <th style={{ ...S.th(), textAlign: "center" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => {
                    const missingCost = item.cost == null || item.cost === "";
                    const hasBudgeted =
                      item.budgeted_Cost != null && item.budgeted_Cost !== "";
                    const displayCost = missingCost
                      ? hasBudgeted
                        ? item.budgeted_Cost
                        : null
                      : item.cost;
                    return (
                      <tr
                        key={i}
                        style={{
                          background: missingCost
                            ? C.redCell
                            : i % 2 === 0
                              ? C.surface
                              : C.surfaceAlt,
                        }}
                      >
                        <td style={{ ...S.td, ...S.tdLeft, fontWeight: 600 }}>
                          {item.material_Name}
                        </td>
                        <td
                          style={{
                            ...S.td,
                            color: missingCost ? C.rose : C.text,
                            fontWeight: missingCost ? 700 : 400,
                          }}
                        >
                          {displayCost != null ? (
                            `₹${fmt(displayCost)}`
                          ) : (
                            <span style={S.redCell}>Missing</span>
                          )}
                        </td>
                        <td style={{ ...S.td, textAlign: "center" }}>
                          {missingCost ? (
                            <span style={S.badge("red")}>Incomplete</span>
                          ) : (
                            <span style={S.badge("green")}>OK</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={S.totalRow}>
                    <td style={{ ...S.totalTd(), ...S.tdLeft }}>Total</td>
                    <td style={S.totalTd()}>
                      ₹
                      {fmt(
                        items.reduce((s, i) => {
                          const v =
                            i.cost == null || i.cost === ""
                              ? (i.budgeted_Cost ?? 0)
                              : (i.cost ?? 0);
                          return s + Number(v);
                        }, 0),
                      )}
                    </td>
                    <td style={S.totalTd()}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* Fixed footer with Save button — only shown for Actual MTO */}
        {showMTOFooter && (
          <div style={S.modalFooter}>
            <button
              style={S.btn("emerald")}
              onClick={handleSaveBudgets}
              disabled={saving || !hasEditedMTO}
            >
              {saving ? "Saving…" : "💾 Save Budgeted Costs"}
            </button>
            {saveMsg && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: saveMsg.startsWith("✓") ? C.emerald : C.rose,
                }}
              >
                {saveMsg}
              </span>
            )}
            <span
              style={{
                fontSize: 10,
                color: C.textMuted,
                marginLeft: "auto",
              }}
            >
              Editable only when cost is null or zero · Missing items shown at
              top
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ACTUAL PROFITABILITY TAB ─────────────────────────────────────────────────
function ActualTab({ project, rows, inputs, setInput, onShowMaterial }) {
  const totals = useMemo(() => {
    let actSales = 0,
      actMat = 0,
      foc = 0,
      tp = 0,
      estMat = 0,
      estTp = 0,
      commission = 0,
      freight = 0,
      packing = 0,
      ovc = 0,
      otherDirect = 0,
      totalOVC = 0,
      contribution = 0,
      fixedCost = 0,
      opProfit = 0;
    rows.forEach((row) => {
      const c = calcActRow(row, inputs[row.detail_Id]);
      const e = calcEstRow(row);
      actSales += c.actSales;
      actMat += c.actMatCost;
      foc += c.foc;
      tp += c.throughput;
      estMat += e.estMatCost;
      estTp += e.throughput;
      commission += c.commission;
      freight += c.freight;
      packing += c.packing;
      ovc += c.ovc;
      otherDirect += c.otherDirect;
      totalOVC += c.totalOVC;
      contribution += c.contribution;
      fixedCost += c.fixedCost;
      opProfit += c.opProfit;
    });
    return {
      actSales,
      actMat,
      foc,
      tp,
      estMat,
      estTp,
      commission,
      freight,
      packing,
      ovc,
      otherDirect,
      totalOVC,
      contribution,
      fixedCost,
      opProfit,
    };
  }, [rows, inputs]);

  const setVal = (rowId, field, val) => setInput(rowId, field, val);
  const inp = (row, field) => (
    <input
      type="number"
      min={0}
      style={S.numInput}
      value={inputs[row.detail_Id]?.[field] ?? ""}
      placeholder="0"
      onChange={(e) => setVal(row.detail_Id, field, e.target.value)}
    />
  );

  const thS = (color) => ({
    ...S.th(color),
    borderBottom: `2px solid ${color || C.borderLight}`,
  });

  const headerRow = (
    <tr>
      {["Project", "OA No", "FG Code"].map((h, i) => (
        <th key={i} style={{ ...thS(C.textMuted), ...S.thLeft }}>
          {h}
        </th>
      ))}
      <th style={{ ...thS(C.textMuted), ...S.thLeft, minWidth: 160 }}>
        Description
      </th>
      <th style={thS(C.textMuted)}>Qty</th>
      <th style={thS(C.cyan)}>Act. Sales (₹)</th>
      <th style={thS(C.violet)}>Act. Mat. (₹)</th>
      <th style={thS(C.textMuted)}>FOC (₹)</th>
      <th style={thS(C.sky)}>Throughput (₹)</th>
      <th style={thS(C.amber)}>Est. Mat. (₹)</th>
      <th style={thS(C.amber)}>Est. TP (₹)</th>
      <th style={thS(C.violet)}>Commission</th>
      <th style={thS(C.violet)}>Freight</th>
      <th style={thS(C.violet)}>Packing</th>
      <th style={thS(C.violet)}>Other OVC</th>
      <th style={thS(C.violet)}>Other Direct</th>
      <th style={thS(C.violet)}>Total OVC (₹)</th>
      <th style={thS(C.emerald)}>Contribution (₹)</th>
      <th style={thS(C.amber)}>Fixed Cost</th>
      <th style={thS(C.cyan)}>Op. Profit (₹)</th>
    </tr>
  );

  const footerRow = (
    <tr style={S.totalRow}>
      <td colSpan={4} style={{ ...S.totalTd(), ...S.tdLeft }}>
        🔢 Grand Total
      </td>
      <td style={S.totalTd()}></td>
      <td style={S.totalTd()}>₹{fmt(totals.actSales)}</td>
      <td style={S.totalTd()}>₹{fmt(totals.actMat)}</td>
      <td style={S.totalTd()}>₹{fmt(totals.foc)}</td>
      <td style={{ ...S.totalTd(), color: totals.tp < 0 ? C.rose : C.sky }}>
        ₹{fmt(totals.tp)}
      </td>
      <td style={S.totalTd()}>₹{fmt(totals.estMat)}</td>
      <td
        style={{ ...S.totalTd(), color: totals.estTp < 0 ? C.rose : C.amber }}
      >
        ₹{fmt(totals.estTp)}
      </td>
      <td style={S.totalTd()}>₹{fmt(totals.commission)}</td>
      <td style={S.totalTd()}>₹{fmt(totals.freight)}</td>
      <td style={S.totalTd()}>₹{fmt(totals.packing)}</td>
      <td style={S.totalTd()}>₹{fmt(totals.ovc)}</td>
      <td style={S.totalTd()}>₹{fmt(totals.otherDirect)}</td>
      <td style={{ ...S.totalTd(), color: C.violet }}>
        ₹{fmt(totals.totalOVC)}
      </td>
      <td style={S.totalTd(totals.contribution >= 0)}>
        ₹{fmt(totals.contribution)}
      </td>
      <td style={S.totalTd()}>₹{fmt(totals.fixedCost)}</td>
      <td style={S.totalTd(totals.opProfit >= 0)}>₹{fmt(totals.opProfit)}</td>
    </tr>
  );

  return (
    <>
      <div style={S.metricGrid(6)}>
        <MetricCard
          label="Act. Sales"
          value={`₹${fmt(totals.actSales)}`}
          accent={C.cyan}
        />
        <MetricCard
          label="Throughput"
          value={`₹${fmt(totals.tp)}`}
          accent={totals.tp >= 0 ? C.sky : C.rose}
          color={totals.tp >= 0 ? C.sky : C.rose}
        />
        <MetricCard
          label="Total OVC"
          value={`₹${fmt(totals.totalOVC)}`}
          accent={C.violet}
          color={C.violet}
        />
        <MetricCard
          label="Contribution"
          value={`₹${fmt(totals.contribution)}`}
          accent={totals.contribution >= 0 ? C.emerald : C.rose}
          color={totals.contribution >= 0 ? C.emerald : C.rose}
        />
        <MetricCard
          label="Fixed Cost"
          value={`₹${fmt(totals.fixedCost)}`}
          accent={C.amber}
          color={C.amber}
        />
        <MetricCard
          label="Op. Profit"
          value={`₹${fmt(totals.opProfit)}`}
          accent={totals.opProfit >= 0 ? C.emerald : C.rose}
          color={totals.opProfit >= 0 ? C.emerald : C.rose}
        />
      </div>
      <div style={{ ...S.tableWrap }}>
        <table
          style={{
            ...S.table,
            minWidth: 1400,
            borderCollapse: "separate",
            borderSpacing: 0,
          }}
        >
          <thead>{headerRow}</thead>
          <tbody>
            {rows.map((row, ri) => {
              const c = calcActRow(row, inputs[row.detail_Id]);
              const e = calcEstRow(row);
              const actHasIssue = row._actMatIncomplete;
              const estHasIssue = row._estMatIncomplete;
              return (
                <tr
                  key={row.detail_Id ?? ri}
                  style={{
                    background: ri % 2 === 0 ? C.surface : C.surfaceAlt,
                  }}
                  onMouseEnter={(ev) =>
                    (ev.currentTarget.style.background = C.surfaceHover)
                  }
                  onMouseLeave={(ev) =>
                    (ev.currentTarget.style.background =
                      ri % 2 === 0 ? C.surface : C.surfaceAlt)
                  }
                >
                  <td
                    style={{
                      ...S.td,
                      ...S.tdLeft,
                      fontWeight: 600,
                      fontSize: 11,
                      color: C.cyan,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {row.project}
                  </td>
                  <td
                    style={{
                      ...S.td,
                      ...S.tdLeft,
                      color: C.amber,
                      fontWeight: 600,
                      fontSize: 11,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {row.oa_No}
                  </td>
                  <td
                    style={{
                      ...S.td,
                      ...S.tdLeft,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {row.fg_Code}
                  </td>
                  <DescCell text={row.description} width={200} />
                  <td style={S.td}>{row.qty ?? 1}</td>
                  <td style={{ ...S.td, fontWeight: 600 }}>
                    ₹{fmt(c.actSales)}
                  </td>
                  {/* Act. Mat. cell — red background on entire cell if MTO has unresolvable missing */}
                  <td
                    style={{
                      ...S.td,
                      background: actHasIssue
                        ? "rgba(225,29,72,0.06)"
                        : undefined,
                    }}
                  >
                    <span
                      style={{
                        ...(actHasIssue ? S.redCell : {}),
                        ...S.clickableCell,
                        color: actHasIssue ? C.rose : C.violet,
                        fontWeight: 600,
                      }}
                      title="Click to view actual material breakdown"
                      onClick={() => onShowMaterial(row, true)}
                    >
                      ₹{fmt(c.actMatCost)}
                    </span>
                  </td>
                  <td style={{ ...S.td, color: C.textMuted }}>₹{fmt(c.foc)}</td>
                  <td
                    style={{
                      ...S.td,
                      fontWeight: 700,
                      color: c.throughput < 0 ? C.rose : C.sky,
                      background:
                        c.throughput < 0 ? "rgba(225,29,72,0.04)" : undefined,
                    }}
                  >
                    ₹{fmt(c.throughput)}
                  </td>
                  <td style={S.td}>
                    <span
                      style={{
                        ...(estHasIssue ? S.redCell : {}),
                        ...S.clickableCell,
                        color: estHasIssue ? C.rose : C.amber,
                        fontWeight: 600,
                      }}
                      title="Click to view estimated material breakdown"
                      onClick={() => onShowMaterial(row, false)}
                    >
                      ₹{fmt(e.estMatCost)}
                    </span>
                  </td>
                  <td
                    style={{
                      ...S.td,
                      fontWeight: 700,
                      color: e.throughput < 0 ? C.rose : C.amber,
                      background:
                        e.throughput < 0 ? "rgba(225,29,72,0.04)" : undefined,
                    }}
                  >
                    ₹{fmt(e.throughput)}
                  </td>
                  <td style={S.td}>{inp(row, "commission")}</td>
                  <td style={S.td}>{inp(row, "freight")}</td>
                  <td style={S.td}>{inp(row, "packing")}</td>
                  <td style={S.td}>{inp(row, "ovc")}</td>
                  <td style={S.td}>{inp(row, "other_Direct")}</td>
                  <td style={{ ...S.td, color: C.violet, fontWeight: 700 }}>
                    ₹{fmt(c.totalOVC)}
                  </td>
                  <td
                    style={{
                      ...S.td,
                      fontWeight: 700,
                      color: c.contribution >= 0 ? C.emerald : C.rose,
                    }}
                  >
                    ₹{fmt(c.contribution)}
                  </td>
                  <td style={S.td}>{inp(row, "fixed_Cost")}</td>
                  <td
                    style={{
                      ...S.td,
                      fontWeight: 700,
                      color: c.opProfit >= 0 ? C.cyan : C.rose,
                      background:
                        c.opProfit >= 0
                          ? "rgba(2,132,199,0.04)"
                          : "rgba(225,29,72,0.04)",
                    }}
                  >
                    ₹{fmt(c.opProfit)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>{footerRow}</tfoot>
        </table>
      </div>
    </>
  );
}

// ─── EST VS ACTUAL TAB ────────────────────────────────────────────────────────
function EstVsActTab({ rows, inputs, onShowEstMat, onShowActMat }) {
  const thS = (color) => ({
    ...S.th(color),
    borderBottom: `2px solid ${color || C.borderLight}`,
  });

  const totals = useMemo(() => {
    let actSales = 0,
      estMat = 0,
      actMat = 0,
      matVar = 0,
      estTP = 0,
      actTP = 0,
      tpVar = 0,
      contribution = 0,
      opProfit = 0;
    rows.forEach((row) => {
      const estC = calcEstRow(row);
      const actC = calcActRow(row, inputs[row.detail_Id]);
      const mv = estC.estMatCost - actC.actMatCost;
      const tv = actC.throughput - estC.throughput;
      actSales += actC.actSales;
      estMat += estC.estMatCost;
      actMat += actC.actMatCost;
      matVar += mv;
      estTP += estC.throughput;
      actTP += actC.throughput;
      tpVar += tv;
      contribution += actC.contribution;
      opProfit += actC.opProfit;
    });
    return {
      actSales,
      estMat,
      actMat,
      matVar,
      estTP,
      actTP,
      tpVar,
      contribution,
      opProfit,
    };
  }, [rows, inputs]);

  return (
    <>
      <div style={S.metricGrid(5)}>
        <MetricCard
          label="Act. Sales"
          value={`₹${fmt(totals.actSales)}`}
          accent={C.cyan}
        />
        <MetricCard
          label="Mat. Variance"
          value={`₹${fmt(totals.matVar)}`}
          accent={totals.matVar >= 0 ? C.emerald : C.rose}
          color={totals.matVar >= 0 ? C.emerald : C.rose}
        />
        <MetricCard
          label="TP Variance"
          value={`₹${fmt(totals.tpVar)}`}
          accent={totals.tpVar >= 0 ? C.emerald : C.rose}
          color={totals.tpVar >= 0 ? C.emerald : C.rose}
        />
        <MetricCard
          label="Contribution"
          value={`₹${fmt(totals.contribution)}`}
          accent={totals.contribution >= 0 ? C.emerald : C.rose}
          color={totals.contribution >= 0 ? C.emerald : C.rose}
        />
        <MetricCard
          label="Op. Profit"
          value={`₹${fmt(totals.opProfit)}`}
          accent={totals.opProfit >= 0 ? C.emerald : C.rose}
          color={totals.opProfit >= 0 ? C.emerald : C.rose}
        />
      </div>
      <div style={S.tableWrap}>
        <table
          style={{
            ...S.table,
            minWidth: 1100,
            borderCollapse: "separate",
            borderSpacing: 0,
          }}
        >
          <thead>
            <tr>
              {["Project", "OA No", "FG Code"].map((h, i) => (
                <th key={i} style={{ ...thS(C.textMuted), ...S.thLeft }}>
                  {h}
                </th>
              ))}
              <th style={{ ...thS(C.textMuted), ...S.thLeft, minWidth: 160 }}>
                Description
              </th>
              <th style={thS(C.cyan)}>Act. Sales (₹)</th>
              <th style={thS(C.violet)}>Est. Mat. (₹)</th>
              <th style={thS(C.violet)}>Act. Mat. (₹)</th>
              <th style={thS(C.amber)}>Mat. Var (₹)</th>
              <th style={thS(C.sky)}>Est. TP (₹)</th>
              <th style={thS(C.sky)}>Act. TP (₹)</th>
              <th style={thS(C.amber)}>TP Var (₹)</th>
              <th style={thS(C.emerald)}>Contribution (₹)</th>
              <th style={thS(C.cyan)}>Op. Profit (₹)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => {
              const estC = calcEstRow(row);
              const actC = calcActRow(row, inputs[row.detail_Id]);
              const matVar = estC.estMatCost - actC.actMatCost;
              const tpVar = actC.throughput - estC.throughput;
              const estHasIssue = row._estMatIncomplete;
              const actHasIssue = row._actMatIncomplete;
              return (
                <tr
                  key={row.detail_Id ?? ri}
                  style={{
                    background: ri % 2 === 0 ? C.surface : C.surfaceAlt,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = C.surfaceHover)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      ri % 2 === 0 ? C.surface : C.surfaceAlt)
                  }
                >
                  <td
                    style={{
                      ...S.td,
                      ...S.tdLeft,
                      fontWeight: 600,
                      fontSize: 11,
                      color: C.cyan,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {row.project}
                  </td>
                  <td
                    style={{
                      ...S.td,
                      ...S.tdLeft,
                      color: C.amber,
                      fontWeight: 600,
                      fontSize: 11,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {row.oa_No}
                  </td>
                  <td
                    style={{
                      ...S.td,
                      ...S.tdLeft,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {row.fg_Code}
                  </td>
                  <DescCell text={row.description} width={200} />
                  <td style={{ ...S.td, fontWeight: 600 }}>
                    ₹{fmt(actC.actSales)}
                  </td>
                  <td style={S.td}>
                    <span
                      style={{
                        ...(estHasIssue ? S.redCell : {}),
                        ...S.clickableCell,
                        color: estHasIssue ? C.rose : C.violet,
                        fontWeight: 600,
                      }}
                      onClick={() => onShowEstMat(row)}
                    >
                      ₹{fmt(estC.estMatCost)}
                    </span>
                  </td>
                  <td
                    style={{
                      ...S.td,
                      background: actHasIssue
                        ? "rgba(225,29,72,0.06)"
                        : undefined,
                    }}
                  >
                    <span
                      style={{
                        ...(actHasIssue ? S.redCell : {}),
                        ...S.clickableCell,
                        color: actHasIssue ? C.rose : C.violet,
                        fontWeight: 600,
                      }}
                      onClick={() => onShowActMat(row)}
                    >
                      ₹{fmt(actC.actMatCost)}
                    </span>
                  </td>
                  <td
                    style={{
                      ...S.td,
                      fontWeight: 700,
                      color: matVar >= 0 ? C.emerald : C.rose,
                    }}
                  >
                    {matVar >= 0 ? "+" : ""}₹{fmt(matVar)}
                  </td>
                  <td
                    style={{
                      ...S.td,
                      fontWeight: 700,
                      color: estC.throughput < 0 ? C.rose : C.sky,
                    }}
                  >
                    ₹{fmt(estC.throughput)}
                  </td>
                  <td
                    style={{
                      ...S.td,
                      fontWeight: 700,
                      color: actC.throughput < 0 ? C.rose : C.sky,
                    }}
                  >
                    ₹{fmt(actC.throughput)}
                  </td>
                  <td
                    style={{
                      ...S.td,
                      fontWeight: 700,
                      color: tpVar >= 0 ? C.emerald : C.rose,
                    }}
                  >
                    {tpVar >= 0 ? "+" : ""}₹{fmt(tpVar)}
                  </td>
                  <td
                    style={{
                      ...S.td,
                      fontWeight: 700,
                      color: actC.contribution >= 0 ? C.emerald : C.rose,
                    }}
                  >
                    ₹{fmt(actC.contribution)}
                  </td>
                  <td
                    style={{
                      ...S.td,
                      fontWeight: 700,
                      color: actC.opProfit >= 0 ? C.cyan : C.rose,
                    }}
                  >
                    ₹{fmt(actC.opProfit)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={S.totalRow}>
              <td colSpan={4} style={{ ...S.totalTd(), ...S.tdLeft }}>
                🔢 Grand Total
              </td>
              <td style={S.totalTd()}>₹{fmt(totals.actSales)}</td>
              <td style={S.totalTd()}>₹{fmt(totals.estMat)}</td>
              <td style={S.totalTd()}>₹{fmt(totals.actMat)}</td>
              <td style={S.totalTd(totals.matVar >= 0)}>
                {totals.matVar >= 0 ? "+" : ""}₹{fmt(totals.matVar)}
              </td>
              <td
                style={{
                  ...S.totalTd(),
                  color: totals.estTP < 0 ? C.rose : C.sky,
                }}
              >
                ₹{fmt(totals.estTP)}
              </td>
              <td
                style={{
                  ...S.totalTd(),
                  color: totals.actTP < 0 ? C.rose : C.sky,
                }}
              >
                ₹{fmt(totals.actTP)}
              </td>
              <td style={S.totalTd(totals.tpVar >= 0)}>
                {totals.tpVar >= 0 ? "+" : ""}₹{fmt(totals.tpVar)}
              </td>
              <td style={S.totalTd(totals.contribution >= 0)}>
                ₹{fmt(totals.contribution)}
              </td>
              <td style={S.totalTd(totals.opProfit >= 0)}>
                ₹{fmt(totals.opProfit)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}

// ─── VIEW SCREEN ──────────────────────────────────────────────────────────────
function ViewScreen({ pid, onNavigate, savedInputs, onSaveInputs }) {
  const [tab, setTab] = useState("actual");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [inputs, setInputsState] = useState(savedInputs[pid] || {});
  const [matModal, setMatModal] = useState(null);
  const [rawRows, setRawRows] = useState([]);

  useEffect(() => {
    setLoading(true);
    ProjectProfitabilityService.GetProjectDetails(pid)
      .then((res) => {
        if (res?.status_Code === 200) setRawRows(res.data || []);
        else setError("Failed to load project details.");
      })
      .catch(() => setError("Error loading project details."))
      .finally(() => setLoading(false));
  }, [pid]);

  const { enrichedRows: rows } = useMaterialCosts(rawRows);

  const setInput = useCallback((rowId, field, val) => {
    setInputsState((prev) => ({
      ...prev,
      [rowId]: { ...(prev[rowId] || {}), [field]: val },
    }));
  }, []);

  const handleSave = () => {
    onSaveInputs(pid, inputs);
    rows.forEach((row) => {
      const inp = inputs[row.detail_Id] || {};
      ProjectProfitabilityService.SaveProjectProfitability(
        row.detail_Id,
        inp.commission ?? 0,
        inp.freight ?? 0,
        inp.packing ?? 0,
        inp.ovc ?? 0,
        inp.other_Direct ?? 0,
        inp.fixed_Cost ?? 0,
        "current_user",
      ).catch(console.error);
    });
  };

  const handleShowMaterial = useCallback((row, isActual) => {
    const cachedItems = isActual ? row._actItems || [] : row._estItems || [];
    if (cachedItems.length > 0) {
      setMatModal({
        title: `${isActual ? "Actual" : "Estimated"} Materials — ${row.fg_Code} / ${row.oa_No}`,
        items: cachedItems,
        isActual,
        oaNo: row.oa_No,
        fgCode: row.fg_Code,
      });
      return;
    }
    ProjectProfitabilityService.GetMaterialCosts(row.oa_No, row.fg_Code)
      .then((res) => {
        if (res?.status_Code === 200) {
          const items = isActual
            ? res.data?.actualMaterials || []
            : res.data?.estimatedMaterials || [];
          setMatModal({
            title: `${isActual ? "Actual" : "Estimated"} Materials — ${row.fg_Code} / ${row.oa_No}`,
            items,
            isActual,
            oaNo: row.oa_No,
            fgCode: row.fg_Code,
          });
        }
      })
      .catch(console.error);
  }, []);

  if (loading)
    return (
      <div
        style={{ ...S.page, alignItems: "center", justifyContent: "center" }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>⏳</div>
          <div style={{ color: C.textMuted }}>Loading project details…</div>
        </div>
      </div>
    );
  if (error)
    return (
      <div
        style={{ ...S.page, alignItems: "center", justifyContent: "center" }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>⚠️</div>
          <div style={{ color: C.rose }}>{error}</div>
        </div>
      </div>
    );

  const tabs = [
    { key: "actual", label: "📈 Actual Profitability" },
    { key: "comparison", label: "⚖️ Est vs Actual" },
  ];

  return (
    <div style={S.page}>
      {matModal && (
        <MaterialCostModal
          title={matModal.title}
          items={matModal.items}
          isActual={matModal.isActual}
          oaNo={matModal.oaNo}
          fgCode={matModal.fgCode}
          onClose={() => setMatModal(null)}
        />
      )}
      <div style={S.pageHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            style={{ ...S.btn(), padding: "6px 10px" }}
            onClick={() => onNavigate("dashboard")}
          >
            ← Back
          </button>
          <div>
            <div style={S.pageTitle}>{pid}</div>
            <div style={S.pageSub}>Project profitability analysis</div>
          </div>
        </div>
        <button style={S.btn("primary")} onClick={handleSave}>
          💾 Save
        </button>
      </div>
      <div style={S.tabBar}>
        {tabs.map((t) => (
          <button
            key={t.key}
            style={S.tab(tab === t.key)}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === "actual" && (
        <ActualTab
          project={pid}
          rows={rows}
          inputs={inputs}
          setInput={setInput}
          onShowMaterial={handleShowMaterial}
        />
      )}
      {tab === "comparison" && (
        <EstVsActTab
          rows={rows}
          inputs={inputs}
          onShowEstMat={(row) => handleShowMaterial(row, false)}
          onShowActMat={(row) => handleShowMaterial(row, true)}
        />
      )}
    </div>
  );
}

// ─── CREATE SCREEN ────────────────────────────────────────────────────────────
function CreateScreen({ onNavigate, savedInputs, onSaveInputs, initialPid }) {
  const [pendingProjects, setPendingProjects] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [selectedPid, setSelectedPid] = useState(initialPid || "");
  const [projectSearch, setProjectSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [rawRows, setRawRows] = useState([]);
  const [loadingRows, setLoadingRows] = useState(false);
  const { enrichedRows: rows } = useMaterialCosts(rawRows);
  const [inputs, setInputsState] = useState(
    initialPid && savedInputs[initialPid]
      ? JSON.parse(JSON.stringify(savedInputs[initialPid]))
      : {},
  );
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("actual");
  const [matModal, setMatModal] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setLoadingList(true);
    ProjectProfitabilityService.GetPendingProjects()
      .then((res) => {
        if (res?.status_Code === 200) {
          const raw = Array.isArray(res.data) ? res.data : [];
          const normalized = raw.map((item) =>
            typeof item === "string" || typeof item === "number"
              ? { id: String(item), name: String(item) }
              : {
                  id: String(
                    item.project ?? item.projectName ?? item.id ?? item,
                  ),
                  name: String(
                    item.projectName ?? item.name ?? item.project ?? item,
                  ),
                },
          );
          setPendingProjects(normalized);
        }
      })
      .catch(console.error)
      .finally(() => setLoadingList(false));
  }, []);

  useEffect(() => {
    if (!selectedPid) {
      setRawRows([]);
      return;
    }
    setLoadingRows(true);
    ProjectProfitabilityService.GetProjectDetails(selectedPid)
      .then((res) => {
        if (res?.status_Code === 200) setRawRows(res.data || []);
        else setRawRows([]);
      })
      .catch(console.error)
      .finally(() => setLoadingRows(false));
    setInputsState(
      savedInputs[selectedPid]
        ? JSON.parse(JSON.stringify(savedInputs[selectedPid]))
        : {},
    );
  }, [selectedPid]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredProjects = useMemo(
    () =>
      pendingProjects.filter((p) =>
        p.name.toLowerCase().includes(projectSearch.toLowerCase()),
      ),
    [pendingProjects, projectSearch],
  );

  const setInput = useCallback((rowId, field, val) => {
    setInputsState((prev) => ({
      ...prev,
      [rowId]: { ...(prev[rowId] || {}), [field]: val },
    }));
  }, []);

  const handleSave = async () => {
    if (!selectedPid || rows.length === 0) return;
    setSaving(true);
    try {
      await Promise.all(
        rows.map((row) => {
          const inp = inputs[row.detail_Id] || {};
          return ProjectProfitabilityService.SaveProjectProfitability(
            row.detail_Id,
            inp.commission ?? 0,
            inp.freight ?? 0,
            inp.packing ?? 0,
            inp.ovc ?? 0,
            inp.other_Direct ?? 0,
            inp.fixed_Cost ?? 0,
            "current_user",
          );
        }),
      );
      onSaveInputs(selectedPid, inputs);
      onNavigate("view", selectedPid);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleShowMaterial = useCallback(async (row, isActual) => {
    try {
      const res = await ProjectProfitabilityService.GetMaterialCosts(
        row.oa_No,
        row.fg_Code,
      );
      if (res?.status_Code === 200) {
        const items = isActual
          ? res.data?.actualMaterials || []
          : res.data?.estimatedMaterials || [];
        setMatModal({
          title: `${isActual ? "Actual" : "Estimated"} Materials — ${row.fg_Code} / ${row.oa_No}`,
          items,
          isActual,
          oaNo: row.oa_No,
          fgCode: row.fg_Code,
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const tabs = [
    { key: "actual", label: "📈 Actual Profitability" },
    { key: "comparison", label: "⚖️ Est vs Actual" },
  ];

  return (
    <div style={S.page}>
      {matModal && (
        <MaterialCostModal
          title={matModal.title}
          items={matModal.items}
          isActual={matModal.isActual}
          oaNo={matModal.oaNo}
          fgCode={matModal.fgCode}
          onClose={() => setMatModal(null)}
        />
      )}
      <div style={S.pageHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            style={{ ...S.btn(), padding: "6px 10px" }}
            onClick={() => onNavigate("dashboard")}
          >
            ← Back
          </button>
          <div>
            <div style={S.pageTitle}>New Analysis</div>
            <div style={S.pageSub}>
              Select a project and enter variable costs
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: C.surface,
                border: `1px solid ${C.borderLight}`,
                borderRadius: 8,
                padding: "6px 11px",
                gap: 7,
                minWidth: 240,
                cursor: "text",
              }}
              onClick={() => setShowDropdown(true)}
            >
              <span style={{ fontSize: 13, color: C.textMuted }}>🔍</span>
              <input
                type="text"
                placeholder={
                  loadingList
                    ? "Loading projects…"
                    : selectedPid
                      ? selectedPid
                      : "Search & select project…"
                }
                value={projectSearch}
                onChange={(e) => {
                  setProjectSearch(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                style={{
                  border: "none",
                  outline: "none",
                  fontSize: 13,
                  color: C.text,
                  background: "transparent",
                  width: "100%",
                  minWidth: 160,
                }}
              />
              {selectedPid && (
                <span
                  style={{
                    fontSize: 11,
                    color: C.textMuted,
                    whiteSpace: "nowrap",
                  }}
                >
                  ✓ {selectedPid}
                </span>
              )}
            </div>
            {showDropdown && filteredProjects.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  zIndex: 200,
                  background: C.surface,
                  border: `1px solid ${C.borderLight}`,
                  borderRadius: 8,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  maxHeight: 240,
                  overflowY: "auto",
                  marginTop: 4,
                }}
              >
                {filteredProjects.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      padding: "8px 12px",
                      fontSize: 13,
                      cursor: "pointer",
                      background:
                        p.id === selectedPid
                          ? "rgba(2,132,199,0.08)"
                          : "transparent",
                      color: p.id === selectedPid ? C.cyan : C.text,
                      fontWeight: p.id === selectedPid ? 600 : 400,
                      borderBottom: `1px solid ${C.border}`,
                    }}
                    onMouseEnter={(e) => {
                      if (p.id !== selectedPid)
                        e.currentTarget.style.background = C.surfaceAlt;
                    }}
                    onMouseLeave={(e) => {
                      if (p.id !== selectedPid)
                        e.currentTarget.style.background = "transparent";
                    }}
                    onClick={() => {
                      setSelectedPid(p.id);
                      setProjectSearch("");
                      setShowDropdown(false);
                    }}
                  >
                    {p.name}
                  </div>
                ))}
              </div>
            )}
            {showDropdown && filteredProjects.length === 0 && projectSearch && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  zIndex: 200,
                  background: C.surface,
                  border: `1px solid ${C.borderLight}`,
                  borderRadius: 8,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  padding: "10px 12px",
                  marginTop: 4,
                  fontSize: 12,
                  color: C.textMuted,
                }}
              >
                No projects match "{projectSearch}"
              </div>
            )}
          </div>
          {selectedPid && rows.length > 0 && (
            <button
              style={S.btn("primary")}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving…" : "💾 Save & View"}
            </button>
          )}
        </div>
      </div>

      {!selectedPid && (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div style={{ fontSize: 40 }}>📊</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: C.textDim }}>
            Select a project to begin
          </div>
          <div style={{ fontSize: 12, color: C.textMuted }}>
            Search and choose from the dropdown above
          </div>
        </div>
      )}

      {selectedPid && loadingRows && (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div style={{ fontSize: 28 }}>⏳</div>
          <div style={{ color: C.textMuted, fontSize: 13 }}>
            Loading project details…
          </div>
        </div>
      )}

      {selectedPid && !loadingRows && rows.length > 0 && (
        <>
          <div style={S.tabBar}>
            {tabs.map((t) => (
              <button
                key={t.key}
                style={S.tab(tab === t.key)}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
          {tab === "actual" && (
            <ActualTab
              project={selectedPid}
              rows={rows}
              inputs={inputs}
              setInput={setInput}
              onShowMaterial={handleShowMaterial}
            />
          )}
          {tab === "comparison" && (
            <EstVsActTab
              rows={rows}
              inputs={inputs}
              onShowEstMat={(row) => handleShowMaterial(row, false)}
              onShowActMat={(row) => handleShowMaterial(row, true)}
            />
          )}
        </>
      )}
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function DashboardScreen({ onNavigate, savedInputs }) {
  const [projects, setProjects] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 20;

  useEffect(() => {
    setLoading(true);
    ProjectProfitabilityService.GetPaginatedProjects(
      search,
      page * PAGE_SIZE,
      PAGE_SIZE,
    )
      .then((res) => {
        if (res?.status_Code === 200) {
          const raw = res.data;
          if (!raw) {
            setProjects([]);
            setTotalRecords(0);
            return;
          }
          if (raw.projects && Array.isArray(raw.projects)) {
            setTotalRecords(raw.totalRecords ?? raw.projects.length);
            setProjects(
              raw.projects.map((item) => ({
                id: String(item.project),
                name: String(item.project),
                details: item.details || [],
              })),
            );
            return;
          }
          let items = Array.isArray(raw)
            ? raw
            : (raw.data ?? raw.items ?? Object.values(raw));
          setTotalRecords(items.length);
          setProjects(
            items.map((item) => {
              if (typeof item === "string" || typeof item === "number")
                return { id: String(item), name: String(item), details: [] };
              const id =
                item.project ??
                item.projectName ??
                item.project_Id ??
                item.id ??
                String(item);
              const name =
                item.projectName ?? item.name ?? item.project_Name ?? id;
              return {
                id: String(id),
                name: String(name),
                details: item.details || [],
              };
            }),
          );
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, page]);

  const hasNextPage = page * PAGE_SIZE + projects.length < totalRecords;

  return (
    <div style={S.page}>
      <div style={S.pageHeader}>
        <div>
          <div style={S.pageTitle}>Projects Overview</div>
          <div style={S.pageSub}>
            Track profitability across all active projects
            {totalRecords > 0 && (
              <span style={{ marginLeft: 8, color: C.cyan, fontWeight: 600 }}>
                ({totalRecords} total)
              </span>
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search projects…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            style={{ ...S.select, minWidth: 200 }}
          />
        </div>
      </div>

      <div style={{ ...S.tableWrap }}>
        <table
          style={{ ...S.table, borderCollapse: "separate", borderSpacing: 0 }}
        >
          <thead>
            <tr>
              <th style={{ ...S.th(), ...S.thLeft }}>Project</th>
              <th style={{ ...S.th(), ...S.thLeft }}>Customer</th>
              <th style={S.th()}>Total Sales (₹)</th>
              <th style={S.th()}>Total Qty</th>
              <th style={{ ...S.th(), ...S.thLeft }}>PO No</th>
              <th style={S.th()}>Status</th>
              <th style={S.th()}></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    ...S.td,
                    textAlign: "center",
                    color: C.textMuted,
                    padding: 40,
                  }}
                >
                  Loading…
                </td>
              </tr>
            ) : projects.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    ...S.td,
                    textAlign: "center",
                    color: C.textMuted,
                    padding: 40,
                  }}
                >
                  No projects found
                </td>
              </tr>
            ) : (
              projects.map((proj) => {
                const totalSales = proj.details.reduce(
                  (s, d) => s + Number(d.sales_Value ?? 0),
                  0,
                );
                const totalQty = proj.details.reduce(
                  (s, d) => s + Number(d.qty ?? 0),
                  0,
                );
                const customers = [
                  ...new Set(
                    proj.details.map((d) => d.customer).filter(Boolean),
                  ),
                ];
                const poNos = [
                  ...new Set(proj.details.map((d) => d.pO_NO).filter(Boolean)),
                ];
                return (
                  <tr
                    key={proj.id}
                    style={{ background: C.surface }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = C.surfaceHover)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = C.surface)
                    }
                  >
                    <td
                      style={{
                        ...S.td,
                        ...S.tdLeft,
                        fontWeight: 700,
                        color: C.text,
                      }}
                    >
                      {proj.name}
                    </td>
                    <td
                      style={{
                        ...S.td,
                        ...S.tdLeft,
                        fontSize: 11,
                        color: C.textDim,
                        maxWidth: 180,
                      }}
                    >
                      <div
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {customers.length > 0 ? customers[0] : "—"}
                        {customers.length > 1 && (
                          <span style={{ color: C.textMuted }}>
                            {" "}
                            +{customers.length - 1}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ ...S.td, fontWeight: 600, color: C.cyan }}>
                      {totalSales > 0 ? `₹${fmt(totalSales)}` : "—"}
                    </td>
                    <td style={{ ...S.td, color: C.textDim }}>
                      {totalQty > 0 ? totalQty : "—"}
                    </td>
                    <td
                      style={{
                        ...S.td,
                        ...S.tdLeft,
                        fontSize: 11,
                        color: C.textMuted,
                        maxWidth: 140,
                      }}
                    >
                      <div
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {poNos.length > 0 ? poNos[0] : "—"}
                        {poNos.length > 1 && <span> +{poNos.length - 1}</span>}
                      </div>
                    </td>
                    <td style={S.td}>
                      <span
                        style={S.badge(
                          savedInputs[proj.id] ? "green" : "amber",
                        )}
                      >
                        {savedInputs[proj.id] ? "Analysed" : "Pending"}
                      </span>
                    </td>
                    <td
                      style={{
                        ...S.td,
                        display: "flex",
                        gap: 5,
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        style={S.btn()}
                        onClick={() => onNavigate("view", proj.id)}
                      >
                        View →
                      </button>
                      <button
                        style={S.btn("primary")}
                        onClick={() => onNavigate("create", proj.id)}
                      >
                        + Analyse
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!loading && (projects.length > 0 || page > 0) && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            marginTop: 12,
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <button
            style={S.btn()}
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Prev
          </button>
          <span style={{ color: C.textMuted, fontSize: 12 }}>
            Page {page + 1}
            {totalRecords > 0 && ` of ${Math.ceil(totalRecords / PAGE_SIZE)}`}
          </span>
          <button
            style={S.btn()}
            disabled={!hasNextPage}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
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
          <div style={S.logoBadge}>P</div>
          Project Profitability
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            style={{
              ...S.btn(screen === "dashboard" ? "primary" : "ghost"),
              padding: "5px 12px",
              fontSize: 12,
            }}
            onClick={() => navigate("dashboard")}
          >
            Dashboard
          </button>
        </div>
      </nav>
      {screen === "dashboard" && (
        <DashboardScreen onNavigate={navigate} savedInputs={savedInputs} />
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
      {screen === "view" && (
        <ViewScreen
          key={activePid}
          pid={activePid}
          onNavigate={navigate}
          savedInputs={savedInputs}
          onSaveInputs={handleSave}
        />
      )}
    </div>
  );
}
