import { useSelector } from "react-redux"
import { NavLink } from "react-router"
import { Package, Users, Layers, Tag, ArrowRight } from "lucide-react"
import { type RootState } from "../../store/store"
import { getAdminImageUrl } from "./AdminLayout"

export default function AdminOverview() {
    const userStore = useSelector((store: RootState) => store.userData)
    const productStore = useSelector((store: RootState) => store.products)
    const catalogStore = useSelector((store: RootState) => store.catalog)

    const totalProducts = productStore.totalRecord || productStore.dataProduct?.length || 0
    const totalUsers = userStore.data?.totalRecord || userStore.data?.usersList?.length || 0

    return (
        <div className="flex flex-col gap-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <NavLink to="/admin/products" className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm flex items-center justify-between hover:shadow-md transition">
                    <div>
                        <p className="text-xs font-medium text-gray-500">Товаров</p>
                        <h2 className="text-2xl font-bold text-gray-900 mt-1">{totalProducts}</h2>
                    </div>
                    <div className="p-2.5 bg-red-50 text-[#DB4444] rounded-lg">
                        <Package className="w-5 h-5" />
                    </div>
                </NavLink>
                <NavLink to="/admin/users" className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm flex items-center justify-between hover:shadow-md transition">
                    <div>
                        <p className="text-xs font-medium text-gray-500">Пользователей</p>
                        <h2 className="text-2xl font-bold text-gray-900 mt-1">{totalUsers}</h2>
                    </div>
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                        <Users className="w-5 h-5" />
                    </div>
                </NavLink>
                <NavLink to="/admin/categories" className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm flex items-center justify-between hover:shadow-md transition">
                    <div>
                        <p className="text-xs font-medium text-gray-500">Категорий</p>
                        <h2 className="text-2xl font-bold text-gray-900 mt-1">{catalogStore.categories?.length || 0}</h2>
                    </div>
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
                        <Layers className="w-5 h-5" />
                    </div>
                </NavLink>
                <NavLink to="/admin/categories" className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm flex items-center justify-between hover:shadow-md transition">
                    <div>
                        <p className="text-xs font-medium text-gray-500">Подкатегорий</p>
                        <h2 className="text-2xl font-bold text-gray-900 mt-1">{catalogStore.subCategories?.length || 0}</h2>
                    </div>
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
                        <Layers className="w-5 h-5" />
                    </div>
                </NavLink>
                <NavLink to="/admin/categories" className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm flex items-center justify-between hover:shadow-md transition">
                    <div>
                        <p className="text-xs font-medium text-gray-500">Брендов</p>
                        <h2 className="text-2xl font-bold text-gray-900 mt-1">{catalogStore.brands?.length || 0}</h2>
                    </div>
                    <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
                        <Tag className="w-5 h-5" />
                    </div>
                </NavLink>
                <NavLink to="/admin/categories" className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm flex items-center justify-between hover:shadow-md transition">
                    <div>
                        <p className="text-xs font-medium text-gray-500">Цветов</p>
                        <h2 className="text-2xl font-bold text-gray-900 mt-1">{catalogStore.colors?.length || 0}</h2>
                    </div>
                    <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
                        <Tag className="w-5 h-5" />
                    </div>
                </NavLink>
            </div>

            {/* Quick Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm flex flex-col justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Package className="w-5 h-5 text-[#DB4444]" />
                            Управление товарами
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">Добавление, редактирование, удаление товаров и пагинация.</p>
                    </div>
                    <NavLink to="/admin/products" className="inline-flex items-center gap-2 text-sm font-semibold text-[#DB4444] hover:underline">
                        Перейти к товарам <ArrowRight className="w-4 h-4" />
                    </NavLink>
                </div>

                <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm flex flex-col justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-600" />
                            Пользователи и Роли
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">Просмотр списка зарегистрированных пользователей и назначение ролей.</p>
                    </div>
                    <NavLink to="/admin/users" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline">
                        Перейти к пользователям <ArrowRight className="w-4 h-4" />
                    </NavLink>
                </div>

                <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm flex flex-col justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Layers className="w-5 h-5 text-emerald-600" />
                            Категории и Бренды
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">Создание категорий с изображениями и добавление брендов.</p>
                    </div>
                    <NavLink to="/admin/categories" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:underline">
                        Перейти к категориям <ArrowRight className="w-4 h-4" />
                    </NavLink>
                </div>
            </div>

            {/* Recent Products Preview */}
            <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900">Последние товары</h2>
                    <NavLink to="/admin/products" className="text-sm text-[#DB4444] font-semibold hover:underline">
                        Смотреть все товары ({totalProducts}) &rarr;
                    </NavLink>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 text-gray-500">
                                <th className="py-3 px-4">Товар</th>
                                <th className="py-3 px-4">Бренд</th>
                                <th className="py-3 px-4">Цена</th>
                                <th className="py-3 px-4">Количество</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(productStore.dataProduct || []).slice(0, 5).map((p) => {
                                const rawImg = p.image || p.images?.[0]?.images || ""
                                const imgSrc = getAdminImageUrl(rawImg)
                                return (
                                    <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium flex items-center gap-3">
                                            {imgSrc ? (
                                                <img 
                                                    src={imgSrc} 
                                                    alt={p.productName} 
                                                    className="w-10 h-10 object-contain rounded bg-gray-50 border"
                                                    onError={(e) => {
                                                        const target = e.currentTarget;
                                                        if (!target.dataset.triedFallback) {
                                                            target.dataset.triedFallback = "true";
                                                            if (target.src.includes("/images/") && !target.src.includes("/swagger/images/")) {
                                                                target.src = target.src.replace("/images/", "/swagger/images/");
                                                            } else if (target.src.includes("/swagger/images/")) {
                                                                target.src = target.src.replace("/swagger/images/", "/images/");
                                                            }
                                                        } else {
                                                            target.style.display = "none";
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                                                    <Package className="w-5 h-5" />
                                                </div>
                                            )}
                                            <span>{p.productName}</span>
                                        </td>
                                        <td className="py-3 px-4 text-gray-600">{p.brand || "-"}</td>
                                        <td className="py-3 px-4 font-semibold text-gray-900">${p.price}</td>
                                        <td className="py-3 px-4 text-gray-600">{p.quantity} шт.</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
