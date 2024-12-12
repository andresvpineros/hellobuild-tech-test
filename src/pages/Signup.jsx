import { Link } from "react-router";

export default function SignupPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <form className="bg-transparent p-6 rounded-xl shadow-md max-w-sm w-full">
                <h1 className="text-2xl font-bold mb-4 p-2 text-center">Sign Up</h1>
                <div className="flex justify-center w-full gap-1">
                    <button
                        className="bg-transparent p-2 border rounded-xl w-full"
                    >
                        <i class="fa-brands fa-github"></i>
                        <span className="m-3">Continue with GitHub</span>
                    </button>
                </div>
                <div class="relative flex py-5 items-center">
                    <div class="flex-grow border-t border-gray-400"></div>
                        <span class="flex-shrink mx-4 text-gray-400">or</span>
                    <div class="flex-grow border-t border-gray-400"></div>
                </div>
                <div className="mb-4">
                    <div className="flex items-center border rounded-xl mt-1">
                        <span className="px-3 text-gray-600">
                            <i class="fa-solid fa-envelope"></i>
                        </span>
                        <input
                            type="text"
                            className="w-full p-2 focus:outline-none bg-transparent"
                            placeholder="Email"
                        />
                    </div>
                </div>
                <div className="mb-4">
                    <div className="flex items-center border rounded-xl mt-1">
                        <span className="px-3 text-gray-600">
                            <i class="fa-solid fa-lock"></i>
                        </span>
                        <input
                            type="password"
                            className="w-full p-2 focus:outline-none bg-transparent"
                            placeholder="Password"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full my-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Login
                </button>
                <div className="text-center">
                    <span>Already have an account?</span> {" "}
                    <Link to="/login" className="text-blue-600 font-bold">Log in now!</Link>
                </div>
            </form>
        </div>
    )
}