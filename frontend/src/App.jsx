import { useEffect, useState } from "react";
import axios from "axios";
import MyOrders from "./MyOrders";
import AdminDashboard from "./AdminDashboard";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate
} from "react-router-dom";

// ==========================================
// NAVBAR
// ==========================================
function Navbar({ cart, user, logout }) {

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark">

      <div className="container">

        <Link
          className="navbar-brand fw-bold"
          to="/"
        >
          NexaCart
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMenu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarMenu"
        >

          <ul className="navbar-nav ms-auto align-items-lg-center">

            {/* SHOP */}
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/"
              >
                Shop
              </Link>
            </li>

            {/* CART */}
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/cart"
              >
                🛒 Cart ({cartCount})
              </Link>
            </li>

            {/* LOGIN / REGISTER */}
            {!user ? (

              <>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/login"
                  >
                    Login
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="btn btn-light btn-sm ms-lg-2"
                    to="/register"
                  >
                    Register
                  </Link>
                </li>
              </>

            ) : (

              <>
                {/* USER NAME */}
                <li className="nav-item">
                  <span className="nav-link">
                    👋 {user.name}
                  </span>
                </li>

                {/* MY ORDERS */}
                <li className="nav-item">
                  <Link
                    to="/my-orders"
                    className="btn btn-outline-primary me-2"
                  >
                    My Orders
                  </Link>
                </li>

                {/* LOGOUT */}
                <li className="nav-item">
                  <button
                    className="btn btn-outline-light btn-sm ms-lg-2"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </li>
              </>

            )}

          </ul>

        </div>

      </div>

    </nav>
  );
}
// ==========================================
// PRODUCTS PAGE
// ==========================================

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const getProducts = async () => {
    try {

      const response = await axios.get(
        "http://localhost:5000/api/products",
        {
          params: {
            search,
            category
          }
        }
      );

      setProducts(response.data.products);

    } catch (error) {

      console.log("Error:", error);

    }
  };

  useEffect(() => {
    getProducts();
  }, [search, category]);

  return (
    <section className="py-5 bg-light">

      <div className="container">

        {/* PAGE TITLE */}

        <div className="text-center mb-4">

          <h1 className="fw-bold">
            Shop Products
          </h1>

          <p className="text-muted">
            Find the products you need
          </p>

        </div>

        {/* SEARCH + CATEGORY */}

        <div className="row g-3 mb-5">

          <div className="col-md-8">

            <div className="input-group">

              <span className="input-group-text">
                🔍
              </span>

              <input
                type="text"
                className="form-control"
                placeholder="Search products..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

          </div>

          <div className="col-md-4">

            <select
              className="form-select"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >

              <option value="">
                All Categories
              </option>

              <option value="Shoes">
                Shoes
              </option>

              <option value="Mobiles">
                Mobiles
              </option>

              <option value="Accessories">
                Accessories
              </option>

              <option value="Laptops">
                Laptops
              </option>

              <option value="Cameras">
                Cameras
              </option>

              <option value="Smartwatches">
                Smartwatches
              </option>

              <option value="Clothing">
                Clothing
              </option>

            </select>

          </div>

        </div>

        {/* PRODUCT GRID */}

        <div className="row g-4">

          {products.length > 0 ? (

            products.map((product) => (

              <div
                className="col-12 col-sm-6 col-lg-4 col-xl-3"
                key={product._id}
              >

                <ProductCard
                  product={product}
                />

              </div>

            ))

          ) : (

            <div className="col-12 text-center py-5">

              <h4>
                No products found 😕
              </h4>

            </div>

          )}

        </div>

      </div>

    </section>
  );
}

// ==========================================
// PRODUCT CARD
// ==========================================

