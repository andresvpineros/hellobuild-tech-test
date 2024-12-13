import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function ProfilePage() {
    const navigate = useNavigate();
    const { user, isAuthenticated, loginWithRedirect, isLoading, logout } = useAuth0();
    const [repos, setRepos] = useState([]);
    const [favoriteRepos, setFavoriteRepos] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loadingRepos, setLoadingRepos] = useState(true);

    const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));

    useEffect(() => {
        if (currentUser?.oauth_access) {
            fetchGitHubRepos();
        }
    }, [currentUser?.oauth_access]);

    const fetchGitHubRepos = async () => {
        try {
            setLoadingRepos(true);
            const response = await axios.get("https://api.github.com/user/repos", {
                headers: {
                    Authorization: `Bearer ${user?.accessToken}`,
                },
            });
            setRepos(response.data);
            setFavoriteRepos(getFavoriteRepos(response.data)); // Filtra los repos favoritos (si los hay)
        } catch (error) {
            enqueueSnackbar('Error fetching GitHub repositories', { variant: "error" });
            console.error('GitHub Fetch Error:', error);
        } finally {
            setLoadingRepos(false);
        }
    };

    // Función para obtener los repositorios favoritos del localStorage para el usuario actual
    const getFavoriteRepos = (allRepos) => {
        const savedFavorites = JSON.parse(localStorage.getItem(user?.email)) || [];
        return allRepos.filter(repo => savedFavorites.includes(repo.id));
    };

    // Función para filtrar repositorios por nombre
    const filteredRepos = repos.filter(repo => repo.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const handleRequireOAuthAccess = () => {
        localStorage.setItem("auth_screen_hint", "required_access");

        loginWithRedirect({
            connection: "github",
            scope: "read:user user:email",
            authorizationParams: {
                screen_hint: "required_access",
                redirect_uri: `${import.meta.env.VITE_AUTH0_REDIRECT_URI}?screen_hint=required_access`,
            },
        });
    }

    const handleLogout = () => {
        localStorage.removeItem(currentUser?.email);
        localStorage.removeItem('loggedInUser');

        logout({ returnTo: window.location.origin });

        navigate('/');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <button
                onClick={handleLogout}
                className="p-2 bg-red-600 text-white rounded mb-4"
            >
                Logout
            </button>
            <h1 className="text-2xl font-bold mb-4">Profile Page</h1>
            {!currentUser?.oauth_access && (
                <div>
                    <h2>Please log in with GitHub to view your repositories.</h2>

                    <div className="flex justify-center w-full gap-1 my-3">
                        <button
                            type="button"
                            onClick={handleRequireOAuthAccess}
                            className="bg-transparent p-2 border rounded-xl w-full"
                        >
                            <i className="fa-brands fa-github"></i>
                            <span className="m-3">Login with GitHub</span>
                        </button>
                    </div>
                </div>
            )}

            {currentUser?.oauth_access && (
                <div className="w-full max-w-4xl">
                    <div className="mb-4 flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Your Repositories</h2>
                        <input
                            type="text"
                            placeholder="Search Repositories"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="p-2 rounded"
                        />
                        <button
                            onClick={handleLogout}
                            className="p-2 bg-red-600 text-white rounded"
                        >
                            Logout
                        </button>
                    </div>

                    {loadingRepos ? (
                        <p>Loading repositories...</p>
                    ) : (
                        <>
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold">All Repositories</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredRepos.map(repo => (
                                        <div key={repo.id} className="border p-4 rounded-lg">
                                            <h4 className="text-lg font-bold">{repo.name}</h4>
                                            <p>{repo.description || "No description available"}</p>
                                            <button
                                                onClick={() => toggleFavoriteRepo(repo.id)}
                                                className="mt-2 p-1 bg-blue-600 text-white rounded"
                                            >
                                                {favoriteRepos.some(fav => fav.id === repo.id)
                                                    ? "Remove from Favorites"
                                                    : "Add to Favorites"}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold">Favorite Repositories</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {favoriteRepos.map(repo => (
                                        <div key={repo.id} className="border p-4 rounded-lg">
                                            <h4 className="text-lg font-bold">{repo.name}</h4>
                                            <p>{repo.description || "No description available"}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}