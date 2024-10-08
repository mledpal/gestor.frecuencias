<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;


use Illuminate\Database\Eloquent\Casts\Attribute;
use Faker\Core\File;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'users';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'username',
        'nombre',
        'apellidos',
        'indicativo',
        'email',
        'password',
        'photo',
        'qsl',
        'localizacion_id',
        'ip',
        'ultima_conexion'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Relación de un usuario con sus comentarios
     */
    public function comentarios()
    {
        return $this->hasMany(Comentario::class);
    }

    /**
     * Relación del usuario con los mensajes enviados
     */
    public function enviados()
    {
        return $this->hasMany(Mensaje::class, 'remitente_id', 'id');
    }

    /**
     * Relación del usuario con los mensajes enviados
     */
    public function recibidos()
    {
        return $this->hasMany(Mensaje::class, 'destinatario_id', 'id');
    }


    /**
     * Relación de un usuario con sus múltiples contactos
     */
    public function contactos(): HasMany
    {
        return $this->hasMany(Contacto::class);
    }

    /**
     * Relación de un usuario con sus roles
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Rol::class, 'users_roles');
    }

    /**
     * Relación de un usuario con su localización
     */
    public function localizacion(): BelongsTo
    {
        return $this->belongsTo(Localizacion::class);
    }


    /**
     *  Función que devuelve el nombre completo
     */
    public function getFullNameAttribute()
    {
        return $this->nombre . " " . $this->apellidos;
    }

    /**
     * Función que devuelve la dirección completa
     */
    public function getDireccionCompletaAttribute()
    {
        if ($this->localizacion) {
            return $this->localizacion->calle . ' ' . $this->localizacion->localidad . ' ' . $this->localizacion->provincia;
        } else {
            return null;
        }
    }

    /**
     * Función que devuelve las coordenadas GPS
     */
    public function getGPSAttribute()
    {
        return $this->localizacion->gps;
    }

    /**
     * Función que devuelve la ruta completa de las imágenes de usuario
     */
    protected function photo(): Attribute
    {
        return Attribute::make(
            get: fn (?string $value) => $value ? '/images/' . $value : '/img/default_user.webp',
        );
    }

    /**
     * Función que devuelve true si el usuario es admin
     */
    public function getisAdminAttribute()
    {
        return $this->roles()->where('id', '2')->exists();
    }


    /**
     * Función que devuelve true si el usuario es Root
     */
    public function getisRootAttribute()
    {
        return $this->roles()->where('id', '1')->exists();
    }


    /**
     * Upload de las imágenes del usuario
     *
     * @param upfile $archivo
     * @param string $ruta
     * @return \Illuminate\Http\Response
     */
    public static function setArchivo($archivo, $ruta, $actual = false)
    {
        if ($archivo) {

            //Elimino el fichero antiguo
            if ($actual) {
                Storage::disk('images')->delete($actual);
            }

            $disk = Storage::disk('images')->put($ruta, $archivo);

            return $disk;
        } else {
            return false;
        }
    }
}
