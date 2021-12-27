<?php

namespace App\Http\Controllers\Api;

use App\Models\Admin;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Traits\ApiResponser;
use App\Http\Requests\Api\Auth\Admin\AdminRegisterRequest;
use App\Http\Requests\Api\Admin\AdminUpdateRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    use ApiResponser;

    public function index(){

        $admin = auth('admin')->user();

        //Selecionando todos os usuários logados, menos o próprio admin
        $admins = Admin::where('id', '<>', $admin->id)->orderby('created_at', 'desc')->get();

        return response()->json($admins);
    }

    public function store(AdminRegisterRequest $request){

        $payload = $request->all();

        $payload['password'] = Hash::make($payload['password']);

        $admin = Admin::create($payload);

        return $this->success([
            'admin' => $admin,
            'token' => $admin->createToken('New Admin')->plainTextToken
        ], 'Cadastro criado com sucesso.');
    }

    public function show($id){
        $admin = Admin::findOrFail($id);

        return response()->json($admin);
    }

    public function update(Request $request, $id)
    {
        $admin = Admin::findOrFail($id);

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

    // public function update(AdminUpdateRequest $request, $id)
    // {


    //     $admin = Admin::findOrFail($id);

    //     //Caso o email seja do próprio usuário, então alterar só o nome
    //     if($admin->email === $request->email){
    //         $messages = [
    //             'name.required' => 'O campo nome é obrigatório',
    //             'name.max' => 'O campo nome permite no máximo 255 caracteres',
    //         ];

    //         $request->validate([
    //             'name' => 'required|string|max:255',
    //         ], $messages);


    //         $admin->update([
    //             'name' => $request->name,
    //         ]);

    //         return $this->success($admin, 'Cadastro2 editado com sucesso.');
    //     }

    //     //Caso tenha alteração no email, alterar tudo
    //     $messages = [
    //         'name.required' => 'O campo nome é obrigatório',
    //         'name.max' => 'O campo nome permite no máximo 255 caracteres',

    //         'email.required' => 'O campo email é obrigatório.',
    //         'email.email' => 'O campo precisa ser um e-mail válido.',
    //         'email.unique' => 'O e-mail já está cadastrado em nossa base de dados.',
    //     ];

    //     $request->validate([
    //         'name' => 'required|string|max:255',
    //         'email' => 'required|string|email|unique:admins,email',
    //     ], $messages);

    //     $admin->update([
    //         'name' => $request->name,
    //         'email' => $request->email,
    //     ]);

    //     return $this->success($admin, 'Cadastro1 editado com sucesso.');
    // }


    public function destroy($id)
    {
        $admin = Admin::findOrFail($id);

        $admin->delete($id);

        return $this->success([], 'Cadastro deletado com sucesso!');
    }
}
