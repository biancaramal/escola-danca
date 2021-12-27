<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Boleto extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference',
        'cod',
        'modalidade_id',
        'user_id',
        'status',
    ];

    public function modalidade()
    {
        return $this->belongsTo(Modalidade::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
