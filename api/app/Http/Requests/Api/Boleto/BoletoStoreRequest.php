<?php

namespace App\Http\Requests\Api\Boleto;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class BoletoStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'reference' => 'required|string|max:255',
            'cod' => 'required|string|max:255',
            'modalidade_id' => 'required',
            'user_id' => 'required',
            'status' => 'required|string|max:255',
        ];
    }

    public function messages(){
        return [
            'reference.required' => 'O campo mês de referência é obrigatório.',
            'reference.max' => 'O campo permite no máximo 255 caracteres.',

            'cod.required' => 'O campo código é obrigatório.',
            'cod.max' => 'O campo permite no máximo 255 caracteres.',

            'modalidade_id.required' => 'O campo turma é obrigatório.',

            'user_id.required' => 'O campo usuário é obrigatório.',

            'status.required' => 'O campo status do boleto é obrigatório.',
            'status.max' => 'O campo permite no máximo 255 caracteres.',
        ];
    }

    //Tratando os erros pra enviar em um único array
    public function failedValidation(Validator $validator) { 
       
        foreach ($validator->errors()->messages() as $arrayMessage){
            foreach($arrayMessage as $message){
                $response[] = $message;
            }
        }

        $error['errors'] = $response;

        throw new HttpResponseException(response()->json($error, 422)); 
    }

}
