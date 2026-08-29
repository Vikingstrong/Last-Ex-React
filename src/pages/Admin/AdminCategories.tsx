import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Layers, Tag, Plus, Trash2, Edit3, Palette, FolderTree, Check } from "lucide-react"
import { type AppDispatch, type RootState } from "../../store/store"
import { 
    addCategory, 
    updateCategory, 
    deleteCategory, 
    addBrand, 
    updateBrand, 
    deleteBrand,
    addSubCategory,
    updateSubCategory,
    deleteSubCategory,
    addColor,
    updateColor,
    deleteColor,
    type ICategory,
    type IBrand,
    type ISubCategory,
    type IColor
} from "../../reducer/catalogSlice"
import { getAdminImageUrl } from "./AdminLayout"

export default function AdminCategories() {
    const dispatch = useDispatch<AppDispatch>()
    const catalogStore = useSelector((store: RootState) => store.catalog)

    // Add Modals
    const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
    const [isAddBrandOpen, setIsAddBrandOpen] = useState(false)
    const [isAddSubCategoryOpen, setIsAddSubCategoryOpen] = useState(false)
    const [isAddColorOpen, setIsAddColorOpen] = useState(false)

    // Edit Modals State
    const [editingCategory, setEditingCategory] = useState<ICategory | null>(null)
    const [editingBrand, setEditingBrand] = useState<IBrand | null>(null)
    const [editingSubCategory, setEditingSubCategory] = useState<ISubCategory | null>(null)
    const [editingColor, setEditingColor] = useState<IColor | null>(null)

    // Form inputs
    const [categoryName, setCategoryName] = useState("")
    const [categoryImage, setCategoryImage] = useState<File | null>(null)

    const [brandName, setBrandName] = useState("")

    const [subCatCategoryId, setSubCatCategoryId] = useState("1")
    const [subCategoryName, setSubCategoryName] = useState("")

    const [colorName, setColorName] = useState("")

    // Category Handlers
    const handleAddCategorySubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append("CategoryName", categoryName)
        if (categoryImage) {
            formData.append("CategoryImage", categoryImage)
        }
        await dispatch(addCategory(formData))
        setIsAddCategoryOpen(false)
        setCategoryName("")
        setCategoryImage(null)
    }

    const handleEditCategorySubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingCategory) return
        const formData = new FormData()
        formData.append("Id", String(editingCategory.id))
        formData.append("CategoryName", categoryName)
        if (categoryImage) {
            formData.append("CategoryImage", categoryImage)
        }
        await dispatch(updateCategory(formData))
        setEditingCategory(null)
        setCategoryName("")
        setCategoryImage(null)
    }

    const handleDeleteCategory = async (id: number, name: string) => {
        if (confirm(`Удалить категорию "${name}"?`)) {
            await dispatch(deleteCategory(id))
        }
    }

    // Brand Handlers
    const handleAddBrandSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await dispatch(addBrand({ brandName }))
        setIsAddBrandOpen(false)
        setBrandName("")
    }

    const handleEditBrandSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingBrand) return
        await dispatch(updateBrand({ id: editingBrand.id, brandName }))
        setEditingBrand(null)
        setBrandName("")
    }

    const handleDeleteBrand = async (id: number, name: string) => {
        if (confirm(`Удалить бренд "${name}"?`)) {
            await dispatch(deleteBrand(id))
        }
    }

    // SubCategory Handlers
    const handleAddSubCategorySubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await dispatch(addSubCategory({ categoryId: Number(subCatCategoryId), subCategoryName }))
        setIsAddSubCategoryOpen(false)
        setSubCategoryName("")
    }

    const handleEditSubCategorySubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingSubCategory) return
        await dispatch(updateSubCategory({ 
            id: editingSubCategory.id, 
            categoryId: Number(subCatCategoryId), 
            subCategoryName 
        }))
        setEditingSubCategory(null)
        setSubCategoryName("")
    }

    const handleDeleteSubCategory = async (id: number, name: string) => {
        if (confirm(`Удалить подкатегорию "${name}"?`)) {
            await dispatch(deleteSubCategory(id))
        }
    }

    // Color Handlers
    const handleAddColorSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await dispatch(addColor({ colorName }))
        setIsAddColorOpen(false)
        setColorName("")
    }

    const handleEditColorSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingColor) return
        await dispatch(updateColor({ id: editingColor.id, colorName }))
        setEditingColor(null)
        setColorName("")
    }

    const handleDeleteColor = async (id: number, name: string) => {
        if (confirm(`Удалить цвет "${name}"?`)) {
            await dispatch(deleteColor(id))
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 1. Categories Column */}
            <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Layers className="w-5 h-5 text-[#DB4444]" />
                        Категории ({catalogStore.categories?.length || 0})
                    </h2>
                    <button
                        onClick={() => {
                            setCategoryName("")
                            setCategoryImage(null)
                            setIsAddCategoryOpen(true)
                        }}
                        className="bg-[#DB4444] text-white px-3.5 py-1.5 rounded-md text-xs font-semibold hover:bg-red-700 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                        <Plus className="w-3.5 h-3.5" /> Добавить
                    </button>
                </div>
                <div className="flex flex-col gap-3 max-h-96 overflow-y-auto pr-1">
                    {catalogStore.categories?.length === 0 ? (
                        <p className="text-sm text-gray-400 py-4 text-center">Категории не найдены</p>
                    ) : (
                        (catalogStore.categories || []).map((cat) => {
                            const imgSrc = cat.categoryImage ? getAdminImageUrl(cat.categoryImage) : null
                            return (
                                <div key={cat.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100/70 transition">
                                    <div className="flex items-center gap-3">
                                        {imgSrc ? (
                                            <img 
                                                src={imgSrc} 
                                                alt={cat.categoryName} 
                                                className="w-10 h-10 object-cover rounded bg-white border" 
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
                                            <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                                                <Layers className="w-4 h-4" />
                                            </div>
                                        )}
                                        <div>
                                            <span className="font-semibold text-sm text-gray-800">{cat.categoryName}</span>
                                            {cat.subCategories && cat.subCategories.length > 0 && (
                                                <p className="text-xs text-gray-400">{cat.subCategories.length} подкатегорий</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => {
                                                setEditingCategory(cat)
                                                setCategoryName(cat.categoryName)
                                                setCategoryImage(null)
                                            }}
                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition cursor-pointer"
                                            title="Редактировать категорию"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCategory(cat.id, cat.categoryName)}
                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                                            title="Удалить категорию"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>

            {/* 2. SubCategories Column */}
            <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <FolderTree className="w-5 h-5 text-indigo-600" />
                        Подкатегории ({catalogStore.subCategories?.length || 0})
                    </h2>
                    <button
                        onClick={() => {
                            setSubCategoryName("")
                            setSubCatCategoryId(String(catalogStore.categories[0]?.id || "1"))
                            setIsAddSubCategoryOpen(true)
                        }}
                        className="bg-indigo-600 text-white px-3.5 py-1.5 rounded-md text-xs font-semibold hover:bg-indigo-700 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                        <Plus className="w-3.5 h-3.5" /> Добавить
                    </button>
                </div>
                <div className="flex flex-col gap-2.5 max-h-96 overflow-y-auto pr-1">
                    {catalogStore.subCategories?.length === 0 ? (
                        <p className="text-sm text-gray-400 py-4 text-center">Подкатегории не найдены</p>
                    ) : (
                        (catalogStore.subCategories || []).map((sub) => (
                            <div key={sub.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100/70 transition">
                                <div>
                                    <span className="font-semibold text-sm text-gray-800">{sub.subCategoryName}</span>
                                    <p className="text-xs text-gray-400">ID: #{sub.id}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => {
                                            setEditingSubCategory(sub)
                                            setSubCategoryName(sub.subCategoryName)
                                            setSubCatCategoryId(String(sub.categoryId || catalogStore.categories[0]?.id || "1"))
                                        }}
                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition cursor-pointer"
                                        title="Редактировать подкатегорию"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteSubCategory(sub.id, sub.subCategoryName)}
                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                                        title="Удалить подкатегорию"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* 3. Brands Column */}
            <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Tag className="w-5 h-5 text-purple-600" />
                        Бренды ({catalogStore.brands?.length || 0})
                    </h2>
                    <button
                        onClick={() => {
                            setBrandName("")
                            setIsAddBrandOpen(true)
                        }}
                        className="bg-purple-600 text-white px-3.5 py-1.5 rounded-md text-xs font-semibold hover:bg-purple-700 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                        <Plus className="w-3.5 h-3.5" /> Добавить
                    </button>
                </div>
                <div className="flex flex-col gap-2.5 max-h-96 overflow-y-auto pr-1">
                    {catalogStore.brands?.length === 0 ? (
                        <p className="text-sm text-gray-400 py-4 text-center">Бренды не найдены</p>
                    ) : (
                        (catalogStore.brands || []).map((b) => (
                            <div key={b.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100/70 transition">
                                <span className="font-semibold text-sm text-gray-800">{b.brandName}</span>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => {
                                            setEditingBrand(b)
                                            setBrandName(b.brandName)
                                        }}
                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition cursor-pointer"
                                        title="Редактировать бренд"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteBrand(b.id, b.brandName)}
                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                                        title="Удалить бренд"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* 4. Colors Column */}
            <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Palette className="w-5 h-5 text-emerald-600" />
                        Цвета ({catalogStore.colors?.length || 0})
                    </h2>
                    <button
                        onClick={() => {
                            setColorName("")
                            setIsAddColorOpen(true)
                        }}
                        className="bg-emerald-600 text-white px-3.5 py-1.5 rounded-md text-xs font-semibold hover:bg-emerald-700 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                        <Plus className="w-3.5 h-3.5" /> Добавить
                    </button>
                </div>
                <div className="flex flex-col gap-2.5 max-h-96 overflow-y-auto pr-1">
                    {catalogStore.colors?.length === 0 ? (
                        <p className="text-sm text-gray-400 py-4 text-center">Цвета не найдены</p>
                    ) : (
                        (catalogStore.colors || []).map((cl) => (
                            <div key={cl.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100/70 transition">
                                <div className="flex items-center gap-2.5">
                                    <div 
                                        className="w-5 h-5 rounded-full border border-gray-300 shadow-xs" 
                                        style={{ backgroundColor: cl.colorName?.toLowerCase() || "#ccc" }} 
                                    />
                                    <span className="font-semibold text-sm text-gray-800">{cl.colorName}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => {
                                            setEditingColor(cl)
                                            setColorName(cl.colorName)
                                        }}
                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition cursor-pointer"
                                        title="Редактировать цвет"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteColor(cl.id, cl.colorName)}
                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                                        title="Удалить цвет"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* MODAL: ADD CATEGORY */}
            {isAddCategoryOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col gap-6 animate-in fade-in duration-200">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                            <h2 className="text-xl font-bold text-gray-900">Добавить категорию</h2>
                            <button onClick={() => setIsAddCategoryOpen(false)} className="text-gray-400 hover:text-black text-2xl font-bold cursor-pointer">&times;</button>
                        </div>
                        <form onSubmit={handleAddCategorySubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-700">Название категории *</label>
                                <input
                                    type="text"
                                    required
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    className="bg-[#F5F5F5] rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-[#DB4444]"
                                    placeholder="например: Смартфоны"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-700">Изображение</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setCategoryImage(e.target.files?.[0] || null)}
                                    className="bg-[#F5F5F5] rounded-lg p-2.5 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#DB4444] file:text-white hover:file:bg-red-700 cursor-pointer"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setIsAddCategoryOpen(false)} className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 transition cursor-pointer">Отмена</button>
                                <button type="submit" className="bg-[#DB4444] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-red-700 transition cursor-pointer">Создать</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: EDIT CATEGORY */}
            {editingCategory && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col gap-6 animate-in fade-in duration-200">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Редактировать категорию</h2>
                                <p className="text-xs text-gray-500 mt-0.5">ID: #{editingCategory.id}</p>
                            </div>
                            <button onClick={() => setEditingCategory(null)} className="text-gray-400 hover:text-black text-2xl font-bold cursor-pointer">&times;</button>
                        </div>
                        <form onSubmit={handleEditCategorySubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-700">Название категории *</label>
                                <input
                                    type="text"
                                    required
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    className="bg-[#F5F5F5] rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-[#DB4444]"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-700">Новое изображение (опционально)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setCategoryImage(e.target.files?.[0] || null)}
                                    className="bg-[#F5F5F5] rounded-lg p-2.5 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#DB4444] file:text-white hover:file:bg-red-700 cursor-pointer"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setEditingCategory(null)} className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 transition cursor-pointer">Отмена</button>
                                <button type="submit" className="bg-[#DB4444] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-red-700 transition cursor-pointer flex items-center gap-2">
                                    <Check className="w-4 h-4" /> Сохранить
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: ADD BRAND */}
            {isAddBrandOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col gap-6 animate-in fade-in duration-200">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                            <h2 className="text-xl font-bold text-gray-900">Добавить бренд</h2>
                            <button onClick={() => setIsAddBrandOpen(false)} className="text-gray-400 hover:text-black text-2xl font-bold cursor-pointer">&times;</button>
                        </div>
                        <form onSubmit={handleAddBrandSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-700">Название бренда *</label>
                                <input
                                    type="text"
                                    required
                                    value={brandName}
                                    onChange={(e) => setBrandName(e.target.value)}
                                    className="bg-[#F5F5F5] rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-purple-600"
                                    placeholder="например: Apple, Samsung, Sony"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setIsAddBrandOpen(false)} className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 transition cursor-pointer">Отмена</button>
                                <button type="submit" className="bg-purple-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-purple-700 transition cursor-pointer">Создать</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: EDIT BRAND */}
            {editingBrand && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col gap-6 animate-in fade-in duration-200">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Редактировать бренд</h2>
                                <p className="text-xs text-gray-500 mt-0.5">ID: #{editingBrand.id}</p>
                            </div>
                            <button onClick={() => setEditingBrand(null)} className="text-gray-400 hover:text-black text-2xl font-bold cursor-pointer">&times;</button>
                        </div>
                        <form onSubmit={handleEditBrandSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-700">Название бренда *</label>
                                <input
                                    type="text"
                                    required
                                    value={brandName}
                                    onChange={(e) => setBrandName(e.target.value)}
                                    className="bg-[#F5F5F5] rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-purple-600"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setEditingBrand(null)} className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 transition cursor-pointer">Отмена</button>
                                <button type="submit" className="bg-purple-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-purple-700 transition cursor-pointer flex items-center gap-2">
                                    <Check className="w-4 h-4" /> Сохранить
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: ADD SUBCATEGORY */}
            {isAddSubCategoryOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col gap-6 animate-in fade-in duration-200">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                            <h2 className="text-xl font-bold text-gray-900">Добавить подкатегорию</h2>
                            <button onClick={() => setIsAddSubCategoryOpen(false)} className="text-gray-400 hover:text-black text-2xl font-bold cursor-pointer">&times;</button>
                        </div>
                        <form onSubmit={handleAddSubCategorySubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-700">Родительская категория *</label>
                                <select
                                    value={subCatCategoryId}
                                    onChange={(e) => setSubCatCategoryId(e.target.value)}
                                    className="bg-[#F5F5F5] rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-indigo-600"
                                >
                                    {(catalogStore.categories || []).map((c) => (
                                        <option key={c.id} value={c.id}>{c.categoryName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-700">Название подкатегории *</label>
                                <input
                                    type="text"
                                    required
                                    value={subCategoryName}
                                    onChange={(e) => setSubCategoryName(e.target.value)}
                                    className="bg-[#F5F5F5] rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-indigo-600"
                                    placeholder="например: Флагманы, Бюджетные"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setIsAddSubCategoryOpen(false)} className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 transition cursor-pointer">Отмена</button>
                                <button type="submit" className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-indigo-700 transition cursor-pointer">Создать</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: EDIT SUBCATEGORY */}
            {editingSubCategory && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col gap-6 animate-in fade-in duration-200">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Редактировать подкатегорию</h2>
                                <p className="text-xs text-gray-500 mt-0.5">ID: #{editingSubCategory.id}</p>
                            </div>
                            <button onClick={() => setEditingSubCategory(null)} className="text-gray-400 hover:text-black text-2xl font-bold cursor-pointer">&times;</button>
                        </div>
                        <form onSubmit={handleEditSubCategorySubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-700">Родительская категория *</label>
                                <select
                                    value={subCatCategoryId}
                                    onChange={(e) => setSubCatCategoryId(e.target.value)}
                                    className="bg-[#F5F5F5] rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-indigo-600"
                                >
                                    {(catalogStore.categories || []).map((c) => (
                                        <option key={c.id} value={c.id}>{c.categoryName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-700">Название подкатегории *</label>
                                <input
                                    type="text"
                                    required
                                    value={subCategoryName}
                                    onChange={(e) => setSubCategoryName(e.target.value)}
                                    className="bg-[#F5F5F5] rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-indigo-600"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setEditingSubCategory(null)} className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 transition cursor-pointer">Отмена</button>
                                <button type="submit" className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-indigo-700 transition cursor-pointer flex items-center gap-2">
                                    <Check className="w-4 h-4" /> Сохранить
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: ADD COLOR */}
            {isAddColorOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col gap-6 animate-in fade-in duration-200">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                            <h2 className="text-xl font-bold text-gray-900">Добавить цвет</h2>
                            <button onClick={() => setIsAddColorOpen(false)} className="text-gray-400 hover:text-black text-2xl font-bold cursor-pointer">&times;</button>
                        </div>
                        <form onSubmit={handleAddColorSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-700">Название цвета *</label>
                                <input
                                    type="text"
                                    required
                                    value={colorName}
                                    onChange={(e) => setColorName(e.target.value)}
                                    className="bg-[#F5F5F5] rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-emerald-600"
                                    placeholder="например: Red, Black, Space Gray, #00FF00"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setIsAddColorOpen(false)} className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 transition cursor-pointer">Отмена</button>
                                <button type="submit" className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-emerald-700 transition cursor-pointer">Создать</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: EDIT COLOR */}
            {editingColor && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col gap-6 animate-in fade-in duration-200">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Редактировать цвет</h2>
                                <p className="text-xs text-gray-500 mt-0.5">ID: #{editingColor.id}</p>
                            </div>
                            <button onClick={() => setEditingColor(null)} className="text-gray-400 hover:text-black text-2xl font-bold cursor-pointer">&times;</button>
                        </div>
                        <form onSubmit={handleEditColorSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-700">Название цвета *</label>
                                <input
                                    type="text"
                                    required
                                    value={colorName}
                                    onChange={(e) => setColorName(e.target.value)}
                                    className="bg-[#F5F5F5] rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-emerald-600"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setEditingColor(null)} className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 transition cursor-pointer">Отмена</button>
                                <button type="submit" className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-emerald-700 transition cursor-pointer flex items-center gap-2">
                                    <Check className="w-4 h-4" /> Сохранить
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
