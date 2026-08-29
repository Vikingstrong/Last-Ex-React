import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Package, Plus, Trash2, Search, ChevronLeft, ChevronRight, AlertCircle, Edit3, Check } from "lucide-react"
import { type AppDispatch, type RootState } from "../../store/store"
import { getProducts, addProduct, updateProduct, deleteProduct, addImageToProduct, type IProduct } from "../../reducer/productSlice"
import { getAdminImageUrl } from "./AdminLayout"

export default function AdminProducts() {
    const dispatch = useDispatch<AppDispatch>()
    const productStore = useSelector((store: RootState) => store.products)
    const catalogStore = useSelector((store: RootState) => store.catalog)

    const [searchProduct, setSearchProduct] = useState("")
    const [isAddProductOpen, setIsAddProductOpen] = useState(false)
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [addError, setAddError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Edit Product State
    const [editingProduct, setEditingProduct] = useState<IProduct | null>(null)
    const [editForm, setEditForm] = useState({
        id: 0,
        productName: "",
        description: "",
        price: "",
        discountPrice: "0",
        quantity: "",
        colorId: "1",
        brandId: "1",
        subCategoryId: "1",
        code: "",
        weight: "1kg",
        size: "M",
        hasDiscount: false
    })
    const [editImages, setEditImages] = useState<FileList | null>(null)
    const [editError, setEditError] = useState<string | null>(null)

    useEffect(() => {
        dispatch(getProducts({ pageNumber, pageSize }))
    }, [pageNumber, pageSize, dispatch])

    // Compute available subcategories
    const allSubCategories = catalogStore.subCategories && catalogStore.subCategories.length > 0
        ? catalogStore.subCategories
        : (catalogStore.categories || []).flatMap((c) => c.subCategories || [])

    // Add Product Form
    const [productForm, setProductForm] = useState({
        productName: "",
        description: "",
        price: "",
        discountPrice: "0",
        quantity: "",
        colorId: "1",
        brandId: "1",
        subCategoryId: "1",
        code: "PRD-" + Math.floor(1000 + Math.random() * 9000),
        weight: "1kg",
        size: "M",
        hasDiscount: false
    })
    const [productImages, setProductImages] = useState<FileList | null>(null)

    // Sync form default ids when stores load
    useEffect(() => {
        if (catalogStore.brands?.length > 0 && productForm.brandId === "1") {
            setProductForm((prev) => ({ ...prev, brandId: String(catalogStore.brands[0].id) }))
        }
        if (catalogStore.colors?.length > 0 && productForm.colorId === "1") {
            setProductForm((prev) => ({ ...prev, colorId: String(catalogStore.colors[0].id) }))
        }
        if (allSubCategories?.length > 0 && productForm.subCategoryId === "1") {
            setProductForm((prev) => ({ ...prev, subCategoryId: String(allSubCategories[0].id) }))
        }
    }, [catalogStore.brands, catalogStore.colors, allSubCategories])

    const handleAddProductSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setAddError(null)
        setIsSubmitting(true)

        try {
            const formData = new FormData()
            formData.append("BrandId", String(productForm.brandId || "1"))
            formData.append("ColorId", String(productForm.colorId || "1"))
            formData.append("SubCategoryId", String(productForm.subCategoryId || "1"))
            formData.append("ProductName", productForm.productName.trim())
            formData.append("Description", productForm.description.trim())
            formData.append("Price", String(productForm.price))
            formData.append("Quantity", String(productForm.quantity))
            formData.append("Code", productForm.code || ("PRD-" + Math.floor(1000 + Math.random() * 9000)))
            formData.append("HasDiscount", String(productForm.hasDiscount))
            formData.append("DiscountPrice", String(productForm.hasDiscount ? productForm.discountPrice : "0"))
            formData.append("Weight", productForm.weight || "1kg")
            formData.append("Size", productForm.size || "M")

            if (productImages && productImages.length > 0) {
                for (let i = 0; i < productImages.length; i++) {
                    formData.append("Images", productImages[i])
                }
            }

            const res = await dispatch(addProduct(formData))
            if (addProduct.fulfilled.match(res)) {
                setIsAddProductOpen(false)
                dispatch(getProducts({ pageNumber, pageSize }))
                setProductForm({
                    productName: "",
                    description: "",
                    price: "",
                    discountPrice: "0",
                    quantity: "",
                    colorId: String(catalogStore.colors?.[0]?.id || "1"),
                    brandId: String(catalogStore.brands?.[0]?.id || "1"),
                    subCategoryId: String(allSubCategories?.[0]?.id || "1"),
                    code: "PRD-" + Math.floor(1000 + Math.random() * 9000),
                    weight: "1kg",
                    size: "M",
                    hasDiscount: false
                })
                setProductImages(null)
            } else {
                const msg = (res.payload as string) || "Ошибка при добавлении товара. Проверьте правильность полей."
                setAddError(typeof msg === 'string' ? msg : JSON.stringify(msg))
            }
        } catch (err: any) {
            setAddError(err.message || "Ошибка отправки данных")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleOpenEditProduct = (p: IProduct) => {
        // Resolve IDs
        const matchedBrand = catalogStore.brands.find((b) => b.brandName?.toLowerCase() === p.brand?.toLowerCase())
        const matchedColor = catalogStore.colors.find((c) => c.colorName?.toLowerCase() === p.color?.toLowerCase())

        setEditingProduct(p)
        setEditError(null)
        setEditForm({
            id: p.id,
            productName: p.productName || "",
            description: p.description || "",
            price: String(p.price || 0),
            discountPrice: String(p.discountPrice || 0),
            quantity: String(p.quantity || 1),
            colorId: matchedColor ? String(matchedColor.id) : String(catalogStore.colors?.[0]?.id || "1"),
            brandId: matchedBrand ? String(matchedBrand.id) : String(catalogStore.brands?.[0]?.id || "1"),
            subCategoryId: String(allSubCategories?.[0]?.id || "1"),
            code: p.code || ("PRD-" + p.id),
            weight: p.weight || "1kg",
            size: p.size || "M",
            hasDiscount: Boolean(p.hasDiscount)
        })
        setEditImages(null)
    }

    const handleEditProductSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setEditError(null)
        setIsSubmitting(true)

        try {
            const updateParams = {
                Id: editForm.id,
                BrandId: Number(editForm.brandId || 1),
                ColorId: Number(editForm.colorId || 1),
                SubCategoryId: Number(editForm.subCategoryId || 1),
                ProductName: editForm.productName.trim(),
                Description: editForm.description.trim(),
                Price: Number(editForm.price),
                Quantity: Number(editForm.quantity),
                Code: editForm.code || ("PRD-" + editForm.id),
                HasDiscount: Boolean(editForm.hasDiscount),
                DiscountPrice: Number(editForm.hasDiscount ? editForm.discountPrice : 0),
                Weight: editForm.weight || "1kg",
                Size: editForm.size || "M"
            }

            const res = await dispatch(updateProduct(updateParams))
            if (updateProduct.fulfilled.match(res)) {
                if (editImages && editImages.length > 0) {
                    await dispatch(addImageToProduct({ productId: editForm.id, files: editImages }))
                }
                setEditingProduct(null)
                dispatch(getProducts({ pageNumber, pageSize }))
            } else {
                const msg = (res.payload as string) || "Ошибка при обновлении товара."
                setEditError(typeof msg === 'string' ? msg : JSON.stringify(msg))
            }
        } catch (err: any) {
            setEditError(err.message || "Ошибка при сохранении")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteProduct = async (id: number, name: string) => {
        if (confirm(`Удалить товар "${name}"?`)) {
            await dispatch(deleteProduct(id))
            dispatch(getProducts({ pageNumber, pageSize }))
        }
    }

    const filteredProducts = (productStore.dataProduct || []).filter((p) => 
        p.productName?.toLowerCase().includes(searchProduct.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchProduct.toLowerCase())
    )

    const totalRecord = productStore.totalRecord || productStore.dataProduct?.length || 0
    const totalPages = productStore.totalPage || Math.ceil(totalRecord / pageSize) || 1

    return (
        <div className="flex flex-col gap-6">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <input
                        type="text"
                        placeholder="Поиск товара на странице..."
                        value={searchProduct}
                        onChange={(e) => setSearchProduct(e.target.value)}
                        className="w-full bg-[#F5F5F5] rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#DB4444]"
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                </div>
                
                <div className="flex items-center gap-3">
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
                            <option value={999}>Все</option>
                        </select>
                    </div>

                    <button
                        onClick={() => {
                            setAddError(null)
                            setIsAddProductOpen(true)
                        }}
                        className="bg-[#DB4444] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-700 transition flex items-center gap-2 justify-center cursor-pointer shadow-sm"
                    >
                        <Plus className="w-4 h-4" /> Добавить товар
                    </button>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                        <tr>
                            <th className="py-3.5 px-4">ID</th>
                            <th className="py-3.5 px-4">Фото</th>
                            <th className="py-3.5 px-4">Название</th>
                            <th className="py-3.5 px-4">Бренд</th>
                            <th className="py-3.5 px-4">Цена</th>
                            <th className="py-3.5 px-4">Скидка</th>
                            <th className="py-3.5 px-4">Кол-во</th>
                            <th className="py-3.5 px-4 text-right">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productStore.loadings.loadingProducts ? (
                            <tr>
                                <td colSpan={8} className="py-12 text-center text-gray-500 animate-pulse font-medium">
                                    Загрузка товаров...
                                </td>
                            </tr>
                        ) : filteredProducts.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="py-10 text-center text-gray-400">
                                    Товары не найдены
                                </td>
                            </tr>
                        ) : (
                            filteredProducts.map((p) => {
                                const rawImg = p.image || p.images?.[0]?.images || ""
                                const imgSrc = getAdminImageUrl(rawImg)
                                return (
                                    <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                        <td className="py-3.5 px-4 text-gray-500">#{p.id}</td>
                                        <td className="py-3.5 px-4">
                                            {imgSrc ? (
                                                <img 
                                                    src={imgSrc} 
                                                    alt={p.productName} 
                                                    className="w-12 h-12 object-contain rounded-md bg-gray-50 border"
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
                                                <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                                                    <Package className="w-6 h-6" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-3.5 px-4 font-semibold text-gray-900">{p.productName}</td>
                                        <td className="py-3.5 px-4 text-gray-600">{p.brand || "-"}</td>
                                        <td className="py-3.5 px-4 font-bold text-gray-900">${p.price}</td>
                                        <td className="py-3.5 px-4">
                                            {p.hasDiscount ? (
                                                <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded font-semibold">
                                                    ${p.discountPrice}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 text-xs">Нет</span>
                                            )}
                                        </td>
                                        <td className="py-3.5 px-4 text-gray-600">{p.quantity}</td>
                                        <td className="py-3.5 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    onClick={() => handleOpenEditProduct(p)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                                                    title="Редактировать товар"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(p.id, p.productName)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                                    title="Удалить товар"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 border border-gray-100 rounded-xl shadow-sm">
                <p className="text-sm text-gray-500">
                    Показано <span className="font-semibold text-gray-800">{Math.min((pageNumber - 1) * pageSize + 1, totalRecord)}</span>–
                    <span className="font-semibold text-gray-800">{Math.min(pageNumber * pageSize, totalRecord)}</span> из <span className="font-semibold text-gray-800">{totalRecord}</span> товаров
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

            {/* MODAL: ADD PRODUCT */}
            {isAddProductOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-xl w-full shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto animate-in fade-in duration-200">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                            <h2 className="text-xl font-bold text-gray-900">Добавить новый товар</h2>
                            <button onClick={() => setIsAddProductOpen(false)} className="text-gray-400 hover:text-black text-2xl font-bold cursor-pointer">&times;</button>
                        </div>

                        {addError && (
                            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{addError}</span>
                            </div>
                        )}

                        <form onSubmit={handleAddProductSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-700">Название товара *</label>
                                <input
                                    type="text"
                                    required
                                    value={productForm.productName}
                                    onChange={(e) => setProductForm({ ...productForm, productName: e.target.value })}
                                    className="bg-[#F5F5F5] rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-[#DB4444]"
                                    placeholder="например: iPhone 16 Pro"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-700">Описание *</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={productForm.description}
                                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                    className="bg-[#F5F5F5] rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-[#DB4444]"
                                    placeholder="Подробное описание товара..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-gray-700">Цена ($) *</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={productForm.price}
                                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                        className="bg-[#F5F5F5] rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-[#DB4444]"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-gray-700">Количество на складе *</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={productForm.quantity}
                                        onChange={(e) => setProductForm({ ...productForm, quantity: e.target.value })}
                                        className="bg-[#F5F5F5] rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-[#DB4444]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-gray-700">Бренд *</label>
                                    <select
                                        value={productForm.brandId}
                                        onChange={(e) => setProductForm({ ...productForm, brandId: e.target.value })}
                                        className="bg-[#F5F5F5] rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-[#DB4444]"
                                    >
                                        {(catalogStore.brands || []).map((b) => (
                                            <option key={b.id} value={b.id}>{b.brandName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-gray-700">Подкатегория *</label>
                                    <select
                                        value={productForm.subCategoryId}
                                        onChange={(e) => setProductForm({ ...productForm, subCategoryId: e.target.value })}
                                        className="bg-[#F5F5F5] rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-[#DB4444]"
                                    >
                                        {allSubCategories.map((s) => (
                                            <option key={s.id} value={s.id}>{s.subCategoryName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-gray-700">Цвет *</label>
                                    <select
                                        value={productForm.colorId}
                                        onChange={(e) => setProductForm({ ...productForm, colorId: e.target.value })}
                                        className="bg-[#F5F5F5] rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-[#DB4444]"
                                    >
                                        {(catalogStore.colors || []).map((cl) => (
                                            <option key={cl.id} value={cl.id}>{cl.colorName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-gray-700">Код товара</label>
                                    <input
                                        type="text"
                                        value={productForm.code}
                                        onChange={(e) => setProductForm({ ...productForm, code: e.target.value })}
                                        className="bg-[#F5F5F5] rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-[#DB4444]"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-gray-700">Вес / Размер</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="1kg"
                                            value={productForm.weight}
                                            onChange={(e) => setProductForm({ ...productForm, weight: e.target.value })}
                                            className="bg-[#F5F5F5] rounded-lg p-3 text-sm w-1/2 outline-none focus:ring-1 focus:ring-[#DB4444]"
                                        />
                                        <input
                                            type="text"
                                            placeholder="M"
                                            value={productForm.size}
                                            onChange={(e) => setProductForm({ ...productForm, size: e.target.value })}
                                            className="bg-[#F5F5F5] rounded-lg p-3 text-sm w-1/2 outline-none focus:ring-1 focus:ring-[#DB4444]"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <input
                                    type="checkbox"
                                    id="hasDiscountCheck"
                                    checked={productForm.hasDiscount}
                                    onChange={(e) => setProductForm({ ...productForm, hasDiscount: e.target.checked })}
                                    className="w-4 h-4 accent-[#DB4444] cursor-pointer"
                                />
                                <label htmlFor="hasDiscountCheck" className="text-sm font-semibold text-gray-800 cursor-pointer">
                                    Товар со скидкой
                                </label>
                                {productForm.hasDiscount && (
                                    <input
                                        type="number"
                                        placeholder="Цена со скидкой ($)"
                                        value={productForm.discountPrice}
                                        onChange={(e) => setProductForm({ ...productForm, discountPrice: e.target.value })}
                                        className="ml-auto bg-white border border-gray-300 rounded px-3 py-1.5 text-sm outline-none w-36 focus:border-[#DB4444]"
                                    />
                                )}
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-700">Фотографии товара *</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => setProductImages(e.target.files)}
                                    className="bg-[#F5F5F5] rounded-lg p-2.5 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#DB4444] file:text-white hover:file:bg-red-700 cursor-pointer"
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsAddProductOpen(false)}
                                    className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 transition cursor-pointer"
                                >
                                    Отмена
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-[#DB4444] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-red-700 transition cursor-pointer disabled:opacity-50"
                                >
                                    {isSubmitting ? "Сохранение..." : "Создать товар"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: EDIT PRODUCT */}
            {editingProduct && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-xl w-full shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto animate-in fade-in duration-200">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Редактировать товар</h2>
                                <p className="text-xs text-gray-500 mt-0.5">ID: #{editingProduct.id} — {editingProduct.productName}</p>
                            </div>
                            <button onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-black text-2xl font-bold cursor-pointer">&times;</button>
                        </div>

                        {editError && (
                            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{editError}</span>
                            </div>
                        )}

                        <form onSubmit={handleEditProductSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-700">Название товара *</label>
                                <input
                                    type="text"
                                    required
                                    value={editForm.productName}
                                    onChange={(e) => setEditForm({ ...editForm, productName: e.target.value })}
                                    className="bg-[#F5F5F5] rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-[#DB4444]"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-700">Описание *</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={editForm.description}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                    className="bg-[#F5F5F5] rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-[#DB4444]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-gray-700">Цена ($) *</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={editForm.price}
                                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                        className="bg-[#F5F5F5] rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-[#DB4444]"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-gray-700">Количество на складе *</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={editForm.quantity}
                                        onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
                                        className="bg-[#F5F5F5] rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-[#DB4444]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-gray-700">Бренд *</label>
                                    <select
                                        value={editForm.brandId}
                                        onChange={(e) => setEditForm({ ...editForm, brandId: e.target.value })}
                                        className="bg-[#F5F5F5] rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-[#DB4444]"
                                    >
                                        {(catalogStore.brands || []).map((b) => (
                                            <option key={b.id} value={b.id}>{b.brandName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-gray-700">Подкатегория *</label>
                                    <select
                                        value={editForm.subCategoryId}
                                        onChange={(e) => setEditForm({ ...editForm, subCategoryId: e.target.value })}
                                        className="bg-[#F5F5F5] rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-[#DB4444]"
                                    >
                                        {allSubCategories.map((s) => (
                                            <option key={s.id} value={s.id}>{s.subCategoryName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-gray-700">Цвет *</label>
                                    <select
                                        value={editForm.colorId}
                                        onChange={(e) => setEditForm({ ...editForm, colorId: e.target.value })}
                                        className="bg-[#F5F5F5] rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-[#DB4444]"
                                    >
                                        {(catalogStore.colors || []).map((cl) => (
                                            <option key={cl.id} value={cl.id}>{cl.colorName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-gray-700">Код товара</label>
                                    <input
                                        type="text"
                                        value={editForm.code}
                                        onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
                                        className="bg-[#F5F5F5] rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-[#DB4444]"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-gray-700">Вес / Размер</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={editForm.weight}
                                            onChange={(e) => setEditForm({ ...editForm, weight: e.target.value })}
                                            className="bg-[#F5F5F5] rounded-lg p-3 text-sm w-1/2 outline-none focus:ring-1 focus:ring-[#DB4444]"
                                        />
                                        <input
                                            type="text"
                                            value={editForm.size}
                                            onChange={(e) => setEditForm({ ...editForm, size: e.target.value })}
                                            className="bg-[#F5F5F5] rounded-lg p-3 text-sm w-1/2 outline-none focus:ring-1 focus:ring-[#DB4444]"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <input
                                    type="checkbox"
                                    id="editHasDiscountCheck"
                                    checked={editForm.hasDiscount}
                                    onChange={(e) => setEditForm({ ...editForm, hasDiscount: e.target.checked })}
                                    className="w-4 h-4 accent-[#DB4444] cursor-pointer"
                                />
                                <label htmlFor="editHasDiscountCheck" className="text-sm font-semibold text-gray-800 cursor-pointer">
                                    Товар со скидкой
                                </label>
                                {editForm.hasDiscount && (
                                    <input
                                        type="number"
                                        placeholder="Цена со скидкой ($)"
                                        value={editForm.discountPrice}
                                        onChange={(e) => setEditForm({ ...editForm, discountPrice: e.target.value })}
                                        className="ml-auto bg-white border border-gray-300 rounded px-3 py-1.5 text-sm outline-none w-36 focus:border-[#DB4444]"
                                    />
                                )}
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-700">Добавить новые фото</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => setEditImages(e.target.files)}
                                    className="bg-[#F5F5F5] rounded-lg p-2.5 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#DB4444] file:text-white hover:file:bg-red-700 cursor-pointer"
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingProduct(null)}
                                    className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 transition cursor-pointer"
                                >
                                    Отмена
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-[#DB4444] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-red-700 transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
                                >
                                    <Check className="w-4 h-4" />
                                    {isSubmitting ? "Сохранение..." : "Сохранить изменения"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
