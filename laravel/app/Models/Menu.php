<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    use HasFactory;
    protected $with = ["user","categories"];

    protected $guarded = [];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function scopeByCategory($query,$filter){
        $query->when($filter["category"]??false,function ($query,$slug){
            $query->whereHas('category',function ($query) use ($slug) {
                $query->where("slug",$slug);
            });
        });
    }


    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
