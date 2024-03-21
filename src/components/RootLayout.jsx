import { useState, useCallback, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  ClipboardDataFill,
  BoxArrowRight,
  ChatLeftDotsFill,
  PlusCircleFill,
  CartFill,
  PersonFillAdd,
  BoxArrowLeft,
} from "react-bootstrap-icons";
import { Navbar } from "react-bootstrap";

import styles from "./rootlayout.module.css";

const RootLayout = () => {
  //state đăng nhập
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  //hàm kiểm tra người dùng đã đăng nhập chưa
  const fetchLogin = useCallback(() => {
    fetch(`${process.env.REACT_APP_BACKEND}/users/check-login/admin`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.err) {
          if (data.msg === "You are logged in.") {
            setIsLoggedIn(true);
          } else if (data.msg === "Have not been logged in yet.") {
            setIsLoggedIn(false);
          }
        } else {
          navigate("/server-error");
        }
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => fetchLogin(), [fetchLogin]);

  //hàm xử lý việc đăng xuất
  const logout = () => {
    fetch(`${process.env.REACT_APP_BACKEND}/users/logout`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.err) {
          if (data.msg === "You are logged out.") {
            alert("You are logged out.");
            window.location.href = "/login";
          }
        } else {
          navigate("/server-error");
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div>
      <div className="d-flex">
        <div
          className="col-2 border border-top-0 border-left-0 py-2"
          style={{ textAlign: "center" }}
        >
          <h3 style={{ color: "#6936ff" }}>Admin Page</h3>
        </div>
        <div className="col-10 border-bottom"></div>
      </div>
      <div className="d-flex">
        <div
          className="col-2 border border-top-0 border-left-0 border-bottom-0"
          style={{ color: "#89878c", minHeight: "100vh" }}
        >
          <Navbar className="px-2 py-3 border-top d-flex flex-column align-items-start">
            <div>
              <h6 className={styles.title}>MAIN</h6>
              <div className="d-flex flex-column">
                <NavLink to="/" className={styles.navLinks}>
                  <ClipboardDataFill className={styles.icons} /> Dashboard
                </NavLink>
                <NavLink to="/chat" className={styles.navLinks}>
                  <ChatLeftDotsFill className={styles.icons} /> Chat
                </NavLink>
              </div>
            </div>
            <div className="my-3 d-flex flex-column align-items-start">
              <h6 className={styles.title}>LISTS</h6>
              <NavLink to="/products" className={styles.navLinks}>
                <CartFill className={styles.icons} /> Products
              </NavLink>
            </div>
            <div className="d-flex flex-column align-items-start">
              <h6 className={styles.title}>NEW</h6>
              <NavLink to="/add" className={styles.navLinks}>
                <PlusCircleFill className={styles.icons} /> Add a product
              </NavLink>
            </div>
            <div className="my-3">
              <h6 className={styles.title}>USER</h6>
              {!isLoggedIn && (
                <div className="d-flex flex-column">
                  <NavLink to="/sign-up" className={styles.navLinks}>
                    <PersonFillAdd
                      className={styles.icons}
                      style={{ fontWeight: "bold" }}
                    />{" "}
                    Sign Up
                  </NavLink>
                  <NavLink to="/login" className={styles.navLinks}>
                    <BoxArrowRight
                      className={styles.icons}
                      style={{ fontWeight: "bold" }}
                    />{" "}
                    Login
                  </NavLink>
                </div>
              )}
              {isLoggedIn && (
                <NavLink onClick={logout} className={styles.navLinks}>
                  <BoxArrowLeft
                    className={styles.icons}
                    style={{ fontWeight: "bold" }}
                  />{" "}
                  Logout
                </NavLink>
              )}
            </div>
          </Navbar>
        </div>
        <div className="col-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default RootLayout;
