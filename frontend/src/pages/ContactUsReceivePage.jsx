import React, { useEffect, useState } from "react";
import contactService from "../services/contactService";

const ContactUsReceivePage = () => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [analysis, setAnalysis] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);

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

  const handleAnalyze = async () => {
    if (messages.length === 0) {
      alert("No messages to analyze!");
      return;
    }
  
    setAnalyzing(true);
    try {
      const result = await contactService.analyzeMessages(messages);
      setAnalysis(result.analyzed);
      alert("Messages analyzed successfully!");
    } catch (err) {
      console.error("Analysis error:", err);
      alert("Failed to analyze messages");
    } finally {
      setAnalyzing(false);
    }
  };

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
  
    console.log("Analyzed messages:", analyzedMessages); // ✅ For debugging
    setMessages(analyzedMessages);
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

  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "40px 20px",
      backgroundColor: "#ffffff",
      minHeight: "100vh",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
      textAlign: "center",
      marginBottom: "40px",
    },
    title: {
      color: "#023E8A",
      fontSize: "2.5rem",
      fontWeight: "600",
      margin: "0",
      marginBottom: "10px",
    },
    subtitle: {
      color: "#6c757d",
      fontSize: "1.1rem",
      margin: "0",
      fontWeight: "400",
    },
    controlsContainer: {
      backgroundColor: "#f8f9fa",
      padding: "25px",
      borderRadius: "12px",
      marginBottom: "30px",
      border: "1px solid #e9ecef",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    },
    controlsRow: {
      display: "flex",
      gap: "20px",
      alignItems: "center",
      flexWrap: "wrap",
    },
    searchInput: {
      flex: "1",
      padding: "12px 16px",
      border: "2px solid #e9ecef",
      borderRadius: "8px",
      fontSize: "1rem",
      outline: "none",
      transition: "all 0.3s ease",
      minWidth: "250px",
    },
    searchInputFocus: {
      borderColor: "#023E8A",
      boxShadow: "0 0 0 3px rgba(2, 62, 138, 0.1)",
    },
    statsContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "30px",
      padding: "20px 25px",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      border: "1px solid #e9ecef",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    },
    statsText: {
      color: "#495057",
      fontSize: "1rem",
      fontWeight: "500",
    },
    statsNumber: {
      color: "#023E8A",
      fontWeight: "700",
      fontSize: "1.2rem",
    },
    messageCard: {
      backgroundColor: "#ffffff",
      border: "1px solid #e9ecef",
      borderRadius: "15px",
      padding: "30px",
      marginBottom: "25px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.08)",
      transition: "all 0.3s ease",
      position: "relative",
    },
    messageCardHover: {
      transform: "translateY(-3px)",
      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
      borderColor: "#023E8A",
    },
    messageHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "20px",
      paddingBottom: "15px",
      borderBottom: "2px solid #f8f9fa",
    },
    customerInfo: {
      flex: "1",
    },
    customerName: {
      fontSize: "1.4rem",
      fontWeight: "600",
      color: "#023E8A",
      margin: "0 0 5px 0",
    },
    contactInfo: {
      display: "flex",
      flexDirection: "column",
      gap: "5px",
    },
    contactItem: {
      fontSize: "0.95rem",
      color: "#6c757d",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    contactLabel: {
      fontWeight: "500",
      color: "#495057",
      minWidth: "50px",
    },
    messageContent: {
      backgroundColor: "#f8f9fa",
      padding: "20px",
      borderRadius: "10px",
      border: "1px solid #e9ecef",
      marginBottom: "25px",
    },
    messageLabel: {
      fontSize: "0.9rem",
      fontWeight: "600",
      color: "#023E8A",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      marginBottom: "10px",
    },
    messageText: {
      fontSize: "1.1rem",
      lineHeight: "1.6",
      color: "#495057",
      margin: "0",
    },
    buttonContainer: {
      display: "flex",
      gap: "12px",
      justifyContent: "flex-end",
    },
    button: {
      padding: "10px 20px",
      border: "none",
      borderRadius: "8px",
      fontSize: "0.95rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    replyButton: {
      backgroundColor: "#023E8A",
      color: "#ffffff",
    },
    replyButtonHover: {
      backgroundColor: "#012a5c",
      transform: "translateY(-1px)",
    },
    deleteButton: {
      backgroundColor: "#dc3545",
      color: "#ffffff",
    },
    deleteButtonHover: {
      backgroundColor: "#c82333",
      transform: "translateY(-1px)",
    },
    loadingContainer: {
      textAlign: "center",
      padding: "60px 20px",
      color: "#6c757d",
    },
    loadingSpinner: {
      width: "50px",
      height: "50px",
      border: "4px solid #f3f3f3",
      borderTop: "4px solid #023E8A",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      marginBottom: "20px",
      margin: "0 auto 20px auto",
    },
    loadingText: {
      fontSize: "1.2rem",
      fontWeight: "500",
    },
    errorContainer: {
      textAlign: "center",
      padding: "60px 20px",
      color: "#dc3545",
      backgroundColor: "#f8d7da",
      border: "1px solid #f5c6cb",
      borderRadius: "12px",
      margin: "20px 0",
    },
    errorTitle: {
      fontSize: "1.5rem",
      fontWeight: "600",
      marginBottom: "10px",
      color: "#721c24",
    },
    noMessages: {
      textAlign: "center",
      padding: "60px 20px",
      color: "#6c757d",
    },
    noMessagesIcon: {
      fontSize: "3rem",
      marginBottom: "15px",
      opacity: "0.5",
    },
    noMessagesText: {
      fontSize: "1.2rem",
      fontWeight: "500",
      marginBottom: "8px",
    },
    noMessagesSubtext: {
      fontSize: "1rem",
      opacity: "0.7",
    },
    timestampBadge: {
      backgroundColor: "#e9ecef",
      color: "#495057",
      padding: "4px 10px",
      borderRadius: "12px",
      fontSize: "0.8rem",
      fontWeight: "500",
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <div style={styles.loadingText}>Loading messages...</div>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <div style={styles.errorTitle}>Error Loading Messages</div>
          <p>{error}</p>
          <button 
            style={{...styles.button, ...styles.replyButton}}
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Received Messages</h1>
        <p style={styles.subtitle}>Manage and respond to customer inquiries</p>
      </div>

      {/* Search Controls */}
      <div style={styles.controlsContainer}>
        <div style={styles.controlsRow}>
          <input
            type="text"
            placeholder="Search messages by name, email, or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
            onFocus={(e) => {
              e.target.style.borderColor = styles.searchInputFocus.borderColor;
              e.target.style.boxShadow = styles.searchInputFocus.boxShadow;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = styles.searchInput.borderColor;
              e.target.style.boxShadow = "none";
            }}
          />
          <button
  onClick={handleAnalyzeMessages}
  style={{ ...styles.button, ...styles.replyButton }}
  onMouseEnter={(e) => {
    e.target.style.backgroundColor = styles.replyButtonHover.backgroundColor;
    e.target.style.transform = styles.replyButtonHover.transform;
  }}
  onMouseLeave={(e) => {
    e.target.style.backgroundColor = styles.replyButton.backgroundColor;
    e.target.style.transform = "none";
  }}
>
  Analyze Messages
</button>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsContainer}>
        <span style={styles.statsText}>
          Total Messages: <span style={styles.statsNumber}>{messages.length}</span>
        </span>
        <span style={styles.statsText}>
          Showing: <span style={styles.statsNumber}>{filteredMessages.length}</span>
        </span>
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
            style={styles.messageCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = styles.messageCardHover.transform;
              e.currentTarget.style.boxShadow = styles.messageCardHover.boxShadow;
              e.currentTarget.style.borderColor = styles.messageCardHover.borderColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = styles.messageCard.boxShadow;
              e.currentTarget.style.borderColor = styles.messageCard.borderColor;
            }}
          >
            <div style={styles.messageHeader}>
              <div style={styles.customerInfo}>
                <h3 style={styles.customerName}>{msg.name}</h3>
                <div style={styles.contactInfo}>
                  <div style={styles.contactItem}>
                    <span style={styles.contactLabel}>Email:</span>
                    <a href={`mailto:${msg.email}`} style={{color: '#023E8A', textDecoration: 'none'}}>
                      {msg.email}
                    </a>
                  </div>
                  <div style={styles.contactItem}>
                    <span style={styles.contactLabel}>Phone:</span>
                    <a href={`tel:${msg.number}`} style={{color: '#023E8A', textDecoration: 'none'}}>
                      {msg.number}
                    </a>
                  </div>
                </div>
              </div>
              <div style={styles.timestampBadge}>
                {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : 'Recent'}
              </div>
            </div>

            {/* Importance Badge */}
{msg.importance && (
  <div
    style={{
      display: "inline-block",
      backgroundColor:
        msg.importance === "High"
          ? "#dc3545"
          : msg.importance === "Low"
          ? "#198754"
          : "#ffc107",
      color: "white",
      padding: "6px 12px",
      borderRadius: "8px",
      fontSize: "0.9rem",
      fontWeight: "600",
      marginBottom: "12px",
    }}
  >
    {msg.importance} Importance
  </div>
)}

{/* Message Summary */}
{msg.summary && (
  <div
    style={{
      backgroundColor: "#f1f3f5",
      padding: "10px",
      borderRadius: "8px",
      marginBottom: "15px",
      fontStyle: "italic",
      color: "#495057",
    }}
  >
    “{msg.summary}”
  </div>
)}

            <div style={styles.messageContent}>
              <div style={styles.messageLabel}>Message:</div>
              <p style={styles.messageText}>{msg.message}</p>
            </div>

            <div style={styles.buttonContainer}>
              <button
                onClick={() => handleReply(msg._id, msg.email)}
                style={{...styles.button, ...styles.replyButton}}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = styles.replyButtonHover.backgroundColor;
                  e.target.style.transform = styles.replyButtonHover.transform;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = styles.replyButton.backgroundColor;
                  e.target.style.transform = "none";
                }}
              >
                Reply
              </button>
              <button
                onClick={() => handleDelete(msg._id)}
                style={{...styles.button, ...styles.deleteButton}}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = styles.deleteButtonHover.backgroundColor;
                  e.target.style.transform = styles.deleteButtonHover.transform;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = styles.deleteButton.backgroundColor;
                  e.target.style.transform = "none";
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default ContactUsReceivePage;