import { Link } from "react-router"

export default function HomePage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl font-bold mb-4">GitHub Repositories Manager</h1>
            <p className="mb-6 text-gray-400 text-center max-w-md">
                A SPA built for managing GitHub repositories.
                Sign up, log in, and access your repositories using OAuth, with features to search and mark favorites.
            </p>
            <p className="mb-4 text-gray-300 text-sm text-center">
                This application is part of a technical assessment for <a className="text-green-400 font-bold" href="https://www.hellobuild.co/" target="_blank">HelloBuild</a>, 
                developed by <a className="text-blue-500 font-bold" href="https://www.linkedin.com/in/andresvpineros" target="_blank">Brandon Vargas</a>.
            </p>
            <Link to="/login">
                <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium">
                    Get Started
                </button>
            </Link>
        </div>
    )
}