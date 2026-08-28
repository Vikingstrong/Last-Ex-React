import { useState } from "react";
import { NavLink } from "react-router";

export default function Profile() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [activeTab, setActiveTab] = useState<string>("profile");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Profile changes saved successfully!");
  };

  const handleCancel = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const displayName = formData.firstName
    ? `${formData.firstName} ${formData.lastName}`.trim()
    : "name";

  return (
    <main className="max-w-300 m-auto px-5 lg:px-0 py-8 flex flex-col gap-12 min-h-screen">
      {/* 1. Top Breadcrumb & Welcome Greeting */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <NavLink to="/" className="hover:text-black transition">
            Home
          </NavLink>
          <span>/</span>
          <span className="font-semibold text-black">My Account</span>
        </div>

        <p className="text-sm text-gray-700">
          Hello <span className="text-[#DB4444] font-medium">{displayName}</span>
        </p>
      </div>

      {/* 2. Main Content Layout: Sidebar + Form */}
      <div className="flex flex-col lg:flex-row gap-16 items-start">
        
        {/* Left Sidebar Navigation */}
        <aside className="w-full lg:w-64 flex flex-col gap-6 shrink-0 select-none">
          {/* Manage My Account */}
          <div className="flex flex-col gap-2">
            <h3 className="text-base font-bold text-gray-900">
              Manage My Account
            </h3>
            <div className="flex flex-col gap-2 pl-6 text-sm">
              <span
                onClick={() => setActiveTab("profile")}
                className={`cursor-pointer transition ${
                  activeTab === "profile"
                    ? "text-[#DB4444] font-medium"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                My Profile
              </span>
              <span
                onClick={() => setActiveTab("address")}
                className={`cursor-pointer transition ${
                  activeTab === "address"
                    ? "text-[#DB4444] font-medium"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                Address Book
              </span>
              <span
                onClick={() => setActiveTab("payment")}
                className={`cursor-pointer transition ${
                  activeTab === "payment"
                    ? "text-[#DB4444] font-medium"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                My Payment Options
              </span>
            </div>
          </div>

          {/* My Orders */}
          <div className="flex flex-col gap-2">
            <h3 className="text-base font-bold text-gray-900">
              My Orders
            </h3>
            <div className="flex flex-col gap-2 pl-6 text-sm">
              <span
                onClick={() => setActiveTab("returns")}
                className={`cursor-pointer transition ${
                  activeTab === "returns"
                    ? "text-[#DB4444] font-medium"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                My Returns
              </span>
              <span
                onClick={() => setActiveTab("cancellations")}
                className={`cursor-pointer transition ${
                  activeTab === "cancellations"
                    ? "text-[#DB4444] font-medium"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                My Cancellations
              </span>
            </div>
          </div>

          {/* My WishList */}
          <div className="flex flex-col gap-2">
            <h3
              onClick={() => setActiveTab("wishlist")}
              className={`text-base font-bold cursor-pointer transition ${
                activeTab === "wishlist"
                  ? "text-[#DB4444]"
                  : "text-gray-900 hover:text-[#DB4444]"
              }`}
            >
              My WishList
            </h3>
          </div>
        </aside>

        {/* Right Form Card */}
        <div className="flex-1 w-full bg-white shadow-sm border border-gray-100 rounded-sm p-8 sm:p-12">
          <h2 className="text-xl font-semibold text-[#DB4444] mb-6">
            Profile
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* 2 Column Personal Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-gray-700 font-medium">
                  First name
                </label>
                <input
                  type="text"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="bg-[#F5F5F5] rounded px-4 py-3 text-sm outline-none text-gray-800 focus:ring-1 focus:ring-[#DB4444]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-gray-700 font-medium">
                  Last name
                </label>
                <input
                  type="text"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="bg-[#F5F5F5] rounded px-4 py-3 text-sm outline-none text-gray-800 focus:ring-1 focus:ring-[#DB4444]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-gray-700 font-medium">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="bg-[#F5F5F5] rounded px-4 py-3 text-sm outline-none text-gray-800 focus:ring-1 focus:ring-[#DB4444]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-gray-700 font-medium">
                  Street address
                </label>
                <input
                  type="text"
                  placeholder="Street address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="bg-[#F5F5F5] rounded px-4 py-3 text-sm outline-none text-gray-800 focus:ring-1 focus:ring-[#DB4444]"
                />
              </div>
            </div>

            {/* Password Changes Section */}
            <div className="flex flex-col gap-4 mt-2">
              <h3 className="text-base font-medium text-gray-900">
                Password Changes
              </h3>

              <input
                type="password"
                placeholder="Current password"
                value={formData.currentPassword}
                onChange={(e) =>
                  setFormData({ ...formData, currentPassword: e.target.value })
                }
                className="w-full bg-[#F5F5F5] rounded px-4 py-3 text-sm outline-none text-gray-800 focus:ring-1 focus:ring-[#DB4444]"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input
                  type="password"
                  placeholder="New password"
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                  className="w-full bg-[#F5F5F5] rounded px-4 py-3 text-sm outline-none text-gray-800 focus:ring-1 focus:ring-[#DB4444]"
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full bg-[#F5F5F5] rounded px-4 py-3 text-sm outline-none text-gray-800 focus:ring-1 focus:ring-[#DB4444]"
                />
              </div>
            </div>

            {/* Buttons: Cancel & Save Changes */}
            <div className="flex items-center justify-end gap-6 mt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="text-sm font-medium text-gray-700 hover:text-black transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#DB4444] text-white px-10 py-3.5 rounded font-medium text-sm hover:bg-[#c0392b] transition cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>

      </div>
    </main>
  );
}
