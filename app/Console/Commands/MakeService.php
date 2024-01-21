<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class MakeService extends Command
{
    protected $signature = 'make:service {name}';
    protected $description = 'Create a new service';

    public function handle()
    {
        $name = $this->argument('name');
        $serviceName = $name . 'Service';

        // Crea la carpeta Services si no existe
        if (!File::exists(app_path('Services'))) {
            File::makeDirectory(app_path('Services'));
        }

        // Crea el archivo del servicio
        $filePath = app_path('Services/' . $serviceName . '.php');
        if (File::exists($filePath)) {
            $this->error('Service already exists!');
            return;
        }

        File::put($filePath, $this->serviceTemplate($serviceName));
        $this->info('Service created successfully!');
    }

    protected function serviceTemplate($name)
    {
        $stub = <<<STUB
<?php

namespace App\Services;

class $name
{
    // Métodos y lógica del servicio
}
STUB;

        return $stub;
    }
}
