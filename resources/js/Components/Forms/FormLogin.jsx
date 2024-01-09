import { useEffect } from "react";
import InputLabel from "../InputLabel";
import TextInput from "../TextInput";
import Checkbox from "../Checkbox";
import PrimaryButton from "../PrimaryButton";
import { Link, useForm } from "@inertiajs/react";
import InputError from "../InputError";

export const FormLogin = ({ canResetPassword }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route("login"));
    };

    return (
        <form onSubmit={submit}>
            <div className="w-[50%]">
                <InputLabel htmlFor="email" value="Email" />

                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    autoComplete="email"
                    isFocused={true}
                    placeholder="email"
                    onChange={(e) => setData("email", e.target.value)}
                />

                <InputError message={errors.email} className="mt-2" />
            </div>

            <div className="mt-4 w-[50%]">
                <InputLabel htmlFor="password" value="Contraseña" />

                <TextInput
                    id="password"
                    type="password"
                    name="password"
                    value={data.password}
                    placeholder="Contraseña"
                    className="mt-1 block w-full"
                    autoComplete="current-password"
                    onChange={(e) => setData("password", e.target.value)}
                />

                <InputError message={errors.password} className="mt-2" />
            </div>

            <div className="block mt-4">
                <label className="flex items-center">
                    <Checkbox
                        name="remember"
                        checked={data.remember}
                        onChange={(e) => setData("remember", e.target.checked)}
                    />
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-700">
                        Recordar contraseña
                    </span>
                </label>
            </div>

            <div className="flex items-center justify-between mt-4 p-2 gap-5">
                <Link
                    href={route("password.request")}
                    className="underline text-sm text-gray-500 dark:text-gray-700 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                >
                    ¿Olvidaste el password?
                </Link>

                <Link
                    href={route("register")}
                    className="underline text-sm text-gray-500 dark:text-gray-700 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                >
                    Crear cuenta
                </Link>

                <PrimaryButton className="ml-4" disabled={processing}>
                    Log in
                </PrimaryButton>
            </div>
        </form>
    );
};
