import { useState, useRef } from "react";

// ─── DESIGN TOKENS (LIGHT MODE) ───────────────────────────────────────────────
const C = {
  bg: "#F1F5F9",
  card: "#FFFFFF",
  cardAlt: "#F8FAFC",
  sidebar: "#1E293B",
  sidebarText: "#94A3B8",
  teal: "#0F766E",
  tealLight: "#14B8A6",
  tealBg: "#CCFBF1",
  text: "#0F172A",
  textMid: "#475569",
  textLight: "#94A3B8",
  border: "#E2E8F0",
  borderMid: "#CBD5E1",
  amber: "#B45309",
  amberLight: "#D97706",
  amberBg: "#FEF3C7",
  success: "#065F46",
  successBg: "#D1FAE5",
  successBorder: "#6EE7B7",
  danger: "#B91C1C",
  dangerBg: "#FEE2E2",
  dangerBorder: "#FCA5A5",
  purple: "#6D28D9",
  purpleBg: "#EDE9FE",
  blue: "#1D4ED8",
  blueBg: "#DBEAFE",
};

const S = {
  app: {
    minHeight: "100vh",
    background: C.bg,
    fontFamily: "'Segoe UI','Helvetica Neue',sans-serif",
    color: C.text,
    display: "flex",
  },
  sidebar: {
    width: 220,
    background: C.sidebar,
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    zIndex: 50,
  },
  sidebarLogo: {
    padding: "20px 18px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
  },
  sidebarLogoTitle: {
    fontSize: 16,
    fontWeight: 800,
    color: "#F8FAFC",
    letterSpacing: 2,
  },
  sidebarLogoSub: {
    fontSize: 10,
    color: C.sidebarText,
    marginTop: 3,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  navItem: (a) => ({
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 18px",
    cursor: "pointer",
    background: a ? "#0F766E" : "transparent",
    borderLeft: a ? "3px solid #5EEAD4" : "3px solid transparent",
    color: a ? "#fff" : C.sidebarText,
    fontSize: 13,
    fontWeight: a ? 600 : 400,
  }),
  main: { marginLeft: 220, flex: 1, padding: "28px 34px", minHeight: "100vh" },
  pageHeader: {
    marginBottom: 22,
    paddingBottom: 16,
    borderBottom: `1px solid ${C.border}`,
  },
  pageTitle: { fontSize: 22, fontWeight: 800, color: C.text },
  pageSub: { fontSize: 13, color: C.textMid, marginTop: 4 },
  card: {
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    padding: 20,
    marginBottom: 16,
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  sT: {
    fontSize: 11,
    fontWeight: 700,
    color: C.teal,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 14,
    paddingBottom: 8,
    borderBottom: `1px solid ${C.border}`,
  },
  g2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  g3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 },
  g4: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 },
  fg: { display: "flex", flexDirection: "column", gap: 5, marginBottom: 12 },
  label: { fontSize: 11, fontWeight: 600, color: C.textMid },
  input: {
    background: C.cardAlt,
    border: `1px solid ${C.borderMid}`,
    borderRadius: 6,
    padding: "8px 11px",
    color: C.text,
    fontSize: 13,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  select: {
    background: C.cardAlt,
    border: `1px solid ${C.borderMid}`,
    borderRadius: 6,
    padding: "8px 11px",
    color: C.text,
    fontSize: 13,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  textarea: {
    background: C.cardAlt,
    border: `1px solid ${C.borderMid}`,
    borderRadius: 6,
    padding: "8px 11px",
    color: C.text,
    fontSize: 13,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    minHeight: 80,
    resize: "vertical",
    fontFamily: "inherit",
  },
  btnP: {
    background: C.teal,
    color: "#fff",
    border: "none",
    borderRadius: 7,
    padding: "9px 20px",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
  },
  btnS: {
    background: C.card,
    color: C.textMid,
    border: `1px solid ${C.border}`,
    borderRadius: 7,
    padding: "9px 20px",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
  },
  btnA: {
    background: C.amberLight,
    color: "#fff",
    border: "none",
    borderRadius: 7,
    padding: "9px 20px",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
  },
  btnD: {
    background: C.danger,
    color: "#fff",
    border: "none",
    borderRadius: 5,
    padding: "6px 12px",
    fontWeight: 600,
    fontSize: 12,
    cursor: "pointer",
  },
  btnSm: {
    background: C.tealBg,
    color: C.teal,
    border: `1px solid ${C.tealLight}`,
    borderRadius: 5,
    padding: "5px 12px",
    fontWeight: 600,
    fontSize: 11,
    cursor: "pointer",
  },
  badge: (t) => {
    const m = {
      green: [C.successBg, C.success, C.successBorder],
      amber: [C.amberBg, C.amber, "#FCD34D"],
      red: [C.dangerBg, C.danger, C.dangerBorder],
      teal: [C.tealBg, C.teal, C.tealLight],
      blue: [C.blueBg, C.blue, "#93C5FD"],
      purple: [C.purpleBg, C.purple, "#C4B5FD"],
    };
    const [bg, col, bdr] = m[t] || m.teal;
    return {
      display: "inline-flex",
      alignItems: "center",
      padding: "3px 9px",
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 700,
      background: bg,
      color: col,
      border: `1px solid ${bdr}`,
    };
  },
  th: {
    background: C.cardAlt,
    padding: "9px 12px",
    textAlign: "left",
    fontSize: 11,
    fontWeight: 700,
    color: C.textMid,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    borderBottom: `1px solid ${C.border}`,
  },
  td: {
    padding: "11px 12px",
    borderBottom: `1px solid ${C.border}`,
    color: C.text,
    fontSize: 13,
    verticalAlign: "middle",
  },
  div: { height: 1, background: C.border, margin: "12px 0" },
  ir: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: `1px solid ${C.border}`,
  },
};

// ─── SMALL HELPERS ────────────────────────────────────────────────────────────
function FG({ label, req, children }) {
  return (
    <div style={S.fg}>
      <label style={S.label}>
        {label}
        {req && <span style={{ color: C.amberLight }}> *</span>}
      </label>
      {children}
    </div>
  );
}
function FileAttach({ label = "Attach Document" }) {
  const ref = useRef();
  const [n, setN] = useState("");
  return (
    <div>
      <input
        type="file"
        ref={ref}
        style={{ display: "none" }}
        onChange={(e) => setN(e.target.files[0]?.name || "")}
      />
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "5px 11px",
          background: C.cardAlt,
          border: `1px dashed ${C.borderMid}`,
          borderRadius: 5,
          fontSize: 11,
          color: C.textLight,
          cursor: "pointer",
          marginTop: 5,
        }}
        onClick={() => ref.current.click()}
      >
        📎 {n || label}
      </div>
    </div>
  );
}
function Div() {
  return <div style={S.div} />;
}
function InfoRow({ label, value }) {
  return (
    <div style={S.ir}>
      <span style={{ fontSize: 12, color: C.textLight }}>{label}</span>
      <span
        style={{
          fontSize: 13,
          color: C.text,
          fontWeight: 600,
          textAlign: "right",
          maxWidth: "60%",
        }}
      >
        {value || "—"}
      </span>
    </div>
  );
}
function RatingStars({ value, onChange, size = 32 }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => onChange && onChange(n)}
          style={{
            width: size,
            height: size,
            borderRadius: 5,
            border: `2px solid ${value >= n ? C.tealLight : C.borderMid}`,
            background: value >= n ? C.teal : C.cardAlt,
            color: value >= n ? "#fff" : C.textLight,
            fontWeight: 800,
            fontSize: size * 0.37,
            cursor: onChange ? "pointer" : "default",
          }}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
