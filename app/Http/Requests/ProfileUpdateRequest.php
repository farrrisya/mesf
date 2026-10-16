<?php

// --1. imports--
namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

// --2. main component--
class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [ // validate
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id), // unique check
            ],
            'ic_number' => ['nullable', 'string', 'max:20', Rule::unique(User::class)->ignore($this->user()->id)], // unique check
            'staff_id' => ['nullable', 'string', 'max:20', Rule::unique(User::class)->ignore($this->user()->id)], // unique check
            'phone_number' => ['nullable', 'string', 'max:20'],
            'gamer_tag' => ['nullable', 'string', 'max:50'],
            'primary_game' => ['nullable', 'string', 'max:100'],
            'state_region' => ['nullable', 'string', 'max:100'],
            'game_ids' => ['nullable', 'array'],
            'bank_name' => ['nullable', 'string', 'max:100'],
            'bank_account_number' => ['nullable', 'string', 'max:50'],
            'monthly_salary' => ['nullable', 'numeric', 'min:0'],
            'department' => ['nullable', 'string', 'max:100'],
            'avatar' => ['nullable', 'image', 'max:4096'],
        ];
    }
}
