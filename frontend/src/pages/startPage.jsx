import { useNavigate } from "react-router-dom";

export default function StartPage() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to Blogify</h1>
      <button
        onClick={() => navigate("/login")}
        className="px-6 py-3 bg-black text-white rounded-xl"
      >
        Start Writing
      </button>
    </div>
  );
}
