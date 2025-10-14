import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// --- Reusable Icon Components for a clean look ---
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


// --- Main Dashboard Component ---
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

        const requests = Object.values(endpoints).map(url => axios.get(url));
        const responses = await Promise.all(requests);
        const fetchedData = Object.keys(endpoints).reduce((acc, key, index) => {
          acc[key] = responses[index].data;
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

  // --- Memoized Data Processing for Performance ---

  const salesData = useMemo(() => {
    if (!data.sales || data.sales.length === 0) return { totalAmount: 0, pendingCount: 0 };
    const totalAmount = data.sales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
    const pendingCount = data.sales.filter(s => s.paymentStatus === 'Pending').length;
    return { totalAmount, pendingCount };
  }, [data.sales]);

  const productData = useMemo(() => {
    if (!data.products || data.products.length === 0) return { latestProduct: null, reorderCount: 0 };
    const sortedProducts = [...data.products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const latestProduct = sortedProducts[0];
    const reorderCount = data.products.filter(p => p.quantity <= 5).length;
    return { latestProduct, reorderCount };
  }, [data.products]);

  const shipmentData = useMemo(() => {
    if (!data.shipments || data.shipments.length === 0) return { latestShipment: null, inTransitCount: 0 };
    const sortedShipments = [...data.shipments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const latestShipment = sortedShipments[0];
    const inTransitCount = data.shipments.filter(s => s.status === 'in-transit').length;
    return { latestShipment, inTransitCount };
  }, [data.shipments]);

  const deliveryData = useMemo(() => {
    if (!data.deliveries || data.deliveries.length === 0) return { latestDelivery: null, cancelledCount: 0 };
    const sortedDeliveries = [...data.deliveries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const latestDelivery = sortedDeliveries[0];
    const cancelledCount = data.deliveries.filter(d => d.status === 'cancelled').length;
    return { latestDelivery, cancelledCount };
  }, [data.deliveries]);

  const messageData = useMemo(() => {
    if (!data.messages || data.messages.length === 0) return { latestMessage: null, otherCount: 0 };
    const sortedMessages = [...data.messages].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const latestMessage = sortedMessages[0];
    const otherCount = data.messages.length > 0 ? data.messages.length - 1 : 0;
    return { latestMessage, otherCount };
  }, [data.messages]);
  
  const userData = useMemo(() => {
      if (!data.users || data.users.length === 0) return { newestUser: null };
      const sortedUsers = [...data.users].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0) || b._id.localeCompare(a._id));
      return { newestUser: sortedUsers[0] };
  }, [data.users]);

  const customerData = useMemo(() => {
    if (!data.sales || data.sales.length === 0) return { topCustomer: null, newCustomerCount: 0 };
    
    const customerMap = new Map();
    data.sales.forEach(sale => {
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

  if (loading) {
    return (
      <div style={styles.container}>
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
        <div style={styles.errorContainer}>
            <h2 style={styles.errorTitle}>Oops! Something went wrong.</h2>
            <p style={styles.errorText}>{error}</p>
        </div>
      </div>
    );
  }
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };
  
  const cardAnimation = (delay) => ({
    animation: `fadeInUp 0.6s ${delay}s ease-out backwards`
  });


  return (
    <div style={styles.container}>
      <style>{styleSheet}</style> {/* Injecting keyframes and global styles */}
      
      <header style={styles.header}>
        <h1 style={styles.title}>{getGreeting()}, Admin!</h1>
        <p style={styles.subtitle}>Here's your business overview for today.</p>
      </header>
      
      <main style={styles.grid}>
        {/* Sales Card */}
        <div style={{...styles.card, ...styles.cardSales, ...cardAnimation(0)}}>
          <div style={styles.cardHeader}>
            <SalesIcon /> <h3 style={styles.cardTitle}>Sales Overview</h3>
          </div>
          <p style={styles.largeText}>Rs. {salesData.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p style={styles.cardInfo}>Total Revenue Generated</p>
          <div style={styles.separator}></div>
          <p style={styles.statText}>
            <strong>{salesData.pendingCount}</strong> Pending Sales
          </p>
          <Link to="/sales/list" style={styles.cardLink}>View All Sales →</Link>
        </div>

        {/* Product Card */}
        <div style={{...styles.card, ...cardAnimation(0.1)}}>
          <div style={styles.cardHeader}>
            <ProductIcon /> <h3 style={styles.cardTitle}>Product Status</h3>
          </div>
           {productData.reorderCount > 0 ? (
            <div style={styles.alert}>
              ⚠️ <strong>{productData.reorderCount}</strong> product(s) need reordering!
            </div>
          ) : (
            <div style={{...styles.alert, ...styles.alertSuccess}}>
              ✅ All products are well-stocked.
            </div>
          )}
          <div style={styles.separator}></div>
          <p style={styles.subtleText}>Newly Added:</p>
          <p style={styles.statTextHighlight}>{productData.latestProduct?.productName || 'N/A'}</p>
          <Link to="/products/control" style={styles.cardLink}>Manage Products →</Link>
        </div>
        
        {/* Customer Card */}
        <div style={{...styles.card, ...cardAnimation(0.2)}}>
            <div style={styles.cardHeader}>
                <CustomerIcon /> <h3 style={styles.cardTitle}>Customer Insights</h3>
            </div>
            <p style={styles.subtleText}>Top Customer:</p>
            <p style={styles.statTextHighlight}>{customerData.topCustomer?.name || 'N/A'}</p>
            <p style={styles.smallText}>
                (Spent Rs. {customerData.topCustomer?.totalSpent.toLocaleString('en-US', { maximumFractionDigits: 0 }) || 0})
            </p>
            <div style={styles.separator}></div>
            <p style={styles.statText}>
                <strong>{customerData.newCustomerCount}</strong> New Customers
            </p>
            <Link to="/user/customers" style={styles.cardLink}>View Customers →</Link>
        </div>
        
        {/* Shipment & Delivery Combined Card */}
        <div style={{ ...styles.card, gridColumn: 'span 2', ...cardAnimation(0.3) }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                <div style={{ flex: 1, paddingRight: '20px', borderRight: '1px solid #e2e8f0' }}>
                    <div style={styles.cardHeader}>
                        <ShipmentIcon /> <h3 style={styles.cardTitle}>Shipments</h3>
                    </div>
                    <p style={styles.statText}>
                        <strong style={styles.highlightNumber}>{shipmentData.inTransitCount}</strong> Shipments In Transit
                    </p>
                    <p style={styles.subtleText}>Latest Shipment ID:</p>
                    <p style={styles.statTextHighlight}>{shipmentData.latestShipment?.shipmentId || 'N/A'}</p>
                    <Link to="/shipments/control" style={styles.cardLink}>Track Shipments →</Link>
                </div>
                <div style={{ flex: 1, paddingLeft: '20px' }}>
                    <div style={styles.cardHeader}>
                        <DeliveryIcon /> <h3 style={styles.cardTitle}>Deliveries</h3>
                    </div>
                    <p style={styles.statText}>
                        <strong style={{...styles.highlightNumber, color: '#dc3545'}}>{deliveryData.cancelledCount}</strong> Cancelled Deliveries
                    </p>
                    <p style={styles.subtleText}>Latest Delivery For:</p>
                    <p style={styles.statTextHighlight}>{deliveryData.latestDelivery?.sale?.customerName || 'N/A'}</p>
                    <Link to="/deliveries/list" style={styles.cardLink}>Manage Deliveries →</Link>
                </div>
            </div>
        </div>

        {/* Messages Card */}
        <div style={{...styles.card, ...cardAnimation(0.4)}}>
            <div style={styles.cardHeader}>
                <MessageIcon /> <h3 style={styles.cardTitle}>Inbox</h3>
            </div>
            <p style={styles.subtleText}>Latest Message From:</p>
            <p style={styles.statTextHighlight}>{messageData.latestMessage?.name || 'N/A'}</p>
            <p style={styles.messageSnippet}>"{messageData.latestMessage?.message.substring(0, 40) || 'No new messages'}..."</p>
            <div style={styles.separator}></div>
            <p style={styles.statText}>+ <strong>{messageData.otherCount}</strong> other message(s)</p>
            <Link to="/contact/contactview" style={styles.cardLink}>Check Messages →</Link>
        </div>
        
        {/* Users Card */}
        <div style={{...styles.card, ...cardAnimation(0.5)}}>
            <div style={styles.cardHeader}>
                <UserIcon /> <h3 style={styles.cardTitle}>User Activity</h3>
            </div>
            <p style={styles.subtleText}>Newest User:</p>
            <p style={styles.statTextHighlight}>{userData.newestUser?.firstName || 'N/A'} {userData.newestUser?.lastName || ''}</p>
             <p style={styles.smallText}>Role: {userData.newestUser?.role?.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'N/A'}</p>
            <div style={styles.separator}></div>
            <p style={styles.statText}>Total Users: <strong>{data.users.length}</strong></p>
            <Link to="/user/control" style={styles.cardLink}>Manage Users →</Link>
        </div>
      </main>
    </div>
  );
};

// --- STYLES ---

const styles = {
  container: {
    padding: "50px 30px",
    background: "linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%)",
    minHeight: "100vh",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  header: { 
    textAlign: "center", 
    marginBottom: "50px",
    animation: "fadeInDown 0.6s ease-out"
  },
  title: { 
    color: "#023E8A", 
    fontSize: "3rem", 
    fontWeight: "700", 
    marginBottom: "12px",
    letterSpacing: "-1px",
  },
  subtitle: { 
    color: "#64748b", 
    fontSize: "1.15rem", 
    margin: "0", 
    fontWeight: "400",
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2rem',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '2rem',
    border: '1px solid #e2e8f0',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.06)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
  },
  cardSales: {
    background: "linear-gradient(135deg, #023E8A 0%, #0353b8 100%)",
    color: '#ffffff',
    boxShadow: "0 10px 40px rgba(2, 62, 138, 0.3)",
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.25rem',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  largeText: {
    fontSize: '2.8rem',
    fontWeight: '700',
    margin: '0 0 0.5rem 0',
  },
  cardInfo: {
    fontSize: '1rem',
    margin: '0 0 1.5rem 0',
    opacity: 0.8,
  },
  separator: {
    borderTop: '1px solid #e2e8f0',
    margin: '1.25rem 0',
  },
  statText: {
    fontSize: '1rem',
    color: '#475569',
    margin: '0.25rem 0',
  },
  statTextHighlight: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#023E8A',
    margin: '0.25rem 0 1rem 0',
  },
  highlightNumber: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#023E8A',
    marginRight: '8px',
  },
  subtleText: {
    fontSize: '0.875rem',
    color: '#64748b',
    margin: '0 0 0.25rem 0',
    fontWeight: 500
  },
  smallText: {
    fontSize: '0.875rem',
    color: '#94a3b8',
    margin: '0.25rem 0 1rem 0',
  },
  messageSnippet: {
    fontStyle: 'italic',
    color: '#64748b',
    margin: '0.5rem 0',
    paddingLeft: '1rem',
    borderLeft: '3px solid #cbd5e1',
  },
  alert: {
    backgroundColor: '#fffbeb',
    color: '#b45309',
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    fontWeight: '500',
    margin: '0.5rem 0',
  },
  alertSuccess: {
    backgroundColor: '#f0fdf4',
    color: '#15803d',
  },
  cardLink: {
    marginTop: 'auto',
    paddingTop: '1rem',
    color: '#023E8A',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'transform 0.2s',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
    animation: "pulse 2s ease-in-out infinite"
  },
  loadingSpinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #e2e8f0',
    borderTop: '5px solid #023E8A',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '1.5rem',
    fontSize: '1.2rem',
    color: '#64748b',
    fontWeight: '500',
  },
  errorContainer: {
    textAlign: 'center',
    padding: '4rem',
    backgroundColor: '#fff1f2',
    color: '#be123c',
    borderRadius: '20px',
    margin: '5rem auto',
    maxWidth: '600px',
  },
  errorTitle: {
      margin: '0 0 1rem 0',
  },
  errorText: {
      margin: 0,
      color: '#dc2626'
  }
};

const styleSheet = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
  }
  .card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
  }
  .card-sales {
      color: #ffffff !important;
  }
  .card-sales h3, .card-sales p, .card-sales strong {
    color: inherit !important;
  }
  .card-sales .separator {
    border-top-color: rgba(255, 255, 255, 0.2);
  }
  .card-sales a {
    color: #ffffff !important;
  }
  .card-sales a:hover {
      transform: translateX(4px);
  }
  a.cardLink:hover {
      transform: translateX(4px);
  }
`;
document.head.appendChild(new DOMParser().parseFromString(`<style>${styleSheet}</style>`, "text/html").head.firstChild);

export default DashboardPage;