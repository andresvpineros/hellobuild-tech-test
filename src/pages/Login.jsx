import { useFormik } from "formik";
import { Link, useNavigate } from "react-router";
import * as Yup from "yup";
import { enqueueSnackbar } from 'notistack'
import { useAuth0 } from '@auth0/auth0-react';
import { useState } from "react";

export default function LoginPage() {
    const navigate = useNavigate();
    const { loginWithRedirect, user, isAuthenticated, isLoading } = useAuth0();
    const [isGitHubLoginClicked, setIsGitHubLoginClicked] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Invalid email")
                .required("Email is required"),
            password: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .required("Password is required"),
        }),
        onSubmit: (values) => {
            if (isGitHubLoginClicked) return;

            const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

            const matchingUser = storedUsers.find(
                (user) => user.email === values.email && user.password === values.password
            );

            if (!matchingUser) {
                enqueueSnackbar('User not found', { variant: "error" })
                return;
            }

            localStorage.setItem("loggedInUser", JSON.stringify(matchingUser));
            navigate("/profile");
        },
    });

    const handleGitHubLogin = async () => {
        try {
            setIsGitHubLoginClicked(true);

            localStorage.setItem("auth_screen_hint", "login");

            loginWithRedirect({
                connection: "github",
                scope: "read:user user:email",
                authorizationParams: {
                    screen_hint: "login",
                    redirect_uri: `${import.meta.env.VITE_AUTH0_REDIRECT_URI}?screen_hint=login`,
                },
              });
        } catch (error) {
            enqueueSnackbar('Login error', { variant: "error" })
            console.error("Login error:", error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <form 
                onSubmit={formik.handleSubmit}
                className="bg-transparent p-6 rounded-xl shadow-md max-w-sm w-full"
            >
                <h1 className="text-2xl font-bold mb-4 p-2 text-center">
                    Login
                </h1>
                <div className="flex justify-center w-full gap-1">
                    <button
                        type="button"
                        onClick={handleGitHubLogin}
                        className="bg-transparent p-2 border rounded-xl w-full"
                    >
                        <i className="fa-brands fa-github"></i>
                        <span className="m-3">Continue with GitHub</span>
                    </button>
                </div>
                <div className="relative flex py-5 items-center">
                    <div className="flex-grow border-t border-gray-400"></div>
                        <span className="flex-shrink mx-4 text-gray-400">or</span>
                    <div className="flex-grow border-t border-gray-400"></div>
                </div>
                <div className="mb-4">
                    <div className="flex items-center border rounded-xl mt-1">
                        <span className="px-3 text-gray-600">
                            <i className="fa-solid fa-envelope"></i>
                        </span>
                        <input
                            type="text"
                            name="email"
                            placeholder="Email"
                            className="w-full p-2 focus:outline-none bg-transparent"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    {formik.touched.email && formik.errors.email && (
                        <p className="text-red-500 text-sm">{formik.errors.email}</p>
                    )}
                </div>

                <div className="mb-4">
                    <div className="flex items-center border rounded-xl mt-1">
                        <span className="px-3 text-gray-600">
                            <i className="fa-solid fa-lock"></i>
                        </span>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="w-full p-2 focus:outline-none bg-transparent"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    {formik.touched.password && formik.errors.password && (
                        <p className="text-red-500 text-sm">{formik.errors.password}</p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full my-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Login
                </button>

                <div className="text-center">
                    <span>Don&apos;t have an account yet?</span>{" "}
                    <Link to="/signup" className="text-blue-600 font-bold">
                        Register now!
                    </Link>
                </div>
            </form>
        </div>
    );
}