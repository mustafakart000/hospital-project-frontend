import React, { useState, useEffect } from "react";
import { Layout, Menu, Drawer, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

const { Sider } = Layout;

const MenuBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const menuItems = useSelector((state) => state.auth.menu);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(window.innerWidth >= 1024);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [selectedKeys, setSelectedKeys] = useState([]);

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
          width={240}
          style={{
            height: "100vh",
            background: "#f8fafc",
            borderRight: "1px solid #e2e8f0",
            margin: "0",
            borderRadius: "0 8px 8px 0",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          }}
          className="hidden lg:block"
        >
          <div
            style={{
              padding: "16px",
              textAlign: "center",
              backgroundColor: "#f1f5f9",
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            <h1
              style={{
                color: "#1e40af",
                fontSize: "18px",
                fontWeight: "600",
                letterSpacing: "0.5px",
              }}
            >
              Hastane Yönetimi
            </h1>
          </div>
          <Menu
            theme="light"
            mode="inline"
            onClick={handleMenuClick}
            selectedKeys={selectedKeys}
            items={menuItems.map((item) => ({
              key: item.link,
              label: item.title,
              style: {
                backgroundColor: selectedKeys.includes(item.link)
                  ? "#e0f2fe"
                  : "#ffffff", // Tıklanan öğenin arka planı belirginleşiyor
                color: selectedKeys.includes(item.link) ? "#0284c7" : "#1e40af", // Tıklanan öğenin yazı rengi değişiyor
                borderBottom: "1px solid #e2e8f0",
                transition: "all 0.3s ease",
                fontWeight: selectedKeys.includes(item.link)
                  ? "bold"
                  : "normal", // Tıklanan öğe kalınlaşıyor
              },
            }))}
          />
        </Sider>
      </div>

      {/* Küçük ekranlar için Sandwich Menüsü */}
      <Button
        type="primary"
        className="lg:hidden fixed top-4 left-4 z-50"
        icon={<MenuOutlined />}
        onClick={() => setDrawerVisible(true)}
        style={{
          backgroundColor: "#3b82f6",
          borderRadius: "8px",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        }}
      />

      <Drawer
        title="Hastane Yönetimi"
        placement="left"
        closable={true}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        className="lg:hidden"
        style={{
          backgroundColor: "#f8fafc",
          borderRadius: "0 8px 8px 0",
        }}
      >
        <Menu
          theme="light"
          mode="inline"
          onClick={handleMenuClick}
          selectedKeys={selectedKeys}
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "8px",
          }}
          items={menuItems.map((item) => ({
            key: item.link,
            label: item.title,
            style: {
              color: "#1e40af",
              transition: "all 0.3s ease",
            },
          }))}
        />
      </Drawer>
    </>
  );
};

export default MenuBar;
