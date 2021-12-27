<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Modalidade extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'dates',
        'hour',
        'price',
    ];

    public function modalidade()
    {
        return $this->hasOne(Modalidade::class);
    }
}
