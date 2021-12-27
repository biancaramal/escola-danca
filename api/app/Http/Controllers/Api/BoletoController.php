<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Boleto;
use Illuminate\Http\Request;
use App\Traits\ApiResponser;
use App\Http\Requests\Api\Boleto\BoletoStoreRequest;
use Illuminate\Support\Facades\DB;

class BoletoController extends Controller
{
    use ApiResponser;

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $boletos = DB::select("SELECT b.id, b.reference, b.cod, m.name as 'modalidade', u.name as 'user', b.status FROM boletos as b INNER JOIN modalidades as m ON b.modalidade_id = m.id INNER JOIN users as u ON b.user_id = u.id ORDER BY b.updated_at DESC");

        return response()->json($boletos);
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
    public function store(BoletoStoreRequest $request)
    {
        $payload = $request->all();

        $boleto = Boleto::create($payload);

        return $this->success($boleto, 'Boleto criado com sucesso.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Boleto  $boleto
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $boleto = Boleto::findOrFail($id)->with('user')->with('modalidade')->where('id', $id)->first();

        return response()->json($boleto);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Boleto  $boleto
     * @return \Illuminate\Http\Response
     */
    public function edit(Boleto $boleto)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Boleto  $boleto
     * @return \Illuminate\Http\Response
     */
    public function update(BoletoStoreRequest $request, $id)
    {
        $boleto = Boleto::findOrFail($id);

        $payload = $request->all();

        $boleto->update($payload);

        return $this->success($boleto, 'Boleto editado com sucesso.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Boleto  $boleto
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $boleto = Boleto::findOrFail($id);

        $boleto->delete($id);

        return $this->success([], 'Boleto deletado com sucesso!');
    }
}
