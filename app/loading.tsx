import { Skeleton } from "@/components/ui/skeleton"

export default function GlobalLoading() {
    return (
        <div className="min-h-[80vh] w-full bg-[#FAFAFA] py-20 px-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Skeleton */}
                <div className="space-y-4">
                    <Skeleton className="h-10 w-3/4 max-w-[600px] bg-gray-200" />
                    <Skeleton className="h-6 w-1/2 max-w-[400px] bg-gray-200" />
                </div>

                {/* Content Body Skeletons */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-10">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white border text-card-foreground shadow-sm rounded-xl p-6 space-y-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border-gray-100">
                            <Skeleton className="h-12 w-12 rounded-full bg-gray-200" />
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-[140px] bg-gray-200" />
                                <Skeleton className="h-4 w-full bg-gray-100" />
                                <Skeleton className="h-4 w-4/5 bg-gray-100" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
