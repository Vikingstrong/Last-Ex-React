import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import { type AppDispatch, type RootState } from "../store/store";
import { getDataUser, updateUserProfile } from "../reducer/usersSlice";

export default function Profile() {
  const { t } = useTranslation();
  const localUserName = localStorage.getItem('userName')

  const userStore = useSelector((store:RootState) => store.userData)
  const dispatch = useDispatch<AppDispatch>()

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

  useEffect(() => {
    dispatch(getDataUser())
  }, [dispatch])

  useEffect(() => {
    const userInfo = userStore.data?.getUserInfo
    if (userInfo && Object.keys(userInfo).length > 0) {
      setFormData((prev) => ({
        ...prev,
        firstName: userInfo.firstName || prev.firstName || "",
        lastName: userInfo.lastName || prev.lastName || "",
        email: userInfo.email || prev.email || "",
        address: userInfo.address || userInfo.phoneNumber || prev.address || "",
      }))
    }
  }, [userStore.data?.getUserInfo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      alert(t('auth.passwordsMismatch'));
      return;
    }
    const updatePayload = {
      ...userStore.data.getUserInfo,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.address,
      ...(formData.newPassword ? { password: formData.newPassword } : {})
    };
    await dispatch(updateUserProfile(updatePayload));
    alert(t('profile.profileUpdated'));
  };

  const handleCancel = () => {
    const userInfo = userStore.data?.getUserInfo;
    setFormData({
      firstName: userInfo?.firstName || "",
      lastName: userInfo?.lastName || "",
      email: userInfo?.email || "",
      address: userInfo?.address || userInfo?.phoneNumber || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const displayName = formData.firstName
    ? `${formData.firstName} ${formData.lastName}`.trim()
    : (userStore.data?.getUserInfo?.userName || localUserName || "User");

  return (
    <main className="max-w-300 m-auto px-5 lg:px-0 py-8 flex flex-col gap-12 min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <NavLink to="/" className="hover:text-black transition">
            {t('header.home')}
          </NavLink>
          <span>/</span>
          <span className="font-semibold text-black">{t('profile.myProfile')}</span>
        </div>

        <p className="text-sm text-gray-700">
          {t('header.account')}: <span className="text-[#DB4444] font-medium">{displayName}</span>
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-16 items-start">
        <aside className="w-full lg:w-64 flex flex-col gap-6 shrink-0 select-none">
          <div className="flex flex-col gap-2">
            <h3 className="text-base font-bold text-gray-900">
              {t('profile.manageMyAccount')}
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
                {t('profile.myProfile')}
              </span>
              <span
                onClick={() => setActiveTab("address")}
                className={`cursor-pointer transition ${
                  activeTab === "address"
                    ? "text-[#DB4444] font-medium"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                {t('profile.addressBook')}
              </span>
              <span
                onClick={() => setActiveTab("payment")}
                className={`cursor-pointer transition ${
                  activeTab === "payment"
                    ? "text-[#DB4444] font-medium"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                {t('profile.myPaymentOptions')}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-base font-bold text-gray-900">
              {t('header.myOrder')}
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
                {t('profile.myReturns')}
              </span>
              <span
                onClick={() => setActiveTab("cancellations")}
                className={`cursor-pointer transition ${
                  activeTab === "cancellations"
                    ? "text-[#DB4444] font-medium"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                {t('profile.myCancellations')}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3
              onClick={() => setActiveTab("wishlist")}
              className={`text-base font-bold cursor-pointer transition ${
                activeTab === "wishlist"
                  ? "text-[#DB4444]"
                  : "text-gray-900 hover:text-[#DB4444]"
              }`}
            >
              {t('footer.wishlist')}
            </h3>
          </div>
        </aside>

        <div className="flex-1 w-full bg-white shadow-sm border border-gray-100 rounded-sm p-8 sm:p-12">
          <h2 className="text-xl font-semibold text-[#DB4444] mb-6">
            {t('profile.editYourProfile')}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-gray-700 font-medium">
                  {t('profile.firstName')}
                </label>
                <input
                  type="text"
                  placeholder={t('profile.firstName')}
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="bg-[#F5F5F5] rounded px-4 py-3 text-sm outline-none text-gray-800 focus:ring-1 focus:ring-[#DB4444]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-gray-700 font-medium">
                  {t('profile.lastName')}
                </label>
                <input
                  type="text"
                  placeholder={t('profile.lastName')}
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="bg-[#F5F5F5] rounded px-4 py-3 text-sm outline-none text-gray-800 focus:ring-1 focus:ring-[#DB4444]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-gray-700 font-medium">
                  {t('profile.email')}
                </label>
                <input
                  type="email"
                  placeholder={t('profile.email')}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="bg-[#F5F5F5] rounded px-4 py-3 text-sm outline-none text-gray-800 focus:ring-1 focus:ring-[#DB4444]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-gray-700 font-medium">
                  {t('profile.address')} / {t('profile.phoneNumber')}
                </label>
                <input
                  type="text"
                  placeholder={t('profile.address')}
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="bg-[#F5F5F5] rounded px-4 py-3 text-sm outline-none text-gray-800 focus:ring-1 focus:ring-[#DB4444]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-2">
              <h3 className="text-base font-medium text-gray-900">
                {t('profile.passwordChanges')}
              </h3>

              <input
                type="password"
                placeholder={t('profile.currentPassword')}
                value={formData.currentPassword}
                onChange={(e) =>
                  setFormData({ ...formData, currentPassword: e.target.value })
                }
                className="w-full bg-[#F5F5F5] rounded px-4 py-3 text-sm outline-none text-gray-800 focus:ring-1 focus:ring-[#DB4444]"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input
                  type="password"
                  placeholder={t('profile.newPassword')}
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                  className="w-full bg-[#F5F5F5] rounded px-4 py-3 text-sm outline-none text-gray-800 focus:ring-1 focus:ring-[#DB4444]"
                />
                <input
                  type="password"
                  placeholder={t('profile.confirmNewPassword')}
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

            <div className="flex items-center justify-end gap-6 mt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="text-sm font-medium text-gray-700 hover:text-black transition cursor-pointer"
              >
                {t('profile.cancel')}
              </button>
              <button
                type="submit"
                className="bg-[#DB4444] text-white px-10 py-3.5 rounded font-medium text-sm hover:bg-[#c0392b] transition cursor-pointer"
              >
                {t('profile.saveChanges')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
