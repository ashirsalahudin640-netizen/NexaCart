import React, { useEffect, useState } from "react";
import axios from "axios";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/orders/my-orders",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setOrders(response.data);

      } catch (error) {
        console.log(
          error.response?.data?.message || "Failed to load orders"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="container mt-5">
        <h3>Loading orders...</h3>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">My Orders</h2>

      {orders.length === 0 ? (
        <div className="alert alert-info">
          You have no orders yet.
        </div>
      ) : (
        orders.map((order) => (
          <div className="card mb-4" key={order._id}>
            <div className="card-body">

              <div className="d-flex justify-content-between">
                <div>
                  <h5>Order #{order._id.slice(-6)}</h5>

                  <p className="text-muted mb-1">
                    Date:{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <span className="badge bg-warning text-dark">
                  {order.status}
                </span>
              </div>

              <hr />

              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="d-flex align-items-center mb-3"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    width="70"
                    height="70"
                    style={{ objectFit: "cover" }}
                    className="rounded me-3"
                  />

                  <div>
                    <h6 className="mb-1">
                      {item.product.name}
                    </h6>

                    <p className="mb-0">
                      Quantity: {item.quantity}
                    </p>

                    <p className="mb-0">
                      Price: Rs. {item.price}
                    </p>
                  </div>
                </div>
              ))}

              <hr />

              <h5>
                Total: Rs. {order.totalAmount}
              </h5>

            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MyOrders;
