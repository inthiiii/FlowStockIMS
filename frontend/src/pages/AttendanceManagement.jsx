import React, { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
// Charts temporarily disabled to avoid invalid hook errors in some environments
import api, { toPublicUrl } from "../api";

const MONTH_FMT = (d) => new Date(d).toISOString().slice(0, 7);
const SHIFT_IN = "09:00";
const SHIFT_OUT = "17:00";
const GRACE_MIN = 10;

const CHART_COLORS = ["#023E8A", "#0353b8", "#0077B6", "#10b981", "#f59e0b", "#ef4444"];

function timeStrToMinutes(t) {
  if (!t) return null;
  const s = String(t).trim();
  const m12 = s.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (m12) {
    let h = parseInt(m12[1], 10);
    const m = parseInt(m12[2], 10);
    const ap = m12[3].toUpperCase();
    if (ap === "PM" && h !== 12) h += 12;
    if (ap === "AM" && h === 12) h = 0;
    return h * 60 + m;
  }
  const m24 = s.match(/^(\d{1,2}):(\d{2})$/);
  if (m24) {
    const h = parseInt(m24[1], 10);
    const m = parseInt(m24[2], 10);
    return h * 60 + m;
  }
  return null;
}

function minutesToHHMM(mins) {
  if (mins == null || Number.isNaN(mins)) return "-";
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function validateRecord(r) {
  const errors = {};
  const needTimes = ["Present", "Half-day", "Work From Home", "Late"].includes(r.status);
  const forbidTimes = ["Absent", "Leave"].includes(r.status);

  if (!r.user) errors.user = "Employee is required";
  if (!r.date) errors.date = "Date is required";
  if (!r.status) errors.status = "Status is required";

  if (needTimes) {
    const inMin = timeStrToMinutes(r.checkIn);
    const outMin = timeStrToMinutes(r.checkOut);

    if (!r.checkIn) errors.checkIn = "Check-in is required";
    else if (inMin == null) errors.checkIn = "Invalid time";

    if (!r.checkOut) errors.checkOut = "Check-out is required";
    else if (outMin == null) errors.checkOut = "Invalid time";

    if (inMin != null && outMin != null && outMin < inMin) {
      errors.checkOut = "Check-out cannot be earlier than check-in";
    }
  }

  if (forbidTimes) {
    if (r.checkIn) errors.checkIn = "Must be empty for Absent/Leave";
    if (r.checkOut) errors.checkOut = "Must be empty for Absent/Leave";
  }

  return errors;
}

const Backdrop = ({ onClose }) => (
  <div 
    style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 40,
      backdropFilter: "blur(4px)"
    }}
    onClick={onClose}
  />
);

function Modal({ title, children, onClose }) {
  return (
    <>
      <Backdrop onClose={onClose} />
      <div style={{
        position: "fixed",
        zIndex: 50,
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }}>
        <div style={{
          width: "100%",
          maxWidth: "800px",
          borderRadius: "20px",
          backgroundColor: "#ffffff",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          animation: "modalSlideIn 0.3s ease-out"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "25px 30px",
            borderBottom: "2px solid #e2e8f0"
          }}>
            <h3 style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: "#023E8A",
              margin: 0
            }}>{title}</h3>
            <button
              onClick={onClose}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "transparent",
                color: "#64748b",
                cursor: "pointer",
                fontSize: "1.5rem",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#f1f5f9";
                e.target.style.color = "#1e293b";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = "#64748b";
              }}
            >
              ×
            </button>
          </div>
          <div style={{ padding: "30px" }}>{children}</div>
        </div>
      </div>
    </>
  );
}

