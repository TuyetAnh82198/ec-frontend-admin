import { Fragment, useState, useRef, useCallback, useEffect } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const Update = () => {
  //state thông tin chi tiết sản phẩm
  const [pd, setPd] = useState({});
  //state danh mục sản phẩm
  const [category, setCategory] = useState("Select category");
  //state đăng nhập
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const nameInput = useRef();
  const shortDescInput = useRef();
  const longDescInput = useRef();
  const quanInput = useRef();
  const imgInput = useRef();
  const priceInput = useRef();

  const navigate = useNavigate();
  //hàm kiểm tra người dùng đã đăng nhập chưa
  const fetchIsLoggedIn = useCallback(() => {
    fetch(`${process.env.REACT_APP_BACKEND}/users/check-login/admin`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.msg === "have not been logged in yet") {
          navigate("/login");
          setIsLoggedIn(false);
        } else {
          setIsLoggedIn(true);
        }
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => fetchIsLoggedIn(), []);

  const params = useParams();
  //hàm lấy thông tin chi tiết sản phẩm
  const fetchPd = useCallback(() => {
    fetch(
      `${process.env.REACT_APP_BACKEND}/products/detail/admin/${params.id}`,
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
          } else if (data.pd) {
            setPd(data.pd);
            setCategory(data.pd.type);
          }
        } else {
          navigate("/server-error");
        }
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => fetchPd(), []);

  //hàm submit form
  const submitForm = (e) => {
    e.preventDefault();
    if (
      nameInput.current.value.trim().length === 0 ||
      shortDescInput.current.value.trim().length === 0 ||
      longDescInput.current.value.trim().length === 0
    ) {
      alert("Fields cannot be empty!");
    } else if (Number(priceInput.current.value) <= 0) {
      alert("Price must be greater than 0!");
    } else if (quanInput.current.value <= 0) {
      alert("Quantity must be greater than 0!");
    } else if (category === "Select category") {
      alert("Please select category!");
    } else {
      fetch(`${process.env.REACT_APP_BACKEND}/products/update/${pd._id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameInput.current.value,
          short_desc: shortDescInput.current.value,
          long_desc: longDescInput.current.value,
          stock: quanInput.current.value,
          price: priceInput.current.value,
          type: category,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (!data.err) {
            if (data.message === "Updated!") {
              alert("Updated!");
              navigate("/products");
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
      {isLoggedIn && pd && (
        <Container
          className="shadow my-5 col-8 p-3"
          style={{ backgroundColor: "white", zIndex: "5" }}
        >
          <h4>Update product</h4>
          <Form onSubmit={submitForm}>
            <Form.Group className="my-3">
              <Form.Label
                htmlFor="name"
                style={{ fontWeight: "bold", color: "gray" }}
              >
                Product Name
              </Form.Label>
              <Form.Control
                id="name"
                type="text"
                placeholder="COCA COLA 330ml"
                defaultValue={pd.name}
                ref={nameInput}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label
                htmlFor="short_desc"
                style={{ fontWeight: "bold", color: "gray" }}
              >
                Short Description
              </Form.Label>
              <Form.Control
                id="short_desc"
                type="text"
                placeholder="COCA-COLA Original is a Cola flavored carbonated drink, comes in a practical can of 330 ml. Enjoy its freshness by drinking it when it's cold."
                defaultValue={pd.short_desc}
                ref={shortDescInput}
              />
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label
                htmlFor="long_desc"
                style={{ fontWeight: "bold", color: "gray" }}
              >
                Long Description
              </Form.Label>
              <Form.Control
                id="long_desc"
                as="textarea"
                rows={4}
                placeholder="Ingredients
                  CARBONATED WATER, SUGAR, NATURAL CARAMEL COLOR (CLASS IV), ACIDITY REGULATORS (PHOSPHORIC ACID), KOLA CONCENTRATE, CAFFEINE. CONTAINS CAFFEINE 24 MG/SERVING. MAXIMUM CONSUMPTION 150 MG/DAY.
                  "
                defaultValue={pd.long_desc}
                ref={longDescInput}
              />
            </Form.Group>
            <Form.Group className=" d-flex justify-content-between">
              <div className="col-5">
                <Form.Label
                  htmlFor="price"
                  style={{ fontWeight: "bold", color: "gray" }}
                >
                  Price {`($)`}
                </Form.Label>
                <Form.Control
                  id="price"
                  type="type"
                  placeholder="0.36"
                  defaultValue={pd.price}
                  ref={priceInput}
                />
              </div>
              <div className="col-5">
                <Form.Label
                  htmlFor="quan"
                  style={{ fontWeight: "bold", color: "gray" }}
                >
                  Quantity Of Product In Stock
                </Form.Label>
                <Form.Control
                  id="quan"
                  type="number"
                  placeholder="100"
                  defaultValue={pd.stock}
                  ref={quanInput}
                />
              </div>
            </Form.Group>
            <Form.Group className="my-3 d-flex justify-content-between">
              <div className="col-5">
                <Form.Label style={{ fontWeight: "bold", color: "gray" }}>
                  Category
                </Form.Label>
                <Form.Select
                  onChange={(e) => {
                    setCategory(e.target.value);
                  }}
                >
                  <option value={category}>{category}</option>
                  {["Soft Drinks", "Juices", "Teas", "Dairy Drinks"]
                    .filter((item) => item !== category)
                    .sort((a, b) => a - b)
                    .map((item) => (
                      <option
                        key={(Math.random() * 10).toString()}
                        value={item}
                      >
                        {item}
                      </option>
                    ))}
                </Form.Select>
              </div>
            </Form.Group>
            <Form.Group style={{ textAlign: "right" }}>
              <Button
                type="submit"
                className="border-0"
                style={{
                  backgroundColor: "#6936ff",
                  fontWeight: "bold",
                }}
              >
                Update
              </Button>
            </Form.Group>
          </Form>
        </Container>
      )}
    </div>
  );
};

export default Update;
