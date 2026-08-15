<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileImageRequest;
use App\Http\Requests\ProfileUpdateRequest;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $userID = Auth::id(); // Obtener el ID del usuario autenticado de forma más directa
        $user = User::with('localizacion')->findOrFail($userID);

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'user' => $user,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Función para guardar imágenes de usuario
     */
    public function upload(ProfileImageRequest $request)
    {

        try {
            $data = $request->except('photo', 'qsl');
            $usuario = $request->user();

            // Imagen de usuario y QSL
            if ($request->hasFile('photo')) {
                $data['photo'] = $request->file('photo');
            }
            if ($request->hasFile('qsl')) {
                $data['qsl'] = $request->file('qsl');
            }

            // añado los archivos a las carpetas
            if (! is_null($request->file('photo'))) {

                // getRawOriginal() para obtener la ruta tal cual está en BD:
                // el accessor `photo` antepone '/images/', y esa ruta no
                // existe en el disco 'images' (su raíz ya es storage/app/images).
                $actual = $request->user()->getRawOriginal('photo');
                $file = User::setArchivo($request->file('photo'), 'user/'.$request->user()->username, $actual);
                $usuario['photo'] = $file;
            }

            // if (!is_null($request->file('qsl'))) {

            //     $actual = $request->user()->photo;
            //     $file = User::setArchivo($request->file('qsl'), 'user/' . $request->user()->username , $actual);
            //     $usuario['qsl'] = $file;
            // }

            $usuario->save();

            return response()->json(['mensaje' => 'OK']);
        } catch (Throwable $e) {
            report($e);

            return response()->json(['mensaje' => 'KO'], 500);
        }

    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
