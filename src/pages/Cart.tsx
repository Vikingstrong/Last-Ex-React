import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink, useNavigate } from "react-router"
import { useTranslation } from "react-i18next"
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react"
import { type AppDispatch, type RootState } from "../store/store"
import { 
    getProductsFromCart, 
    increaseProductInCart, 
    reduceProductInCart, 
    deleteProductFromCart, 
    clearCart,
    type CartItemTarget
} from "../reducer/cartSlice"
import { getAdminImageUrl } from "./Admin/AdminLayout"

export default function Cart() {
    const { t } = useTranslation()
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()

    const rawToken = localStorage.getItem('token')
    const token = rawToken && rawToken !== 'undefined' && rawToken !== 'null' ? rawToken : null

    const cartStore = useSelector((store: RootState) => store.cart)

    useEffect(() => {
        if (token) {
            dispatch(getProductsFromCart())
        }
    }, [token, dispatch])

    const handleIncrease = (target: CartItemTarget) => {
        dispatch(increaseProductInCart(target))
    }

    const handleReduce = (target: CartItemTarget, currentQty: number) => {
        if (currentQty <= 1) {
            if (confirm(t('admin.delete') + "?")) {
                dispatch(deleteProductFromCart(target))
            }
        } else {
            dispatch(reduceProductInCart(target))
        }
    }

    const handleDelete = (target: CartItemTarget) => {
        dispatch(deleteProductFromCart(target))
    }

    const handleClearCart = () => {
        if (confirm("Очистить всю корзину? / Clear entire cart?")) {
            dispatch(clearCart())
        }
    }

    const cartItems = cartStore.items || []

    // Calculate subtotal
    const subtotal = cartItems.reduce((acc, item) => {
        const p = item.product || item || {}
        const price = (p.hasDiscount && p.discountPrice && p.discountPrice > 0) 
            ? p.discountPrice 
            : (p.price ?? item.price ?? 0)
        const qty = item.quantity ?? item.productCount ?? item.count ?? 1
        return acc + price * qty
    }, 0)

    if (!token) {
        return (
            <main className="max-w-300 m-auto px-5 lg:px-0 py-16 flex flex-col items-center justify-center gap-6 min-h-[60vh]">
                <div className="w-20 h-20 rounded-full bg-red-50 text-[#DB4444] flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10" />
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    Войдите для просмотра корзины
                </h2>
                <p className="text-gray-500 text-center max-w-md">
                    Чтобы просмотреть добавленные товары и оформить заказ, пожалуйста, войдите в свой аккаунт.
                </p>
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
        <main className="max-w-300 m-auto px-4 lg:px-0 py-8 pb-24 lg:pb-12 flex flex-col gap-12 min-h-screen">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <NavLink to="/" className="hover:text-black transition">
                    {t('header.home')}
                </NavLink>
                <span>/</span>
                <span className="font-semibold text-black">{t('footer.cart')}</span>
            </div>

            {cartStore.loading && cartItems.length === 0 ? (
                <div className="py-20 text-center text-gray-500 animate-pulse text-lg font-medium">
                    Загрузка корзины...
                </div>
            ) : cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-6 py-20 text-center bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="w-20 h-20 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center">
                        <ShoppingBag className="w-10 h-10" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Ваша корзина пуста</h2>
                        <p className="text-gray-500 text-sm mt-1">Добавьте понравившиеся товары из каталога</p>
                    </div>
                    <NavLink
                        to="/catalog"
                        className="bg-[#DB4444] text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" /> Перейти в каталог
                    </NavLink>
                </div>
            ) : (
                <div className="flex flex-col gap-8">
                    {/* Cart Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#F5F5F5] border-b border-gray-200 text-gray-700">
                                <tr>
                                    <th className="py-4 px-6 font-semibold">Товар</th>
                                    <th className="py-4 px-6 font-semibold">Цена</th>
                                    <th className="py-4 px-6 font-semibold">Количество</th>
                                    <th className="py-4 px-6 font-semibold">Итого</th>
                                    <th className="py-4 px-6 text-right font-semibold">Удалить</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((item, idx) => {
                                    const p = item.product || item || {}
                                    const cartItemId = item.id
                                    const productId = item.productId || item.product?.id || (p.id !== cartItemId ? p.id : undefined)
                                    const target: CartItemTarget = { cartItemId, productId: productId || cartItemId }
                                    
                                    const rawImg = p.image || p.images?.[0]?.images || item.image || ""
                                    const imgSrc = rawImg ? getAdminImageUrl(rawImg) : ""
                                    const currentPrice = (p.hasDiscount && p.discountPrice && p.discountPrice > 0) 
                                        ? p.discountPrice 
                                        : (p.price ?? item.price ?? 0)
                                    const quantity = item.quantity ?? item.productCount ?? item.count ?? 1
                                    const itemTotal = currentPrice * quantity
                                    const displayName = p.productName || item.productName || (productId ? `Товар #${productId}` : `Товар #${cartItemId || idx + 1}`)

                                    return (
                                        <tr key={item.id || idx} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                            {/* Product Info */}
                                            <td className="py-4 px-6">
                                                <div 
                                                    onClick={() => {
                                                        const navId = productId || cartItemId
                                                        if (navId) navigate(`/product/${navId}`)
                                                    }}
                                                    className="flex items-center gap-4 cursor-pointer group"
                                                >
                                                    {imgSrc ? (
                                                        <img 
                                                            src={imgSrc} 
                                                            alt={displayName} 
                                                            className="w-14 h-14 object-contain rounded-md bg-gray-50 border shrink-0"
                                                            onError={(e) => {
                                                                const targetEl = e.currentTarget;
                                                                if (!targetEl.dataset.triedFallback) {
                                                                    targetEl.dataset.triedFallback = "true";
                                                                    if (targetEl.src.includes("/images/") && !targetEl.src.includes("/swagger/images/")) {
                                                                        targetEl.src = targetEl.src.replace("/images/", "/swagger/images/");
                                                                    } else if (targetEl.src.includes("/swagger/images/")) {
                                                                        targetEl.src = targetEl.src.replace("/swagger/images/", "/images/");
                                                                    }
                                                                } else {
                                                                    targetEl.style.display = "none";
                                                                }
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-14 h-14 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 shrink-0">
                                                            <ShoppingBag className="w-6 h-6" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-semibold text-gray-900 group-hover:text-[#DB4444] transition line-clamp-1">
                                                            {displayName}
                                                        </p>
                                                        {(p.brand || item.brand) && <p className="text-xs text-gray-400">{p.brand || item.brand}</p>}
                                                        {!item.product && !p.productName && (
                                                            <span className="text-[11px] text-amber-600 font-medium">Недоступен в каталоге</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Price */}
                                            <td className="py-4 px-6 font-semibold text-gray-900">
                                                ${currentPrice}
                                            </td>

                                            {/* Quantity Controls */}
                                            <td className="py-4 px-6">
                                                <div className="inline-flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shadow-xs">
                                                    <button
                                                        onClick={() => handleReduce(target, quantity)}
                                                        className="px-3 py-1.5 hover:bg-gray-100 transition cursor-pointer text-gray-600"
                                                        title="Уменьшить"
                                                    >
                                                        <Minus className="w-3.5 h-3.5" />
                                                    </button>
                                                    <span className="px-4 py-1.5 font-bold text-sm min-w-8 text-center select-none">
                                                        {quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleIncrease(target)}
                                                        className="px-3 py-1.5 hover:bg-gray-100 transition cursor-pointer text-gray-600"
                                                        title="Увеличить"
                                                    >
                                                        <Plus className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>

                                            {/* Subtotal */}
                                            <td className="py-4 px-6 font-bold text-[#DB4444]">
                                                ${itemTotal.toFixed(2)}
                                            </td>

                                            {/* Delete */}
                                            <td className="py-4 px-6 text-right">
                                                <button
                                                    onClick={() => handleDelete(target)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                                    title="Удалить из корзины"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <NavLink
                            to="/catalog"
                            className="w-full sm:w-auto px-8 py-3.5 border border-gray-400 rounded-lg font-semibold text-sm hover:bg-gray-50 transition text-center"
                        >
                            Вернуться в магазин
                        </NavLink>
                        <button
                            onClick={handleClearCart}
                            className="w-full sm:w-auto px-8 py-3.5 border border-red-300 text-red-600 rounded-lg font-semibold text-sm hover:bg-red-50 transition cursor-pointer"
                        >
                            Очистить корзину
                        </button>
                    </div>

                    {/* Bottom Summary & Coupon Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-6 items-start">
                        {/* Coupon Code */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="text"
                                placeholder="Купон на скидку"
                                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#DB4444]"
                            />
                            <button
                                type="button"
                                className="bg-[#DB4444] text-white px-8 py-3 rounded-lg font-semibold text-sm hover:bg-red-700 transition cursor-pointer"
                            >
                                Применить купон
                            </button>
                        </div>

                        {/* Cart Total Card */}
                        <div className="border border-gray-900 rounded-xl p-6 sm:p-8 flex flex-col gap-5 bg-white shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900">Итого в корзине</h3>
                            <div className="flex justify-between text-sm text-gray-700 border-b border-gray-200 pb-3">
                                <span>Промежуточный итог:</span>
                                <span className="font-semibold">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-700 border-b border-gray-200 pb-3">
                                <span>Доставка:</span>
                                <span className="font-semibold text-emerald-600">Бесплатно</span>
                            </div>
                            <div className="flex justify-between text-base font-bold text-gray-900">
                                <span>Всего к оплате:</span>
                                <span className="text-xl text-[#DB4444]">${subtotal.toFixed(2)}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => navigate('/checkout')}
                                className="bg-[#DB4444] text-white py-3.5 rounded-lg font-bold text-sm hover:bg-red-700 transition cursor-pointer text-center mt-2 shadow-sm"
                            >
                                Оформить заказ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}
