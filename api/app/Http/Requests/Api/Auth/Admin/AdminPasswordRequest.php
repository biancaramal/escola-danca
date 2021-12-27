<?php

namespace App\Http\Requests\Api\Auth\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class AdminPasswordRequest extends FormRequest
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
            'current_password' => 'required',
            'password' => 'required|string|min:8|confirmed',
        ];
    }


    public function messages()
    {
        return [
            'current_password.required' => 'O campo senha atual é obrigatório',

            'password.required' => 'O campo senha é obrigatório.',
            'password.min' => 'O campo senha precisa ter no mínimo 8 caracteres',
            'password.confirmed' => 'O campo confirmação de senha precisa ser igual ao campo senha.',
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
