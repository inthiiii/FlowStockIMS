import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const NavigationBar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleSidebar = () => setIsOpen(!isOpen);

  const toggleSubmenu = (menu) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      navigate("/login");
      setIsOpen(false);
    }
  };

  const handleNavClick = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const styles = {
    // Floating Menu Button (when sidebar is closed)
    floatingMenuBtn: {
      position: "fixed",
      top: "20px",
      left: "20px",
      background: "linear-gradient(135deg, #023E8A 0%, #0056b3 100%)",
      color: "white",
      border: "none",
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      cursor: "pointer",
      fontSize: "20px",
      transition: "all 0.3s ease",
      display: isOpen ? "none" : "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1001,
      boxShadow: "0 4px 12px rgba(2, 62, 138, 0.4)",
    },
    floatingMenuBtnHover: {
      transform: "scale(1.1)",
      boxShadow: "0 6px 20px rgba(2, 62, 138, 0.5)",
    },

    // Overlay when sidebar is open
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 998,
      opacity: isOpen ? 1 : 0,
      visibility: isOpen ? "visible" : "hidden",
      transition: "all 0.3s ease",
      backdropFilter: "blur(2px)",
    },

    // Sidebar
    sidebar: {
      width: "280px",
      height: "100vh",
      background: "#ffffff",
      color: "#333",
      padding: "0",
      position: "fixed",
      top: 0,
      left: isOpen ? 0 : "-280px",
      display: "flex",
      flexDirection: "column",
      boxShadow: "4px 0 20px rgba(0, 0, 0, 0.2)",
      transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      zIndex: 999,
      overflowY: "auto",
    },
    sidebarHeader: {
      background: "linear-gradient(135deg, #023E8A 0%, #0056b3 100%)",
      color: "#ffffff",
      padding: "25px 20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    },
    sidebarTitle: {
      fontSize: "1.5rem",
      fontWeight: "700",
      margin: 0,
    },
    closeBtn: {
      background: "rgba(255, 255, 255, 0.2)",
      color: "#ffffff",
      border: "none",
      width: "35px",
      height: "35px",
      borderRadius: "50%",
      cursor: "pointer",
      fontSize: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.3s ease",
    },
    closeBtnHover: {
      background: "rgba(255, 255, 255, 0.3)",
      transform: "rotate(90deg)",
    },
    menuSection: {
      padding: "20px 0",
      flex: 1,
    },
    menuItem: {
      padding: "14px 20px",
      color: "#333",
      cursor: "pointer",
      margin: "4px 12px",
      borderRadius: "10px",
      userSelect: "none",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      fontWeight: "500",
      fontSize: "15px",
    },
    menuItemHover: {
      background: "#f8f9fa",
      color: "#023E8A",
      transform: "translateX(5px)",
    },
    menuItemActive: {
      background: "#e7f3ff",
      color: "#023E8A",
      fontWeight: "600",
    },
    menuIcon: {
      fontSize: "18px",
      marginRight: "12px",
    },
    arrow: {
      fontSize: "12px",
      transition: "transform 0.3s ease",
    },
    arrowExpanded: {
      transform: "rotate(180deg)",
    },
    submenu: {
      maxHeight: 0,
      overflow: "hidden",
      transition: "max-height 0.3s ease",
      marginLeft: "12px",
    },
    submenuExpanded: {
      maxHeight: "500px",
    },
    submenuItem: {
      padding: "12px 20px 12px 45px",
      color: "#666",
      cursor: "pointer",
      margin: "2px 12px",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "500",
      transition: "all 0.2s ease",
      position: "relative",
    },
    submenuItemHover: {
      background: "#f8f9fa",
      color: "#023E8A",
      paddingLeft: "50px",
    },
    submenuItemBefore: {
      position: "absolute",
      left: "30px",
      top: "50%",
      transform: "translateY(-50%)",
      width: "6px",
      height: "6px",
      borderRadius: "50%",
      background: "#023E8A",
    },
    logoutSection: {
      padding: "20px",
      borderTop: "1px solid #e9ecef",
    },
    logoutBtn: {
      width: "100%",
      padding: "14px",
      background: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
      color: "#ffffff",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "15px",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    },
    logoutBtnHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(220, 53, 69, 0.4)",
    },
  };

  const MenuItem = ({ icon, label, onClick, hasSubmenu, isExpanded }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        style={{
          ...styles.menuItem,
          ...(isHovered && styles.menuItemHover)
        }}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={styles.menuIcon}>{icon}</span>
          <span>{label}</span>
        </div>
        {hasSubmenu && (
          <span style={{
            ...styles.arrow,
            ...(isExpanded && styles.arrowExpanded)
          }}>
            ▼
          </span>
        )}
      </div>
    );
  };

  const SubMenuItem = ({ label, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        style={{
          ...styles.submenuItem,
          ...(isHovered && styles.submenuItemHover)
        }}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isHovered && <span style={styles.submenuItemBefore}></span>}
        {label}
      </div>
    );
  };

  return (
    <>
      {/* Floating Menu Button (when closed) */}
      <button
        onClick={toggleSidebar}
        style={styles.floatingMenuBtn}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = styles.floatingMenuBtnHover.transform;
          e.currentTarget.style.boxShadow = styles.floatingMenuBtnHover.boxShadow;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "none";
          e.currentTarget.style.boxShadow = styles.floatingMenuBtn.boxShadow;
        }}
      >
        ☰
      </button>

      {/* Overlay */}
      <div style={styles.overlay} onClick={toggleSidebar}></div>

      {/* Sidebar */}
      <div style={styles.sidebar}>
        {/* Sidebar Header */}
        <div style={styles.sidebarHeader}>
          <h2 style={styles.sidebarTitle}>Admin Panel</h2>
          <button
            onClick={toggleSidebar}
            style={styles.closeBtn}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = styles.closeBtnHover.background;
              e.currentTarget.style.transform = styles.closeBtnHover.transform;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = styles.closeBtn.background;
              e.currentTarget.style.transform = "none";
            }}
          >
            ✕
          </button>
        </div>

        {/* Menu Section */}
        <div style={styles.menuSection}>
          {/* Dashboard */}
          <MenuItem
            icon="📊"
            label="Dashboard"
            onClick={() => handleNavClick("/dashboard")}
          />

          {/* Messages */}
          <MenuItem
            icon="💬"
            label="Messages"
            onClick={() => handleNavClick("/contact/contactview")}
          />

          {/* Products */}
          <MenuItem
            icon="📦"
            label="Products"
            hasSubmenu
            isExpanded={expandedMenus.products}
            onClick={() => toggleSubmenu('products')}
          />
          <div style={{
            ...styles.submenu,
            ...(expandedMenus.products && styles.submenuExpanded)
          }}>
            <SubMenuItem
              label="Product Entry"
              onClick={() => handleNavClick("/products/entry")}
            />
            <SubMenuItem
              label="Product Control"
              onClick={() => handleNavClick("/products/control")}
            />
            <SubMenuItem
              label="Favorites"
              onClick={() => handleNavClick("/products/favorites")}
            />
            <SubMenuItem
              label="Product List"
              onClick={() => handleNavClick("/products/list")}
            />
          </div>

          {/* Sales */}
          <MenuItem
            icon="💰"
            label="Sales"
            hasSubmenu
            isExpanded={expandedMenus.sales}
            onClick={() => toggleSubmenu('sales')}
          />
          <div style={{
            ...styles.submenu,
            ...(expandedMenus.sales && styles.submenuExpanded)
          }}>
            <SubMenuItem
              label="Sales List"
              onClick={() => handleNavClick("/sales/list")}
            />
            <SubMenuItem
              label="Sales Dashboard"
              onClick={() => handleNavClick("/sales/dashboard")}
            />
            <SubMenuItem
              label="Sales Entry"
              onClick={() => handleNavClick("/sales/add")}
            />
          </div>

          {/* Shipments */}
          <MenuItem
            icon="🚢"
            label="Shipments"
            hasSubmenu
            isExpanded={expandedMenus.shipments}
            onClick={() => toggleSubmenu('shipments')}
          />
          <div style={{
            ...styles.submenu,
            ...(expandedMenus.shipments && styles.submenuExpanded)
          }}>
            <SubMenuItem
              label="Shipment Control"
              onClick={() => handleNavClick("/shipments/control")}
            />
            <SubMenuItem
              label="Create Shipment"
              onClick={() => handleNavClick("/shipments/create")}
            />
          </div>

          {/* Deliveries */}
          <MenuItem
            icon="🚚"
            label="Deliveries"
            hasSubmenu
            isExpanded={expandedMenus.deliveries}
            onClick={() => toggleSubmenu('deliveries')}
          />
          <div style={{
            ...styles.submenu,
            ...(expandedMenus.deliveries && styles.submenuExpanded)
          }}>
            <SubMenuItem
              label="Delivery List"
              onClick={() => handleNavClick("/deliveries/list")}
            />
            <SubMenuItem
              label="Create Delivery"
              onClick={() => handleNavClick("/deliveries/create")}
            />
          </div>

          {/* Internal Users */}
          <MenuItem
            icon="👥"
            label="Internal Users"
            
            onClick={() => handleNavClick("/admin/internal-users/add")}
          />
          
            
          

          {/* User Dashboard */}
          <MenuItem
            icon="🧑"
            label="Users"
            hasSubmenu
            isExpanded={expandedMenus.userDashboard}
            onClick={() => toggleSubmenu('userDashboard')}
          />
          <div style={{
            ...styles.submenu,
            ...(expandedMenus.userDashboard && styles.submenuExpanded)
          }}>
            
            <SubMenuItem
              label="User Control"
              onClick={() => handleNavClick("/user/control")}
            />
            <SubMenuItem
              label="Customer Control"
              onClick={() => handleNavClick("/user/customers")}
            />
          </div>

          {/* Attendance */}
          <MenuItem
            icon="🗓️"
            label="Attendance"
            onClick={() => handleNavClick("/admin/attendance")}
          />

          {/* Settings */}
          <MenuItem
            icon="⚙️"
            label="Settings"
            hasSubmenu
            isExpanded={expandedMenus.settings}
            onClick={() => toggleSubmenu('settings')}
          />
          <div style={{
            ...styles.submenu,
            ...(expandedMenus.settings && styles.submenuExpanded)
          }}>
            <SubMenuItem
              label="Change Credentials"
              onClick={() => handleNavClick("/settings/credentials")}
            />
          </div>
        </div>

        {/* Logout Section */}
        <div style={styles.logoutSection}>
          <button
            onClick={handleLogout}
            style={styles.logoutBtn}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = styles.logoutBtnHover.transform;
              e.currentTarget.style.boxShadow = styles.logoutBtnHover.boxShadow;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <span style={{ fontSize: "18px" }}>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default NavigationBar;