function ProgressBar({ pct, color = C.teal }) {
  return (
    <div
      style={{
        height: 7,
        background: C.border,
        borderRadius: 4,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${pct}%`,
          background: color,
          borderRadius: 4,
          transition: "width 0.4s",
        }}
      />
    </div>
  );
}
function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: C.card,
          borderRadius: 12,
          padding: 28,
          width: 480,
          maxWidth: "95vw",
          boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 18,
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 700 }}>{title}</div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 20,
              cursor: "pointer",
              color: C.textLight,
            }}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

const RC = [
  "ABP Location",
  "Type of Industries Covered",
  "Products Representing",
  "Geographical Coverage",
  "Number of Retailers",
  "Team Size & Capability",
  "Service & Support Infrastructure",
  "Financial Viability",
];
const cy = new Date().getFullYear();
const FY = [0, 1, 2].map(
  (o) => `FY ${String(cy + o).slice(-2)}-${String(cy + o + 1).slice(-2)}`,
);

// ─── ASSESSMENT CARD (shared component for displaying a completed assessment) ─
function AssessmentCard({ role, data, color }) {
  if (!data) return null;
  const v = Object.values(data.ratings || {}).filter((x) => x > 0);
  const avg = v.length
    ? (v.reduce((a, b) => a + b, 0) / v.length).toFixed(1)
    : "—";
  return (
    <div
      style={{
        background: C.card,
        borderRadius: 10,
        padding: 18,
        border: `1px solid ${color}44`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 14, color }}>
          {role} Assessment
        </span>
        <span style={{ fontSize: 22, fontWeight: 800, color }}>
          {avg}
          <span style={{ fontSize: 11, color: C.textLight }}>/5</span>
        </span>
      </div>
      {RC.map((c) => (
        <div
          key={c}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 7,
          }}
        >
          <span style={{ fontSize: 11, color: C.textMid, flex: 1 }}>{c}</span>
          <div style={{ display: "flex", gap: 3 }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 2,
                  background: n <= (data.ratings?.[c] || 0) ? color : C.border,
                }}
              />
            ))}
          </div>
          <span
            style={{
              fontSize: 10,
              color: C.textLight,
              marginLeft: 8,
              minWidth: 30,
              textAlign: "right",
            }}
          >
            {data.ratings?.[c] ? `${data.ratings[c]}/5` : "—"}
          </span>
        </div>
      ))}
      <Div />
      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        {FY.map((fy) => (
          <div
            key={fy}
            style={{
              flex: 1,
              textAlign: "center",
              background: C.cardAlt,
              borderRadius: 6,
              padding: "8px 4px",
              border: `1px solid ${C.border}`,
            }}
          >
            <div style={{ fontSize: 9, color: C.textLight, marginBottom: 2 }}>
              {fy}
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color }}>
              {data.oi?.[fy] || "—"}
            </div>
          </div>
        ))}
      </div>
      {[
        ["Strengths", data.strengths],
        ["Weaknesses", data.weakness],
        ["Support Required", data.support],
      ].map(([k, val]) =>
        val ? (
          <div key={k} style={{ marginBottom: 8 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: C.textLight,
                marginBottom: 3,
              }}
            >
              {k.toUpperCase()}
            </div>
            <div style={{ fontSize: 12, color: C.textMid, lineHeight: 1.5 }}>
              {val}
            </div>
          </div>
        ) : null,
      )}
      <Div />
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: C.textLight,
          marginBottom: 4,
        }}
      >
        COMMENTS
      </div>
      <div style={{ fontSize: 12, color: C.text, lineHeight: 1.5 }}>
        {data.comments || "—"}
      </div>
    </div>
  );
}

const ROLE_COLOR = {
  RSM: C.teal,
  NSM: C.amberLight,
  "Sales Head": C.purple,
  CFO: C.danger,
  CEO: C.blue,
};
const ASSESS_FLOW = ["RSM", "NSM", "Sales Head", "CFO", "CEO"];

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ list, onNew, onView }) {
  const sc = (s) =>
    s === "Approved"
      ? "green"
      : s === "Rejected"
        ? "red"
        : s === "Pending CEO"
          ? "purple"
          : "teal";
  return (
    <div>
      <div style={S.pageHeader}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div>
            <div style={S.pageTitle}>ABP Onboarding Dashboard</div>
            <div style={S.pageSub}>
              Authorized Business Partner Management · RSM Portal
            </div>
          </div>
          <button style={S.btnP} onClick={onNew}>
            + New ABP Application
          </button>
        </div>
      </div>
      <div style={{ ...S.g4, marginBottom: 22 }}>
        {[
          ["📋", "Total Applications", list.length, C.teal],
          [
            "⏳",
            "In Assessment",
            list.filter((a) => !["Approved", "Rejected"].includes(a.status))
              .length,
            C.amberLight,
          ],
          [
            "✅",
            "MD Approved",
            list.filter((a) => a.status === "Approved").length,
            C.success,
          ],
          [
            "📅",
            "100-Day Active",
            list.filter((a) => a.status === "Approved").length,
            C.purple,
          ],
        ].map(([icon, label, val, color]) => (
          <div
            key={label}
            style={{
              ...S.card,
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 0,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: color + "18",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              {icon}
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color }}>{val}</div>
              <div style={{ fontSize: 12, color: C.textMid }}>{label}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={S.card}>
        <div style={S.sT}>All ABP Applications</div>
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
        >
          <thead>
            <tr>
              {[
                "#",
                "Firm Name",
                "Constitution",
                "City",
                "RSM",
                "Status",
                "Stage",
                "Action",
              ].map((h) => (
                <th key={h} style={S.th}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  style={{
                    ...S.td,
                    textAlign: "center",
                    padding: 48,
                    color: C.textLight,
                  }}
                >
                  No applications yet. Click "+ New ABP Application" to begin.
                </td>
              </tr>
            )}
            {list.map((a, i) => (
              <tr
                key={a.id}
                onClick={() => onView(a.id)}
                style={{ cursor: "pointer" }}
              >
                <td style={{ ...S.td, color: C.textLight }}>{i + 1}</td>
                <td style={{ ...S.td, fontWeight: 700 }}>
                  {a.firmName || "—"}
                </td>
                <td style={S.td}>{a.constitution || "—"}</td>
                <td style={S.td}>{a.officeCity || "—"}</td>
                <td style={S.td}>{a.rsmName || "—"}</td>
                <td style={S.td}>
                  <span style={S.badge(sc(a.status))}>{a.status}</span>
                </td>
                <td style={{ ...S.td, fontSize: 12, color: C.textMid }}>
                  {a.stage}
                </td>
                <td style={S.td}>
                  <button
                    style={S.btnSm}
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(a.id);
                    }}
                  >
                    View →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── ABP FORM ─────────────────────────────────────────────────────────────────
const emptyP = () => ({
  type: "Proprietor",
  name: "",
  tel: "",
  mobile: "",
  email: "",
  expCur: "",
  expPast: "",
  yearsInBiz: "",
  succession: "",
});
function ABPForm({ onSubmit, onCancel }) {
  const [step, setStep] = useState(0);
  const [f, setF] = useState({
    firmName: "",
    constitution: "",
    rsmName: "",
    rsmRegion: "",
    principals: [emptyP()],
    contact: {
      name: "",
      designation: "",
      expFirm: "",
      expTotal: "",
      tel: "",
      mobile: "",
      email: "",
    },
    officeAddress: "",
    officeCity: "",
    officeArea: "",
    godownAddress: "",
    godownCity: "",
    godownArea: "",
    serviceLocation: "",
    serviceArea: "",
    salesCount: "",
    salesAvgExp: "",
    bdCount: "",
    bdAvgExp: "",
    serviceCount: "",
    serviceAvgExp: "",
    salesPromo: "",
    toolsTackles: "",
    natureBusiness: "",
    productsDealt: "",
    industriesServed: "",
    keyCustomers: "",
    geoCoverage: "",
    distributorship: "",
    subDealers: "",
    firmNetworth: "",
    propNetworth: "",
    securedDebt: "",
    unsecuredDebt: "",
    panNo: "",
    gstNo: "",
    bankFacility: "",
    bankName: "",
    bankAddress: "",
    roi: "",
    creditRating: "",
    limitRenewalDate: "",
  });
  const u = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const uP = (i, k, v) => {
    const a = [...f.principals];
    a[i] = { ...a[i], [k]: v };
    setF((x) => ({ ...x, principals: a }));
  };
  const uC = (k, v) =>
    setF((x) => ({ ...x, contact: { ...x.contact, [k]: v } }));
  const canMulti = ["Partner", "Director"].includes(f.principals[0]?.type);
  const STEPS = [
    "Basic Info",
    "Principals",
    "Contact & Offices",
    "Team",
    "Business",
    "Financials",
  ];

  const renderStep = () => {
    if (step === 0)
      return (
        <div>
          <div style={S.sT}>Firm & RSM Information</div>
          <div style={S.g2}>
            <FG label="Name of Firm" req>
              <input
                style={S.input}
                value={f.firmName}
                onChange={(e) => u("firmName", e.target.value)}
                placeholder="Legal firm name"
              />
            </FG>
            <FG label="Constitution (Legal Structure)" req>
              <select
                style={S.select}
                value={f.constitution}
                onChange={(e) => u("constitution", e.target.value)}
              >
                <option value="">Select...</option>
                {[
                  "Proprietorship",
                  "Partnership",
                  "LLP",
                  "Private Limited",
                  "Public Limited",
                  "Trust",
                  "Other",
                ].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </FG>
            <FG label="Initiating RSM Name" req>
              <input
                style={S.input}
                value={f.rsmName}
                onChange={(e) => u("rsmName", e.target.value)}
              />
            </FG>
            <FG label="RSM Region">
              <input
                style={S.input}
                value={f.rsmRegion}
                onChange={(e) => u("rsmRegion", e.target.value)}
                placeholder="e.g. West, South"
              />
            </FG>
          </div>
          <Div />
          <div style={S.sT}>Principal Type</div>
          <FG label="Type of Principal">
            <select
              style={{ ...S.select, maxWidth: 260 }}
              value={f.principals[0]?.type}
              onChange={(e) =>
                setF((x) => ({
                  ...x,
                  principals: [{ ...x.principals[0], type: e.target.value }],
                }))
              }
            >
              {["Proprietor", "Partner", "Managing Director", "Director"].map(
                (o) => (
                  <option key={o}>{o}</option>
                ),
              )}
            </select>
          </FG>
          <div style={{ fontSize: 12, color: C.textLight, marginTop: 4 }}>
            {canMulti
              ? "Multiple principals allowed for Partners / Directors."
              : "Single principal for Proprietor / MD."}
          </div>
        </div>
      );
    if (step === 1)
      return (
        <div>
          <div style={S.sT}>Principal Details</div>
          {f.principals.map((p, idx) => (
            <div
              key={idx}
              style={{ ...S.card, border: `1px solid ${C.tealLight}` }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <span style={{ fontWeight: 700, color: C.teal }}>
                  #{idx + 1} — {p.type}
                </span>
                {idx > 0 && (
                  <button
                    style={S.btnD}
                    onClick={() =>
                      setF((x) => ({
                        ...x,
                        principals: x.principals.filter((_, i) => i !== idx),
                      }))
                    }
                  >
                    Remove
                  </button>
                )}
              </div>
              <div style={S.g2}>
                <FG label="Designation / Type">
                  <select
                    style={S.select}
                    value={p.type}
                    onChange={(e) => uP(idx, "type", e.target.value)}
                  >
                    {[
                      "Proprietor",
                      "Partner",
                      "Managing Director",
                      "Director",
                    ].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </FG>
                <FG label="Full Name" req>
                  <input
                    style={S.input}
                    value={p.name}
                    onChange={(e) => uP(idx, "name", e.target.value)}
                  />
                </FG>
                <FG label="Telephone">
                  <input
                    style={S.input}
                    value={p.tel}
                    onChange={(e) => uP(idx, "tel", e.target.value)}
                  />
                </FG>
                <FG label="Mobile" req>
                  <input
                    style={S.input}
                    value={p.mobile}
                    onChange={(e) => uP(idx, "mobile", e.target.value)}
                  />
                </FG>
                <FG label="Email">
                  <input
                    style={S.input}
                    value={p.email}
                    onChange={(e) => uP(idx, "email", e.target.value)}
                  />
                </FG>
                <FG label="Years in Business">
                  <input
                    style={S.input}
                    type="number"
                    value={p.yearsInBiz}
                    onChange={(e) => uP(idx, "yearsInBiz", e.target.value)}
                  />
                </FG>
                <FG label="Experience in Current Business">
                  <textarea
                    style={{ ...S.textarea, minHeight: 60 }}
                    value={p.expCur}
                    onChange={(e) => uP(idx, "expCur", e.target.value)}
                    placeholder="Nature and duration..."
                  />
                </FG>
                <FG label="Experience in Past Business (if any)">
                  <textarea
                    style={{ ...S.textarea, minHeight: 60 }}
                    value={p.expPast}
                    onChange={(e) => uP(idx, "expPast", e.target.value)}
                    placeholder="Any past background..."
                  />
                </FG>
              </div>
              <FG label="Succession Plan">
                <textarea
                  style={S.textarea}
                  value={p.succession}
                  onChange={(e) => uP(idx, "succession", e.target.value)}
                  placeholder="Business continuity / succession plan..."
                />
              </FG>
            </div>
          ))}
          {canMulti && (
            <button
              style={S.btnSm}
              onClick={() =>
                setF((x) => ({
                  ...x,
                  principals: [
                    ...x.principals,
                    { ...emptyP(), type: x.principals[0].type },
                  ],
                }))
              }
            >
              + Add Another {f.principals[0]?.type}
            </button>
          )}
        </div>
      );
    if (step === 2)
      return (
        <div>
          <div style={S.sT}>Contact Person</div>
          <div style={S.g2}>
            <FG label="Name" req>
              <input
                style={S.input}
                value={f.contact.name}
                onChange={(e) => uC("name", e.target.value)}
              />
            </FG>
            <FG label="Designation">
              <input
                style={S.input}
                value={f.contact.designation}
                onChange={(e) => uC("designation", e.target.value)}
              />
            </FG>
            <FG label="Experience in Firm (years)">
              <input
                style={S.input}
                type="number"
                value={f.contact.expFirm}
                onChange={(e) => uC("expFirm", e.target.value)}
              />
            </FG>
            <FG label="Total Experience (years)">
              <input
                style={S.input}
                type="number"
                value={f.contact.expTotal}
                onChange={(e) => uC("expTotal", e.target.value)}
              />
            </FG>
            <FG label="Telephone">
              <input
                style={S.input}
                value={f.contact.tel}
                onChange={(e) => uC("tel", e.target.value)}
              />
            </FG>
            <FG label="Mobile" req>
              <input
                style={S.input}
                value={f.contact.mobile}
                onChange={(e) => uC("mobile", e.target.value)}
              />
            </FG>
            <FG label="Email">
              <input
                style={S.input}
                value={f.contact.email}
                onChange={(e) => uC("email", e.target.value)}
              />
            </FG>
          </div>
          <Div />
          {[
            {
              title: "Office",
              ak: "officeAddress",
              ck: "officeCity",
              sk: "officeArea",
            },
            {
              title: "Godown / Warehouse",
              ak: "godownAddress",
              ck: "godownCity",
              sk: "godownArea",
            },
          ].map((loc) => (
            <div key={loc.title}>
              <div style={S.sT}>{loc.title}</div>
              <div style={S.g2}>
                <FG label="Address">
                  <textarea
                    style={{ ...S.textarea, minHeight: 65 }}
                    value={f[loc.ak]}
                    onChange={(e) => u(loc.ak, e.target.value)}
                  />
                </FG>
                <div>
                  <FG label="City / Location">
                    <input
                      style={S.input}
                      value={f[loc.ck]}
                      onChange={(e) => u(loc.ck, e.target.value)}
                    />
                  </FG>
                  <FG label="Area (Sq Ft)">
                    <input
                      style={S.input}
                      type="number"
                      value={f[loc.sk]}
                      onChange={(e) => u(loc.sk, e.target.value)}
                    />
                  </FG>
                </div>
              </div>
            </div>
          ))}
          <div style={S.sT}>Service Location</div>
          <div style={S.g2}>
            <FG label="Location">
              <input
                style={S.input}
                value={f.serviceLocation}
                onChange={(e) => u("serviceLocation", e.target.value)}
              />
            </FG>
            <FG label="Area (Sq Ft)">
              <input
                style={S.input}
                type="number"
                value={f.serviceArea}
                onChange={(e) => u("serviceArea", e.target.value)}
              />
            </FG>
          </div>
        </div>
      );
    if (step === 3)
      return (
        <div>
          <div style={S.sT}>Team Composition</div>
          {[
            ["Sales Personnel", "salesCount", "salesAvgExp"],
            ["Business Development Personnel", "bdCount", "bdAvgExp"],
            ["Service Personnel", "serviceCount", "serviceAvgExp"],
          ].map(([label, ck, ek]) => (
            <div key={ck} style={{ ...S.card, marginBottom: 12, padding: 14 }}>
              <div style={{ fontWeight: 700, marginBottom: 10 }}>{label}</div>
              <div style={S.g2}>
                <FG label="Number">
                  <input
                    style={S.input}
                    type="number"
                    value={f[ck]}
                    onChange={(e) => u(ck, e.target.value)}
                  />
                </FG>
                <FG label="Average Years of Experience">
                  <input
                    style={S.input}
                    type="number"
                    value={f[ek]}
                    onChange={(e) => u(ek, e.target.value)}
                  />
                </FG>
              </div>
              <FileAttach label="Attach Team CV / Profile (Optional)" />
            </div>
          ))}
          <Div />
          <div style={S.sT}>Business Promotion</div>
          <FG label="Sales / Business Promotion Activities (Current Year + Previous 2 Years)">
            <textarea
              style={S.textarea}
              value={f.salesPromo}
              onChange={(e) => u("salesPromo", e.target.value)}
              placeholder="Exhibitions, campaigns, digital marketing..."
            />
          </FG>
          <FileAttach label="Attach Promotion Documents" />
          <FG label="Details of Tools & Tackles for Services">
            <textarea
              style={S.textarea}
              value={f.toolsTackles}
              onChange={(e) => u("toolsTackles", e.target.value)}
              placeholder="Service tools, equipment, testing instruments..."
            />
          </FG>
          <FileAttach label="Attach Tools Inventory / Photos" />
        </div>
      );
    if (step === 4)
      return (
        <div>
          <div style={S.sT}>Business Profile</div>
          <div style={S.g2}>
            <FG label="Nature of Business" req>
              <select
                style={S.select}
                value={f.natureBusiness}
                onChange={(e) => u("natureBusiness", e.target.value)}
              >
                <option value="">Select...</option>
                {[
                  "Distributor",
                  "Dealer",
                  "Agent",
                  "System Integrator",
                  "Contractor",
                  "Value Added Reseller",
                  "Other",
                ].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </FG>
            <FG label="No. of Sub-Dealers & Retailers">
              <input
                style={S.input}
                value={f.subDealers}
                onChange={(e) => u("subDealers", e.target.value)}
                placeholder="e.g. 5 in Mumbai, 3 in Pune"
              />
            </FG>
          </div>
          <FG label="Products Dealt With">
            <textarea
              style={S.textarea}
              value={f.productsDealt}
              onChange={(e) => u("productsDealt", e.target.value)}
              placeholder="All products / brands currently dealing in..."
            />
          </FG>
          <FG label="Industries Served / Serving">
            <textarea
              style={S.textarea}
              value={f.industriesServed}
              onChange={(e) => u("industriesServed", e.target.value)}
              placeholder="Automotive, Steel, Cement, Pharma, etc."
            />
          </FG>
          <FileAttach label="Attach Industry / Client List" />
          <FG label="Key Customers">
            <textarea
              style={S.textarea}
              value={f.keyCustomers}
              onChange={(e) => u("keyCustomers", e.target.value)}
            />
          </FG>
          <FileAttach label="Attach Key Customer List" />
          <FG label="Geographical Coverage (Location & Major Industry Served)">
            <textarea
              style={S.textarea}
              value={f.geoCoverage}
              onChange={(e) => u("geoCoverage", e.target.value)}
            />
          </FG>
          <FileAttach label="Attach Coverage Map / Territory Details" />
          <FG label="Details of Distributorship (Present & Past)">
            <textarea
              style={S.textarea}
              value={f.distributorship}
              onChange={(e) => u("distributorship", e.target.value)}
            />
          </FG>
          <FileAttach label="Attach Distributorship Certificates" />
        </div>
      );
    if (step === 5)
      return (
        <div>
          <div style={S.sT}>Financial Details</div>
          <div style={S.g2}>
            <FG label="Firm / Company Networth (₹)">
              <input
                style={S.input}
                value={f.firmNetworth}
                onChange={(e) => u("firmNetworth", e.target.value)}
              />
            </FG>
            <FG label="Proprietor / Partners / Directors Networth (₹)">
              <input
                style={S.input}
                value={f.propNetworth}
                onChange={(e) => u("propNetworth", e.target.value)}
              />
            </FG>
            <FG label="Secured Debt (₹)">
              <input
                style={S.input}
                value={f.securedDebt}
                onChange={(e) => u("securedDebt", e.target.value)}
              />
            </FG>
            <FG label="Unsecured Debt (₹)">
              <input
                style={S.input}
                value={f.unsecuredDebt}
                onChange={(e) => u("unsecuredDebt", e.target.value)}
              />
            </FG>
            <FG label="PAN No." req>
              <input
                style={S.input}
                value={f.panNo}
                onChange={(e) => u("panNo", e.target.value)}
                placeholder="ABCDE1234F"
              />
            </FG>
            <FG label="GST Registration No." req>
              <input
                style={S.input}
                value={f.gstNo}
                onChange={(e) => u("gstNo", e.target.value)}
              />
            </FG>
            <FG label="Bank Facility (OD / CC / BG / LC)">
              <input
                style={S.input}
                value={f.bankFacility}
                onChange={(e) => u("bankFacility", e.target.value)}
              />
            </FG>
            <FG label="Rate of Interest">
              <input
                style={S.input}
                value={f.roi}
                onChange={(e) => u("roi", e.target.value)}
              />
            </FG>
            <FG label="Bank Name">
              <input
                style={S.input}
                value={f.bankName}
                onChange={(e) => u("bankName", e.target.value)}
              />
            </FG>
            <FG label="Bank Address">
              <input
                style={S.input}
                value={f.bankAddress}
                onChange={(e) => u("bankAddress", e.target.value)}
              />
            </FG>
            <FG label="Latest Credit Rating (if available)">
              <input
                style={S.input}
                value={f.creditRating}
                onChange={(e) => u("creditRating", e.target.value)}
                placeholder="e.g. CRISIL BBB"
              />
            </FG>
            <FG label="Last Limit Renewal Date">
              <input
                style={S.input}
                type="date"
                value={f.limitRenewalDate}
                onChange={(e) => u("limitRenewalDate", e.target.value)}
              />
            </FG>
          </div>
          <Div />
          <div style={S.sT}>Document Attachments (Soft Signed Copies)</div>
          {[
            "Balance Sheet – Past 3 Years",
            "P&L Account – Past 3 Years",
            "Cash Flow Statement (if available)",
            "PAN Card Copy",
            "Income Tax Return & Tax Audit Report – Past 3 Years",
            "GST Registration Certificate",
            "GST Return & GST Audit Report – Past 3 Years",
          ].map((doc) => (
            <div
              key={doc}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "9px 0",
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              <span style={{ fontSize: 13, color: C.textMid }}>{doc}</span>
              <FileAttach label="Upload" />
            </div>
          ))}
        </div>
      );
  };

  return (
    <div>
      <div style={S.pageHeader}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div>
            <div style={S.pageTitle}>New ABP Application</div>
            <div style={S.pageSub}>
              Authorized Business Partner Registration · RSM Initiated
            </div>
          </div>
          <button style={S.btnS} onClick={onCancel}>
            ← Back
          </button>
        </div>
      </div>
      <div
        style={{
          ...S.card,
          display: "flex",
          padding: "14px 22px",
          marginBottom: 18,
        }}
      >
        {STEPS.map((s, i) => (
          <div
            key={s}
            onClick={() => setStep(i)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
              position: "relative",
            }}
          >
            {i < STEPS.length - 1 && (
              <div
                style={{
                  position: "absolute",
                  top: 13,
                  left: "50%",
                  width: "100%",
                  height: 2,
                  background: i < step ? C.teal : C.border,
                  zIndex: 0,
                }}
              />
            )}
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 11,
                zIndex: 1,
                background: i <= step ? C.teal : C.card,
                border: `2px solid ${i <= step ? C.teal : C.border}`,
                color: i <= step ? "#fff" : C.textLight,
              }}
            >
              {i < step ? "✓" : i + 1}
            </div>
            <div
              style={{
                fontSize: 10,
                color: i === step ? C.teal : C.textLight,
                fontWeight: i === step ? 700 : 400,
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              {s}
            </div>
          </div>
        ))}
      </div>
      <div style={S.card}>{renderStep()}</div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          style={S.btnS}
          onClick={() => (step > 0 ? setStep(step - 1) : onCancel())}
        >
          {step === 0 ? "Cancel" : "← Previous"}
        </button>
        {step < STEPS.length - 1 ? (
          <button style={S.btnP} onClick={() => setStep(step + 1)}>
            Next →
          </button>
        ) : (
          <button style={S.btnA} onClick={() => onSubmit(f)}>
            Submit & Rate →
          </button>
        )}
      </div>
    </div>
  );
}

// ─── INITIAL RATING ───────────────────────────────────────────────────────────
function InitialRating({ abp, onSubmit, onBack }) {
  const [ratings, setRatings] = useState(
    Object.fromEntries(RC.map((c) => [c, 0])),
  );
  const [remarks, setRemarks] = useState(
    Object.fromEntries(RC.map((c) => [c, ""])),
  );
  const avg = () => {
    const v = Object.values(ratings).filter((x) => x > 0);
    return v.length
      ? (v.reduce((a, b) => a + b, 0) / v.length).toFixed(1)
      : "—";
  };
  return (
    <div>
      <div style={S.pageHeader}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div>
            <div style={S.pageTitle}>Initial ABP Rating</div>
            <div style={S.pageSub}>
              {abp?.firmName} · Preliminary Assessment
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: C.teal }}>
              {avg()}
            </div>
            <div style={{ fontSize: 11, color: C.textLight }}>Avg Rating</div>
          </div>
        </div>
      </div>
      <div style={S.card}>
        <div style={S.sT}>Rate Each Criteria (Scale 1–5)</div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={S.th}>Criteria</th>
              <th style={S.th}>Rating</th>
              <th style={S.th}>Remark</th>
            </tr>
          </thead>
          <tbody>
            {RC.map((c) => (
              <tr key={c}>
                <td style={{ ...S.td, fontWeight: 600 }}>{c}</td>
                <td style={S.td}>
                  <RatingStars
                    value={ratings[c]}
                    onChange={(v) => setRatings((r) => ({ ...r, [c]: v }))}
                  />
                </td>
                <td style={S.td}>
                  <input
                    style={S.input}
                    placeholder="Add remark..."
                    value={remarks[c]}
                    onChange={(e) =>
                      setRemarks((r) => ({ ...r, [c]: e.target.value }))
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button style={S.btnS} onClick={onBack}>
          ← Back
        </button>
        <button style={S.btnA} onClick={() => onSubmit({ ratings, remarks })}>
          Submit & Go to Dashboard →
        </button>
      </div>
    </div>
  );
}

// ─── ABP DETAIL (FULL ALL-TABS VIEW) ─────────────────────────────────────────
function ABPDetail({ abp, onStartAssess, onGo100Day, onBack }) {
  const [tab, setTab] = useState("overview");
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "principals", label: "Principals" },
    { id: "contact", label: "Contact & Offices" },
    { id: "team", label: "Team & Business" },
    { id: "financials", label: "Financials" },
    { id: "rating", label: "Initial Rating" },
    { id: "assessments", label: "Assessments" },
    ...(abp.status === "Approved"
      ? [{ id: "100day", label: "📅 100-Day Plan" }]
      : []),
  ];
  const sc = (s) =>
    s === "Approved"
      ? "green"
      : s === "Rejected"
        ? "red"
        : s === "Pending CEO"
          ? "purple"
          : "teal";
  const isDone = (role) =>
    role === "CEO" ? !!abp.ceoApproval : !!abp.assessments?.[role];
  const canDo = (role) => {
    const idx = ASSESS_FLOW.indexOf(role);
    if (idx === 0) return true;
    if (role === "CEO")
      return ASSESS_FLOW.slice(0, 4).every((r) => abp.assessments?.[r]);
    return !!abp.assessments?.[ASSESS_FLOW[idx - 1]];
  };

  const renderTab = () => {
    if (tab === "overview")
      return (
        <div style={S.g2}>
          <div>
            <div style={S.card}>
              <div style={S.sT}>Firm Details</div>
              {[
                ["Name of Firm", abp.firmName],
                ["Constitution", abp.constitution],
                ["Nature of Business", abp.natureBusiness],
                ["City", abp.officeCity],
                ["RSM", abp.rsmName],
                ["RSM Region", abp.rsmRegion],
              ].map(([l, v]) => (
                <InfoRow key={l} label={l} value={v} />
              ))}
            </div>
            {abp.ceoApproval && (
              <div
                style={{
                  ...S.card,
                  border: `1px solid ${abp.ceoApproval.approval === "Approved" ? C.successBorder : C.dangerBorder}`,
                  background:
                    abp.ceoApproval.approval === "Approved"
                      ? C.successBg
                      : C.dangerBg,
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    color:
                      abp.ceoApproval.approval === "Approved"
                        ? C.success
                        : C.danger,
                    marginBottom: 8,
                  }}
                >
                  {abp.ceoApproval.approval === "Approved"
                    ? "✅ MD Approved"
                    : "❌ MD Decision: " + abp.ceoApproval.approval}
                </div>
                <div style={{ fontSize: 13, color: C.textMid }}>
                  {abp.ceoApproval.comments || "No comments"}
                </div>
              </div>
            )}
          </div>
          <div>
            <div style={S.card}>
              <div style={S.sT}>Assessment Progress</div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <span style={S.badge(sc(abp.status))}>{abp.status}</span>
                <span style={{ fontSize: 12, color: C.textMid }}>
                  {abp.stage}
                </span>
              </div>
              <ProgressBar
                pct={Math.round(
                  (ASSESS_FLOW.filter((r) => isDone(r)).length /
                    ASSESS_FLOW.length) *
                    100,
                )}
              />
              <div style={{ marginTop: 14 }}>
                {ASSESS_FLOW.map((role, i) => (
                  <div
                    key={role}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 700,
                        background: isDone(role) ? C.success : C.border,
                        color: isDone(role) ? "#fff" : C.textLight,
                        flexShrink: 0,
                      }}
                    >
                      {isDone(role) ? "✓" : i + 1}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        fontSize: 13,
                        fontWeight: isDone(role) ? 600 : 400,
                        color: isDone(role) ? C.text : C.textMid,
                      }}
                    >
                      {role === "CEO"
                        ? "MD / CEO Approval"
                        : `${role} Assessment`}
                    </div>
                    {!isDone(role) && canDo(role) && (
                      <button
                        style={S.btnSm}
                        onClick={() => onStartAssess(role)}
                      >
                        Start →
                      </button>
                    )}
                    {isDone(role) && <span style={S.badge("green")}>Done</span>}
                  </div>
                ))}
              </div>
            </div>
            {abp.status === "Approved" && (
              <div
                style={{
                  ...S.card,
                  background: C.successBg,
                  border: `1px solid ${C.successBorder}`,
                }}
              >
                <div
                  style={{ fontWeight: 700, color: C.success, marginBottom: 8 }}
                >
                  🎉 Approved — Onboarding Active
                </div>
                <div
                  style={{ fontSize: 12, color: C.textMid, marginBottom: 12 }}
                >
                  100-Day onboarding plan is now active.
                </div>
                <button style={S.btnP} onClick={onGo100Day}>
                  View 100-Day Plan →
                </button>
              </div>
            )}
          </div>
        </div>
      );

    if (tab === "principals")
      return (
        <div>
          {abp.principals?.map((p, i) => (
            <div
              key={i}
              style={{ ...S.card, border: `1px solid ${C.tealLight}` }}
            >
              <div
                style={{
                  fontWeight: 700,
                  color: C.teal,
                  fontSize: 15,
                  marginBottom: 12,
                }}
              >
                #{i + 1} — {p.type}: {p.name}
              </div>
              <div style={S.g2}>
                {[
                  ["Designation", p.type],
                  ["Mobile", p.mobile],
                  ["Telephone", p.tel],
                  ["Email", p.email],
                  [
                    "Years in Business",
                    p.yearsInBiz ? p.yearsInBiz + " years" : "",
                  ],
                ].map(([l, v]) => (
                  <InfoRow key={l} label={l} value={v} />
                ))}
              </div>
              <Div />
              <div style={S.g2}>
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: C.textMid,
                      marginBottom: 6,
                    }}
                  >
                    CURRENT BUSINESS EXPERIENCE
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.7 }}>
                    {p.expCur || "—"}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: C.textMid,
                      marginBottom: 6,
                    }}
                  >
                    PAST BUSINESS EXPERIENCE
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.7 }}>
                    {p.expPast || "—"}
                  </div>
                </div>
              </div>
              <Div />
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: C.textMid,
                  marginBottom: 6,
                }}
              >
                SUCCESSION PLAN
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.7 }}>
                {p.succession || "—"}
              </div>
            </div>
          ))}
        </div>
      );

    if (tab === "contact")
      return (
        <div>
          <div style={S.card}>
            <div style={S.sT}>Contact Person</div>
            <div style={S.g2}>
              {[
                ["Name", abp.contact?.name],
                ["Designation", abp.contact?.designation],
                [
                  "Experience in Firm",
                  abp.contact?.expFirm ? abp.contact.expFirm + " yrs" : "",
                ],
                [
                  "Total Experience",
                  abp.contact?.expTotal ? abp.contact.expTotal + " yrs" : "",
                ],
                ["Telephone", abp.contact?.tel],
                ["Mobile", abp.contact?.mobile],
                ["Email", abp.contact?.email],
              ].map(([l, v]) => (
                <InfoRow key={l} label={l} value={v} />
              ))}
            </div>
          </div>
          <div style={S.g3}>
            {[
              {
                t: "Office",
                a: abp.officeAddress,
                c: abp.officeCity,
                s: abp.officeArea,
              },
              {
                t: "Godown / Warehouse",
                a: abp.godownAddress,
                c: abp.godownCity,
                s: abp.godownArea,
              },
              {
                t: "Service Location",
                a: abp.serviceLocation,
                c: "",
                s: abp.serviceArea,
              },
            ].map((loc) => (
              <div key={loc.t} style={{ ...S.card, marginBottom: 0 }}>
                <div style={S.sT}>{loc.t}</div>
                <div style={{ fontSize: 13, lineHeight: 1.7, marginBottom: 8 }}>
                  {loc.a || "—"}
                </div>
                {loc.c && (
                  <div style={{ fontSize: 12, color: C.textMid }}>
                    📍 {loc.c}
                  </div>
                )}
                {loc.s && (
                  <div style={{ fontSize: 12, color: C.textMid, marginTop: 4 }}>
                    📐 {loc.s} sq ft
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );

    if (tab === "team")
      return (
        <div>
          <div style={S.card}>
            <div style={S.sT}>Team Composition</div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={S.th}>Category</th>
                  <th style={S.th}>Count</th>
                  <th style={S.th}>Avg Experience</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Sales Personnel", abp.salesCount, abp.salesAvgExp],
                  ["Business Development", abp.bdCount, abp.bdAvgExp],
                  ["Service Personnel", abp.serviceCount, abp.serviceAvgExp],
                ].map(([cat, cnt, exp]) => (
                  <tr key={cat}>
                    <td style={{ ...S.td, fontWeight: 600 }}>{cat}</td>
                    <td style={S.td}>{cnt || "—"}</td>
                    <td style={S.td}>{exp ? exp + " years" : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={S.g2}>
            <div style={S.card}>
              <div style={S.sT}>Business Profile</div>
              <InfoRow label="Nature of Business" value={abp.natureBusiness} />
              <InfoRow label="Sub-Dealers & Retailers" value={abp.subDealers} />
              <Div />
              {[
                ["PRODUCTS DEALT WITH", abp.productsDealt],
                ["INDUSTRIES SERVED", abp.industriesServed],
              ].map(([k, v]) => (
                <div key={k} style={{ marginBottom: 12 }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: C.textMid,
                      marginBottom: 5,
                    }}
                  >
                    {k}
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                    {v || "—"}
                  </div>
                </div>
              ))}
            </div>
            <div style={S.card}>
              <div style={S.sT}>Market Coverage</div>
              {[
                ["KEY CUSTOMERS", abp.keyCustomers],
                ["GEOGRAPHICAL COVERAGE", abp.geoCoverage],
                ["DISTRIBUTORSHIP DETAILS", abp.distributorship],
              ].map(([k, v]) => (
                <div key={k} style={{ marginBottom: 12 }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: C.textMid,
                      marginBottom: 5,
                    }}
                  >
                    {k}
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                    {v || "—"}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={S.card}>
            <div style={S.sT}>Promotions & Service Capability</div>
            <div style={S.g2}>
              {[
                ["SALES PROMOTION ACTIVITIES", abp.salesPromo],
                ["TOOLS & TACKLES FOR SERVICE", abp.toolsTackles],
              ].map(([k, v]) => (
                <div key={k}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: C.textMid,
                      marginBottom: 5,
                    }}
                  >
                    {k}
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                    {v || "—"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    if (tab === "financials")
      return (
        <div>
          <div style={S.g2}>
            <div style={S.card}>
              <div style={S.sT}>Networth & Debt</div>
              {[
                ["Firm Networth (₹)", abp.firmNetworth],
                ["Proprietor / Partners Networth (₹)", abp.propNetworth],
                ["Secured Debt (₹)", abp.securedDebt],
                ["Unsecured Debt (₹)", abp.unsecuredDebt],
              ].map(([l, v]) => (
                <InfoRow key={l} label={l} value={v} />
              ))}
            </div>
            <div style={S.card}>
              <div style={S.sT}>Tax & Compliance</div>
              {[
                ["PAN No.", abp.panNo],
                ["GST Registration No.", abp.gstNo],
              ].map(([l, v]) => (
                <InfoRow key={l} label={l} value={v} />
              ))}
            </div>
            <div style={S.card}>
              <div style={S.sT}>Banking Details</div>
              {[
                ["Bank Facility", abp.bankFacility],
                ["Rate of Interest", abp.roi],
                ["Bank Name", abp.bankName],
                ["Bank Address", abp.bankAddress],
                ["Credit Rating", abp.creditRating],
                ["Last Limit Renewal", abp.limitRenewalDate],
              ].map(([l, v]) => (
                <InfoRow key={l} label={l} value={v} />
              ))}
            </div>
          </div>
        </div>
      );

    if (tab === "rating")
      return (
        <div style={S.card}>
          <div style={S.sT}>Initial Rating Assessment</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={S.th}>Criteria</th>
                <th style={S.th}>Rating</th>
                <th style={S.th}>Remark</th>
              </tr>
            </thead>
            <tbody>
              {RC.map((c) => (
                <tr key={c}>
                  <td style={{ ...S.td, fontWeight: 600 }}>{c}</td>
                  <td style={S.td}>
                    <RatingStars
                      value={abp.initialRating?.ratings?.[c] || 0}
                      size={24}
                    />
                  </td>
                  <td style={{ ...S.td, color: C.textMid }}>
                    {abp.initialRating?.remarks?.[c] || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    if (tab === "assessments")
      return (
        <div>
          {ASSESS_FLOW.map((role) => {
            const data =
              role === "CEO" ? abp.ceoApproval : abp.assessments?.[role];
            const color = ROLE_COLOR[role];
            return (
              <div
                key={role}
                style={{
                  ...S.card,
                  border: `1px solid ${data ? color + "55" : C.border}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: data ? 14 : 0,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 15,
                      color: data ? color : C.textLight,
                    }}
                  >
                    {role === "CEO"
                      ? "MD / CEO Approval"
                      : `${role} Assessment`}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {!data && (
                      <span style={S.badge(canDo(role) ? "amber" : "teal")}>
                        {canDo(role) ? "Pending" : "Awaiting Previous"}
                      </span>
                    )}
                    {data && <span style={S.badge("green")}>Completed</span>}
                    {canDo(role) && !data && (
                      <button
                        style={S.btnSm}
                        onClick={() => onStartAssess(role)}
                      >
                        Start →
                      </button>
                    )}
                  </div>
                </div>
                {data && role !== "CEO" && (
                  <AssessmentCard role={role} data={data} color={color} />
                )}
                {data && role === "CEO" && (
                  <div
                    style={{
                      display: "flex",
                      gap: 16,
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ fontSize: 36 }}>
                      {data.approval === "Approved" ? "✅" : "❌"}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 18,
                          fontWeight: 800,
                          color:
                            data.approval === "Approved" ? C.success : C.danger,
                        }}
                      >
                        {data.approval}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: C.textMid,
                          marginTop: 6,
                          lineHeight: 1.6,
                        }}
                      >
                        {data.comments || "—"}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );

    if (tab === "100day") return <HundredDayPlan abp={abp} embedded />;
  };

  return (
    <div>
      <div style={S.pageHeader}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div>
            <div style={S.pageTitle}>{abp.firmName}</div>
            <div style={S.pageSub}>
              ABP Application · RSM: {abp.rsmName} · {abp.officeCity}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={S.badge(sc(abp.status))}>{abp.status}</span>
            <button style={S.btnS} onClick={onBack}>
              ← Dashboard
            </button>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: 0,
          borderBottom: `2px solid ${C.border}`,
          marginBottom: 20,
          overflowX: "auto",
        }}
      >
        {tabs.map((t) => (
          <div
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "9px 16px",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: tab === t.id ? 700 : 500,
              color: tab === t.id ? C.teal : C.textMid,
              borderBottom:
                tab === t.id ? `2px solid ${C.teal}` : "2px solid transparent",
              marginBottom: -2,
              whiteSpace: "nowrap",
            }}
          >
            {t.label}
          </div>
        ))}
      </div>
      {renderTab()}
    </div>
  );
}

