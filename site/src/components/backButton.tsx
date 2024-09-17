import { useNavigate } from "react-router-dom";

export default function BackButton() {
    const navigate = useNavigate();

    return (
        <button onClick={() => navigate(-1)} className="text-4xl font-bold text-background">←</button>
    );
}