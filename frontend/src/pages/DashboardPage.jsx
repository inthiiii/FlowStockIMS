import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// --- Reusable Icon Components ---
const Icon = ({ path, className = '' }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={path}></path>
  </svg>
);

const SalesIcon = () => <Icon path="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />;
const ProductIcon = () => <Icon path="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />;
const ShipmentIcon = () => <Icon path="M16 16l-4 4-4-4M12 12V2" />;
const DeliveryIcon = () => <Icon path="M13 17.5V13H6M20 8.5L12 13 4 8.5M12 13V2.5" />;
const MessageIcon = () => <Icon path="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />;
const UserIcon = () => <Icon path="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />;
const CustomerIcon = () => <Icon path="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />;

const DashboardPage = () => {
  const [data, setData] = useState({
    sales: [],
    products: [],
    shipments: [],
    deliveries: [],
    messages: [],
    users: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [animatedRevenue, setAnimatedRevenue] = useState(0);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const endpoints = {
          sales: 'http://localhost:3000/api/sales',
          products: 'http://localhost:3000/api/products',
          shipments: 'http://localhost:3000/api/shipments',
          deliveries: 'http://localhost:3000/api/deliveries',
          messages: 'http://localhost:3000/api/contact',
          users: 'http://localhost:3000/api/auth/users',
        };

        const requests = Object.values(endpoints).map(url => axios.get(url).catch(() => ({ data: [] })));
        const responses = await Promise.all(requests);
        const fetchedData = Object.keys(endpoints).reduce((acc, key, index) => {
          acc[key] = responses[index].data || [];
          return acc;
        }, {});

        setData(fetchedData);
        setError('');
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Animated revenue counter
  useEffect(() => {
    if (!data.sales || data.sales.length === 0) return;
    
    const totalAmount = data.sales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
    const duration = 2000;
    const steps = 60;
    const increment = totalAmount / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const easeOut = 1 - Math.pow(1 - (currentStep / steps), 3);
      setAnimatedRevenue(totalAmount * easeOut);

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedRevenue(totalAmount);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [data.sales]);

  const salesData = useMemo(() => {
    if (!data.sales || data.sales.length === 0) return { totalAmount: 0, pendingCount: 0 };
    const totalAmount = data.sales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
    const pendingCount = data.sales.filter(s => s.paymentStatus === 'Pending').length;
    return { totalAmount, pendingCount };
  }, [data.sales]);

  const productData = useMemo(() => {
    if (!data.products || data.products.length === 0) return { latestProduct: null, reorderCount: 0 };
    const sortedProducts = [...data.products].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    const latestProduct = sortedProducts[0];
    const reorderCount = data.products.filter(p => p.quantity <= 5).length;
    return { latestProduct, reorderCount };
  }, [data.products]);

  const shipmentData = useMemo(() => {
    if (!data.shipments || data.shipments.length === 0) return { latestShipment: null, inTransitCount: 0 };
    const sortedShipments = [...data.shipments].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    const latestShipment = sortedShipments[0];
    const inTransitCount = data.shipments.filter(s => s.status === 'in-transit').length;
    return { latestShipment, inTransitCount };
  }, [data.shipments]);

  const deliveryData = useMemo(() => {
    if (!data.deliveries || data.deliveries.length === 0) return { latestDelivery: null, cancelledCount: 0 };
    const sortedDeliveries = [...data.deliveries].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    const latestDelivery = sortedDeliveries[0];
    const cancelledCount = data.deliveries.filter(d => d.status === 'cancelled').length;
    return { latestDelivery, cancelledCount };
  }, [data.deliveries]);

  const messageData = useMemo(() => {
    if (!data.messages || data.messages.length === 0) return { latestMessage: null, otherCount: 0 };
    const sortedMessages = [...data.messages].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    const latestMessage = sortedMessages[0];
    const otherCount = data.messages.length > 0 ? data.messages.length - 1 : 0;
    return { latestMessage, otherCount };
  }, [data.messages]);
  
  const userData = useMemo(() => {
    if (!data.users || data.users.length === 0) return { newestUser: null };
    const sortedUsers = [...data.users].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return { newestUser: sortedUsers[0] };
  }, [data.users]);

  const customerData = useMemo(() => {
    if (!data.sales || data.sales.length === 0) return { topCustomer: null, newCustomerCount: 0 };
    
    const customerMap = new Map();
    data.sales.forEach(sale => {
      if (!sale.customerName) return;
      if (!customerMap.has(sale.customerName)) {
        customerMap.set(sale.customerName, { name: sale.customerName, totalSpent: 0, salesCount: 0 });
      }
      const cust = customerMap.get(sale.customerName);
      cust.totalSpent += sale.totalAmount || 0;
      cust.salesCount += 1;
    });

    const customers = Array.from(customerMap.values());
    const topCustomer = customers.sort((a, b) => b.totalSpent - a.totalSpent)[0];
    const newCustomerCount = customers.filter(c => c.salesCount === 1).length;
    return { topCustomer, newCustomerCount };
  }, [data.sales]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const styles = {
    container: {
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
      maxWidth: "1600px",
      margin: "0 auto",
    },
    header: { 
      textAlign: "center", 
      marginBottom: "50px",
      animation: "fadeInDown 0.8s ease-out"
    },
    title: { 
      color: "#023E8A", 
      fontSize: "3.5rem", 
      fontWeight: "800", 
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
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '25px',
    },
    card: {
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      borderRadius: '20px',
      padding: '35px',
      border: '1px solid rgba(226, 232, 240, 0.8)',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.06)',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
    },
    cardGlow: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "radial-gradient(circle at center, rgba(2, 62, 138, 0.05) 0%, transparent 70%)",
      opacity: 0,
      transition: "opacity 0.3s ease",
      pointerEvents: "none",
    },
    cardSales: {
      background: "linear-gradient(135deg, #023E8A 0%, #0353b8 100%)",
      color: '#ffffff',
      boxShadow: "0 10px 40px rgba(2, 62, 138, 0.3)",
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '20px',
    },
    cardTitle: {
      fontSize: '1.1rem',
      fontWeight: '700',
      margin: 0,
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    largeText: {
      fontSize: '3rem',
      fontWeight: '800',
      margin: '0 0 8px 0',
      lineHeight: "1",
      textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    cardInfo: {
      fontSize: '1rem',
      margin: '0 0 20px 0',
      opacity: 0.95,
      fontWeight: "500",
    },
    separator: {
      borderTop: '2px solid #e2e8f0',
      margin: '20px 0',
    },
    separatorLight: {
      borderTop: '2px solid rgba(255, 255, 255, 0.2)',
      margin: '20px 0',
    },
    statText: {
      fontSize: '1rem',
      color: '#475569',
      margin: '8px 0',
      fontWeight: "500",
    },
    statTextLight: {
      fontSize: '1rem',
      color: 'rgba(255, 255, 255, 0.95)',
      margin: '8px 0',
      fontWeight: "500",
    },
    statTextHighlight: {
      fontSize: '1.3rem',
      fontWeight: '700',
      color: '#023E8A',
      margin: '4px 0 12px 0',
    },
    highlightNumber: {
      fontSize: '1.6rem',
      fontWeight: '800',
      color: '#023E8A',
      marginRight: '8px',
    },
    subtleText: {
      fontSize: '0.875rem',
      color: '#64748b',
      margin: '0 0 4px 0',
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    subtleTextLight: {
      fontSize: '0.875rem',
      color: 'rgba(255, 255, 255, 0.8)',
      margin: '0 0 4px 0',
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    smallText: {
      fontSize: '0.875rem',
      color: '#94a3b8',
      margin: '4px 0 12px 0',
    },
    messageSnippet: {
      fontStyle: 'italic',
      color: '#64748b',
      margin: '8px 0',
      paddingLeft: '16px',
      borderLeft: '3px solid #cbd5e1',
      fontSize: "0.95rem",
    },
    alert: {
      backgroundColor: '#fef3c7',
      color: '#92400e',
      padding: '12px 16px',
      borderRadius: '12px',
      fontWeight: '600',
      margin: '8px 0',
      border: "2px solid #fbbf24",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    alertSuccess: {
      backgroundColor: '#d1fae5',
      color: '#065f46',
      border: "2px solid #6ee7b7",
    },
    cardLink: {
      marginTop: 'auto',
      paddingTop: '16px',
      color: '#023E8A',
      fontWeight: '700',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      fontSize: "0.95rem",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    cardLinkLight: {
      color: '#ffffff',
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
    },
    loadingSpinner: {
      width: '60px',
      height: '60px',
      border: '5px solid #e2e8f0',
      borderTop: '5px solid #023E8A',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    loadingText: {
      marginTop: '25px',
      fontSize: '1.2rem',
      color: '#64748b',
      fontWeight: '600',
    },
    errorContainer: {
      textAlign: 'center',
      padding: '60px 40px',
      background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
      color: '#991b1b',
      borderRadius: '20px',
      margin: '100px auto',
      maxWidth: '600px',
      boxShadow: "0 10px 40px rgba(220, 53, 69, 0.15)",
    },
    errorTitle: {
      margin: '0 0 16px 0',
      fontSize: "1.8rem",
      fontWeight: "700",
    },
    errorText: {
      margin: 0,
      color: '#dc2626',
      fontSize: "1.1rem",
    },
  };

  const styleSheet = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes fadeInDown {
      from { opacity: 0; transform: translateY(-30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }
    .dashboard-card {
      animation: fadeInUp 0.6s ease-out backwards;
    }
    .dashboard-card:hover {
      transform: translateY(-10px) scale(1.02);
      box-shadow: 0 20px 60px rgba(2, 62, 138, 0.12);
    }
    .dashboard-card:hover .card-glow {
      opacity: 1;
    }
    .dashboard-card svg {
      animation: float 3s ease-in-out infinite;
    }
    .card-link:hover {
      transform: translateX(8px);
      color: #0353b8;
    }
    .alert-icon {
      animation: pulse 2s infinite;
    }
  `;

  if (loading) {
    return (
      <div style={styles.container}>
        <style>{styleSheet}</style>
        <div style={styles.backgroundPattern}></div>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <p style={styles.loadingText}>Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <style>{styleSheet}</style>
        <div style={styles.backgroundPattern}></div>
        <div style={styles.errorContainer}>
          <h2 style={styles.errorTitle}>⚠️ Oops! Something went wrong.</h2>
          <p style={styles.errorText}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{styleSheet}</style>
      <div style={styles.backgroundPattern}></div>
      
      <div style={styles.content}>
        <header style={styles.header}>
          <h1 style={styles.title}>{getGreeting()}, Admin! 👋</h1>
          <p style={styles.subtitle}>Here's your business overview for today</p>
        </header>
        
        <main style={styles.grid}>
          {/* Sales Card */}
          <div className="dashboard-card" style={{...styles.card, ...styles.cardSales, animationDelay: "0s"}}>
            <div className="card-glow" style={styles.cardGlow}></div>
            <div style={styles.cardHeader}>
              <SalesIcon />
              <h3 style={styles.cardTitle}>Sales Overview</h3>
            </div>
            <p style={styles.largeText}>
              Rs. {animatedRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p style={styles.cardInfo}>Total Revenue Generated</p>
            <div style={styles.separatorLight}></div>
            <p style={styles.statTextLight}>
              <strong>{salesData.pendingCount}</strong> Pending Sales
            </p>
            <Link to="/sales/list" style={{...styles.cardLink, ...styles.cardLinkLight}} className="card-link">
              View All Sales →
            </Link>
          </div>

          {/* Product Card */}
          <div className="dashboard-card" style={{...styles.card, animationDelay: "0.1s"}}>
            <div className="card-glow" style={styles.cardGlow}></div>
            <div style={styles.cardHeader}>
              <ProductIcon />
              <h3 style={styles.cardTitle}>Product Status</h3>
            </div>
            {productData.reorderCount > 0 ? (
              <div style={styles.alert}>
                <span className="alert-icon">⚠️</span>
                <span><strong>{productData.reorderCount}</strong> product(s) need reordering!</span>
              </div>
            ) : (
              <div style={{...styles.alert, ...styles.alertSuccess}}>
                <span>✅</span>
                <span>All products are well-stocked</span>
              </div>
            )}
            <div style={styles.separator}></div>
            <p style={styles.subtleText}>Newly Added:</p>
            <p style={styles.statTextHighlight}>{productData.latestProduct?.productName || 'N/A'}</p>
            <Link to="/products/control" style={styles.cardLink} className="card-link">
              Manage Products →
            </Link>
          </div>
          
          {/* Customer Card */}
          <div className="dashboard-card" style={{...styles.card, animationDelay: "0.2s"}}>
            <div className="card-glow" style={styles.cardGlow}></div>
            <div style={styles.cardHeader}>
              <CustomerIcon />
              <h3 style={styles.cardTitle}>Customer Insights</h3>
            </div>
            <p style={styles.subtleText}>Top Customer:</p>
            <p style={styles.statTextHighlight}>{customerData.topCustomer?.name || 'N/A'}</p>
            <p style={styles.smallText}>
              Spent Rs. {customerData.topCustomer?.totalSpent.toLocaleString('en-US', { maximumFractionDigits: 0 }) || 0}
            </p>
            <div style={styles.separator}></div>
            <p style={styles.statText}>
              <strong>{customerData.newCustomerCount}</strong> New Customers
            </p>
            <Link to="/user/customers" style={styles.cardLink} className="card-link">
              View Customers →
            </Link>
          </div>
          
          {/* Shipment & Delivery Combined Card */}
          <div className="dashboard-card" style={{ ...styles.card, gridColumn: 'span 2', animationDelay: "0.3s" }}>
            <div className="card-glow" style={styles.cardGlow}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '30px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '250px', paddingRight: '20px', borderRight: '2px solid #e2e8f0' }}>
                <div style={styles.cardHeader}>
                  <ShipmentIcon />
                  <h3 style={styles.cardTitle}>Shipments</h3>
                </div>
                <p style={styles.statText}>
                  <strong style={styles.highlightNumber}>{shipmentData.inTransitCount}</strong> In Transit
                </p>
                <p style={styles.subtleText}>Latest Shipment ID:</p>
                <p style={styles.statTextHighlight}>{shipmentData.latestShipment?.shipmentId || 'N/A'}</p>
                <Link to="/shipments/control" style={styles.cardLink} className="card-link">
                  Track Shipments →
                </Link>
              </div>
              <div style={{ flex: 1, minWidth: '250px', paddingLeft: '20px' }}>
                <div style={styles.cardHeader}>
                  <DeliveryIcon />
                  <h3 style={styles.cardTitle}>Deliveries</h3>
                </div>
                <p style={styles.statText}>
                  <strong style={{...styles.highlightNumber, color: '#ef4444'}}>{deliveryData.cancelledCount}</strong> Cancelled
                </p>
                <p style={styles.subtleText}>Latest Delivery For:</p>
                <p style={styles.statTextHighlight}>{deliveryData.latestDelivery?.sale?.customerName || 'N/A'}</p>
                <Link to="/deliveries/list" style={styles.cardLink} className="card-link">
                  Manage Deliveries →
                </Link>
              </div>
            </div>
          </div>

          {/* Messages Card */}
          <div className="dashboard-card" style={{...styles.card, animationDelay: "0.4s"}}>
            <div className="card-glow" style={styles.cardGlow}></div>
            <div style={styles.cardHeader}>
              <MessageIcon />
              <h3 style={styles.cardTitle}>Inbox</h3>
            </div>
            <p style={styles.subtleText}>Latest Message From:</p>
            <p style={styles.statTextHighlight}>{messageData.latestMessage?.name || 'No messages'}</p>
            <p style={styles.messageSnippet}>
              "{messageData.latestMessage?.message?.substring(0, 50) || 'No new messages'}..."
            </p>
            <div style={styles.separator}></div>
            <p style={styles.statText}>
              + <strong>{messageData.otherCount}</strong> other message(s)
            </p>
            <Link to="/contact/contactview" style={styles.cardLink} className="card-link">
              Check Messages →
            </Link>
          </div>
          
          {/* Users Card */}
          <div className="dashboard-card" style={{...styles.card, animationDelay: "0.5s"}}>
            <div className="card-glow" style={styles.cardGlow}></div>
            <div style={styles.cardHeader}>
              <UserIcon />
              <h3 style={styles.cardTitle}>User Activity</h3>
            </div>
            <p style={styles.subtleText}>Newest User:</p>
            <p style={styles.statTextHighlight}>
              {userData.newestUser?.firstName || 'N/A'} {userData.newestUser?.lastName || ''}
            </p>
            <p style={styles.smallText}>
              Role: {userData.newestUser?.role?.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'N/A'}
            </p>
            <div style={styles.separator}></div>
            <p style={styles.statText}>
              Total Users: <strong>{data.users.length}</strong>
            </p>
            <Link to="/user/control" style={styles.cardLink} className="card-link">
              Manage Users →
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;