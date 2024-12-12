import { Link, useNavigate } from "react-router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { enqueueSnackbar } from 'notistack'

export default function SignupPage() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required("Name is required")
                .min(3, "Name must be at least 3 characters"),
            email: Yup.string()
                .email("Invalid email format")
                .required("Email is required"),
            password: Yup.string()
                .required("Password is required")
                .min(6, "Password must be at least 6 characters"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("password"), null], "Passwords must match")
                .required("Please confirm your password"),
        }),
        onSubmit: (values, { setSubmitting, setFieldError }) => {
            const { name, email, password } = values;

            const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

            const existingUser = storedUsers.find((user) => user.email === values.email);
            if (existingUser) {
                enqueueSnackbar('Email is already registered', { variant: "error" })
                return;
            }

            const newUser = {
                name: values.name,
                email: values.email,
                password: values.password,
            };

            storedUsers.push(newUser);
            localStorage.setItem("users", JSON.stringify(storedUsers));
            
            enqueueSnackbar('User registered succesfuly', { variant: "success" })
            setTimeout(() => {
                navigate("/login");
            }, 3000)
        },
    });

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <form 
                onSubmit={formik.handleSubmit}
                className="bg-transparent p-6 rounded-xl shadow-md max-w-sm w-full"
            >
                <h1 className="text-2xl font-bold mb-4 p-2 text-center">Sign Up</h1>
                <div className="flex justify-center w-full gap-1">
                    <button
                        className="bg-transparent p-2 border rounded-xl w-full"
                    >
                        <i className="fa-brands fa-github"></i>
                        <span className="m-3">Register with GitHub</span>
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
                            <i className="fa-solid fa-user"></i>
                        </span>
                        <input
                            type="text"
                            name="name"
                            className="w-full p-2 focus:outline-none bg-transparent"
                            placeholder="Name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    {formik.touched.name && formik.errors.name && (
                        <p className="text-red-500 text-sm">{formik.errors.name}</p>
                    )}
                </div>
                <div className="mb-4">
                    <div className="flex items-center border rounded-xl mt-1">
                        <span className="px-3 text-gray-600">
                            <i className="fa-solid fa-envelope"></i>
                        </span>
                        <input
                            type="text"
                            name="email"
                            className="w-full p-2 focus:outline-none bg-transparent"
                            placeholder="Email"
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
                            className="w-full p-2 focus:outline-none bg-transparent"
                            placeholder="Password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    {formik.touched.password && formik.errors.password && (
                        <p className="text-red-500 text-sm">{formik.errors.password}</p>
                    )}
                </div>
                <div className="mb-4">
                    <div className="flex items-center border rounded-xl mt-1">
                        <span className="px-3 text-gray-600">
                            <i className="fa-solid fa-lock"></i>
                        </span>
                        <input
                            type="password"
                            name="confirmPassword"
                            className="w-full p-2 focus:outline-none bg-transparent"
                            placeholder="Confirm password"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    {formik.touched.confirmPassword &&
                        formik.errors.confirmPassword && (
                            <p className="text-red-500 text-sm">
                                {formik.errors.confirmPassword}
                            </p>
                        )
                    }
                </div>
                <button
                    type="submit"
                    //disabled={formik.isSubmitting}
                    className="w-full my-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Sign Up
                </button>
                <div className="text-center">
                    <span>Already have an account?</span> {" "}
                    <Link to="/login" className="text-blue-600 font-bold">Login now!</Link>
                </div>
            </form>
        </div>
    )
}