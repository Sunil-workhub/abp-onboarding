import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Bell,
  BellOff,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Database,
  FolderPlus,
  HardDrive,
  Inbox,
  Link2,
  Mail,
  MessageSquareText,
  Monitor,
  PanelRightClose,
  PanelRightOpen,
  Paperclip,
  Plus,
  Shield,
  SquareArrowOutUpRight,
  User,
  UserCheck,
  Wrench,
  X,
  XCircle,
  Zap,
  WifiOff,
  ClipboardList,
  AlertOctagon,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const STATUSES = ["Open", "In Progress", "On Hold", "Resolved", "Closed"];

const CATEGORIES = [
  {
    id: "cybersecurity",
    label: "Cybersecurity",
    Icon: Shield,
    pill: "bg-red-50 text-red-700 border-red-200",
  },
  {
    id: "new-project",
    label: "New Project",
    Icon: FolderPlus,
    pill: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: "new-module",
    label: "New Module / Software",
    Icon: Zap,
    pill: "bg-violet-50 text-violet-700 border-violet-200",
  },
  {
    id: "hardware",
    label: "Hardware Request",
    Icon: HardDrive,
    pill: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    id: "access",
    label: "Access Management",
    Icon: Monitor,
    pill: "bg-teal-50 text-teal-700 border-teal-200",
  },
  {
    id: "network",
    label: "Network Issue",
    Icon: WifiOff,
    pill: "bg-orange-50 text-orange-700 border-orange-200",
  },
  {
    id: "bug",
    label: "Software Bug / Fix",
    Icon: AlertTriangle,
    pill: "bg-rose-50 text-rose-700 border-rose-200",
  },
  {
    id: "data",
    label: "Data Request",
    Icon: Database,
    pill: "bg-cyan-50 text-cyan-700 border-cyan-200",
  },
  {
    id: "support",
    label: "IT Support / General",
    Icon: Wrench,
    pill: "bg-slate-50 text-slate-700 border-slate-200",
  },
  {
    id: "other",
    label: "Other",
    Icon: ClipboardList,
    pill: "bg-slate-50 text-slate-600 border-slate-200",
  },
];

const PRIORITIES = ["Critical", "High", "Medium", "Low"];

const PRIORITY_PILL = {
  Critical: "bg-red-100 text-red-700 border border-red-200",
  High: "bg-orange-100 text-orange-700 border border-orange-200",
  Medium: "bg-amber-100 text-amber-700 border border-amber-200",
  Low: "bg-slate-100 text-slate-600 border border-slate-200",
};

const DEPARTMENTS = [
  "DevOps",
  "Backend Engineering",
  "Frontend Engineering",
  "QA",
  "Security",
  "HR Systems",
  "IT Support",
  "Finance Systems",
  "Infrastructure",
  "Product",
  "Legal",
  "Marketing",
  "Operations",
];

// ── IT Engineers list
const IT_ENGINEERS = [
  "Raj Malhotra",
  "Priya Kulkarni",
  "Vikram Shah",
  "Neha Sharma",
  "Arun Patel",
  "Kavya Menon",
  "Siddharth Rao",
];

const COLUMN_META = {
  Open: {
    dot: "bg-slate-400",
    header: "text-slate-600",
    chip: "bg-slate-100 text-slate-600",
    Icon: Inbox,
  },
  "In Progress": {
    dot: "bg-blue-500",
    header: "text-blue-700",
    chip: "bg-blue-100 text-blue-700",
    Icon: Clock3,
  },
  "On Hold": {
    dot: "bg-amber-500",
    header: "text-amber-700",
    chip: "bg-amber-100 text-amber-700",
    Icon: AlertCircle,
  },
  Resolved: {
    dot: "bg-emerald-500",
    header: "text-emerald-700",
    chip: "bg-emerald-100 text-emerald-700",
    Icon: CheckCircle2,
  },
  Closed: {
    dot: "bg-slate-300",
    header: "text-slate-400",
    chip: "bg-slate-100 text-slate-400",
    Icon: XCircle,
  },
};

const STAT_TONES = {
  slate: "bg-slate-50 border-slate-200 text-slate-700",
  blue: "bg-blue-50 border-blue-200 text-blue-700",
  amber: "bg-amber-50 border-amber-200 text-amber-700",
  emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
  red: "bg-red-50 border-red-200 text-red-700",
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const todayISO = () => new Date().toISOString().slice(0, 10);

const fmt = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const daysBetween = (a, b) => {
  const d1 = new Date(a);
  d1.setHours(0, 0, 0, 0);
  const d2 = new Date(b);
  d2.setHours(0, 0, 0, 0);
  return Math.ceil((d2 - d1) / 86400000);
};

const getCat = (id) =>
  CATEGORIES.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1];

