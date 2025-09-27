// src/pages/AttendanceManagementPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AttendanceManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [attendance, setAttendance] = useState({ userId: '', status: 'present' });
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState('');
  const [percentage, setPercentage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState({
    users: false,
    attendance: false,
    records: false,
    percentage: false
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(prev => ({ ...prev, users: true }));
    try {
      const { data } = await axios.get('http://localhost:3000/api/internal-users');
      setUsers(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, attendance: true }));
    try {
      await axios.post('http://localhost:3000/api/attendance/mark', attendance);
      setAttendance({ userId: '', status: 'present' });
      setError(null);
      // Show success message
      setError('Attendance marked successfully!');
      setTimeout(() => setError(null), 3000);
    } catch (err) {
      setError('Error marking attendance');
    } finally {
      setLoading(prev => ({ ...prev, attendance: false }));
    }
  };

  const fetchRecords = async () => {
    setLoading(prev => ({ ...prev, records: true }));
    try {
      const { data } = await axios.get(`http://localhost:3000/api/attendance/record?search=${search}`);
      setRecords(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch records');
    } finally {
      setLoading(prev => ({ ...prev, records: false }));
    }
  };

  const fetchPercentage = async () => {
    setLoading(prev => ({ ...prev, percentage: true }));
    try {
      const { data } = await axios.get(`http://localhost:3000/api/attendance/percentage?search=${search}`);
      setPercentage(data.percentage);
      setError(null);
    } catch (err) {
      setError('Failed to fetch percentage');
      setPercentage(null);
    } finally {
      setLoading(prev => ({ ...prev, percentage: false }));
    }
  };

  const getStatusColor = (status) => {
    return status === 'present' ? '#28a745' : '#dc3545';
  };

  const getPercentageColor = (percentage) => {
    if (percentage >= 90) return '#28a745';
    if (percentage >= 75) return '#ffc107';
    return '#dc3545';
  };

  const styles = {
    container: {
      maxWidth: "1000px",
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
    section: {
      backgroundColor: "#f8f9fa",
      padding: "30px",
      borderRadius: "12px",
      marginBottom: "30px",
      border: "1px solid #e9ecef",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    },
    sectionTitle: {
      color: "#023E8A",
      fontSize: "1.4rem",
      fontWeight: "600",
      margin: "0 0 20px 0",
      paddingBottom: "10px",
      borderBottom: "2px solid #e9ecef",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    formRow: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
    },
    label: {
      color: "#023E8A",
      fontSize: "0.9rem",
      fontWeight: "600",
      marginBottom: "8px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    input: {
      padding: "12px 16px",
      border: "2px solid #e9ecef",
      borderRadius: "8px",
      fontSize: "1rem",
      fontFamily: "inherit",
      transition: "all 0.3s ease",
      backgroundColor: "#ffffff",
      outline: "none",
    },
    select: {
      padding: "12px 16px",
      border: "2px solid #e9ecef",
      borderRadius: "8px",
      fontSize: "1rem",
      fontFamily: "inherit",
      transition: "all 0.3s ease",
      backgroundColor: "#ffffff",
      outline: "none",
      cursor: "pointer",
    },
    inputFocus: {
      borderColor: "#023E8A",
      boxShadow: "0 0 0 3px rgba(2, 62, 138, 0.1)",
    },
    button: {
      backgroundColor: "#023E8A",
      color: "#ffffff",
      padding: "12px 24px",
      border: "none",
      borderRadius: "8px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    buttonHover: {
      backgroundColor: "#012a5c",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(2, 62, 138, 0.3)",
    },
    buttonDisabled: {
      backgroundColor: "#6c757d",
      cursor: "not-allowed",
      transform: "none",
      boxShadow: "none",
    },
    searchButton: {
      backgroundColor: "#0d6efd",
      color: "#ffffff",
      padding: "12px 24px",
      border: "none",
      borderRadius: "8px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      marginBottom: "20px",
    },
    searchButtonHover: {
      backgroundColor: "#0b5ed7",
      transform: "translateY(-1px)",
    },
    errorMessage: {
      backgroundColor: "#f8d7da",
      color: "#721c24",
      padding: "12px 16px",
      borderRadius: "8px",
      border: "1px solid #f5c6cb",
      fontSize: "0.95rem",
      fontWeight: "500",
      margin: "0 0 20px 0",
      textAlign: "center",
    },
    successMessage: {
      backgroundColor: "#d1edff",
      color: "#0c5460",
      padding: "12px 16px",
      borderRadius: "8px",
      border: "1px solid #bee5eb",
      fontSize: "0.95rem",
      fontWeight: "500",
      margin: "0 0 20px 0",
      textAlign: "center",
    },
    recordsList: {
      listStyle: "none",
      padding: "0",
      margin: "0",
      maxHeight: "400px",
      overflowY: "auto",
    },
    recordItem: {
      backgroundColor: "#ffffff",
      padding: "15px",
      borderRadius: "8px",
      marginBottom: "10px",
      border: "1px solid #e9ecef",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      transition: "all 0.2s ease",
    },
    recordItemHover: {
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      transform: "translateY(-1px)",
    },
    recordInfo: {
      display: "flex",
      flexDirection: "column",
      gap: "5px",
    },
    recordName: {
      fontWeight: "600",
      color: "#023E8A",
      fontSize: "1rem",
    },
    recordDate: {
      color: "#6c757d",
      fontSize: "0.9rem",
    },
    statusBadge: {
      padding: "6px 12px",
      borderRadius: "20px",
      fontSize: "0.8rem",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      color: "#ffffff",
    },
    percentageDisplay: {
      backgroundColor: "#ffffff",
      padding: "20px",
      borderRadius: "8px",
      border: "1px solid #e9ecef",
      textAlign: "center",
      marginTop: "20px",
    },
    percentageValue: {
      fontSize: "2.5rem",
      fontWeight: "700",
      margin: "10px 0",
    },
    percentageLabel: {
      fontSize: "1rem",
      color: "#6c757d",
      textTransform: "uppercase",
      letterSpacing: "1px",
    },
    loadingSpinner: {
      display: "inline-block",
      width: "20px",
      height: "20px",
      border: "2px solid #ffffff",
      borderTop: "2px solid transparent",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      marginRight: "10px",
    },
    noResults: {
      textAlign: "center",
      padding: "40px 20px",
      color: "#6c757d",
      fontSize: "1rem",
      fontStyle: "italic",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "20px",
      marginBottom: "30px",
    },
    statCard: {
      backgroundColor: "#ffffff",
      padding: "20px",
      borderRadius: "8px",
      border: "1px solid #e9ecef",
      textAlign: "center",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    },
    statNumber: {
      fontSize: "2rem",
      fontWeight: "700",
      color: "#023E8A",
      margin: "0",
    },
    statLabel: {
      fontSize: "0.9rem",
      color: "#6c757d",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      margin: "5px 0 0 0",
    },
    '@media (max-width: 768px)': {
      formRow: {
        gridTemplateColumns: "1fr",
      },
    },
  };

  const isSuccessMessage = error && error.includes('successfully');

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Attendance Management</h1>
        <p style={styles.subtitle}>Track and manage employee attendance records</p>
      </div>

      {/* Stats Overview */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{users.length}</div>
          <div style={styles.statLabel}>Total Employees</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{records.length}</div>
          <div style={styles.statLabel}>Records Found</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>
            {percentage !== null ? `${percentage}%` : '-'}
          </div>
          <div style={styles.statLabel}>Attendance Rate</div>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div style={isSuccessMessage ? styles.successMessage : styles.errorMessage}>
          {error}
        </div>
      )}

      {/* Mark Attendance Section */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Mark Attendance</h3>
        <form onSubmit={handleAttendanceSubmit} style={styles.form}>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Select Employee</label>
              <select
                value={attendance.userId}
                onChange={(e) => setAttendance({ ...attendance, userId: e.target.value })}
                style={styles.select}
                onFocus={(e) => {
                  e.target.style.borderColor = styles.inputFocus.borderColor;
                  e.target.style.boxShadow = styles.inputFocus.boxShadow;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = styles.select.borderColor;
                  e.target.style.boxShadow = "none";
                }}
                required
                disabled={loading.attendance || loading.users}
              >
                <option value="">Select an employee</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Attendance Status</label>
              <select
                value={attendance.status}
                onChange={(e) => setAttendance({ ...attendance, status: e.target.value })}
                style={styles.select}
                onFocus={(e) => {
                  e.target.style.borderColor = styles.inputFocus.borderColor;
                  e.target.style.boxShadow = styles.inputFocus.boxShadow;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = styles.select.borderColor;
                  e.target.style.boxShadow = "none";
                }}
                disabled={loading.attendance}
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            style={{
              ...styles.button,
              ...(loading.attendance ? styles.buttonDisabled : {})
            }}
            onMouseEnter={(e) => {
              if (!loading.attendance) {
                e.target.style.backgroundColor = styles.buttonHover.backgroundColor;
                e.target.style.transform = styles.buttonHover.transform;
                e.target.style.boxShadow = styles.buttonHover.boxShadow;
              }
            }}
            onMouseLeave={(e) => {
              if (!loading.attendance) {
                e.target.style.backgroundColor = styles.button.backgroundColor;
                e.target.style.transform = "none";
                e.target.style.boxShadow = "none";
              }
            }}
            disabled={loading.attendance}
          >
            {loading.attendance && <span style={styles.loadingSpinner}></span>}
            {loading.attendance ? "Marking..." : "Mark Attendance"}
          </button>
        </form>
      </div>

      {/* Records Section */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Attendance Records</h3>
        <div style={styles.formGroup}>
          <label style={styles.label}>Search Records</label>
          <input
            type="text"
            placeholder="Search by name, ID, or phone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.input}
            onFocus={(e) => {
              e.target.style.borderColor = styles.inputFocus.borderColor;
              e.target.style.boxShadow = styles.inputFocus.boxShadow;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = styles.input.borderColor;
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        <button 
          onClick={fetchRecords} 
          style={styles.searchButton}
          onMouseEnter={(e) => {
            if (!loading.records) {
              e.target.style.backgroundColor = styles.searchButtonHover.backgroundColor;
              e.target.style.transform = styles.searchButtonHover.transform;
            }
          }}
          onMouseLeave={(e) => {
            if (!loading.records) {
              e.target.style.backgroundColor = styles.searchButton.backgroundColor;
              e.target.style.transform = "none";
            }
          }}
          disabled={loading.records}
        >
          {loading.records && <span style={styles.loadingSpinner}></span>}
          {loading.records ? "Searching..." : "Search Records"}
        </button>

        <ul style={styles.recordsList}>
          {records.length > 0 ? (
            records.map(record => (
              <li 
                key={record._id} 
                style={styles.recordItem}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = styles.recordItemHover.boxShadow;
                  e.currentTarget.style.transform = styles.recordItemHover.transform;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "none";
                }}
              >
                <div style={styles.recordInfo}>
                  <div style={styles.recordName}>
                    {record.userId?.name || 'Unknown User'}
                  </div>
                  <div style={styles.recordDate}>
                    {new Date(record.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <span 
                  style={{
                    ...styles.statusBadge,
                    backgroundColor: getStatusColor(record.status)
                  }}
                >
                  {record.status}
                </span>
              </li>
            ))
          ) : (
            <div style={styles.noResults}>
              No attendance records found. Try searching for specific employees.
            </div>
          )}
        </ul>
      </div>

      {/* Percentage Section */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Attendance Percentage</h3>
        <div style={styles.formGroup}>
          <label style={styles.label}>Search Employee</label>
          <input
            type="text"
            placeholder="Search by name, ID, or phone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.input}
            onFocus={(e) => {
              e.target.style.borderColor = styles.inputFocus.borderColor;
              e.target.style.boxShadow = styles.inputFocus.boxShadow;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = styles.input.borderColor;
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        <button 
          onClick={fetchPercentage} 
          style={styles.searchButton}
          onMouseEnter={(e) => {
            if (!loading.percentage) {
              e.target.style.backgroundColor = styles.searchButtonHover.backgroundColor;
              e.target.style.transform = styles.searchButtonHover.transform;
            }
          }}
          onMouseLeave={(e) => {
            if (!loading.percentage) {
              e.target.style.backgroundColor = styles.searchButton.backgroundColor;
              e.target.style.transform = "none";
            }
          }}
          disabled={loading.percentage}
        >
          {loading.percentage && <span style={styles.loadingSpinner}></span>}
          {loading.percentage ? "Calculating..." : "Get Percentage"}
        </button>

        {percentage !== null && (
          <div style={styles.percentageDisplay}>
            <div style={styles.percentageLabel}>Attendance Percentage</div>
            <div 
              style={{
                ...styles.percentageValue,
                color: getPercentageColor(percentage)
              }}
            >
              {percentage}%
            </div>
          </div>
        )}
      </div>

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

export default AttendanceManagementPage;