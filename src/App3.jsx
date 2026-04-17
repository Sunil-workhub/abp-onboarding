import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Bell,
  BellOff,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Database,
  FlaskConical,
  HardDrive,
  Inbox,
  Link2,
  Lock,
  LogOut,
  Mail,
  MessageSquareText,
  Paperclip,
  PlayCircle,
  Plus,
  Send,
  Shield,
  SquareArrowOutUpRight,
  TestTube,
  User,
  UserCheck,
  Users,
  WifiOff,
  Wrench,
  X,
  XCircle,
  Zap,
  ClipboardList,
} from "lucide-react";

const USERS = [
  {
    id: "it_raj",
    name: "Raj Malhotra",
    role: "IT",
    dept: "IT Department",
    avatar: "RM",
  },
  {
    id: "it_priya",
    name: "Priya Kulkarni",
    role: "IT",
    dept: "IT Department",
    avatar: "PK",
  },
  {
    id: "it_vikram",
    name: "Vikram Shah",
    role: "IT",
    dept: "IT Department",
    avatar: "VS",
  },
  {
    id: "it_neha",
    name: "Neha Sharma",
    role: "IT",
    dept: "IT Department",
    avatar: "NS",
  },
  {
    id: "it_arun",
    name: "Arun Patel",
    role: "IT",
    dept: "IT Department",
    avatar: "AP",
  },
  {
    id: "user_ananya",
    name: "Ananya Iyer",
    role: "User",
    dept: "Security",
    avatar: "AI",
  },
  {
    id: "user_suresh",
    name: "Suresh Nair",
    role: "User",
    dept: "Operations",
    avatar: "SN",
  },
  {
    id: "user_meera",
    name: "Meera Joshi",
    role: "User",
    dept: "Finance Systems",
    avatar: "MJ",
  },
  {
    id: "user_deepak",
    name: "Deepak Arora",
    role: "User",
    dept: "Backend Engineering",
    avatar: "DA",
  },
];

const CATEGORY_META = {
  software: {
    label: "Software",
    Icon: Zap,
    pill: "bg-violet-50 text-violet-700 border-violet-200",
    statuses: [
      "Open",
      "Requirement",
      "Discussion",
      "In Progress",
      "IT Testing",
      "Ready for Demo",
      "User Testing",
      "Closed",
    ],
    flowType: "full",
  },
  erp: {
    label: "ERP Enhancement",
    Icon: Database,
    pill: "bg-cyan-50 text-cyan-700 border-cyan-200",
    statuses: [
      "Open",
      "Requirement",
      "Discussion",
      "In Progress",
      "IT Testing",
      "Ready for Demo",
      "User Testing",
      "Closed",
    ],
    flowType: "full",
  },
  hardware: {
    label: "Hardware",
    Icon: HardDrive,
    pill: "bg-amber-50 text-amber-700 border-amber-200",
    statuses: ["Open", "In Progress", "Closed"],
    flowType: "simple",
  },
  networking: {
    label: "Networking",
    Icon: WifiOff,
    pill: "bg-orange-50 text-orange-700 border-orange-200",
    statuses: ["Open", "In Progress", "Closed"],
    flowType: "simple",
  },
  cybersecurity: {
    label: "Cybersecurity",
    Icon: Shield,
    pill: "bg-red-50 text-red-700 border-red-200",
    statuses: ["Open", "In Progress", "Closed"],
    flowType: "simple",
  },
};

const STATUS_META = {
  Open: {
    dot: "bg-slate-400",
    txt: "text-slate-600",
    chip: "bg-slate-100 text-slate-600",
    Icon: Inbox,
  },
  Requirement: {
    dot: "bg-blue-400",
    txt: "text-blue-700",
    chip: "bg-blue-100 text-blue-700",
    Icon: ClipboardList,
  },
  Discussion: {
    dot: "bg-purple-400",
    txt: "text-purple-700",
    chip: "bg-purple-100 text-purple-700",
    Icon: MessageSquareText,
  },
  "In Progress": {
    dot: "bg-blue-500",
    txt: "text-blue-700",
    chip: "bg-blue-100 text-blue-700",
    Icon: Clock3,
  },
  "On Hold": {
    dot: "bg-amber-500",
    txt: "text-amber-700",
    chip: "bg-amber-100 text-amber-700",
    Icon: AlertCircle,
  },
  "IT Testing": {
    dot: "bg-indigo-500",
    txt: "text-indigo-700",
    chip: "bg-indigo-100 text-indigo-700",
    Icon: FlaskConical,
  },
  "Ready for Demo": {
    dot: "bg-teal-500",
    txt: "text-teal-700",
    chip: "bg-teal-100 text-teal-700",
    Icon: PlayCircle,
  },
  "User Testing": {
    dot: "bg-amber-400",
    txt: "text-amber-700",
    chip: "bg-amber-100 text-amber-700",
    Icon: TestTube,
  },
  Closed: {
    dot: "bg-slate-300",
    txt: "text-slate-400",
    chip: "bg-slate-100 text-slate-400",
    Icon: XCircle,
  },
};

const PRIORITIES = ["Critical", "High", "Medium", "Low"];
const TICKET_TYPES = ["Service", "Incident"];
const PRIORITY_PILL = {
  Critical: "bg-red-100 text-red-700 border border-red-200",
  High: "bg-orange-100 text-orange-700 border border-orange-200",
  Medium: "bg-amber-100 text-amber-700 border border-amber-200",
  Low: "bg-slate-100 text-slate-600 border border-slate-200",
};

const todayISO = () => new Date().toISOString().slice(0, 10);
const fmt = (d) =>
  !d
    ? "—"
    : new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
const fmtTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) +
    " " +
    d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  );
};
const daysBetween = (a, b) => {
  const d1 = new Date(a);
  d1.setHours(0, 0, 0, 0);
  const d2 = new Date(b);
  d2.setHours(0, 0, 0, 0);
  return Math.ceil((d2 - d1) / 86400000);
};
const getCatMeta = (id) => CATEGORY_META[id] || CATEGORY_META.software;
const getUser = (id) => USERS.find((u) => u.id === id);
const IT_ENGINEERS = USERS.filter((u) => u.role === "IT").map((u) => u.name);
const ALL_STATUSES = [
  "Open",
  "Requirement",
  "Discussion",
  "In Progress",
  "On Hold",
  "IT Testing",
  "Ready for Demo",
  "User Testing",
  "Closed",
];

const etaBadge = (t) => {
  if (t.status === "Closed")
    return {
      label: "Closed",
      cls: "bg-slate-100 text-slate-500 border border-slate-200",
    };
  if (!t.etaDate)
    return {
      label: "No ETA",
      cls: "bg-slate-100 text-slate-500 border border-slate-200",
    };
  const d = daysBetween(todayISO(), t.etaDate);
  if (d < 0)
    return {
      label: `Overdue ${Math.abs(d)}d`,
      cls: "bg-red-100 text-red-700 border border-red-200",
    };
  if (d === 0)
    return {
      label: "Due today",
      cls: "bg-orange-100 text-orange-700 border border-orange-200",
    };
  if (d <= 7)
    return {
      label: `${d}d left`,
      cls: "bg-amber-100 text-amber-700 border border-amber-200",
    };
  return {
    label: `${d}d left`,
    cls: "bg-slate-100 text-slate-600 border border-slate-200",
  };
};

// Strike groups: groups of up to 3. A group closes when all 3 have responses.
// New group starts automatically after that.
const getStrikeGroups = (strikes = []) => {
  if (!strikes.length) return [];
  const groups = [];
  let cur = [];
  for (const s of strikes) {
    cur.push(s);
    if (cur.length === 3 && cur.every((x) => x.responseReceived)) {
      groups.push([...cur]);
      cur = [];
    }
  }
  if (cur.length) groups.push(cur);
  return groups;
};

