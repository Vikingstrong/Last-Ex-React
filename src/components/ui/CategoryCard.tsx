import type { ICategory } from "../../reducer/catalogSlice"



interface Props{
    category: ICategory
}

export default function CategoryCard({category}:Props) {

    
    return (
        <div className="flex flex-col group transition-all duration-200 cursor-pointer hover:bg-[#DB4444] hover:border-[#DB4444] hover:text-white items-center gap-3 p-5 w-45 border border-gray-300 rounded-sm">
            <img className="group-hover:invert-100 transition-all duration-200" src={`https://store-api.softclub.tj/images/${category.categoryImage}`} alt="" />
            <p className="text-lg font-semibold">{category.categoryName}</p>
        </div>
    )
}
