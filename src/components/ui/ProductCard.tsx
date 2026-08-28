import type { IProduct } from "../../reducer/productSlice";



interface Props{
    product: IProduct
}

export default function ProductCard({product}:Props) {

    
    return(
        <>
            <div className="flex flex-col w-70 gap-1">
                <img className="w-full object-cover pb-3 h-60" src={`https://store-api.softclub.tj/images/${product.image}`} alt="" />
                <p className="text-xl font-semibold">{product.productName}</p>
                <div className="flex gap-1">
                    <p className="text-red-400 text-lg font-semibold">${product.price}</p>
                    {product.hasDiscount ? <p className="text-[#7F7F7F]">${product.discountPrice}</p> : ""}
                </div>
            </div>
        </>
    )
}
