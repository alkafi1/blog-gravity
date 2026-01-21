<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;
use Illuminate\Database\Eloquent\Factories\Factory;

class ModuleServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $modulesPath = base_path('Modules');

        if (File::exists($modulesPath)) {
            $modules = File::directories($modulesPath);

            foreach ($modules as $module) {
                $moduleName = basename($module);

                // Load Routes
                if (File::exists($module . '/Routes/web.php')) {
                    Route::middleware('web')
                        ->group($module . '/Routes/web.php');
                }

                if (File::exists($module . '/Routes/api.php')) {
                    Route::prefix('api')
                        ->middleware('api')
                        ->group($module . '/Routes/api.php');
                }

                // Load Views
                if (File::isDirectory($module . '/Resources/Views')) {
                    $this->loadViewsFrom($module . '/Resources/Views', strtolower($moduleName));
                }

                // Load Migrations
                if (File::isDirectory($module . '/Database/Migrations')) {
                    $this->loadMigrationsFrom($module . '/Database/Migrations');
                }
            }
        }

        // Configure Factory Resolution for Modules
        Factory::guessFactoryNamesUsing(function (string $modelName) {
            if (str_starts_with($modelName, 'Modules\\')) {
                // Modules\{Module}\Models\{Model} -> Modules\{Module}\Database\Factories\{Model}Factory
                return str_replace('\\Models\\', '\\Database\\Factories\\', $modelName) . 'Factory';
            }

            return 'Database\\Factories\\' . class_basename($modelName) . 'Factory';
        });
    }
}
