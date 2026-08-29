import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Trash2, UserPlus, Search, ChevronLeft, ChevronRight, Edit3, UserCheck } from "lucide-react"
import { type AppDispatch, type RootState } from "../../store/store"
import { getUsersList, addRoleToUser, removeRoleFromUser, deleteUser, updateUserProfile, type User } from "../../reducer/usersSlice"

export default function AdminUsers() {
    const dispatch = useDispatch<AppDispatch>()
    const userStore = useSelector((store: RootState) => store.userData)

    const [searchUser, setSearchUser] = useState("")
    const [selectedUserForRole, setSelectedUserForRole] = useState<{ userId: string, userName: string } | null>(null)
    const [selectedRoleId, setSelectedRoleId] = useState("")
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    // Edit User Profile State
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [editForm, setEditForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        dob: "2000-01-01"
    })
    const [editImage, setEditImage] = useState<File | null>(null)
    const [isUpdating, setIsUpdating] = useState(false)

    // Debounced search across the entire database
    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(getUsersList({ pageNumber, pageSize, userName: searchUser.trim() }))
        }, 300)
        return () => clearTimeout(timer)
    }, [searchUser, pageNumber, pageSize, dispatch])

    const handleAssignRole = async () => {
        if (!selectedUserForRole || !selectedRoleId) return
        await dispatch(addRoleToUser({ userId: selectedUserForRole.userId, roleId: selectedRoleId }))
        dispatch(getUsersList({ pageNumber, pageSize, userName: searchUser.trim() }))
        setSelectedUserForRole(null)
        setSelectedRoleId("")
    }

    const handleRemoveRole = async (userId: string, roleId: string) => {
        if (confirm("Вы уверены, что хотите удалить эту роль у пользователя?")) {
            await dispatch(removeRoleFromUser({ userId, roleId }))
            dispatch(getUsersList({ pageNumber, pageSize, userName: searchUser.trim() }))
        }
    }

    const handleDeleteUser = async (id: string, name: string) => {
        if (confirm(`Удалить пользователя ${name}?`)) {
            await dispatch(deleteUser(id))
            dispatch(getUsersList({ pageNumber, pageSize, userName: searchUser.trim() }))
        }
    }

    const handleOpenEdit = (u: User) => {
        setEditingUser(u)
        setEditForm({
            firstName: u.firstName || "",
            lastName: u.lastName || "",
            email: u.email || "",
            phoneNumber: u.phoneNumber || "",
            dob: u.dob ? u.dob.split('T')[0] : "2000-01-01"
        })
        setEditImage(null)
    }

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsUpdating(true)
        try {
            const formData = new FormData()
            formData.append("FirstName", editForm.firstName)
            formData.append("LastName", editForm.lastName)
            formData.append("Email", editForm.email)
            formData.append("PhoneNumber", editForm.phoneNumber)
            formData.append("Dob", editForm.dob)
            if (editImage) {
                formData.append("Image", editImage)
            }
            await dispatch(updateUserProfile(formData))
            dispatch(getUsersList({ pageNumber, pageSize, userName: searchUser.trim() }))
            setEditingUser(null)
        } finally {
            setIsUpdating(false)
        }
    }

    const usersList = userStore.data?.usersList || []
    const totalRecord = userStore.data?.totalRecord || usersList.length || 0
    const totalPages = userStore.data?.totalPage || Math.ceil(totalRecord / pageSize) || 1

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <input
                        type="text"
                        placeholder="Поиск по всей базе (имя, логин)..."
                        value={searchUser}
                        onChange={(e) => {
                            setSearchUser(e.target.value)
                            setPageNumber(1)
                        }}
                        className="w-full bg-[#F5F5F5] rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#DB4444]"
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>На странице:</span>
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value))
                            setPageNumber(1)
                        }}
                        className="bg-[#F5F5F5] border border-gray-200 rounded-md px-2.5 py-1.5 text-sm font-semibold outline-none cursor-pointer"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={999}>Все (999)</option>
                    </select>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                        <tr>
                            <th className="py-3.5 px-4">Пользователь</th>
                            <th className="py-3.5 px-4">Email</th>
                            <th className="py-3.5 px-4">Телефон</th>
                            <th className="py-3.5 px-4">Роли</th>
                            <th className="py-3.5 px-4 text-right">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userStore.loader?.usersListLoading ? (
                            <tr>
                                <td colSpan={5} className="py-12 text-center text-gray-500 animate-pulse font-medium">
                                    Поиск и загрузка пользователей...
                                </td>
                            </tr>
                        ) : usersList.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-10 text-center text-gray-400">
                                    Пользователи не найдены
                                </td>
                            </tr>
                        ) : (
                            usersList.map((u) => (
                                <tr key={u.userId || u.userName} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                    <td className="py-3.5 px-4 font-semibold text-gray-900 flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-red-100 text-[#DB4444] font-bold flex items-center justify-center text-sm">
                                            {u.userName ? u.userName[0].toUpperCase() : "U"}
                                        </div>
                                        <div>
                                            <p className="font-semibold">{u.userName}</p>
                                            <p className="text-xs text-gray-400">{u.firstName} {u.lastName}</p>
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-4 text-gray-600">{u.email || "-"}</td>
                                    <td className="py-3.5 px-4 text-gray-600">{u.phoneNumber || "-"}</td>
                                    <td className="py-3.5 px-4">
                                        <div className="flex flex-wrap gap-1.5">
                                            {u.userRoles && u.userRoles.length > 0 ? (
                                                u.userRoles.map((r: any, idx: number) => {
                                                    const roleName = typeof r === 'string' ? r : r.name
                                                    const isRoleAdmin = roleName?.toLowerCase() === 'admin'
                                                    return (
                                                        <span 
                                                            key={idx} 
                                                            className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
                                                                isRoleAdmin ? "bg-red-100 text-red-700 border border-red-200" : "bg-gray-100 text-gray-700"
                                                            }`}
                                                        >
                                                            {roleName}
                                                            {r.id && (
                                                                <button 
                                                                    onClick={() => handleRemoveRole(u.userId, r.id)}
                                                                    className="hover:text-red-900 cursor-pointer ml-0.5"
                                                                    title="Удалить роль"
                                                                >
                                                                    &times;
                                                                </button>
                                                            )}
                                                        </span>
                                                    )
                                                })
                                            ) : (
                                                <span className="text-gray-400 text-xs">Нет ролей</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-4 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button
                                                onClick={() => handleOpenEdit(u)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                                                title="Редактировать профиль"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setSelectedUserForRole({ userId: u.userId, userName: u.userName })}
                                                className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-2.5 py-1.5 rounded-md font-medium transition cursor-pointer"
                                                title="Назначить роль"
                                            >
                                                <UserPlus className="w-3.5 h-3.5" />
                                                Роль
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(u.userId, u.userName)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                                title="Удалить пользователя"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 border border-gray-100 rounded-xl shadow-sm">
                <p className="text-sm text-gray-500">
                    Показано <span className="font-semibold text-gray-800">{Math.min((pageNumber - 1) * pageSize + 1, totalRecord)}</span>–
                    <span className="font-semibold text-gray-800">{Math.min(pageNumber * pageSize, totalRecord)}</span> из <span className="font-semibold text-gray-800">{totalRecord}</span> пользователей
                </p>

                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                        disabled={pageNumber <= 1}
                        className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((p) => p === 1 || p === totalPages || Math.abs(p - pageNumber) <= 1)
                        .map((p, idx, arr) => {
                            const prev = arr[idx - 1]
                            const showEllipsis = prev && p - prev > 1
                            return (
                                <div key={p} className="flex items-center">
                                    {showEllipsis && <span className="px-2 text-gray-400 text-sm">...</span>}
                                    <button
                                        onClick={() => setPageNumber(p)}
                                        className={`w-9 h-9 rounded-lg text-sm font-semibold transition cursor-pointer ${
                                            pageNumber === p
                                                ? "bg-[#DB4444] text-white shadow-sm"
                                                : "border border-gray-200 hover:bg-gray-50 text-gray-700"
                                        }`}
                                    >
                                        {p}
                                    </button>
                                </div>
                            )
                        })}

                    <button
                        onClick={() => setPageNumber((prev) => Math.min(prev + 1, totalPages))}
                        disabled={pageNumber >= totalPages}
                        className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* MODAL: EDIT USER PROFILE */}
            {editingUser && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl flex flex-col gap-6 animate-in fade-in duration-200">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Редактировать профиль</h2>
                                <p className="text-xs text-gray-500 mt-0.5">Пользователь: <span className="font-semibold text-black">{editingUser.userName}</span></p>
                            </div>
                            <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-black text-2xl font-bold cursor-pointer">&times;</button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-gray-700">Имя</label>
                                    <input
                                        type="text"
                                        value={editForm.firstName}
                                        onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                                        className="bg-[#F5F5F5] rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-[#DB4444]"
                                        placeholder="Имя"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-gray-700">Фамилия</label>
                                    <input
                                        type="text"
                                        value={editForm.lastName}
                                        onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                                        className="bg-[#F5F5F5] rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-[#DB4444]"
                                        placeholder="Фамилия"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-700">Email</label>
                                <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                    className="bg-[#F5F5F5] rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-[#DB4444]"
                                    placeholder="user@example.com"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-gray-700">Телефон</label>
                                    <input
                                        type="text"
                                        value={editForm.phoneNumber}
                                        onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                                        className="bg-[#F5F5F5] rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-[#DB4444]"
                                        placeholder="+992..."
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-gray-700">Дата рождения</label>
                                    <input
                                        type="date"
                                        value={editForm.dob}
                                        onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })}
                                        className="bg-[#F5F5F5] rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-[#DB4444]"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-700">Аватар (фото)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setEditImage(e.target.files?.[0] || null)}
                                    className="bg-[#F5F5F5] rounded-lg p-2.5 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#DB4444] file:text-white hover:file:bg-red-700 cursor-pointer"
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingUser(null)}
                                    className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 transition cursor-pointer"
                                >
                                    Отмена
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="bg-[#DB4444] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-red-700 transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
                                >
                                    <UserCheck className="w-4 h-4" />
                                    {isUpdating ? "Сохранение..." : "Сохранить профиль"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: ASSIGN ROLE TO USER */}
            {selectedUserForRole && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col gap-6 animate-in fade-in duration-200">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Назначить роль</h2>
                                <p className="text-xs text-gray-500 mt-0.5">Пользователь: <span className="font-semibold text-black">{selectedUserForRole.userName}</span></p>
                            </div>
                            <button onClick={() => setSelectedUserForRole(null)} className="text-gray-400 hover:text-black text-2xl font-bold cursor-pointer">&times;</button>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-700">Выберите роль</label>
                                <select
                                    value={selectedRoleId}
                                    onChange={(e) => setSelectedRoleId(e.target.value)}
                                    className="bg-[#F5F5F5] rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-[#DB4444]"
                                >
                                    <option value="">-- Выберите роль --</option>
                                    {(userStore.data?.roles || []).map((r) => (
                                        <option key={r.id} value={r.id}>{r.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setSelectedUserForRole(null)}
                                    className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 transition cursor-pointer"
                                >
                                    Отмена
                                </button>
                                <button
                                    type="button"
                                    disabled={!selectedRoleId}
                                    onClick={handleAssignRole}
                                    className="bg-[#DB4444] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-red-700 transition disabled:opacity-50 cursor-pointer"
                                >
                                    Назначить
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
