<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;
use App\Models\User;
use App\Http\Requests\Api\Auth\User\UserRegisterRequest;
use App\Http\Requests\Api\Auth\User\UserLoginRequest;
use App\Http\Requests\Api\Auth\User\UserPasswordRequest;
use App\Traits\ApiResponser;


class UserAuthController extends Controller
{
    use ApiResponser;

    public function register(UserRegisterRequest $request)
    {
        $payload = $request->all();
        $payload['password'] = Hash::make($payload['password']);

        $user = User::create($payload);

        return $this->success([
            'user' => $user,
            'token' => $user->createToken('New User')->plainTextToken
        ]);
    }

    public function login(UserLoginRequest $request)
    {
        $payload = $request->all();

       // dd($payload);

        if (!Auth::guard('web')->attempt($payload)) {
            return $this->error('As credenciais estão incorretas.', 401);
        }

        $user = auth('web')->user();

        return $this->success([
            'user' => $user,
            'token' => $user->createToken('API Token', ['user'])->plainTextToken,
        ]);
    }

    public function me(Request $request){
        return auth('web')->user();
    }

    public function editarPerfil(AdminUpdateRequest $request) {

        $admin = auth('web')->user();

        $payload = $request->all();

        $admin->update($payload);

        return $this->success($admin, 'Cadastro editado com sucesso.');
    }

    public function alterarSenha(UserPasswordRequest $request){

        $user = auth('web')->user();

        //$usuario = User::findOrFail($user->id);

        $payload = $request->all();

        $payload['password'] = Hash::make($payload['password']);

        $user->update($payload);

        //Apaga todos os tokens, desconecta na hora
        //$user->tokens()->delete();

        return $this->success([], 'Senha alterada com sucesso.');
    }

    public function logout(Request $request)
    {
        $requestToken = $request->header('authorization');
        $personalAccessToken = new PersonalAccessToken();
        $token = $personalAccessToken->findToken(str_replace('Bearer ', '', $requestToken));

        $token->delete();

        //auth()->user()->tokens()->delete();

        return [
            'message' => 'Token excluído.'
        ];
    }
}
