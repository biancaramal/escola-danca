<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;
use App\Http\Requests\Api\Auth\Admin\AdminLoginRequest;
use App\Http\Requests\Api\Auth\Admin\AdminPasswordRequest;
use App\Http\Requests\Api\Auth\Admin\AdminRegisterRequest;
use App\Http\Requests\Api\Admin\AdminUpdateRequest;
use App\Traits\ApiResponser;
use Laravel\Sanctum\HasApiTokens;

class AdminAuthController extends Controller
{
    use ApiResponser;

    public function register(AdminRegisterRequest $request)
    {
        $payload = $request->all();
        $payload['password'] = Hash::make($payload['password']);

        $user = Admin::create($payload);

        return $this->success([
            'user' => $user,
            //'token' => $user->createToken('New Admin')->plainTextToken
        ]);
    }

    public function login(AdminLoginRequest $request)
    {
        $payload = $request->all();

        if (!Auth::guard('admin')->attempt($payload)) {
            return $this->error('As credenciais estão incorretas.', 401);
        }

        $admin = auth('admin')->user();
        // dd($admin);

        return $this->success([
            'admin' => $admin,
            'token' => $admin->createToken('API Token', ['admin'])->plainTextToken,
        ]);
    }

    public function me(Request $request){

        if(auth('admin')->user() === null){
            return $this->error('Token inválido. Por favor, deslogue do sistema e faça login novamente.', 401);
        }

        return auth('admin')->user();
    }

    public function alterarSenha(AdminPasswordRequest $request){

        $admin = auth('admin')->user();

        $usuario = Admin::findOrFail($admin->id);

        //Verifica se a senha atual é igual a cadastrada no banco
        if(!Hash::check($request->current_password, $usuario->password)){
            return $this->error('A senha atual não confere com a cadastrada na base de dados.', 401);
        }

        $payload = $request->all();

        $payload['password'] = Hash::make($payload['password']);

        $usuario->update($payload);

        //Apaga todos os tokens, desconecta na hora (?)
        //$admin->tokens()->delete();

        return $this->success([], 'Senha alterada com sucesso.');
    }

    public function editarPerfil(Request $request, $id)
    {
        $admin = Admin::findOrFail($id);
        //$admin = auth('admin')->user();

        //Caso o email seja do próprio usuário, então alterar só o nome
        if($admin->email === $request->email){
            $messages = [
                'name.required' => 'O campo nome é obrigatório',
                'name.max' => 'O campo nome permite no máximo 255 caracteres',
            ];

            $request->validate([
                'name' => 'required|string|max:255',
            ], $messages);


            $admin->update([
                'name' => $request->name,
            ]);

            return $this->success($admin, 'Cadastro editado com sucesso.');
        }

        //Caso tenha alteração no email, alterar tudo
        $messages = [
            'name.required' => 'O campo nome é obrigatório',
            'name.max' => 'O campo nome permite no máximo 255 caracteres',

            'email.required' => 'O campo email é obrigatório.',
            'email.email' => 'O campo precisa ser um e-mail válido.',
            'email.unique' => 'O e-mail já está cadastrado em nossa base de dados. Tente outro e-mail.',
        ];

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:admins,email',
        ], $messages);

        $admin->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        return $this->success($admin, 'Cadastro editado com sucesso.');
    }

    // public function editarPerfil(AdminUpdateRequest $request) {
    //
    //     $admin = auth('admin')->user();
    //
    //     $payload = $request->all();
    //
    //     $admin->update($payload);
    //
    //     return $this->success($admin, 'Cadastro editado com sucesso.');
    // }

    public function logout(Request $request, $id)
    {

        $admin = auth('admin')->user();

        if($admin === null){
            $admin = Admin::where('id', $id)->first();
            
            if(!$admin){
                return $this->error('Erro. Por favor, deslogue do sistema e tente novamente.', 401);
            }  
        }

        $requestToken = $request->header('authorization');
        $personalAccessToken = new PersonalAccessToken();
        $token = $personalAccessToken->findToken(str_replace('Bearer ', '', $requestToken));

        //Deleta o token, mesmo que não encontre o user
        $token->delete();
        $admin->tokens()->delete();

        return $this->success([], 'Sessão encerrada com sucesso.');
    }
}
