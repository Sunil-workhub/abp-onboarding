import { useEffect, useMemo, useRef, useState, useCallback } from "react";
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
  ChevronLeft,
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
  ArrowLeftRight,
  RefreshCw,
  Layers,
  Tag,
  Globe,
  Building2,
  Users2,
  UserCircle,
  Timer,
  List,
  Briefcase,
  EyeOff,
  UserCog,
  Filter,
  UserX,
  FileText,
  BadgeCheck,
  GraduationCap,
  Stethoscope,
  Banknote,
  Scale,
  ShieldAlert,
  Landmark,
  UserPlus,
  HelpCircle,
  Eye,
  KeyRound,
  AtSign,
  Hash,
  Factory,
  Cog,
  Cpu,
} from "lucide-react";
import BgImage from "./assets/images/it-hepdesk-front.jpg";
import BgImage1 from "./assets/images/it-hep-desk-bg.jpg";
import IndefLogo from "./assets/logo/IndefLogo.png";

// ─── ORGS ────────────────────────────────────────────────────────────────────
const ORGS = ["IML", "CSIL", "Daedalus"];

// ─── USERS ───────────────────────────────────────────────────────────────────
const initials = (name) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const USERS = [
  {
    id: "it_madhav",
    empId: "8165",
    name: "Madhav Shettigar",
    role: "IT",
    dept: "IT Department",
    avatar: initials("Madhav Shettigar"),
    org: "IML",
  },
  {
    id: "it_harish",
    empId: "8033",
    name: "Harish Poojary",
    role: "IT",
    dept: "IT Department",
    avatar: initials("Harish Poojary"),
    org: "IML",
  },
  {
    id: "it_babasaheb",
    empId: "8213",
    name: "Babasaheb Suryavanshi",
    role: "IT",
    dept: "IT Department",
    avatar: initials("Babasaheb Suryavanshi"),
    org: "IML",
  },
  {
    id: "it_security",
    empId: "6001",
    name: "Security Security",
    role: "IT",
    dept: "IT Department",
    avatar: "SC",
    org: "IML",
  },
  {
    id: "it_pranay",
    empId: "8295",
    name: "Pranay Mahadik",
    role: "IT",
    dept: "IT Department",
    avatar: initials("Pranay Mahadik"),
    org: "IML",
  },
  {
    id: "hr_rajesh",
    empId: "9086",
    name: "Rajesh Virkud",
    role: "HR",
    dept: "HR Department",
    avatar: initials("Rajesh Virkud"),
    org: "IML",
  },
  {
    id: "hr_nilesh",
    empId: "9102",
    name: "Nilesh Sarangdhar",
    role: "HR",
    dept: "HR Department",
    avatar: initials("Nilesh Sarangdhar"),
    org: "IML",
  },
  {
    id: "hr_ravindra",
    empId: "7007",
    name: "Ravindra Kudpane",
    role: "HR",
    dept: "HR Department",
    avatar: initials("Ravindra Kudpane"),
    org: "IML",
  },
  {
    id: "hr_santosh",
    empId: "7026",
    name: "Santosh Hadap",
    role: "HR",
    dept: "HR Department",
    avatar: initials("Santosh Hadap"),
    org: "IML",
  },
  {
    id: "hr_vinod",
    empId: "7036",
    name: "Vinod More",
    role: "HR",
    dept: "HR Department",
    avatar: initials("Vinod More"),
    org: "IML",
  },
  {
    id: "hr_pritam",
    empId: "7039",
    name: "Pritam Gawade",
    role: "HR",
    dept: "HR Department",
    avatar: initials("Pritam Gawade"),
    org: "IML",
  },
  {
    id: "hr_ratnesh",
    empId: "7056",
    name: "Ratnesh Gaikwad",
    role: "HR",
    dept: "HR Department",
    avatar: initials("Ratnesh Gaikwad"),
    org: "IML",
  },
  {
    id: "user_ananya",
    empId: "9011",
    name: "Ananya Iyer",
    role: "User",
    dept: "Security",
    avatar: initials("Ananya Iyer"),
    org: "IML",
  },
  {
    id: "user_suresh",
    empId: "9043",
    name: "Suresh Nair",
    role: "User",
    dept: "Operations",
    avatar: initials("Suresh Nair"),
    org: "IML",
  },
  {
    id: "user_meera",
    empId: "9076",
    name: "Meera Joshi",
    role: "User",
    dept: "Finance Systems",
    avatar: initials("Meera Joshi"),
    org: "CSIL",
  },
  {
    id: "user_deepak",
    empId: "9102u",
    name: "Deepak Arora",
    role: "User",
    dept: "Backend Engineering",
    avatar: initials("Deepak Arora"),
    org: "CSIL",
  },
  {
    id: "user_pooja",
    empId: "9158",
    name: "Pooja Verma",
    role: "User",
    dept: "Legal",
    avatar: initials("Pooja Verma"),
    org: "Daedalus",
  },
  {
    id: "user_sunil",
    empId: "9201",
    name: "Sunil Varma",
    role: "User",
    dept: "Manufacturing",
    avatar: initials("Sunil Varma"),
    org: "IML",
  },
  {
    id: "user_kavita",
    empId: "9215",
    name: "Kavita Joshi",
    role: "User",
    dept: "Procurement",
    avatar: initials("Kavita Joshi"),
    org: "CSIL",
  },
  {
    id: "user_ramesh",
    empId: "9230",
    name: "Ramesh Patil",
    role: "User",
    dept: "Quality Assurance",
    avatar: initials("Ramesh Patil"),
    org: "IML",
  },
  {
    id: "user_priya",
    empId: "9245",
    name: "Priya Desai",
    role: "User",
    dept: "Sales",
    avatar: initials("Priya Desai"),
    org: "Daedalus",
  },
];

const USER_CREDENTIALS = {
  8165: { password: "Madhav@IT165", userId: "it_madhav" },
  8033: { password: "Harish@IT033", userId: "it_harish" },
  8213: { password: "Baba@IT213", userId: "it_babasaheb" },
  6001: { password: "Sec@IT001", userId: "it_security" },
  8295: { password: "Pranay@IT295", userId: "it_pranay" },
  9086: { password: "Rajesh@HR086", userId: "hr_rajesh" },
  9102: { password: "Nilesh@HR102", userId: "hr_nilesh" },
  7007: { password: "Ravi@HR007", userId: "hr_ravindra" },
  7026: { password: "Santosh@HR026", userId: "hr_santosh" },
  7036: { password: "Vinod@HR036", userId: "hr_vinod" },
  7039: { password: "Pritam@HR039", userId: "hr_pritam" },
  7056: { password: "Ratnesh@HR056", userId: "hr_ratnesh" },
  9011: { password: "Ananya@123", userId: "user_ananya" },
  9043: { password: "Suresh@456", userId: "user_suresh" },
  9076: { password: "Meera@789", userId: "user_meera" },
  "9102u": { password: "Deepak@321", userId: "user_deepak" },
  9158: { password: "Pooja@654", userId: "user_pooja" },
  9201: { password: "Sunil@201", userId: "user_sunil" },
  9215: { password: "Kavita@215", userId: "user_kavita" },
  9230: { password: "Ramesh@230", userId: "user_ramesh" },
  9245: { password: "Priya@245", userId: "user_priya" },
};

const SOFTWARE_PROJECTS = [
  "ILEAP",
  "CSIL",
  "ERP Portal",
  "HRM Suite",
  "Finance Module",
  "Other",
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
      "Waiting for User Input",
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
      "Waiting for User Input",
      "Closed",
    ],
    flowType: "full",
  },
  hardware: {
    label: "Hardware",
    Icon: HardDrive,
    pill: "bg-amber-50 text-amber-700 border-amber-200",
    statuses: ["Open", "In Progress", "Waiting for User Input", "Closed"],
    flowType: "simple",
  },
  networking: {
    label: "Networking",
    Icon: WifiOff,
    pill: "bg-orange-50 text-orange-700 border-orange-200",
    statuses: ["Open", "In Progress", "Waiting for User Input", "Closed"],
    flowType: "simple",
  },
};

// Categories that support On Hold + Waiting for User Input columns
const FULL_FLOW_CATEGORIES = ["software", "erp"];

