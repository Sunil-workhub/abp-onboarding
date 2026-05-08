import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import ProjectProfitabilityService from "./services/projectProfitability/ProjectProfitabilityService";

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

function calcActRow(row, pctInputs) {
  const actSales = Number(row.sales_Value ?? 0);
  const actMatCost = Number(row.act_Mat_Cost ?? 0);
  const foc = Number(row.mat_Cost_FOC ?? 0);
  const commission = (actSales * Number(pctInputs?.commission ?? 0)) / 100;
  const freight = (actSales * Number(pctInputs?.freight ?? 0)) / 100;
  const packing = (actSales * Number(pctInputs?.packing ?? 0)) / 100;
  const ovc = (actSales * Number(pctInputs?.ovc ?? 0)) / 100;
  const otherDirect = (actSales * Number(pctInputs?.other_Direct ?? 0)) / 100;
  const fixedCost = (actSales * Number(pctInputs?.fixed_Cost ?? 0)) / 100;
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
    width: "min(1100px, 96vw)",
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
  targetInput: {
    width: 88,
    background: "#f0f9ff",
    border: "1px solid #bae6fd",
    borderRadius: 5,
    padding: "3px 6px",
    fontSize: 11,
    color: C.text,
    textAlign: "right",
    outline: "none",
  },
};

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
// Changes:
// 1. MTO items with missing/null cost sorted to TOP
// 2. Target Cost input ONLY available for missing-cost items (same rows where Design Est. input shows)
function MaterialCostModal({ title, items, onClose, isActual, oaNo, fgCode }) {
  const [budgetEdits, setBudgetEdits] = useState({});
  const [targetEdits, setTargetEdits] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [activeTab, setActiveTab] = useState("detailed");
  const [detailTab, setDetailTab] = useState("MTS");

  const mtsItems = isActual ? items.filter((i) => i.mC_Type === "MTS") : [];
  const mtoItems = isActual ? items.filter((i) => i.mC_Type === "MTO") : [];

  const mtoNeedsBudget = (item) => {
    const c = Number(item.cost);
    return (
      item.cost == null || item.cost === "" || c === 0 || Math.abs(c) < 0.01
    );
  };

  // CHANGE 1: Sort MTO items — missing cost first, then items with cost
  const sortedMtoItems = useMemo(() => {
    return [...mtoItems].sort((a, b) => {
      const aMissing = mtoNeedsBudget(a) ? 0 : 1;
      const bMissing = mtoNeedsBudget(b) ? 0 : 1;
      return aMissing - bMissing;
    });
  }, [mtoItems]);

  const mtoNeedsBudgetItems = mtoItems.filter(mtoNeedsBudget);

  const mtsTotal = mtsItems.reduce((s, i) => s + Number(i.cost ?? 0), 0);
  const mtoTotal = sortedMtoItems.reduce((s, i) => {
    const id = i.actual_Cost_Id;
    const c = Number(i.cost);
    const isMissing = mtoNeedsBudget(i);
    const budgeted =
      budgetEdits[id] !== undefined
        ? Number(budgetEdits[id])
        : Number(i.budgeted_Cost ?? 0);
    return s + (isMissing ? budgeted : c);
  }, 0);

  const categoryMap = useMemo(() => {
    const map = {};
    items.forEach((item) => {
      const cat = item.category || "Uncategorized";
      if (!map[cat])
        map[cat] = {
          cost: 0,
          designEst: 0,
          targetCost: 0,
          needsBudget: 0,
          count: 0,
        };
      const c = Number(item.cost ?? 0);
      const id = item.actual_Cost_Id ?? item.estimated_Cost_Id;
      const tgt =
        targetEdits[id] !== undefined
          ? Number(targetEdits[id])
          : Number(item.targeted_Cost ?? 0);
      const isMissing = isActual ? mtoNeedsBudget(item) : false;
      map[cat].cost += c;
      map[cat].designEst += Number(item.budgeted_Cost ?? 0);
      map[cat].targetCost += tgt;
      if (isMissing) map[cat].needsBudget++;
      map[cat].count++;
    });
    return map;
  }, [items, targetEdits]);

  const handleSaveBudgets = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      // CHANGE 2: Only save rows with Design Est. input (missing cost items)
      const budgetRows = sortedMtoItems
        .filter(
          (item) =>
            mtoNeedsBudget(item) &&
            budgetEdits[item.actual_Cost_Id] !== undefined &&
            budgetEdits[item.actual_Cost_Id] !== "",
        )
        .map((item) => ({
          actual_Cost_Id: item.actual_Cost_Id,
          budgeted_Cost: Number(budgetEdits[item.actual_Cost_Id]),
          targeted_Cost:
            targetEdits[item.actual_Cost_Id] !== undefined
              ? Number(targetEdits[item.actual_Cost_Id])
              : (item.targeted_Cost ?? 0),
        }));
      if (budgetRows.length > 0) {
        await ProjectProfitabilityService.UpdateBudgetedCosts({
          items: budgetRows,
        });
        setSaveMsg("✓ Saved successfully");
      }
    } catch (e) {
      setSaveMsg("⚠ Failed to save");
      console.error(e);
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(""), 3000);
    }
  };

  const TopTabBtn = ({ tabKey, label, summary }) => (
    <button
      onClick={() => setActiveTab(tabKey)}
      style={{
        padding: "7px 16px",
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        border: "none",
        outline: "none",
        background:
          activeTab === tabKey
            ? `linear-gradient(135deg,${C.cyan},${C.violet})`
            : "transparent",
        color: activeTab === tabKey ? "#fff" : C.textMuted,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 1,
        transition: "all 0.15s",
      }}
    >
      <span>{label}</span>
      {summary && (
        <span
          style={{
            fontSize: 10,
            opacity: 0.85,
            fontWeight: 400,
            whiteSpace: "nowrap",
          }}
        >
          {summary}
        </span>
      )}
    </button>
  );

  const DetailTabCard = ({
    tabKey,
    label,
    count,
    total,
    needsBudget,
    color,
  }) => (
    <div
      onClick={() => setDetailTab(tabKey)}
      style={{
        padding: "8px 14px",
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        border: `1px solid ${detailTab === tabKey ? color : C.borderLight}`,
        background:
          detailTab === tabKey
            ? color === C.emerald
              ? "rgba(5,150,105,0.08)"
              : "rgba(124,58,237,0.08)"
            : C.surface,
        color: detailTab === tabKey ? color : C.textMuted,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        minWidth: 160,
        transition: "all 0.15s",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 6,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <span>{label}</span>
        <span style={S.badge(tabKey === "MTS" ? "green" : "violet")}>
          {count} items
        </span>
        {needsBudget > 0 && (
          <span style={S.badge("red")}>{needsBudget} need budget</span>
        )}
      </div>
      <span style={{ fontSize: 11, color: C.textMuted, fontWeight: 400 }}>
        Total: ₹{fmt(total)}
      </span>
    </div>
  );

  // CHANGE 1 + 2: Use sortedMtoItems, Target Cost input only for missing rows
  const renderMaterialTable = (tableItems, isMTO) => {
    const hasMissingItems = isMTO && mtoNeedsBudgetItems.length > 0;
    return (
      <div style={{ overflowX: "auto", padding: "0 16px 12px" }}>
        {/* {hasMissingItems && (
          <div
            style={{
              margin: "10px 0 8px",
              padding: "7px 12px",
              background: "rgba(225,29,72,0.06)",
              border: `1px solid ${C.redBorder}`,
              borderRadius: 7,
              fontSize: 11,
              color: C.rose,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>⚠️</span>
            <span>
              {mtoNeedsBudgetItems.length} item
              {mtoNeedsBudgetItems.length > 1 ? "s" : ""} with missing cost
              shown at top — fill in Design Est. Cost &amp; Target Cost to
              proceed
            </span>
          </div>
        )} */}
        <table style={{ ...S.table, minWidth: "unset", width: "100%" }}>
          <thead>
            <tr>
              <th
                style={{ ...S.th(), ...S.thLeft, position: "sticky", top: 0 }}
              >
                Material
              </th>
              <th
                style={{
                  ...S.th(C.textMuted),
                  position: "sticky",
                  top: 0,
                  minWidth: 100,
                }}
              >
                Category
              </th>
              <th
                style={{
                  ...S.th(isMTO ? C.violet : C.emerald),
                  position: "sticky",
                  top: 0,
                }}
              >
                Cost (₹)
              </th>
              {isMTO && (
                <th style={{ ...S.th(C.amber), position: "sticky", top: 0 }}>
                  Design Est. Cost (₹)
                </th>
              )}
              {/* CHANGE 2: Target Cost column only in MTO — and input only for missing rows */}
              {isMTO && (
                <th style={{ ...S.th(C.sky), position: "sticky", top: 0 }}>
                  Target Cost (₹)
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {tableItems.map((item, li) => {
              const id = item.actual_Cost_Id ?? item.estimated_Cost_Id;
              const missing = isMTO ? mtoNeedsBudget(item) : false;
              const prevItem = li > 0 ? tableItems[li - 1] : null;
              const prevMissing = prevItem
                ? isMTO
                  ? mtoNeedsBudget(prevItem)
                  : false
                : false;
              const showDivider = isMTO && li > 0 && prevMissing && !missing;
              const colCount = isMTO ? 5 : 4;
              return (
                <>
                  {showDivider && (
                    <tr key={`divider-${li}`}>
                      <td
                        colSpan={colCount}
                        style={{
                          padding: "5px 10px",
                          background: "rgba(203,213,225,0.25)",
                          borderBottom: `1px solid ${C.border}`,
                          borderTop: `2px solid ${C.borderLight}`,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: C.textMuted,
                            letterSpacing: "0.5px",
                            textTransform: "uppercase",
                          }}
                        >
                          ✓ Items with cost available
                        </span>
                      </td>
                    </tr>
                  )}
                  <tr
                    key={id ?? li}
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
                            border: "1px solid rgba(225,29,72,0.25)",
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
                        fontSize: 11,
                        color: C.textMuted,
                        textAlign: "left",
                      }}
                    >
                      {item.category || "—"}
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
                    {isMTO && (
                      <td style={S.td}>
                        {missing ? (
                          <input
                            type="number"
                            min={0}
                            style={S.budgetInput}
                            value={
                              budgetEdits[id] !== undefined
                                ? budgetEdits[id]
                                : (item.budgeted_Cost ?? "")
                            }
                            placeholder="Enter"
                            onChange={(e) =>
                              setBudgetEdits((p) => ({
                                ...p,
                                [id]: e.target.value,
                              }))
                            }
                          />
                        ) : (
                          <span style={{ color: C.textMuted, fontSize: 11 }}>
                            {item.budgeted_Cost
                              ? `₹${fmt(item.budgeted_Cost)}`
                              : "—"}
                          </span>
                        )}
                      </td>
                    )}
                    {/* CHANGE 2: Target Cost input ONLY for missing rows; read-only dash for others */}
                    {isMTO && (
                      <td style={S.td}>
                        {missing ? (
                          <input
                            type="number"
                            min={0}
                            style={S.targetInput}
                            value={
                              targetEdits[id] !== undefined
                                ? targetEdits[id]
                                : (item.targeted_Cost ?? "")
                            }
                            placeholder="Enter"
                            onChange={(e) =>
                              setTargetEdits((p) => ({
                                ...p,
                                [id]: e.target.value,
                              }))
                            }
                          />
                        ) : (
                          <span style={{ color: C.textMuted, fontSize: 11 }}>
                            {item.targeted_Cost
                              ? `₹${fmt(item.targeted_Cost)}`
                              : "—"}
                          </span>
                        )}
                      </td>
                    )}
                  </tr>
                </>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={S.totalRow}>
              <td style={{ ...S.totalTd(), ...S.tdLeft }} colSpan={2}>
                Total
              </td>
              <td
                style={{ ...S.totalTd(), color: isMTO ? C.violet : C.emerald }}
              >
                ₹
                {fmt(
                  tableItems.reduce((s, i) => {
                    const id = i.actual_Cost_Id ?? i.estimated_Cost_Id;
                    const c = Number(i.cost ?? 0);
                    const isMissing = isMTO ? mtoNeedsBudget(i) : false;
                    const bud =
                      budgetEdits[id] !== undefined
                        ? Number(budgetEdits[id])
                        : Number(i.budgeted_Cost ?? 0);
                    return s + (isMissing ? bud : c);
                  }, 0),
                )}
              </td>
              {isMTO && <td style={S.totalTd()}>—</td>}
              {isMTO && <td style={S.totalTd()}>—</td>}
            </tr>
          </tfoot>
        </table>
      </div>
    );
  };

  const renderEstimatedTable = () => (
    <div style={{ padding: "14px 16px" }}>
      <table style={{ ...S.table, minWidth: "unset" }}>
        <thead>
          <tr>
            <th style={{ ...S.th(), ...S.thLeft }}>Material</th>
            <th style={{ ...S.th(C.textMuted) }}>Category</th>
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
                    fontSize: 11,
                    color: C.textMuted,
                    textAlign: "left",
                  }}
                >
                  {item.category || "—"}
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
            <td style={{ ...S.totalTd(), ...S.tdLeft }} colSpan={2}>
              Total
            </td>
            <td style={S.totalTd()}>
              ₹
              {fmt(
                items.reduce(
                  (s, i) =>
                    s +
                    Number(
                      i.cost == null || i.cost === ""
                        ? (i.budgeted_Cost ?? 0)
                        : (i.cost ?? 0),
                    ),
                  0,
                ),
              )}
            </td>
            <td style={S.totalTd()}></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );

  const renderSummary = () => {
    const categories = Object.entries(categoryMap);
    const grandCost = categories.reduce((s, [, d]) => s + d.cost, 0);
    const grandDesign = categories.reduce((s, [, d]) => s + d.designEst, 0);
    const grandTarget = categories.reduce((s, [, d]) => s + d.targetCost, 0);
    const grandNeedsBud = categories.reduce((s, [, d]) => s + d.needsBudget, 0);
    const grandCount = categories.reduce((s, [, d]) => s + d.count, 0);
    return (
      <div style={{ padding: "14px 16px", overflowX: "auto" }}>
        <table style={{ ...S.table, minWidth: "unset", width: "100%" }}>
          <thead>
            <tr>
              <th style={{ ...S.th(), ...S.thLeft }}>Category</th>
              <th style={S.th()}>Items</th>
              <th style={S.th(C.violet)}>Actual Cost (₹)</th>
              <th style={S.th(C.amber)}>Design Est. Cost (₹)</th>
              <th style={S.th(C.sky)}>Target Cost (₹)</th>
              <th style={S.th(C.rose)}>Needs Budget</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(([cat, d], i) => (
              <tr
                key={cat}
                style={{ background: i % 2 === 0 ? C.surface : C.surfaceAlt }}
              >
                <td style={{ ...S.td, ...S.tdLeft, fontWeight: 600 }}>{cat}</td>
                <td style={S.td}>{d.count}</td>
                <td style={{ ...S.td, fontWeight: 700, color: C.violet }}>
                  ₹{fmt(d.cost)}
                </td>
                <td style={{ ...S.td, color: C.amber }}>
                  {d.designEst > 0 ? `₹${fmt(d.designEst)}` : "—"}
                </td>
                <td style={{ ...S.td, color: C.sky }}>
                  {d.targetCost > 0 ? `₹${fmt(d.targetCost)}` : "—"}
                </td>
                <td
                  style={{
                    ...S.td,
                    color: d.needsBudget > 0 ? C.rose : C.emerald,
                    fontWeight: 700,
                  }}
                >
                  {d.needsBudget > 0 ? d.needsBudget : "—"}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={S.totalRow}>
              <td style={{ ...S.totalTd(), ...S.tdLeft }}>Total</td>
              <td style={S.totalTd()}>{grandCount}</td>
              <td style={{ ...S.totalTd(), color: C.violet }}>
                ₹{fmt(grandCost)}
              </td>
              <td style={{ ...S.totalTd(), color: C.amber }}>
                {grandDesign > 0 ? `₹${fmt(grandDesign)}` : "—"}
              </td>
              <td style={{ ...S.totalTd(), color: C.sky }}>
                {grandTarget > 0 ? `₹${fmt(grandTarget)}` : "—"}
              </td>
              <td
                style={{
                  ...S.totalTd(),
                  color: grandNeedsBud > 0 ? C.rose : C.emerald,
                }}
              >
                {grandNeedsBud > 0 ? grandNeedsBud : "—"}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  };

  const grandTotal = isActual
    ? mtsTotal + mtoTotal
    : items.reduce(
        (s, i) =>
          s +
          Number(
            i.cost == null || i.cost === ""
              ? (i.budgeted_Cost ?? 0)
              : (i.cost ?? 0),
          ),
        0,
      );
  const detailedSummaryLabel = isActual
    ? `MTS ₹${fmt(mtsTotal)} · MTO ₹${fmt(mtoTotal)}${mtoNeedsBudgetItems.length ? ` · ${mtoNeedsBudgetItems.length} need budget` : ""}`
    : `${items.length} items · ₹${fmt(grandTotal)}`;
  const summaryTabLabel = `₹${fmt(grandTotal)} · ${items.length} items`;

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={(e) => e.stopPropagation()}>
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
        <div
          style={{
            display: "flex",
            gap: 3,
            padding: "8px 16px 0",
            background: C.surface,
            borderBottom: `1px solid ${C.border}`,
            flexShrink: 0,
          }}
        >
          <TopTabBtn
            tabKey="detailed"
            label="📋 Detailed"
            summary={detailedSummaryLabel}
          />
          <TopTabBtn
            tabKey="summary"
            label="📊 Summary"
            summary={summaryTabLabel}
          />
        </div>
        <div style={S.modalBody}>
          {activeTab === "summary" && renderSummary()}
          {activeTab === "detailed" && !isActual && renderEstimatedTable()}
          {activeTab === "detailed" && isActual && (
            <div>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  padding: "12px 16px 8px",
                  flexShrink: 0,
                }}
              >
                <DetailTabCard
                  tabKey="MTS"
                  label="MTS — Make to Stock"
                  count={mtsItems.length}
                  total={mtsTotal}
                  color={C.emerald}
                />
                <DetailTabCard
                  tabKey="MTO"
                  label="MTO — Make to Order"
                  count={sortedMtoItems.length}
                  total={mtoTotal}
                  needsBudget={mtoNeedsBudgetItems.length}
                  color={C.violet}
                />
              </div>
              {detailTab === "MTS" && renderMaterialTable(mtsItems, false)}
              {detailTab === "MTO" && renderMaterialTable(sortedMtoItems, true)}
            </div>
          )}
        </div>
        {isActual && (
          <div style={S.modalFooter}>
            <button
              style={S.btn("emerald")}
              onClick={handleSaveBudgets}
              disabled={saving}
            >
              {saving ? "Saving…" : "💾 Save"}
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
              style={{ fontSize: 10, color: C.textMuted, marginLeft: "auto" }}
            >
              Design Est. Cost &amp; Target Cost editable only for MTO items
              missing actual cost
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PERCENTAGE INPUT PANEL — REDESIGNED ─────────────────────────────────────
// Compact pill-style locked view; clean grid edit view
const PCT_FIELDS = [
  { key: "commission", label: "Commission", icon: "💼" },
  { key: "freight", label: "Freight", icon: "🚚" },
  { key: "packing", label: "Packing", icon: "📦" },
  { key: "ovc", label: "Other OVC", icon: "📋" },
  { key: "other_Direct", label: "Other Direct", icon: "🔗" },
  { key: "fixed_Cost", label: "Fixed Cost", icon: "🏭" },
];

function PctPanel({ pctInputs, onChangePct, locked, onUnlock }) {
  if (locked) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 0,
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 9,
          padding: "0",
          marginBottom: 10,
          flexShrink: 0,
          overflow: "hidden",
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        {/* Left label strip */}
        <div
          style={{
            padding: "0 12px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            background:
              "linear-gradient(135deg, rgba(2,132,199,0.08), rgba(124,58,237,0.08))",
            borderRight: `1px solid ${C.border}`,
            flexShrink: 0,
            alignSelf: "stretch",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: 9,
              fontWeight: 800,
              color: C.cyan,
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              whiteSpace: "nowrap",
            }}
          >
            % of Sales
          </span>
        </div>
        {/* Fields row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            overflow: "hidden",
          }}
        >
          {PCT_FIELDS.map(({ key, label }, idx) => {
            const val = Number(pctInputs[key] ?? 0);
            const isNonZero = val > 0;
            return (
              <div
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "8px 14px",
                  borderRight:
                    idx < PCT_FIELDS.length - 1
                      ? `1px solid ${C.border}`
                      : "none",
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    color: C.textMuted,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    letterSpacing: "0.3px",
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: isNonZero ? C.text : C.textMuted,
                    background: isNonZero
                      ? "rgba(2,132,199,0.07)"
                      : "transparent",
                    border: isNonZero
                      ? `1px solid rgba(2,132,199,0.18)`
                      : "1px solid transparent",
                    borderRadius: 5,
                    padding: "1px 6px",
                    whiteSpace: "nowrap",
                    marginLeft: "auto",
                    flexShrink: 0,
                  }}
                >
                  {val.toFixed(2)}%
                </span>
              </div>
            );
          })}
        </div>
        {/* Edit button */}
        <div
          style={{
            padding: "6px 10px",
            borderLeft: `1px solid ${C.border}`,
            flexShrink: 0,
            alignSelf: "stretch",
            display: "flex",
            alignItems: "center",
          }}
        >
          <button
            style={{ ...S.btn("amber"), padding: "5px 11px", fontSize: 11 }}
            onClick={onUnlock}
          >
            ✏️ Edit %
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 9,
        marginBottom: 10,
        flexShrink: 0,
        overflow: "hidden",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      {/* Header bar */}
      <div
        style={{
          padding: "7px 14px",
          background:
            "linear-gradient(135deg, rgba(2,132,199,0.06), rgba(124,58,237,0.06))",
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: C.cyan,
            textTransform: "uppercase",
            letterSpacing: "0.7px",
          }}
        >
          Variable Cost % — Applied to Actual Sales
        </span>
        <span style={{ fontSize: 10, color: C.textMuted }}>
          Enter percentages below
        </span>
      </div>
      {/* Input grid */}
      <div
        style={{
          display: "flex",
          gap: 0,
          flexWrap: "nowrap",
          overflow: "hidden",
        }}
      >
        {PCT_FIELDS.map(({ key, label, icon }, idx) => (
          <div
            key={key}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 4,
              padding: "10px 12px",
              borderRight:
                idx < PCT_FIELDS.length - 1 ? `1px solid ${C.border}` : "none",
              background: C.surface,
              minWidth: 0,
            }}
          >
            <label
              style={{
                fontSize: 10,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.4px",
                color: C.textMuted,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {icon} {label}
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <input
                type="number"
                min={0}
                max={100}
                step={0.01}
                style={{
                  ...S.numInput,
                  width: "100%",
                  flex: 1,
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "4px 6px",
                  background: "#f8fafc",
                }}
                value={pctInputs[key] ?? ""}
                placeholder="0"
                onChange={(e) => onChangePct(key, e.target.value)}
              />
              <span
                style={{
                  fontSize: 11,
                  color: C.textMuted,
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                %
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ACTUAL PROFITABILITY TAB ──────────────────────────────────────────────────
function ActualTab({ project, rows, pctInputs, onShowMaterial }) {
  const totals = useMemo(() => {
    let actSales = 0,
      actMat = 0,
      foc = 0,
      tp = 0,
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
      const c = calcActRow(row, pctInputs);
      actSales += c.actSales;
      actMat += c.actMatCost;
      foc += c.foc;
      tp += c.throughput;
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
  }, [rows, pctInputs]);

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
      <th style={thS(C.violet)}>Commission (₹)</th>
      <th style={thS(C.violet)}>Freight (₹)</th>
      <th style={thS(C.violet)}>Packing (₹)</th>
      <th style={thS(C.violet)}>Other OVC (₹)</th>
      <th style={thS(C.violet)}>Other Direct (₹)</th>
      <th style={thS(C.violet)}>Total OVC (₹)</th>
      <th style={thS(C.emerald)}>Contribution (₹)</th>
      <th style={thS(C.amber)}>Fixed Cost (₹)</th>
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
            minWidth: 1300,
            borderCollapse: "separate",
            borderSpacing: 0,
          }}
        >
          <thead>{headerRow}</thead>
          <tbody>
            {rows.map((row, ri) => {
              const c = calcActRow(row, pctInputs);
              const actHasIssue = row._actMatIncomplete;
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
                  <td
                    style={{
                      background: actHasIssue
                        ? "rgba(225,29,72,0.06)"
                        : undefined,
                      ...S.td,
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
                  <td style={{ ...S.td, color: C.textDim }}>
                    ₹{fmt(c.commission)}
                  </td>
                  <td style={{ ...S.td, color: C.textDim }}>
                    ₹{fmt(c.freight)}
                  </td>
                  <td style={{ ...S.td, color: C.textDim }}>
                    ₹{fmt(c.packing)}
                  </td>
                  <td style={{ ...S.td, color: C.textDim }}>₹{fmt(c.ovc)}</td>
                  <td style={{ ...S.td, color: C.textDim }}>
                    ₹{fmt(c.otherDirect)}
                  </td>
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
                  <td style={{ ...S.td, color: C.textDim }}>
                    ₹{fmt(c.fixedCost)}
                  </td>
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
function EstVsActTab({ rows, pctInputs, onShowEstMat, onShowActMat }) {
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
      const actC = calcActRow(row, pctInputs);
      const mv = actC.actMatCost - estC.estMatCost;
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
  }, [rows, pctInputs]);

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
          accent={totals.matVar <= 0 ? C.emerald : C.rose}
          color={totals.matVar <= 0 ? C.emerald : C.rose}
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
              <th style={thS(C.amber)}>Est. Mat. (₹)</th>
              <th style={thS(C.amber)}>Est. TP (₹)</th>
              <th style={thS(C.violet)}>Act. Mat. (₹)</th>
              <th style={thS(C.sky)}>Act. TP (₹)</th>
              <th style={thS(C.rose)}>Mat. Var (₹)</th>
              <th style={thS(C.emerald)}>TP Var (₹)</th>
              <th style={thS(C.emerald)}>Contribution (₹)</th>
              <th style={thS(C.cyan)}>Op. Profit (₹)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => {
              const estC = calcEstRow(row);
              const actC = calcActRow(row, pctInputs);
              const matVar = actC.actMatCost - estC.estMatCost;
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
                        color: estHasIssue ? C.rose : C.amber,
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
                      fontWeight: 700,
                      color: estC.throughput < 0 ? C.rose : C.amber,
                    }}
                  >
                    ₹{fmt(estC.throughput)}
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
                      color: actC.throughput < 0 ? C.rose : C.sky,
                    }}
                  >
                    ₹{fmt(actC.throughput)}
                  </td>
                  <td
                    style={{
                      ...S.td,
                      fontWeight: 700,
                      color: matVar <= 0 ? C.emerald : C.rose,
                    }}
                  >
                    {matVar > 0 ? "+" : ""}₹{fmt(matVar)}
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
              <td
                style={{
                  ...S.totalTd(),
                  color: totals.estTP < 0 ? C.rose : C.amber,
                }}
              >
                ₹{fmt(totals.estTP)}
              </td>
              <td style={S.totalTd()}>₹{fmt(totals.actMat)}</td>
              <td
                style={{
                  ...S.totalTd(),
                  color: totals.actTP < 0 ? C.rose : C.sky,
                }}
              >
                ₹{fmt(totals.actTP)}
              </td>
              <td style={S.totalTd(totals.matVar <= 0)}>
                {totals.matVar > 0 ? "+" : ""}₹{fmt(totals.matVar)}
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
  const [tab, setTab] = useState("comparison");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pctInputs, setPctInputsState] = useState(savedInputs[pid]?.pct || {});
  const [pctLocked, setPctLocked] = useState(
    Object.keys(savedInputs[pid]?.pct || {}).length > 0,
  );
  const [matModal, setMatModal] = useState(null);
  const [rawRows, setRawRows] = useState([]);

  useEffect(() => {
    setLoading(true);
    ProjectProfitabilityService.GetProjectDetails(pid)
      .then((res) => {
        if (res?.status_Code === 200) {
          const rows = res.data || [];
          setRawRows(rows);
          if (Object.keys(pctInputs).length === 0 && rows.length > 0) {
            const r = rows[0];
            const loaded = {};
            PCT_FIELDS.forEach(({ key }) => {
              if (r[key] != null) loaded[key] = r[key];
            });
            if (Object.keys(loaded).length > 0) {
              setPctInputsState(loaded);
              setPctLocked(true);
            }
          }
        } else setError("Failed to load project details.");
      })
      .catch(() => setError("Error loading project details."))
      .finally(() => setLoading(false));
  }, [pid]);

  const { enrichedRows: rows } = useMaterialCosts(rawRows);
  const handleChangePct = useCallback((key, val) => {
    setPctInputsState((prev) => ({ ...prev, [key]: val }));
    setPctLocked(false);
  }, []);

  const handleSave = () => {
    onSaveInputs(pid, { pct: pctInputs });
    setPctLocked(true);
    rows.forEach((row) => {
      ProjectProfitabilityService.SaveProjectProfitability(
        row.detail_Id,
        pctInputs.commission ?? 0,
        pctInputs.freight ?? 0,
        pctInputs.packing ?? 0,
        pctInputs.ovc ?? 0,
        pctInputs.other_Direct ?? 0,
        pctInputs.fixed_Cost ?? 0,
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
    { key: "comparison", label: "⚖️ Est vs Actual" },
    { key: "actual", label: "📈 Actual Profitability" },
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
      <PctPanel
        pctInputs={pctInputs}
        onChangePct={handleChangePct}
        locked={pctLocked}
        onUnlock={() => setPctLocked(false)}
      />
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
          pctInputs={pctInputs}
          onShowMaterial={handleShowMaterial}
        />
      )}
      {tab === "comparison" && (
        <EstVsActTab
          rows={rows}
          pctInputs={pctInputs}
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
  const [pctInputs, setPctInputsState] = useState(
    initialPid && savedInputs[initialPid]?.pct
      ? { ...savedInputs[initialPid].pct }
      : {},
  );
  const [pctLocked, setPctLocked] = useState(
    initialPid
      ? Object.keys(savedInputs[initialPid]?.pct || {}).length > 0
      : false,
  );
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("comparison");
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
        if (res?.status_Code === 200) {
          const rows = res.data || [];
          setRawRows(rows);
          const saved = savedInputs[selectedPid]?.pct || {};
          if (Object.keys(saved).length > 0) {
            setPctInputsState({ ...saved });
            setPctLocked(true);
          } else if (rows.length > 0) {
            const r = rows[0];
            const loaded = {};
            PCT_FIELDS.forEach(({ key }) => {
              if (r[key] != null) loaded[key] = r[key];
            });
            if (Object.keys(loaded).length > 0) {
              setPctInputsState(loaded);
              setPctLocked(true);
            } else {
              setPctInputsState({});
              setPctLocked(false);
            }
          } else {
            setPctInputsState({});
            setPctLocked(false);
          }
        } else setRawRows([]);
      })
      .catch(console.error)
      .finally(() => setLoadingRows(false));
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
  const handleChangePct = useCallback((key, val) => {
    setPctInputsState((prev) => ({ ...prev, [key]: val }));
    setPctLocked(false);
  }, []);

  const handleSave = async () => {
    if (!selectedPid || rows.length === 0) return;
    setSaving(true);
    try {
      await Promise.all(
        rows.map((row) =>
          ProjectProfitabilityService.SaveProjectProfitability(
            row.detail_Id,
            pctInputs.commission ?? 0,
            pctInputs.freight ?? 0,
            pctInputs.packing ?? 0,
            pctInputs.ovc ?? 0,
            pctInputs.other_Direct ?? 0,
            pctInputs.fixed_Cost ?? 0,
            "current_user",
          ),
        ),
      );
      onSaveInputs(selectedPid, { pct: pctInputs });
      setPctLocked(true);
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
    { key: "comparison", label: "⚖️ Est vs Actual" },
    { key: "actual", label: "📈 Actual Profitability" },
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
          <PctPanel
            pctInputs={pctInputs}
            onChangePct={handleChangePct}
            locked={pctLocked}
            onUnlock={() => setPctLocked(false)}
          />
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
              pctInputs={pctInputs}
              onShowMaterial={handleShowMaterial}
            />
          )}
          {tab === "comparison" && (
            <EstVsActTab
              rows={rows}
              pctInputs={pctInputs}
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
              <th style={S.th(C.amber)}>Est. Throughput (₹)</th>
              <th style={S.th(C.sky)}>Act. Throughput (₹)</th>
              <th style={S.th(C.cyan)}>Op. Profit (₹)</th>
              <th style={S.th()}></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={9}
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
                  colSpan={9}
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
                const estThroughput = proj.details.reduce((s, d) => {
                  const sv = Number(d.sales_Value ?? 0);
                  const em = Number(d.total_Est_Material_Cost ?? 0);
                  return s + (sv - em);
                }, 0);
                const actThroughput = proj.details.reduce((s, d) => {
                  const sv = Number(d.sales_Value ?? 0);
                  const am = Number(d.total_Act_Material_Cost ?? 0);
                  return s + (sv - am);
                }, 0);
                const p = savedInputs[proj.id]?.pct || {};
                const opProfit = proj.details.reduce((s, d) => {
                  const sv = Number(d.sales_Value ?? 0);
                  const am = Number(d.total_Act_Material_Cost ?? 0);
                  const tp = sv - am;
                  const comm =
                    (sv * Number(p.commission ?? d.commission ?? 0)) / 100;
                  const fr = (sv * Number(p.freight ?? d.freight ?? 0)) / 100;
                  const pk = (sv * Number(p.packing ?? d.packing ?? 0)) / 100;
                  const ov = (sv * Number(p.ovc ?? d.ovc ?? 0)) / 100;
                  const od =
                    (sv * Number(p.other_Direct ?? d.other_Direct ?? 0)) / 100;
                  const fc =
                    (sv * Number(p.fixed_Cost ?? d.fixed_Cost ?? 0)) / 100;
                  return s + (tp - comm - fr - pk - ov - od - fc);
                }, 0);
                const tpColor =
                  actThroughput >= estThroughput ? C.emerald : C.rose;
                const tpBg =
                  actThroughput >= estThroughput
                    ? "rgba(5,150,105,0.06)"
                    : "rgba(225,29,72,0.06)";
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
                    <td style={{ ...S.td, fontWeight: 600, color: C.amber }}>
                      {estThroughput !== 0 ? `₹${fmt(estThroughput)}` : "—"}
                    </td>
                    <td
                      style={{
                        ...S.td,
                        fontWeight: 700,
                        color: tpColor,
                        background: tpBg,
                      }}
                    >
                      {actThroughput !== 0 ? `₹${fmt(actThroughput)}` : "—"}
                    </td>
                    <td
                      style={{
                        ...S.td,
                        fontWeight: 700,
                        color: opProfit >= 0 ? C.cyan : C.rose,
                      }}
                    >
                      {opProfit !== 0 ? `₹${fmt(opProfit)}` : "—"}
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
