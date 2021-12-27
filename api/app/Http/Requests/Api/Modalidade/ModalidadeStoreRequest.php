<?php

namespace App\Http\Requests\Api\Modalidade;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class ModalidadeStoreRequest extends FormRequest
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
            'dates' => 'required|string|max:255',
            'hour' => 'required|string|max:255',
            'price' => 'required|string|max:255',
        ];
    }

    public function messages(){
        return [
            'name.required' => 'O campo nome da turma é obrigatório.',
            'name.max' => 'O campo permite no máximo 255 caracteres.',

            'dates.required' => 'O campo dias da semana é obrigatório.',
            'dates.max' => 'O campo permite no máximo 255 caracteres.',

            'hour.required' => 'O campo hora é obrigatório.',
            'hour.max' => 'O campo permite no máximo 255 caracteres.',

            'price.required' => 'O campo valor obrigatório.',
            'price.max' => 'O campo permite no máximo 255 caracteres.',
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
