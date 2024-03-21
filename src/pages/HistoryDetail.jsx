import { useParams, useNavigate } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";

import { Container, Table } from "react-bootstrap";

const HistoryDetail = () => {
  //state thông tin đơn hàng
  const [order, setOrder] = useState(null);
  //state thông tin người dùng
  const [user, setUser] = useState(null);
  const params = useParams();
  const navigate = useNavigate();
  //hàm lấy thông tin đơn hàng và thông tin người dùng
  const fetchOrder = useCallback(() => {
    fetch(
      `${process.env.REACT_APP_BACKEND}/cart/order-detail/admin/${params.id}`,
      {
        method: "GET",
        credentials: "include",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (!data.err) {
          if (data.msg === "have not been logged in yet") {
            navigate("/login");
          } else {
            setOrder(data.order);
            setUser(data.user);
          }
        } else {
          navigate("/server-error");
        }
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => fetchOrder(), []);

  return (
    <Container className="p-3">
      {order && user && (
        <div className="my-4">
          <h3>INFORMATION ORDER</h3>
          <div className="my-3" style={{ color: "gray" }}>
            <p className="my-1">ID User: {user._id}</p>
            <p className="my-1">Full Name: {user.fullName}</p>
            <p className="my-1">Email: {user.email}</p>
            <p className="my-1">Phone: {user.phone}</p>
            <p className="my-1">Address: {user.address}</p>
            <p className="my-1">
              Total: $
              {Number(
                order.products
                  .map((pd) => pd.productId.price * pd.quan)
                  .reduce((acc, price) => acc + price, 0)
                  .toFixed(2)
              ) >= 75
                ? Number(
                    order.products
                      .map((pd) => pd.productId.price * pd.quan)
                      .reduce((acc, price) => acc + price, 0)
                      .toFixed(2)
                  )
                : Number(
                    order.products
                      .map((pd) => pd.productId.price * pd.quan)
                      .reduce((acc, price) => acc + price, 0)
                      .toFixed(2)
                  ) + 7.95}
            </p>
          </div>
          <Table className="my-5" responsive>
            <thead>
              <tr style={{ textAlign: "center" }}>
                <th style={{ backgroundColor: "#f8f9fa" }}>ID PRODUCT</th>
                <th style={{ backgroundColor: "#f8f9fa" }}>IMAGE</th>
                <th style={{ backgroundColor: "#f8f9fa" }}>NAME</th>
                <th style={{ backgroundColor: "#f8f9fa" }}>PRICE</th>
                <th style={{ backgroundColor: "#f8f9fa" }}>COUNT</th>
              </tr>
            </thead>
            <tbody>
              {order.products.map((pd) => (
                <tr
                  key={pd._id}
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                >
                  <td>{pd.productId._id}</td>
                  <td>
                    <img
                      width="10%"
                      src={`${process.env.REACT_APP_BACKEND}/${pd.productId.imgs[0]}`}
                      alt=""
                    />
                  </td>
                  <td>{pd.productId.name}</td>
                  <td>${pd.productId.price}</td>
                  <td>{pd.quan}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default HistoryDetail;
