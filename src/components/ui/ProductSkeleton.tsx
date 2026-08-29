import { Skeleton } from "@mui/material";

interface Props {
  count?: number;
}

export default function ProductSkeleton({ count = 6 }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex flex-col w-full gap-2">
          <Skeleton
            variant="rectangular"
            width="100%"
            height={256}
            animation="wave"
            sx={{ borderRadius: 1, backgroundColor: "#F5F5F5" }}
          />


          <Skeleton
            variant="text"
            width="75%"
            height={24}
            animation="wave"
            sx={{ mt: 1 }}
          />

          {/* Price skeleton */}
          <Skeleton
            variant="text"
            width="40%"
            height={22}
            animation="wave"
          />

          {/* Rating stars skeleton */}
          <Skeleton
            variant="text"
            width="55%"
            height={20}
            animation="wave"
          />
        </div>
      ))}
    </div>
  );
}
