<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;


class CategoryController extends Controller
{
    public function index()
    {
        return Category::with('places')->get();
    }

    public function show($id)
    {
        return Category::with('places')->findOrFail($id);
    }

}