const INITIAL_TICKETS = [
  {
    id: 1,
    description: "Firewall rule update for SOC team VPN access",
    category: "cybersecurity",
    submittedBy: "Ananya Iyer",
    priority: "Critical",
    ticketType: "Incident",
    status: "In Progress",
    submittedDate: "2026-03-10",
    itStartDate: "2026-03-13",
    etaDate: "2026-04-15",
    closingDate: null,
    closingNote: "",
    holdRemarks: "",
    attachment: { name: "soc_vpn_requirements.pdf", size: "248 KB" },
    type: "Ticket",
    parentId: null,
    linkedTaskIds: [],
    enrolledByIT: true,
    itAssignees: ["Raj Malhotra"],
    itRemarks: "Assigned to NetOps. 2-day testing post-deployment.",
    statusHistory: [
      { status: "Open", date: "2026-03-10", note: "Submitted by Ananya Iyer" },
      {
        status: "In Progress",
        date: "2026-03-13",
        note: "Enrolled. Assigned to Raj Malhotra.",
      },
    ],
    messages: [
      {
        id: 101,
        userId: "it_raj",
        text: "Reviewed requirements. Starting firewall config changes.",
        ts: "2026-03-13T10:30:00",
      },
      {
        id: 102,
        userId: "user_ananya",
        text: "Thanks Raj. Please ensure port 1194 is open for UDP.",
        ts: "2026-03-13T11:00:00",
      },
    ],
    strikes: [],
    autoClosedAfterStrikes: false,
  },
  {
    id: 2,
    description: "New ERP module for procurement workflow automation",
    category: "erp",
    submittedBy: "Suresh Nair",
    priority: "High",
    ticketType: "Service",
    status: "On Hold",
    submittedDate: "2026-03-01",
    itStartDate: "2026-03-06",
    etaDate: "2026-04-30",
    closingDate: null,
    closingNote: "",
    holdRemarks:
      "Awaiting complete BRD and field mapping sheet from Operations team before development can begin.",
    attachment: { name: "procurement_workflow_spec.docx", size: "1.1 MB" },
    type: "Ticket",
    parentId: null,
    linkedTaskIds: [],
    enrolledByIT: true,
    itAssignees: ["Priya Kulkarni"],
    itRemarks: "Cannot proceed without complete BRD.",
    statusHistory: [
      { status: "Open", date: "2026-03-01", note: "Ticket submitted" },
      {
        status: "Requirement",
        date: "2026-03-06",
        note: "IT reviewing requirements.",
      },
      {
        status: "On Hold",
        date: "2026-03-22",
        note: "Put on hold — Awaiting complete BRD and field mapping sheet.",
      },
    ],
    messages: [
      {
        id: 201,
        userId: "it_priya",
        text: "Suresh, we need the complete BRD with field mappings.",
        ts: "2026-03-22T09:00:00",
      },
      {
        id: 202,
        userId: "user_suresh",
        text: "Will share by this week.",
        ts: "2026-03-22T09:30:00",
      },
    ],
    strikes: [
      {
        id: 1001,
        strikeNumber: 1,
        sentDate: "2026-03-23",
        mailId: "suresh.nair@enlife.com",
        note: "Hi Suresh, awaiting BRD document. Please share at the earliest.",
        responseReceived: false,
        responseDate: null,
        responseNote: "",
      },
      {
        id: 1002,
        strikeNumber: 2,
        sentDate: "2026-03-30",
        mailId: "suresh.nair@enlife.com",
        note: "Second follow-up: Ticket on hold for 8 days. Please share requirements or confirm timeline.",
        responseReceived: false,
        responseDate: null,
        responseNote: "",
      },
    ],
    autoClosedAfterStrikes: false,
  },
  {
    id: 3,
    description:
      "Laptop replacement for Finance team — 5 units (Dell Latitude)",
    category: "hardware",
    submittedBy: "Meera Joshi",
    priority: "Medium",
    ticketType: "Service",
    status: "Closed",
    submittedDate: "2026-02-15",
    itStartDate: "2026-02-18",
    etaDate: "2026-03-15",
    closingDate: "2026-03-14",
    closingNote:
      "All 5 Dell Latitude 5540 units delivered, imaged, and handed over. Asset tags logged in CMDB.",
    holdRemarks: "",
    attachment: null,
    type: "Ticket",
    parentId: null,
    linkedTaskIds: [4],
    enrolledByIT: true,
    itAssignees: ["Vikram Shah"],
    itRemarks: "Procurement approved. Dell Latitude 5540 selected.",
    statusHistory: [
      { status: "Open", date: "2026-02-15", note: "Ticket submitted" },
      {
        status: "In Progress",
        date: "2026-02-18",
        note: "Enrolled. Procurement initiated.",
      },
      {
        status: "Closed",
        date: "2026-03-14",
        note: "Closed — All 5 units delivered and configured.",
      },
    ],
    messages: [
      {
        id: 301,
        userId: "it_vikram",
        text: "Procurement approved. Ordering 5x Dell Latitude 5540.",
        ts: "2026-02-18T09:00:00",
      },
      {
        id: 302,
        userId: "user_meera",
        text: "Great, please ensure 16GB RAM.",
        ts: "2026-02-18T09:15:00",
      },
      {
        id: 303,
        userId: "it_vikram",
        text: "Confirmed — 16GB RAM. Expected delivery: 10 Mar.",
        ts: "2026-02-18T10:00:00",
      },
    ],
    strikes: [],
    autoClosedAfterStrikes: false,
  },
  {
    id: 4,
    description: "Register asset tags and warranty entries for 5 new laptops",
    category: "hardware",
    submittedBy: "IT Team",
    priority: "Low",
    ticketType: "Service",
    status: "Open",
    submittedDate: "2026-03-15",
    itStartDate: null,
    etaDate: null,
    closingDate: null,
    closingNote: "",
    holdRemarks: "",
    attachment: null,
    type: "Linked Ticket",
    parentId: 3,
    linkedTaskIds: [],
    enrolledByIT: false,
    itAssignees: [],
    itRemarks: "",
    statusHistory: [
      {
        status: "Open",
        date: "2026-03-15",
        note: "Follow-up task created post laptop delivery",
      },
    ],
    messages: [],
    strikes: [],
    autoClosedAfterStrikes: false,
  },
  {
    id: 5,
    description: "Office 365 license migration for 80 users (E3 → E5 upgrade)",
    category: "software",
    submittedBy: "Deepak Arora",
    priority: null,
    ticketType: null,
    status: "Open",
    submittedDate: "2026-04-01",
    itStartDate: null,
    etaDate: null,
    closingDate: null,
    closingNote: "",
    holdRemarks: "",
    attachment: { name: "user_license_list.xlsx", size: "54 KB" },
    type: "Ticket",
    parentId: null,
    linkedTaskIds: [],
    enrolledByIT: false,
    itAssignees: [],
    itRemarks: "",
    statusHistory: [
      { status: "Open", date: "2026-04-01", note: "Submitted by Deepak Arora" },
    ],
    messages: [],
    strikes: [],
    autoClosedAfterStrikes: false,
  },
];

