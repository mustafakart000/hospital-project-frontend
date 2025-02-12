import React, { useState, useEffect } from "react";
import { Layout, Menu, Drawer, Button } from "antd";
import {
  MenuOutlined,
  DashboardOutlined,
  TeamOutlined,
  CalendarOutlined,
  FileTextOutlined,
  SettingOutlined,
  MedicineBoxOutlined,
  UserOutlined,
  ExperimentOutlined,
  DollarOutlined,
  UsergroupAddOutlined,
  ContainerOutlined,
  AlertOutlined,
  BankOutlined,
  UserAddOutlined,
  HeartOutlined,
  FormOutlined,
  AreaChartOutlined,
  SafetyOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHospitalUser, FaUserDoctor } from "react-icons/fa6";
import store from "../../redux/store.jsx";
import { logout } from "../../redux/slices/auth-slice.js";
import { removeFromLocalStorage } from "../../helpers/functions/encrypted-storage.js";
import { HeartPulse } from 'react-bootstrap-icons';

const { Sider } = Layout;

const MenuBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const menuItems = useSelector((state) => state.auth.menu);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(window.innerWidth >= 1024);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [selectedKeys, setSelectedKeys] = useState([]);

  const handleLogout = () => {
    store.dispatch(logout());
    removeFromLocalStorage("token");
  };

  // İkon eşleştirmeleri - Türkçe başlıklara göre
  const getIcon = (title) => {
    const icons = {
      "Ana Sayfa": <DashboardOutlined />,
      "Hasta Takip": <TeamOutlined />,
      Randevular: <CalendarOutlined />,
      "Doktor Yönetimi": <FaUserDoctor />,
      Hemşireler: <UserOutlined />,
      "İlaç Stok": <MedicineBoxOutlined />,
      Laboratuvar: <ExperimentOutlined />,
      Raporlar: <FileTextOutlined />,
      Muhasebe: <DollarOutlined />,
      Faturalar: <FileTextOutlined />,
      Personel: <UsergroupAddOutlined />,
      Poliklinikler: <ContainerOutlined />,
      Ameliyathane: <AlertOutlined />,
      "Acil Servis": <AlertOutlined />,
      "Yatan Hasta": <TeamOutlined />,
      Ayarlar: <SettingOutlined />,
      Klinikler: <BankOutlined />,
      "Admin Yönetimi": <UserOutlined />,
      "Hasta Yönetimi": <FaHospitalUser />,
      "Doktor Profili": <UserAddOutlined />,
      "Reçete Yönetimi": <FormOutlined  />,
      "Randevu Yönetimi": <CalendarOutlined />,
      "Hasta Geçmişi": <TeamOutlined />,
      "Hasta Profili": <UserOutlined />,
      "Tedavi Paneli": <HeartOutlined/>,
      "Laboratuvar Paneli": <ExperimentOutlined />,
      "Görüntüleme Paneli": <AreaChartOutlined />,
      "Teknisyen Profili": <UserOutlined />,
      "Teknisyen Yönetimi": <SafetyOutlined   />,
    };
    return icons[title] || <FileTextOutlined />;
  };

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWindowWidth(newWidth);
      setIsMenuOpen(newWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const selectedKey = location.pathname;
    setSelectedKeys([selectedKey]);
  }, [location]);

  const handleMenuClick = ({ key }) => {
    setDrawerVisible(false);
    navigate(key);
  };

  return (
    <>
      <div
        className={`${
          isMenuOpen && windowWidth >= 1024 ? "block" : "hidden"
        } lg:block`}
      >
        <Sider
          width={280}
          style={{
            height: "100vh",
            background: "#ffffff",
            borderRight: "1px solid rgba(229, 231, 235, 0.5)",
            margin: "0",
            borderRadius: "0",
            boxShadow: "2px 0 20px rgba(0, 0, 0, 0.03)",
          }}
          className="hidden lg:block"
        >
          {/* Header */}
          <div
            style={{
              padding: "24px 20px",
              background: "linear-gradient(145deg, #ffffff 0%, #ffffff 100%)",
              borderBottom: "1px solid rgba(229, 231, 235, 0.1)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage:
                  "radial-gradient(circle at 10% 20%, rgba(255,255,255,0.08) 0%, transparent 60%)",
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                
              }}
            >
              
              <h1
                style={{
                  color: "#161515",
                  fontSize: "20px",
                  fontWeight: "600",
                  letterSpacing: "0.5px",
                  margin: 0,
                  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  
                }}
                onClick={() => navigate("/dashboard")}
                cursor="pointer"
              >
                Hastane Yönetimi
              </h1>
            </div>
          </div>

          {/* Menu Items */}
          <div style={{ padding: "12px" }}>
            <Menu
              theme="light"
              mode="inline"
              onClick={handleMenuClick}
              selectedKeys={selectedKeys}
              style={{
                backgroundColor: "transparent",
                border: "none",
              }}
              items={[
                ...menuItems.map((item) => ({
                  key: item.link,
                  icon: getIcon(item.title),
                  label: item.title,
                  className: `flex items-center p-3 rounded-lg transition-all duration-300 ${
                    selectedKeys.includes(item.link)
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                  }`,
                })),
                {
                  key: "logout",
                  icon: <LogoutOutlined />,
                  label: "Çıkış Yap",
                  onClick: handleLogout,
                  className: "flex items-center p-3 rounded-lg transition-all duration-300 text-gray-600 hover:bg-blue-50 hover:text-blue-700 mt-auto",
                },
              ]}
            />
          </div>
        </Sider>
      </div>

      {/* Mobile Menu Button */}
      <Button
        type="primary"
        className="block lg:hidden fixed z-50 top-1 sm:top-4 left-4"
        icon={<MenuOutlined />}
        onClick={() => setDrawerVisible(true)}
        style={{
          backgroundColor: "#2563eb",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
          border: "none",
          padding: "8px 12px",
          height: "40px",
          width: "40px",
          alignItems: "center",
          justifyContent: "center",
          position: "fixed",
          zIndex: 1000
        }}
      />

      {/* Mobile Drawer */}
      <Drawer
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              padding: "10px 0",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                color: "#1a365d",
              }}
            >
              <HeartPulse 
                size={24}
                className="text-blue-600"
              />
              <span
                style={{
                  fontWeight: "600",
                  fontSize: "18px",
                }}
              >
                Hastane Yönetim Sistemi
              </span>
            </div>
          </div>
        }
        placement="left"
        closable={true}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        className="lg:hidden"
        width={300}
        styles={{
          header: {
            borderBottom: "1px solid #e5e7eb",
            padding: "0",
          },
          body: {
            backgroundColor: 'white',
            padding: '16px 0',
          },
        }}
      >
        <Menu
          theme="light"
          mode="inline"
          onClick={handleMenuClick}
          selectedKeys={selectedKeys}
          style={{
            border: "none",
            backgroundColor: "transparent",
          }}
          items={[
            ...menuItems.map((item) => ({
              key: item.link,
              icon: getIcon(item.title),
              label: item.title,
              style: {
                margin: "4px 0",
                padding: "12px 16px",
                borderRadius: "8px",
                backgroundColor: selectedKeys.includes(item.link)
                  ? "#e0f2fe"
                  : "transparent",
                color: selectedKeys.includes(item.link) ? "#0369a1" : "#475569",
                fontWeight: selectedKeys.includes(item.link) ? "600" : "500",
                fontSize: "14px",
                transition: "all 0.3s ease",
                border: selectedKeys.includes(item.link)
                  ? "1px solid #bae6fd"
                  : "1px solid transparent",
              },
            })),
            {
              key: "logout",
              icon: <LogoutOutlined />,
              label: "Çıkış Yap",
              style: {
                margin: "4px 0",
                padding: "12px 16px",
                borderRadius: "8px",
                backgroundColor: "transparent",
                color: "#475569",
                fontWeight: "500",
                fontSize: "14px",
                transition: "all 0.3s ease",
                border: "1px solid transparent",
                marginTop: "auto",
              },
              onClick: handleLogout,
            },
          ]}
        />
      </Drawer>
    </>
  );
};

export default MenuBar;
