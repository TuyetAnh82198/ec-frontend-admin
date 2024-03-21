import { useState, useRef, useCallback, useEffect } from "react";
import { Container } from "react-bootstrap";
import generator from "generate-password-browser";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
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
            navigate("/");
          }
        } else {
          navigate("/server-error");
        }
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => fetchLogin(), [fetchLogin]);

  //state mật khẩu được tạo tự động
  const [randomPass, setRandomPass] = useState("Random password");
  //state mật khẩu đã nhập
  const [pass, setPass] = useState("");

  const fullNameInput = useRef();
  const emailInput = useRef();
  const phoneInput = useRef();

  //hàm tạo mật khẩu tự động
  const createRandomPass = () => {
    const newRandomPass = generator.generate({
      length: 8,
      numbers: true,
      symbols: true,
    });
    setRandomPass(newRandomPass);
  };

  //hàm submit form
  const submitForm = (e) => {
    e.preventDefault();
    const inputObj = {
      fullName: fullNameInput.current.value,
      email: emailInput.current.value,
      pass: pass,
      phone: phoneInput.current.value,
      role: "admin",
    };
    fetch(`${process.env.REACT_APP_BACKEND}/users/sign-up`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputObj),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.err) {
          if (data.errs) {
            alert(data.errs);
          } else if (data.msg === "User existing!") {
            alert("User existing!");
          } else if (data.msg === "Created!") {
            alert("Created!");
            navigate("/login");
          }
        } else {
          console.log(data.err);
          navigate("/server-error");
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="p-3">
      <Container
        className="py-1 col-9 col-md-6 col-xxl-4 px-5 my-3 rounded-2 shadow"
        style={{
          backgroundColor: "white",
          zIndex: "5",
          height: "80vh",
        }}
      >
        <p className="my-5" style={{ fontSize: "1.4rem" }}>
          Sign Up
        </p>
        <form onSubmit={submitForm} className="d-flex flex-column">
          <input
            className="p-3 border border-secondary border-bottom-0"
            type="text"
            placeholder="Full Name"
            required
            ref={fullNameInput}
          />
          <input
            className="p-3 border border-secondary border-bottom-0"
            type="email"
            placeholder="Email"
            required
            ref={emailInput}
          />
          <input
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="p-3 border border-secondary border-bottom-0"
            type="password"
            placeholder="Password"
            required
          />
          <div className="d-flex border border-secondary border-bottom-0">
            <div className="col-8 d-flex justify-content-around align-items-center">
              {randomPass}
            </div>
            <div
              onClick={createRandomPass}
              className="col-2 d-flex align-items-center"
              style={{ cursor: "pointer", color: "green" }}
            >
              Create
            </div>
            <div className="col-2">
              <button
                onClick={() => {
                  if (randomPass !== "Random password") {
                    setPass(randomPass);
                  }
                }}
                className="w-100 border-0 py-2"
              >
                Copy
              </button>
            </div>
          </div>
          <input
            className="p-3 border border-secondary"
            type="tel"
            placeholder="Phone"
            ref={phoneInput}
            required
          />
          <button
            type="submit"
            className="border-0 py-2 my-3"
            style={{ backgroundColor: "black", color: "white" }}
          >
            SIGN UP
          </button>
        </form>
        <div className="py-3" style={{ color: "gray" }}>
          <span>Login?</span>{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            Click
          </span>
          . Or go to
          <span onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
            {" "}
            HomePage
          </span>
        </div>
      </Container>
    </div>
  );
};

export default SignUp;
