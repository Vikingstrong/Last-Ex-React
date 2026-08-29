import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink, Outlet } from "react-router"
import { useTranslation } from "react-i18next"
import { 
    LayoutDashboard, 
    Package, 
    Users, 
    Layers, 
    Shield, 
    ShieldCheck, 
    AlertTriangle, 
    RefreshCw
} from "lucide-react"
import { type AppDispatch, type RootState } from "../../store/store"
import { getDataUser, getUsersList, getUserRoles } from "../../reducer/usersSlice"
import { getProducts } from "../../reducer/productSlice"
import { getCategories, getBrands, getSubCategories, getColors } from "../../reducer/catalogSlice"

export const getAdminImageUrl = (imgName?: string) => {
    if (!imgName) return ""
    if (imgName.startsWith("http")) return imgName
    const clean = imgName.replace(/^\/+/, "")
    return `https://store-api.softclub.tj/images/${clean}`
}

export default function AdminLayout() {
    const { t } = useTranslation()
    const dispatch = useDispatch<AppDispatch>()
    const rawToken = localStorage.getItem('token')
    const token = rawToken && rawToken !== 'undefined' && rawToken !== 'null' ? rawToken : null

    const userStore = useSelector((store: RootState) => store.userData)
    const currentUser = userStore.data?.getUserInfo

    useEffect(() => {
        if (token) {
            dispatch(getDataUser())
            dispatch(getUsersList({ pageNumber: 1, pageSize: 10 }))
            dispatch(getUserRoles())
            dispatch(getProducts({ pageNumber: 1, pageSize: 10 }))
            dispatch(getCategories())
            dispatch(getBrands())
            dispatch(getSubCategories())
            dispatch(getColors())
        }
    }, [token, dispatch])

    const isAdmin = Boolean(
        currentUser?.userRoles?.some((r: any) => 
            (typeof r === 'string' && r.toLowerCase() === 'admin') || 
            (r?.name && r.name.toLowerCase() === 'admin')
        )
    )

    if (!token) {
        return (
            <div className="max-w-300 m-auto p-10 flex flex-col items-center justify-center gap-6 min-h-[60vh]">
                <div className="p-4 bg-red-100 text-red-600 rounded-full">
                    <AlertTriangle className="w-12 h-12" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800">Доступ ограничен / Access Restricted</h1>
                <p className="text-gray-600 text-center max-w-md">
                    Пожалуйста, войдите в систему под учетной записью администратора для доступа к панели управления.
                </p>
                <NavLink to="/login" className="bg-[#DB4444] text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition">
                    {t('auth.logIn')}
                </NavLink>
            </div>
        )
    }

    if (!isAdmin && Object.keys(currentUser || {}).length > 0) {
        return (
            <div className="max-w-300 m-auto p-10 flex flex-col items-center justify-center gap-6 min-h-[60vh]">
                <div className="p-4 bg-amber-100 text-amber-600 rounded-full">
                    <Shield className="w-12 h-12" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800">Требуются права Администратора / Admin Rights Required</h1>
                <p className="text-gray-600 text-center max-w-md">
                    Ваш аккаунт (<span className="font-semibold">{currentUser?.userName}</span>) не имеет роли Admin.
                </p>
                <div className="flex gap-4">
                    <NavLink to="/" className="border border-gray-300 px-6 py-2.5 rounded-lg hover:bg-gray-50 transition">
                        {t('admin.backToSite')}
                    </NavLink>
                    <NavLink to="/profile" className="bg-[#DB4444] text-white px-6 py-2.5 rounded-lg hover:bg-red-700 transition">
                        {t('admin.myProfile')}
                    </NavLink>
                </div>
            </div>
        )
    }

    const refreshData = () => {
        dispatch(getUsersList({ pageNumber: 1, pageSize: 10 }))
        dispatch(getProducts({ pageNumber: 1, pageSize: 10 }))
        dispatch(getCategories())
        dispatch(getBrands())
        dispatch(getSubCategories())
        dispatch(getColors())
    }

    return (
        <div className="max-w-300 m-auto p-5 lg:px-0 py-8 flex flex-col gap-8 min-h-screen">
            {/* Header Title */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-5">
                <div>
                    <div className="flex items-center gap-2.5">
                        <span className="p-2 bg-[#DB4444] text-white rounded-lg shadow-sm">
                            <ShieldCheck className="w-6 h-6" />
                        </span>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{t('admin.adminPanel')}</h1>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        {t('admin.adminDesc')}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={refreshData} 
                        className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition cursor-pointer"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span>{t('admin.refreshData')}</span>
                    </button>
                    <NavLink to="/" className="text-sm text-[#DB4444] font-semibold hover:underline">
                        {t('admin.backToSite')} &rarr;
                    </NavLink>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-gray-200">
                <NavLink
                    to="/admin"
                    end
                    className={({ isActive }) => `flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
                        isActive
                            ? "border-[#DB4444] text-[#DB4444]"
                            : "border-transparent text-gray-500 hover:text-black"
                    }`}
                >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>{t('admin.overview')}</span>
                </NavLink>

                <NavLink
                    to="/admin/products"
                    className={({ isActive }) => `flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
                        isActive
                            ? "border-[#DB4444] text-[#DB4444]"
                            : "border-transparent text-gray-500 hover:text-black"
                    }`}
                >
                    <Package className="w-4 h-4" />
                    <span>{t('admin.products')}</span>
                </NavLink>

                <NavLink
                    to="/admin/users"
                    className={({ isActive }) => `flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
                        isActive
                            ? "border-[#DB4444] text-[#DB4444]"
                            : "border-transparent text-gray-500 hover:text-black"
                    }`}
                >
                    <Users className="w-4 h-4" />
                    <span>{t('admin.users')}</span>
                </NavLink>

                <NavLink
                    to="/admin/categories"
                    className={({ isActive }) => `flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
                        isActive
                            ? "border-[#DB4444] text-[#DB4444]"
                            : "border-transparent text-gray-500 hover:text-black"
                    }`}
                >
                    <Layers className="w-4 h-4" />
                    <span>{t('admin.categories')}</span>
                </NavLink>
            </div>

            {/* Sub-Pages Content */}
            <main>
                <Outlet />
            </main>
        </div>
    )
}
