import { useNavigate } from "react-router-dom";

export default function BackButton() {
    const navigate = useNavigate();

    return (
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-white/50 hover:text-primary transition-colors duration-200 font-bold text-2xl px-1 mb-2">
            ← back
        </button>
    );
}