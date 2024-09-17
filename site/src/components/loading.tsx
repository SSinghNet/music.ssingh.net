export default function Loading() {
    return (
        <div className="flex">
            <div
                className="m-auto inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-current border-e-white align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] text-primary" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                    Loading...
                </span>
            </div>
        </div>
    );
}