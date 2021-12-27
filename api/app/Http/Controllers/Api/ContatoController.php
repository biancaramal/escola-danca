<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contato;
use Illuminate\Http\Request;
use App\Traits\ApiResponser;
use App\Http\Requests\Api\Contato\ContatoStoreRequest;

class ContatoController extends Controller
{
    use ApiResponser;

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $contatos = Contato::orderby('updated_at', 'desc')->get();

        // if(count($contatos) <= 0){
        //     return $this->error('Não encontramos contatos cadastrados', 404);
        // }

        return response()->json($contatos);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ContatoStoreRequest $request)
    {
        $payload = $request->all();

        $contato = Contato::create($payload);

        return $this->success($contato, 'Contato criado com sucesso.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Contato  $contato
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $contato = Contato::findOrFail($id);

        return response()->json($contato);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Contato  $contato
     * @return \Illuminate\Http\Response
     */
    public function update(ContatoStoreRequest $request, $id)
    {
        $contato = Contato::findOrFail($id);

        if($contato === null){
            return $this->error('Nenhum contato com esta identificação foi encontrado, tente novamente.', 404);
        }

        $payload = $request->all();

        $contato->update($payload);

        return $this->success($contato, 'Contato editado com sucesso.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Contato  $contato
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $contato = Contato::findOrFail($id);

        if($contato === null){
            return $this->error('Nenhum contato com esta identificação foi encontrado, tente novamente.', 404);
        }
        
        $contato->delete($id);

        return $this->success([], 'Contato deletado com sucesso!');
    }
}