const HR_STATUSES = ["Open", "Queue", "Assigned", "In Progress", "Closed"];

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
  Queue: {
    dot: "bg-indigo-400",
    txt: "text-indigo-700",
    chip: "bg-indigo-100 text-indigo-700",
    Icon: List,
  },
  Assigned: {
    dot: "bg-blue-400",
    txt: "text-blue-700",
    chip: "bg-blue-100 text-blue-700",
    Icon: UserCheck,
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
  "Waiting for User Input": {
    dot: "bg-orange-500",
    txt: "text-orange-700",
    chip: "bg-orange-100 text-orange-700",
    Icon: Timer,
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

const PRIORITIES = ["Critical", "Medium", "Normal"];
const TICKET_TYPES = ["Service Request", "Incident"];
const REQUEST_TYPES = ["Service Request", "Incident"];

const IT_IMPACT_OPTIONS = [
  {
    value: "business",
    label: "Business",
    Icon: Globe,
    desc: "Affects entire business operations",
  },
  {
    value: "department",
    label: "Department",
    Icon: Building2,
    desc: "Affects a whole department",
  },
  {
    value: "team",
    label: "Team",
    Icon: Users2,
    desc: "Affects a group / team of users",
  },
  {
    value: "user",
    label: "User",
    Icon: UserCircle,
    desc: "Affects a single user",
  },
];

const HR_IMPACT_OPTIONS = [
  {
    value: "legal_compliance",
    label: "Legal / Compliance Risk",
    Icon: ShieldAlert,
    desc: "Policy breach, statutory compliance",
  },
  {
    value: "financial_payroll",
    label: "Financial / Payroll",
    Icon: Landmark,
    desc: "Salary, reimbursements, benefits",
  },
  {
    value: "employee_lifecycle",
    label: "Employee Lifecycle",
    Icon: UserPlus,
    desc: "Joining, transfers, exits",
  },
  {
    value: "general_inquiry",
    label: "General Inquiry",
    Icon: HelpCircle,
    desc: "General HR questions",
  },
];

const PERSONAL_IMPACT_VALUES = ["user", "general_inquiry"];

const HOLD_REASON_OPTIONS = [
  { value: "response_not_received", label: "Response Not Received" },
  { value: "pending_approval", label: "Pending Approval" },
  { value: "vendor_dependency", label: "Vendor Dependency" },
  { value: "other", label: "Other Issue" },
];

const PRIORITY_PILL = {
  Critical: "bg-red-100 text-red-700 border border-red-200",
  High: "bg-orange-100 text-orange-700 border border-orange-200",
  Medium: "bg-amber-100 text-amber-700 border border-amber-200",
  Normal: "bg-blue-100 text-blue-700 border border-blue-200",
  Low: "bg-slate-100 text-slate-600 border border-slate-200",
};

const ORG_PILL = {
  IML: "bg-blue-100 text-blue-700 border border-blue-200",
  CSIL: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  Daedalus: "bg-purple-100 text-purple-700 border border-purple-200",
};

const STORAGE_KEY = "enlife_helpdesk_tickets_v4";

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
const IT_ENGINEERS = USERS.filter((u) => u.role === "IT");
const HR_ENGINEERS = USERS.filter((u) => u.role === "HR");
const getImpactLabel = (impact, isHR) => {
  const opts = isHR ? HR_IMPACT_OPTIONS : IT_IMPACT_OPTIONS;
  return opts.find((i) => i.value === impact)?.label || "—";
};

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

// Testing statuses that go in their own kanban column
const TESTING_STATUSES = ["IT Testing", "Ready for Demo", "User Testing"];

// ─── INITIAL TICKETS ─────────────────────────────────────────────────────────
const INITIAL_TICKETS = [
  {
    id: 1,
    ticketDept: "IT",
    description: "Firewall rule update for SOC team VPN access",
    category: "networking",
    submittedBy: "Ananya Iyer",
    submittedByEmpId: "9011",
    onBehalfOf: "",
    priority: "Critical",
    ticketType: "Incident",
    requestType: "Incident",
    impact: "team",
    softwareProject: null,
    status: "In Progress",
    submittedDate: "2026-03-10",
    itStartDate: "2026-03-13",
    etaDate: "2026-04-15",
    etaHours: null,
    closingDate: null,
    closingNote: "",
    holdRemarks: "",
    holdReasonType: "",
    attachment: { name: "soc_vpn_requirements.pdf", size: "248 KB" },
    type: "Ticket",
    parentId: null,
    linkedTaskIds: [],
    enrolledByIT: true,
    itAssignees: ["Harish Poojary"],
    itRemarks: "Assigned to NetOps.",
    org: "IML",
    statusHistory: [
      { status: "Open", date: "2026-03-10", note: "Submitted", remarks: "" },
      {
        status: "In Progress",
        date: "2026-03-13",
        note: "Enrolled.",
        remarks: "",
      },
    ],
    messages: [
      {
        id: 101,
        userId: "it_harish",
        text: "Reviewed requirements. Starting firewall config.",
        ts: "2026-03-13T10:30:00",
      },
      {
        id: 102,
        userId: "user_ananya",
        text: "Thanks. Please ensure port 1194 is open for UDP.",
        ts: "2026-03-13T11:00:00",
      },
    ],
    strikes: [],
    autoClosedAfterStrikes: false,
  },
  {
    id: 2,
    ticketDept: "IT",
    description: "New ERP module for procurement workflow automation",
    category: "erp",
    submittedBy: "Suresh Nair",
    submittedByEmpId: "9043",
    onBehalfOf: "",
    priority: "Critical",
    ticketType: "Service Request",
    requestType: "Service Request",
    impact: "department",
    softwareProject: null,
    status: "Discussion",
    submittedDate: "2026-03-01",
    itStartDate: "2026-03-06",
    etaDate: "2026-04-30",
    etaHours: null,
    closingDate: null,
    closingNote: "",
    holdRemarks: "",
    holdReasonType: "",
    attachment: { name: "procurement_workflow_spec.docx", size: "1.1 MB" },
    type: "Ticket",
    parentId: null,
    linkedTaskIds: [],
    enrolledByIT: true,
    itAssignees: ["Madhav Shettigar"],
    itRemarks: "Requirements under discussion.",
    org: "IML",
    statusHistory: [
      { status: "Open", date: "2026-03-01", note: "Submitted", remarks: "" },
      {
        status: "Requirement",
        date: "2026-03-06",
        note: "Reviewing.",
        remarks: "",
      },
      {
        status: "Discussion",
        date: "2026-03-22",
        note: "Discussion in progress.",
        remarks: "",
      },
    ],
    messages: [
      {
        id: 201,
        userId: "it_madhav",
        text: "Suresh, we need to discuss the workflow steps.",
        ts: "2026-03-22T09:00:00",
      },
      {
        id: 202,
        userId: "user_suresh",
        text: "Will share details by this week.",
        ts: "2026-03-22T09:30:00",
      },
    ],
    strikes: [],
    autoClosedAfterStrikes: false,
  },
  {
    id: 3,
    ticketDept: "IT",
    description:
      "Laptop replacement for Finance team — 5 units (Dell Latitude)",
    category: "hardware",
    submittedBy: "Meera Joshi",
    submittedByEmpId: "9076",
    onBehalfOf: "",
    priority: "Medium",
    ticketType: "Service Request",
    requestType: "Service Request",
    impact: "team",
    softwareProject: null,
    status: "Closed",
    submittedDate: "2026-02-15",
    itStartDate: "2026-02-18",
    etaDate: "2026-03-15",
    etaHours: null,
    closingDate: "2026-03-14",
    closingNote: "All 5 units delivered and handed over.",
    holdRemarks: "",
    holdReasonType: "",
    attachment: null,
    type: "Ticket",
    parentId: null,
    linkedTaskIds: [4],
    enrolledByIT: true,
    itAssignees: ["Pranay Mahadik"],
    itRemarks: "Procurement approved.",
    org: "CSIL",
    statusHistory: [
      { status: "Open", date: "2026-02-15", note: "Submitted", remarks: "" },
      {
        status: "In Progress",
        date: "2026-02-18",
        note: "Procurement initiated.",
        remarks: "",
      },
      {
        status: "Closed",
        date: "2026-03-14",
        note: "5 units delivered.",
        remarks: "",
      },
    ],
    messages: [
      {
        id: 301,
        userId: "it_pranay",
        text: "Ordering 5x Dell Latitude 5540.",
        ts: "2026-02-18T09:00:00",
      },
      {
        id: 302,
        userId: "user_meera",
        text: "Please ensure 16GB RAM.",
        ts: "2026-02-18T09:15:00",
      },
    ],
    strikes: [],
    autoClosedAfterStrikes: false,
  },
  {
    id: 4,
    ticketDept: "IT",
    description: "Register asset tags and warranty entries for 5 new laptops",
    category: "hardware",
    submittedBy: "IT Team",
    submittedByEmpId: "",
    onBehalfOf: "",
    priority: "Normal",
    ticketType: "Service Request",
    requestType: "Service Request",
    impact: "user",
    softwareProject: null,
    status: "Open",
    submittedDate: "2026-03-15",
    itStartDate: null,
    etaDate: null,
    etaHours: null,
    closingDate: null,
    closingNote: "",
    holdRemarks: "",
    holdReasonType: "",
    attachment: null,
    type: "Linked Ticket",
    parentId: 3,
    linkedTaskIds: [],
    enrolledByIT: false,
    itAssignees: [],
    itRemarks: "",
    org: "CSIL",
    statusHistory: [
      {
        status: "Open",
        date: "2026-03-15",
        note: "Follow-up task post delivery",
        remarks: "",
      },
    ],
    messages: [],
    strikes: [],
    autoClosedAfterStrikes: false,
  },
  {
    id: 5,
    ticketDept: "IT",
    description: "Office 365 license migration — E3 → E5 upgrade for 80 users",
    category: "software",
    submittedBy: "Deepak Arora",
    submittedByEmpId: "9102u",
    onBehalfOf: "",
    priority: null,
    ticketType: null,
    requestType: "Service Request",
    impact: "business",
    softwareProject: "ILEAP",
    status: "Open",
    submittedDate: "2026-04-01",
    itStartDate: null,
    etaDate: null,
    etaHours: null,
    closingDate: null,
    closingNote: "",
    holdRemarks: "",
    holdReasonType: "",
    attachment: { name: "user_license_list.xlsx", size: "54 KB" },
    type: "Ticket",
    parentId: null,
    linkedTaskIds: [],
    enrolledByIT: false,
    itAssignees: [],
    itRemarks: "",
    org: "CSIL",
    statusHistory: [
      { status: "Open", date: "2026-04-01", note: "Submitted", remarks: "" },
    ],
    messages: [],
    strikes: [],
    autoClosedAfterStrikes: false,
  },
  {
    id: 6,
    ticketDept: "IT",
    description: "ILEAP portal performance degradation — pages loading slowly",
    category: "software",
    submittedBy: "Sunil Varma",
    submittedByEmpId: "9201",
    onBehalfOf: "",
    priority: "Critical",
    ticketType: "Incident",
    requestType: "Incident",
    impact: "business",
    softwareProject: "ILEAP",
    status: "IT Testing",
    submittedDate: "2026-04-10",
    itStartDate: "2026-04-11",
    etaDate: "2026-04-25",
    etaHours: null,
    closingDate: null,
    closingNote: "",
    holdRemarks: "",
    holdReasonType: "",
    attachment: null,
    type: "Ticket",
    parentId: null,
    linkedTaskIds: [],
    enrolledByIT: true,
    itAssignees: ["Babasaheb Suryavanshi"],
    itRemarks: "Profiling DB queries.",
    org: "IML",
    statusHistory: [
      { status: "Open", date: "2026-04-10", note: "Submitted", remarks: "" },
      {
        status: "In Progress",
        date: "2026-04-11",
        note: "Enrolled.",
        remarks: "",
      },
      {
        status: "IT Testing",
        date: "2026-04-15",
        note: "Fix deployed to staging.",
        remarks: "",
      },
    ],
    messages: [
      {
        id: 601,
        userId: "it_babasaheb",
        text: "Found slow queries in report generation. Fix in testing.",
        ts: "2026-04-15T14:00:00",
      },
      {
        id: 602,
        userId: "user_sunil",
        text: "Thanks. Please test thoroughly before deployment.",
        ts: "2026-04-15T14:30:00",
      },
    ],
    strikes: [],
    autoClosedAfterStrikes: false,
  },
  {
    id: 7,
    ticketDept: "IT",
    description: "ERP procurement module — ready for user demo",
    category: "erp",
    submittedBy: "Ramesh Patil",
    submittedByEmpId: "9230",
    onBehalfOf: "",
    priority: "Medium",
    ticketType: "Service Request",
    requestType: "Service Request",
    impact: "department",
    softwareProject: "ERP Portal",
    status: "Ready for Demo",
    submittedDate: "2026-03-20",
    itStartDate: "2026-03-22",
    etaDate: "2026-04-28",
    etaHours: null,
    closingDate: null,
    closingNote: "",
    holdRemarks: "",
    holdReasonType: "",
    attachment: null,
    type: "Ticket",
    parentId: null,
    linkedTaskIds: [],
    enrolledByIT: true,
    itAssignees: ["Madhav Shettigar"],
    itRemarks: "Demo scheduled.",
    org: "IML",
    statusHistory: [
      { status: "Open", date: "2026-03-20", note: "Submitted", remarks: "" },
      {
        status: "In Progress",
        date: "2026-03-22",
        note: "Development started.",
        remarks: "",
      },
      {
        status: "IT Testing",
        date: "2026-04-05",
        note: "Testing complete.",
        remarks: "",
      },
      {
        status: "Ready for Demo",
        date: "2026-04-18",
        note: "Ready for client demo.",
        remarks: "",
      },
    ],
    messages: [],
    strikes: [],
    autoClosedAfterStrikes: false,
  },
  {
    id: 8,
    ticketDept: "HR",
    description: "Update employee records for 3 new joiners in Operations",
    category: null,
    submittedBy: "Suresh Nair",
    submittedByEmpId: "9043",
    onBehalfOf: "",
    priority: "Medium",
    ticketType: "Service Request",
    requestType: "Service Request",
    impact: "employee_lifecycle",
    softwareProject: null,
    status: "In Progress",
    submittedDate: "2026-04-05",
    itStartDate: "2026-04-07",
    etaDate: "2026-04-20",
    etaHours: null,
    closingDate: null,
    closingNote: "",
    holdRemarks: "",
    holdReasonType: "",
    attachment: null,
    type: "Ticket",
    parentId: null,
    linkedTaskIds: [],
    enrolledByIT: true,
    itAssignees: ["Rajesh Virkud"],
    itRemarks: "Collecting documents.",
    org: "IML",
    statusHistory: [
      { status: "Open", date: "2026-04-05", note: "Submitted", remarks: "" },
      {
        status: "Queue",
        date: "2026-04-06",
        note: "In HR queue.",
        remarks: "",
      },
      {
        status: "Assigned",
        date: "2026-04-07",
        note: "Assigned to Rajesh.",
        remarks: "",
      },
      {
        status: "In Progress",
        date: "2026-04-07",
        note: "Processing.",
        remarks: "",
      },
    ],
    messages: [
      {
        id: 801,
        userId: "hr_rajesh",
        text: "Collecting joining docs from managers.",
        ts: "2026-04-07T10:00:00",
      },
      {
        id: 802,
        userId: "user_suresh",
        text: "I'll coordinate with the managers.",
        ts: "2026-04-07T10:30:00",
      },
    ],
    strikes: [],
    autoClosedAfterStrikes: false,
  },
  {
    id: 9,
    ticketDept: "HR",
    description:
      "Full and Final settlement for resigned employee — Pooja Verma",
    category: null,
    submittedBy: "Pooja Verma",
    submittedByEmpId: "9158",
    onBehalfOf: "",
    priority: "Critical",
    ticketType: "Service Request",
    requestType: "Service Request",
    impact: "employee_lifecycle",
    softwareProject: null,
    status: "Open",
    submittedDate: "2026-04-10",
    itStartDate: null,
    etaDate: null,
    etaHours: null,
    closingDate: null,
    closingNote: "",
    holdRemarks: "",
    holdReasonType: "",
    attachment: { name: "resignation_letter.pdf", size: "120 KB" },
    type: "Ticket",
    parentId: null,
    linkedTaskIds: [],
    enrolledByIT: false,
    itAssignees: [],
    itRemarks: "",
    org: "Daedalus",
    statusHistory: [
      { status: "Open", date: "2026-04-10", note: "Submitted", remarks: "" },
    ],
    messages: [],
    strikes: [],
    autoClosedAfterStrikes: false,
  },
];

function loadTickets() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}
function saveTickets(tickets) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  } catch (e) {}
}

