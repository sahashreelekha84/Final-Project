import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import useUserStore from "../store/useUserStore";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  const firstLetter = user?.username?.charAt(0).toUpperCase() || "";
  const role = user?.role || localStorage.getItem("role");

  const getDashboardPath = () => {
    switch (role) {
      case "admin": return "/admin/dashboard";
      case "coach": return "/coach/dashboard";
      case "client": return "/client/dashboard";
      default: return "/dashboard";
    }
  };

  const getProfilePath = () => {
    switch (role) {
      case "admin": return "/admin/profile";
      case "coach": return "/coach/profile";
      // Client does not have profile menu
      default: return "";
    }
  };

  const minimalHeader = location.pathname.includes("/dashboard");

  const renderDropdownMenu = () => (
    <Dropdown.Menu style={{ backgroundColor: "#343a40" }}>
      <Dropdown.Divider style={{ borderColor: "#6c757d" }} />
      {/* Only show Profile if not client */}
      {role !== "client" && (
        <Dropdown.Item style={{ color: "#fff" }} onClick={() => navigate(getProfilePath())}>
          Profile
        </Dropdown.Item>
      )}
      <Dropdown.Item style={{ color: "#fff" }} onClick={() => navigate(getDashboardPath())}>
        Dashboard
      </Dropdown.Item>
      <Dropdown.Divider style={{ borderColor: "#6c757d" }} />
      <Dropdown.Item style={{ color: "#fff" }} onClick={handleLogout}>
        Logout
      </Dropdown.Item>
    </Dropdown.Menu>
  );

  return (
    <div className="super_container">
      <header className="header">
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="header_content d-flex flex-row align-items-center justify-content-between trans_400">

                {/* Logo */}
                <a href="/">
                  <div className="logo d-flex flex-row align-items-center justify-content-start">
                    <img src="images/dot.png" alt="" />
                    <div>Sport<span>fit</span></div>
                  </div>
                </a>

                {/* Minimal header: show welcome + dropdown */}
                {minimalHeader && user && (
                  <Dropdown align="end">
                    <span className="text-white fw-bold m-2" style={{ fontSize: "14px" }}>
                      Welcome, {user?.username}
                    </span>
                    <Dropdown.Toggle
                      variant="secondary"
                      id="dropdown-basic"
                      style={{
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        padding: 0,
                        textAlign: "center",
                        lineHeight: "40px",
                        backgroundColor: "#0056b3",
                        border: "none",
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#fff",
                      }}
                    >
                      {firstLetter}
                    </Dropdown.Toggle>
                    {renderDropdownMenu()}
                  </Dropdown>
                )}

                {/* Full navbar for non-dashboard pages */}
                {!minimalHeader && (
                  <nav className="main_nav">
                    <ul className="d-flex flex-row align-items-center justify-content-start">
                      <li className="active"><a href="/">Home</a></li>
                      <li><a href="/about">About us</a></li>
                      <li><a href="/services">Classes & Services</a></li>
                      <li><a href="/blog">Blog</a></li>
                      <li><a href="/contact">Contact</a></li>

                      {user ? (
                        <li className="ms-3">
                          <Dropdown align="end">
                            <span className="text-white fw-bold m-2" style={{ fontSize: "14px" }}>
                              Welcome, {user?.username}
                            </span>
                            <Dropdown.Toggle
                              variant="secondary"
                              id="dropdown-basic"
                              style={{
                                borderRadius: "50%",
                                width: "40px",
                                height: "40px",
                                padding: 0,
                                textAlign: "center",
                                lineHeight: "40px",
                                backgroundColor: "#0056b3",
                                border: "none",
                                fontSize: "18px",
                                fontWeight: "bold",
                                color: "#fff",
                              }}
                            >
                              {firstLetter}
                            </Dropdown.Toggle>
                            {renderDropdownMenu()}
                          </Dropdown>
                        </li>
                      ) : (
                        <li className="ms-3"><a href="/login">Login</a></li>
                      )}
                    </ul>
                  </nav>
                )}

              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
