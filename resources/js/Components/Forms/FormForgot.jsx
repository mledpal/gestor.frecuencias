import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Link, useForm } from "@inertiajs/react";

export const FormForgot = ({ status }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("password.email"));
    };

    return (
        <form onSubmit={submit} encType="multipart/form-data" className="grid ">
            <div className="w-full flex flex-row place-content-center gap-10">
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="email"
                        onChange={(e) => setData("email", e.target.value)}
                        placeholder="E-mail"
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>
            </div>

            <div className="flex items-center justify-between mt-4 p-2 gap-5">
                <Link
                    href={route("register")}
                    className="underline text-sm text-gray-500 dark:text-gray-700 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                >
                    Crear cuenta
                </Link>

                <Link
                    href={route("login")}
                    className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                >
                    ¿Ya registrado?
                </Link>

                <PrimaryButton className="ml-4" disabled={processing}>
                    Enviar Contraseña
                </PrimaryButton>
            </div>
        </form>
    );
};