export default function AttendancePage() {
  const [month, setMonth] = useState(MONTH_FMT(new Date()));
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [rows, setRows] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editing, setEditing] = useState(null);
  const [errors, setErrors] = useState({});
  const [sort, setSort] = useState({ key: "date", dir: "desc" });

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await api.get("/internal-users");
      setUsers(res.data || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }

  async function fetchAll() {
    setLoading(true);
    try {
      const [listRes, sumRes] = await Promise.all([
        api.get("/attendance", { params: { month } }),
        api.get("/attendance/summary", { params: { month } }),
      ]);
      setRows(Array.isArray(listRes.data) ? listRes.data : []);
      setSummary(Array.isArray(sumRes.data?.summary) ? sumRes.data.summary : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
  }, [month]);

  const safeRows = Array.isArray(rows) ? rows : [];

  const totals = useMemo(() => {
    const byStatus = Object.fromEntries(
      (summary || []).map((s) => [s._id || "Unknown", s.count])
    );
    const total = safeRows.length;
    const uniqueEmployees = new Set(
      safeRows.map((r) => r.user?._id || r.user)
    ).size;

    const shiftInMin = timeStrToMinutes(SHIFT_IN) ?? 9 * 60;
    const shiftOutMin = timeStrToMinutes(SHIFT_OUT) ?? 17 * 60;

    let minutes = 0, counted = 0;
    let earlyIn = 0, lateIn = 0, onTime = 0, noIn = 0, noOut = 0;

    safeRows.forEach((r) => {
      const a = timeStrToMinutes(r.checkIn);
      const b = timeStrToMinutes(r.checkOut);

      if (a == null) noIn += 1;
      else {
        if (a < shiftInMin) earlyIn += 1;
        else if (a <= shiftInMin + GRACE_MIN) onTime += 1;
        else lateIn += 1;
      }
      if (b == null) noOut += 1;

      if (a != null && b != null && b >= a) {
        minutes += b - a;
        counted += 1;
      }
    });

    return {
      totalRecords: total,
      uniqueEmployees,
      present: byStatus["Present"] || 0,
      absent: byStatus["Absent"] || 0,
      leave: byStatus["Leave"] || 0,
      halfday: byStatus["Half-day"] || 0,
      wfh: byStatus["Work From Home"] || 0,
      avgHours: minutesToHHMM(counted ? minutes / counted : null),
      earlyIn,
      lateIn,
      onTime,
      noIn,
      noOut,
    };
  }, [summary, safeRows]);

  const pieData = useMemo(
    () =>
      [
        { name: "Present", value: totals.present },
        { name: "Absent", value: totals.absent },
        { name: "Leave", value: totals.leave },
        { name: "Half-day", value: totals.halfday },
        { name: "WFH", value: totals.wfh },
      ].filter((d) => d.value > 0),
    [totals]
  );

  const lineData = useMemo(() => {
    const map = new Map();
    safeRows.forEach((r) => {
      const d = new Date(r.date).toISOString().slice(0, 10);
      const a = timeStrToMinutes(r.checkIn);
      const b = timeStrToMinutes(r.checkOut);
      const dur = a != null && b != null && b >= a ? b - a : null;
      if (!map.has(d)) map.set(d, { d, sum: 0, n: 0 });
      if (dur != null) {
        const o = map.get(d);
        o.sum += dur;
        o.n += 1;
      }
    });
    return Array.from(map.values())
      .sort((x, y) => x.d.localeCompare(y.d))
      .map((o) => ({
        date: o.d.slice(-2),
        hours: o.n ? +(o.sum / o.n / 60).toFixed(2) : 0,
      }));
  }, [safeRows]);

  const barData = useMemo(
    () => (summary || []).map((s) => ({ status: s._id || "?", count: s.count })),
    [summary]
  );

  const blank = {
    user: "",
    date: "",
    status: "Present",
    checkIn: "",
    checkOut: "",
    notes: "",
  };

  function openNew() {
    setEditing({ 
      ...blank,
      user: users.length > 0 ? users[0]._id : ""
    });
    setErrors({});
    setShowEditor(true);
  }

  function openEdit(r) {
    setEditing({
      ...r,
      date: new Date(r.date).toISOString().slice(0, 10),
      user: r.user?._id || r.user,
    });
    setErrors({});
    setShowEditor(true);
  }

  async function doSave() {
    const errs = validateRecord(editing);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const forbidTimes = ["Absent", "Leave"].includes(editing.status);
    const payload = {
      ...editing,
      checkIn: forbidTimes ? "" : editing.checkIn,
      checkOut: forbidTimes ? "" : editing.checkOut,
    };

    try {
      if (editing._id) {
        await api.put(`/attendance/${editing._id}`, payload);
      } else {
        await api.post("/attendance", payload);
      }
      setShowEditor(false);
      await fetchAll();
    } catch (e) {
      alert(e?.response?.data?.error || e.message);
    }
  }

  async function doDelete(id) {
    if (!confirm("Delete this record?")) return;
    try {
      await api.delete(`/attendance/${id}`);
      await fetchAll();
    } catch (e) {
      alert("Failed to delete");
    }
  }

  const toggleSort = (key) => {
    setSort((prev) => ({
      key,
      dir: prev.key === key && prev.dir === "asc" ? "desc" : "asc",
    }));
  };

  const compare = (a, b, key) => {
    const av =
      key === "employee"
        ? a.user?.name || a.user || ""
        : key === "date"
        ? new Date(a.date).getTime()
        : key === "status"
        ? a.status || ""
        : key === "checkIn"
        ? timeStrToMinutes(a.checkIn) ?? -1
        : key === "checkOut"
        ? timeStrToMinutes(a.checkOut) ?? -1
        : "";
    const bv =
      key === "employee"
        ? b.user?.name || b.user || ""
        : key === "date"
        ? new Date(b.date).getTime()
        : key === "status"
        ? b.status || ""
        : key === "checkIn"
        ? timeStrToMinutes(b.checkIn) ?? -1
        : key === "checkOut"
        ? timeStrToMinutes(b.checkOut) ?? -1
        : "";
    if (av < bv) return -1;
    if (av > bv) return 1;
    return 0;
  };

  const filteredRows = useMemo(() => {
    const s = search.trim().toLowerCase();
    let list = safeRows.filter((r) => {
      const name = (r.user?.name || r.user || "").toLowerCase();
      const statusOk = statusFilter === "All" || r.status === statusFilter;
      const dateISO = new Date(r.date).toISOString().slice(0, 10);
      const afterFrom = !dateFrom || dateISO >= dateFrom;
      const beforeTo = !dateTo || dateISO <= dateTo;
      return (!s || name.includes(s)) && statusOk && afterFrom && beforeTo;
    });
    list = list.sort((a, b) => (sort.dir === "asc" ? 1 : -1) * compare(a, b, sort.key));
    return list;
  }, [safeRows, search, statusFilter, dateFrom, dateTo, sort]);

  function exportPdf() {
    try {
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      doc.setFontSize(18);
      doc.setTextColor(2, 62, 138);
      doc.text(`Attendance Report — ${month}`, 40, 40);
      doc.save(`attendance_${month}.pdf`);
    } catch (error) {
      alert("PDF generation failed");
    }
  }

  const styles = {
    container: {
      maxWidth: "1600px",
      margin: "0 auto",
      padding: "50px 30px",
      background: "linear-gradient(135deg, #f0f4f8 0%, #e8eef5 50%, #f5f7fa 100%)",
      minHeight: "100vh",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      position: "relative",
    },
    backgroundPattern: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.03,
      backgroundImage: "radial-gradient(circle at 20% 50%, rgba(2, 62, 138, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(2, 62, 138, 0.3) 0%, transparent 50%)",
      pointerEvents: "none",
      zIndex: 0,
    },
    content: {
      position: "relative",
      zIndex: 1,
    },
    header: { 
      textAlign: "center", 
      marginBottom: "50px",
      animation: "fadeInDown 0.6s ease-out"
    },
    title: { 
      color: "#023E8A", 
      fontSize: "3.5rem", 
      fontWeight: "800", 
      margin: "0", 
      marginBottom: "12px",
      letterSpacing: "-2px",
      textShadow: "0 2px 10px rgba(2, 62, 138, 0.1)",
      background: "linear-gradient(135deg, #023E8A 0%, #0353b8 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
    subtitle: { 
      color: "#64748b", 
      fontSize: "1.2rem", 
      margin: "0", 
      fontWeight: "400",
      letterSpacing: "0.5px"
    },
    topBar: {
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      padding: "25px 35px",
      borderRadius: "20px",
      marginBottom: "35px",
      border: "1px solid rgba(226, 232, 240, 0.8)",
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.06)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "20px",
      animation: "fadeInUp 0.7s ease-out"
    },
    buttonGroup: {
      display: "flex",
      gap: "15px",
      flexWrap: "wrap"
    },
    button: {
      padding: "14px 28px",
      borderRadius: "12px",
      border: "none",
      fontWeight: "600",
      fontSize: "1rem",
      cursor: "pointer",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
    },
    primaryButton: {
      background: "linear-gradient(135deg, #023E8A 0%, #0353b8 100%)",
      color: "#ffffff",
    },
    successButton: {
      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      color: "#ffffff",
    },
    filtersContainer: {
      backgroundColor: "#ffffff",
      padding: "35px",
      borderRadius: "20px",
      marginBottom: "35px",
      border: "1px solid rgba(226, 232, 240, 0.8)",
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.06)",
      animation: "fadeInUp 0.8s ease-out"
    },
    filtersRow: { 
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "25px",
      alignItems: "flex-end"
    },
    filterGroup: { 
      display: "flex", 
      flexDirection: "column", 
      gap: "8px"
    },
    filterLabel: { 
      fontSize: "0.875rem", 
      fontWeight: "600", 
      color: "#1e293b", 
      letterSpacing: "0.3px",
      textTransform: "uppercase"
    },
    input: { 
      padding: "14px 18px", 
      border: "2px solid #e2e8f0", 
      borderRadius: "12px", 
      fontSize: "1rem", 
      fontFamily: "inherit", 
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", 
      backgroundColor: "#ffffff", 
      outline: "none",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)"
    },
    select: { 
      padding: "14px 40px 14px 18px", 
      border: "2px solid #e2e8f0", 
      borderRadius: "12px", 
      fontSize: "1rem", 
      fontFamily: "inherit", 
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", 
      backgroundColor: "#ffffff", 
      outline: "none", 
      cursor: "pointer",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
      appearance: "none",
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23023E8A' d='M6 9L1 4h10z'/%3E%3C/svg%3E\")",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 16px center"
    },
    statsContainer: { 
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "20px",
      marginBottom: "35px"
    },
    statCard: {
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      padding: "30px",
      borderRadius: "20px",
      border: "1px solid #e2e8f0",
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.06)",
      transition: "all 0.3s ease",
      animation: "scaleIn 0.5s ease-out",
      position: "relative",
      overflow: "hidden"
    },
    statIcon: {
      fontSize: "2.5rem",
      marginBottom: "15px",
      display: "block",
      animation: "float 3s ease-in-out infinite"
    },
    statLabel: {
      fontSize: "0.875rem",
      color: "#64748b",
      fontWeight: "600",
      marginBottom: "10px",
      textTransform: "uppercase",
      letterSpacing: "0.5px"
    },
    statValue: {
      fontSize: "2.5rem",
      color: "#023E8A",
      fontWeight: "800",
      lineHeight: "1.2"
    },
    chartsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
      gap: "25px",
      marginBottom: "35px"
    },
    chartCard: {
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      padding: "30px",
      borderRadius: "20px",
      border: "1px solid #e2e8f0",
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.06)",
      animation: "fadeInUp 1s ease-out"
    },
    chartTitle: {
      fontSize: "1.2rem",
      fontWeight: "700",
      color: "#023E8A",
      marginBottom: "25px",
      letterSpacing: "-0.5px"
    },
    tableContainer: { 
      backgroundColor: "#ffffff", 
      borderRadius: "20px", 
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)", 
      overflow: "hidden", 
      border: "1px solid #e2e8f0",
      animation: "fadeInUp 1.2s ease-out"
    },
    table: { 
      width: "100%", 
      borderCollapse: "collapse", 
      fontSize: "0.95rem" 
    },
    th: { 
      padding: "20px 18px", 
      textAlign: "left", 
      fontWeight: "700", 
      letterSpacing: "1px", 
      fontSize: "0.85rem", 
      background: "linear-gradient(135deg, #023E8A 0%, #0353b8 100%)", 
      color: "#ffffff",
      textTransform: "uppercase",
      cursor: "pointer",
      userSelect: "none"
    },
    td: { 
      padding: "20px 18px", 
      verticalAlign: "middle", 
      color: "#334155",
      borderBottom: "1px solid #f1f5f9",
      transition: "background-color 0.2s ease"
    },
    statusBadge: {
      padding: "6px 14px",
      borderRadius: "20px",
      fontSize: "0.8rem",
      fontWeight: "600",
      letterSpacing: "0.5px",
      display: "inline-block",
      textTransform: "uppercase",
      border: "2px solid"
    },
    actionButtons: {
      display: "flex",
      gap: "10px",
      justifyContent: "flex-end"
    },
    actionButton: {
      padding: "8px 16px",
      borderRadius: "8px",
      border: "2px solid",
      fontWeight: "600",
      fontSize: "0.875rem",
      cursor: "pointer",
      transition: "all 0.3s ease",
      backgroundColor: "transparent"
    },
    noResults: { 
      textAlign: "center", 
      padding: "80px 20px", 
      color: "#64748b"
    },
    loadingContainer: {
      textAlign: "center",
      padding: "80px 20px"
    },
    modalForm: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "25px"
    },
    modalFormGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px"
    },
    modalLabel: {
      fontSize: "0.875rem",
      fontWeight: "600",
      color: "#1e293b",
      textTransform: "uppercase",
      letterSpacing: "0.3px"
    },
    errorMessage: {
      color: "#ef4444",
      fontSize: "0.875rem",
      marginTop: "6px",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      gap: "4px"
    }
  };

  const styleSheet = `
    @keyframes fadeInDown {
      from { opacity: 0; transform: translateY(-30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }
    @keyframes modalSlideIn {
      from { opacity: 0; transform: scale(0.9) translateY(-20px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    input:focus, select:focus, textarea:focus {
      border-color: #023E8A !important;
      box-shadow: 0 0 0 4px rgba(2, 62, 138, 0.1), 0 2px 4px rgba(0, 0, 0, 0.05) !important;
      transform: translateY(-1px);
    }
    tr:hover td {
      background-color: #f8fafc !important;
    }
    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 50px rgba(2, 62, 138, 0.12) !important;
    }
    .chart-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 50px rgba(2, 62, 138, 0.12) !important;
    }
  `;

  const getStatusStyle = (status) => {
    const styles = {
      Present: { bg: "#dbeafe", color: "#023E8A", border: "#93c5fd" },
      Absent: { bg: "#fee2e2", color: "#dc2626", border: "#fca5a5" },
      Leave: { bg: "#fef3c7", color: "#92400e", border: "#fbbf24" },
      "Half-day": { bg: "#ddd6fe", color: "#7c3aed", border: "#c4b5fd" },
      "Work From Home": { bg: "#d1fae5", color: "#065f46", border: "#6ee7b7" },
      // ✅ Add this new line for "Late" status
      Late: { bg: "#ffedd5", color: "#f97316", border: "#fdba74" }, 
    };
    // ✅ Return a fallback style if the status is unknown
    return styles[status] || styles.Present; 
  };

  return (
    <div style={styles.container}>
      <style>{styleSheet}</style>
      <div style={styles.backgroundPattern}></div>
      
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Attendance Management</h1>
          <p style={styles.subtitle}>Track and manage employee attendance with smart analytics</p>
        </div>

        {/* Top Bar */}
        <div style={styles.topBar}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <span style={{ color: "#64748b", fontWeight: "600", fontSize: "0.9rem" }}>📅 MONTH:</span>
            <input
              type="month"
              style={styles.input}
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
          </div>
          <div style={styles.buttonGroup}>
            <button
              style={{ ...styles.button, ...styles.successButton }}
              onClick={openNew}
              onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.target.style.transform = "none"}
            >
              ➕ Add Record
            </button>
            <button
              style={{ ...styles.button, ...styles.primaryButton }}
              onClick={exportPdf}
              onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.target.style.transform = "none"}
            >
              📄 Export PDF
            </button>
          </div>
        </div>

        {/* Filters */}
        <div style={styles.filtersContainer}>
          <div style={styles.filtersRow}>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>🔍 Search Employee</label>
              <input
                style={styles.input}
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>📊 Status Filter</label>
              <select
                style={styles.select}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {["All", "Present", "Absent", "Leave", "Half-day", "Work From Home"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>📅 From Date</label>
              <input
                type="date"
                style={styles.input}
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>📅 To Date</label>
              <input
                type="date"
                style={styles.input}
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>
          <div style={{ marginTop: "20px", textAlign: "right", color: "#64748b", fontWeight: "600" }}>
            {loading ? "Loading..." : `${filteredRows.length} records shown`}
          </div>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsContainer}>
          {[
            { icon: "✅", label: "On Time", value: totals.onTime, delay: "0s" },
            { icon: "⏰", label: "Late Check-in", value: totals.lateIn, delay: "0.1s" },
            { icon: "🌅", label: "Early Check-in", value: totals.earlyIn, delay: "0.2s" },
            { icon: "👥", label: "Present", value: totals.present, delay: "0.3s" },
            { icon: "❌", label: "Absent", value: totals.absent, delay: "0.4s" },
            { icon: "⏱️", label: "Avg Hours", value: totals.avgHours, delay: "0.5s" },
          ].map((stat, i) => (
            <div 
              key={i} 
              className="stat-card"
              style={{ ...styles.statCard, animationDelay: stat.delay }}
            >
              <span style={styles.statIcon}>{stat.icon}</span>
              <div style={styles.statLabel}>{stat.label}</div>
              <div style={styles.statValue}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Charts disabled - show compact stats instead */}
        <div style={styles.chartsGrid}>
          <div className="chart-card" style={styles.chartCard}>
            <h3 style={styles.chartTitle}>📊 Status Distribution</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" }}>
              {barData.map((b) => (
                <div key={b.status} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "14px" }}>
                  <div style={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 700 }}>{b.status}</div>
                  <div style={{ color: "#023E8A", fontSize: "1.5rem", fontWeight: 800 }}>{b.count}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="chart-card" style={styles.chartCard}>
            <h3 style={styles.chartTitle}>📈 Average Hours Per Day</h3>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {lineData.map((l) => (
                <div key={l.date} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "12px 14px" }}>
                  <div style={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 700 }}>Day {l.date}</div>
                  <div style={{ color: "#0353b8", fontSize: "1.3rem", fontWeight: 800 }}>{l.hours}h</div>
                </div>
              ))}
            </div>
          </div>
          <div className="chart-card" style={styles.chartCard}>
            <h3 style={styles.chartTitle}>🥧 Status Breakdown</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" }}>
              {pieData.map((p, i) => (
                <div key={p.name} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "14px" }}>
                  <div style={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 700 }}>{p.name}</div>
                  <div style={{ color: CHART_COLORS[i % CHART_COLORS.length], fontSize: "1.5rem", fontWeight: 800 }}>{p.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th} onClick={() => toggleSort("employee")}>
                  Employee {sort.key === "employee" ? (sort.dir === "asc" ? "▲" : "▼") : ""}
                </th>
                <th style={styles.th} onClick={() => toggleSort("employeeId")}>
                  Employee ID {sort.key === "employeeId" ? (sort.dir === "asc" ? "▲" : "▼") : ""}
                </th>
                <th style={styles.th} onClick={() => toggleSort("date")}>
                  Date {sort.key === "date" ? (sort.dir === "asc" ? "▲" : "▼") : ""}
                </th>
                <th style={styles.th} onClick={() => toggleSort("status")}>
                  Status {sort.key === "status" ? (sort.dir === "asc" ? "▲" : "▼") : ""}
                </th>
                <th style={styles.th} onClick={() => toggleSort("checkIn")}>
                  Check-in {sort.key === "checkIn" ? (sort.dir === "asc" ? "▲" : "▼") : ""}
                </th>
                <th style={styles.th} onClick={() => toggleSort("checkOut")}>
                  Check-out {sort.key === "checkOut" ? (sort.dir === "asc" ? "▲" : "▼") : ""}
                </th>
                <th style={styles.th}>Notes</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((r, idx) => {
                const statusStyle = getStatusStyle(r.status);
                return (
                  <tr key={r._id} style={{ backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f8fafc" }}>
                    <td style={styles.td}><strong>{r.user?.name || r.user}</strong></td>
                    <td style={styles.td}>
                      <span style={{
                        fontFamily: "monospace",
                        backgroundColor: "#f1f5f9",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        color: "#023E8A"
                      }}>
                        {r.user?.employeeId || "-"}
                      </span>
                    </td>
                    <td style={styles.td}>{new Date(r.date).toISOString().slice(0, 10)}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.color,
                        borderColor: statusStyle.border
                      }}>
                        {r.status}
                      </span>
                    </td>
                    <td style={styles.td}>{r.checkIn || "-"}</td>
                    <td style={styles.td}>{r.checkOut || "-"}</td>
                    <td style={{...styles.td, maxWidth: "250px"}}>
                      <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={r.notes}>
                        {r.notes || "-"}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionButtons}>
                        <button
                          style={{
                            ...styles.actionButton,
                            borderColor: "#023E8A",
                            color: "#023E8A"
                          }}
                          onClick={() => openEdit(r)}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#023E8A";
                            e.target.style.color = "#ffffff";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "transparent";
                            e.target.style.color = "#023E8A";
                          }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          style={{
                            ...styles.actionButton,
                            borderColor: "#ef4444",
                            color: "#ef4444"
                          }}
                          onClick={() => doDelete(r._id)}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#ef4444";
                            e.target.style.color = "#ffffff";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "transparent";
                            e.target.style.color = "#ef4444";
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={8} style={styles.noResults}>
                    {loading ? (
                      <div style={styles.loadingContainer}>
                        <div style={{ fontSize: "3rem", marginBottom: "20px" }}>⏳</div>
                        <div style={{ color: "#023E8A", fontSize: "1.2rem", fontWeight: "600" }}>
                          Loading attendance data...
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: "4rem", marginBottom: "15px", opacity: 0.5 }}>📋</div>
                        <div style={{ fontSize: "1.2rem", fontWeight: "600", color: "#1e293b" }}>No records found</div>
                        <div style={{ fontSize: "1rem", marginTop: "8px" }}>Try adjusting your filters or add a new record</div>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Editor Modal */}
        {showEditor && (
          <Modal
            title={editing?._id ? "✏️ Edit Attendance Record" : "➕ Add New Attendance Record"}
            onClose={() => setShowEditor(false)}
          >
            {(() => {
              const timeDisabled = ["Absent", "Leave"].includes(editing?.status);
              return (
                <>
                  <div style={styles.modalForm}>
                    <div style={styles.modalFormGroup}>
                      <label style={styles.modalLabel}>👤 Employee</label>
                      <select
                        style={styles.select}
                        value={editing.user}
                        onChange={(e) => setEditing({ ...editing, user: e.target.value })}
                      >
                        <option value="">Select Employee</option>
                        {users.map((u) => (
                          <option key={u._id} value={u._id}>
                            {u.name} {u.role ? `(${u.role})` : ''}
                          </option>
                        ))}
                      </select>
                      {errors.user && <div style={styles.errorMessage}><span>⚠️</span>{errors.user}</div>}
                    </div>

                    <div style={styles.modalFormGroup}>
                      <label style={styles.modalLabel}>📅 Date</label>
                      <input
                        type="date"
                        style={styles.input}
                        value={editing.date}
                        onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                      />
                      {errors.date && <div style={styles.errorMessage}><span>⚠️</span>{errors.date}</div>}
                    </div>

                    <div style={styles.modalFormGroup}>
                      <label style={styles.modalLabel}>📊 Status</label>
                      <select
                        style={styles.select}
                        value={editing.status}
                        onChange={(e) => {
                          const next = e.target.value;
                          setEditing(prev => ({
                            ...prev,
                            status: next,
                            checkIn: ["Absent","Leave"].includes(next) ? "" : prev.checkIn,
                            checkOut: ["Absent","Leave"].includes(next) ? "" : prev.checkOut,
                          }));
                        }}
                      >
                        {["Present", "Absent", "Leave", "Half-day", "Work From Home"].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div style={styles.modalFormGroup}>
                      <label style={styles.modalLabel}>🕐 Check-in Time</label>
                      <input
                        type="time"
                        style={{
                          ...styles.input,
                          backgroundColor: timeDisabled ? "#f1f5f9" : "#ffffff",
                          cursor: timeDisabled ? "not-allowed" : "text"
                        }}
                        value={editing.checkIn || ""}
                        onChange={(e) => setEditing({ ...editing, checkIn: e.target.value })}
                        disabled={timeDisabled}
                      />
                      {errors.checkIn && <div style={styles.errorMessage}><span>⚠️</span>{errors.checkIn}</div>}
                    </div>

                    <div style={styles.modalFormGroup}>
                      <label style={styles.modalLabel}>🕔 Check-out Time</label>
                      <input
                        type="time"
                        style={{
                          ...styles.input,
                          backgroundColor: timeDisabled ? "#f1f5f9" : "#ffffff",
                          cursor: timeDisabled ? "not-allowed" : "text"
                        }}
                        value={editing.checkOut || ""}
                        onChange={(e) => setEditing({ ...editing, checkOut: e.target.value })}
                        disabled={timeDisabled}
                      />
                      {errors.checkOut && <div style={styles.errorMessage}><span>⚠️</span>{errors.checkOut}</div>}
                    </div>

                    <div style={{ ...styles.modalFormGroup, gridColumn: "1 / -1" }}>
                      <label style={styles.modalLabel}>📝 Notes</label>
                      <textarea
                        style={{
                          ...styles.input,
                          minHeight: "100px",
                          resize: "vertical"
                        }}
                        value={editing.notes}
                        onChange={(e) => setEditing({ ...editing, notes: e.target.value })}
                        placeholder="Add any additional notes..."
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: "30px", display: "flex", justifyContent: "flex-end", gap: "15px" }}>
                    <button
                      style={{
                        ...styles.button,
                        background: "#ffffff",
                        color: "#64748b",
                        border: "2px solid #e2e8f0"
                      }}
                      onClick={() => setShowEditor(false)}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#f8fafc";
                        e.target.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "#ffffff";
                        e.target.style.transform = "none";
                      }}
                    >
                      ✕ Cancel
                    </button>
                    <button
                      style={{ ...styles.button, ...styles.primaryButton }}
                      onClick={doSave}
                      disabled={users.length === 0 || !editing.user}
                      onMouseEnter={(e) => !e.target.disabled && (e.target.style.transform = "translateY(-2px)")}
                      onMouseLeave={(e) => !e.target.disabled && (e.target.style.transform = "none")}
                    >
                      {editing?._id ? "✓ Update Record" : "✓ Create Record"}
                    </button>
                  </div>

                  {users.length === 0 && (
                    <div style={{
                      marginTop: "20px",
                      padding: "15px 20px",
                      backgroundColor: "#fef3c7",
                      border: "2px solid #fbbf24",
                      borderRadius: "12px",
                      color: "#92400e",
                      fontSize: "0.9rem"
                    }}>
                      <strong>⚠️ Warning:</strong> No employees available! Please add employees in the Internal Users management page first.
                    </div>
                  )}
                </>
              );
            })()}
          </Modal>
        )}
      </div>
    </div>
  );
}