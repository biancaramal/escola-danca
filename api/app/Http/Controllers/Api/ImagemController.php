<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Imagem;
use Illuminate\Http\Request;
use App\Traits\ApiResponser;
use App\Http\Requests\Api\Imagem\ImagemStoreRequest;
use App\Http\Requests\Api\Imagem\ImagemUpdateRequest;
use Illuminate\Support\Facades\Storage;

class ImagemController extends Controller
{
    use ApiResponser;

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $imagens = Imagem::orderby('updated_at', 'desc')->get();

        // Se contiver imagens, então as envia decodificadas
        if(count($imagens) > 0){
            foreach($imagens as $valor){
                $media = $valor->path;
                $imagem = base64_decode($media);
                $dados = utf8_decode($imagem);

                $image[] = ([
                    'id' => $valor->id,
                    'name' => $valor->name,
                    'path'=> $dados,
                ]);
            }

            return response()->json($image);
        }

        //Se não tiver, retorna o array vazio
        return response()->json($imagens);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

     public function store(ImagemStoreRequest $request){
        //retirado file de request para receber blob
        if($request->has('path') && strpos($request->path, ';base64')){
          $payload = $request->all();

          $base64 = $request->path;

           //Extensão do arquivo
           $extension = explode('/', $base64);
           $str = $extension[61];
           $extension = explode(';', $extension[1]);
           $extension = '.'.$extension[0];

           $name = md5($str .strtotime('now')). $extension;

           //Obtem o arquivo
           $sepatorFile = explode(',', $base64);
           $file = $sepatorFile[1];
           $path = 'public/media/';


            //Envia a imagem
            Storage::put($path.$name, base64_decode($file), 'public');

            $teste = utf8_encode($name);
            $encode = base64_encode($teste);

            //Save to DB
            $imagem = Imagem::create([
                 'name' => $request->name,
                 'path' => $encode,
             ]);

             return $this->success($imagem, 'Imagem criada com sucesso.');
        }
     }

    // public function store(ImagemStoreRequest $request)
    // {
    //     $payload = $request->all();
    //
    //     //Testes com blob
    //     $img = $request->file('path');
    //     $extension = $img->extension();
    //     $name = md5($img->getClientOriginalName().strtotime('now')). '.' .$extension;
    //
    //     $img->move(storage_path('app/public/media/'), $name);
    //
    //     $encode = utf8_encode($name);
    //     $img = base64_encode($encode);
    //
    //     $imagem = Imagem::create([
    //         'name' => $request->name,
    //         'path' => $img,
    //     ]);
    //
    //     return $this->success($imagem, 'Imagem criada com sucesso.');
    // }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Imagem  $imagem
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $imagem = Imagem::findOrFail($id);

        $decode= base64_decode($imagem->path);
        $dados = utf8_decode($decode);

        $imagem->path = $dados;

        return response()->json($imagem);
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Imagem  $imagem
     * @return \Illuminate\Http\Response
     */
    public function update(ImagemUpdateRequest $request, $id)
    {
        $imagem = Imagem::where('id', $id)->first();

        if($imagem === null){
            return $this->error('Nenhuma imagem com esta identificação foi encontrada, tente novamente.', 404);
        }

        $imagem->update([
            'name' => $request->name,
        ]);

        return $this->success($imagem, 'Nome da imagem editado com sucesso.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Imagem  $imagem
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $imagem = Imagem::where('id', $id)->first();

        if($imagem === null){
            return $this->error('Nenhuma imagem com esta identificação foi encontrada, tente novamente.', 404);
        }

        $imagem->delete($id);

        $path = $imagem->path;

        $img = base64_decode($path);
        $dados = utf8_decode($img);

        $delete = Storage::delete('public/media/' .$dados);

        return $this->success([], 'Imagem deletada com sucesso!');
    }
}