// ─── ASSESSMENT ───────────────────────────────────────────────────────────────
function Assessment({ abp, role, onSubmit, onBack }) {
  const prev = abp?.assessments?.[role];
  const donePrev = ["RSM", "NSM", "Sales Head", "CFO"].filter(
    (r) => r !== role && abp?.assessments?.[r],
  );
  const color = ROLE_COLOR[role] || C.teal;
  const [ratings, setRatings] = useState(
    Object.fromEntries(RC.map((c) => [c, prev?.ratings?.[c] || 0])),
  );
  const [remarks, setRemarks] = useState(
    Object.fromEntries(RC.map((c) => [c, prev?.remarks?.[c] || ""])),
  );
  const [oi, setOi] = useState({
    [FY[0]]: prev?.oi?.[FY[0]] || "",
    [FY[1]]: prev?.oi?.[FY[1]] || "",
    [FY[2]]: prev?.oi?.[FY[2]] || "",
  });
  const [strengths, setStrengths] = useState(prev?.strengths || "");
  const [weakness, setWeakness] = useState(prev?.weakness || "");
  const [support, setSupport] = useState(prev?.support || "");
  const [comments, setComments] = useState(prev?.comments || "");
  const avg = () => {
    const v = Object.values(ratings).filter((x) => x > 0);
    return v.length
      ? (v.reduce((a, b) => a + b, 0) / v.length).toFixed(1)
      : "—";
  };

  return (
    <div>
      <div style={S.pageHeader}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div>
            <div style={S.pageTitle}>{role} Assessment</div>
            <div style={S.pageSub}>
              {abp?.firmName} · {role} Review & Recommendation
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 26, fontWeight: 800, color }}>{avg()}</div>
            <div style={{ fontSize: 11, color: C.textLight }}>Avg Rating</div>
          </div>
        </div>
      </div>
      {/* Previous assessments — same card-grid format for all roles */}
      {donePrev.length > 0 && (
        <div
          style={{
            ...S.card,
            background: "#FFFBEB",
            border: `1px solid #FCD34D`,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: C.amber,
              marginBottom: 14,
            }}
          >
            📋 Previous Assessments Reference
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${Math.min(donePrev.length, 2)}, 1fr)`,
              gap: 14,
            }}
          >
            {donePrev.map((r) => (
              <AssessmentCard
                key={r}
                role={r}
                data={abp.assessments[r]}
                color={ROLE_COLOR[r]}
              />
            ))}
          </div>
        </div>
      )}
      <div style={S.card}>
        <div style={S.sT}>Rating Criteria (Scale 1–5)</div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={S.th}>Criteria</th>
              <th style={S.th}>Rating</th>
              <th style={S.th}>Remark</th>
            </tr>
          </thead>
          <tbody>
            {RC.map((c) => (
              <tr key={c}>
                <td style={{ ...S.td, fontWeight: 600 }}>{c}</td>
                <td style={S.td}>
                  <RatingStars
                    value={ratings[c]}
                    onChange={(v) => setRatings((r) => ({ ...r, [c]: v }))}
                  />
                </td>
                <td style={S.td}>
                  <input
                    style={S.input}
                    placeholder="Remark..."
                    value={remarks[c]}
                    onChange={(e) =>
                      setRemarks((r) => ({ ...r, [c]: e.target.value }))
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={S.card}>
        <div style={S.sT}>Business Projections</div>
        <div style={S.g3}>
          {FY.map((fy) => (
            <FG key={fy} label={`${fy} Expected Order Intake (₹)`}>
              <input
                style={S.input}
                value={oi[fy]}
                onChange={(e) => setOi((o) => ({ ...o, [fy]: e.target.value }))}
              />
            </FG>
          ))}
        </div>
        <Div />
        <div style={S.g2}>
          <FG label="Strengths">
            <textarea
              style={S.textarea}
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
              placeholder="Key strengths of this ABP..."
            />
          </FG>
          <FG label="Weaknesses / Concerns">
            <textarea
              style={S.textarea}
              value={weakness}
              onChange={(e) => setWeakness(e.target.value)}
              placeholder="Weaknesses or concerns..."
            />
          </FG>
        </div>
        <FG label="Areas of Support Required">
          <textarea
            style={S.textarea}
            value={support}
            onChange={(e) => setSupport(e.target.value)}
          />
        </FG>
        <Div />
        <FG label={`${role} Comments & Recommendation`}>
          <textarea
            style={{ ...S.textarea, minHeight: 100 }}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </FG>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button style={S.btnS} onClick={onBack}>
          ← Back
        </button>
        <button
          style={{ ...S.btnP, background: color }}
          onClick={() =>
            onSubmit({
              ratings,
              remarks,
              oi,
              strengths,
              weakness,
              support,
              comments,
            })
          }
        >
          Submit {role} Assessment →
        </button>
      </div>
    </div>
  );
}

// ─── CEO APPROVAL ─────────────────────────────────────────────────────────────
function CEOApproval({ abp, onSubmit, onBack }) {
  const [approval, setApproval] = useState("");
  const [comments, setComments] = useState("");
  return (
    <div>
      <div style={S.pageHeader}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <div style={S.pageTitle}>MD / CEO Approval</div>
            <div style={S.pageSub}>{abp?.firmName} · Final Approval</div>
          </div>
          <button style={S.btnS} onClick={onBack}>
            ← Back
          </button>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 16,
          marginBottom: 20,
        }}
      >
        {["RSM", "NSM", "Sales Head", "CFO"]
          .filter((r) => abp?.assessments?.[r])
          .map((r) => (
            <AssessmentCard
              key={r}
              role={r}
              data={abp.assessments[r]}
              color={ROLE_COLOR[r]}
            />
          ))}
      </div>
      <div style={S.card}>
        <div style={S.sT}>MD Decision</div>
        <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
          {[
            { v: "Approved", icon: "✅", col: C.success, bg: C.successBg },
            { v: "Rejected", icon: "❌", col: C.danger, bg: C.dangerBg },
            {
              v: "Defer for Review",
              icon: "🔄",
              col: C.amberLight,
              bg: C.amberBg,
            },
          ].map((opt) => (
            <div
              key={opt.v}
              onClick={() => setApproval(opt.v)}
              style={{
                flex: 1,
                padding: 18,
                borderRadius: 10,
                cursor: "pointer",
                textAlign: "center",
                border: `2px solid ${approval === opt.v ? opt.col : C.border}`,
                background: approval === opt.v ? opt.bg : C.card,
                transition: "all 0.15s",
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 6 }}>{opt.icon}</div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  color: approval === opt.v ? opt.col : C.textMid,
                }}
              >
                {opt.v}
              </div>
            </div>
          ))}
        </div>
        <FG label="MD Comments">
          <textarea
            style={{ ...S.textarea, minHeight: 120 }}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Conditions, directives, or comments..."
          />
        </FG>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button style={S.btnS} onClick={onBack}>
          ← Back
        </button>
        <button
          style={{ ...S.btnP, opacity: approval ? 1 : 0.5 }}
          disabled={!approval}
          onClick={() => onSubmit({ approval, comments })}
        >
          Confirm MD Decision →
        </button>
      </div>
    </div>
  );
}

// ─── 100-DAY PLAN ─────────────────────────────────────────────────────────────
const PLAN = [
  {
    id: "S0",
    no: "—",
    label: "Signed Agreement with security deposit & blank cheques",
    day: 10,
    resp: "Purujeet",
    group: "Pre-Onboarding",
    children: [],
  },
  {
    id: "1",
    no: "1",
    label: "ABP Appointment",
    day: 1,
    resp: "RSM/MMD",
    group: "Appointment",
    children: [],
  },
  {
    id: "2",
    no: "2",
    label: "Dedicated BD Calling and Digital Marketing",
    day: 1,
    resp: "SKB",
    group: "Appointment",
    children: [],
  },
  {
    id: "3",
    no: "3",
    label: "ABP Trainings (In Plant)",
    day: 15,
    resp: "RCM/RSM",
    group: "Training",
    children: [
      {
        id: "3.1",
        label: "Technical Training",
        resp: "RCM/RSM",
        sub: [
          "Should cover all category of products",
          "Difference between different models of CPBs",
          "Difference between different models of CEHs",
          "Difference between different models of WRHs",
          "Selection of products wrt various applications",
          "Explaining basic terms like duty cycle, CDF, starts stops, VFD, DBR etc",
          "Explaining different type of beams and our trolley designs",
          "Various customisations possible/not possible on our hoists",
        ],
      },
      {
        id: "3.2",
        label: "Industry Information",
        resp: "MMD/DPP",
        sub: [
          "Type of Industries where our products are supplied",
          "Different type of applications",
          "Product Selection for various applications",
          "Critical applications",
          "Customisations required for different applications",
          "Information to collect for proper product selection",
          "Enquiry checklist",
        ],
      },
      {
        id: "3.3",
        label: "Factory Visit",
        resp: "Anil",
        sub: [
          "Complete info on the Khalapur factory by any supervisor",
          "Various machines inside the plant",
          "Witnessing the assembly of CPB, CEH & WRH",
          "Testing facilities for CPBs, CEHs and WRHs",
          "Complete info on the Chakan factory by any supervisor",
        ],
      },
      {
        id: "3.4",
        label: "Process Training",
        resp: "Various",
        sub: [
          "CRM Training (Akshay)",
          "Ileap training (Swati)",
          "Ecom training (Swati)",
          "Monthly reporting process (MMD)",
          "Inventory reports (MMD)",
          "ABP review process (MMD)",
          "DSO Training (MMD)",
          "DSO Review (MMD)",
          "DSO beat plan (MMD)",
        ],
      },
      {
        id: "3.5",
        label: "Interface Training",
        resp: "RSM",
        sub: [
          "Understanding of exact roles and responsibilities",
          "Different type of Support requests by ABPs",
          "Contacts of key support personals",
          "What is expected from ABPs",
          "What is expected from CSGA",
          "TAT for various requests like GAD/QAP/codes",
        ],
      },
      {
        id: "3.6",
        label: "Welcome Kit Distribution",
        resp: "MMD/SKB",
        sub: [
          "All product catalogues (MMD)",
          "Product training videos on Indef library (SKB)",
          "Webinars on Indef library (SKB)",
          "Bluebook (SKB)",
          "Corporate presentation (SKB)",
          "CRM access (Akshay)",
          "Ileap access (Akshay)",
          "Ecom Access (Akshay)",
          "Complaint Portal Access (SB)",
          "Annual Budget (MMD)",
        ],
      },
    ],
  },
  {
    id: "4",
    no: "4",
    label: "Finalising the Key Accounts",
    day: 10,
    resp: "RSM/MMD",
    group: "Sales",
    children: [],
  },
  {
    id: "5",
    no: "5",
    label: "Email Campaign from ABPs to Their Customers",
    day: 15,
    resp: "RSM/MMD/SKB",
    group: "Sales",
    children: [],
  },
  {
    id: "6",
    no: "6",
    label: "ABP Sales Person Registration",
    day: 20,
    resp: "RSM/MMD",
    group: "Onboarding",
    children: [],
  },
  {
    id: "7",
    no: "7",
    label: "Completion of Training of ABP Salesperson",
    day: 25,
    resp: "RSM",
    group: "Training",
    children: [],
  },
  {
    id: "8",
    no: "8",
    label: "Start of Sales Visit Plan with Sales Person",
    day: 30,
    resp: "RSM",
    group: "Sales",
    children: [],
  },
  {
    id: "9",
    no: "9",
    label: "Completing the Training of Service Person",
    day: 30,
    resp: "RSM/SB",
    group: "Training",
    children: [],
  },
  {
    id: "10",
    no: "10",
    label: "Completing Visits to All Key Accounts",
    day: 60,
    resp: "RSM",
    group: "Sales",
    children: [
      {
        id: "10.ka",
        label: "Key Accounts List",
        resp: "RSM",
        sub: [
          "Key Account 1",
          "Key Account 2",
          "Key Account 3",
          "Key Account 4",
          "Key Account 5",
          "Key Account 6",
          "Key Account 7",
          "Key Account 8",
          "Key Account 9",
          "Key Account 10",
        ],
      },
    ],
  },
  {
    id: "11",
    no: "11",
    label: "Completing the Setup of Indef Clinic",
    day: 100,
    resp: "RSM/SB",
    group: "Completion",
    children: [],
  },
];
const GC = {
  "Pre-Onboarding": C.purple,
  Appointment: C.teal,
  Training: C.amberLight,
  Sales: C.blue,
  Onboarding: C.tealLight,
  Completion: C.success,
};

function HundredDayPlan({ abp, embedded = false, onBack }) {
  const today = new Date();
  const [startDate, setStartDate] = useState(today.toISOString().split("T")[0]);
  const [completed, setCompleted] = useState({});
  const [expanded, setExpanded] = useState({});
  const [modal, setModal] = useState(null);
  const [feedback, setFeedback] = useState("");

  const elapsed = Math.max(
    0,
    Math.floor((new Date() - new Date(startDate)) / (1000 * 60 * 60 * 24)),
  );
  const isDone = (id) => !!completed[id]?.done;
  const isOverdue = (item) => !isDone(item.id) && elapsed > item.day;
  const allSubsDone = (item) =>
    item.children?.every(
      (cat) =>
        isDone(cat.id) && cat.sub?.every((_, si) => isDone(`${cat.id}-${si}`)),
    );
  const allCatSubsDone = (cat) =>
    cat.sub?.every((_, si) => isDone(`${cat.id}-${si}`));
  const canComplete = (item) => !item.children?.length || allSubsDone(item);
  const canCompleteCAT = (cat) => allCatSubsDone(cat);

  const tryComplete = (id, label) => {
    setModal({ id, label });
    setFeedback("");
  };
  const confirmDone = () => {
    setCompleted((c) => ({
      ...c,
      [modal.id]: {
        done: true,
        date: new Date().toLocaleDateString("en-IN"),
        feedback,
      },
    }));
    setModal(null);
  };
  const uncheck = (id) =>
    setCompleted((c) => {
      const n = { ...c };
      delete n[id];
      return n;
    });

  const totalItems = PLAN.reduce((acc, item) => {
    acc++;
    item.children?.forEach((cat) => {
      acc++;
      cat.sub?.forEach(() => acc++);
    });
    return acc;
  }, 0);
  const doneCount = Object.values(completed).filter((x) => x?.done).length;
  const pct = Math.round((doneCount / totalItems) * 100);

  const Checkbox = ({ id, label, canDo, onComplete, size = 22 }) =>
    isDone(id) ? (
      <div
        onClick={() => uncheck(id)}
        title="Click to uncheck"
        style={{
          width: size,
          height: size,
          borderRadius: 4,
          background: C.success,
          border: `2px solid ${C.success}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "#fff",
          fontSize: size * 0.55,
          flexShrink: 0,
        }}
      >
        ✓
      </div>
    ) : (
      <div
        onClick={() => (canDo ? onComplete() : null)}
        title={canDo ? "Mark complete" : "Complete sub-items first"}
        style={{
          width: size,
          height: size,
          borderRadius: 4,
          border: `2px solid ${canDo ? C.teal : C.borderMid}`,
          cursor: canDo ? "pointer" : "not-allowed",
          background: canDo ? "transparent" : C.cardAlt,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {!canDo && <span style={{ fontSize: 9, color: C.textLight }}>🔒</span>}
      </div>
    );

  return (
    <div>
      {!embedded && (
        <div style={S.pageHeader}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <div>
              <div style={S.pageTitle}>100 Day Onboarding Plan</div>
              <div style={S.pageSub}>
                {abp?.firmName} · Post-Approval Structured Onboarding
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: C.teal }}>
                {pct}%
              </div>
              <div style={{ fontSize: 11, color: C.textLight }}>Complete</div>
            </div>
          </div>
        </div>
      )}
      <div
        style={{
          ...S.card,
          display: "flex",
          gap: 20,
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: 14,
        }}
      >
        <div style={{ flex: 1, minWidth: 200 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <span style={{ fontSize: 12, color: C.textMid }}>
              Progress — {doneCount}/{totalItems} tasks
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.teal }}>
              {pct}%
            </span>
          </div>
          <ProgressBar pct={pct} color={pct === 100 ? C.success : C.teal} />
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <label style={{ fontSize: 12, color: C.textMid }}>Plan Start:</label>
          <input
            type="date"
            style={{ ...S.input, width: 155 }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div
          style={{
            textAlign: "center",
            padding: "6px 14px",
            background: elapsed > 100 ? C.dangerBg : C.tealBg,
            borderRadius: 8,
            border: `1px solid ${elapsed > 100 ? C.dangerBorder : C.tealLight}`,
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: elapsed > 100 ? C.danger : C.teal,
            }}
          >
            {elapsed}
          </div>
          <div style={{ fontSize: 10, color: C.textMid }}>Days Elapsed</div>
        </div>
      </div>

      {PLAN.map((item) => {
        const overdue = isOverdue(item);
        const done = isDone(item.id);
        const hasChildren = item.children?.length > 0;
        const gColor = GC[item.group] || C.teal;
        return (
          <div
            key={item.id}
            style={{
              ...S.card,
              marginBottom: 8,
              padding: "12px 16px",
              borderLeft: `4px solid ${done ? C.success : overdue ? C.danger : gColor}`,
              background: overdue && !done ? "#FFF5F5" : C.card,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ marginTop: 1 }}>
                <Checkbox
                  id={item.id}
                  label={item.label}
                  canDo={canComplete(item)}
                  onComplete={() => tryComplete(item.id, item.label)}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {item.no !== "—" && (
                    <span
                      style={{ fontWeight: 700, color: gColor, fontSize: 12 }}
                    >
                      #{item.no}
                    </span>
                  )}
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: 14,
                      color: done ? C.textLight : C.text,
                      textDecoration: done ? "line-through" : "none",
                    }}
                  >
                    {item.label}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      padding: "2px 7px",
                      borderRadius: 10,
                      background: gColor + "18",
                      color: gColor,
                      fontWeight: 600,
                    }}
                  >
                    {item.group}
                  </span>
                  {overdue && !done && (
                    <span
                      style={{
                        fontSize: 10,
                        padding: "2px 7px",
                        borderRadius: 10,
                        background: C.dangerBg,
                        color: C.danger,
                        fontWeight: 700,
                        border: `1px solid ${C.dangerBorder}`,
                      }}
                    >
                      ⚠ OVERDUE (Day {item.day})
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", gap: 16, marginTop: 5 }}>
                  <span
                    style={{
                      fontSize: 11,
                      color: overdue && !done ? C.danger : C.textMid,
                      fontWeight: overdue && !done ? 700 : 400,
                    }}
                  >
                    🕐 By Day {item.day}
                  </span>
                  <span style={{ fontSize: 11, color: C.textMid }}>
                    👤 {item.resp}
                  </span>
                  {done && completed[item.id] && (
                    <span style={{ fontSize: 11, color: C.success }}>
                      ✅ {completed[item.id].date}
                    </span>
                  )}
                </div>
                {done && completed[item.id]?.feedback && (
                  <div
                    style={{
                      fontSize: 12,
                      color: C.textMid,
                      marginTop: 5,
                      fontStyle: "italic",
                      borderLeft: `3px solid ${C.successBorder}`,
                      paddingLeft: 8,
                    }}
                  >
                    "{completed[item.id].feedback}"
                  </div>
                )}
              </div>
              {hasChildren && (
                <button
                  style={S.btnSm}
                  onClick={() =>
                    setExpanded((e) => ({ ...e, [item.id]: !e[item.id] }))
                  }
                >
                  {expanded[item.id] ? "▲" : "▼"} Sub-tasks
                </button>
              )}
            </div>
            {hasChildren && expanded[item.id] && (
              <div
                style={{
                  marginTop: 12,
                  paddingLeft: 34,
                  borderTop: `1px solid ${C.border}`,
                  paddingTop: 12,
                }}
              >
                {item.children.map((cat) => (
                  <div key={cat.id} style={{ marginBottom: 10 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 8,
                        padding: "8px 12px",
                        background: C.cardAlt,
                        borderRadius: 7,
                      }}
                    >
                      <Checkbox
                        id={cat.id}
                        label={cat.label}
                        canDo={canCompleteCAT(cat)}
                        onComplete={() => tryComplete(cat.id, cat.label)}
                        size={18}
                      />
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: 13,
                          color: isDone(cat.id) ? C.textLight : C.teal,
                          textDecoration: isDone(cat.id)
                            ? "line-through"
                            : "none",
                          flex: 1,
                        }}
                      >
                        {cat.label}
                      </span>
                      <span style={{ fontSize: 11, color: C.textLight }}>
                        {cat.resp}
                      </span>
                      {isDone(cat.id) && completed[cat.id] && (
                        <span style={{ fontSize: 10, color: C.success }}>
                          ✅ {completed[cat.id].date}
                        </span>
                      )}
                    </div>
                    {cat.sub?.map((s, si) => (
                      <div
                        key={si}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "6px 12px 6px 20px",
                          borderBottom: `1px solid ${C.border}`,
                        }}
                      >
                        <Checkbox
                          id={`${cat.id}-${si}`}
                          label={s}
                          canDo={true}
                          onComplete={() => tryComplete(`${cat.id}-${si}`, s)}
                          size={16}
                        />
                        <span
                          style={{
                            fontSize: 12,
                            color: isDone(`${cat.id}-${si}`)
                              ? C.textLight
                              : C.textMid,
                            textDecoration: isDone(`${cat.id}-${si}`)
                              ? "line-through"
                              : "none",
                            flex: 1,
                          }}
                        >
                          {s}
                        </span>
                        {isDone(`${cat.id}-${si}`) &&
                          completed[`${cat.id}-${si}`] && (
                            <span style={{ fontSize: 10, color: C.success }}>
                              ✅ {completed[`${cat.id}-${si}`].date}
                            </span>
                          )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {!embedded && (
        <button style={{ ...S.btnS, marginTop: 8 }} onClick={onBack}>
          ← Back
        </button>
      )}

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title="Mark Task as Completed"
      >
        <div style={{ fontSize: 13, color: C.textMid, marginBottom: 10 }}>
          Marking as completed:
        </div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            padding: "10px 14px",
            background: C.tealBg,
            borderRadius: 7,
            marginBottom: 16,
            color: C.teal,
          }}
        >
          {modal?.label}
        </div>
        <div style={{ fontSize: 12, color: C.textMid, marginBottom: 6 }}>
          Date: <strong>{new Date().toLocaleDateString("en-IN")}</strong>
        </div>
        <FG label="Completion Feedback / Notes (required for records)">
          <textarea
            style={{ ...S.textarea, minHeight: 90 }}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="What was accomplished? Any observations, blockers resolved, or next steps..."
          />
        </FG>
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
            marginTop: 14,
          }}
        >
          <button style={S.btnS} onClick={() => setModal(null)}>
            Cancel
          </button>
          <button style={S.btnP} onClick={confirmDone}>
            ✅ Confirm Completion
          </button>
        </div>
      </Modal>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("dashboard");
  const [list, setList] = useState([]);
  const [current, setCurrent] = useState(null);
  const [pendingForm, setPendingForm] = useState(null);

  const viewABP = (id) => {
    setCurrent(list.find((a) => a.id === id));
    setScreen("detail");
  };
  const onFormSubmit = (form) => {
    setPendingForm(form);
    setScreen("initial-rating");
  };
  const onRatingSubmit = (ratingData) => {
    const abp = {
      ...pendingForm,
      id: Date.now(),
      initialRating: ratingData,
      status: "Submitted",
      stage: "Awaiting RSM Assessment",
      assessments: {},
      ceoApproval: null,
    };
    setList((l) => [...l, abp]);
    setCurrent(abp);
    setScreen("detail");
  };
  const onAssessSubmit = (role, data) => {
    const ns = {
      RSM: "Awaiting NSM Assessment",
      NSM: "Awaiting Sales Head Assessment",
      "Sales Head": "Awaiting CFO Assessment",
      CFO: "Awaiting MD Approval",
    };
    const u = {
      ...current,
      assessments: { ...current.assessments, [role]: data },
      status: role === "CFO" ? "Pending CEO" : current.status,
      stage: ns[role] || current.stage,
    };
    setCurrent(u);
    setList((l) => l.map((a) => (a.id === u.id ? u : a)));
    setScreen("detail");
  };
  const onCEOSubmit = (data) => {
    const u = {
      ...current,
      ceoApproval: data,
      status: data.approval,
      stage:
        data.approval === "Approved"
          ? "Approved — 100 Day Plan Active"
          : data.approval,
    };
    setCurrent(u);
    setList((l) => l.map((a) => (a.id === u.id ? u : a)));
    setScreen("detail");
  };

  const renderScreen = () => {
    switch (screen) {
      case "dashboard":
        return (
          <Dashboard
            list={list}
            onNew={() => setScreen("new-abp")}
            onView={viewABP}
          />
        );
      case "new-abp":
        return (
          <ABPForm
            onSubmit={onFormSubmit}
            onCancel={() => setScreen("dashboard")}
          />
        );
      case "initial-rating":
        return (
          <InitialRating
            abp={pendingForm}
            onSubmit={onRatingSubmit}
            onBack={() => setScreen("new-abp")}
          />
        );
      case "detail":
        return (
          <ABPDetail
            abp={current}
            onStartAssess={(r) => setScreen(`assess-${r}`)}
            onGo100Day={() => setScreen("100-day")}
            onBack={() => setScreen("dashboard")}
          />
        );
      case "assess-RSM":
        return (
          <Assessment
            abp={current}
            role="RSM"
            onSubmit={(d) => onAssessSubmit("RSM", d)}
            onBack={() => setScreen("detail")}
          />
        );
      case "assess-NSM":
        return (
          <Assessment
            abp={current}
            role="NSM"
            onSubmit={(d) => onAssessSubmit("NSM", d)}
            onBack={() => setScreen("detail")}
          />
        );
      case "assess-Sales Head":
        return (
          <Assessment
            abp={current}
            role="Sales Head"
            onSubmit={(d) => onAssessSubmit("Sales Head", d)}
            onBack={() => setScreen("detail")}
          />
        );
      case "assess-CFO":
        return (
          <Assessment
            abp={current}
            role="CFO"
            onSubmit={(d) => onAssessSubmit("CFO", d)}
            onBack={() => setScreen("detail")}
          />
        );
      case "assess-CEO":
        return (
          <CEOApproval
            abp={current}
            onSubmit={onCEOSubmit}
            onBack={() => setScreen("detail")}
          />
        );
      case "100-day":
        return (
          <HundredDayPlan abp={current} onBack={() => setScreen("detail")} />
        );
      default:
        return (
          <Dashboard
            list={list}
            onNew={() => setScreen("new-abp")}
            onView={viewABP}
          />
        );
    }
  };

  return (
    <div style={S.app}>
      <div style={S.sidebar}>
        <div style={S.sidebarLogo}>
          <div style={S.sidebarLogoTitle}>INDEF</div>
          <div style={S.sidebarLogoSub}>ABP Onboarding Portal</div>
        </div>
        <div style={{ padding: "10px 0", flex: 1 }}>
          <div
            style={{
              padding: "8px 18px 4px",
              fontSize: 10,
              color: "#334155",
              letterSpacing: 1.5,
              textTransform: "uppercase",
            }}
          >
            Navigation
          </div>
          {[
            { id: "dashboard", icon: "🏠", label: "Dashboard" },
            { id: "new-abp", icon: "➕", label: "New ABP Application" },
          ].map((item) => (
            <div
              key={item.id}
              style={S.navItem(
                screen === item.id ||
                  (item.id === "dashboard" &&
                    [
                      "detail",
                      "assess-RSM",
                      "assess-NSM",
                      "assess-Sales Head",
                      "assess-CFO",
                      "assess-CEO",
                      "100-day",
                    ].includes(screen)),
              )}
              onClick={() => setScreen(item.id)}
            >
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        <div
          style={{
            padding: "14px 18px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        ></div>
      </div>
      <div style={S.main}>{renderScreen()}</div>
    </div>
  );
}
