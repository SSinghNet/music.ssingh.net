export default function SkeletonCard() {
    return (
        <div className="bg-black text-white rounded-lg overflow-hidden m-2 flex flex-col border-t-4 border-primary animate-pulse">
            <div className="w-full aspect-square bg-background" />
            <div className="p-3 pb-1">
                <div className="h-5 bg-background rounded w-3/4" />
            </div>
            <div className="px-2 py-2 flex flex-wrap gap-1">
                <div className="h-6 w-20 bg-background rounded" />
                <div className="h-6 w-16 bg-background rounded" />
            </div>
            <div className="flex flex-wrap gap-1 px-2 pb-2">
                <div className="h-5 w-24 bg-background rounded" />
                <div className="h-5 w-16 bg-background rounded" />
            </div>
            <div className="px-3 py-2 mt-auto">
                <div className="h-3 w-20 bg-background rounded" />
            </div>
        </div>
    );
}
