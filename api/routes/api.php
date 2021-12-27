<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//Auth Controllers
use App\Http\Controllers\Api\Auth\UserAuthController;
use App\Http\Controllers\Api\Auth\AdminAuthController;

//Controllers
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\VideoController;
use App\Http\Controllers\Api\ImagemController;
use App\Http\Controllers\Api\BoletoController;
use App\Http\Controllers\Api\ModalidadeController;
use App\Http\Controllers\Api\ContatoController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/*
|--------------------------------------------------------------------------
| ROTAS DOS USUÁRIOS
|--------------------------------------------------------------------------
*/
Route::post('/auth/user/register', [UserAuthController::class, 'register']);
Route::post('/auth/user/login', [UserAuthController::class, 'login']);

Route::group(['middleware' => ['sanctum.abilities:user', 'auth:sanctum']], function () {
    //Rotas de perfil
    Route::get('user/me', [UserAuthController::class, 'me']);
    Route::put('user/alterar-senha', [UserAuthController::class, 'alterarSenha']);
    Route::put('user/editar-perfil', [UserAuthController::class, 'editarPerfil']);

    //Rotas de acesso
    Route::apiResource('user/videos', VideoController::class)
    ->only(['index', 'show']);
    Route::apiResource('user/imagens', ImagemController::class)
    ->only(['index', 'show']);
    Route::apiResource('user/boletos', BoletoController::class)
    ->only(['index', 'show']);
    Route::apiResource('user/modalidades', BoletoController::class)
    ->only(['index', 'show']);
    Route::apiResource('user/contatos', ContatoController::class)
    ->only(['index', 'show']);

    //Rota de logout
    Route::post('auth/user/logout', [UserAuthController::class, 'logout']);
});


/*
|--------------------------------------------------------------------------
| ROTAS DOS ADMINISTRADORES
|--------------------------------------------------------------------------
*/
Route::post('/auth/admin/login', [AdminAuthController::class, 'login']);
Route::post('/auth/admin/register', [AdminAuthController::class, 'register']);

Route::group(['middleware' => ['sanctum.abilities:admin', 'auth:sanctum']],function () {
    //Rotas de perfil
    Route::get('admin/me', [AdminAuthController::class, 'me']);
    Route::put('admin/alterar-senha', [AdminAuthController::class, 'alterarSenha']);
    Route::put('admin/editar-perfil/{id}', [AdminAuthController::class, 'editarPerfil']);

    //Rotas de acesso
    Route::apiResource('admin/admins', AdminController::class);
    Route::apiResource('admin/users', UserController::class);
    Route::apiResource('admin/videos', VideoController::class);
    Route::apiResource('admin/imagens', ImagemController::class);
    Route::apiResource('admin/boletos', BoletoController::class);
    Route::apiResource('admin/modalidades', ModalidadeController::class);
    Route::apiResource('admin/contatos', ContatoController::class);

    //Rota de logout
    Route::post('auth/admin/logout/{id}', [AdminAuthController::class, 'logout']);
});
