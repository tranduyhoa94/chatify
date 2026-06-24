import { useNavigate } from 'react-router';

function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="max-w-3xl w-full mx-auto bg-white/5 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/10">
            <h1 className="text-2xl font-bold text-white">Home</h1>
            <p className="text-gray-400">
                Welcome to the home page.
            </p>
            <div className="flex flex-col gap-4">
                <button className="btn btn-primary" onClick={() => navigate('/auth/login')}>
                    Login
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/auth/signup')}>
                    Sign Up
                </button>
            </div>
        </div>
    )
}

export default HomePage;