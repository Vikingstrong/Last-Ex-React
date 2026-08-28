import { Skeleton } from "@mui/material";




export default function SceletonLoader() {

    return(
        <div className="flex gap-5">
            <div className="w-1/5 flex flex-col gap-2">
                <Skeleton variant="rectangular" width="100%" height={200} animation="wave" />
                <Skeleton variant="text" width="50%" height={40} animation="wave" />
            </div>
            <div className="w-1/5 flex flex-col gap-2">
                <Skeleton variant="rectangular" width="100%" height={200} animation="wave" />
                <Skeleton variant="text" width="50%" height={40} animation="wave" />
            </div>
            <div className="w-1/5 flex flex-col gap-2">
                <Skeleton variant="rectangular" width="100%" height={200} animation="wave" />
                <Skeleton variant="text" width="50%" height={40} animation="wave" />
            </div>
            <div className="w-1/5 flex flex-col gap-2">
                <Skeleton variant="rectangular" width="100%" height={200} animation="wave" />
                <Skeleton variant="text" width="50%" height={40} animation="wave" />
            </div>
            <div className="w-1/5 flex flex-col gap-2">
                <Skeleton variant="rectangular" width="100%" height={200} animation="wave" />
                <Skeleton variant="text" width="50%" height={40} animation="wave" />
            </div>
        </div>
    )
}
