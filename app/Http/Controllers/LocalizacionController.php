<?php

namespace App\Http\Controllers;

use App\Services\LocalizacionService;
use Illuminate\Http\Request;

class LocalizacionController extends Controller
{
    protected $localizacionService;

    public function __construct(LocalizacionService $localizacionService)
    {
        $this->localizacionService = $localizacionService;
    }
}
