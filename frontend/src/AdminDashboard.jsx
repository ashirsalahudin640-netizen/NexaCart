import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: ""
  });

  const [editingId, setEditingId] = useState(null);


  // ==============================
  // FETCH PRODUCTS
  // ==============================

  const fetchProducts = async () => {

    try {

      const response = await axios.get(
        "http://localhost:5000/api/products"
      );

      setProducts(response.data.products);

    } catch (error) {

      console.log(
        error.response?.data?.message ||
        "Failed to fetch products"
      );

    }

  };


  // ==============================
  // FETCH ALL ORDERS
  // ==============================

  const fetchOrders = async () => {

    try {

      setLoadingOrders(true);

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/orders/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setOrders(response.data);

    } catch (error) {

      console.log(
        error.response?.data?.message ||
        "Failed to fetch orders"
      );

    } finally {

      setLoadingOrders(false);

    }

  };


  useEffect(() => {

    fetchProducts();
    fetchOrders();

  }, []);


  // ==============================
  // HANDLE INPUT
  // ==============================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };


  // ==============================
  // ADD / UPDATE PRODUCT
  // ==============================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const token = localStorage.getItem("token");

      if (!token) {

        alert("Please login first");
        return;

      }


      if (editingId) {

        await axios.put(
          `http://localhost:5000/api/products/${editingId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        alert("Product updated successfully");

      } else {

        await axios.post(
          "http://localhost:5000/api/products",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        alert("Product added successfully");

      }


      // Reset form

      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
        stock: ""
      });

      setEditingId(null);
      setShowForm(false);

      fetchProducts();

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );

    }

  };


  // ==============================
  // EDIT PRODUCT
  // ==============================

  const handleEdit = (product) => {

    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      stock: product.stock
    });

    setEditingId(product._id);

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  };


  // ==============================
  // DELETE PRODUCT
  // ==============================

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;


    try {

      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Product deleted successfully");

      fetchProducts();

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Failed to delete product"
      );

    }

  };


  // ==============================
  // UPDATE ORDER STATUS
  // ==============================

  const updateOrderStatus = async (orderId, status) => {

    try {

      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/orders/admin/${orderId}/status`,
        {
          status
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Order status updated successfully");

      fetchOrders();

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Failed to update order status"
      );

    }

  };


  // ==============================
  // CANCEL EDIT
  // ==============================

  const handleCancel = () => {

    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
      stock: ""
    });

    setEditingId(null);
    setShowForm(false);

  };


  return (

    <div className="container py-5">

      {/* =========================
          HEADER
      ========================= */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <h1 className="fw-bold">
          Admin Dashboard
        </h1>

        <button
          className="btn btn-dark"
          onClick={() => {

            setShowForm(!showForm);
            setEditingId(null);

          }}
        >
          ➕ Add Product
        </button>

      </div>


      {/* =========================
          OVERVIEW CARDS
      ========================= */}

      <div className="row g-4 mb-5">


        {/* TOTAL PRODUCTS */}

        <div className="col-md-6 col-lg-3">

          <div className="card shadow-sm border-0 h-100">

            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center">

                <div>

                  <p className="text-muted mb-1">
                    Total Products
                  </p>

                  <h2 className="fw-bold mb-0">
                    {products.length}
                  </h2>

                </div>

                <div className="fs-1">
                  📦
                </div>

              </div>

            </div>

          </div>

        </div>


        {/* TOTAL ORDERS */}

        <div className="col-md-6 col-lg-3">

          <div className="card shadow-sm border-0 h-100">

            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center">

                <div>

                  <p className="text-muted mb-1">
                    Total Orders
                  </p>

                  <h2 className="fw-bold mb-0">
                    {orders.length}
                  </h2>

                </div>

                <div className="fs-1">
                  🛒
                </div>

              </div>

            </div>

          </div>

        </div>


        {/* PENDING ORDERS */}

        <div className="col-md-6 col-lg-3">

          <div className="card shadow-sm border-0 h-100">

            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center">

                <div>

                  <p className="text-muted mb-1">
                    Pending Orders
                  </p>

                  <h2 className="fw-bold mb-0">

                    {
                      orders.filter(
                        (order) =>
                          order.status === "Pending"
                      ).length
                    }

                  </h2>

                </div>

                <div className="fs-1">
                  ⏳
                </div>

              </div>

            </div>

          </div>

        </div>


        {/* DELIVERED ORDERS */}

        <div className="col-md-6 col-lg-3">

          <div className="card shadow-sm border-0 h-100">

            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center">

                <div>

                  <p className="text-muted mb-1">
                    Delivered Orders
                  </p>

                  <h2 className="fw-bold mb-0">

                    {
                      orders.filter(
                        (order) =>
                          order.status === "Delivered"
                      ).length
                    }

                  </h2>

                </div>

                <div className="fs-1">
                  ✅
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =========================
          PRODUCT FORM
      ========================= */}

      {showForm && (

        <div className="card shadow-sm p-4 mb-5">

          <h4 className="mb-4">
            {editingId
              ? "Edit Product"
              : "Add New Product"}
          </h4>


          <form onSubmit={handleSubmit}>

            <div className="row">


              <div className="col-md-6 mb-3">

                <label className="form-label">
                  Product Name
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


              <div className="col-md-6 mb-3">

                <label className="form-label">
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="col-md-6 mb-3">

                <label className="form-label">
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  className="form-control"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="col-md-6 mb-3">

                <label className="form-label">
                  Stock
                </label>

                <input
                  type="number"
                  name="stock"
                  className="form-control"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="col-12 mb-3">

                <label className="form-label">
                  Image URL
                </label>

                <input
                  type="text"
                  name="image"
                  className="form-control"
                  value={formData.image}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="col-12 mb-3">

                <label className="form-label">
                  Description
                </label>

                <textarea
                  name="description"
                  className="form-control"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>

              </div>

            </div>


            <button
              type="submit"
              className="btn btn-success me-2"
            >
              {editingId
                ? "Update Product"
                : "Add Product"}
            </button>


            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
            >
              Cancel
            </button>

          </form>

        </div>

      )}


      {/* =========================
          PRODUCTS
      ========================= */}

      <h3 className="mb-4">
        All Products ({products.length})
      </h3>


      <div className="row g-4">

        {products.map((product) => (

          <div
            className="col-md-6 col-lg-4"
            key={product._id}
          >

            <div className="card h-100 shadow-sm">

              <img
                src={product.image}
                alt={product.name}
                className="card-img-top"
                style={{
                  height: "220px",
                  objectFit: "cover"
                }}
              />


              <div className="card-body">

                <h5 className="fw-bold">
                  {product.name}
                </h5>

                <p className="text-muted">
                  {product.category}
                </p>

                <h5>
                  Rs. {product.price}
                </h5>

                <p>
                  Stock:{" "}
                  <strong>
                    {product.stock}
                  </strong>
                </p>


                <div className="d-flex gap-2">

                  <button
                    className="btn btn-warning"
                    onClick={() =>
                      handleEdit(product)
                    }
                  >
                    ✏️ Edit
                  </button>


                  <button
                    className="btn btn-danger"
                    onClick={() =>
                      handleDelete(product._id)
                    }
                  >
                    🗑️ Delete
                  </button>

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>


      {/* =========================
          ORDERS
      ========================= */}

      <div className="mt-5">

        <h3 className="mb-4">
          All Orders ({orders.length})
        </h3>


        {loadingOrders ? (

          <div className="alert alert-info">
            Loading orders...
          </div>

        ) : orders.length === 0 ? (

          <div className="alert alert-secondary">
            No orders found.
          </div>

        ) : (

          orders.map((order) => (

            <div
              className="card shadow-sm mb-4"
              key={order._id}
            >

              <div className="card-body">


                {/* ORDER HEADER */}

                <div className="d-flex justify-content-between align-items-start mb-3">

                  <div>

                    <h5 className="fw-bold">
                      Order #{order._id.slice(-6)}
                    </h5>

                    <p className="mb-1 text-muted">
                      Customer:{" "}
                      {order.user?.name}
                    </p>

                    <p className="mb-1 text-muted">
                      Email:{" "}
                      {order.user?.email}
                    </p>

                    <p className="mb-0 text-muted">
                      Date:{" "}
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString()}
                    </p>

                  </div>


                  {/* STATUS */}

                  <select
                    className="form-select"
                    style={{
                      width: "170px"
                    }}
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(
                        order._id,
                        e.target.value
                      )
                    }
                  >

                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Processing">
                      Processing
                    </option>

                    <option value="Shipped">
                      Shipped
                    </option>

                    <option value="Delivered">
                      Delivered
                    </option>

                    <option value="Cancelled">
                      Cancelled
                    </option>

                  </select>

                </div>


                <hr />


                {/* ORDER ITEMS */}

                <h6 className="fw-bold mb-3">
                  Ordered Products
                </h6>


                {order.items.map((item) => (

                  <div
                    key={item._id}
                    className="d-flex align-items-center mb-3"
                  >

                    <img
                      src={item.product?.image}
                      alt={item.product?.name}
                      width="70"
                      height="70"
                      className="rounded me-3"
                      style={{
                        objectFit: "cover"
                      }}
                    />


                    <div>

                      <h6 className="mb-1">
                        {item.product?.name}
                      </h6>

                      <p className="mb-0">
                        Quantity:{" "}
                        {item.quantity}
                      </p>

                      <p className="mb-0">
                        Price: Rs.{" "}
                        {item.price}
                      </p>

                    </div>

                  </div>

                ))}


                <hr />


                {/* SHIPPING */}

                <h6 className="fw-bold">
                  Shipping Information
                </h6>

                <p className="mb-1">
                  <strong>Name:</strong>{" "}
                  {order.shippingAddress.name}
                </p>

                <p className="mb-1">
                  <strong>Email:</strong>{" "}
                  {order.shippingAddress.email}
                </p>

                <p className="mb-1">
                  <strong>Phone:</strong>{" "}
                  {order.shippingAddress.phone}
                </p>

                <p className="mb-3">
                  <strong>Address:</strong>{" "}
                  {order.shippingAddress.address}
                </p>


                <hr />


                {/* TOTAL */}

                <h5 className="fw-bold">
                  Total: Rs.{" "}
                  {order.totalAmount}
                </h5>

              </div>

            </div>

          ))

        )}

      </div>

    </div>

  );

}

export default AdminDashboard;
