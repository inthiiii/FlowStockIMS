import React, { useEffect, useState } from "react";
import contactService from "../services/contactService";

const ContactUsReceivePage = () => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [expandedMessages, setExpandedMessages] = useState(new Set());

  useEffect(() => {
    setLoading(true);
    contactService.getMessages()
      .then((data) => {
        setMessages(data);
        setError("");
      })
      .catch(err => {
        setError("Failed to load messages");
        console.error("Error loading messages:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await contactService.deleteMessage(id);
        setMessages(messages.filter((msg) => msg._id !== id));
      } catch (err) {
        alert("Delete failed!");
        console.error("Delete error:", err);
      }
    }
  };

  const handleReply = async (id, email) => {
    const reply = prompt("Enter your reply:");
    if (reply && reply.trim()) {
      try {
        await contactService.replyMessage(id, reply);
        alert("Reply sent successfully!");
      } catch (err) {
        alert("Reply failed!");
        console.error("Reply error:", err);
      }
    }
  };

  const handleAnalyzeMessages = () => {
    setAnalyzing(true);
    
    setTimeout(() => {
      const analyzedMessages = messages.map((msg) => {
        const text = msg.message.toLowerCase();
        let importance = "Normal";
    
        if (
          text.includes("urgent") ||
          text.includes("immediately") ||
          text.includes("asap") ||
          text.includes("help") ||
          text.includes("important")
        ) {
          importance = "High";
        } else if (
          text.includes("thank you") ||
          text.includes("appreciate") ||
          text.includes("feedback") ||
          text.includes("good") ||
          text.includes("nice")
        ) {
          importance = "Low";
        }
    
        const words = msg.message.split(" ");
        const summary =
          words.length > 15 ? words.slice(0, 15).join(" ") + "..." : msg.message;
    
        return { ...msg, importance, summary };
      });
    
      setMessages(analyzedMessages);
      setAnalyzing(false);
    }, 1200);
  };

  const toggleExpand = (id) => {
    const newExpanded = new Set(expandedMessages);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedMessages(newExpanded);
  };

  const getFilteredMessages = () => {
    return messages.filter((msg) => {
      const matchesSearch = 
        msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  };

  const filteredMessages = getFilteredMessages();

  const getImportanceStats = () => {
    const high = messages.filter(m => m.importance === "High").length;
    const normal = messages.filter(m => m.importance === "Normal").length;
    const low = messages.filter(m => m.importance === "Low").length;
    return { high, normal, low };
  };

  const stats = getImportanceStats();

  const styles = {
    container: {
      maxWidth: "1400px",
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
      animation: "fadeInDown 0.8s ease-out",
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
      letterSpacing: "0.5px",
    },
    controlsContainer: {
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      padding: "30px",
      borderRadius: "20px",
      marginBottom: "35px",
      border: "1px solid rgba(226, 232, 240, 0.8)",
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.06)",
      animation: "fadeInUp 0.8s ease-out",
    },
    controlsRow: {
      display: "flex",
      gap: "20px",
      alignItems: "center",
      flexWrap: "wrap",
    },
    searchInput: {
      flex: "1",
      padding: "16px 50px 16px 20px",
      border: "2px solid #e2e8f0",
      borderRadius: "14px",
      fontSize: "1.05rem",
      outline: "none",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      minWidth: "300px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
      backgroundColor: "#ffffff",
    },
    searchIcon: {
      position: "absolute",
      right: "20px",
      top: "50%",
      transform: "translateY(-50%)",
      fontSize: "1.3rem",
      color: "#64748b",
      pointerEvents: "none",
    },
    analyzeButton: {
      background: "linear-gradient(135deg, #023E8A 0%, #0353b8 100%)",
      color: "#ffffff",
      padding: "14px 32px",
      border: "none",
      borderRadius: "12px",
      fontSize: "1rem",
      fontWeight: "700",
      cursor: "pointer",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      boxShadow: "0 6px 20px rgba(2, 62, 138, 0.3)",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "20px",
      marginBottom: "40px",
      animation: "fadeInUp 0.9s ease-out",
    },
    statCard: {
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      padding: "25px",
      borderRadius: "16px",
      border: "1px solid rgba(226, 232, 240, 0.8)",
      textAlign: "center",
      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.06)",
      transition: "all 0.3s ease",
      cursor: "pointer",
    },
    statIcon: {
      fontSize: "2.5rem",
      marginBottom: "10px",
      display: "block",
      filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
    },
    statNumber: {
      fontSize: "2.5rem",
      fontWeight: "800",
      margin: "8px 0",
      lineHeight: "1",
    },
    statLabel: {
      fontSize: "0.85rem",
      color: "#64748b",
      textTransform: "uppercase",
      letterSpacing: "1px",
      fontWeight: "600",
    },
    messageCard: {
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      border: "1px solid rgba(226, 232, 240, 0.8)",
      borderRadius: "20px",
      padding: "35px",
      marginBottom: "25px",
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.06)",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      position: "relative",
      overflow: "hidden",
      animation: "fadeInUp 1s ease-out",
    },
    messageHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "25px",
      paddingBottom: "20px",
      borderBottom: "2px solid #f1f5f9",
    },
    customerInfo: {
      flex: "1",
    },
    customerName: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "#023E8A",
      margin: "0 0 12px 0",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    customerIcon: {
      fontSize: "1.3rem",
    },
    contactInfo: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    contactItem: {
      fontSize: "0.95rem",
      color: "#64748b",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "6px 0",
    },
    contactIcon: {
      fontSize: "1.1rem",
    },
    contactLink: {
      color: "#023E8A",
      textDecoration: "none",
      fontWeight: "500",
      transition: "color 0.3s ease",
    },
    messageContent: {
      backgroundColor: "#f8fafc",
      padding: "25px",
      borderRadius: "14px",
      border: "1px solid #e2e8f0",
      marginBottom: "25px",
      position: "relative",
    },
    messageLabel: {
      fontSize: "0.85rem",
      fontWeight: "700",
      color: "#023E8A",
      textTransform: "uppercase",
      letterSpacing: "1px",
      marginBottom: "12px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    messageText: {
      fontSize: "1.05rem",
      lineHeight: "1.7",
      color: "#334155",
      margin: "0",
    },
    buttonContainer: {
      display: "flex",
      gap: "12px",
      justifyContent: "flex-end",
      flexWrap: "wrap",
    },
    button: {
      padding: "12px 24px",
      border: "none",
      borderRadius: "10px",
      fontSize: "0.9rem",
      fontWeight: "700",
      cursor: "pointer",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    replyButton: {
      background: "linear-gradient(135deg, #023E8A 0%, #0353b8 100%)",
      color: "#ffffff",
      boxShadow: "0 4px 12px rgba(2, 62, 138, 0.3)",
    },
    deleteButton: {
      background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      color: "#ffffff",
      boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
    },
    loadingContainer: {
      textAlign: "center",
      padding: "100px 20px",
    },
    loadingSpinner: {
      width: "60px",
      height: "60px",
      border: "5px solid #e2e8f0",
      borderTop: "5px solid #023E8A",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      margin: "0 auto 25px auto",
    },
    loadingText: {
      fontSize: "1.2rem",
      fontWeight: "600",
      color: "#64748b",
    },
    errorContainer: {
      textAlign: "center",
      padding: "60px 30px",
      background: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
      border: "1px solid #fecaca",
      borderRadius: "20px",
      margin: "40px 0",
      boxShadow: "0 10px 40px rgba(220, 53, 69, 0.15)",
    },
    errorTitle: {
      fontSize: "1.8rem",
      fontWeight: "700",
      marginBottom: "15px",
      color: "#991b1b",
    },
    errorText: {
      fontSize: "1.1rem",
      color: "#dc2626",
      marginBottom: "25px",
    },
    noMessages: {
      textAlign: "center",
      padding: "80px 20px",
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      borderRadius: "20px",
      border: "1px solid rgba(226, 232, 240, 0.8)",
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.06)",
    },
    noMessagesIcon: {
      fontSize: "5rem",
      marginBottom: "20px",
      opacity: "0.6",
      filter: "grayscale(30%)",
    },
    noMessagesText: {
      fontSize: "1.4rem",
      fontWeight: "600",
      marginBottom: "10px",
      color: "#334155",
    },
    noMessagesSubtext: {
      fontSize: "1.05rem",
      color: "#64748b",
    },
    importanceBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "8px 16px",
      borderRadius: "20px",
      fontSize: "0.85rem",
      fontWeight: "700",
      marginBottom: "15px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    },
    summaryBox: {
      backgroundColor: "#f1f5f9",
      padding: "15px 20px",
      borderRadius: "12px",
      marginBottom: "20px",
      fontStyle: "italic",
      color: "#475569",
      borderLeft: "4px solid #023E8A",
      fontSize: "0.95rem",
      lineHeight: "1.6",
    },
    timestampBadge: {
      backgroundColor: "#f1f5f9",
      color: "#475569",
      padding: "8px 16px",
      borderRadius: "20px",
      fontSize: "0.85rem",
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    expandButton: {
      background: "none",
      border: "none",
      color: "#023E8A",
      cursor: "pointer",
      fontSize: "0.9rem",
      fontWeight: "600",
      padding: "8px 0",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
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
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
    }
    .message-card:hover {
      transform: translateY(-6px) scale(1.01);
      box-shadow: 0 20px 60px rgba(2, 62, 138, 0.12);
      border-color: #023E8A;
    }
    .stat-card:hover {
      transform: translateY(-4px) scale(1.03);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
    }
    input:focus {
      border-color: #023E8A !important;
      box-shadow: 0 0 0 4px rgba(2, 62, 138, 0.1), 0 4px 12px rgba(0, 0, 0, 0.08) !important;
      transform: translateY(-1px);
    }
    .action-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }
    .action-btn:active {
      transform: translateY(-1px);
    }
    .analyzing-shimmer {
      background: linear-gradient(90deg, #023E8A 0%, #0353b8 50%, #023E8A 100%);
      background-size: 1000px 100%;
      animation: shimmer 2s infinite;
    }
    .contact-link:hover {
      color: #0353b8;
      text-decoration: underline;
    }
    .expand-btn:hover {
      transform: translateX(4px);
    }
  `;

  if (loading) {
    return (
      <div style={styles.container}>
        <style>{styleSheet}</style>
        <div style={styles.content}>
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}></div>
            <div style={styles.loadingText}>Loading messages...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <style>{styleSheet}</style>
        <div style={styles.content}>
          <div style={styles.errorContainer}>
            <div style={styles.errorTitle}>⚠️ Error Loading Messages</div>
            <p style={styles.errorText}>{error}</p>
            <button 
              className="action-btn"
              style={{...styles.button, ...styles.replyButton}}
              onClick={() => window.location.reload()}
            >
              🔄 Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{styleSheet}</style>
      <div style={styles.backgroundPattern}></div>
      
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>Customer Inquiries</h1>
          <p style={styles.subtitle}>View, analyze and respond to all incoming messages</p>
        </div>

        {/* Search Controls */}
        <div style={styles.controlsContainer}>
          <div style={styles.controlsRow}>
            <div style={{ position: "relative", flex: 1 }}>
              <input
                type="text"
                placeholder="Search messages by name, email, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
              <span style={styles.searchIcon}>🔍</span>
            </div>
            <button
              onClick={handleAnalyzeMessages}
              className={analyzing ? "analyzing-shimmer" : "action-btn"}
              style={styles.analyzeButton}
              disabled={analyzing}
            >
              {analyzing ? "🔍 Analyzing..." : "🧠 Analyze Messages"}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          <div className="stat-card" style={styles.statCard}>
            <span style={styles.statIcon}>📬</span>
            <div style={{...styles.statNumber, color: '#023E8A'}}>{messages.length}</div>
            <div style={styles.statLabel}>Total Messages</div>
          </div>
          <div className="stat-card" style={styles.statCard}>
            <span style={styles.statIcon}>🔴</span>
            <div style={{...styles.statNumber, color: '#ef4444'}}>{stats.high}</div>
            <div style={styles.statLabel}>High Priority</div>
          </div>
          <div className="stat-card" style={styles.statCard}>
            <span style={styles.statIcon}>🟡</span>
            <div style={{...styles.statNumber, color: '#f59e0b'}}>{stats.normal}</div>
            <div style={styles.statLabel}>Normal Priority</div>
          </div>
          <div className="stat-card" style={styles.statCard}>
            <span style={styles.statIcon}>🟢</span>
            <div style={{...styles.statNumber, color: '#10b981'}}>{stats.low}</div>
            <div style={styles.statLabel}>Low Priority</div>
          </div>
        </div>

        {/* Messages */}
        {filteredMessages.length === 0 ? (
          <div style={styles.noMessages}>
            <div style={styles.noMessagesIcon}>📬</div>
            <div style={styles.noMessagesText}>
              {searchTerm ? "No messages match your search" : "No messages received yet"}
            </div>
            <div style={styles.noMessagesSubtext}>
              {searchTerm 
                ? `Try adjusting your search term: "${searchTerm}"` 
                : "Customer messages will appear here when received"}
            </div>
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <div 
              key={msg._id} 
              className="message-card"
              style={styles.messageCard}
            >
              <div style={styles.messageHeader}>
                <div style={styles.customerInfo}>
                  <h3 style={styles.customerName}>
                    <span style={styles.customerIcon}>👤</span>
                    {msg.name}
                  </h3>
                  <div style={styles.contactInfo}>
                    <div style={styles.contactItem}>
                      <span style={styles.contactIcon}>📧</span>
                      <a 
                        href={`mailto:${msg.email}`} 
                        style={styles.contactLink}
                        className="contact-link"
                      >
                        {msg.email}
                      </a>
                    </div>
                    <div style={styles.contactItem}>
                      <span style={styles.contactIcon}>📞</span>
                      <a 
                        href={`tel:${msg.number}`} 
                        style={styles.contactLink}
                        className="contact-link"
                      >
                        {msg.number}
                      </a>
                    </div>
                  </div>
                </div>
                <div style={styles.timestampBadge}>
                  <span>📅</span>
                  {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : 'Recent'}
                </div>
              </div>

              {/* Importance Badge */}
              {msg.importance && (
                <div
                  style={{
                    ...styles.importanceBadge,
                    backgroundColor:
                      msg.importance === "High"
                        ? "#ef4444"
                        : msg.importance === "Low"
                        ? "#10b981"
                        : "#f59e0b",
                    color: "white",
                  }}
                >
                  {msg.importance === "High" ? "🔴" : msg.importance === "Low" ? "🟢" : "🟡"}
                  {msg.importance} Priority
                </div>
              )}

              {/* Message Summary */}
              {msg.summary && msg.message.length > 100 && (
                <div style={styles.summaryBox}>
                  💬 "{msg.summary}"
                </div>
              )}

              <div style={styles.messageContent}>
                <div style={styles.messageLabel}>
                  <span>💌</span>
                  Message
                </div>
                <p style={styles.messageText}>
                  {expandedMessages.has(msg._id) || msg.message.length <= 200
                    ? msg.message
                    : `${msg.message.substring(0, 200)}...`}
                </p>
                {msg.message.length > 200 && (
                  <button
                    onClick={() => toggleExpand(msg._id)}
                    style={styles.expandButton}
                    className="expand-btn"
                  >
                    {expandedMessages.has(msg._id) ? "Show less ▲" : "Read more ▼"}
                  </button>
                )}
              </div>

              <div style={styles.buttonContainer}>
                <button
                  onClick={() => handleReply(msg._id, msg.email)}
                  className="action-btn"
                  style={{...styles.button, ...styles.replyButton}}
                >
                  <span>↩️</span>
                  Reply
                </button>
                <button
                  onClick={() => handleDelete(msg._id)}
                  className="action-btn"
                  style={{...styles.button, ...styles.deleteButton}}
                >
                  <span>🗑️</span>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ContactUsReceivePage;