function HRPill({ small = false }) {
  if (small)
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full border bg-indigo-50 text-indigo-700 border-indigo-200 flex-none">
        <Briefcase className="w-2.5 h-2.5" />
        HR
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border bg-indigo-50 text-indigo-700 border-indigo-200">
      <Briefcase className="w-3 h-3" />
      HR
    </span>
  );
}

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [empId, setEmpId] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const ACCENT = "#5789A0";
  const TEXT_MAIN = "#111111";
  const TEXT_SUB = "#9aa3b0";
  const BORDER = "#e4e8ed";
  const ERROR_C = "#ef4444";
  const INPUT_FOCUS = "rgba(87,137,160,0.12)";

  const handleLogin = () => {
    setError("");
    if (!empId.trim() || !password) {
      setError("Please enter your Employee ID and password.");
      return;
    }
    const cred = USER_CREDENTIALS[empId.trim()];
    if (!cred) {
      setError("Employee ID not found.");
      return;
    }
    if (cred.password !== password) {
      setError("Incorrect password.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      onLogin(cred.userId);
      setLoading(false);
    }, 700);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
        position: "relative", // Keeps the background constrained to this container
      }}
    >
      {/* 1. Blurred Background Layer */}
      <div
        style={{
          position: "absolute",
          inset: 0, // Shorthand for top: 0, bottom: 0, left: 0, right: 0
          zIndex: -1, // Puts it behind your content
          background:
            "linear-gradient(135deg,#0f1720 0%,#1a2a38 50%,#0f1720 100%)",
          backgroundImage: `url(${BgImage1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(10px)", // Only blurs this background div
        }}
      />
      <style>{`
        @keyframes loginSpin { to { transform: rotate(360deg); } }
        @keyframes loginFadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        .login-card-inner { animation: loginFadeUp 0.55s ease both; }
        .login-inp-field {
          height:48px; padding:0 44px 0 16px;
          border-radius:10px; border:1.5px solid ${BORDER};
          background:#f8f9fb; font-size:13.5px; color:${TEXT_MAIN};
          outline:none; font-family:inherit; box-sizing:border-box; width:100%;
          transition:border-color .15s,box-shadow .15s,background .15s;
        }
        .login-inp-field:focus { border-color:${ACCENT}; box-shadow:0 0 0 3px ${INPUT_FOCUS}; background:#fff; }
        .login-inp-field.err { border-color:${ERROR_C}; background:#fef2f2; }
        .login-btn-main {
          height:50px; width:100%; border-radius:10px; border:none;
          background:${ACCENT}; color:#fff; font-size:14.5px; font-weight:700;
          cursor:pointer; font-family:inherit; letter-spacing:.02em;
          box-shadow:2px 4px 12px rgba(87,137,160,0.38);
          transition:opacity .15s,transform .12s,background .15s;
          display:flex; align-items:center; justify-content:center; gap:8px;
        }
        .login-btn-main:hover:not(:disabled) { opacity:.88; transform:translateY(-1px); }
        .login-btn-main:disabled { opacity:.5; cursor:not-allowed; }
        .login-bg-grid {
          position:absolute; inset:0;
          background-image:linear-gradient(rgba(87,137,160,0.05) 1px,transparent 1px),
            linear-gradient(90deg,rgba(87,137,160,0.05) 1px,transparent 1px);
          background-size:44px 44px;
        }
        @media(max-width:680px){.login-image-panel{display:none!important;}}
      `}</style>

      <div className="login-bg-grid" />

      <div
        className="login-card-inner"
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          width: "min(940px,92vw)",
          height: "min(600px,90vh)",
          borderRadius: 26,
          overflow: "hidden",
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.55),0 0 0 1px rgba(255,255,255,0.06)",
        }}
      >
        {/* LEFT panel */}
        <div
          className="login-image-panel"
          style={{
            flex: "0 0 48%",
            position: "relative",
            backgroundImage: `url(${BgImage})`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 0,
            overflow: "hidden",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-80px",
              right: "-80px",
              width: 300,
              height: 300,
              borderRadius: "50%",
              background:
                "radial-gradient(circle,rgba(87,137,160,0.18) 0%,transparent 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-60px",
              left: "-60px",
              width: 240,
              height: 240,
              borderRadius: "50%",
              background:
                "radial-gradient(circle,rgba(87,137,160,0.12) 0%,transparent 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(87,137,160,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(87,137,160,0.06) 1px,transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div
            style={{
              position: "relative",
              zIndex: 2,
              padding: "28px 28px 0",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 20px rgba(87,137,160,0.35)",
              }}
            >
              <img src={IndefLogo} />
            </div>
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#000000",
                  letterSpacing: "-.01em",
                }}
              >
                INDEF
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: 10,
                  color: "rgb(0, 0, 0)",
                  fontWeight: 600,
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                }}
              >
                Manufacturing Limited
              </p>
            </div>
          </div>
          <div
            style={{ position: "relative", zIndex: 2, padding: "0 28px 32px" }}
          >
            <div
              style={{
                display: "inline-block",
                background: "rgba(87,137,160,0.2)",
                border: "1px solid rgba(87,137,160,0.35)",
                borderRadius: 99,
                padding: "4px 14px",
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.7)",
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                }}
              >
                Support Portal
              </span>
            </div>
            <h2
              style={{
                margin: "0 0 8px",
                fontSize: 22,
                fontWeight: 800,
                color: "#000000",
                lineHeight: 1.3,
                textShadow: "0 2px 12px rgba(0,0,0,0.4)",
              }}
            >
              Helpdesk
              <br />
              <span
                style={{
                  color: "rgba(0, 0, 0, 0.6)",
                  fontSize: 15,
                  fontWeight: 500,
                }}
              >
                Integrated IT & HR support portal
              </span>
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: 11,
                color: "rgba(255,255,255,0.35)",
                letterSpacing: ".06em",
              }}
            >
              © {new Date().getFullYear()} Indef Manufacturing Limited
            </p>
          </div>
        </div>

        {/* RIGHT panel */}
        <div
          style={{
            flex: 1,
            background: "#ffffff",
            display: "flex",
            flexDirection: "column",
            padding: "32px 40px",
            overflowY: "auto",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 24px rgba(87,137,160,0.25)",
              }}
            >
              <img
                src={IndefLogo}
                style={{ height: 52, objectFit: "contain" }}
              />
            </div>
          </div>

          <h1
            style={{
              margin: "0 0 4px",
              fontSize: 28,
              fontWeight: 800,
              color: TEXT_MAIN,
              letterSpacing: "-0.6px",
              lineHeight: 1.15,
              textAlign: "center",
            }}
          >
            Welcome 👋
          </h1>
          <p
            style={{
              margin: "0 0 28px",
              fontSize: 13,
              color: TEXT_SUB,
              textAlign: "center",
            }}
          >
            Log in to your Helpdesk account
          </p>

          {error && (
            <div
              style={{
                marginBottom: 14,
                padding: "10px 14px",
                borderRadius: 10,
                background: "#fef2f2",
                border: "1px solid rgba(239,68,68,0.25)",
                color: ERROR_C,
                fontSize: 12,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 7,
              }}
            >
              <AlertCircle style={{ width: 13, height: 13, flexShrink: 0 }} />
              {error}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "rgba(87,137,160,0.8)",
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                Employee ID
              </label>
              <div style={{ position: "relative" }}>
                <Hash
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 15,
                    height: 15,
                    color: "rgba(87,137,160,0.5)",
                  }}
                />
                <input
                  type="text"
                  className={`login-inp-field${error && !empId ? " err" : ""}`}
                  style={{ paddingLeft: 40 }}
                  value={empId}
                  onChange={(e) => {
                    setEmpId(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="Employee number"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "rgba(87,137,160,0.8)",
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <KeyRound
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 15,
                    height: 15,
                    color: "rgba(87,137,160,0.5)",
                  }}
                />
                <input
                  type={showPass ? "text" : "password"}
                  className={`login-inp-field${error && !password ? " err" : ""}`}
                  style={{ paddingLeft: 40 }}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: TEXT_SUB,
                    padding: 4,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {showPass ? (
                    <EyeOff style={{ width: 16, height: 16 }} />
                  ) : (
                    <Eye style={{ width: 16, height: 16 }} />
                  )}
                </button>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                margin: "2px 0",
              }}
            >
              <div style={{ flex: 1, height: 1, background: BORDER }} />
              <div style={{ flex: 1, height: 1, background: BORDER }} />
            </div>

            <button
              className="login-btn-main"
              onClick={handleLogin}
              disabled={loading || !empId.trim() || !password}
            >
              {loading ? (
                <>
                  <div
                    style={{
                      width: 15,
                      height: 15,
                      border: "2.5px solid rgba(255,255,255,.3)",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                      animation: "loginSpin 0.7s linear infinite",
                    }}
                  />
                  Logging in…
                </>
              ) : (
                "Login"
              )}
            </button>
          </div>

          <div
            style={{
              marginTop: "auto",
              paddingTop: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <p style={{ fontSize: 11, color: "#9c9c9c", margin: 0 }}>
              © {new Date().getFullYear()} Indef Manufacturing Limited
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrgFilterBar({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <Filter className="w-3.5 h-3.5 text-slate-400" />
      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
        Org:
      </span>
      {ORGS.map((org) => (
        <button
          key={org}
          onClick={() => onChange(org)}
          className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${value === org ? ORG_PILL[org] + " shadow-sm" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}
        >
          {org}
        </button>
      ))}
    </div>
  );
}

const USER_PAGE_SIZE = 5;

function UserDashboard({
  currentUser,
  tickets,
  onSelectTicket,
  selectedId,
  onCreateTicket,
  onLogout,
}) {
  const [page, setPage] = useState(1);
  const myTickets = tickets.filter(
    (t) =>
      t.submittedBy === currentUser.name || t.onBehalfOf === currentUser.name,
  );
  const stats = {
    total: myTickets.length,
    open: myTickets.filter((t) => t.status === "Open").length,
    inProgress: myTickets.filter((t) =>
      [
        "In Progress",
        "Requirement",
        "Discussion",
        "IT Testing",
        "Ready for Demo",
        "User Testing",
        "Queue",
        "Assigned",
      ].includes(t.status),
    ).length,
    waiting: myTickets.filter((t) => t.status === "Waiting for User Input")
      .length,
    closed: myTickets.filter((t) => t.status === "Closed").length,
  };
  const totalPages = Math.max(1, Math.ceil(myTickets.length / USER_PAGE_SIZE));
  const paginated = myTickets.slice(
    (page - 1) * USER_PAGE_SIZE,
    page * USER_PAGE_SIZE,
  );
  useEffect(() => {
    setPage(1);
  }, [myTickets.length]);

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <header className="flex-none border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-5xl px-5 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center flex-none">
              <Wrench className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-slate-900 leading-tight">
                Helpdesk · My Tickets
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Enlife System ·{" "}
                <span
                  className={`font-bold px-1.5 py-0.5 rounded-full text-[10px] ${ORG_PILL[currentUser.org]}`}
                >
                  {currentUser.org}
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl px-3 py-2 border border-emerald-200 bg-emerald-50">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black bg-emerald-500 text-white">
                {currentUser.avatar}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 leading-none">
                  {currentUser.name}
                </p>
                <p className="text-[10px] font-semibold text-emerald-600">
                  {currentUser.dept}
                </p>
              </div>
            </div>
            <button
              onClick={onCreateTicket}
              className="inline-flex h-9 items-center gap-2 rounded-xl px-4 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Ticket
            </button>
            <button
              onClick={onLogout}
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-300 px-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-6 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-5 gap-3 mb-6">
          {[
            { l: "Total", v: stats.total, t: "slate" },
            { l: "Open", v: stats.open, t: "slate" },
            { l: "In Progress", v: stats.inProgress, t: "blue" },
            { l: "Waiting", v: stats.waiting, t: "orange" },
            { l: "Closed", v: stats.closed, t: "slate" },
          ].map((s) => (
            <div
              key={s.l}
              className={`rounded-2xl border px-4 py-3 ${s.t === "blue" ? "bg-blue-50 border-blue-200 text-blue-700" : s.t === "orange" ? "bg-orange-50 border-orange-200 text-orange-700" : "bg-white border-slate-200 text-slate-700"}`}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                {s.l}
              </p>
              <p className="text-2xl font-extrabold leading-none mt-1">{s.v}</p>
            </div>
          ))}
        </div>
        {myTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <Inbox className="w-12 h-12 mb-4 opacity-30" />
            <p className="text-lg font-bold">No tickets yet</p>
            <p className="text-sm mt-1">Raise a new ticket to get started</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {paginated.map((t) => {
                const isHRTicket = t.ticketDept === "HR";
                const cat = !isHRTicket ? getCatMeta(t.category) : null;
                const sm = STATUS_META[t.status] || STATUS_META["Open"];
                const badge = etaBadge(t);
                return (
                  <button
                    key={t.id}
                    onClick={() => onSelectTicket(t.id)}
                    className={`w-full text-left rounded-2xl border bg-white p-4 shadow-sm transition-all hover:shadow-md ${selectedId === t.id ? "border-slate-800 ring-2 ring-slate-200" : "border-slate-200 hover:border-slate-300"}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          {isHRTicket ? (
                            <HRPill />
                          ) : (
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${cat.pill}`}
                            >
                              {cat.label}
                            </span>
                          )}
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${sm.chip}`}
                          >
                            {t.status}
                          </span>
                          <span
                            className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${ORG_PILL[t.org]}`}
                          >
                            {t.org}
                          </span>
                          {t.priority && (
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-md ml-auto ${PRIORITY_PILL[t.priority]}`}
                            >
                              {t.priority}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-bold text-slate-800 mb-1">
                          {t.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="w-3 h-3" />
                            {fmt(t.submittedDate)}
                          </span>
                          {t.itAssignees?.length > 0 && (
                            <span className="flex items-center gap-1">
                              <UserCheck className="w-3 h-3" />
                              {t.itAssignees.join(", ")}
                            </span>
                          )}
                          <span
                            className={`font-semibold px-2 py-0.5 rounded-full ${badge.cls}`}
                          >
                            {badge.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-500 font-medium">
                  Showing {(page - 1) * USER_PAGE_SIZE + 1}–
                  {Math.min(page * USER_PAGE_SIZE, myTickets.length)} of{" "}
                  {myTickets.length}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pg) => (
                      <button
                        key={pg}
                        onClick={() => setPage(pg)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${pg === page ? "bg-slate-900 text-white border border-slate-900" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                      >
                        {pg}
                      </button>
                    ),
                  )}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function TicketCard({ ticket, active, onClick, currentUser }) {
  const isHRTicket = ticket.ticketDept === "HR";
  const cat =
    !isHRTicket && ticket.category ? getCatMeta(ticket.category) : null;
  const badge = etaBadge(ticket);
  const groups = getStrikeGroups(ticket.strikes || []);
  const ag =
    groups.length > 0 &&
    !groups[groups.length - 1].every((s) => s.responseReceived)
      ? groups[groups.length - 1]
      : null;
  const isAssigned =
    currentUser && ticket.itAssignees?.includes(currentUser.name);
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-xl border bg-white p-2.5 text-left shadow-sm transition-all duration-150 ${active ? "border-slate-800 ring-2 ring-slate-200 shadow-md" : "border-slate-200 hover:border-slate-300 hover:shadow"}`}
    >
      <div className="flex items-center gap-1 mb-1.5 flex-wrap">
        {isHRTicket ? (
          <HRPill small />
        ) : cat ? (
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full border flex-none ${cat.pill}`}
          >
            <cat.Icon className="w-2.5 h-2.5" />
            {cat.label}
          </span>
        ) : null}
        <span
          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-none ${ORG_PILL[ticket.org]}`}
        >
          {ticket.org}
        </span>
        {ticket.ticketType && (
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-none ${ticket.ticketType === "Incident" ? "bg-red-100 text-red-700 border border-red-200" : "bg-sky-100 text-sky-700 border border-sky-200"}`}
          >
            {ticket.ticketType}
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
      <p className="text-[13px] font-semibold text-slate-800 truncate mb-1">
        {ticket.description}
      </p>
      <div className="flex items-center gap-1.5 text-[10px]">
        <User className="w-2.5 h-2.5 text-slate-400 flex-none" />
        <span className="text-slate-500 truncate flex-1 min-w-0">
          {ticket.submittedBy}
          {ticket.onBehalfOf ? ` (for ${ticket.onBehalfOf})` : ""}
        </span>
        <span
          className={`font-semibold px-1.5 py-0.5 rounded-full flex-none ${badge.cls}`}
        >
          {badge.label}
        </span>
      </div>
      {ticket.itAssignees?.length > 0 && (
        <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
          <UserCheck className="w-2.5 h-2.5" />
          <span className={isAssigned ? "text-blue-600 font-semibold" : ""}>
            {ticket.itAssignees.join(", ")}
          </span>
        </div>
      )}
      {ag && ag.length > 0 && ag.every((s) => !s.responseReceived) && (
        <div className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-orange-700 bg-orange-50 rounded-lg px-2 py-1 border border-orange-200">
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
      <div className="mt-1">
        <span
          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${(STATUS_META[ticket.status] || STATUS_META["Open"]).chip}`}
        >
          {ticket.status}
        </span>
      </div>
    </button>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [currentUserId, setCU] = useState(null);
  const [tickets, setTickets] = useState(
    () => loadTickets() || INITIAL_TICKETS,
  );
  const [selectedId, setSelectedId] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [orgFilter, setOrgFilter] = useState("IML");

  useEffect(() => {
    saveTickets(tickets);
  }, [tickets]);
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const fresh = JSON.parse(raw);
          setTickets((prev) =>
            JSON.stringify(prev) !== JSON.stringify(fresh) ? fresh : prev,
          );
        }
      } catch (e) {}
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const [createForm, setCreateForm] = useState({
    dept: "IT",
    category: "software",
    description: "",
    onBehalfOf: "",
    attachment: null,
    type: "Ticket",
    parentId: "",
    requestType: "Service Request",
    impact: "user",
    softwareProject: "",
  });
  const [createErrors, setCreateErrors] = useState({});
  const [enrollForm, setEnrollForm] = useState({
    itAssignees: [],
    itStartDate: todayISO(),
    etaDate: "",
    etaHours: "",
    itRemarks: "",
    priority: "Medium",
    ticketType: "Service Request",
  });
  const [enrollErrors, setEnrollErrors] = useState({});
  const [newMsg, setNewMsg] = useState("");
  const [holdModal, setHoldModal] = useState(false);
  const [holdNote, setHoldNote] = useState("");
  const [holdReasonType, setHoldReasonType] = useState("");
  const [holdError, setHoldError] = useState("");
  const [closeModal, setCloseModal] = useState(false);
  const [closeNote, setCloseNote] = useState("");
  const [closeError, setCloseError] = useState("");
  const [strikeForm, setStrikeForm] = useState({ mailId: "", note: "" });
  const [strikeErrors, setStrikeErrors] = useState({});
  const [responseForm, setResponseForm] = useState({});
  const [stageRemarksModal, setStageRemarksModal] = useState({
    open: false,
    targetStatus: "",
    remarks: "",
  });
  const [reassignModal, setReassignModal] = useState(false);
  const [reassignees, setReassignees] = useState([]);
  const [editTypeModal, setEditTypeModal] = useState(false);
  const [editPriorityModal, setEditPriorityModal] = useState(false);
  const [holdModalType, setHoldModalType] = useState("hold");

  const currentUser = getUser(currentUserId);
  const isIT = currentUser?.role === "IT";
  const isHR = currentUser?.role === "HR";
  const isDeptUser = !isIT && !isHR;
  const isAssignedToMe = (t) => t?.itAssignees?.includes(currentUser?.name);
  const sel = tickets.find((t) => t.id === selectedId) || null;
  const canActOnTicket =
    (isIT || isHR) &&
    sel &&
    (isAssignedToMe(sel) || (!sel.enrolledByIT && sel.status === "Open")) &&
    ((isIT && sel.ticketDept === "IT") || (isHR && sel.ticketDept === "HR"));

  useEffect(() => {
    setEnrollForm({
      itAssignees: [],
      itStartDate: todayISO(),
      etaDate: "",
      etaHours: "",
      itRemarks: "",
      priority: "Medium",
      ticketType: "Service Request",
    });
    setEnrollErrors({});
    setHoldModal(false);
    setHoldNote("");
    setHoldReasonType("");
    setHoldError("");
    setCloseModal(false);
    setCloseNote("");
    setCloseError("");
    setStrikeForm({ mailId: "", note: "" });
    setStrikeErrors({});
    setResponseForm({});
    setStageRemarksModal({ open: false, targetStatus: "", remarks: "" });
    setReassignModal(false);
    setReassignees([]);
    setEditTypeModal(false);
    setEditPriorityModal(false);
  }, [selectedId]);

  const patch = useCallback(
    (id, data) =>
      setTickets((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...data } : t)),
      ),
    [],
  );

  const visibleTickets = useMemo(() => {
    if (isIT)
      return tickets.filter(
        (t) => t.ticketDept === "IT" && t.org === orgFilter,
      );
    if (isHR)
      return tickets.filter(
        (t) => t.ticketDept === "HR" && t.org === orgFilter,
      );
    return tickets;
  }, [tickets, isIT, isHR, orgFilter]);

  const stats = useMemo(() => {
    const base =
      isIT || isHR
        ? tickets.filter(
            (t) => t.ticketDept === (isIT ? "IT" : "HR") && t.org === orgFilter,
          )
        : tickets;
    const overdue = base.filter(
      (t) =>
        t.etaDate &&
        t.status !== "Closed" &&
        daysBetween(todayISO(), t.etaDate) < 0,
    ).length;
    return {
      total: base.length,
      open: base.filter((t) => t.status === "Open").length,
      inProgress: base.filter((t) => t.status === "In Progress").length,
      onHold: base.filter((t) => t.status === "On Hold").length,
      waiting: base.filter((t) => t.status === "Waiting for User Input").length,
      closed: base.filter((t) => t.status === "Closed").length,
      overdue,
    };
  }, [tickets, isIT, isHR, orgFilter]);

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
    if (!enrollForm.priority) errs.priority = "Priority required.";
    if (!enrollForm.ticketType) errs.ticketType = "Ticket type required.";
    const isIncident = enrollForm.ticketType === "Incident";
    if (isIncident && !enrollForm.etaHours)
      errs.etaHours = "Expected hours required.";
    if (!isIncident && !enrollForm.etaDate) errs.etaDate = "ETA required.";
    if (
      !isIncident &&
      enrollForm.etaDate &&
      enrollForm.itStartDate &&
      enrollForm.etaDate < enrollForm.itStartDate
    )
      errs.etaDate = "ETA must be after start date.";
    setEnrollErrors(errs);
    if (Object.keys(errs).length) return;
    let ns =
      sel.ticketDept === "HR"
        ? "Queue"
        : getCatMeta(sel.category).flowType === "full"
          ? "Requirement"
          : "In Progress";
    patch(sel.id, {
      enrolledByIT: true,
      itAssignees: enrollForm.itAssignees,
      itStartDate: enrollForm.itStartDate,
      etaDate: enrollForm.etaDate || null,
      etaHours: enrollForm.etaHours || null,
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
          remarks: enrollForm.itRemarks.trim(),
        },
      ],
    });
    setSelectedId(null);
  };

  const moveStatus = (ns, remarks = "") => {
    patch(sel.id, {
      status: ns,
      statusHistory: [
        ...sel.statusHistory,
        { status: ns, date: todayISO(), note: `Moved to ${ns}`, remarks },
      ],
    });
    setSelectedId(null);
  };

  const submitHold = () => {
    if (!holdReasonType) {
      setHoldError("Please select a reason type.");
      return;
    }
    setHoldError("");
    patch(sel.id, {
      status: "On Hold",
      holdRemarks: holdNote.trim(),
      holdReasonType,
      statusHistory: [
        ...sel.statusHistory,
        {
          status: "On Hold",
          date: todayISO(),
          note: `Put on hold — ${HOLD_REASON_OPTIONS.find((o) => o.value === holdReasonType)?.label}${holdNote.trim() ? ": " + holdNote.trim() : ""}`,
          remarks: holdNote.trim(),
        },
      ],
    });
    setHoldModal(false);
    setHoldNote("");
    setHoldReasonType("");
    setSelectedId(null);
  };

  // ── Waiting for User Input: no dropdown required ──────────────────────────
  const submitWaitingForUserInput = () => {
    setHoldError("");
    patch(sel.id, {
      status: "Waiting for User Input",
      holdRemarks: holdNote.trim(),
      holdReasonType: "",
      statusHistory: [
        ...sel.statusHistory,
        {
          status: "Waiting for User Input",
          date: todayISO(),
          note: `Waiting for User Input${holdNote.trim() ? ": " + holdNote.trim() : ""}`,
          remarks: holdNote.trim(),
        },
      ],
    });
    setHoldModal(false);
    setHoldNote("");
    setHoldReasonType("");
    setSelectedId(null);
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
          remarks: closeNote.trim(),
        },
      ],
    });
    setCloseModal(false);
    setCloseNote("");
    setSelectedId(null);
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
          status: "Waiting for User Input",
          date: todayISO(),
          note: `Strike ${numInGroup} sent to ${strikeForm.mailId.trim()}.`,
          remarks: "",
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
          status: "Waiting for User Input",
          date: todayISO(),
          note: `Response received on Strike ${sn}.`,
          remarks: "",
        },
      ],
    });
  };

  const autoClose = () => {
    patch(sel.id, {
      status: "Closed",
      closingDate: todayISO(),
      autoClosedAfterStrikes: true,
      closingNote: "Auto-closed after 3 unanswered follow-ups.",
      statusHistory: [
        ...sel.statusHistory,
        {
          status: "Closed",
          date: todayISO(),
          note: "Auto-closed — 3 follow-ups with no response.",
          remarks: "",
        },
      ],
    });
    setSelectedId(null);
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

  const confirmStageMove = () => {
    if (!stageRemarksModal.targetStatus) return;
    moveStatus(stageRemarksModal.targetStatus, stageRemarksModal.remarks);
    setStageRemarksModal({ open: false, targetStatus: "", remarks: "" });
  };

  const submitReassign = () => {
    if (!reassignees.length) return;
    patch(sel.id, {
      itAssignees: reassignees,
      statusHistory: [
        ...sel.statusHistory,
        {
          status: sel.status,
          date: todayISO(),
          note: `Reassigned to ${reassignees.join(", ")}.`,
          remarks: "",
        },
      ],
    });
    setReassignModal(false);
  };
  const submitEditType = (nt) => {
    patch(sel.id, {
      ticketType: nt,
      statusHistory: [
        ...sel.statusHistory,
        {
          status: sel.status,
          date: todayISO(),
          note: `Type → ${nt}.`,
          remarks: "",
        },
      ],
    });
    setEditTypeModal(false);
  };
  const submitEditPriority = (np) => {
    patch(sel.id, {
      priority: np,
      statusHistory: [
        ...sel.statusHistory,
        {
          status: sel.status,
          date: todayISO(),
          note: `Priority → ${np}.`,
          remarks: "",
        },
      ],
    });
    setEditPriorityModal(false);
  };

  const openCreateModal = (defaultDept) => {
    setCreateForm({
      dept: defaultDept || (isIT ? "IT" : isHR ? "HR" : "IT"),
      category: "software",
      description: "",
      onBehalfOf: "",
      attachment: null,
      type: "Ticket",
      parentId: "",
      requestType: "Service Request",
      impact: defaultDept === "HR" ? "general_inquiry" : "user",
      softwareProject: "",
    });
    setCreateErrors({});
    setCreateOpen(true);
  };

  const createTicket = () => {
    const errs = {};
    if (!createForm.description.trim())
      errs.description = "Description required.";
    if (
      createForm.dept === "IT" &&
      createForm.type === "Linked Ticket" &&
      !createForm.parentId
    )
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
    let autoPriority = null;
    if (PERSONAL_IMPACT_VALUES.includes(createForm.impact)) {
      autoPriority = createForm.dept === "HR" ? "Normal" : "Normal";
    }
    const t = {
      id: nid,
      ticketDept: createForm.dept,
      description: createForm.description.trim(),
      category: createForm.dept === "HR" ? null : createForm.category,
      submittedBy: currentUser.name,
      submittedByEmpId: currentUser.empId,
      onBehalfOf: createForm.onBehalfOf,
      priority: autoPriority,
      ticketType: null,
      requestType: createForm.requestType,
      impact: createForm.impact,
      softwareProject:
        createForm.dept === "HR" ? null : createForm.softwareProject || null,
      status: "Open",
      submittedDate: todayISO(),
      itStartDate: null,
      etaDate: null,
      etaHours: null,
      closingDate: null,
      closingNote: "",
      holdRemarks: "",
      holdReasonType: "",
      attachment: fi,
      type: createForm.dept === "HR" ? "Ticket" : createForm.type,
      parentId:
        createForm.dept === "IT" && createForm.type === "Linked Ticket"
          ? Number(createForm.parentId)
          : null,
      linkedTaskIds: [],
      enrolledByIT: false,
      itAssignees: [],
      itRemarks: "",
      org: currentUser.org,
      statusHistory: [
        {
          status: "Open",
          date: todayISO(),
          note: `Submitted by ${currentUser.name} (#${currentUser.empId})${createForm.onBehalfOf ? " on behalf of " + createForm.onBehalfOf : ""}`,
          remarks: "",
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

  if (isDeptUser) {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');*,*::before,*::after{box-sizing:border-box;}body{font-family:'Plus Jakarta Sans',system-ui,sans-serif;margin:0;}.mono{font-family:'JetBrains Mono',monospace;}.thin-scroll::-webkit-scrollbar{width:4px;}.thin-scroll::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:99px;}.modal-overlay{position:fixed;inset:0;z-index:50;background:rgba(15,23,42,0.65);display:flex;align-items:center;justify-content:center;padding:1rem;}.modal-box{background:#fff;border-radius:1.25rem;border:1px solid #e2e8f0;box-shadow:0 25px 60px rgba(0,0,0,0.2);width:100%;max-width:940px;max-height:92vh;display:flex;flex-direction:column;overflow:hidden;}.mini-modal{background:#fff;border-radius:1rem;border:1px solid #e2e8f0;box-shadow:0 20px 50px rgba(0,0,0,0.25);width:100%;max-width:440px;}.cb-it{background:#1e293b;color:#f8fafc;border-radius:1rem 1rem 0.25rem 1rem;padding:.5rem .875rem;max-width:78%;font-size:.8125rem;line-height:1.5;}.cb-hr{background:#4338ca;color:#fff;border-radius:1rem 1rem 0.25rem 1rem;padding:.5rem .875rem;max-width:78%;font-size:.8125rem;line-height:1.5;}.cb-user{background:#f1f5f9;color:#1e293b;border-radius:1rem 1rem 1rem 0.25rem;padding:.5rem .875rem;max-width:78%;font-size:.8125rem;line-height:1.5;}.cb-self{background:#3b82f6;color:#fff;border-radius:1rem 1rem 0.25rem 1rem;padding:.5rem .875rem;max-width:78%;font-size:.8125rem;line-height:1.5;}`}</style>
        <UserDashboard
          currentUser={currentUser}
          tickets={tickets}
          onSelectTicket={setSelectedId}
          selectedId={selectedId}
          onCreateTicket={() => openCreateModal("IT")}
          onLogout={() => setCU(null)}
        />
        {sel && (
          <TicketModal
            ticket={sel}
            parent={sel.parentId ? getById(sel.parentId) : null}
            linkedTickets={tickets.filter((t) =>
              sel.linkedTaskIds?.includes(t.id),
            )}
            currentUser={currentUser}
            isIT={false}
            isHR={false}
            canAct={false}
            onClose={() => setSelectedId(null)}
            onOpenLinked={setSelectedId}
            enrollForm={enrollForm}
            setEnrollForm={setEnrollForm}
            enrollErrors={enrollErrors}
            onEnroll={enrollTicket}
            onMoveStatus={(ns) =>
              setStageRemarksModal({
                open: true,
                targetStatus: ns,
                remarks: "",
              })
            }
            onPutOnHold={() => {
              setHoldNote("");
              setHoldReasonType("");
              setHoldError("");
              setHoldModalType("hold");
              setHoldModal(true);
            }}
            onWaitingForUserInput={() => {
              setHoldNote("");
              setHoldReasonType("");
              setHoldError("");
              setHoldModalType("waiting");
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
            onReassign={() => {
              setReassignees(sel.itAssignees || []);
              setReassignModal(true);
            }}
            onEditType={() => setEditTypeModal(true)}
            onEditPriority={() => setEditPriorityModal(true)}
          />
        )}
        {createOpen && (
          <CreateModal
            form={createForm}
            errors={createErrors}
            closedTickets={closedTickets}
            currentUser={currentUser}
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

  // ── Build IT Kanban columns ───────────────────────────────────────────────
  const buildITColumns = () => {
    const openUnassigned = visibleTickets.filter(
      (t) => !t.enrolledByIT && t.status === "Open",
    );
    const queueAll = visibleTickets.filter(
      (t) =>
        t.enrolledByIT &&
        t.status !== "Closed" &&
        !TESTING_STATUSES.includes(t.status) &&
        t.status !== "On Hold" &&
        t.status !== "Waiting for User Input" &&
        !t.itAssignees?.includes(currentUser.name),
    );
    const assignedToMe = visibleTickets.filter(
      (t) =>
        t.enrolledByIT &&
        t.status !== "Closed" &&
        !TESTING_STATUSES.includes(t.status) &&
        t.status !== "On Hold" &&
        t.status !== "Waiting for User Input" &&
        t.itAssignees?.includes(currentUser.name) &&
        (t.status === "Discussion" || t.status === "Requirement"),
    );
    const inProgressMine = visibleTickets.filter(
      (t) =>
        t.enrolledByIT &&
        t.status !== "Closed" &&
        !TESTING_STATUSES.includes(t.status) &&
        t.status !== "On Hold" &&
        t.status !== "Waiting for User Input" &&
        t.itAssignees?.includes(currentUser.name) &&
        t.status !== "Discussion" &&
        t.status !== "Requirement",
    );
    const testingCol = visibleTickets.filter(
      (t) => t.enrolledByIT && TESTING_STATUSES.includes(t.status),
    );
    // ── Waiting for User Input: only software + erp categories ──
    const waitingCol = visibleTickets.filter(
      (t) =>
        t.status === "Waiting for User Input" &&
        FULL_FLOW_CATEGORIES.includes(t.category),
    );
    // ── On Hold: only software + erp categories ──
    const onHoldCol = visibleTickets.filter(
      (t) =>
        t.status === "On Hold" && FULL_FLOW_CATEGORIES.includes(t.category),
    );
    const closedCol = visibleTickets.filter((t) => t.status === "Closed");

    const cols = [
      {
        key: "open_unassigned",
        label: "Open",
        meta: STATUS_META["Open"],
        items: openUnassigned,
        subtitle: "Awaiting assignment",
        accent: "emerald",
      },
      {
        key: "queue",
        label: "Queue",
        meta: {
          dot: "bg-slate-400",
          txt: "text-slate-600",
          chip: "bg-slate-100 text-slate-600",
          Icon: List,
        },
        items: queueAll,
        subtitle: "All assigned tickets",
        accent: "slate",
      },
      {
        key: "assigned_me",
        label: "Assigned to Me",
        meta: STATUS_META["Discussion"],
        items: assignedToMe,
        subtitle: "Discussion / Requirement",
        accent: "purple",
      },
      {
        key: "in_progress_me",
        label: "In Progress",
        meta: STATUS_META["In Progress"],
        items: inProgressMine,
        subtitle: "My active work",
        accent: "blue",
      },
      {
        key: "testing",
        label: "Testing",
        meta: {
          dot: "bg-indigo-500",
          txt: "text-indigo-700",
          chip: "bg-indigo-100 text-indigo-700",
          Icon: FlaskConical,
        },
        items: testingCol,
        subtitle: "IT / User testing",
        accent: "indigo",
      },
      // ── Waiting column: only shown when tickets exist ──
      ...(waitingCol.length > 0
        ? [
            {
              key: "waiting",
              label: "Waiting",
              meta: STATUS_META["Waiting for User Input"],
              items: waitingCol,
              subtitle: "Awaiting user response",
              accent: "orange",
            },
          ]
        : []),
      // ── On Hold column: only shown when tickets exist ──
      ...(onHoldCol.length > 0
        ? [
            {
              key: "on_hold",
              label: "On Hold",
              meta: STATUS_META["On Hold"],
              items: onHoldCol,
              subtitle: "Blocked / paused",
              accent: "amber",
            },
          ]
        : []),
      {
        key: "closed",
        label: "Closed",
        meta: STATUS_META["Closed"],
        items: closedCol,
        subtitle: null,
        accent: "slate",
      },
    ];
    return cols;
  };

  // ── Build HR Kanban columns (no waiting/hold columns) ────────────────────
  const buildHRColumns = () => {
    const hrOpenUnassigned = visibleTickets.filter(
      (t) => !t.enrolledByIT && t.status === "Open",
    );
    const hrQueue = visibleTickets.filter(
      (t) => t.enrolledByIT && t.status === "Queue",
    );
    const hrAssigned = visibleTickets.filter(
      (t) => t.enrolledByIT && t.status === "Assigned",
    );
    const hrInProgress = visibleTickets.filter(
      (t) =>
        t.itAssignees?.includes(currentUser.name) && t.status === "In Progress",
    );
    const hrClosed = visibleTickets.filter((t) => t.status === "Closed");
    return [
      {
        key: "hr_open",
        label: "Open",
        meta: STATUS_META["Open"],
        items: hrOpenUnassigned,
        subtitle: "Awaiting HR",
        accent: "slate",
      },
      {
        key: "hr_queue",
        label: "Queue",
        meta: STATUS_META["Queue"],
        items: hrQueue,
        subtitle: "In HR queue",
        accent: "slate",
      },
      {
        key: "hr_assigned",
        label: "Assigned",
        meta: STATUS_META["Assigned"],
        items: hrAssigned,
        subtitle: "HR assigned",
        accent: "indigo",
      },
      {
        key: "hr_inprogress",
        label: "In Progress",
        meta: STATUS_META["In Progress"],
        items: hrInProgress,
        subtitle: "My active work",
        accent: "indigo",
      },
      {
        key: "hr_closed",
        label: "Closed",
        meta: STATUS_META["Closed"],
        items: hrClosed,
        subtitle: null,
        accent: "slate",
      },
    ];
  };

  const allKanbanCols = isHR ? buildHRColumns() : buildITColumns();
  const deptLabel = isHR ? "HR Department" : "IT Department";

  const ACCENT_COL = {
    emerald: {
      border: "border-emerald-200",
      bg: "bg-emerald-50/20",
      hdr: "border-emerald-100",
      sub: "text-emerald-600",
      inner: "bg-emerald-50/10",
    },
    blue: {
      border: "border-blue-200",
      bg: "bg-blue-50/30",
      hdr: "border-blue-100",
      sub: "text-blue-500",
      inner: "bg-blue-50/20",
    },
    indigo: {
      border: "border-indigo-200",
      bg: "bg-indigo-50/30",
      hdr: "border-indigo-100",
      sub: "text-indigo-500",
      inner: "bg-indigo-50/20",
    },
    purple: {
      border: "border-purple-200",
      bg: "bg-purple-50/30",
      hdr: "border-purple-100",
      sub: "text-purple-500",
      inner: "bg-purple-50/20",
    },
    orange: {
      border: "border-orange-200",
      bg: "bg-orange-50/30",
      hdr: "border-orange-100",
      sub: "text-orange-500",
      inner: "bg-orange-50/20",
    },
    amber: {
      border: "border-amber-200",
      bg: "bg-amber-50/30",
      hdr: "border-amber-100",
      sub: "text-amber-500",
      inner: "bg-amber-50/20",
    },
    slate: {
      border: "border-slate-200",
      bg: "bg-white",
      hdr: "border-slate-100",
      sub: "text-slate-400",
      inner: "bg-slate-50/50",
    },
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');*,*::before,*::after{box-sizing:border-box;}body{font-family:'Plus Jakarta Sans',system-ui,sans-serif;margin:0;}.mono{font-family:'JetBrains Mono',monospace;}.thin-scroll::-webkit-scrollbar{width:4px;}.thin-scroll::-webkit-scrollbar-track{background:transparent;}.thin-scroll::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:99px;}.modal-overlay{position:fixed;inset:0;z-index:50;background:rgba(15,23,42,0.65);display:flex;align-items:center;justify-content:center;padding:1rem;}.modal-box{background:#fff;border-radius:1.25rem;border:1px solid #e2e8f0;box-shadow:0 25px 60px rgba(0,0,0,0.2);width:100%;max-width:940px;max-height:92vh;display:flex;flex-direction:column;overflow:hidden;}.mini-modal{background:#fff;border-radius:1rem;border:1px solid #e2e8f0;box-shadow:0 20px 50px rgba(0,0,0,0.25);width:100%;max-width:440px;}.cb-it{background:#1e293b;color:#f8fafc;border-radius:1rem 1rem 0.25rem 1rem;padding:.5rem .875rem;max-width:78%;font-size:.8125rem;line-height:1.5;}.cb-hr{background:#4338ca;color:#fff;border-radius:1rem 1rem 0.25rem 1rem;padding:.5rem .875rem;max-width:78%;font-size:.8125rem;line-height:1.5;}.cb-user{background:#f1f5f9;color:#1e293b;border-radius:1rem 1rem 1rem 0.25rem;padding:.5rem .875rem;max-width:78%;font-size:.8125rem;line-height:1.5;}.cb-self{background:#3b82f6;color:#fff;border-radius:1rem 1rem 0.25rem 1rem;padding:.5rem .875rem;max-width:78%;font-size:.8125rem;line-height:1.5;}`}</style>

      <div className="h-screen overflow-hidden bg-slate-100 text-slate-900 flex flex-col">
        <header className="flex-none border-b border-slate-200 bg-white shadow-sm">
          <div className="mx-auto max-w-[1900px] px-5 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center flex-none">
                  {isHR ? (
                    <Briefcase className="w-4 h-4 text-white" />
                  ) : (
                    <Wrench className="w-4 h-4 text-white" />
                  )}
                </div>
                <div>
                  <h1 className="text-lg font-extrabold tracking-tight text-slate-900 leading-tight">
                    {isHR ? "HR" : "IT"} Helpdesk · Enlife System
                  </h1>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Category-driven ticket management
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 border ${isHR ? "border-indigo-200 bg-indigo-50" : "border-blue-200 bg-blue-50"}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${isHR ? "bg-indigo-500" : "bg-blue-500"} text-white`}
                  >
                    {currentUser.avatar}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 leading-none">
                      {currentUser.name}
                    </p>
                    {/* <p
                      className={`text-[10px] font-semibold ${isHR ? "text-indigo-600" : "text-blue-600"}`}
                    >
                      {deptLabel}
                    </p> */}
                  </div>
                  {/* <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${ORG_PILL[currentUser.org]}`}
                  >
                    {currentUser.org}
                  </span> */}
                </div>
                <button
                  onClick={() => openCreateModal(isHR ? "HR" : "IT")}
                  className={`inline-flex h-9 items-center gap-2 rounded-xl px-4 text-sm font-bold text-white ${isHR ? "bg-indigo-600 hover:bg-indigo-700" : "bg-slate-900 hover:bg-slate-800"} transition-colors`}
                >
                  <Plus className="h-4 w-4" />
                  New Ticket
                </button>
                <button
                  onClick={() => setCU(null)}
                  className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-300 px-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between flex-wrap gap-3">
              <OrgFilterBar value={orgFilter} onChange={setOrgFilter} />
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-1">
                  {orgFilter} ·
                </span>
                {[
                  { l: "Total", v: stats.total, t: "slate" },
                  { l: "Open", v: stats.open, t: "slate" },
                  { l: "Progress", v: stats.inProgress, t: "blue" },
                  // On Hold and Waiting stats only shown for IT
                  ...(isIT
                    ? [
                        { l: "On Hold", v: stats.onHold, t: "amber" },
                        { l: "Waiting", v: stats.waiting, t: "orange" },
                      ]
                    : []),
                  { l: "Closed", v: stats.closed, t: "slate" },
                  { l: "Overdue", v: stats.overdue, t: "red" },
                ].map((s) => (
                  <div
                    key={s.l}
                    className={`rounded-xl border px-3 py-2 ${s.t === "red" ? "bg-red-50 border-red-200 text-red-700" : s.t === "blue" ? "bg-blue-50 border-blue-200 text-blue-700" : s.t === "amber" ? "bg-amber-50 border-amber-200 text-amber-700" : s.t === "orange" ? "bg-orange-50 border-orange-200 text-orange-700" : "bg-slate-50 border-slate-200 text-slate-700"}`}
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
          </div>
        </header>

        <main className="flex-1 overflow-x-auto overflow-y-hidden p-4 min-h-0">
          <div
            className="flex gap-3 h-full"
            style={{ minWidth: `${allKanbanCols.length * 215}px` }}
          >
            {allKanbanCols.map((col) => {
              const Icon = col.meta.Icon;
              const ac = ACCENT_COL[col.accent] || ACCENT_COL.slate;
              return (
                <div
                  key={col.key}
                  className={`flex flex-col rounded-2xl border shadow-sm min-h-0 ${ac.border} ${ac.bg}`}
                  style={{ minWidth: "200px", flex: "1" }}
                >
                  <div
                    className={`flex flex-col border-b px-3 py-2.5 flex-none ${ac.hdr}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${col.meta.dot}`}
                        />
                        <Icon className={`w-3.5 h-3.5 ${col.meta.txt}`} />
                        <span className={`text-xs font-bold ${col.meta.txt}`}>
                          {col.label}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${col.meta.chip}`}
                      >
                        {col.items.length}
                      </span>
                    </div>
                    {col.subtitle && (
                      <p
                        className={`text-[10px] mt-0.5 ml-[18px] ${ac.sub} font-medium`}
                      >
                        {col.subtitle}
                      </p>
                    )}
                  </div>
                  <div
                    className={`flex-1 overflow-y-auto thin-scroll p-2 space-y-2 min-h-0 ${ac.inner}`}
                  >
                    {col.items.length === 0 ? (
                      <div className="flex items-center justify-center h-14 rounded-xl border border-dashed border-slate-200 bg-white text-[11px] text-slate-400">
                        No tickets
                      </div>
                    ) : (
                      col.items.map((t) => (
                        <TicketCard
                          key={t.id}
                          ticket={t}
                          active={t.id === selectedId}
                          onClick={() => setSelectedId(t.id)}
                          currentUser={currentUser}
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
          isHR={isHR}
          canAct={canActOnTicket}
          onClose={() => setSelectedId(null)}
          onOpenLinked={setSelectedId}
          enrollForm={enrollForm}
          setEnrollForm={setEnrollForm}
          enrollErrors={enrollErrors}
          onEnroll={enrollTicket}
          onMoveStatus={(ns) =>
            setStageRemarksModal({ open: true, targetStatus: ns, remarks: "" })
          }
          onPutOnHold={() => {
            setHoldNote("");
            setHoldReasonType("");
            setHoldError("");
            setHoldModalType("hold");
            setHoldModal(true);
          }}
          onWaitingForUserInput={() => {
            setHoldNote("");
            setHoldReasonType("");
            setHoldError("");
            setHoldModalType("waiting");
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
          onReassign={() => {
            setReassignees(sel.itAssignees || []);
            setReassignModal(true);
          }}
          onEditType={() => setEditTypeModal(true)}
          onEditPriority={() => setEditPriorityModal(true)}
        />
      )}

      {stageRemarksModal.open && (
        <div
          className="modal-overlay"
          onClick={(e) =>
            e.target === e.currentTarget &&
            setStageRemarksModal({ open: false, targetStatus: "", remarks: "" })
          }
        >
          <div className="mini-modal p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Move to: {stageRemarksModal.targetStatus}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Add remarks (optional).
                </p>
              </div>
              <button
                onClick={() =>
                  setStageRemarksModal({
                    open: false,
                    targetStatus: "",
                    remarks: "",
                  })
                }
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <Field label="Remarks (optional)">
              <textarea
                rows={3}
                value={stageRemarksModal.remarks}
                onChange={(e) =>
                  setStageRemarksModal((p) => ({
                    ...p,
                    remarks: e.target.value,
                  }))
                }
                placeholder="Notes..."
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 resize-none"
              />
            </Field>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() =>
                  setStageRemarksModal({
                    open: false,
                    targetStatus: "",
                    remarks: "",
                  })
                }
                className="flex-1 h-10 rounded-xl border border-slate-300 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmStageMove}
                className="flex-1 h-10 rounded-xl bg-slate-900 text-sm font-bold text-white hover:bg-slate-800 flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                Confirm
              </button>
            </div>
          </div>
        </div>
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
                  {holdModalType === "waiting"
                    ? "Set: Waiting for User Input"
                    : "Put On Hold"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {holdModalType === "waiting"
                    ? "Optionally add a note for context."
                    : "Document reason."}
                </p>
              </div>
              <button
                onClick={() => setHoldModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Reason dropdown only for On Hold, NOT for Waiting for User Input */}
            {holdModalType === "hold" && (
              <Field label="Reason Type" error={holdError}>
                <div className="relative">
                  <select
                    value={holdReasonType}
                    onChange={(e) => setHoldReasonType(e.target.value)}
                    className="h-10 w-full appearance-none rounded-xl border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:border-amber-400"
                  >
                    <option value="">Select reason...</option>
                    {HOLD_REASON_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />
                </div>
              </Field>
            )}

            <div className={holdModalType === "hold" ? "mt-3" : ""}>
              <Field label="Remarks (optional)">
                <textarea
                  rows={3}
                  value={holdNote}
                  onChange={(e) => setHoldNote(e.target.value)}
                  placeholder={
                    holdModalType === "waiting"
                      ? "What are you waiting on? (optional)"
                      : "Optional context..."
                  }
                  className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm focus:outline-none resize-none ${holdModalType === "waiting" ? "border-orange-300 focus:border-orange-400" : "border-slate-300 focus:border-amber-400"}`}
                />
              </Field>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setHoldModal(false)}
                className="flex-1 h-10 rounded-xl border border-slate-300 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={
                  holdModalType === "waiting"
                    ? submitWaitingForUserInput
                    : submitHold
                }
                className={`flex-1 h-10 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 ${holdModalType === "waiting" ? "bg-orange-500 hover:bg-orange-600" : "bg-amber-500 hover:bg-amber-600"}`}
              >
                {holdModalType === "waiting" ? (
                  <>
                    <Timer className="w-4 h-4" />
                    Set Waiting
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    Put On Hold
                  </>
                )}
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
                  Add closing remarks.
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
                placeholder="Outcome, what was done..."
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
                className="flex-1 h-10 rounded-xl bg-slate-800 text-sm font-bold text-white hover:bg-slate-900 flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Confirm Close
              </button>
            </div>
          </div>
        </div>
      )}

      {reassignModal && (
        <div
          className="modal-overlay"
          onClick={(e) =>
            e.target === e.currentTarget && setReassignModal(false)
          }
        >
          <div className="mini-modal p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Reassign
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select engineers.
                </p>
              </div>
              <button
                onClick={() => setReassignModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <AssigneeDropdown
              value={reassignees}
              onChange={setReassignees}
              dept={sel?.ticketDept || "IT"}
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setReassignModal(false)}
                className="flex-1 h-10 rounded-xl border border-slate-300 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={submitReassign}
                disabled={!reassignees.length}
                className="flex-1 h-10 rounded-xl bg-blue-600 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                Reassign
              </button>
            </div>
          </div>
        </div>
      )}

      {editTypeModal && sel && (
        <div
          className="modal-overlay"
          onClick={(e) =>
            e.target === e.currentTarget && setEditTypeModal(false)
          }
        >
          <div className="mini-modal p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-extrabold text-slate-900">
                Change Request Type
              </h2>
              <button
                onClick={() => setEditTypeModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {TICKET_TYPES.map((tt) => (
                <button
                  key={tt}
                  onClick={() => submitEditType(tt)}
                  className={`h-12 rounded-xl border text-sm font-bold transition-all ${sel.ticketType === tt ? "bg-slate-900 text-white border-slate-900" : tt === "Incident" ? "border-red-200 text-red-700 hover:bg-red-50" : "border-sky-200 text-sky-700 hover:bg-sky-50"}`}
                >
                  {tt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {editPriorityModal && sel && (
        <div
          className="modal-overlay"
          onClick={(e) =>
            e.target === e.currentTarget && setEditPriorityModal(false)
          }
        >
          <div className="mini-modal p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-extrabold text-slate-900">
                Change Priority
              </h2>
              <button
                onClick={() => setEditPriorityModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  onClick={() => submitEditPriority(p)}
                  className={`w-full h-10 rounded-xl border text-sm font-bold transition-all ${sel.priority === p ? PRIORITY_PILL[p] + " shadow-sm" : PRIORITY_PILL[p] + " opacity-60 hover:opacity-100"}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {createOpen && (
        <CreateModal
          form={createForm}
          errors={createErrors}
          closedTickets={closedTickets}
          currentUser={currentUser}
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

// ─── ASSIGNEE DROPDOWN ────────────────────────────────────────────────────────
function AssigneeDropdown({
  value,
  onChange,
  label = "Assign Engineers",
  error,
  dept = "IT",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const engineers = dept === "HR" ? HR_ENGINEERS : IT_ENGINEERS;
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const toggle = (name) =>
    onChange(
      value.includes(name) ? value.filter((n) => n !== name) : [...value, name],
    );
  return (
    <Field label={label} error={error}>
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen((p) => !p)}
          className="w-full h-10 flex items-center justify-between rounded-xl border border-slate-300 bg-white px-3 text-sm focus:outline-none hover:border-slate-400 transition-colors"
        >
          <span
            className={
              value.length === 0
                ? "text-slate-400"
                : "text-slate-800 font-semibold"
            }
          >
            {value.length === 0 ? "Select engineers..." : value.join(", ")}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
        {open && (
          <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden max-h-64 overflow-y-auto">
            {engineers.map((eng) => {
              const selected = value.includes(eng.name);
              return (
                <button
                  key={eng.id}
                  type="button"
                  onClick={() => toggle(eng.name)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors hover:bg-slate-50 ${selected ? "bg-blue-50" : ""}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black flex-none ${selected ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-500"}`}
                  >
                    {eng.avatar}
                  </div>
                  <span className="flex-1 min-w-0">
                    <span
                      className={`font-semibold ${selected ? "text-blue-700" : "text-slate-700"}`}
                    >
                      {eng.name}
                    </span>
                    <span className="ml-1 text-[10px] font-bold mono text-slate-400">
                      #{eng.empId}
                    </span>
                    <span
                      className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${ORG_PILL[eng.org]}`}
                    >
                      {eng.org}
                    </span>
                  </span>
                  {selected && (
                    <CheckCircle2 className="w-4 h-4 text-blue-500 flex-none" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </Field>
  );
}

function OnBehalfOfDropdown({ value, onChange, currentUserId }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const options = USERS.filter((u) => u.id !== currentUserId);
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const selected = options.find((u) => u.name === value);
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full h-10 flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-3 text-sm focus:outline-none hover:border-blue-300 transition-colors"
      >
        {selected ? (
          <span className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black bg-blue-500 text-white">
              {selected.avatar}
            </div>
            <span className="font-semibold text-blue-700">{selected.name}</span>
            <span className="mono text-[10px] text-blue-400">
              #{selected.empId}
            </span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${ORG_PILL[selected.org]}`}
            >
              {selected.org}
            </span>
          </span>
        ) : (
          <span className="text-slate-400 text-sm">
            None — raising for myself
          </span>
        )}
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden max-h-56 overflow-y-auto">
          <button
            type="button"
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm hover:bg-slate-50 border-b border-slate-100"
          >
            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black bg-slate-200 text-slate-500">
              <User className="w-3 h-3" />
            </div>
            <span className="text-slate-500 italic">
              None — raising for myself
            </span>
          </button>
          {options.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => {
                onChange(u.name);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors hover:bg-slate-50 ${value === u.name ? "bg-blue-50" : ""}`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black flex-none ${value === u.name ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-500"}`}
              >
                {u.avatar}
              </div>
              <span className="flex-1 min-w-0">
                <span
                  className={`font-semibold text-sm ${value === u.name ? "text-blue-700" : "text-slate-700"}`}
                >
                  {u.name}
                </span>
                <span className="ml-1 text-[10px] mono text-slate-400">
                  #{u.empId}
                </span>
                <span
                  className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${ORG_PILL[u.org]}`}
                >
                  {u.org}
                </span>
                <span className="ml-1 text-[10px] text-slate-400">
                  · {u.dept}
                </span>
              </span>
              {value === u.name && (
                <CheckCircle2 className="w-4 h-4 text-blue-500 flex-none" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── TICKET MODAL ─────────────────────────────────────────────────────────────
function TicketModal({
  ticket,
  parent,
  linkedTickets,
  currentUser,
  isIT,
  isHR,
  canAct,
  onClose,
  onOpenLinked,
  enrollForm,
  setEnrollForm,
  enrollErrors,
  onEnroll,
  onMoveStatus,
  onPutOnHold,
  onWaitingForUserInput,
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
  onReassign,
  onEditType,
  onEditPriority,
}) {
  const [tab, setTab] = useState("details");
  const isHRTicket = ticket.ticketDept === "HR";
  const cat =
    !isHRTicket && ticket.category ? getCatMeta(ticket.category) : null;
  const sm = STATUS_META[ticket.status] || STATUS_META["Open"];
  const badge = etaBadge(ticket);
  const isClosed = ticket.status === "Closed";
  const isOnHold = ticket.status === "On Hold";
  const isWaiting = ticket.status === "Waiting for User Input";
  const catFlow = isHRTicket ? HR_STATUSES : cat ? cat.statuses : [];
  const curIdx = catFlow.indexOf(ticket.status);
  const endRef = useRef(null);
  const impactLabel = getImpactLabel(ticket.impact, isHRTicket);
  const isReadOnly = (isIT || isHR) && !canAct && ticket.enrolledByIT;
  const isIncident =
    ticket.ticketType === "Incident" || ticket.requestType === "Incident";
  // On Hold and Waiting for User Input actions only for IT full-flow categories
  const isFullFlowIT =
    !isHRTicket && FULL_FLOW_CATEGORIES.includes(ticket.category);

  useEffect(() => {
    setTab("details");
  }, [ticket.id]);
  useEffect(() => {
    if (tab === "discussion")
      endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket.messages, tab]);

  const getById = (id) => allTickets.find((t) => t.id === id);
  const nextStatuses =
    canAct && !isClosed && !isOnHold && !isWaiting
      ? catFlow.filter(
          (s, i) =>
            i > curIdx && s !== "Closed" && s !== "Waiting for User Input",
        )
      : [];
  const allStrikes = ticket.strikes || [];
  const groups = getStrikeGroups(allStrikes);
  const activeGroup =
    groups.length > 0 &&
    !groups[groups.length - 1].every((s) => s.responseReceived)
      ? groups[groups.length - 1]
      : [];
  const canSendNext = isWaiting && activeGroup.length < 3;
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
        <div className="flex-none border-b border-slate-100 px-6 py-4">
          <div className="flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-1.5 mb-2">
                {isHRTicket ? (
                  <HRPill />
                ) : cat ? (
                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${cat.pill}`}
                  >
                    <cat.Icon className="w-3 h-3" />
                    {cat.label}
                  </span>
                ) : null}
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${sm.chip}`}
                >
                  {ticket.status}
                </span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${ORG_PILL[ticket.org]}`}
                >
                  {ticket.org}
                </span>
                {ticket.requestType && (
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${isIncident ? "bg-red-100 text-red-700 border-red-200" : "bg-sky-100 text-sky-700 border-sky-200"}`}
                  >
                    {ticket.requestType}
                  </span>
                )}
                {ticket.priority && (
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${PRIORITY_PILL[ticket.priority]}`}
                  >
                    {ticket.priority}
                  </span>
                )}
                {ticket.impact && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    {impactLabel}
                  </span>
                )}
                {ticket.softwareProject && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 border border-violet-200">
                    {ticket.softwareProject}
                  </span>
                )}
                {ticket.type === "Linked Ticket" && (
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-violet-100 text-violet-700 border border-violet-200">
                    Linked
                  </span>
                )}
                {isReadOnly && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                    <EyeOff className="w-2.5 h-2.5" />
                    View Only
                  </span>
                )}
                {canAct && ticket.enrolledByIT && !isClosed && !isHRTicket && (
                  <>
                    <button
                      onClick={onEditType}
                      className="text-[11px] font-bold px-2 py-0.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center gap-1"
                    >
                      <ArrowLeftRight className="w-2.5 h-2.5" />
                      Edit Type
                    </button>
                    <button
                      onClick={onEditPriority}
                      className="text-[11px] font-bold px-2 py-0.5 rounded-full border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 flex items-center gap-1"
                    >
                      <Tag className="w-2.5 h-2.5" />
                      Edit Priority
                    </button>
                  </>
                )}
                {canAct && ticket.enrolledByIT && !isClosed && isHRTicket && (
                  <button
                    onClick={onEditPriority}
                    className="text-[11px] font-bold px-2 py-0.5 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 flex items-center gap-1"
                  >
                    <Tag className="w-2.5 h-2.5" />
                    Edit Priority
                  </button>
                )}
              </div>
              <p className="text-base font-bold text-slate-900 leading-snug">
                {ticket.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 rounded-full px-2.5 py-1 text-xs font-medium">
                  <User className="w-3 h-3" />
                  {ticket.submittedBy}
                  {ticket.submittedByEmpId ? (
                    <span className="mono text-slate-400">
                      {/* #{ticket.submittedByEmpId} */}
                    </span>
                  ) : null}
                </span>
                {ticket.onBehalfOf && (
                  <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2.5 py-1 text-xs font-medium">
                    <Users className="w-3 h-3" />
                    On behalf of: {ticket.onBehalfOf}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 rounded-full px-2.5 py-1 text-xs font-medium">
                  <CalendarDays className="w-3 h-3" />
                  Submitted {fmt(ticket.submittedDate)}
                </span>
                {ticket.itAssignees?.length > 0 && (
                  <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2.5 py-1 text-xs font-medium">
                    <UserCheck className="w-3 h-3" />
                    {ticket.itAssignees.join(", ")}
                    {canAct && !isClosed && (
                      <button
                        onClick={onReassign}
                        className="ml-1 text-blue-500 hover:text-blue-700"
                      >
                        <RefreshCw className="w-3 h-3" />
                      </button>
                    )}
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

          {catFlow.length > 0 && (
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
            </div>
          )}

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

        <div className="flex-1 overflow-y-auto thin-scroll min-h-0">
          {tab === "details" && (
            <div className="p-6 space-y-4">
              {isReadOnly && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-start gap-3">
                  <EyeOff className="w-5 h-5 text-slate-400 flex-none mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-slate-700">
                      View only — not assigned to you
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Assigned to{" "}
                      <span className="font-semibold">
                        {ticket.itAssignees?.join(", ")}
                      </span>
                      .
                    </p>
                  </div>
                </div>
              )}

              <Section title="Ticket Information">
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <InfoBox
                    label="Submitted By"
                    value={`${ticket.submittedBy}${ticket.submittedByEmpId ? " #" + ticket.submittedByEmpId : ""}`}
                  />
                  <InfoBox
                    label="Department"
                    value={
                      ticket.ticketDept === "HR"
                        ? "HR Department"
                        : "IT Department"
                    }
                  />
                  <InfoBox
                    label="Submitted Date"
                    value={fmt(ticket.submittedDate)}
                  />
                  <InfoBox label="Organisation" value={ticket.org} />
                  <InfoBox
                    label="Request Type"
                    value={ticket.requestType || "—"}
                  />
                  <InfoBox label="Impact" value={impactLabel} />
                  {!isHRTicket && (
                    <InfoBox label="Category" value={cat?.label || "—"} />
                  )}
                  {ticket.softwareProject && (
                    <InfoBox
                      label="Project / Module"
                      value={ticket.softwareProject}
                    />
                  )}
                  {ticket.onBehalfOf && (
                    <InfoBox label="On Behalf Of" value={ticket.onBehalfOf} />
                  )}
                  {ticket.attachment && (
                    <InfoBox
                      label="Attachment"
                      value={`${ticket.attachment.name} (${ticket.attachment.size})`}
                    />
                  )}
                  <InfoBox
                    label="Ticket Type"
                    value={ticket.type || "Ticket"}
                  />
                  {ticket.parentId && (
                    <InfoBox
                      label="Parent Ticket"
                      value={`#${ticket.parentId}`}
                    />
                  )}
                </div>
              </Section>

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
                            Parent
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
                            Linked
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

              {(isIT || isHR) &&
                canAct &&
                !ticket.enrolledByIT &&
                ticket.status === "Open" && (
                  <Section
                    title="Enroll Ticket"
                    accent="amber"
                    subtitle={`Assign ${isHRTicket ? "HR" : "IT"} engineers, set priority and ETA.`}
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
                          label="Request Type"
                          error={enrollErrors.ticketType}
                        >
                          <div className="flex gap-2">
                            {TICKET_TYPES.map((tt) => (
                              <button
                                key={tt}
                                onClick={() =>
                                  setEnrollForm((f) => ({
                                    ...f,
                                    ticketType: tt,
                                  }))
                                }
                                className={`flex-1 h-8 rounded-lg border text-xs font-bold transition-all ${enrollForm.ticketType === tt ? "bg-slate-900 text-white border-slate-900" : "border-slate-300 text-slate-600 hover:bg-slate-50"}`}
                              >
                                {tt}
                              </button>
                            ))}
                          </div>
                        </Field>
                      </div>
                      <AssigneeDropdown
                        value={enrollForm.itAssignees}
                        onChange={(v) =>
                          setEnrollForm((f) => ({ ...f, itAssignees: v }))
                        }
                        error={enrollErrors.itAssignees}
                        dept={isHRTicket ? "HR" : "IT"}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Field
                          label="Start Date"
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
                        {enrollForm.ticketType === "Incident" ? (
                          <Field
                            label="Expected Hours"
                            error={enrollErrors.etaHours}
                          >
                            <input
                              type="number"
                              min="1"
                              value={enrollForm.etaHours}
                              onChange={(e) =>
                                setEnrollForm((p) => ({
                                  ...p,
                                  etaHours: e.target.value,
                                }))
                              }
                              placeholder="e.g. 4"
                              className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:border-red-400"
                            />
                          </Field>
                        ) : (
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
                        )}
                      </div>
                      <Field label="Remarks (optional)">
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
                        className={`w-full h-11 rounded-xl text-sm font-bold text-white transition-colors flex items-center justify-center gap-2 ${isHRTicket ? "bg-indigo-600 hover:bg-indigo-700" : "bg-slate-900 hover:bg-slate-800"}`}
                      >
                        <UserCheck className="w-4 h-4" />
                        Enroll & Begin Work
                      </button>
                    </div>
                  </Section>
                )}

              {ticket.enrolledByIT && (
                <Section title="Enrollment Details">
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <InfoBox label="Priority" value={ticket.priority || "—"} />
                    <InfoBox
                      label="Request Type"
                      value={ticket.requestType || "—"}
                    />
                    <InfoBox
                      label="Ticket Type (IT)"
                      value={ticket.ticketType || "—"}
                    />
                    <InfoBox
                      label="Start Date"
                      value={fmt(ticket.itStartDate)}
                    />
                    <InfoBox
                      label={isIncident ? "ETA (Hours)" : "ETA Date"}
                      value={
                        isIncident
                          ? ticket.etaHours
                            ? `${ticket.etaHours} hrs`
                            : "—"
                          : fmt(ticket.etaDate)
                      }
                    />
                    <InfoBox
                      label="Closing Date"
                      value={fmt(ticket.closingDate)}
                    />
                  </div>
                  <div className="mt-2 rounded-xl border border-slate-100 bg-white px-3 py-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Assignees
                    </p>
                    <p className="text-xs font-bold text-slate-700 mt-0.5">
                      {ticket.itAssignees?.join(", ") || "—"}
                    </p>
                  </div>
                  {ticket.itRemarks && (
                    <div className="mt-3 rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm text-slate-700 italic">
                      "{ticket.itRemarks}"
                    </div>
                  )}
                </Section>
              )}

              {(isOnHold || isWaiting) && (
                <div
                  className={`rounded-2xl border p-4 ${isWaiting ? "border-orange-200 bg-orange-50" : "border-amber-200 bg-amber-50"}`}
                >
                  <p
                    className={`text-xs font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5 ${isWaiting ? "text-orange-600" : "text-amber-600"}`}
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    {isWaiting ? "Waiting Reason" : "Hold Reason"}
                  </p>
                  {ticket.holdReasonType && (
                    <p className="text-sm font-bold text-slate-800 mb-1">
                      {
                        HOLD_REASON_OPTIONS.find(
                          (o) => o.value === ticket.holdReasonType,
                        )?.label
                      }
                    </p>
                  )}
                  {ticket.holdRemarks && (
                    <p className="text-sm text-slate-700">
                      {ticket.holdRemarks}
                    </p>
                  )}
                </div>
              )}

              {/* Three-strike follow-up: only for IT full-flow categories */}
              {canAct && isWaiting && isFullFlowIT && (
                <Section
                  title="Three-Strike Follow-up"
                  accent="amber"
                  subtitle="Up to 3 follow-ups per round."
                >
                  <div className="mt-4 space-y-3">
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
                    {[1, 2, 3].map((num) => {
                      const strike = activeGroup.find(
                        (s) => s.strikeNumber === num,
                      );
                      const isNext = !strike && activeGroup.length === num - 1;
                      const locked = !strike && !isNext;
                      return (
                        <div
                          key={num}
                          className={`rounded-xl border p-4 transition-all ${locked ? "bg-slate-50 border-slate-100 opacity-40" : strike?.responseReceived ? "bg-emerald-50 border-emerald-200" : strike ? "bg-orange-50 border-orange-200" : "bg-white border-slate-200"}`}
                        >
                          <div className="flex items-center gap-2.5 mb-3">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-none ${strike?.responseReceived ? "bg-emerald-500 text-white" : strike ? "bg-orange-500 text-white" : isNext ? "bg-slate-200 text-slate-600" : "bg-slate-200 text-slate-400"}`}
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
                                <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full border border-orange-200">
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
                                className="w-full h-9 rounded-lg bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-700 flex items-center justify-center gap-1.5"
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
                                    className="w-full h-9 rounded-lg border border-slate-300 bg-white pl-8 pr-3 text-xs focus:outline-none focus:border-orange-400"
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
                                  placeholder={`Strike ${num} follow-up...`}
                                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:outline-none focus:border-orange-400 resize-none"
                                />
                              </Field>
                              <button
                                onClick={onSendStrike}
                                className="w-full h-9 rounded-lg bg-orange-500 text-xs font-bold text-white hover:bg-orange-600 flex items-center justify-center gap-1.5"
                              >
                                <Bell className="w-3.5 h-3.5" />
                                Send Strike {num}
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {allActiveNoReply && (
                      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <BellOff className="w-5 h-5 text-red-600 flex-none mt-0.5" />
                          <div>
                            <p className="text-sm font-bold text-red-800">
                              All 3 follow-ups unanswered
                            </p>
                            <p className="text-xs text-red-600 mt-0.5">
                              You may now close this ticket.
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={onAutoClose}
                          className="w-full h-10 rounded-xl bg-red-600 text-sm font-bold text-white hover:bg-red-700 flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Close — No Response
                        </button>
                      </div>
                    )}
                    {lastGroupAllDone && activeGroup.length === 0 && (
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 font-medium flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-none" />
                        All answered. Start a new round if needed.
                      </div>
                    )}
                  </div>
                </Section>
              )}

              {canAct &&
                ticket.enrolledByIT &&
                !isClosed &&
                !isOnHold &&
                !isWaiting &&
                nextStatuses.length > 0 && (
                  <Section title="Advance Stage" subtitle="Move forward.">
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

              {canAct && ticket.enrolledByIT && !isClosed && (
                <Section
                  title={isOnHold || isWaiting ? "Actions" : "Quick Actions"}
                >
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {/* On Hold and Waiting buttons only for IT full-flow (software/erp) categories */}
                    {!isOnHold && !isWaiting && isFullFlowIT && (
                      <>
                        <button
                          onClick={onPutOnHold}
                          className="flex items-center gap-2 h-9 px-4 rounded-xl bg-amber-100 text-amber-800 border border-amber-200 text-sm font-semibold hover:bg-amber-200"
                        >
                          <AlertCircle className="w-4 h-4" />
                          Put On Hold
                        </button>
                        <button
                          onClick={onWaitingForUserInput}
                          className="flex items-center gap-2 h-9 px-4 rounded-xl bg-orange-100 text-orange-800 border border-orange-200 text-sm font-semibold hover:bg-orange-200"
                        >
                          <Timer className="w-4 h-4" />
                          Waiting for User Input
                        </button>
                      </>
                    )}
                    {(isOnHold || isWaiting) && (
                      <button
                        onClick={() => onMoveStatus("In Progress")}
                        className="flex items-center gap-2 h-9 px-4 rounded-xl bg-blue-100 text-blue-800 border border-blue-200 text-sm font-semibold hover:bg-blue-200"
                      >
                        <Clock3 className="w-4 h-4" />
                        Resume to In Progress
                      </button>
                    )}
                    <button
                      onClick={onCloseTicket}
                      className="flex items-center gap-2 h-9 px-4 rounded-xl bg-slate-800 text-white text-sm font-semibold hover:bg-slate-900"
                    >
                      <XCircle className="w-4 h-4" />
                      Close Ticket
                    </button>
                    {ticket.itAssignees?.length > 0 && !isClosed && (
                      <button
                        onClick={onReassign}
                        className="flex items-center gap-2 h-9 px-4 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-sm font-semibold hover:bg-blue-100"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Reassign
                      </button>
                    )}
                  </div>
                </Section>
              )}

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
                        Closed {fmt(ticket.closingDate)}
                      </p>
                      {ticket.closingNote && (
                        <div className="mt-2 rounded-xl bg-white/70 border border-current/10 px-3 py-2.5">
                          <p className="text-sm text-slate-700">
                            {ticket.closingNote}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === "discussion" && (
            <div className="flex flex-col" style={{ minHeight: "400px" }}>
              <div
                className="flex-1 overflow-y-auto thin-scroll p-5 space-y-3"
                style={{ minHeight: "300px" }}
              >
                {(!ticket.messages || ticket.messages.length === 0) && (
                  <div className="flex flex-col items-center justify-center h-32 text-slate-400">
                    <MessageSquareText className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-sm font-medium">No messages yet.</p>
                  </div>
                )}
                {ticket.messages?.map((msg) => {
                  const sender = getUser(msg.userId);
                  const isSelf = msg.userId === currentUser?.id;
                  const isITMsg = sender?.role === "IT";
                  const isHRMsg = sender?.role === "HR";
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-end gap-2 ${isSelf ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <div
                        className={`w-7 h-7 rounded-xl flex-none flex items-center justify-center text-[10px] font-black ${isITMsg ? "bg-blue-500 text-white" : isHRMsg ? "bg-indigo-500 text-white" : "bg-emerald-500 text-white"}`}
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
                            isSelf
                              ? "cb-self"
                              : isITMsg
                                ? "cb-it"
                                : isHRMsg
                                  ? "cb-hr"
                                  : "cb-user"
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
                      placeholder="Type a message… (Enter to send)"
                      className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:border-slate-400 resize-none"
                    />
                    <button
                      onClick={onSendMsg}
                      className="w-10 h-10 self-end rounded-xl bg-slate-900 flex items-center justify-center text-white hover:bg-slate-800 flex-none"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Sending as{" "}
                    <span className="font-bold">{currentUser?.name}</span> ·{" "}
                    <span className="mono">#{currentUser?.empId}</span>
                  </p>
                </div>
              ) : (
                <div className="flex-none border-t border-slate-100 p-4 text-center text-xs text-slate-400 font-medium">
                  Discussion closed — ticket is closed.
                </div>
              )}
            </div>
          )}

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
                      {e.remarks && (
                        <p className="text-xs text-slate-500 mt-0.5 italic">
                          Remarks: {e.remarks}
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

// ─── CREATE MODAL ─────────────────────────────────────────────────────────────
function CreateModal({
  form,
  errors,
  closedTickets,
  currentUser,
  onChange,
  onClose,
  onSubmit,
}) {
  const fileRef = useRef(null);
  const isHRTicket = form.dept === "HR";
  const fmt_bytes = (b) => {
    if (!b) return "";
    if (b < 1024) return b + "B";
    if (b < 1048576) return (b / 1024).toFixed(1) + "KB";
    return (b / 1048576).toFixed(1) + "MB";
  };
  const handleDeptChange = (dept) => {
    const defaultImpact = dept === "HR" ? "general_inquiry" : "user";
    onChange((p) => ({ ...p, dept, impact: defaultImpact, onBehalfOf: "" }));
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-box" style={{ maxWidth: "580px" }}>
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 flex-none">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              {isHRTicket ? (
                <>
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  Raise HR Ticket
                </>
              ) : (
                <>Raise IT Ticket</>
              )}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Submitting as{" "}
              <span className="font-bold text-slate-700">
                {currentUser.name}
              </span>{" "}
              ·{" "}
              <span className="mono text-slate-500">#{currentUser.empId}</span>{" "}
              ·{" "}
              <span
                className={`font-bold px-1.5 rounded-full text-[10px] ${ORG_PILL[currentUser.org]}`}
              >
                {currentUser.org}
              </span>
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
          <Field label="Ticket Department">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleDeptChange("IT")}
                className={`flex items-center justify-center gap-2 h-11 rounded-xl border text-sm font-bold transition-all ${form.dept === "IT" ? "bg-slate-900 text-white border-slate-900" : "border-slate-300 text-slate-600 hover:bg-slate-50"}`}
              >
                <Wrench className="w-4 h-4" />
                IT Ticket
              </button>
              <button
                onClick={() => handleDeptChange("HR")}
                className={`flex items-center justify-center gap-2 h-11 rounded-xl border text-sm font-bold transition-all ${form.dept === "HR" ? "bg-indigo-600 text-white border-indigo-600" : "border-indigo-200 text-indigo-700 hover:bg-indigo-50"}`}
              >
                <Briefcase className="w-4 h-4" />
                HR Ticket
              </button>
            </div>
          </Field>
          <Field label="Request Type">
            <div className="grid grid-cols-2 gap-2">
              {REQUEST_TYPES.map((rt) => (
                <button
                  key={rt}
                  onClick={() => onChange((p) => ({ ...p, requestType: rt }))}
                  className={`h-10 rounded-xl border text-sm font-bold transition-colors ${form.requestType === rt ? (rt === "Incident" ? "bg-red-600 text-white border-red-600" : "bg-sky-600 text-white border-sky-600") : rt === "Incident" ? "border-red-200 text-red-700 hover:bg-red-50" : "border-sky-200 text-sky-700 hover:bg-sky-50"}`}
                >
                  {rt}
                </button>
              ))}
            </div>
          </Field>
          {!isHRTicket && (
            <>
              <Field label="Category">
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(CATEGORY_META).map(([id, meta]) => {
                    const Icon = meta.Icon;
                    return (
                      <button
                        key={id}
                        onClick={() =>
                          onChange((p) => ({
                            ...p,
                            category: id,
                            softwareProject: "",
                          }))
                        }
                        className={`flex items-center gap-2 h-10 px-3 rounded-xl border text-xs font-bold transition-all ${form.category === id ? `${meta.pill} shadow-sm` : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {meta.label}
                      </button>
                    );
                  })}
                </div>
              </Field>
              {(form.category === "software" || form.category === "erp") && (
                <Field label="Project / Module">
                  <div className="relative">
                    <select
                      value={form.softwareProject}
                      onChange={(e) =>
                        onChange((p) => ({
                          ...p,
                          softwareProject: e.target.value,
                        }))
                      }
                      className="h-10 w-full appearance-none rounded-xl border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:border-violet-400"
                    >
                      <option value="">Select project...</option>
                      {SOFTWARE_PROJECTS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />
                  </div>
                </Field>
              )}
            </>
          )}
          <Field label={isHRTicket ? "Type" : "Impact"}>
            {isHRTicket ? (
              <div className="grid grid-cols-2 gap-2">
                {HR_IMPACT_OPTIONS.map((imp) => {
                  const ImpIcon = imp.Icon;
                  const selected = form.impact === imp.value;
                  return (
                    <button
                      key={imp.value}
                      onClick={() =>
                        onChange((p) => ({ ...p, impact: imp.value }))
                      }
                      className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all ${selected ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" : "border-slate-200 text-slate-600 hover:bg-indigo-50 hover:border-indigo-200"}`}
                    >
                      <ImpIcon
                        className={`w-4 h-4 flex-none mt-0.5 ${selected ? "text-white" : "text-indigo-500"}`}
                      />
                      <div>
                        <p
                          className={`text-xs font-bold leading-tight ${selected ? "text-white" : "text-slate-800"}`}
                        >
                          {imp.label}
                        </p>
                        <p
                          className={`text-[10px] mt-0.5 leading-tight ${selected ? "text-indigo-200" : "text-slate-400"}`}
                        >
                          {imp.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {IT_IMPACT_OPTIONS.map((imp) => {
                  const ImpIcon = imp.Icon;
                  return (
                    <button
                      key={imp.value}
                      onClick={() =>
                        onChange((p) => ({ ...p, impact: imp.value }))
                      }
                      className={`flex items-center gap-2 h-10 px-3 rounded-xl border text-xs font-bold transition-all text-left ${form.impact === imp.value ? "bg-slate-900 text-white border-slate-900" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                    >
                      <ImpIcon className="w-3.5 h-3.5 flex-none" />
                      {imp.label}
                    </button>
                  );
                })}
              </div>
            )}
          </Field>
          {!isHRTicket && form.type === "Linked Ticket" && (
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
                  {closedTickets
                    .filter((t) => t.ticketDept === "IT")
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        #{t.id} — {t.description}
                      </option>
                    ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />
              </div>
            </Field>
          )}
          {!isHRTicket && (
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
              placeholder={
                isHRTicket
                  ? "Describe the HR request, employee name, and relevant details."
                  : "Clearly describe the request, affected system, scope, and urgency."
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-slate-400 resize-none"
            />
          </Field>
          {currentUser.role !== "User" && (
            <Field label="On Behalf Of (optional)">
              <OnBehalfOfDropdown
                value={form.onBehalfOf}
                onChange={(v) => onChange((p) => ({ ...p, onBehalfOf: v }))}
                currentUserId={currentUser.id}
              />
            </Field>
          )}
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
            Submitted as{" "}
            <span className="font-semibold text-slate-600">
              {currentUser.name}
            </span>{" "}
            · {currentUser.org}
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
              className={`h-10 px-5 rounded-xl text-sm font-bold text-white flex items-center gap-2 ${isHRTicket ? "bg-indigo-600 hover:bg-indigo-700" : "bg-slate-900 hover:bg-slate-800"}`}
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

// ─── SHARED UI ────────────────────────────────────────────────────────────────
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
