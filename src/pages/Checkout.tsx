import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink, useNavigate } from "react-router"
import { useTranslation } from "react-i18next"
import { CheckCircle2, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react"
import { type AppDispatch, type RootState } from "../store/store"
import { getProductsFromCart, clearCart } from "../reducer/cartSlice"
import { getDataUser } from "../reducer/usersSlice"
import { getAdminImageUrl } from "./Admin/AdminLayout"

export default function Checkout() {
    const { t } = useTranslation()
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()

    const rawToken = localStorage.getItem('token')
    const token = rawToken && rawToken !== 'undefined' && rawToken !== 'null' ? rawToken : null

    const cartStore = useSelector((store: RootState) => store.cart)
    const userStore = useSelector((store: RootState) => store.userData)
    const userInfo = userStore.data?.getUserInfo

    const [paymentMethod, setPaymentMethod] = useState<"bank" | "cod">("cod")
    const [couponCode, setCouponCode] = useState("")
    const [couponApplied, setCouponApplied] = useState(false)
    const [saveInfo, setSaveInfo] = useState(true)
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
    const [placedOrderInfo, setPlacedOrderInfo] = useState<any>(null)

    const [billingData, setBillingData] = useState({
        firstName: "",
        lastName: "",
        streetAddress: "",
        apartment: "",
        city: "Dushanbe",
        phoneNumber: "",
        email: ""
    })

    useEffect(() => {
        if (token) {
            dispatch(getProductsFromCart())
            if (!userInfo?.userName) {
                dispatch(getDataUser())
            }
        }
    }, [token, userInfo?.userName, dispatch])

    useEffect(() => {
        if (userInfo) {
            setBillingData((prev) => ({
                ...prev,
                firstName: userInfo.firstName || prev.firstName || "",
                lastName: userInfo.lastName || prev.lastName || "",
                email: userInfo.email || prev.email || "",
                phoneNumber: userInfo.phoneNumber || prev.phoneNumber || "",
                streetAddress: userInfo.address || prev.streetAddress || ""
            }))
        }
    }, [userInfo])

    const cartItems = cartStore.items || []

    const subtotal = cartItems.reduce((acc, item) => {
        const p = item.product || item || {}
        const price = (p.hasDiscount && p.discountPrice && p.discountPrice > 0)
            ? p.discountPrice
            : (p.price ?? item.price ?? 0)
        const qty = item.quantity ?? item.productCount ?? item.count ?? 1
        return acc + price * qty
    }, 0)

    const discountAmount = couponApplied ? subtotal * 0.1 : 0
    const finalTotal = Math.max(0, subtotal - discountAmount)

    const handleApplyCoupon = (e: React.FormEvent) => {
        e.preventDefault()
        if (couponCode.trim()) {
            setCouponApplied(true)
        }
    }

    const handlePlaceOrder = (e: React.FormEvent) => {
        e.preventDefault()
        if (cartItems.length === 0) return

        const orderDetails = {
            orderNumber: "ORD-" + Math.floor(100000 + Math.random() * 900000),
            date: new Date().toLocaleDateString(),
            itemsCount: cartItems.reduce((sum, it) => sum + (it.quantity || it.productCount || 1), 0),
            total: finalTotal,
            paymentMethod: paymentMethod === 'bank' ? 'Банковская карта (Online)' : 'Оплата при получении (Cash on delivery)',
            customer: billingData
        }

        setPlacedOrderInfo(orderDetails)
        setIsSuccessModalOpen(true)
    }

    const handleFinishOrder = async () => {
        await dispatch(clearCart())
        setIsSuccessModalOpen(false)
        navigate('/')
    }

    if (!token) {
        return (
            <main className="max-w-300 m-auto px-5 lg:px-0 py-16 flex flex-col items-center justify-center gap-6 min-h-[60vh]">
                <div className="w-20 h-20 rounded-full bg-red-50 text-[#DB4444] flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                    Войдите для оформления заказа
                </h2>
                <NavLink
                    to="/login"
                    className="bg-[#DB4444] text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-red-700 transition"
                >
                    {t('auth.logIn')}
                </NavLink>
            </main>
        )
    }

    return (
        <main className="max-w-300 m-auto px-5 lg:px-0 py-10 flex flex-col gap-12 min-h-screen">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <NavLink to="/profile" className="hover:text-black transition">
                    Account
                </NavLink>
                <span>/</span>
                <NavLink to="/profile" className="hover:text-black transition">
                    My Account
                </NavLink>
                <span>/</span>
                <NavLink to="/catalog" className="hover:text-black transition">
                    Product
                </NavLink>
                <span>/</span>
                <NavLink to="/cart" className="hover:text-black transition">
                    View Cart
                </NavLink>
                <span>/</span>
                <span className="font-semibold text-black">CheckOut</span>
            </div>

            {cartItems.length === 0 && !isSuccessModalOpen ? (
                <div className="flex flex-col items-center justify-center gap-6 py-20 text-center bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="w-20 h-20 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center">
                        <ShoppingBag className="w-10 h-10" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">В корзине нет товаров для оформления</h2>
                        <p className="text-gray-500 text-sm mt-1">Добавьте товары из каталога перед оформлением заказа</p>
                    </div>
                    <NavLink
                        to="/catalog"
                        className="bg-[#DB4444] text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                    >
                        Перейти в каталог
                    </NavLink>
                </div>
            ) : (
                <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                    {/* Left Column: Billing Details */}
                    <div className="lg:col-span-6 flex flex-col gap-6">
                        <h1 className="text-3xl lg:text-4xl font-semibold text-gray-900 tracking-tight">
                            Billing Details
                        </h1>

                        <div className="flex flex-col gap-5 mt-2">
                            {/* First Name */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-600">
                                    First name <span className="text-[#DB4444]">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={billingData.firstName}
                                    onChange={(e) => setBillingData({ ...billingData, firstName: e.target.value })}
                                    className="bg-[#F5F5F5] rounded px-4 py-3 text-sm outline-none text-gray-800 focus:ring-1 focus:ring-[#DB4444] transition"
                                />
                            </div>

                            {/* Last Name */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-600">
                                    Last name <span className="text-[#DB4444]">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={billingData.lastName}
                                    onChange={(e) => setBillingData({ ...billingData, lastName: e.target.value })}
                                    className="bg-[#F5F5F5] rounded px-4 py-3 text-sm outline-none text-gray-800 focus:ring-1 focus:ring-[#DB4444] transition"
                                />
                            </div>

                            {/* Street Address */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-600">
                                    Street address <span className="text-[#DB4444]">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={billingData.streetAddress}
                                    onChange={(e) => setBillingData({ ...billingData, streetAddress: e.target.value })}
                                    className="bg-[#F5F5F5] rounded px-4 py-3 text-sm outline-none text-gray-800 focus:ring-1 focus:ring-[#DB4444] transition"
                                />
                            </div>

                            {/* Apartment, floor, etc. (optional) */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-600">
                                    Apartment, floor, etc. (optional)
                                </label>
                                <input
                                    type="text"
                                    value={billingData.apartment}
                                    onChange={(e) => setBillingData({ ...billingData, apartment: e.target.value })}
                                    className="bg-[#F5F5F5] rounded px-4 py-3 text-sm outline-none text-gray-800 focus:ring-1 focus:ring-[#DB4444] transition"
                                />
                            </div>

                            {/* Town/City */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-600">
                                    Town/City <span className="text-[#DB4444]">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={billingData.city}
                                    onChange={(e) => setBillingData({ ...billingData, city: e.target.value })}
                                    className="bg-[#F5F5F5] rounded px-4 py-3 text-sm outline-none text-gray-800 focus:ring-1 focus:ring-[#DB4444] transition"
                                />
                            </div>

                            {/* Phone number */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-600">
                                    Phone number <span className="text-[#DB4444]">*</span>
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={billingData.phoneNumber}
                                    onChange={(e) => setBillingData({ ...billingData, phoneNumber: e.target.value })}
                                    className="bg-[#F5F5F5] rounded px-4 py-3 text-sm outline-none text-gray-800 focus:ring-1 focus:ring-[#DB4444] transition"
                                />
                            </div>

                            {/* Email address */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-600">
                                    Email address <span className="text-[#DB4444]">*</span>
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={billingData.email}
                                    onChange={(e) => setBillingData({ ...billingData, email: e.target.value })}
                                    className="bg-[#F5F5F5] rounded px-4 py-3 text-sm outline-none text-gray-800 focus:ring-1 focus:ring-[#DB4444] transition"
                                />
                            </div>

                            {/* Checkbox */}
                            <label className="flex items-center gap-3 cursor-pointer select-none mt-2">
                                <input
                                    type="checkbox"
                                    checked={saveInfo}
                                    onChange={(e) => setSaveInfo(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-[#DB4444] focus:ring-[#DB4444] accent-[#DB4444] cursor-pointer"
                                />
                                <span className="text-sm text-gray-800">
                                    Save this information for faster check-out next time
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Right Column: Order Summary & Payment */}
                    <div className="lg:col-span-6 flex flex-col gap-8 pt-4 lg:pt-12">
                        {/* Items List */}
                        <div className="flex flex-col gap-4 max-h-72 overflow-y-auto pr-2">
                            {cartItems.map((item, idx) => {
                                const p = item.product || item || {}
                                const rawImg = p.image || p.images?.[0]?.images || item.image || ""
                                const imgSrc = rawImg ? getAdminImageUrl(rawImg) : ""
                                const price = (p.hasDiscount && p.discountPrice && p.discountPrice > 0)
                                    ? p.discountPrice
                                    : (p.price ?? item.price ?? 0)
                                const qty = item.quantity ?? item.productCount ?? item.count ?? 1
                                const displayName = p.productName || item.productName || `Товар #${item.productId || item.id || idx + 1}`

                                return (
                                    <div key={item.id || idx} className="flex items-center justify-between gap-4 py-2 border-b border-gray-100 last:border-0">
                                        <div className="flex items-center gap-4">
                                            {imgSrc ? (
                                                <img 
                                                    src={imgSrc} 
                                                    alt={displayName} 
                                                    className="w-12 h-12 object-contain rounded bg-gray-50 border shrink-0" 
                                                    onError={(e) => {
                                                        const targetEl = e.currentTarget;
                                                        if (!targetEl.dataset.triedFallback) {
                                                            targetEl.dataset.triedFallback = "true";
                                                            targetEl.src = targetEl.src.includes("/images/") 
                                                                ? targetEl.src.replace("/images/", "/swagger/images/") 
                                                                : targetEl.src.replace("/swagger/images/", "/images/");
                                                        } else {
                                                            targetEl.style.display = "none";
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400 shrink-0">
                                                    <ShoppingBag className="w-5 h-5" />
                                                </div>
                                            )}
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-800 line-clamp-1 max-w-64">
                                                    {displayName}
                                                </span>
                                                <span className="text-xs text-gray-400">Кол-во: {qty}</span>
                                            </div>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900 shrink-0">
                                            ${(price * qty).toFixed(2)}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Cost Totals */}
                        <div className="flex flex-col gap-3 text-sm text-gray-800 border-t border-gray-200 pt-4">
                            <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span className="font-semibold">${subtotal.toFixed(2)}</span>
                            </div>
                            {couponApplied && (
                                <div className="flex justify-between text-emerald-600 font-medium">
                                    <span>Скидка по купону (10%):</span>
                                    <span>-${discountAmount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between border-b border-gray-200 pb-3">
                                <span>Shipping:</span>
                                <span className="font-semibold text-emerald-600">Free</span>
                            </div>
                            <div className="flex justify-between text-base font-bold text-gray-900 pt-1">
                                <span>Total:</span>
                                <span className="text-xl text-[#DB4444]">${finalTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Payment Method Selector */}
                        <div className="flex flex-col gap-4 mt-2">
                            {/* Bank Option */}
                            <label className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-gray-50 border border-gray-200 transition">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="bank"
                                        checked={paymentMethod === "bank"}
                                        onChange={() => setPaymentMethod("bank")}
                                        className="w-4 h-4 text-[#DB4444] accent-[#DB4444] cursor-pointer"
                                    />
                                    <span className="text-sm font-medium text-gray-800">Bank</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-bold rounded">Bkash</span>
                                    <span className="px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-600 text-[10px] font-bold rounded">VISA</span>
                                    <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-600 text-[10px] font-bold rounded">MasterCard</span>
                                    <span className="px-2 py-0.5 bg-orange-50 border border-orange-200 text-orange-600 text-[10px] font-bold rounded">Nagad</span>
                                </div>
                            </label>

                            {/* Cash On Delivery Option */}
                            <label className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-gray-50 border border-gray-200 transition">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cod"
                                        checked={paymentMethod === "cod"}
                                        onChange={() => setPaymentMethod("cod")}
                                        className="w-4 h-4 text-[#DB4444] accent-[#DB4444] cursor-pointer"
                                    />
                                    <span className="text-sm font-medium text-gray-800">Cash on delivery</span>
                                </div>
                            </label>
                        </div>

                        {/* Coupon Section */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-2">
                            <input
                                type="text"
                                placeholder="Coupon Code"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-4 py-3 text-sm outline-none focus:border-[#DB4444] transition"
                            />
                            <button
                                type="button"
                                onClick={handleApplyCoupon}
                                className="px-8 py-3 bg-[#DB4444] text-white rounded font-medium text-sm hover:bg-[#c0392b] transition cursor-pointer"
                            >
                                Apply
                            </button>
                        </div>

                        {/* Place Order Button */}
                        <button
                            type="submit"
                            className="bg-[#DB4444] text-white py-4 rounded font-medium text-sm hover:bg-[#c0392b] transition cursor-pointer text-center w-full sm:w-48 shadow-sm tracking-wide"
                        >
                            Place Order
                        </button>
                    </div>
                </form>
            )}

            {/* Custom Modal Dialog: Purchase Completed */}
            {isSuccessModalOpen && placedOrderInfo && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl flex flex-col items-center text-center gap-6 border border-gray-100 animate-in zoom-in-95 duration-300">
                        {/* Green Success Icon */}
                        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                            <CheckCircle2 className="w-12 h-12 stroke-[2.2]" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <h3 className="text-2xl font-bold text-gray-900">
                                Покупка успешно оформлена!
                            </h3>
                            <p className="text-sm text-gray-500">
                                Спасибо за ваш заказ! Мы уже начали его комплектацию и скоро свяжемся с вами.
                            </p>
                        </div>

                        {/* Order Details summary */}
                        <div className="w-full bg-gray-50 rounded-xl p-4 flex flex-col gap-2.5 text-xs text-gray-700 border border-gray-100">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Номер заказа:</span>
                                <span className="font-bold text-gray-900">{placedOrderInfo.orderNumber}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Товаров в заказе:</span>
                                <span className="font-semibold text-gray-800">{placedOrderInfo.itemsCount} шт.</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Способ оплаты:</span>
                                <span className="font-semibold text-gray-800">{placedOrderInfo.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between border-t border-gray-200 pt-2 text-sm font-bold text-gray-900">
                                <span>Сумма к оплате:</span>
                                <span className="text-[#DB4444]">${placedOrderInfo.total.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span>Безопасная оплата и гарантия возврата</span>
                        </div>

                        {/* Action: Go to Main page */}
                        <button
                            type="button"
                            onClick={handleFinishOrder}
                            className="w-full bg-[#DB4444] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#c0392b] transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-red-100"
                        >
                            <span>Перейти на главную</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </main>
    )
}
