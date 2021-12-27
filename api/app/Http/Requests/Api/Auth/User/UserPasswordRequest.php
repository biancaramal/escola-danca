<?php

namespace App\Http\Requests\Api\Auth\User;

use Illuminate\Foundation\Http\FormRequest;

class UserPasswordRequest extends FormRequest
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
            'password' => 'required|string|min:8|confirmed',
        ];
    }

    public function messages()
    {
        return [
            'password.required' => 'O campo senha é obrigatório.',
            'password.min' => 'O campo senha precisa ter no mínimo 8 caracteres',
            'password.confirmed' => 'O campo confirmação de senha precisa ser igual ao campo senha.',
        ];
    }
}