const etaBadge = (ticket) => {
  if (["Resolved", "Closed"].includes(ticket.status))
    return {
      label: ticket.status === "Resolved" ? "Resolved" : "Closed",
      cls: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    };
  if (!ticket.etaDate)
    return {
      label: "No ETA",
      cls: "bg-slate-100 text-slate-500 border border-slate-200",
    };
  const d = daysBetween(todayISO(), ticket.etaDate);
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

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA  (type: "Ticket" | "Linked Ticket")
// ─────────────────────────────────────────────────────────────────────────────

const INITIAL_TICKETS = [
  {
    id: 1,
    description: "Firewall rule update for SOC team VPN access",
    category: "cybersecurity",
    submittedBy: "Ananya Iyer",
    priority: "Critical",
    status: "In Progress",
    submittedDate: "2026-03-10",
    itStartDate: "2026-03-13",
    etaDate: "2026-04-15",
    closingDate: null,
    resolutionNote: "",
    attachment: { name: "soc_vpn_requirements.pdf", size: "248 KB" },
    type: "Ticket",
    parentId: null,
    linkedTaskIds: [],
    enrolledByIT: true,
    itAssignee: "Raj Malhotra",
    itRemarks:
      "Assigned to NetOps. ETA includes 2-day testing window post-deployment.",
    statusHistory: [
      { status: "Open", date: "2026-03-10", note: "Submitted by Ananya Iyer" },
      {
        status: "In Progress",
        date: "2026-03-13",
        note: "Enrolled by IT. Assigned to Raj Malhotra.",
      },
    ],
    meetings: [
      {
        id: 101,
        meetingDate: "2026-03-20",
        agenda: "VPN policy & firewall scope review",
        discussion:
          "Confirmed IPs and ports. Security team to share updated whitelist by EOD Thursday.",
        statusAtTime: "In Progress",
        createdAt: "2026-03-20T10:30:00",
      },
    ],
    strikes: [],
    autoClosedAfterStrikes: false,
  },
  {
    id: 2,
    description: "New ERP module for procurement workflow automation",
    category: "new-module",
    submittedBy: "Suresh Nair",
    priority: "High",
    status: "On Hold",
    submittedDate: "2026-03-01",
    itStartDate: "2026-03-06",
    etaDate: "2026-04-30",
    closingDate: null,
    resolutionNote: "",
    attachment: { name: "procurement_workflow_spec.docx", size: "1.1 MB" },
    type: "Ticket",
    parentId: null,
    linkedTaskIds: [],
    enrolledByIT: true,
    itAssignee: "Priya Kulkarni",
    itRemarks:
      "Cannot proceed without complete BRD from requesting department.",
    statusHistory: [
      { status: "Open", date: "2026-03-01", note: "Ticket submitted" },
      {
        status: "In Progress",
        date: "2026-03-06",
        note: "Enrolled by IT. Assigned to Priya Kulkarni.",
      },
      {
        status: "On Hold",
        date: "2026-03-22",
        note: "Awaiting detailed BRD from Operations.",
      },
    ],
    meetings: [
      {
        id: 201,
        meetingDate: "2026-03-20",
        agenda: "Requirements clarification session",
        discussion:
          "Operations needs to finalize field mappings and approval hierarchy. Blocked until BRD is complete.",
        statusAtTime: "In Progress",
        createdAt: "2026-03-20T14:00:00",
      },
    ],
    strikes: [
      {
        id: 1001,
        strikeNumber: 1,
        sentDate: "2026-03-23",
        mailId: "suresh.nair@enlife.com",
        note: "Hi Suresh, we are awaiting the BRD document and field mapping sheet. Please share at the earliest.",
        responseReceived: false,
        responseDate: null,
        responseNote: "",
      },
      {
        id: 1002,
        strikeNumber: 2,
        sentDate: "2026-03-30",
        mailId: "suresh.nair@enlife.com",
        note: "Second follow-up: Ticket on hold for 8 days. Please share requirements or confirm a timeline.",
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
    status: "Resolved",
    submittedDate: "2026-02-15",
    itStartDate: "2026-02-18",
    etaDate: "2026-03-15",
    closingDate: "2026-03-14",
    resolutionNote:
      "All 5 Dell Latitude 5540 units delivered, imaged, and handed over. Asset tags logged in CMDB.",
    attachment: null,
    type: "Ticket",
    parentId: null,
    linkedTaskIds: [4],
    enrolledByIT: true,
    itAssignee: "Vikram Shah",
    itRemarks:
      "Procurement approved. Dell Latitude 5540 selected after vendor comparison.",
    statusHistory: [
      { status: "Open", date: "2026-02-15", note: "Ticket submitted" },
      {
        status: "In Progress",
        date: "2026-02-18",
        note: "Enrolled. Procurement initiated.",
      },
      {
        status: "Resolved",
        date: "2026-03-14",
        note: "All 5 units delivered and configured.",
      },
    ],
    meetings: [],
    strikes: [],
    autoClosedAfterStrikes: false,
  },
  {
    id: 4,
    description: "Register asset tags and warranty entries for 5 new laptops",
    category: "support",
    submittedBy: "IT Team",
    priority: "Low",
    status: "Open",
    submittedDate: "2026-03-15",
    itStartDate: null,
    etaDate: null,
    closingDate: null,
    resolutionNote: "",
    attachment: null,
    type: "Linked Ticket",
    parentId: 3,
    linkedTaskIds: [],
    enrolledByIT: false,
    itAssignee: "",
    itRemarks: "",
    statusHistory: [
      {
        status: "Open",
        date: "2026-03-15",
        note: "Follow-up task created post laptop delivery",
      },
    ],
    meetings: [],
    strikes: [],
    autoClosedAfterStrikes: false,
  },
  {
    id: 5,
    description: "Office 365 license migration for 80 users (E3 → E5 upgrade)",
    category: "new-module",
    submittedBy: "Deepak Arora",
    priority: "High",
    status: "Open",
    submittedDate: "2026-04-01",
    itStartDate: null,
    etaDate: null,
    closingDate: null,
    resolutionNote: "",
    attachment: { name: "user_license_list.xlsx", size: "54 KB" },
    type: "Ticket",
    parentId: null,
    linkedTaskIds: [],
    enrolledByIT: false,
    itAssignee: "",
    itRemarks: "",
    statusHistory: [
      { status: "Open", date: "2026-04-01", note: "Submitted by Deepak Arora" },
    ],
    meetings: [],
    strikes: [],
    autoClosedAfterStrikes: false,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [selectedId, setSelectedId] = useState(INITIAL_TICKETS[0]?.id ?? null);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);

  const [createForm, setCreateForm] = useState({
    type: "Ticket",
    category: CATEGORIES[0].id,
    description: "",
    submittedBy: "",
    priority: "Medium",
    attachment: null,
    parentId: "",
  });
  const [createErrors, setCreateErrors] = useState({});
  const [enrollForm, setEnrollForm] = useState({
    itAssignee: "",
    itStartDate: todayISO(),
    etaDate: "",
    itRemarks: "",
  });
  const [enrollErrors, setEnrollErrors] = useState({});
  const [resolveForm, setResolveForm] = useState({
    closingDate: todayISO(),
    resolutionNote: "",
  });
  const [resolveErrors, setResolveErrors] = useState({});
  const [strikeForm, setStrikeForm] = useState({ mailId: "", note: "" });
  const [strikeErrors, setStrikeErrors] = useState({});
  const [responseForm, setResponseForm] = useState({});
  const [meetingForm, setMeetingForm] = useState({
    meetingDate: todayISO(),
    agenda: "",
    discussion: "",
  });
  const [meetingErrors, setMeetingErrors] = useState({});

  // Status change confirmation
  const [statusConfirm, setStatusConfirm] = useState(null); // { status }

  const selectedTicket = tickets.find((t) => t.id === selectedId) || null;

  useEffect(() => {
    setEnrollForm({
      itAssignee: "",
      itStartDate: todayISO(),
      etaDate: "",
      itRemarks: "",
    });
    setEnrollErrors({});
    setResolveForm({ closingDate: todayISO(), resolutionNote: "" });
    setResolveErrors({});
    setStrikeForm({ mailId: "", note: "" });
    setStrikeErrors({});
    setMeetingForm({ meetingDate: todayISO(), agenda: "", discussion: "" });
    setMeetingErrors({});
    setResponseForm({});
    setStatusConfirm(null);
  }, [selectedId]);

  const stats = useMemo(() => {
    const overdue = tickets.filter(
      (t) =>
        t.etaDate &&
        !["Resolved", "Closed"].includes(t.status) &&
        daysBetween(todayISO(), t.etaDate) < 0,
    ).length;
    const dueSoon = tickets.filter((t) => {
      const d = t.etaDate && daysBetween(todayISO(), t.etaDate);
      return d >= 0 && d <= 7 && !["Resolved", "Closed"].includes(t.status);
    }).length;
    return {
      total: tickets.length,
      open: tickets.filter((t) => t.status === "Open").length,
      inProgress: tickets.filter((t) => t.status === "In Progress").length,
      onHold: tickets.filter((t) => t.status === "On Hold").length,
      resolved: tickets.filter((t) => t.status === "Resolved").length,
      closed: tickets.filter((t) => t.status === "Closed").length,
      overdue,
      dueSoon,
    };
  }, [tickets]);

  const patch = (id, data) =>
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t)),
    );

  const enrollTicket = () => {
    const errs = {};
    if (!enrollForm.itAssignee) errs.itAssignee = "Assignee required.";
    if (!enrollForm.itStartDate) errs.itStartDate = "Start date required.";
    if (!enrollForm.etaDate) errs.etaDate = "ETA date required.";
    if (
      enrollForm.etaDate &&
      enrollForm.itStartDate &&
      enrollForm.etaDate < enrollForm.itStartDate
    )
      errs.etaDate = "ETA must be after start date.";
    setEnrollErrors(errs);
    if (Object.keys(errs).length) return;
    patch(selectedTicket.id, {
      enrolledByIT: true,
      itAssignee: enrollForm.itAssignee,
      itStartDate: enrollForm.itStartDate,
      etaDate: enrollForm.etaDate,
      itRemarks: enrollForm.itRemarks.trim(),
      status: "In Progress",
      statusHistory: [
        ...selectedTicket.statusHistory,
        {
          status: "In Progress",
          date: enrollForm.itStartDate,
          note: `Enrolled by IT. Assigned to ${enrollForm.itAssignee}.`,
        },
      ],
    });
  };

  const changeStatus = (newStatus, note, extra = {}) => {
    patch(selectedTicket.id, {
      status: newStatus,
      statusHistory: [
        ...selectedTicket.statusHistory,
        {
          status: newStatus,
          date: todayISO(),
          note: note || `Moved to ${newStatus}`,
        },
      ],
      ...extra,
    });
    setStatusConfirm(null);
  };

  const resolveTicket = () => {
    const errs = {};
    if (!resolveForm.closingDate) errs.closingDate = "Closing date required.";
    if (!resolveForm.resolutionNote.trim())
      errs.resolutionNote = "Resolution summary required.";
    setResolveErrors(errs);
    if (Object.keys(errs).length) return;
    changeStatus("Resolved", `Resolved: ${resolveForm.resolutionNote.trim()}`, {
      closingDate: resolveForm.closingDate,
      resolutionNote: resolveForm.resolutionNote.trim(),
    });
  };

  const sendStrike = () => {
    const errs = {};
    if (!strikeForm.mailId.trim()) errs.mailId = "Mail ID required.";
    if (!strikeForm.note.trim()) errs.note = "Follow-up message required.";
    setStrikeErrors(errs);
    if (Object.keys(errs).length) return;
    const num = (selectedTicket.strikes?.length || 0) + 1;
    const strike = {
      id: Date.now(),
      strikeNumber: num,
      sentDate: todayISO(),
      mailId: strikeForm.mailId.trim(),
      note: strikeForm.note.trim(),
      responseReceived: false,
      responseDate: null,
      responseNote: "",
    };
    patch(selectedTicket.id, {
      strikes: [...(selectedTicket.strikes || []), strike],
      statusHistory: [
        ...selectedTicket.statusHistory,
        {
          status: "On Hold",
          date: todayISO(),
          note: `Strike ${num} follow-up sent to ${strikeForm.mailId.trim()}.`,
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
    const updated = selectedTicket.strikes.map((s) =>
      s.id === strikeId
        ? {
            ...s,
            responseReceived: true,
            responseDate: todayISO(),
            responseNote: note,
          }
        : s,
    );
    const strikeNum = updated.find((s) => s.id === strikeId)?.strikeNumber;
    patch(selectedTicket.id, {
      strikes: updated,
      statusHistory: [
        ...selectedTicket.statusHistory,
        {
          status: "On Hold",
          date: todayISO(),
          note: `Response received on Strike ${strikeNum}.`,
        },
      ],
    });
  };

  const autoClose = () => {
    changeStatus("Closed", "Ticket closed after 3 unanswered follow-ups.", {
      closingDate: todayISO(),
      autoClosedAfterStrikes: true,
    });
  };

  const addMeeting = () => {
    const errs = {};
    if (!meetingForm.meetingDate) errs.meetingDate = "Date required.";
    if (!meetingForm.agenda.trim()) errs.agenda = "Agenda required.";
    if (!meetingForm.discussion.trim())
      errs.discussion = "Discussion required.";
    setMeetingErrors(errs);
    if (Object.keys(errs).length) return;
    patch(selectedTicket.id, {
      meetings: [
        {
          id: Date.now(),
          meetingDate: meetingForm.meetingDate,
          agenda: meetingForm.agenda.trim(),
          discussion: meetingForm.discussion.trim(),
          statusAtTime: selectedTicket.status,
          createdAt: new Date().toISOString(),
        },
        ...selectedTicket.meetings,
      ],
    });
    setMeetingForm({ meetingDate: todayISO(), agenda: "", discussion: "" });
    setMeetingErrors({});
  };

  const fmt_bytes = (b) => {
    if (!b) return "";
    if (b < 1024) return b + "B";
    if (b < 1048576) return (b / 1024).toFixed(1) + "KB";
    return (b / 1048576).toFixed(1) + "MB";
  };

  const createTicket = () => {
    const errs = {};
    if (!createForm.description.trim())
      errs.description = "Description required.";
    if (!createForm.submittedBy.trim())
      errs.submittedBy = "Submitter name required.";
    if (createForm.type === "Linked Ticket" && !createForm.parentId)
      errs.parentId = "Parent ticket required.";
    setCreateErrors(errs);
    if (Object.keys(errs).length) return;
    const newId = Date.now();
    const fileInfo = createForm.attachment
      ? {
          name: createForm.attachment.name,
          size: fmt_bytes(createForm.attachment.size),
        }
      : null;
    const ticket = {
      id: newId,
      description: createForm.description.trim(),
      category: createForm.category,
      submittedBy: createForm.submittedBy.trim(),
      priority: createForm.priority,
      status: "Open",
      submittedDate: todayISO(),
      itStartDate: null,
      etaDate: null,
      closingDate: null,
      resolutionNote: "",
      attachment: fileInfo,
      type: createForm.type,
      parentId:
        createForm.type === "Linked Ticket"
          ? Number(createForm.parentId)
          : null,
      linkedTaskIds: [],
      enrolledByIT: false,
      itAssignee: "",
      itRemarks: "",
      statusHistory: [
        {
          status: "Open",
          date: todayISO(),
          note: `Submitted by ${createForm.submittedBy.trim()}`,
        },
      ],
      meetings: [],
      strikes: [],
      autoClosedAfterStrikes: false,
    };
    setTickets((prev) => {
      let next = [ticket, ...prev];
      if (ticket.parentId)
        next = next.map((t) =>
          t.id === ticket.parentId
            ? { ...t, linkedTaskIds: [...(t.linkedTaskIds || []), newId] }
            : t,
        );
      return next;
    });
    setSelectedId(newId);
    setDrawerOpen(true);
    setCreateOpen(false);
    setCreateErrors({});
    setCreateForm({
      type: "Ticket",
      category: CATEGORIES[0].id,
      description: "",
      submittedBy: "",
      priority: "Medium",
      attachment: null,
      parentId: "",
    });
  };

  const resolvedTickets = useMemo(
    () => tickets.filter((t) => t.status === "Resolved"),
    [tickets],
  );
  const getById = (id) => tickets.find((t) => t.id === id);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        .thin-scroll::-webkit-scrollbar { width: 4px; }
        .thin-scroll::-webkit-scrollbar-track { background: transparent; }
        .thin-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
        .truncate-1 { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      `}</style>

      <div className="h-screen overflow-hidden bg-slate-100 text-slate-900 flex flex-col">
        {/* HEADER */}
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
                    All tickets enrolled, managed, and resolved by the IT
                    Department
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDrawerOpen((p) => !p)}
                  className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  {drawerOpen ? (
                    <>
                      <PanelRightClose className="h-4 w-4" />
                      Hide
                    </>
                  ) : (
                    <>
                      <PanelRightOpen className="h-4 w-4" />
                      Detail
                    </>
                  )}
                </button>
                <button
                  onClick={() => setCreateOpen(true)}
                  className="inline-flex h-9 items-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white hover:bg-slate-800 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  New Ticket
                </button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                { l: "Total", v: stats.total, t: "slate" },
                { l: "Open", v: stats.open, t: "slate" },
                { l: "In Progress", v: stats.inProgress, t: "blue" },
                { l: "On Hold", v: stats.onHold, t: "amber" },
                { l: "Resolved", v: stats.resolved, t: "emerald" },
                { l: "Closed", v: stats.closed, t: "slate" },
                { l: "Overdue", v: stats.overdue, t: "red" },
                { l: "Due ≤ 7d", v: stats.dueSoon, t: "amber" },
              ].map((s) => (
                <div
                  key={s.l}
                  className={`rounded-xl border px-3 py-2 ${STAT_TONES[s.t]}`}
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

        {/* MAIN */}
        <main className="flex-1 overflow-hidden mx-auto w-full max-w-[1800px] flex gap-3 p-4 min-h-0">
          {/* Kanban */}
          <section className="flex-1 overflow-x-auto overflow-y-hidden min-w-0">
            <div className="grid grid-cols-5 gap-3 h-full min-w-[1150px]">
              {STATUSES.map((status) => {
                const items = tickets.filter((t) => t.status === status);
                const meta = COLUMN_META[status];
                const Icon = meta.Icon;
                return (
                  <div
                    key={status}
                    className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm min-h-0"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 flex-none">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${meta.dot}`}
                        />
                        <Icon className={`w-4 h-4 ${meta.header}`} />
                        <span className={`text-sm font-bold ${meta.header}`}>
                          {status}
                        </span>
                      </div>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${meta.chip}`}
                      >
                        {items.length}
                      </span>
                    </div>
                    <div className="flex-1 overflow-y-auto thin-scroll p-3 space-y-2 bg-slate-50/50 min-h-0">
                      {items.length === 0 ? (
                        <div className="flex items-center justify-center h-16 rounded-xl border border-dashed border-slate-200 bg-white text-xs text-slate-400 font-medium">
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
                            onClick={() => {
                              setSelectedId(t.id);
                              setDrawerOpen(true);
                            }}
                          />
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Drawer */}
          {drawerOpen && selectedTicket && (
            <>
              <div
                className="fixed inset-0 z-30 bg-slate-900/20 lg:hidden"
                onClick={() => setDrawerOpen(false)}
              />
              <aside className="fixed inset-y-0 right-0 z-40 w-full sm:w-[460px] border-l border-slate-200 bg-white shadow-2xl lg:static lg:z-0 lg:w-[460px] lg:rounded-2xl lg:border lg:shadow-sm flex flex-col min-h-0">
                <TicketDrawer
                  ticket={selectedTicket}
                  parent={
                    selectedTicket.parentId
                      ? getById(selectedTicket.parentId)
                      : null
                  }
                  linkedTickets={tickets.filter((t) =>
                    selectedTicket.linkedTaskIds?.includes(t.id),
                  )}
                  onClose={() => setDrawerOpen(false)}
                  onOpenLinked={(id) => {
                    setSelectedId(id);
                    setDrawerOpen(true);
                  }}
                  enrollForm={enrollForm}
                  setEnrollForm={setEnrollForm}
                  enrollErrors={enrollErrors}
                  onEnroll={enrollTicket}
                  statusConfirm={statusConfirm}
                  setStatusConfirm={setStatusConfirm}
                  onChangeStatus={changeStatus}
                  strikeForm={strikeForm}
                  setStrikeForm={setStrikeForm}
                  strikeErrors={strikeErrors}
                  onSendStrike={sendStrike}
                  responseForm={responseForm}
                  setResponseForm={setResponseForm}
                  onMarkResponse={markResponse}
                  onAutoClose={autoClose}
                  resolveForm={resolveForm}
                  setResolveForm={setResolveForm}
                  resolveErrors={resolveErrors}
                  onResolve={resolveTicket}
                  meetingForm={meetingForm}
                  setMeetingForm={setMeetingForm}
                  meetingErrors={meetingErrors}
                  onAddMeeting={addMeeting}
                />
              </aside>
            </>
          )}
        </main>
      </div>

      {createOpen && (
        <CreateModal
          form={createForm}
          errors={createErrors}
          resolvedTickets={resolvedTickets}
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

// ─────────────────────────────────────────────────────────────────────────────
// TICKET CARD  — compact single-line layout
// ─────────────────────────────────────────────────────────────────────────────

function TicketCard({ ticket, parent, linkedCount, active, onClick }) {
  const cat = getCat(ticket.category);
  const CIcon = cat.Icon;
  const badge = etaBadge(ticket);
  const strikes = ticket.strikes?.length || 0;
  const noReply =
    strikes > 0 && ticket.strikes.every((s) => !s.responseReceived);

  return (
    <button
      onClick={onClick}
      className={[
        "w-full rounded-xl border bg-white p-3 text-left shadow-sm transition-all duration-150",
        active
          ? "border-slate-800 ring-2 ring-slate-200 shadow-md"
          : "border-slate-200 hover:border-slate-300 hover:shadow",
      ].join(" ")}
    >
      {/* Row 1: Category + Type badge + Priority */}
      <div className="flex items-center gap-1.5 mb-1.5">
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full border flex-none ${cat.pill}`}
        >
          <CIcon className="w-2.5 h-2.5" />
          {cat.label}
        </span>
        {ticket.type === "Linked Ticket" && (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700 border border-violet-200 flex-none">
            Linked
          </span>
        )}
        {!ticket.enrolledByIT && ticket.status === "Open" && (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200 flex-none">
            Pending
          </span>
        )}
        <span
          className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-md flex-none ${PRIORITY_PILL[ticket.priority]}`}
        >
          {ticket.priority}
        </span>
      </div>

      {/* Row 2: Description (single line) */}
      <p className="text-sm font-semibold text-slate-800 truncate-1 mb-1.5">
        {ticket.description}
      </p>

      {/* Row 3: Submitter · Date · ETA badge */}
      <div className="flex items-center gap-2 text-[11px]">
        <User className="w-3 h-3 text-slate-400 flex-none" />
        <span className="text-slate-500 font-medium truncate flex-1 min-w-0">
          {ticket.submittedBy}
        </span>
        <span className="mono text-slate-400 flex-none">
          {fmt(ticket.submittedDate)}
        </span>
        <span
          className={`font-semibold px-1.5 py-0.5 rounded-full flex-none ${badge.cls}`}
        >
          {badge.label}
        </span>
      </div>

      {/* Attachment inline */}
      {ticket.attachment && (
        <div className="mt-1.5 flex items-center gap-1 text-[10px] text-blue-600 bg-blue-50 border border-blue-100 rounded-lg px-2 py-1">
          <Paperclip className="w-2.5 h-2.5 flex-none" />
          <span className="truncate font-medium">{ticket.attachment.name}</span>
          <span className="text-blue-400 mono flex-none">
            {ticket.attachment.size}
          </span>
        </div>
      )}

      {/* Parent link */}
      {parent && (
        <div className="mt-1.5 flex items-center gap-1 text-[10px] text-slate-500 bg-slate-50 rounded-lg px-2 py-1 border border-slate-200">
          <Link2 className="w-2.5 h-2.5 flex-none" />
          <span className="truncate">↑ {parent.description}</span>
        </div>
      )}

      {/* Strike warning */}
      {ticket.status === "On Hold" && noReply && strikes > 0 && (
        <div className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 rounded-lg px-2 py-1 border border-amber-200">
          <Bell className="w-2.5 h-2.5" />
          {strikes}/3 follow-ups · no response
        </div>
      )}

      {linkedCount > 0 && (
        <div className="mt-1.5 text-[10px] font-semibold text-violet-700 bg-violet-50 rounded-lg px-2 py-1 border border-violet-200">
          {linkedCount} linked ticket{linkedCount > 1 ? "s" : ""}
        </div>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TICKET DRAWER
// ─────────────────────────────────────────────────────────────────────────────

function TicketDrawer({
  ticket,
  parent,
  linkedTickets,
  onClose,
  onOpenLinked,
  enrollForm,
  setEnrollForm,
  enrollErrors,
  onEnroll,
  statusConfirm,
  setStatusConfirm,
  onChangeStatus,
  strikeForm,
  setStrikeForm,
  strikeErrors,
  onSendStrike,
  responseForm,
  setResponseForm,
  onMarkResponse,
  onAutoClose,
  resolveForm,
  setResolveForm,
  resolveErrors,
  onResolve,
  meetingForm,
  setMeetingForm,
  meetingErrors,
  onAddMeeting,
}) {
  const cat = getCat(ticket.category);
  const CIcon = cat.Icon;
  const col = COLUMN_META[ticket.status];
  const badge = etaBadge(ticket);
  const isFinal = ["Resolved", "Closed"].includes(ticket.status);

  const strikesCount = ticket.strikes?.length || 0;
  const allSent = strikesCount >= 3;
  const noReplyAll =
    allSent && ticket.strikes.every((s) => !s.responseReceived);
  const canNextStrike = strikesCount < 3 && ticket.status === "On Hold";

  const [tab, setTab] = useState("details");

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Drawer header */}
      <div className="flex-none border-b border-slate-100 px-5 pt-5 pb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span
                className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${cat.pill}`}
              >
                <CIcon className="w-3 h-3" />
                {cat.label}
              </span>
              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${col.chip}`}
              >
                {ticket.status}
              </span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${PRIORITY_PILL[ticket.priority]}`}
              >
                {ticket.priority}
              </span>
              {ticket.type === "Linked Ticket" && (
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-violet-100 text-violet-700 border border-violet-200">
                  Linked Ticket
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
            </div>
            {ticket.attachment && (
              <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-3 py-1.5">
                <Paperclip className="w-3.5 h-3.5" />
                {ticket.attachment.name}
                <span className="text-blue-400 mono font-normal">
                  {ticket.attachment.size}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick stat grid */}
        <div className="grid grid-cols-3 gap-2 mb-3">
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
              By
            </p>
            <p className="text-sm font-bold text-slate-700 mt-0.5 truncate">
              {ticket.submittedBy}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
          {["details", "meetings", "history"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg capitalize transition-all ${tab === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto thin-scroll p-5 space-y-4 min-h-0">
        {/* DETAILS TAB */}
        {tab === "details" && (
          <>
            {/* Linked tickets */}
            {(parent || linkedTickets.length > 0) && (
              <Section title="Linked Tickets">
                <div className="mt-3 space-y-2">
                  {parent && (
                    <button
                      onClick={() => onOpenLinked(parent.id)}
                      className="w-full flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left hover:bg-slate-50 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
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
                      className="w-full flex items-center justify-between rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-left hover:bg-violet-100 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-1">
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

            {/* IT ENROLLMENT */}
            {!ticket.enrolledByIT && ticket.status === "Open" && (
              <Section
                title="IT Department — Enroll Ticket"
                accent="amber"
                subtitle="Set IT assignee, start date, and ETA before work begins."
              >
                <div className="mt-4 space-y-3">
                  <Field label="IT Assignee" error={enrollErrors.itAssignee}>
                    <div className="relative">
                      <select
                        value={enrollForm.itAssignee}
                        onChange={(e) =>
                          setEnrollForm((p) => ({
                            ...p,
                            itAssignee: e.target.value,
                          }))
                        }
                        className="h-10 w-full appearance-none rounded-xl border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:border-slate-400"
                      >
                        <option value="">Select IT engineer</option>
                        {IT_ENGINEERS.map((eng) => (
                          <option key={eng} value={eng}>
                            {eng}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />
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
                      rows={3}
                      value={enrollForm.itRemarks}
                      onChange={(e) =>
                        setEnrollForm((p) => ({
                          ...p,
                          itRemarks: e.target.value,
                        }))
                      }
                      placeholder="Scope, assigned team, dependencies..."
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-slate-400 resize-none"
                    />
                  </Field>
                  <button
                    onClick={onEnroll}
                    className="w-full h-11 rounded-xl bg-slate-900 text-sm font-bold text-white hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <UserCheck className="w-4 h-4" />
                    Enroll Ticket & Begin Work
                  </button>
                </div>
              </Section>
            )}

            {/* ENROLLED IT INFO */}
            {ticket.enrolledByIT && (
              <Section title="IT Enrollment Details">
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <InfoBox
                    label="IT Assignee"
                    value={ticket.itAssignee || "—"}
                  />
                  <InfoBox
                    label="IT Start Date"
                    value={fmt(ticket.itStartDate)}
                  />
                  <InfoBox label="ETA Date" value={fmt(ticket.etaDate)} />
                  <InfoBox
                    label="Closing Date"
                    value={fmt(ticket.closingDate)}
                  />
                </div>
                {ticket.itRemarks && (
                  <div className="mt-3 rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm text-slate-700 leading-relaxed italic">
                    "{ticket.itRemarks}"
                  </div>
                )}
              </Section>
            )}

            {/* STATUS CHANGE with confirmation */}
            {!isFinal && ticket.enrolledByIT && (
              <Section
                title="Move Ticket"
                subtitle="Change the current status of this ticket."
              >
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {STATUSES.filter(
                    (s) => s !== ticket.status && s !== "Open",
                  ).map((s) => {
                    const m = COLUMN_META[s];
                    const SI = m.Icon;
                    return (
                      <button
                        key={s}
                        onClick={() => setStatusConfirm({ status: s })}
                        className={`flex items-center gap-2 h-10 px-3 rounded-xl border text-sm font-semibold transition-all hover:opacity-80 ${m.chip}`}
                      >
                        <SI className="w-4 h-4" />
                        {s}
                      </button>
                    );
                  })}
                </div>

                {/* Inline confirmation */}
                {statusConfirm && (
                  <div className="mt-3 rounded-xl border border-slate-300 bg-white p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertOctagon className="w-4 h-4 text-slate-600 flex-none" />
                      <p className="text-sm font-bold text-slate-800">
                        Move ticket to{" "}
                        <span
                          className={`font-extrabold ${COLUMN_META[statusConfirm.status].header}`}
                        >
                          {statusConfirm.status}
                        </span>
                        ?
                      </p>
                    </div>
                    <p className="text-xs text-slate-500 mb-3">
                      This action will be recorded in the ticket history with
                      today's date.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onChangeStatus(statusConfirm.status)}
                        className={`flex-1 h-9 rounded-xl text-xs font-bold text-white transition-colors flex items-center justify-center gap-1.5 ${statusConfirm.status === "Resolved" ? "bg-emerald-600 hover:bg-emerald-700" : statusConfirm.status === "Closed" ? "bg-slate-700 hover:bg-slate-800" : statusConfirm.status === "On Hold" ? "bg-amber-500 hover:bg-amber-600" : "bg-blue-600 hover:bg-blue-700"}`}
                      >
                        Confirm — Move to {statusConfirm.status}
                      </button>
                      <button
                        onClick={() => setStatusConfirm(null)}
                        className="h-9 px-4 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </Section>
            )}

            {/* THREE STRIKE FOLLOW-UP */}
            {ticket.status === "On Hold" && (
              <Section
                title="Three-Strike Follow-up"
                accent="amber"
                subtitle="Send up to 3 follow-up notifications. No response after all three → close ticket."
              >
                <div className="mt-4 space-y-3">
                  {[1, 2, 3].map((num) => {
                    const strike = ticket.strikes?.find(
                      (s) => s.strikeNumber === num,
                    );
                    const isNext = !strike && strikesCount === num - 1;
                    const locked = !strike && !isNext;

                    return (
                      <div
                        key={num}
                        className={`rounded-xl border p-4 transition-all ${locked ? "bg-slate-50 border-slate-100 opacity-40" : strike?.responseReceived ? "bg-emerald-50 border-emerald-200" : strike ? "bg-amber-50 border-amber-200" : "bg-white border-slate-200"}`}
                      >
                        {/* Strike header */}
                        <div className="flex items-center gap-2.5 mb-3">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-none ${strike?.responseReceived ? "bg-emerald-500 text-white" : strike ? "bg-amber-500 text-white" : isNext ? "bg-slate-200 text-slate-600" : "bg-slate-200 text-slate-400"}`}
                          >
                            {num}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
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
                        </div>

                        {/* Sent message */}
                        {strike && (
                          <div className="bg-white/80 rounded-lg border border-current/10 px-3 py-2 text-xs text-slate-700 italic mb-2">
                            "{strike.note}"
                          </div>
                        )}

                        {/* Response received */}
                        {strike?.responseReceived && (
                          <div className="bg-emerald-100 border border-emerald-200 rounded-lg px-3 py-2 text-xs text-emerald-800 mt-2">
                            <span className="font-bold">
                              Response ({fmt(strike.responseDate)}):
                            </span>{" "}
                            {strike.responseNote}
                          </div>
                        )}

                        {/* Mark response form */}
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

                        {/* Send next strike */}
                        {isNext && canNextStrike && (
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
                </div>

                {/* Strike history summary */}
                {strikesCount > 0 && (
                  <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                      Follow-up History
                    </p>
                    <div className="space-y-1.5">
                      {ticket.strikes.map((s) => (
                        <div
                          key={s.id}
                          className="flex items-center gap-2 text-[11px]"
                        >
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-none ${s.responseReceived ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                          >
                            {s.strikeNumber}
                          </span>
                          <span className="mono text-slate-400 flex-none">
                            {fmt(s.sentDate)}
                          </span>
                          <span className="text-blue-600 truncate flex-1">
                            {s.mailId}
                          </span>
                          <span
                            className={`font-semibold flex-none ${s.responseReceived ? "text-emerald-600" : "text-amber-600"}`}
                          >
                            {s.responseReceived ? "✓" : "—"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Auto-close */}
                {noReplyAll && (
                  <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <BellOff className="w-5 h-5 text-red-600 flex-none mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-red-800">
                          All 3 follow-ups unanswered
                        </p>
                        <p className="text-xs text-red-600 mt-0.5">
                          You may now close this ticket. The full strike trace
                          is permanently logged.
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
              </Section>
            )}

            {/* RESOLVE TICKET */}
            {ticket.status === "In Progress" && (
              <Section
                title="Resolve & Close Ticket"
                accent="emerald"
                subtitle="Set the closing date and document what was done."
              >
                <div className="mt-4 space-y-3">
                  <Field label="Closing Date" error={resolveErrors.closingDate}>
                    <input
                      type="date"
                      value={resolveForm.closingDate}
                      onChange={(e) =>
                        setResolveForm((p) => ({
                          ...p,
                          closingDate: e.target.value,
                        }))
                      }
                      className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:border-emerald-400"
                    />
                  </Field>
                  <Field
                    label="Resolution Summary"
                    error={resolveErrors.resolutionNote}
                  >
                    <textarea
                      rows={3}
                      value={resolveForm.resolutionNote}
                      onChange={(e) =>
                        setResolveForm((p) => ({
                          ...p,
                          resolutionNote: e.target.value,
                        }))
                      }
                      placeholder="Describe what was done, changes made, handover notes..."
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400 resize-none"
                    />
                  </Field>
                  <button
                    onClick={onResolve}
                    className="w-full h-11 rounded-xl bg-emerald-600 text-sm font-bold text-white hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <CalendarCheck className="w-4 h-4" />
                    Mark as Resolved
                  </button>
                </div>
              </Section>
            )}

            {/* Resolved summary */}
            {ticket.status === "Resolved" && ticket.resolutionNote && (
              <Section
                title="Resolution Summary"
                accent="emerald"
                subtitle={`Closed ${fmt(ticket.closingDate)}`}
              >
                <div className="mt-3 rounded-xl bg-white border border-emerald-200 px-4 py-3 text-sm text-emerald-900 leading-relaxed">
                  {ticket.resolutionNote}
                </div>
              </Section>
            )}

            {/* Auto-closed banner */}
            {ticket.autoClosedAfterStrikes && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-start gap-3">
                <BellOff className="w-5 h-5 text-red-600 flex-none mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-red-800">
                    Auto-closed after 3 unanswered follow-ups
                  </p>
                  <p className="text-xs text-red-600 mt-0.5">
                    Closed on {fmt(ticket.closingDate)}. Full trace in History
                    tab.
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* MEETINGS TAB */}
        {tab === "meetings" && (
          <>
            {!isFinal && (
              <Section title="Log a Meeting">
                <div className="mt-3 space-y-3">
                  <Field label="Meeting Date" error={meetingErrors.meetingDate}>
                    <input
                      type="date"
                      max={todayISO()}
                      value={meetingForm.meetingDate}
                      onChange={(e) =>
                        setMeetingForm((p) => ({
                          ...p,
                          meetingDate: e.target.value,
                        }))
                      }
                      className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:border-slate-400"
                    />
                  </Field>
                  <Field label="Agenda" error={meetingErrors.agenda}>
                    <input
                      type="text"
                      value={meetingForm.agenda}
                      onChange={(e) =>
                        setMeetingForm((p) => ({
                          ...p,
                          agenda: e.target.value,
                        }))
                      }
                      placeholder="e.g. Requirements review with stakeholders"
                      className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:border-slate-400"
                    />
                  </Field>
                  <Field
                    label="Points Discussed"
                    error={meetingErrors.discussion}
                  >
                    <textarea
                      rows={4}
                      value={meetingForm.discussion}
                      onChange={(e) =>
                        setMeetingForm((p) => ({
                          ...p,
                          discussion: e.target.value,
                        }))
                      }
                      placeholder="Decisions, action items, owners, next steps..."
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-slate-400 resize-none"
                    />
                  </Field>
                  <button
                    onClick={onAddMeeting}
                    className="w-full h-11 rounded-xl bg-slate-900 text-sm font-bold text-white hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Meeting Record
                  </button>
                </div>
              </Section>
            )}
            <Section
              title="Meeting Timeline"
              subtitle={`${ticket.meetings.length} record${ticket.meetings.length !== 1 ? "s" : ""} · latest first`}
            >
              <div className="mt-3 space-y-3">
                {ticket.meetings.length === 0 ? (
                  <div className="flex h-20 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400 font-medium">
                    No meetings recorded yet
                  </div>
                ) : (
                  ticket.meetings.map((m) => (
                    <div
                      key={m.id}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <MessageSquareText className="w-4 h-4 text-slate-500 flex-none" />
                          <p className="text-sm font-bold text-slate-800 truncate">
                            {m.agenda}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-none">
                          <span className="mono text-[11px] bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-500">
                            {fmt(m.meetingDate)}
                          </span>
                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${COLUMN_META[m.statusAtTime]?.chip}`}
                          >
                            {m.statusAtTime}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {m.discussion}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </Section>
          </>
        )}

        {/* HISTORY TAB */}
        {tab === "history" && (
          <Section
            title="Status History"
            subtitle="Full audit trail of all status changes and actions."
          >
            <div className="mt-3 space-y-2">
              {[...ticket.statusHistory].reverse().map((e, i) => {
                const m = COLUMN_META[e.status];
                const SI = m?.Icon || ArrowRight;
                return (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center flex-none mt-0.5 ${m?.chip || "bg-slate-100"}`}
                    >
                      <SI className="w-3 h-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-xs font-bold ${m?.header || "text-slate-600"}`}
                        >
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
          </Section>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CREATE MODAL
// ─────────────────────────────────────────────────────────────────────────────

function CreateModal({
  form,
  errors,
  resolvedTickets,
  onChange,
  onClose,
  onSubmit,
}) {
  const fileRef = useRef(null);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 flex-none">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Raise a New IT Ticket
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              IT will review, enroll, and set the ETA after submission.
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
          {/* Type toggle */}
          <Field label="Ticket Type" error={errors.type}>
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

          {/* Category */}
          <Field label="Category" error={errors.category}>
            <div className="relative">
              <select
                value={form.category}
                onChange={(e) =>
                  onChange((p) => ({ ...p, category: e.target.value }))
                }
                className="h-10 w-full appearance-none rounded-xl border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:border-slate-400"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />
            </div>
          </Field>

          {/* Parent ticket (Linked Ticket only) */}
          {form.type === "Linked Ticket" && (
            <Field label="Link to Resolved Ticket" error={errors.parentId}>
              <div className="relative">
                <select
                  value={form.parentId}
                  onChange={(e) =>
                    onChange((p) => ({ ...p, parentId: e.target.value }))
                  }
                  className="h-10 w-full appearance-none rounded-xl border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:border-slate-400"
                >
                  <option value="">Select resolved ticket</option>
                  {resolvedTickets.map((t) => (
                    <option key={t.id} value={t.id}>
                      #{t.id} — {t.description}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />
              </div>
            </Field>
          )}

          {/* Description */}
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

          {/* Submitted By */}
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

          {/* Priority */}
          <Field label="Priority">
            <div className="flex gap-2 flex-wrap">
              {PRIORITIES.map((pri) => (
                <button
                  key={pri}
                  onClick={() => onChange((p) => ({ ...p, priority: pri }))}
                  className={`h-9 px-4 rounded-xl border text-xs font-bold transition-all ${form.priority === pri ? PRIORITY_PILL[pri] + " shadow-sm" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}
                >
                  {pri}
                </button>
              ))}
            </div>
          </Field>

          {/* Attachment */}
          <Field label="Attachment (optional)">
            <div
              onClick={() => fileRef.current?.click()}
              className={`flex items-center gap-3 rounded-xl border-2 border-dashed cursor-pointer px-4 py-3.5 transition-all ${form.attachment ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"}`}
            >
              <Paperclip
                className={`w-5 h-5 flex-none ${form.attachment ? "text-blue-500" : "text-slate-400"}`}
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
                    Click to attach a file
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    PDF, DOCX, XLSX, images — optional
                  </p>
                </div>
              )}
              {form.attachment && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange((p) => ({ ...p, attachment: null }));
                  }}
                  className="p-1 rounded-lg text-blue-400 hover:text-blue-600 flex-none"
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
            IT will enroll this ticket and set the working ETA.
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="h-10 px-4 rounded-xl border border-slate-300 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
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

// ─────────────────────────────────────────────────────────────────────────────
// MICRO-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

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
