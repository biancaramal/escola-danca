<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Modalidade;
use Illuminate\Http\Request;
use App\Traits\ApiResponser;
use App\Http\Requests\Api\Modalidade\ModalidadeStoreRequest;
use Illuminate\Pagination\SimplePaginator;

class ModalidadeController extends Controller
{
    use ApiResponser;

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //$modalidades = Modalidade::simplePaginate();
        $modalidades = Modalidade::orderby('updated_at', 'desc')->get();
        
        return response()->json($modalidades);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ModalidadeStoreRequest $request)
    {
        $payload = $request->all();

        $modalidade = Modalidade::create($payload);

        return $this->success($modalidade, 'Modalidade criada com sucesso.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Modalidade  $modalidade
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $modalidade = Modalidade::findOrFail($id);

        return response()->json($modalidade);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Modalidade  $modalidade
     * @return \Illuminate\Http\Response
     */
    public function edit(Modalidade $modalidade)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Modalidade  $modalidade
     * @return \Illuminate\Http\Response
     */
    public function update(ModalidadeStoreRequest $request, $id)
    {
        $modalidade = Modalidade::where('id', $id)->first();

        if($modalidade === null){
            return $this->error('Nenhuma modalidade com esta identificação foi encontrada, tente novamente.', 404);
        }

        $payload = $request->all();

        $modalidade->update($payload);

        return $this->success($modalidade, 'Modalidade editada com sucesso.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Modalidade  $modalidade
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $modalidade = Modalidade::where('id', $id)->first();

        if($modalidade === null){
            return $this->error('Nenhuma modalidade com esta identificação foi encontrada, tente novamente.', 404);
        }

        $modalidade->delete($id);

        return $this->success([], 'Modalidade deletada com sucesso!');
    }
}
