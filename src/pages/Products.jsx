import { Button, Container, Table, Pagination } from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const Products = () => {
  //state danh sách sản phẩm
  const [pds, setPds] = useState([]);
  //state số trang hiện tại
  const [page, setPage] = useState(1);
  //state số trang tối đa mà server có thể trả về
  const [totalPages, setTotalPages] = useState(0);
  //state mảng checkbox
  const [isChecked, setIsChecked] = useState([]);
  //state đăng nhập
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //state checkbox chọn tất cả
  const [checkForAll, setCheckForAll] = useState(false);
  //state mảng chứa nhiều phần tử muốn xóa
  const [deleteMany, setDeleteMany] = useState([]);

  //tạo mảng để phân trang bằng bootstrap
  let items = [];
  for (let number = 1; number <= totalPages; number++) {
    items.push(
      <Pagination.Item
        onClick={() => setPage(number)}
        key={number}
        active={number === page}
      >
        {number}
      </Pagination.Item>
    );
  }

  //hàm kiểm tra người dùng đã đăng nhập chưa
  const fetchIsLoggedIn = useCallback(() => {
    fetch(`${process.env.REACT_APP_BACKEND}/users/check-login/admin`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.err) {
          if (data.msg === "Have not been logged in yet.") {
            setIsLoggedIn(false);
            navigate("/login");
          } else {
            setIsLoggedIn(true);
          }
        } else {
          navigate("/server-error");
        }
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => fetchIsLoggedIn(), []);

  const navigate = useNavigate();
  //hàm lấy danh sách sản phẩm
  const fetchDonates = useCallback((page) => {
    fetch(`${process.env.REACT_APP_BACKEND}/products/get/type/all/${page}`)
      .then((response) => response.json())
      .then((data) => {
        if (!data.err) {
          setPds(data.result);
          setTotalPages(data.totalPages);
          setIsChecked(Array(data.result.length).fill(false));
        } else {
          navigate("/server-error");
        }
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => fetchDonates(page), [page]);

  //hàm xử lý việc xóa một sản phẩm
  const deleteProduct = (id) => {
    const isDelete = window.confirm("Are you sure?");
    if (isDelete) {
      fetch(`${process.env.REACT_APP_BACKEND}/products/delete/${id}`, {
        method: "GET",
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          if (!data.err) {
            if (data.msg === "have not been logged in yet") {
              navigate("/login");
            } else if (data.message === "Deleted!") {
              alert("Deleted!");
              const index = pds.findIndex((pd) => pd._id === id);
              pds.splice(index, 1);
              setPds([...pds]);
            }
          } else {
            navigate("/server-error");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  //hàm xóa nhiều sản phẩm cùng lúc
  const deleteManyHandler = () => {
    const isDelete = window.confirm("Are you sure?");
    if (isDelete) {
      fetch(`${process.env.REACT_APP_BACKEND}/products/delete`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deleteMany: deleteMany,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (!data.err) {
            if (data.msg === "have not been logged in yet") {
              navigate("/login");
            } else if (data.message === "Deleted!") {
              alert("Deleted!");
              deleteMany.forEach((id) => {
                let index = pds.findIndex((pd) => pd._id === id);
                pds.splice(index, 1);
              });
              const newArr = [...pds];
              setPds(newArr);
              setIsChecked(Array(newArr.length).fill(false));
              setDeleteMany([]);
            }
          } else {
            navigate("/server-error");
          }
        })
        .catch((err) => console.log(err));
    }
  };
  return (
    <div className="p-3">
      {pds.length === 0 && <h4>There is no product to display.</h4>}
      {isLoggedIn && pds.length > 0 && (
        <div className="">
          {deleteMany.length > 0 && (
            <div style={{ textAlign: "right" }}>
              <Button
                onClick={deleteManyHandler}
                style={{
                  color: "#e44b6a",
                  backgroundColor: "white",
                  border: "0.1rem dotted #e44b6a",
                }}
              >
                Delete selected products
              </Button>
            </div>
          )}
          <Table className="my-3" striped bordered hover responsive>
            <thead>
              <tr>
                <th>
                  <input
                    onChange={() => {
                      if (checkForAll) {
                        setIsChecked(Array(pds.length).fill(false));
                        setCheckForAll(false);
                        setDeleteMany([]);
                      } else {
                        setIsChecked(Array(pds.length).fill(true));
                        setCheckForAll(true);
                        setDeleteMany((prevState) => {
                          pds.forEach((pd) => prevState.push(pd._id));
                          return prevState;
                        });
                      }
                    }}
                    type="checkbox"
                    checked={checkForAll}
                  />
                </th>
                <th className="col-1">ID</th>
                <th>Name</th>
                <th>Price</th>
                <th className="col-2">Type</th>
                <th className="col-1">Stock</th>
                <th className="col-2">Update</th>
                <th className="col-1">Delete</th>
              </tr>
            </thead>
            <tbody>
              {pds.map((pd, i) => (
                <tr key={pd._id}>
                  <td>
                    <input
                      onClick={() => {
                        setIsChecked((prevState) => {
                          const newArr = [...prevState];
                          newArr[i] = !newArr[i];
                          return newArr;
                        });
                        if (deleteMany.includes(pd._id)) {
                          setDeleteMany((prevState) => {
                            const newArr = prevState.filter(
                              (item) => item !== pd._id
                            );
                            return newArr;
                          });
                        } else {
                          setDeleteMany((prevState) => {
                            const newArr = [...prevState];
                            newArr.push(pd._id);
                            return newArr;
                          });
                        }
                      }}
                      type="checkbox"
                      checked={isChecked[i]}
                    />
                  </td>
                  <td>{i + 1}</td>
                  <td>{pd.name}</td>
                  <td>${pd.price}</td>
                  <td>{pd.type}</td>
                  <td>{pd.stock}</td>
                  <td>
                    <Button
                      onClick={() => navigate(`/update/${pd._id}`)}
                      style={{
                        color: "#078109",
                        backgroundColor: "white",
                        border: "0.1rem dotted #078109",
                      }}
                    >
                      Update
                    </Button>
                  </td>
                  <td>
                    <Button
                      onClick={() => deleteProduct(pd._id)}
                      style={{
                        color: "#e44b6a",
                        backgroundColor: "white",
                        border: "0.1rem dotted #e44b6a",
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td
                  className="p-2"
                  style={{ textAlign: "right", color: "gray" }}
                  colSpan={8}
                >
                  {`${page} out of ${totalPages} ${
                    totalPages === 1 ? "page" : "pages"
                  }`}{" "}
                  <ChevronLeft
                    onClick={() => {
                      if (page > 1) {
                        setPage((prevState) => prevState - 1);
                        setDeleteMany([]);
                      }
                    }}
                    style={{ cursor: "pointer", color: "black" }}
                  />
                  <span className="mx-2" style={{ color: "black" }}>
                    {page}
                  </span>
                  <ChevronRight
                    onClick={() => {
                      if (page < totalPages) {
                        setPage((prevState) => prevState + 1);
                        setDeleteMany([]);
                      }
                    }}
                    style={{ cursor: "pointer", color: "black" }}
                  />
                </td>
              </tr>
            </tfoot>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Products;