// ── LOGIN ─────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [sel, setSel] = useState(null);
  const itU = USERS.filter((u) => u.role === "IT");
  const regU = USERS.filter((u) => u.role === "User");
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');*{box-sizing:border-box;}body{font-family:'Plus Jakarta Sans',system-ui,sans-serif;margin:0;}`}</style>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
            <Wrench className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">IT Helpdesk</h1>
          <p className="text-slate-400 text-sm mt-1">
            Enlife System — Select your profile to continue
          </p>
        </div>
        {[
          {
            list: itU,
            label: "IT Department",
            icon: <Lock className="w-3 h-3" />,
            sel_color: "blue",
          },
          {
            list: regU,
            label: "Users",
            icon: <Users className="w-3 h-3" />,
            sel_color: "emerald",
          },
        ].map(({ list, label, icon, sel_color }) => (
          <div
            key={label}
            className="bg-slate-900 rounded-2xl border border-slate-800 p-5 mb-4"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
              {icon}
              {label}
            </p>
            <div className="space-y-2">
              {list.map((u) => (
                <button
                  key={u.id}
                  onClick={() => setSel(u.id)}
                  className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 border text-left transition-all ${sel === u.id ? `border-${sel_color}-500 bg-${sel_color}-500/10` : "border-slate-700 hover:border-slate-600 hover:bg-slate-800"}`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl bg-${sel_color}-500/20 flex items-center justify-center text-${sel_color}-400 text-xs font-black flex-none`}
                  >
                    {u.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{u.name}</p>
                    <p className="text-xs text-slate-400">{u.dept}</p>
                  </div>
                  {sel === u.id && (
                    <CheckCircle2
                      className={`w-4 h-4 text-${sel_color}-400 ml-auto flex-none`}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
        <button
          onClick={() => sel && onLogin(sel)}
          disabled={!sel}
          className={`w-full h-12 rounded-xl text-sm font-bold transition-all ${sel ? "bg-white text-slate-900 hover:bg-slate-100" : "bg-slate-800 text-slate-600 cursor-not-allowed"}`}
        >
          {sel ? `Continue as ${getUser(sel)?.name}` : "Select a profile"}
        </button>
      </div>
    </div>
  );
}

// ── APP ROOT ──────────────────────────────────────────────────────────────────
export default function App() {
  const [currentUserId, setCU] = useState(null);
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [selectedId, setSelectedId] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    category: "software",
    description: "",
    submittedBy: "",
    attachment: null,
    type: "Ticket",
    parentId: "",
  });
  const [createErrors, setCreateErrors] = useState({});
  const [enrollForm, setEnrollForm] = useState({
    itAssignees: [],
    itStartDate: todayISO(),
    etaDate: "",
    itRemarks: "",
    priority: "Medium",
    ticketType: "Service",
  });
  const [enrollErrors, setEnrollErrors] = useState({});
  const [newMsg, setNewMsg] = useState("");

  // On Hold mini-modal
  const [holdModal, setHoldModal] = useState(false);
  const [holdNote, setHoldNote] = useState("");
  const [holdError, setHoldError] = useState("");

  // Close mini-modal
  const [closeModal, setCloseModal] = useState(false);
  const [closeNote, setCloseNote] = useState("");
  const [closeError, setCloseError] = useState("");

  // Strike
  const [strikeForm, setStrikeForm] = useState({ mailId: "", note: "" });
  const [strikeErrors, setStrikeErrors] = useState({});
  const [responseForm, setResponseForm] = useState({});

  const currentUser = getUser(currentUserId);
  const isIT = currentUser?.role === "IT";
  const sel = tickets.find((t) => t.id === selectedId) || null;

  useEffect(() => {
    setEnrollForm({
      itAssignees: [],
      itStartDate: todayISO(),
      etaDate: "",
      itRemarks: "",
      priority: "Medium",
      ticketType: "Service",
    });
    setEnrollErrors({});
    setHoldModal(false);
    setHoldNote("");
    setHoldError("");
    setCloseModal(false);
    setCloseNote("");
    setCloseError("");
    setStrikeForm({ mailId: "", note: "" });
    setStrikeErrors({});
    setResponseForm({});
  }, [selectedId]);

  const patch = (id, data) =>
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t)),
    );

  const stats = useMemo(() => {
    const overdue = tickets.filter(
      (t) =>
        t.etaDate &&
        t.status !== "Closed" &&
        daysBetween(todayISO(), t.etaDate) < 0,
    ).length;
    return {
      total: tickets.length,
      open: tickets.filter((t) => t.status === "Open").length,
      inProgress: tickets.filter((t) => t.status === "In Progress").length,
      onHold: tickets.filter((t) => t.status === "On Hold").length,
      closed: tickets.filter((t) => t.status === "Closed").length,
      overdue,
    };
  }, [tickets]);

  const fmt_bytes = (b) => {
    if (!b) return "";
    if (b < 1024) return b + "B";
    if (b < 1048576) return (b / 1024).toFixed(1) + "KB";
    return (b / 1048576).toFixed(1) + "MB";
  };

  const enrollTicket = () => {
    const errs = {};
    if (!enrollForm.itAssignees.length)
      errs.itAssignees = "At least one assignee required.";
    if (!enrollForm.itStartDate) errs.itStartDate = "Start date required.";
    if (!enrollForm.etaDate) errs.etaDate = "ETA required.";
    if (!enrollForm.priority) errs.priority = "Priority required.";
    if (!enrollForm.ticketType) errs.ticketType = "Ticket type required.";
    if (
      enrollForm.etaDate &&
      enrollForm.itStartDate &&
      enrollForm.etaDate < enrollForm.itStartDate
    )
      errs.etaDate = "ETA must be after start date.";
    setEnrollErrors(errs);
    if (Object.keys(errs).length) return;
    const cat = getCatMeta(sel.category);
    const ns = cat.flowType === "full" ? "Requirement" : "In Progress";
    patch(sel.id, {
      enrolledByIT: true,
      itAssignees: enrollForm.itAssignees,
      itStartDate: enrollForm.itStartDate,
      etaDate: enrollForm.etaDate,
      itRemarks: enrollForm.itRemarks.trim(),
      priority: enrollForm.priority,
      ticketType: enrollForm.ticketType,
      status: ns,
      statusHistory: [
        ...sel.statusHistory,
        {
          status: ns,
          date: enrollForm.itStartDate,
          note: `Enrolled. Assigned to ${enrollForm.itAssignees.join(", ")}.`,
        },
      ],
    });
  };

  const moveStatus = (ns, note = "") => {
    patch(sel.id, {
      status: ns,
      statusHistory: [
        ...sel.statusHistory,
        { status: ns, date: todayISO(), note: note || `Moved to ${ns}` },
      ],
    });
  };

  const submitHold = () => {
    if (!holdNote.trim()) {
      setHoldError("Hold reason is required.");
      return;
    }
    setHoldError("");
    patch(sel.id, {
      status: "On Hold",
      holdRemarks: holdNote.trim(),
      statusHistory: [
        ...sel.statusHistory,
        {
          status: "On Hold",
          date: todayISO(),
          note: `Put on hold — ${holdNote.trim()}`,
        },
      ],
    });
    setHoldModal(false);
    setHoldNote("");
  };

  const submitClose = () => {
    if (!closeNote.trim()) {
      setCloseError("Closing remarks are required.");
      return;
    }
    setCloseError("");
    patch(sel.id, {
      status: "Closed",
      closingDate: todayISO(),
      closingNote: closeNote.trim(),
      statusHistory: [
        ...sel.statusHistory,
        {
          status: "Closed",
          date: todayISO(),
          note: `Closed — ${closeNote.trim()}`,
        },
      ],
    });
    setCloseModal(false);
    setCloseNote("");
  };

  const sendStrike = () => {
    const errs = {};
    if (!strikeForm.mailId.trim()) errs.mailId = "Mail ID required.";
    if (!strikeForm.note.trim()) errs.note = "Follow-up message required.";
    setStrikeErrors(errs);
    if (Object.keys(errs).length) return;
    const strikes = sel.strikes || [];
    const groups = getStrikeGroups(strikes);
    const activeGroup =
      groups.length > 0 &&
      !groups[groups.length - 1].every((s) => s.responseReceived)
        ? groups[groups.length - 1]
        : [];
    const numInGroup = activeGroup.length + 1;
    const strike = {
      id: Date.now(),
      strikeNumber: numInGroup,
      sentDate: todayISO(),
      mailId: strikeForm.mailId.trim(),
      note: strikeForm.note.trim(),
      responseReceived: false,
      responseDate: null,
      responseNote: "",
    };
    patch(sel.id, {
      strikes: [...strikes, strike],
      statusHistory: [
        ...sel.statusHistory,
        {
          status: "On Hold",
          date: todayISO(),
          note: `Strike ${numInGroup} follow-up sent to ${strikeForm.mailId.trim()}.`,
        },
      ],
    });
    setStrikeForm({ mailId: "", note: "" });
  };

  const markResponse = (strikeId) => {
    const note = (responseForm[strikeId]?.note || "").trim();
    if (!note) {
      setResponseForm((p) => ({
        ...p,
        [strikeId]: { ...p[strikeId], error: "Response note required." },
      }));
      return;
    }
    setResponseForm((p) => ({ ...p, [strikeId]: { note: "", error: "" } }));
    const updated = (sel.strikes || []).map((s) =>
      s.id === strikeId
        ? {
            ...s,
            responseReceived: true,
            responseDate: todayISO(),
            responseNote: note,
          }
        : s,
    );
    const sn = updated.find((s) => s.id === strikeId)?.strikeNumber;
    patch(sel.id, {
      strikes: updated,
      statusHistory: [
        ...sel.statusHistory,
        {
          status: "On Hold",
          date: todayISO(),
          note: `Response received on Strike ${sn}.`,
        },
      ],
    });
  };

  const autoClose = () => {
    patch(sel.id, {
      status: "Closed",
      closingDate: todayISO(),
      autoClosedAfterStrikes: true,
      closingNote: "Ticket auto-closed after 3 unanswered follow-ups.",
      statusHistory: [
        ...sel.statusHistory,
        {
          status: "Closed",
          date: todayISO(),
          note: "Auto-closed — 3 follow-ups with no response.",
        },
      ],
    });
  };

  const sendMessage = () => {
    if (!newMsg.trim()) return;
    const msg = {
      id: Date.now(),
      userId: currentUserId,
      text: newMsg.trim(),
      ts: new Date().toISOString(),
    };
    patch(sel.id, { messages: [...(sel.messages || []), msg] });
    setNewMsg("");
  };

  const createTicket = () => {
    const errs = {};
    if (!createForm.description.trim())
      errs.description = "Description required.";
    if (!createForm.submittedBy.trim())
      errs.submittedBy = "Submitter required.";
    if (createForm.type === "Linked Ticket" && !createForm.parentId)
      errs.parentId = "Parent ticket required.";
    setCreateErrors(errs);
    if (Object.keys(errs).length) return;
    const nid = Date.now();
    const fi = createForm.attachment
      ? {
          name: createForm.attachment.name,
          size: fmt_bytes(createForm.attachment.size),
        }
      : null;
    const t = {
      id: nid,
      description: createForm.description.trim(),
      category: createForm.category,
      submittedBy: createForm.submittedBy.trim(),
      priority: null,
      ticketType: null,
      status: "Open",
      submittedDate: todayISO(),
      itStartDate: null,
      etaDate: null,
      closingDate: null,
      closingNote: "",
      holdRemarks: "",
      attachment: fi,
      type: createForm.type,
      parentId:
        createForm.type === "Linked Ticket"
          ? Number(createForm.parentId)
          : null,
      linkedTaskIds: [],
      enrolledByIT: false,
      itAssignees: [],
      itRemarks: "",
      statusHistory: [
        {
          status: "Open",
          date: todayISO(),
          note: `Submitted by ${createForm.submittedBy.trim()}`,
        },
      ],
      messages: [],
      strikes: [],
      autoClosedAfterStrikes: false,
    };
    setTickets((prev) => {
      let next = [t, ...prev];
      if (t.parentId)
        next = next.map((x) =>
          x.id === t.parentId
            ? { ...x, linkedTaskIds: [...(x.linkedTaskIds || []), nid] }
            : x,
        );
      return next;
    });
    setSelectedId(nid);
    setCreateOpen(false);
    setCreateErrors({});
    setCreateForm({
      category: "software",
      description: "",
      submittedBy: "",
      attachment: null,
      type: "Ticket",
      parentId: "",
    });
  };

  const getById = (id) => tickets.find((t) => t.id === id);
  const closedTickets = tickets.filter((t) => t.status === "Closed");

  if (!currentUserId)
    return (
      <LoginScreen
        onLogin={(id) => {
          setCU(id);
          setSelectedId(null);
        }}
      />
    );

  const displayCols = ALL_STATUSES.filter((s) => {
    const items = tickets.filter((t) => t.status === s);
    return items.length > 0 || ["Open", "In Progress", "Closed"].includes(s);
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;}body{font-family:'Plus Jakarta Sans',system-ui,sans-serif;margin:0;}
        .mono{font-family:'JetBrains Mono',monospace;}
        .thin-scroll::-webkit-scrollbar{width:4px;}.thin-scroll::-webkit-scrollbar-track{background:transparent;}.thin-scroll::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:99px;}
        .truncate-1{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
        .modal-overlay{position:fixed;inset:0;z-index:50;background:rgba(15,23,42,0.65);display:flex;align-items:center;justify-content:center;padding:1rem;}
        .modal-box{background:#fff;border-radius:1.25rem;border:1px solid #e2e8f0;box-shadow:0 25px 60px rgba(0,0,0,0.2);width:100%;max-width:940px;max-height:92vh;display:flex;flex-direction:column;overflow:hidden;}
        .mini-modal{background:#fff;border-radius:1rem;border:1px solid #e2e8f0;box-shadow:0 20px 50px rgba(0,0,0,0.25);width:100%;max-width:440px;}
        .cb-it{background:#1e293b;color:#f8fafc;border-radius:1rem 1rem 0.25rem 1rem;padding:.5rem .875rem;max-width:78%;font-size:.8125rem;line-height:1.5;}
        .cb-user{background:#f1f5f9;color:#1e293b;border-radius:1rem 1rem 1rem 0.25rem;padding:.5rem .875rem;max-width:78%;font-size:.8125rem;line-height:1.5;}
        .cb-self{background:#3b82f6;color:#fff;border-radius:1rem 1rem 0.25rem 1rem;padding:.5rem .875rem;max-width:78%;font-size:.8125rem;line-height:1.5;}
      `}</style>
      <div className="h-screen overflow-hidden bg-slate-100 text-slate-900 flex flex-col">
        <header className="flex-none border-b border-slate-200 bg-white shadow-sm">
          <div className="mx-auto max-w-[1800px] px-5 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center flex-none">
                  <Wrench className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-extrabold tracking-tight text-slate-900 leading-tight">
                    IT Helpdesk · Enlife System
                  </h1>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Category-driven ticket management
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 border ${isIT ? "border-blue-200 bg-blue-50" : "border-emerald-200 bg-emerald-50"}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${isIT ? "bg-blue-500 text-white" : "bg-emerald-500 text-white"}`}
                  >
                    {currentUser.avatar}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 leading-none">
                      {currentUser.name}
                    </p>
                    <p
                      className={`text-[10px] font-semibold ${isIT ? "text-blue-600" : "text-emerald-600"}`}
                    >
                      {isIT ? "IT Department" : currentUser.dept}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setCreateOpen(true)}
                  className={`inline-flex h-9 items-center gap-2 rounded-xl px-4 text-sm font-bold text-white transition-colors ${isIT ? "bg-slate-900 hover:bg-slate-800" : "bg-emerald-700 hover:bg-emerald-800"}`}
                >
                  <Plus className="h-4 w-4" />
                  {isIT ? "New Ticket" : "Raise Ticket"}
                </button>
                <button
                  onClick={() => setCU(null)}
                  className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-300 px-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                { l: "Total", v: stats.total, t: "slate" },
                { l: "Open", v: stats.open, t: "slate" },
                { l: "In Progress", v: stats.inProgress, t: "blue" },
                { l: "On Hold", v: stats.onHold, t: "amber" },
                { l: "Closed", v: stats.closed, t: "slate" },
                { l: "Overdue", v: stats.overdue, t: "red" },
              ].map((s) => (
                <div
                  key={s.l}
                  className={`rounded-xl border px-3 py-2 ${s.t === "red" ? "bg-red-50 border-red-200 text-red-700" : s.t === "blue" ? "bg-blue-50 border-blue-200 text-blue-700" : s.t === "amber" ? "bg-amber-50 border-amber-200 text-amber-700" : "bg-slate-50 border-slate-200 text-slate-700"}`}
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                    {s.l}
                  </p>
                  <p className="text-xl font-extrabold leading-none mt-0.5">
                    {s.v}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-auto overflow-y-hidden p-4 min-h-0">
          <div
            className="flex gap-3 h-full"
            style={{ minWidth: `${displayCols.length * 215}px` }}
          >
            {displayCols.map((status) => {
              const items = tickets.filter((t) => t.status === status);
              const meta = STATUS_META[status] || STATUS_META["Open"];
              const Icon = meta.Icon;
              return (
                <div
                  key={status}
                  className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm min-h-0"
                  style={{ minWidth: "200px", flex: "1" }}
                >
                  <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2.5 flex-none">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
                      <Icon className={`w-3.5 h-3.5 ${meta.txt}`} />
                      <span className={`text-xs font-bold ${meta.txt}`}>
                        {status}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.chip}`}
                    >
                      {items.length}
                    </span>
                  </div>
                  <div className="flex-1 overflow-y-auto thin-scroll p-2 space-y-2 bg-slate-50/50 min-h-0">
                    {items.length === 0 ? (
                      <div className="flex items-center justify-center h-14 rounded-xl border border-dashed border-slate-200 bg-white text-[11px] text-slate-400">
                        No tickets
                      </div>
                    ) : (
                      items.map((t) => (
                        <TicketCard
                          key={t.id}
                          ticket={t}
                          parent={t.parentId ? getById(t.parentId) : null}
                          linkedCount={t.linkedTaskIds?.length || 0}
                          active={t.id === selectedId}
                          onClick={() => setSelectedId(t.id)}
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {sel && (
        <TicketModal
          ticket={sel}
          parent={sel.parentId ? getById(sel.parentId) : null}
          linkedTickets={tickets.filter((t) =>
            sel.linkedTaskIds?.includes(t.id),
          )}
          currentUser={currentUser}
          isIT={isIT}
          onClose={() => setSelectedId(null)}
          onOpenLinked={(id) => setSelectedId(id)}
          enrollForm={enrollForm}
          setEnrollForm={setEnrollForm}
          enrollErrors={enrollErrors}
          onEnroll={enrollTicket}
          onMoveStatus={moveStatus}
          onPutOnHold={() => {
            setHoldNote("");
            setHoldError("");
            setHoldModal(true);
          }}
          onCloseTicket={() => {
            setCloseNote("");
            setCloseError("");
            setCloseModal(true);
          }}
          strikeForm={strikeForm}
          setStrikeForm={setStrikeForm}
          strikeErrors={strikeErrors}
          onSendStrike={sendStrike}
          responseForm={responseForm}
          setResponseForm={setResponseForm}
          onMarkResponse={markResponse}
          onAutoClose={autoClose}
          newMsg={newMsg}
          setNewMsg={setNewMsg}
          onSendMsg={sendMessage}
          allTickets={tickets}
        />
      )}

      {holdModal && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setHoldModal(false)}
        >
          <div className="mini-modal p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Put Ticket On Hold
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Document the reason before pausing work.
                </p>
              </div>
              <button
                onClick={() => setHoldModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <Field label="Reason for Hold" error={holdError}>
              <textarea
                rows={4}
                value={holdNote}
                onChange={(e) => setHoldNote(e.target.value)}
                placeholder="e.g. Awaiting vendor quote, pending user input, blocked by dependency..."
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 resize-none"
              />
            </Field>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setHoldModal(false)}
                className="flex-1 h-10 rounded-xl border border-slate-300 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={submitHold}
                className="flex-1 h-10 rounded-xl bg-amber-500 text-sm font-bold text-white hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
              >
                <AlertCircle className="w-4 h-4" />
                Put On Hold
              </button>
            </div>
          </div>
        </div>
      )}

      {closeModal && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setCloseModal(false)}
        >
          <div className="mini-modal p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Close Ticket
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Add closing remarks before finalising.
                </p>
              </div>
              <button
                onClick={() => setCloseModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <Field label="Closing Remarks" error={closeError}>
              <textarea
                rows={4}
                value={closeNote}
                onChange={(e) => setCloseNote(e.target.value)}
                placeholder="Describe outcome, what was done, handover notes..."
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400 resize-none"
              />
            </Field>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setCloseModal(false)}
                className="flex-1 h-10 rounded-xl border border-slate-300 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={submitClose}
                className="flex-1 h-10 rounded-xl bg-slate-800 text-sm font-bold text-white hover:bg-slate-900 transition-colors flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Confirm Close
              </button>
            </div>
          </div>
        </div>
      )}

      {createOpen && (
        <CreateModal
          form={createForm}
          errors={createErrors}
          closedTickets={closedTickets}
          onChange={setCreateForm}
          onClose={() => {
            setCreateOpen(false);
            setCreateErrors({});
          }}
          onSubmit={createTicket}
        />
      )}
    </>
  );
}

// ── TICKET CARD ───────────────────────────────────────────────────────────────
function TicketCard({ ticket, parent, linkedCount, active, onClick }) {
  const cat = getCatMeta(ticket.category);
  const CIcon = cat.Icon;
  const badge = etaBadge(ticket);
  const groups = getStrikeGroups(ticket.strikes || []);
  const ag =
    groups.length > 0 &&
    !groups[groups.length - 1].every((s) => s.responseReceived)
      ? groups[groups.length - 1]
      : null;
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-xl border bg-white p-2.5 text-left shadow-sm transition-all duration-150 ${active ? "border-slate-800 ring-2 ring-slate-200 shadow-md" : "border-slate-200 hover:border-slate-300 hover:shadow"}`}
    >
      <div className="flex items-center gap-1 mb-1.5 flex-wrap">
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full border flex-none ${cat.pill}`}
        >
          <CIcon className="w-2.5 h-2.5" />
          {cat.label}
        </span>
        {ticket.ticketType && (
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-none ${ticket.ticketType === "Incident" ? "bg-red-100 text-red-700 border border-red-200" : "bg-sky-100 text-sky-700 border border-sky-200"}`}
          >
            {ticket.ticketType}
          </span>
        )}
        {ticket.type === "Linked Ticket" && (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700 border border-violet-200 flex-none">
            Linked
          </span>
        )}
        {ticket.priority && (
          <span
            className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-md flex-none ${PRIORITY_PILL[ticket.priority]}`}
          >
            {ticket.priority}
          </span>
        )}
      </div>
      <p className="text-[13px] font-semibold text-slate-800 truncate-1 mb-1">
        {ticket.description}
      </p>
      <div className="flex items-center gap-1.5 text-[10px]">
        <User className="w-2.5 h-2.5 text-slate-400 flex-none" />
        <span className="text-slate-500 truncate flex-1 min-w-0">
          {ticket.submittedBy}
        </span>
        <span
          className={`font-semibold px-1.5 py-0.5 rounded-full flex-none ${badge.cls}`}
        >
          {badge.label}
        </span>
      </div>
      {ag && ag.length > 0 && ag.every((s) => !s.responseReceived) && (
        <div className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 rounded-lg px-2 py-1 border border-amber-200">
          <Bell className="w-2.5 h-2.5" />
          {ag.length}/3 follow-ups · no response
        </div>
      )}
      {ticket.messages?.length > 0 && (
        <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
          <MessageSquareText className="w-2.5 h-2.5" />
          <span>
            {ticket.messages.length} msg
            {ticket.messages.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </button>
  );
}

// ── TICKET MODAL ──────────────────────────────────────────────────────────────
function TicketModal({
  ticket,
  parent,
  linkedTickets,
  currentUser,
  isIT,
  onClose,
  onOpenLinked,
  enrollForm,
  setEnrollForm,
  enrollErrors,
  onEnroll,
  onMoveStatus,
  onPutOnHold,
  onCloseTicket,
  strikeForm,
  setStrikeForm,
  strikeErrors,
  onSendStrike,
  responseForm,
  setResponseForm,
  onMarkResponse,
  onAutoClose,
  newMsg,
  setNewMsg,
  onSendMsg,
  allTickets,
}) {
  const [tab, setTab] = useState("details");
  const cat = getCatMeta(ticket.category);
  const CIcon = cat.Icon;
  const sm = STATUS_META[ticket.status] || STATUS_META["Open"];
  const badge = etaBadge(ticket);
  const isClosed = ticket.status === "Closed";
  const isOnHold = ticket.status === "On Hold";
  const catFlow = cat.statuses;
  const curIdx = catFlow.indexOf(ticket.status);
  const endRef = useRef(null);

  useEffect(() => {
    setTab("details");
  }, [ticket.id]);
  useEffect(() => {
    if (tab === "discussion")
      endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket.messages, tab]);

  const getById = (id) => allTickets.find((t) => t.id === id);
  const toggleAssignee = (name) =>
    setEnrollForm((p) => ({
      ...p,
      itAssignees: p.itAssignees.includes(name)
        ? p.itAssignees.filter((n) => n !== name)
        : [...p.itAssignees, name],
    }));

  // Next stage statuses (skips On Hold and Closed — those have dedicated buttons)
  const nextStatuses =
    isIT && !isClosed && !isOnHold
      ? catFlow.filter((s, i) => i > curIdx && s !== "Closed")
      : [];

  // Strike logic
  const allStrikes = ticket.strikes || [];
  const groups = getStrikeGroups(allStrikes);
  const activeGroup =
    groups.length > 0 &&
    !groups[groups.length - 1].every((s) => s.responseReceived)
      ? groups[groups.length - 1]
      : [];
  const canSendNext = isOnHold && activeGroup.length < 3;
  const allActiveNoReply =
    activeGroup.length === 3 && activeGroup.every((s) => !s.responseReceived);
  const prevGroups = groups.length > 1 ? groups.slice(0, -1) : [];
  const lastGroupAllDone =
    groups.length > 0 &&
    groups[groups.length - 1].every((s) => s.responseReceived);

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-box">
        {/* Header */}
        <div className="flex-none border-b border-slate-100 px-6 py-4">
          <div className="flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-1.5 mb-2">
                <span
                  className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${cat.pill}`}
                >
                  <CIcon className="w-3 h-3" />
                  {cat.label}
                </span>
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${sm.chip}`}
                >
                  {ticket.status}
                </span>
                {ticket.ticketType && (
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${ticket.ticketType === "Incident" ? "bg-red-100 text-red-700 border-red-200" : "bg-sky-100 text-sky-700 border-sky-200"}`}
                  >
                    {ticket.ticketType}
                  </span>
                )}
                {ticket.priority && (
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${PRIORITY_PILL[ticket.priority]}`}
                  >
                    {ticket.priority}
                  </span>
                )}
                {ticket.type === "Linked Ticket" && (
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-violet-100 text-violet-700 border border-violet-200">
                    Linked
                  </span>
                )}
              </div>
              <p className="text-base font-bold text-slate-900 leading-snug">
                {ticket.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 rounded-full px-2.5 py-1 text-xs font-medium">
                  <User className="w-3 h-3" />
                  {ticket.submittedBy}
                </span>
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 rounded-full px-2.5 py-1 text-xs font-medium">
                  <CalendarDays className="w-3 h-3" />
                  Submitted {fmt(ticket.submittedDate)}
                </span>
                {ticket.itAssignees?.length > 0 && (
                  <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2.5 py-1 text-xs font-medium">
                    <UserCheck className="w-3 h-3" />
                    {ticket.itAssignees.join(", ")}
                  </span>
                )}
                {ticket.attachment && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-2.5 py-1">
                    <Paperclip className="w-3 h-3" />
                    {ticket.attachment.name}
                    <span className="text-blue-400 mono font-normal">
                      {ticket.attachment.size}
                    </span>
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 flex-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-3">
            <div className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Active
              </p>
              <p className="text-sm font-bold text-slate-700 mt-0.5">
                {daysBetween(ticket.submittedDate, todayISO())}d
              </p>
            </div>
            <div className={`rounded-xl border px-3 py-2 ${badge.cls}`}>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                ETA
              </p>
              <p className="text-sm font-bold mt-0.5">{badge.label}</p>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Msgs
              </p>
              <p className="text-sm font-bold text-slate-700 mt-0.5">
                {ticket.messages?.length || 0}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Strikes
              </p>
              <p className="text-sm font-bold text-slate-700 mt-0.5">
                {allStrikes.length}
              </p>
            </div>
          </div>
          {/* Flow progress bar */}
          <div className="mt-3 flex items-center gap-1 overflow-x-auto pb-1">
            {catFlow.map((s, i) => {
              const done = curIdx > i;
              const curr = ticket.status === s;
              const m = STATUS_META[s] || STATUS_META["Open"];
              return (
                <div key={s} className="flex items-center gap-1 flex-none">
                  <div
                    className={`text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap ${curr ? m.chip + " border border-current/20" : done ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"}`}
                  >
                    {done && "✓ "}
                    {s}
                  </div>
                  {i < catFlow.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-slate-300 flex-none" />
                  )}
                </div>
              );
            })}
            {isOnHold && (
              <div className="flex items-center gap-1 flex-none ml-2">
                <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-amber-100 text-amber-700 border border-amber-200">
                  ⏸ On Hold
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mt-3">
            {["details", "discussion", "history"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg capitalize transition-all ${tab === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                {t}
                {t === "discussion" && ticket.messages?.length > 0
                  ? ` (${ticket.messages.length})`
                  : ""}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto thin-scroll min-h-0">
          {tab === "details" && (
            <div className="p-6 space-y-4">
              {/* Linked tickets */}
              {(parent || linkedTickets.length > 0) && (
                <Section title="Linked Tickets">
                  <div className="mt-3 space-y-2">
                    {parent && (
                      <button
                        onClick={() => onOpenLinked(parent.id)}
                        className="w-full flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left hover:bg-slate-100"
                      >
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
                            Parent Ticket
                          </p>
                          <p className="text-sm font-semibold text-slate-800 truncate">
                            {parent.description}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {parent.status}
                          </p>
                        </div>
                        <SquareArrowOutUpRight className="w-4 h-4 text-slate-400 flex-none ml-3" />
                      </button>
                    )}
                    {linkedTickets.map((lt) => (
                      <button
                        key={lt.id}
                        onClick={() => onOpenLinked(lt.id)}
                        className="w-full flex items-center justify-between rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-left hover:bg-violet-100"
                      >
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-0.5">
                            Linked Ticket
                          </p>
                          <p className="text-sm font-semibold text-violet-900 truncate">
                            {lt.description}
                          </p>
                          <p className="text-xs text-violet-500 mt-0.5">
                            {lt.status} · ETA {fmt(lt.etaDate)}
                          </p>
                        </div>
                        <SquareArrowOutUpRight className="w-4 h-4 text-violet-400 flex-none ml-3" />
                      </button>
                    ))}
                  </div>
                </Section>
              )}

              {/* IT ENROLL */}
              {isIT && !ticket.enrolledByIT && ticket.status === "Open" && (
                <Section
                  title="Enroll Ticket"
                  accent="amber"
                  subtitle="Assign engineers, set priority, ticket type, and ETA."
                >
                  <div className="mt-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Priority" error={enrollErrors.priority}>
                        <div className="flex flex-wrap gap-2">
                          {PRIORITIES.map((p) => (
                            <button
                              key={p}
                              onClick={() =>
                                setEnrollForm((f) => ({ ...f, priority: p }))
                              }
                              className={`h-8 px-3 rounded-lg border text-xs font-bold transition-all ${enrollForm.priority === p ? PRIORITY_PILL[p] + " shadow-sm" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </Field>
                      <Field
                        label="Ticket Type"
                        error={enrollErrors.ticketType}
                      >
                        <div className="flex gap-2">
                          {TICKET_TYPES.map((tt) => (
                            <button
                              key={tt}
                              onClick={() =>
                                setEnrollForm((f) => ({ ...f, ticketType: tt }))
                              }
                              className={`flex-1 h-8 rounded-lg border text-xs font-bold transition-all ${enrollForm.ticketType === tt ? "bg-slate-900 text-white border-slate-900" : "border-slate-300 text-slate-600 hover:bg-slate-50"}`}
                            >
                              {tt}
                            </button>
                          ))}
                        </div>
                      </Field>
                    </div>
                    <Field
                      label="Assign IT Engineers"
                      error={enrollErrors.itAssignees}
                    >
                      <div className="flex flex-wrap gap-2">
                        {IT_ENGINEERS.map((eng) => (
                          <button
                            key={eng}
                            onClick={() => toggleAssignee(eng)}
                            className={`h-8 px-3 rounded-lg border text-xs font-semibold transition-all ${enrollForm.itAssignees.includes(eng) ? "bg-blue-600 text-white border-blue-600" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                          >
                            {eng}
                          </button>
                        ))}
                      </div>
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field
                        label="IT Start Date"
                        error={enrollErrors.itStartDate}
                      >
                        <input
                          type="date"
                          value={enrollForm.itStartDate}
                          onChange={(e) =>
                            setEnrollForm((p) => ({
                              ...p,
                              itStartDate: e.target.value,
                            }))
                          }
                          className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:border-slate-400"
                        />
                      </Field>
                      <Field label="ETA Date" error={enrollErrors.etaDate}>
                        <input
                          type="date"
                          min={enrollForm.itStartDate}
                          value={enrollForm.etaDate}
                          onChange={(e) =>
                            setEnrollForm((p) => ({
                              ...p,
                              etaDate: e.target.value,
                            }))
                          }
                          className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:border-slate-400"
                        />
                      </Field>
                    </div>
                    <Field label="IT Remarks (optional)">
                      <textarea
                        rows={2}
                        value={enrollForm.itRemarks}
                        onChange={(e) =>
                          setEnrollForm((p) => ({
                            ...p,
                            itRemarks: e.target.value,
                          }))
                        }
                        placeholder="Scope, dependencies..."
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-slate-400 resize-none"
                      />
                    </Field>
                    <button
                      onClick={onEnroll}
                      className="w-full h-11 rounded-xl bg-slate-900 text-sm font-bold text-white hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <UserCheck className="w-4 h-4" />
                      Enroll & Begin Work
                    </button>
                  </div>
                </Section>
              )}

              {/* ENROLLED INFO */}
              {ticket.enrolledByIT && (
                <Section title="IT Enrollment Details">
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <InfoBox label="Priority" value={ticket.priority || "—"} />
                    <InfoBox
                      label="Ticket Type"
                      value={ticket.ticketType || "—"}
                    />
                    <InfoBox label="IT Start" value={fmt(ticket.itStartDate)} />
                    <InfoBox label="ETA" value={fmt(ticket.etaDate)} />
                    <InfoBox label="Closing" value={fmt(ticket.closingDate)} />
                    <div className="rounded-xl border border-slate-100 bg-white px-3 py-2.5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Assignees
                      </p>
                      <p className="text-xs font-bold text-slate-700 mt-0.5">
                        {ticket.itAssignees?.join(", ") || "—"}
                      </p>
                    </div>
                  </div>
                  {ticket.itRemarks && (
                    <div className="mt-3 rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm text-slate-700 italic">
                      "{ticket.itRemarks}"
                    </div>
                  )}
                </Section>
              )}

              {/* ON HOLD REASON */}
              {isOnHold && ticket.holdRemarks && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-1.5 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Hold Reason
                  </p>
                  <p className="text-sm text-amber-900 leading-relaxed">
                    {ticket.holdRemarks}
                  </p>
                </div>
              )}

              {/* THREE-STRIKE FOLLOW-UP (On Hold only, IT only) */}
              {isIT && isOnHold && (
                <Section
                  title="Three-Strike Follow-up"
                  accent="amber"
                  subtitle="Up to 3 follow-ups per round. Once all 3 in a round receive responses, a new round starts automatically."
                >
                  <div className="mt-4 space-y-3">
                    {/* Completed previous rounds */}
                    {prevGroups.length > 0 && (
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 mb-2">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600 mb-2">
                          Completed Rounds
                        </p>
                        {prevGroups.map((g, gi) => (
                          <div
                            key={gi}
                            className="flex items-center justify-between py-1.5 border-b border-emerald-100 last:border-0"
                          >
                            <span className="text-xs font-bold text-emerald-700">
                              Round {gi + 1}
                            </span>
                            <span className="text-[10px] text-emerald-600 mono">
                              {fmt(g[0].sentDate)} →{" "}
                              {fmt(
                                g.find((s) => s.responseReceived)?.responseDate,
                              )}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 rounded-full px-2 py-0.5">
                              All Responded
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Current round: show strikes 1-3 */}
                    {[1, 2, 3].map((num) => {
                      const strike = activeGroup.find(
                        (s) => s.strikeNumber === num,
                      );
                      const isNext = !strike && activeGroup.length === num - 1;
                      const locked = !strike && !isNext;
                      return (
                        <div
                          key={num}
                          className={`rounded-xl border p-4 transition-all ${locked ? "bg-slate-50 border-slate-100 opacity-40" : strike?.responseReceived ? "bg-emerald-50 border-emerald-200" : strike ? "bg-amber-50 border-amber-200" : "bg-white border-slate-200"}`}
                        >
                          <div className="flex items-center gap-2.5 mb-3">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-none ${strike?.responseReceived ? "bg-emerald-500 text-white" : strike ? "bg-amber-500 text-white" : isNext ? "bg-slate-200 text-slate-600" : "bg-slate-200 text-slate-400"}`}
                            >
                              {num}
                            </div>
                            <div className="flex-1 flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-bold text-slate-800">
                                Strike {num}
                              </span>
                              {strike && (
                                <span className="mono text-[11px] text-slate-500">
                                  Sent {fmt(strike.sentDate)}
                                </span>
                              )}
                              {strike?.mailId && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-2 py-0.5">
                                  <Mail className="w-2.5 h-2.5" />
                                  {strike.mailId}
                                </span>
                              )}
                              {strike?.responseReceived && (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                                  ✓ Response
                                </span>
                              )}
                              {strike && !strike.responseReceived && (
                                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                                  No Reply
                                </span>
                              )}
                            </div>
                          </div>
                          {strike && (
                            <div className="bg-white/80 rounded-lg border border-slate-100 px-3 py-2 text-xs text-slate-700 italic mb-2">
                              "{strike.note}"
                            </div>
                          )}
                          {strike?.responseReceived && (
                            <div className="bg-emerald-100 border border-emerald-200 rounded-lg px-3 py-2 text-xs text-emerald-800">
                              <span className="font-bold">
                                Response ({fmt(strike.responseDate)}):
                              </span>{" "}
                              {strike.responseNote}
                            </div>
                          )}
                          {strike && !strike.responseReceived && (
                            <div className="mt-2 space-y-2">
                              <input
                                type="text"
                                value={responseForm[strike.id]?.note || ""}
                                onChange={(e) =>
                                  setResponseForm((p) => ({
                                    ...p,
                                    [strike.id]: {
                                      ...p[strike.id],
                                      note: e.target.value,
                                    },
                                  }))
                                }
                                placeholder="Enter user's response note..."
                                className="w-full h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs focus:outline-none focus:border-emerald-400"
                              />
                              {responseForm[strike.id]?.error && (
                                <p className="text-[11px] text-red-600">
                                  {responseForm[strike.id].error}
                                </p>
                              )}
                              <button
                                onClick={() => onMarkResponse(strike.id)}
                                className="w-full h-9 rounded-lg bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Mark Response Received
                              </button>
                            </div>
                          )}
                          {isNext && canSendNext && (
                            <div className="space-y-2">
                              <Field
                                label="Recipient Mail ID"
                                error={strikeErrors.mailId}
                              >
                                <div className="relative">
                                  <Mail className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                                  <input
                                    type="email"
                                    value={strikeForm.mailId}
                                    onChange={(e) =>
                                      setStrikeForm((p) => ({
                                        ...p,
                                        mailId: e.target.value,
                                      }))
                                    }
                                    placeholder="user@company.com"
                                    className="w-full h-9 rounded-lg border border-slate-300 bg-white pl-8 pr-3 text-xs focus:outline-none focus:border-amber-400"
                                  />
                                </div>
                              </Field>
                              <Field
                                label="Follow-up Message"
                                error={strikeErrors.note}
                              >
                                <textarea
                                  rows={2}
                                  value={strikeForm.note}
                                  onChange={(e) =>
                                    setStrikeForm((p) => ({
                                      ...p,
                                      note: e.target.value,
                                    }))
                                  }
                                  placeholder={`Write follow-up message for Strike ${num}...`}
                                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:outline-none focus:border-amber-400 resize-none"
                                />
                              </Field>
                              <button
                                onClick={onSendStrike}
                                className="w-full h-9 rounded-lg bg-amber-500 text-xs font-bold text-white hover:bg-amber-600 transition-colors flex items-center justify-center gap-1.5"
                              >
                                <Bell className="w-3.5 h-3.5" />
                                Send Strike {num} Follow-up
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* All 3 no reply → auto close option */}
                    {allActiveNoReply && (
                      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <BellOff className="w-5 h-5 text-red-600 flex-none mt-0.5" />
                          <div>
                            <p className="text-sm font-bold text-red-800">
                              All 3 follow-ups unanswered
                            </p>
                            <p className="text-xs text-red-600 mt-0.5">
                              You may now close this ticket. The full strike
                              trace is permanently logged.
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={onAutoClose}
                          className="w-full h-10 rounded-xl bg-red-600 text-sm font-bold text-white hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Close Ticket — No Response
                        </button>
                      </div>
                    )}

                    {/* All responded — new round ready */}
                    {lastGroupAllDone && activeGroup.length === 0 && (
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 font-medium flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-none" />
                        All previous follow-ups were answered. You can start a
                        new round of strikes if the issue persists.
                      </div>
                    )}
                  </div>
                </Section>
              )}

              {/* ADVANCE STAGE */}
              {isIT &&
                ticket.enrolledByIT &&
                !isClosed &&
                !isOnHold &&
                nextStatuses.length > 0 && (
                  <Section
                    title="Advance Stage"
                    subtitle="Move forward through the workflow."
                  >
                    <div className="mt-3 flex flex-wrap gap-2">
                      {nextStatuses.map((s) => {
                        const m = STATUS_META[s] || STATUS_META["Open"];
                        const SI = m.Icon;
                        return (
                          <button
                            key={s}
                            onClick={() => onMoveStatus(s)}
                            className={`flex items-center gap-2 h-9 px-4 rounded-xl border text-sm font-semibold transition-all hover:opacity-80 ${m.chip}`}
                          >
                            <SI className="w-4 h-4" />
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </Section>
                )}

              {/* HOLD + CLOSE ACTIONS */}
              {isIT && ticket.enrolledByIT && !isClosed && (
                <Section
                  title={isOnHold ? "Actions" : "Quick Actions"}
                  subtitle={
                    isOnHold
                      ? "Resume ticket or close it."
                      : "Put on hold or close this ticket."
                  }
                >
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {!isOnHold && (
                      <button
                        onClick={onPutOnHold}
                        className="flex items-center gap-2 h-9 px-4 rounded-xl bg-amber-100 text-amber-800 border border-amber-200 text-sm font-semibold hover:bg-amber-200 transition-colors"
                      >
                        <AlertCircle className="w-4 h-4" />
                        Put On Hold
                      </button>
                    )}
                    {isOnHold && (
                      <button
                        onClick={() => onMoveStatus("In Progress")}
                        className="flex items-center gap-2 h-9 px-4 rounded-xl bg-blue-100 text-blue-800 border border-blue-200 text-sm font-semibold hover:bg-blue-200 transition-colors"
                      >
                        <Clock3 className="w-4 h-4" />
                        Resume to In Progress
                      </button>
                    )}
                    <button
                      onClick={onCloseTicket}
                      className="flex items-center gap-2 h-9 px-4 rounded-xl bg-slate-800 text-white text-sm font-semibold hover:bg-slate-900 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Close Ticket
                    </button>
                  </div>
                </Section>
              )}

              {/* CLOSED SUMMARY */}
              {isClosed && (
                <div
                  className={`rounded-2xl border p-4 ${ticket.autoClosedAfterStrikes ? "border-red-200 bg-red-50" : "border-emerald-200 bg-emerald-50"}`}
                >
                  <div className="flex items-start gap-3">
                    {ticket.autoClosedAfterStrikes ? (
                      <BellOff className="w-5 h-5 text-red-600 flex-none mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-none mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p
                        className={`text-sm font-bold ${ticket.autoClosedAfterStrikes ? "text-red-800" : "text-emerald-800"}`}
                      >
                        {ticket.autoClosedAfterStrikes
                          ? "Auto-Closed — 3 unanswered follow-ups"
                          : "Ticket Closed"}
                      </p>
                      <p
                        className={`text-xs mt-0.5 ${ticket.autoClosedAfterStrikes ? "text-red-600" : "text-emerald-600"}`}
                      >
                        Closed on {fmt(ticket.closingDate)}
                      </p>
                      {ticket.closingNote && (
                        <div className="mt-2 rounded-xl bg-white/70 border border-current/10 px-3 py-2.5">
                          <p className="text-sm text-slate-700 leading-relaxed">
                            {ticket.closingNote}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Software/ERP lifecycle guide */}
              {(ticket.category === "software" || ticket.category === "erp") &&
                !isClosed && (
                  <Section
                    title="Development Lifecycle"
                    subtitle="Full software development flow for this ticket."
                  >
                    <div className="mt-3 space-y-1.5">
                      {[
                        {
                          s: "Requirement",
                          desc: "Gather and document functional requirements",
                        },
                        {
                          s: "Discussion",
                          desc: "Review with stakeholders via Discussion tab",
                        },
                        {
                          s: "In Progress",
                          desc: "Development / implementation underway",
                        },
                        {
                          s: "IT Testing",
                          desc: "Internal QA and regression testing",
                        },
                        {
                          s: "Ready for Demo",
                          desc: "Demo build prepared for business users",
                        },
                        {
                          s: "User Testing",
                          desc: "UAT — users validate against requirements",
                        },
                        {
                          s: "Closed",
                          desc: "Sign-off received, deployed to production",
                        },
                      ].map(({ s, desc }) => {
                        const si = catFlow.indexOf(s);
                        const done = curIdx > si;
                        const curr = ticket.status === s;
                        const m = STATUS_META[s] || STATUS_META["Open"];
                        return (
                          <div
                            key={s}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 ${curr ? "bg-blue-50 border border-blue-200" : done ? "bg-emerald-50/50 border border-emerald-100" : "bg-slate-50 border border-slate-100"}`}
                          >
                            <div
                              className={`w-5 h-5 rounded-full flex-none flex items-center justify-center text-[10px] font-black ${curr ? m.chip : done ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"}`}
                            >
                              {done ? "✓" : si}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-xs font-bold ${curr ? m.txt : done ? "text-emerald-600" : "text-slate-400"}`}
                              >
                                {s}
                              </p>
                              <p className="text-[10px] text-slate-400 truncate">
                                {desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Section>
                )}
            </div>
          )}

          {/* DISCUSSION TAB */}
          {tab === "discussion" && (
            <div className="flex flex-col" style={{ minHeight: "400px" }}>
              <div
                className="flex-1 overflow-y-auto thin-scroll p-5 space-y-3"
                style={{ minHeight: "300px" }}
              >
                {(!ticket.messages || ticket.messages.length === 0) && (
                  <div className="flex flex-col items-center justify-center h-32 text-slate-400">
                    <MessageSquareText className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-sm font-medium">
                      No messages yet. Start the discussion.
                    </p>
                  </div>
                )}
                {ticket.messages?.map((msg) => {
                  const sender = getUser(msg.userId);
                  const isSelf = msg.userId === currentUser?.id;
                  const isITMsg = sender?.role === "IT";
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-end gap-2 ${isSelf ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <div
                        className={`w-7 h-7 rounded-xl flex-none flex items-center justify-center text-[10px] font-black ${isITMsg ? "bg-blue-500 text-white" : "bg-emerald-500 text-white"}`}
                      >
                        {sender?.avatar || "?"}
                      </div>
                      <div
                        className={`flex flex-col ${isSelf ? "items-end" : "items-start"}`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold text-slate-500">
                            {sender?.name || "Unknown"}
                          </span>
                          <span className="text-[10px] text-slate-400 mono">
                            {fmtTime(msg.ts)}
                          </span>
                        </div>
                        <div
                          className={
                            isSelf ? "cb-self" : isITMsg ? "cb-it" : "cb-user"
                          }
                        >
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={endRef} />
              </div>
              {!isClosed ? (
                <div className="flex-none border-t border-slate-100 p-4">
                  <div className="flex gap-2">
                    <textarea
                      rows={2}
                      value={newMsg}
                      onChange={(e) => setNewMsg(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          onSendMsg();
                        }
                      }}
                      placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
                      className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:border-slate-400 resize-none"
                    />
                    <button
                      onClick={onSendMsg}
                      className="w-10 h-10 self-end rounded-xl bg-slate-900 flex items-center justify-center text-white hover:bg-slate-800 transition-colors flex-none"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Sending as{" "}
                    <span className="font-bold">{currentUser?.name}</span> ·{" "}
                    {isIT ? "IT Department" : currentUser?.dept}
                  </p>
                </div>
              ) : (
                <div className="flex-none border-t border-slate-100 p-4 text-center text-xs text-slate-400 font-medium">
                  Discussion is closed — this ticket has been closed.
                </div>
              )}
            </div>
          )}

          {/* HISTORY TAB */}
          {tab === "history" && (
            <div className="p-5 space-y-2">
              {[...ticket.statusHistory].reverse().map((e, i) => {
                const m = STATUS_META[e.status] || STATUS_META["Open"];
                const SI = m.Icon;
                return (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center flex-none mt-0.5 ${m.chip}`}
                    >
                      <SI className="w-3 h-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-xs font-bold ${m.txt}`}>
                          {e.status}
                        </span>
                        <span className="mono text-[11px] text-slate-400 flex-none">
                          {fmt(e.date)}
                        </span>
                      </div>
                      {e.note && (
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                          {e.note}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── CREATE MODAL ──────────────────────────────────────────────────────────────
function CreateModal({
  form,
  errors,
  closedTickets,
  onChange,
  onClose,
  onSubmit,
}) {
  const fileRef = useRef(null);
  const fmt_bytes = (b) => {
    if (!b) return "";
    if (b < 1024) return b + "B";
    if (b < 1048576) return (b / 1024).toFixed(1) + "KB";
    return (b / 1048576).toFixed(1) + "MB";
  };
  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-box" style={{ maxWidth: "560px" }}>
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 flex-none">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Raise a New IT Ticket
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              IT will enroll, assign priority, and set ETA after submission.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-y-auto thin-scroll flex-1 p-6 space-y-4">
          <Field label="Ticket Type">
            <div className="grid grid-cols-2 gap-2">
              {["Ticket", "Linked Ticket"].map((type) => (
                <button
                  key={type}
                  onClick={() =>
                    onChange((p) => ({
                      ...p,
                      type,
                      parentId: type === "Linked Ticket" ? p.parentId : "",
                    }))
                  }
                  className={`h-10 rounded-xl border text-sm font-bold transition-colors ${form.type === type ? "bg-slate-900 text-white border-slate-900" : "border-slate-300 text-slate-600 hover:bg-slate-50"}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Category">
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(CATEGORY_META).map(([id, meta]) => {
                const Icon = meta.Icon;
                return (
                  <button
                    key={id}
                    onClick={() => onChange((p) => ({ ...p, category: id }))}
                    className={`flex items-center gap-2 h-10 px-3 rounded-xl border text-xs font-bold transition-all ${form.category === id ? `${meta.pill} shadow-sm` : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {meta.label}
                  </button>
                );
              })}
            </div>
          </Field>
          {form.type === "Linked Ticket" && (
            <Field label="Link to Closed Ticket" error={errors.parentId}>
              <div className="relative">
                <select
                  value={form.parentId}
                  onChange={(e) =>
                    onChange((p) => ({ ...p, parentId: e.target.value }))
                  }
                  className="h-10 w-full appearance-none rounded-xl border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:border-slate-400"
                >
                  <option value="">Select closed ticket</option>
                  {closedTickets.map((t) => (
                    <option key={t.id} value={t.id}>
                      #{t.id} — {t.description}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />
              </div>
            </Field>
          )}
          <Field
            label="Description / Request Details"
            error={errors.description}
          >
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                onChange((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="Clearly describe the request, affected system, scope, and urgency."
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-slate-400 resize-none"
            />
          </Field>
          <Field label="Submitted By" error={errors.submittedBy}>
            <input
              type="text"
              value={form.submittedBy}
              onChange={(e) =>
                onChange((p) => ({ ...p, submittedBy: e.target.value }))
              }
              placeholder="Your full name"
              className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:border-slate-400"
            />
          </Field>
          <Field label="Attachment (optional)">
            <div
              onClick={() => fileRef.current?.click()}
              className={`flex items-center gap-3 rounded-xl border-2 border-dashed cursor-pointer px-4 py-3 transition-all ${form.attachment ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"}`}
            >
              <Paperclip
                className={`w-4 h-4 flex-none ${form.attachment ? "text-blue-500" : "text-slate-400"}`}
              />
              {form.attachment ? (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-blue-700 truncate">
                    {form.attachment.name}
                  </p>
                  <p className="text-xs text-blue-400 mono">
                    {(form.attachment.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-semibold text-slate-600">
                    Click to attach
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    PDF, DOCX, XLSX, images
                  </p>
                </div>
              )}
              {form.attachment && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange((p) => ({ ...p, attachment: null }));
                  }}
                  className="p-1 rounded text-blue-400 hover:text-blue-600 flex-none"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onChange((p) => ({ ...p, attachment: f }));
              }}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.txt"
            />
          </Field>
        </div>
        <div className="flex-none border-t border-slate-100 px-6 py-4 flex items-center justify-between gap-3">
          <p className="text-xs text-slate-400">
            Priority & type assigned by IT on enrollment.
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="h-10 px-4 rounded-xl border border-slate-300 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              className="h-10 px-5 rounded-xl bg-slate-900 text-sm font-bold text-white hover:bg-slate-800 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Raise Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MICRO ─────────────────────────────────────────────────────────────────────
const ACCENT_CLS = {
  amber: "border-amber-200 bg-amber-50/70",
  emerald: "border-emerald-200 bg-emerald-50/70",
  red: "border-red-200 bg-red-50/70",
};
function Section({ title, subtitle, accent, children }) {
  return (
    <div
      className={`rounded-2xl border p-4 ${ACCENT_CLS[accent] || "border-slate-200 bg-slate-50"}`}
    >
      <p className="text-sm font-extrabold text-slate-900">{title}</p>
      {subtitle && (
        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
}
function InfoBox({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white px-3 py-2.5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p className="text-sm font-bold text-slate-700 mt-0.5 truncate">
        {value}
      </p>
    </div>
  );
}
function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-red-600 font-semibold">{error}</p>
      )}
    </div>
  );
}
