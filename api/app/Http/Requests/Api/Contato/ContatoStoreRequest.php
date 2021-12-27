<?php

namespace App\Http\Requests\Api\Contato;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class ContatoStoreRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'value' => 'required|string|max:255',
        ];
    }

    public function messages(){
        return [
            'name.required' => 'O campo nome do contato é obrigatório.',
            'name.max' => 'O campo permite no máximo 255 caracteres.',

            'type.required' => 'O campo tipo é obrigatório.',
            'type.max' => 'O campo permite no máximo 255 caracteres.',

            'value.required' => 'O campo valor é obrigatório.',
            'value.max' => 'O campo permite no máximo 255 caracteres.',
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
