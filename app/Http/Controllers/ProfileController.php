<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileImageRequest;
use App\Http\Requests\ProfileUpdateRequest;
use App\Models\User;
use Dotenv\Validator;
use GuzzleHttp\Psr7\UploadedFile;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rules;
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
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */

    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        if (isset($request->indicativo)) {
            $request->user()->indicativo = $request->indicativo;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Función para guardar imágenes de usuario
     */
    public function upload(ProfileImageRequest $request) {

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

            //añado los archivos a las carpetas
            if (!is_null($request->file('photo'))) {

                $actual = $request->user()->photo;
                $file = User::setArchivo($request->file('photo'), 'user/' . $request->user()->username , $actual);
                $usuario['photo'] = $file;
            }

            // if (!is_null($request->file('qsl'))) {

            //     $actual = $request->user()->photo;
            //     $file = User::setArchivo($request->file('qsl'), 'user/' . $request->user()->username , $actual);
            //     $usuario['qsl'] = $file;
            // }

            $usuario->save();

            return json_encode(['mensaje' => 'OK']);
        } catch (Throwable $e) {
            return json_encode(['mensaje' => 'KO']);
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
