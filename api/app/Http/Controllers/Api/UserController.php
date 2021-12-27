<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Traits\ApiResponser;
use App\Http\Requests\Api\User\UserUpdateRequest;
use App\Http\Requests\Api\Auth\User\UserRegisterRequest;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    use ApiResponser;

    public function index(){
        $users = User::orderby('updated_at', 'desc')->get();

        return response()->json($users);
    }

    public function store(UserRegisterRequest $request){

        $payload = $request->all();
        $payload['password'] = Hash::make($payload['password']);

        $user = User::create($payload);

        return $this->success([
            'user' => $user,
            'token' => $user->createToken('New User')->plainTextToken
        ], 'Cadastro criado com sucesso.');
    }

    public function show($id){
        $user = User::findOrFail($id);

        return response()->json($user);
    }

    // public function update(UserUpdateRequest $request, $id)
    // {
    //     $user = User::findOrFail($id);
    //
    //     $payload = $request->all();
    //
    //     $user->update($payload);
    //
    //     return $this->success($user, 'Cadastro editado com sucesso.');
    // }

    public function update(Request $request, $id)
    {
      $user = User::findOrFail($id);

      //Caso o email seja do próprio usuário, então alterar só o nome
      if($user->email === $request->email){
          $messages = [
              'name.required' => 'O campo nome é obrigatório',
              'name.max' => 'O campo nome permite no máximo 255 caracteres',
          ];

          $request->validate([
              'name' => 'required|string|max:255',
          ], $messages);


          $user->update([
              'name' => $request->name,
          ]);

          return $this->success($user, 'Cadastro editado com sucesso.');
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
          'email' => 'required|string|email|unique:users,email',
      ], $messages);

      $user->update([
          'name' => $request->name,
          'email' => $request->email,
      ]);

      return $this->success($user, 'Cadastro editado com sucesso.');
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        $user->delete($id);

        return $this->success([], 'Cadastro deletado com sucesso!');
    }
}
