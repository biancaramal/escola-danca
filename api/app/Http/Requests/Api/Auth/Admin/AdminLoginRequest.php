<?php

namespace App\Http\Requests\Api\Auth\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AdminLoginRequest extends FormRequest
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
            'email' => 'required|string|email|',
            'password' => 'required|string|min:8'
        ];
    }

    public function messages(){
        return [
            'email.required' => 'O campo email é obrigatório.',
            'email.email' => 'O campo precisa ser um e-mail válido.',
            'password.required' => 'O campo senha é obrigatório.',
            'password.min' => 'O campo senha precisa ter no mínimo 8 caracteres'
        ];
    }
}
