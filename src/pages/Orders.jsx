import React, { useEffect, useState } from "react";
import { CheckCircle, Clock, Truck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

/**
 * Orders.jsx
 * - Uses user.role (like Profile) as the primary admin detection
 * - Falls back to user.groups or token's cognito:groups
 * - Admin -> show all orders + show order email/user info
 * - Member -> show only orders that belong to current user (by sub or email) and hide emails
 * - Tracking UI: Truck stays on Inventory 1
 */

function decodeJwtPayload(token) {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = parts[1];
    const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(b64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

export default function Orders() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  const getCurrentUserId = () => {
    const subFromCtx = user?.signInUserSession?.idToken?.payload?.sub || null;
    if (subFromCtx) return subFromCtx;

    const idToken = localStorage.getItem("idToken");
    if (idToken) {
      const payload = decodeJwtPayload(idToken);
      if (payload?.sub) return payload.sub;
    }

    if (user?.username) return user.username;

    return null;
  };

  const getCurrentUserEmail = () => {
    const emailFromCtx =
      user?.attributes?.email ||
      user?.email ||
      user?.signInUserSession?.idToken?.payload?.email ||
      null;
    if (emailFromCtx) return emailFromCtx;

    const idToken = localStorage.getItem("idToken");
    if (idToken) {
      const payload = decodeJwtPayload(idToken);
      if (payload?.email) return payload.email;
    }
    return null;
  };

  const currentUserId = getCurrentUserId();
  const currentUserEmail = getCurrentUserEmail();

  // === Admin detection: follow the same pattern as your Profile component ===
  // 1) Prefer explicit role stored on user (e.g. user.role === 'admin')
  // 2) Then check user.groups (AuthProvider may populate this)
  // 3) Finally check token payload cognito:groups
  const tokenGroups =
    decodeJwtPayload(localStorage.getItem("idToken") || "")?.["cognito:groups"] ||
    [];
  const userGroups = user?.groups || user?.signInUserSession?.idToken?.payload?.["cognito:groups"] || [];

  const isAdmin =
    user?.role === "admin" ||
    (Array.isArray(userGroups) && userGroups.includes("admin")) ||
    (Array.isArray(tokenGroups) && tokenGroups.includes("admin"));

  // Helpful debug logs (remove or comment out in production)
  console.log("Orders.jsx debug -> user.role:", user?.role);
  console.log("Orders.jsx debug -> user.groups:", userGroups);
  console.log("Orders.jsx debug -> tokenGroups:", tokenGroups);
  console.log("Orders.jsx debug -> isAdmin:", isAdmin);
  console.log("Orders.jsx debug -> currentUserId / Email:", currentUserId, currentUserEmail);

  useEffect(() => {
    if (authLoading) return;

    const raw = JSON.parse(localStorage.getItem("orders") || "[]");

    if (isAdmin) {
      setOrders([...raw].reverse());
      return;
    }

    if (!currentUserId && !currentUserEmail) {
      setOrders([]);
      return;
    }

    const mine = raw
      .filter((o) => {
        if (o.userId && currentUserId) {
          if (o.userId === currentUserId) return true;
        }
        if (o.userEmail && currentUserEmail) {
          if (o.userEmail.toLowerCase() === currentUserEmail.toLowerCase())
            return true;
        }
        if (o.userName && user?.username) {
          if (o.userName === user.username) return true;
        }
        return false;
      })
      .reverse();

    setOrders(mine);
  }, [authLoading, isAdmin, currentUserId, currentUserEmail, user]);

  if (authLoading) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center text-gray-600">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-300 mx-auto mb-4" />
        <p>Checking authentication…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center text-gray-600">
        <h2 className="text-2xl font-bold mb-2">Not Signed In</h2>
        <p className="mb-4">Please sign in to view your orders.</p>

        <div className="space-x-3">
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-gray-200 hover:bg-gray-300 px-5 py-2 rounded"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center text-gray-600">
        <h2 className="text-2xl font-bold mb-2">No Orders Yet</h2>
        <p>Your placed orders will appear here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {isAdmin ? "All Orders (Admin)" : "My Orders"}
      </h1>

      <div className="space-y-8">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border border-gray-200 rounded-xl shadow-sm bg-white p-6 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold">Order #{order.id}</h2>
                <p className="text-sm text-gray-500">
                  Placed on {new Date(order.date).toLocaleString()}
                </p>

                {isAdmin && (
                  <p className="text-xs text-gray-600 mt-1">
                    <span className="font-medium">Email:</span>{" "}
                    {order.userEmail || order.userName || "—"}
                    {order.userId ? (
                      <span className="ml-3 text-gray-400">({order.userId})</span>
                    ) : null}
                  </p>
                )}
              </div>

              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {order.status === "pending" ? "Pending" : "Confirmed"}
              </span>
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              {order.items?.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between text-gray-700 text-sm"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>
                    ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between border-t border-gray-200 pt-3 font-semibold">
              <span>Total</span>
              <span>${(order.total || 0).toFixed(2)}</span>
            </div>

            <div className="mt-6">
              <h3 className="text-gray-700 font-medium mb-3">Tracking</h3>

              <div className="flex items-center justify-between text-center">
                <div className="flex flex-col items-center">
                  <div className="text-blue-600">
                    <Truck className="h-7 w-7 mb-1" />
                  </div>
                  <span className="text-xs font-semibold text-blue-700">
                    Inventory 1 (Currently)
                  </span>
                </div>

                <div className="flex-1 h-[2px] bg-gray-300 mx-2" />

                <div className="flex flex-col items-center opacity-40">
                  <CheckCircle className="h-6 w-6 mb-1 text-gray-400" />
                  <span className="text-xs text-gray-500">Inventory 2</span>
                </div>

                <div className="flex-1 h-[2px] bg-gray-300 mx-2" />

                <div className="flex flex-col items-center opacity-40">
                  <Clock className="h-6 w-6 mb-1 text-gray-400" />
                  <span className="text-xs text-gray-500">Home</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 text-center mt-2">
                Your order is currently at Inventory 1.
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
