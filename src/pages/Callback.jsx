import { useEffect } from "react";
import { useNavigate } from "react-router"
import { enqueueSnackbar } from 'notistack'
import { getAccessToken, getGitHubUser } from "../services/githubAuthService";
import { useAuth0 } from "@auth0/auth0-react";

export default function CallbackPage() {
    const navigate = useNavigate();
    const { isAuthenticated, user, loginWithRedirect, error, isLoading, getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        if (isLoading) return;

        if (error) {
            enqueueSnackbar("Authentication failed. Please try again.", { variant: "error"} );
            localStorage.removeItem("auth_screen_hint");

            setTimeout(() => {
                navigate("/login");
            }, 3000);
            return;
        }

        if (isAuthenticated) {
            const screenHint = localStorage.getItem("auth_screen_hint");

            const users = JSON.parse(localStorage.getItem("users")) || [];
            const existingUser = users.find((u) => u.email === user.email);

            if (screenHint === "login") {
                if (existingUser) {
                    enqueueSnackbar(`Welcome back, ${existingUser.name}!`, { variant: "success"} );
                    localStorage.setItem("loggedInUser", JSON.stringify(existingUser));

                    setTimeout(() => {
                        navigate("/profile");
                    }, 3000);
                } else {
                    enqueueSnackbar("User does not exist. Please sign up.", { variant: "error"} );

                    setTimeout(() => {
                        navigate("/login");
                    }, 3000);
                }
            } else if (screenHint === "signup") {
                if (existingUser) {
                    enqueueSnackbar("User already exists. Try with a different user.", { variant: "error"} );

                    setTimeout(() => {
                        navigate("/signup");
                    }, 3000);                    
                } else {
                    users.push({
                        email: user.email,
                        name: user.name,
                        nickname: user.nickname,
                        picture: user.picture,
                        oauth_access: true
                    })
                    localStorage.setItem("users", JSON.stringify(users));

                    enqueueSnackbar("Signup successful! Please log in.", { variant: "success"} );
                    setTimeout(() => {
                        navigate("/login");
                    }, 3000);
                }
            } else if (screenHint === "required_access") {
                const currentUser = localStorage.getItem("loggedInUser");

                const isUserSameAsCurrentUser = existingUser.email === currentUser.email;

                if (existingUser && isUserSameAsCurrentUser) {
                    const updatedUser = {
                        email: existingUser.email,
                        name: existingUser.name,
                        password: existingUser.password,
                        nickname: user.nickname,
                        picture: user.picture,
                        oauth_access: true
                    };

                    const updatedUsers = users.map((u) =>
                        u.email === user.email ? updatedUser : u
                    );

                    localStorage.setItem("users", JSON.stringify(updatedUsers));
                    localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

                    enqueueSnackbar("Authorization succesful!.", { variant: "success"} );

                    setTimeout(() => {
                        navigate("/profile");
                    }, 3000);
                } else {
                    enqueueSnackbar("The user is not the same as the logged in.", { variant: "error"} );

                    setTimeout(() => {
                        navigate("/profile");
                    }, 3000);
                }
            }

            localStorage.removeItem("auth_screen_hint");
        } else {
            enqueueSnackbar("Authentication failed. Please try again.", { variant: "error"} );
            localStorage.removeItem("auth_screen_hint");

            setTimeout(() => {
                navigate("/login");
            }, 3000);
        }
    }, [isAuthenticated, user, error, isLoading, loginWithRedirect, navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center">
            Authenticating...
        </div>
    )
}