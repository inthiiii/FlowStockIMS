import React, { useEffect, useState } from "react";

const CustomerControlPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loyaltyFilter, setLoyaltyFilter] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editableDiscount, setEditableDiscount] = useState(0);

  // --- Script Loading ---
  useEffect(() => {
    const loadScripts = () => {
      const scripts = [
        { src: "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js", id: "jspdf" },
        { src: "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.23/jspdf.plugin.autotable.min.js", id: "jspdf-autotable" },
        { src: "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js", id: "xlsx" }
      ];

      let loadedCount = 0;
      const totalScripts = scripts.length;
      
      const checkAllScriptsLoaded = () => {
        if (loadedCount === totalScripts) {
          setScriptsLoaded(true);
          console.log("All external scripts loaded.");
        }
      };

      scripts.forEach(scriptData => {
        if (!document.getElementById(scriptData.id)) {
          const script = document.createElement("script");
          script.src = scriptData.src;
          script.id = scriptData.id;
          script.async = true;
          script.onload = () => {
            loadedCount++;
            checkAllScriptsLoaded();
          };
          script.onerror = () => console.error(`Failed to load script: ${scriptData.src}`);
          document.body.appendChild(script);
        } else {
          loadedCount++;
        }
      });
      
      checkAllScriptsLoaded();
    };
    loadScripts();
  }, []);
  
  // This function processes raw sales data into an aggregated customer list.
  const processSalesDataToCustomers = (sales) => {
    const customerMap = new Map();

    sales.forEach((sale) => {
      const enrichedSale = {
        ...sale,
        customerEmail: `${sale.customerName.toLowerCase().replace(/\s/g, ".")}@example.com`,
        customerPhone: `555-${Math.floor(1000 + Math.random() * 9000)}`,
        paymentMethod: ["cash", "card", "credit"][Math.floor(Math.random() * 3)],
      };

      if (!customerMap.has(enrichedSale.customerName)) {
        customerMap.set(enrichedSale.customerName, {
          name: enrichedSale.customerName,
          email: enrichedSale.customerEmail,
          phone: enrichedSale.customerPhone,
          totalSpent: 0,
          salesCount: 0,
          loyaltyPoints: 0,
          isCreditPaid: false,
          discount: 0,
          sales: [],
        });
      }

      const customerData = customerMap.get(enrichedSale.customerName);
      customerData.salesCount += 1;
      customerData.totalSpent += enrichedSale.totalAmount || 0;
      customerData.sales.push(enrichedSale);

      // --- ENHANCED POINT SYSTEM ---
      if (enrichedSale.paymentMethod === 'cash' || enrichedSale.paymentMethod === 'card') {
        const saleAmount = enrichedSale.totalAmount || 0;
        // Base points: 1 point for every 10 Rs
        let pointsEarned = Math.floor(saleAmount / 10);
        
        // Add bonus points for larger sales to reward high-value customers
        if (saleAmount > 10000) {
            pointsEarned += 500; // 500 bonus points for sales over 10,000
        } else if (saleAmount > 5000) {
            pointsEarned += 200; // 200 bonus points for sales over 5,000
        } else if (saleAmount > 1000) {
            pointsEarned += 50;  // 50 bonus points for sales over 1,000
        }
        
        customerData.loyaltyPoints += pointsEarned;
      }

      if (enrichedSale.paymentMethod === 'credit' && enrichedSale.paymentStatus === 'Paid') {
        customerData.isCreditPaid = true;
      }
    });

    const customerList = Array.from(customerMap.values()).map(customer => ({
      ...customer,
      loyaltyLevel: getLoyaltyLevel(customer.totalSpent),
    }));

    return customerList;
  };

  // Fetches live sales data from the API endpoint
  const fetchCustomers = () => {
    setLoading(true);
    fetch("http://localhost:3000/api/sales")
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((salesData) => {
        const processedCustomers = processSalesDataToCustomers(salesData);
        setCustomers(processedCustomers);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching sales data:", err);
        setLoading(false);
      });
  };
  
  useEffect(() => {
    fetchCustomers();
  }, []);

  const getLoyaltyLevel = (totalSpent) => {
    if (totalSpent > 1000) return "Gold";
    if (totalSpent > 500) return "Silver";
    if (totalSpent > 100) return "Bronze";
    return "N/A";
  };

  const getLoyaltyBadgeStyle = (level) => {
    switch (level) {
      case "Gold": return { text: "🥇 Gold", color: "#f59e0b" };
      case "Silver": return { text: "🥈 Silver", color: "#6b7280" };
      case "Bronze": return { text: "🥉 Bronze", color: "#a16207" };
      default: return { text: "N/A", color: "#64748b" };
    }
  };

  const handleOpenModal = (customer) => {
    setSelectedCustomer(customer);
    setEditableDiscount(customer.discount);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleSaveChanges = () => {
    setCustomers(customers.map(c =>
      c.name === selectedCustomer.name
        ? { ...c, discount: editableDiscount }
        : c
    ));
    console.log(`Updated ${selectedCustomer.name}'s discount to ${editableDiscount}%`);
    handleCloseModal();
  };

  const handleResetLoyalty = () => {
    if (window.confirm(`Are you sure you want to reset all loyalty benefits for ${selectedCustomer.name}? This will set their points and discount to 0.`)) {
      setCustomers(customers.map(c =>
        c.name === selectedCustomer.name
          ? { ...c, loyaltyPoints: 0, discount: 0 }
          : c
      ));
      console.log(`Reset loyalty for ${selectedCustomer.name}`);
      handleCloseModal();
    }
  };

  const filteredCustomers = customers.filter(customer => {
    if (loyaltyFilter && customer.loyaltyLevel !== loyaltyFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        customer.name.toLowerCase().includes(term) ||
        customer.email.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const loyaltyCounts = customers.reduce((acc, c) => {
    acc[c.loyaltyLevel] = (acc[c.loyaltyLevel] || 0) + 1;
    return acc;
  }, {});

  const exportToPDF = () => {
    if (!scriptsLoaded || !window.jspdf) {
        alert("PDF export library is not loaded yet. Please wait a moment and try again.");
        return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("Customer Loyalty Report", 14, 15);
    const tableColumn = ["Customer", "Email", "Total Spent (Rs.)", "Loyalty Tier", "Points", "Discount"];
    const tableRows = [];
    filteredCustomers.forEach(c => {
      const row = [c.name, c.email, c.totalSpent.toFixed(2), getLoyaltyBadgeStyle(c.loyaltyLevel).text, c.loyaltyPoints, `${c.discount}%`];
      tableRows.push(row);
    });
    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
    doc.save("customer_loyalty_report.pdf");
  };

  const exportToExcel = () => {
    if (!scriptsLoaded || !window.XLSX) {
        alert("Excel export library is not loaded yet. Please wait a moment and try again.");
        return;
    }
    const worksheet = window.XLSX.utils.json_to_sheet(
      filteredCustomers.map(c => ({
        Customer: c.name, Email: c.email, "Total Spent (Rs.)": c.totalSpent.toFixed(2), "Loyalty Tier": getLoyaltyBadgeStyle(c.loyaltyLevel).text, "Loyalty Points": c.loyaltyPoints, "Applicable Discount (%)": c.discount,
      }))
    );
    const workbook = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(workbook, worksheet, "Customer Loyalty");
    window.XLSX.writeFile(workbook, "customer_loyalty_report.xlsx");
  };

  const styles = {
    container: { maxWidth: "1600px", margin: "0 auto", padding: "50px 30px", background: "linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%)", minHeight: "100vh", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", },
    header: { textAlign: "center", marginBottom: "50px", animation: "fadeInDown 0.6s ease-out" },
    title: { color: "#023E8A", fontSize: "3rem", fontWeight: "700", margin: "0", marginBottom: "12px", letterSpacing: "-1px", textShadow: "0 2px 4px rgba(2, 62, 138, 0.1)" },
    subtitle: { color: "#64748b", fontSize: "1.15rem", margin: "0", fontWeight: "400", letterSpacing: "0.3px" },
    filtersContainer: { backgroundColor: "#ffffff", padding: "35px", borderRadius: "20px", marginBottom: "35px", border: "1px solid rgba(226, 232, 240, 0.8)", boxShadow: "0 10px 40px rgba(0, 0, 0, 0.06)", animation: "fadeInUp 0.7s ease-out" },
    filtersRow: { display: "flex", gap: "25px", flexWrap: "wrap", alignItems: "flex-end", marginBottom: "25px" },
    filterGroup: { display: "flex", flexDirection: "column", gap: "8px", flex: "1", minWidth: "200px" },
    filterLabel: { fontSize: "0.875rem", fontWeight: "600", color: "#1e293b", letterSpacing: "0.3px", display: "flex", alignItems: "center", gap: "6px" },
    input: { padding: "14px 18px", border: "2px solid #e2e8f0", borderRadius: "10px", fontSize: "1rem", fontFamily: "inherit", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", backgroundColor: "#ffffff", outline: "none", boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)" },
    select: { padding: "14px 40px 14px 18px", border: "2px solid #e2e8f0", borderRadius: "10px", fontSize: "1rem", fontFamily: "inherit", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", backgroundColor: "#ffffff", outline: "none", cursor: "pointer", boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)", appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23023E8A' d='M6 9L1 4h10z'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center" },
    statsContainer: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "30px" },
    statCard: { background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)", padding: "25px", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)", transition: "all 0.3s ease", animation: "scaleIn 0.5s ease-out" },
    statLabel: { fontSize: "0.875rem", color: "#64748b", fontWeight: "500", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" },
    statValue: { fontSize: "2rem", color: "#023E8A", fontWeight: "700", lineHeight: "1.2" },
    statIcon: { fontSize: "2rem", marginBottom: "10px", display: "block" },
    exportButtons: { display: "flex", gap: "15px", marginBottom: "30px", flexWrap: "wrap" },
    exportBtn: { background: "linear-gradient(135deg, #023E8A 0%, #0353b8 100%)", color: "#fff", padding: "12px 24px", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600", fontSize: "0.95rem", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", boxShadow: "0 4px 12px rgba(2, 62, 138, 0.3)", display: "inline-flex", alignItems: "center", gap: "8px" },
    exportBtnDisabled: { background: "#94a3b8", cursor: "not-allowed", boxShadow: "none", transform: "none" },
    tableContainer: { backgroundColor: "#ffffff", borderRadius: "20px", boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)", overflow: "hidden", border: "1px solid #e2e8f0", animation: "fadeInUp 0.8s ease-out" },
    table: { width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" },
    th: { padding: "20px 18px", textAlign: "left", fontWeight: "600", letterSpacing: "0.5px", fontSize: "0.85rem", background: "linear-gradient(135deg, #023E8A 0%, #0353b8 100%)", color: "#ffffff", textTransform: "uppercase" },
    td: { padding: "18px", verticalAlign: "middle", color: "#334155", borderBottom: "1px solid #f1f5f9", transition: "background-color 0.2s ease" },
    loyaltyBadge: { padding: "6px 14px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "600", letterSpacing: "0.5px", color: "#ffffff", display: "inline-block", textTransform: "uppercase", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" },
    actionButton: { padding: "8px 16px", borderRadius: "8px", border: "none", fontWeight: "600", fontSize: "0.875rem", cursor: "pointer", transition: "all 0.3s ease", textDecoration: "none", display: "inline-block", backgroundColor: "#023E8A", color: "#ffffff" },
    noResults: { textAlign: "center", padding: "60px 20px", color: "#64748b", fontSize: "1.1rem", fontStyle: "italic" },
    loadingContainer: { textAlign: "center", padding: "80px 20px", animation: "pulse 2s ease-in-out infinite" },
    loadingSpinner: { fontSize: "3rem", marginBottom: "20px", display: "block" },
    loadingText: { color: "#64748b", fontSize: "1.2rem", fontWeight: "500" },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10, 20, 40, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' },
    modalContent: { background: 'white', padding: '40px', borderRadius: '20px', width: '90%', maxWidth: '500px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', animation: 'scaleIn 0.3s ease-out' },
    modalTitle: { color: '#023E8A', margin: '0 0 8px', fontSize: '1.8rem' },
    modalSubtitle: { margin: '0 0 24px', color: '#64748b' },
    modalField: { marginBottom: '20px' },
    modalLabel: { display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b' },
    modalSelect: { width: '100%', padding: "14px 18px", border: "2px solid #e2e8f0", borderRadius: "10px", fontSize: "1rem", outline: 'none' },
    modalHelpText: { fontSize: '0.85rem', color: '#64748b', marginTop: '8px', fontStyle: 'italic' },
    modalActions: { display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '30px' },
    modalSaveButton: { flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease', fontSize: '1rem' },
    modalDeleteButton: { flex: 1, padding: '14px', borderRadius: '10px', border: 'none', backgroundColor: '#ef4444', color: 'white', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease', fontSize: '1rem' },
    modalCancelButton: { flex: 1, padding: '14px', borderRadius: '10px', border: 'none', backgroundColor: '#e2e8f0', color: '#1e293b', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease', fontSize: '1rem' },
  };

  const styleSheet = `@keyframes fadeInDown{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes scaleIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}input:focus,select:focus{border-color:#023E8A!important;box-shadow:0 0 0 3px rgba(2,62,138,.1),0 2px 4px rgba(0,0,0,.05)!important}button:hover:not(:disabled),a[href]:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(2,62,138,.4)}button:active:not(:disabled),a[href]:active{transform:translateY(0)}tr:hover td{background-color:#f8fafc}input::placeholder{color:#94a3b8}`;
  
  if (loading) {
    return (<div style={styles.container}><style>{styleSheet}</style><div style={styles.loadingContainer}><span style={styles.loadingSpinner}>⏳</span><div style={styles.loadingText}>Fetching customer data...</div></div></div>);
  }

  return (
    <div style={styles.container}>
      <style>{styleSheet}</style>
      <div style={styles.header}><h1 style={styles.title}>Customer Loyalty Management</h1><p style={styles.subtitle}>Track and reward your most valuable customers</p></div>
      <div style={styles.filtersContainer}><div style={{...styles.filtersRow, marginBottom: '0'}}><div style={styles.filterGroup}><label style={styles.filterLabel}><span>🔍</span> Search Customer</label><input type="text" placeholder="Search by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={styles.input}/></div><div style={styles.filterGroup}><label style={styles.filterLabel}><span>🏅</span> Loyalty Tier</label><select value={loyaltyFilter} onChange={(e) => setLoyaltyFilter(e.target.value)} style={styles.select}><option value="">All Tiers</option><option value="Gold">Gold</option><option value="Silver">Silver</option><option value="Bronze">Bronze</option><option value="N/A">N/A</option></select></div></div></div>
      <div style={styles.statsContainer}><div style={styles.statCard}><span style={styles.statIcon}>👥</span><div style={styles.statLabel}>Total Customers</div><div style={styles.statValue}>{customers.length}</div></div><div style={styles.statCard}><span style={styles.statIcon}>🥇</span><div style={styles.statLabel}>Gold Members</div><div style={styles.statValue}>{loyaltyCounts.Gold || 0}</div></div><div style={styles.statCard}><span style={styles.statIcon}>🥈</span><div style={styles.statLabel}>Silver Members</div><div style={styles.statValue}>{loyaltyCounts.Silver || 0}</div></div><div style={styles.statCard}><span style={styles.statIcon}>🥉</span><div style={styles.statLabel}>Bronze Members</div><div style={styles.statValue}>{loyaltyCounts.Bronze || 0}</div></div></div>
      <div style={styles.exportButtons}><button onClick={exportToPDF} style={{...styles.exportBtn, ...(!scriptsLoaded && styles.exportBtnDisabled)}} disabled={!scriptsLoaded}><span>📄</span> Export PDF</button><button onClick={exportToExcel} style={{...styles.exportBtn, ...(!scriptsLoaded && styles.exportBtnDisabled)}} disabled={!scriptsLoaded}><span>📊</span> Export Excel</button></div>
      <div style={styles.tableContainer}><table style={styles.table}><thead><tr><th style={styles.th}>Customer</th><th style={styles.th}>Total Spent</th><th style={styles.th}>Loyalty Tier</th><th style={styles.th}>Points</th><th style={styles.th}>Discount</th><th style={styles.th}>Actions</th></tr></thead><tbody>
        {filteredCustomers.length > 0 ? (filteredCustomers.map((customer) => {const badge = getLoyaltyBadgeStyle(customer.loyaltyLevel);return (<tr key={customer.name}><td style={styles.td}><div style={{ fontWeight: 'bold' }}>{customer.name}</div><div style={{ fontSize: '0.85rem', color: '#64748b' }}>{customer.email}</div></td><td style={styles.td}><strong>Rs.{customer.totalSpent.toFixed(2)}</strong></td><td style={styles.td}><span style={{ ...styles.loyaltyBadge, backgroundColor: badge.color }}>{badge.text}</span></td><td style={styles.td}>{customer.loyaltyPoints}</td><td style={styles.td}><span style={{...styles.loyaltyBadge, backgroundColor: customer.discount > 0 ? '#10b981' : '#64748b'}}>{customer.discount}%</span></td><td style={styles.td}><button onClick={() => handleOpenModal(customer)} style={styles.actionButton}>⚙️ Manage</button></td></tr>);})) : (<tr><td colSpan="6" style={styles.noResults}>No customers found matching your criteria.</td></tr>)}
      </tbody></table></div>
      {isModalOpen && selectedCustomer && (
        <div style={styles.modalOverlay}><div style={styles.modalContent}><h2 style={styles.modalTitle}>Manage {selectedCustomer.name}</h2><p style={styles.modalSubtitle}>Update loyalty benefits for this customer.</p>
        <div style={styles.modalField}>
            <label style={styles.modalLabel}>Assign Future Sale Discount (%)</label>
            <select value={editableDiscount} onChange={(e) => setEditableDiscount(Number(e.target.value))} style={styles.modalSelect}>
                <option value={0}>0% (None)</option>
                <option value={10}>10%</option>
                <option value={20}>20%</option>
                <option value={30}>30%</option>
                <option value={50}>50%</option>
            </select>
            <p style={styles.modalHelpText}>This discount will be available for the customer's future purchases.</p>
        </div>
        <div style={styles.modalActions}><button onClick={handleSaveChanges} style={styles.modalSaveButton}>Save Changes</button><button onClick={handleResetLoyalty} style={styles.modalDeleteButton}>Reset Loyalty</button><button onClick={handleCloseModal} style={styles.modalCancelButton}>Cancel</button></div></div></div>
      )}
    </div>
  );
};

export default CustomerControlPage;

