<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;
use App\Traits\ApiResponser;

class SanctumAbilitiesCheck
{
    use ApiResponser;

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next, ...$abilities)
    {
        

        $requestToken = $request->header('authorization');
        $personalAccessToken = new PersonalAccessToken();
        $token = $personalAccessToken->findToken(str_replace('Bearer ', '', $requestToken));

        //Se não o token foi excluído
        // if($token === null){
        //     return $this->error('Erro interno. Por favor, faça login novamente.', 500);
        // }

        foreach ($abilities as $ability) {
            //Verifica se a guard e token tem msm valor
            if ($ability != $token->abilities[0]) {
                // abort(400, 'Access denied');

                return response()->json('Você não tem acesso a estas informações do sistema.', 401);
            }
        }

        return $next($request);
    }
}