function ProductCard({ product }) {

  return (

    <div className="card h-100 border-0 shadow-sm">

      {/* IMAGE */}

      <div className="position-relative">

        <img
          src={product.image}
          className="card-img-top"
          alt={product.name}
          onError={(e) => {
            e.target.src =
              "https://placehold.co/600x400?text=No+Image";
          }}
          style={{
            height: "260px",
            objectFit: "cover"
          }}
        />

        <span className="badge bg-dark position-absolute top-0 start-0 m-3">
          {product.category}
        </span>

      </div>

      {/* CARD BODY */}

      <div className="card-body d-flex flex-column">

        <h5 className="card-title fw-bold">
          {product.name}
        </h5>

        <p className="card-text text-muted">
          {product.description}
        </p>

        <div className="mt-auto">

          <div className="d-flex justify-content-between align-items-center mb-3">

            <h5 className="fw-bold mb-0">
              Rs. {product.price.toLocaleString()}
            </h5>

            <small className="text-success">
              Stock: {product.stock}
            </small>

          </div>

          <Link
            to={`/products/${product._id}`}
            className="btn btn-dark w-100"
          >
            View Details
          </Link>

        </div>

      </div>

    </div>
  );
}

// ==========================================
// REGISTER
// ==========================================

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");

    try {

      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email,
          password
        }
      );

      setMessage(response.data.message);

      // Clear form

      setName("");
      setEmail("");
      setPassword("");

      // Go to login

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Registration failed"
      );

    }
  };

  return (

    <section className="py-5 bg-light">

      <div className="container">

        <div className="row justify-content-center">

          <div className="col-md-6 col-lg-5">

            <div className="card border-0 shadow-sm">

              <div className="card-body p-4">

                <h2 className="fw-bold text-center mb-4">
                  Create Account
                </h2>

                {message && (
                  <div className="alert alert-success">
                    {message}
                  </div>
                )}

                {error && (
                  <div className="alert alert-danger">
                    {error}
                  </div>
                )}

                <form onSubmit={handleRegister}>

                  {/* NAME */}

                  <div className="mb-3">

                    <label className="form-label">
                      Full Name
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      required
                    />

                  </div>

                  {/* EMAIL */}

                  <div className="mb-3">

                    <label className="form-label">
                      Email
                    </label>

                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      required
                    />

                  </div>

                  {/* PASSWORD */}

                  <div className="mb-4">

                    <label className="form-label">
                      Password
                    </label>

                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      required
                    />

                  </div>

                  <button
                    type="submit"
                    className="btn btn-dark w-100"
                  >
                    Create Account
                  </button>

                </form>

                <p className="text-center mt-4 mb-0">

                  Already have an account?{" "}

                  <Link to="/login">
                    Login
                  </Link>

                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

// ==========================================
// LOGIN
// ==========================================

function Login({ setUser }) {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");

    try {

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password
        }
      );

      const data = response.data;

      // Save JWT

      localStorage.setItem(
        "token",
        data.token
      );

      // Save user

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Update React state

      setUser(data.user);

      // Go home

      navigate("/");

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Login failed"
      );

    }
  };

  return (

    <section className="py-5 bg-light">

      <div className="container">

        <div className="row justify-content-center">

          <div className="col-md-6 col-lg-5">

            <div className="card border-0 shadow-sm">

              <div className="card-body p-4">

                <h2 className="fw-bold text-center mb-4">
                  Login
                </h2>

                {error && (
                  <div className="alert alert-danger">
                    {error}
                  </div>
                )}

                <form onSubmit={handleLogin}>

                  {/* EMAIL */}

                  <div className="mb-3">

                    <label className="form-label">
                      Email
                    </label>

                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      required
                    />

                  </div>

                  {/* PASSWORD */}

                  <div className="mb-4">

                    <label className="form-label">
                      Password
                    </label>

                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      required
                    />

                  </div>

                  <button
                    type="submit"
                    className="btn btn-dark w-100"
                  >
                    Login
                  </button>

                </form>

                <p className="text-center mt-4 mb-0">

                  Don't have an account?{" "}

                  <Link to="/register">
                    Register
                  </Link>

                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

// ==========================================
// PRODUCT DETAILS
// ==========================================

function ProductDetails({ addToCart }) {

  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const getProduct = async () => {

    try {

      const response = await axios.get(
        `http://localhost:5000/api/products/${id}`
      );

      setProduct(response.data);

    } catch (error) {

      console.log("Error:", error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    getProduct();
  }, [id]);

  if (loading) {

    return (

      <div className="container py-5 text-center">

        <div
          className="spinner-border"
          role="status"
        ></div>

        <p className="mt-3">
          Loading product...
        </p>

      </div>
    );
  }

  if (!product) {

    return (

      <div className="container py-5 text-center">

        <h2>
          Product not found
        </h2>

        <Link
          to="/"
          className="btn btn-dark mt-3"
        >
          Back to Products
        </Link>

      </div>
    );
  }

  return (

    <section className="py-5">

      <div className="container">

        <Link
          to="/"
          className="btn btn-outline-dark mb-4"
        >
          ← Back to Products
        </Link>

        <div className="row g-5 align-items-center">

          {/* IMAGE */}

          <div className="col-md-6">

            <img
              src={product.image}
              alt={product.name}
              onError={(e) => {
                e.target.src =
                  "https://placehold.co/800x600?text=No+Image";
              }}
              className="img-fluid rounded shadow"
              style={{
                width: "100%",
                height: "500px",
                objectFit: "cover"
              }}
            />

          </div>

          {/* DETAILS */}

          <div className="col-md-6">

            <span className="badge bg-dark mb-3">
              {product.category}
            </span>

            <h1 className="fw-bold mb-3">
              {product.name}
            </h1>

            <p className="text-muted fs-5">
              {product.description}
            </p>

            <h2 className="fw-bold my-4">
              Rs. {product.price.toLocaleString()}
            </h2>

            <p>

              <strong>
                Stock:
              </strong>{" "}

              <span className="text-success">
                {product.stock} available
              </span>

            </p>

            {/* QUANTITY */}

            <div className="mb-4">

              <label className="form-label fw-bold">
                Quantity
              </label>

              <div
                className="input-group"
                style={{ maxWidth: "180px" }}
              >

                <button
                  type="button"
                  className="btn btn-outline-dark"
                  onClick={() => {

                    if (quantity > 1) {
                      setQuantity(quantity - 1);
                    }

                  }}
                >
                  −
                </button>

                <input
                  type="number"
                  className="form-control text-center"
                  value={quantity}
                  min="1"
                  max={product.stock}
                  onChange={(e) => {

                    const value = Number(
                      e.target.value
                    );

                    if (
                      value >= 1 &&
                      value <= product.stock
                    ) {

                      setQuantity(value);

                    }

                  }}
                />

                <button
                  type="button"
                  className="btn btn-outline-dark"
                  onClick={() => {

                    if (quantity < product.stock) {
                      setQuantity(quantity + 1);
                    }

                  }}
                >
                  +
                </button>

              </div>

            </div>

            {/* ADD TO CART */}

            <button
              className="btn btn-dark btn-lg w-100"
              disabled={product.stock <= 0}
              onClick={() => {

                addToCart(product, quantity);

                alert(
                  `${product.name} added to cart!`
                );

              }}
            >

              🛒 Add to Cart

            </button>

          </div>

        </div>

      </div>

    </section>
  );
}

// ==========================================
// CART PAGE
// ==========================================

function Cart({
  cart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart
}) {

  const navigate = useNavigate();

  // Calculate subtotal

  const subtotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  // Shipping

  const shipping =
    subtotal > 0 ? 300 : 0;

  // Final total

  const total =
    subtotal + shipping;

  if (cart.length === 0) {

    return (

      <div className="container py-5 text-center">

        <h1 className="fw-bold">
          Your Cart is Empty 🛒
        </h1>

        <p className="text-muted mt-3">
          Add some products to your cart first.
        </p>

        <Link
          to="/"
          className="btn btn-dark mt-3"
        >
          Continue Shopping
        </Link>

      </div>
    );
  }

  return (

    <section className="py-5 bg-light">

      <div className="container">

        <h1 className="fw-bold mb-5">
          Shopping Cart
        </h1>

        <div className="row g-4">

          {/* CART ITEMS */}

          <div className="col-lg-8">

            {cart.map((item) => (

              <div
                className="card border-0 shadow-sm mb-3"
                key={item._id}
              >

                <div className="card-body">

                  <div className="row align-items-center">

                    {/* IMAGE */}

                    <div className="col-4 col-md-2">

                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid rounded"
                        style={{
                          height: "100px",
                          width: "100%",
                          objectFit: "cover"
                        }}
                      />

                    </div>

                    {/* NAME */}

                    <div className="col-8 col-md-4">

                      <h5 className="fw-bold">
                        {item.name}
                      </h5>

                      <p className="text-muted mb-0">
                        {item.category}
                      </p>

                      <strong>
                        Rs.{" "}
                        {item.price.toLocaleString()}
                      </strong>

                    </div>

                    {/* QUANTITY */}

                    <div className="col-6 col-md-3 mt-3 mt-md-0">

                      <div className="input-group">

                        <button
                          type="button"
                          className="btn btn-outline-dark"
                          onClick={() =>
                            decreaseQuantity(
                              item._id
                            )
                          }
                        >
                          −
                        </button>

                        <span className="form-control text-center">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          className="btn btn-outline-dark"
                          onClick={() =>
                            increaseQuantity(
                              item._id
                            )
                          }
                        >
                          +
                        </button>

                      </div>

                    </div>

                    {/* PRICE + REMOVE */}

                    <div className="col-6 col-md-3 text-end mt-3 mt-md-0">

                      <h5 className="fw-bold">

                        Rs.{" "}

                        {(
                          item.price *
                          item.quantity
                        ).toLocaleString()}

                      </h5>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() =>
                          removeFromCart(item._id)
                        }
                      >
                        Remove
                      </button>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

          {/* ORDER SUMMARY */}

          <div className="col-lg-4">

            <div className="card border-0 shadow-sm">

              <div className="card-body">

                <h4 className="fw-bold mb-4">
                  Order Summary
                </h4>

                <div className="d-flex justify-content-between mb-3">

                  <span>
                    Subtotal
                  </span>

                  <strong>
                    Rs.{" "}
                    {subtotal.toLocaleString()}
                  </strong>

                </div>

                <div className="d-flex justify-content-between mb-3">

                  <span>
                    Shipping
                  </span>

                  <strong>
                    Rs.{" "}
                    {shipping.toLocaleString()}
                  </strong>

                </div>

                <hr />

                <div className="d-flex justify-content-between mb-4">

                  <h5>
                    Total
                  </h5>

                  <h5 className="fw-bold">
                    Rs.{" "}
                    {total.toLocaleString()}
                  </h5>

                </div>

                <button
                  className="btn btn-dark w-100 btn-lg"
                  onClick={() =>
                    navigate("/checkout")
                  }
                >
                  Proceed to Checkout
                </button>

                <Link
                  to="/"
                  className="btn btn-outline-dark w-100 mt-2"
                >
                  Continue Shopping
                </Link>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

// ==========================================
// CHECKOUT
// ==========================================
function Checkout({ cart, setCart }) {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping = 300;

  const total = subtotal + shipping;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    try {

      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      const orderItems = cart.map((item) => ({
        product: item._id,
        quantity: item.quantity
      }));

      const response = await axios.post(
        "http://localhost:5000/api/orders",
        {
          items: orderItems,
          shippingAddress: formData
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert(response.data.message);

      // Empty cart after successful order
      setCart([]);

      // Go to My Orders
      navigate("/my-orders");

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Failed to place order"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="container mt-5 mb-5">

      <h2 className="mb-4">Checkout</h2>

      <div className="row">

        {/* SHIPPING FORM */}
        <div className="col-md-7">

          <div className="card p-4">

            <h4 className="mb-4">
              Shipping Information
            </h4>

            <form onSubmit={handleSubmit}>

              <div className="mb-3">

                <label className="form-label">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="mb-3">

                <label className="form-label">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="mb-3">

                <label className="form-label">
                  Phone
                </label>

                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="mb-3">

                <label className="form-label">
                  Address
                </label>

                <textarea
                  name="address"
                  className="form-control"
                  rows="4"
                  value={formData.address}
                  onChange={handleChange}
                  required
                ></textarea>

              </div>

              <button
                type="submit"
                className="btn btn-dark w-100"
                disabled={loading}
              >
                {loading
                  ? "Placing Order..."
                  : "Place Order"}
              </button>

            </form>

          </div>

        </div>


        {/* ORDER SUMMARY */}
        <div className="col-md-5">

          <div className="card p-4">

            <h4 className="mb-4">
              Order Summary
            </h4>

            {cart.map((item) => (

              <div
                key={item._id}
                className="d-flex justify-content-between mb-3"
              >

                <div>

                  <strong>
                    {item.name}
                  </strong>

                  <div className="text-muted">
                    Qty: {item.quantity}
                  </div>

                </div>

                <span>
                  Rs. {item.price * item.quantity}
                </span>

              </div>

            ))}

            <hr />

            <div className="d-flex justify-content-between">
              <span>Subtotal</span>
              <strong>Rs. {subtotal}</strong>
            </div>

            <div className="d-flex justify-content-between mt-2">
              <span>Shipping</span>
              <strong>Rs. {shipping}</strong>
            </div>

            <hr />

            <div className="d-flex justify-content-between">
              <h5>Total</h5>
              <h5>Rs. {total}</h5>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
// ==========================================
// MAIN APP
// ==========================================

function App() {

  // ========================================
  // LOGOUT
  // ========================================

  const [cart, setCart] = useState([]);

  const [user, setUser] = useState(() => {

    const savedUser =
      localStorage.getItem("user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setUser(null);

  };

  // ========================================
  // ADD TO CART
  // ========================================

  const addToCart = (
    product,
    quantity
  ) => {

    setCart((currentCart) => {

      const existingProduct =
        currentCart.find(
          (item) =>
            item._id === product._id
        );

      // Product already exists

      if (existingProduct) {

        const newQuantity =
          existingProduct.quantity +
          quantity;

        // Don't exceed stock

        if (newQuantity > product.stock) {

          alert(
            "You cannot add more than available stock."
          );

          return currentCart;
        }

        return currentCart.map(
          (item) =>

            item._id === product._id
              ? {
                  ...item,
                  quantity:
                    item.quantity +
                    quantity
                }
              : item
        );
      }

      // New product

      return [

        ...currentCart,

        {
          ...product,
          quantity: quantity
        }

      ];
    });
  };

  // ========================================
  // INCREASE QUANTITY
  // ========================================

  const increaseQuantity = (id) => {

    setCart((currentCart) =>

      currentCart.map((item) => {

        if (item._id === id) {

          if (
            item.quantity <
            item.stock
          ) {

            return {
              ...item,
              quantity:
                item.quantity + 1
            };

          }
        }

        return item;

      })
    );
  };

  // ========================================
  // DECREASE QUANTITY
  // ========================================

  const decreaseQuantity = (id) => {

    setCart((currentCart) =>

      currentCart.map((item) => {

        if (item._id === id) {

          if (item.quantity > 1) {

            return {
              ...item,
              quantity:
                item.quantity - 1
            };

          }
        }

        return item;

      })
    );
  };

  // ========================================
  // REMOVE PRODUCT
  // ========================================

  const removeFromCart = (id) => {

    setCart((currentCart) =>

      currentCart.filter(
        (item) =>
          item._id !== id
      )

    );
  };

  // ========================================
  // ROUTES
  // ========================================

  return (

    <BrowserRouter>

      <Navbar
        cart={cart}
        user={user}
        logout={logout}
      />

      <Routes>

        {/* PRODUCTS */}

        <Route
          path="/"
          element={<Products />}
        />

        {/* PRODUCT DETAILS */}

        <Route
          path="/products/:id"
          element={
            <ProductDetails
              addToCart={addToCart}
            />
          }
        />

        {/* CART */}

        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              increaseQuantity={
                increaseQuantity
              }
              decreaseQuantity={
                decreaseQuantity
              }
              removeFromCart={
                removeFromCart
              }
            />
          }
        />

        {/* CHECKOUT */}

        <Route
          path="/checkout"
          element={
            <Checkout
              cart={cart}
              setCart={setCart}
            />
          }
        />

        {/* REGISTER */}

        <Route
          path="/register"
          element={
            <Register />
          }
        />

        {/* LOGIN */}

        <Route
          path="/login"
          element={
            <Login
              setUser={setUser}
            />
          }
        />
        <Route path="/my-orders" element={<MyOrders />} />
          <Route
  path="/admin"
  element={<AdminDashboard />}
/>
      </Routes>

    </BrowserRouter>
  );
}

export default App;
