import { Card, Table } from "react-bootstrap";
import {
  Cart,
  Coin,
  Person,
  Wallet2,
  ArrowRight,
  FilePostFill,
  ChevronRight,
  ChevronLeft,
} from "react-bootstrap-icons";
import { Fragment, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
// import { format } from "date-fns";

import styles from "./home.module.css";

const Home = () => {
  //state số lượng người dùng
  const [users, setUsers] = useState(0);
  //state số lượng đơn đặt hàng mới
  const [orders, setOrders] = useState(0);
  //state tổng doanh thu trong tháng
  const [earningsOfMonth, setEarningsOfMonth] = useState(0);
  //state tổng doanh thu trong năm
  const [totalEarnings, setTotalEarnings] = useState(0);
  //state danh sách giao dịch
  const [cart, setCart] = useState([]);
  //state cho biết đang xem trang thứ mấy
  const [page, setPage] = useState(1);
  //state tổng số trang kết quả có thể hiển thị
  const [totalPages, setTotalPages] = useState(0);
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
            navigate("/login");
          }
        } else {
          navigate("/server-error");
        }
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => fetchLogin(), [fetchLogin]);

  //Hàm lấy số lượng của các mục
  const fetchUsers = useCallback(() => {
    fetch(`${process.env.REACT_APP_BACKEND}/users/total`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.users);
        setOrders(data.orders);
        setEarningsOfMonth(data.earningsOfMonth);
        setTotalEarnings(data.totalEarnings);
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => fetchUsers(), [fetchUsers]);

  //Hàm lấy và hiển thị 8 giao dịch gần nhất
  const fetchTransactions = useCallback((page) => {
    fetch(`${process.env.REACT_APP_BACKEND}/cart/get-all/${page}`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setCart(data.result);
        setTotalPages(data.totalPages);
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => fetchTransactions(page), [page]);

  return (
    <div className="p-3">
      {isLoggedIn && (
        <div>
          <div className="d-flex justify-content-between">
            <Card className="p-2 shadow" style={{ width: "23%" }}>
              <Card.Title className={styles.title}>USERS</Card.Title>
              <Card.Text className={styles.text}>{users}</Card.Text>
              <div
                style={{
                  textAlign: "right",
                  marginBottom: "0.5rem",
                }}
              >
                <span
                  className="rounded-2"
                  style={{
                    padding: "0 0.5rem 0.5rem 0.5rem",
                    color: "red",
                    backgroundColor: "#ffcbcb",
                  }}
                >
                  <Person />
                </span>
              </div>
            </Card>
            <Card className="p-2 shadow" style={{ width: "23%" }}>
              <Card.Title className={styles.title}>NEW ORDERS</Card.Title>
              <Card.Text className={styles.text}>{orders}</Card.Text>
              <div
                style={{
                  textAlign: "right",
                  marginBottom: "0.5rem",
                }}
              >
                <span
                  className="rounded-2"
                  style={{
                    padding: "0 0.5rem 0.5rem 0.5rem",
                    color: "#deaf3f",
                    backgroundColor: "#f4e8ce",
                  }}
                >
                  <Cart />
                </span>
              </div>
            </Card>
            <Card className="p-2 shadow" style={{ width: "23%" }}>
              <Card.Title className={styles.title}>
                EARNINGS OF MONTH
              </Card.Title>
              <Card.Text className={styles.text}>${earningsOfMonth}</Card.Text>
              <div
                style={{
                  textAlign: "right",
                  marginBottom: "0.5rem",
                }}
              >
                <span
                  className="rounded-2"
                  style={{
                    padding: "0 0.5rem 0.5rem 0.5rem",
                    color: "#0c810b",
                    backgroundColor: "#cbe5cb",
                  }}
                >
                  <Coin />
                </span>
              </div>
            </Card>
            <Card className="p-2 shadow" style={{ width: "23%" }}>
              <Card.Title className={styles.title}>TOTAL EARNINGS</Card.Title>
              <Card.Text className={styles.text}>${totalEarnings}</Card.Text>
              <div
                style={{
                  textAlign: "right",
                  marginBottom: "0.5rem",
                }}
              >
                <span
                  className="rounded-2"
                  style={{
                    padding: "0 0.5rem 0.5rem 0.5rem",
                    color: "#8f278f",
                    backgroundColor: "#e5cbe5",
                  }}
                >
                  <Wallet2 />
                </span>
              </div>
            </Card>
          </div>
          <Card
            className="my-4 py-5 px-4 rounded-1"
            style={{ color: "#89878c" }}
          >
            <Card.Title>Latest Transactions</Card.Title>
            <div className="border rounded-1 p-2">
              {cart.length === 0 && (
                <div className="my-2" style={{ textAlign: "center" }}>
                  <FilePostFill style={{ color: "gray" }} /> There is no
                  transaction.
                </div>
              )}
              {cart.length > 0 && (
                <Table className="my-5" responsive>
                  <thead>
                    <tr style={{ textAlign: "center" }}>
                      <th style={{ backgroundColor: "#f8f9fa" }}>ID ORDER</th>
                      <th style={{ backgroundColor: "#f8f9fa" }}>EMAIL</th>
                      <th style={{ backgroundColor: "#f8f9fa" }}>TOTAL</th>
                      <th style={{ backgroundColor: "#f8f9fa" }}>DELIVERY</th>
                      <th style={{ backgroundColor: "#f8f9fa" }}>STATUS</th>
                      <th style={{ backgroundColor: "#f8f9fa" }}>PAID ON</th>
                      <th style={{ backgroundColor: "#f8f9fa" }}>DETAIL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => (
                      <tr key={item._id} style={{ textAlign: "center" }}>
                        <td>{item._id}</td>
                        <td>{item.email}</td>
                        <td>
                          $
                          {Number(
                            item.products
                              .map((pd) => pd.productId.price * pd.quan)
                              .reduce((acc, price) => acc + price, 0)
                              .toFixed(2)
                          ) >= 75
                            ? Number(
                                item.products
                                  .map((pd) => pd.productId.price * pd.quan)
                                  .reduce((acc, price) => acc + price, 0)
                                  .toFixed(2)
                              )
                            : Number(
                                item.products
                                  .map((pd) => pd.productId.price * pd.quan)
                                  .reduce((acc, price) => acc + price, 0)
                                  .toFixed(2)
                              ) + 7.95}
                        </td>
                        <td>Waiting for progressing</td>
                        <td>{item.status}</td>
                        <td>{item.date}</td>
                        <td>
                          <button
                            onClick={() =>
                              navigate(`/history-detail/${item._id}`)
                            }
                            className="px-2"
                            style={{ backgroundColor: "white" }}
                          >
                            View <ArrowRight />
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr colSpan={7}>
                      <td
                        className="p-2"
                        style={{ textAlign: "right", color: "gray" }}
                        colSpan={8}
                      >
                        {`${page} out of ${totalPages} ${
                          totalPages === 1 ? "page" : "pages"
                        }`}{" "}
                        <span style={{ cursor: "pointer", color: "black" }}>
                          <ChevronLeft
                            onClick={() => {
                              if (page > 1) {
                                setPage((prevState) => prevState - 1);
                              }
                            }}
                            style={{ cursor: "pointer" }}
                          />
                        </span>
                        <span className="mx-1" style={{ color: "black" }}>
                          {page}
                        </span>
                        <span style={{ cursor: "pointer", color: "black" }}>
                          <ChevronRight
                            onClick={() => {
                              if (page < totalPages) {
                                setPage((prevState) => prevState + 1);
                              }
                            }}
                          />
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Home;
