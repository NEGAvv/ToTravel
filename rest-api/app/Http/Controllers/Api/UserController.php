<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Review;
use App\Models\TouristPlace;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function getUser(Request $request)
    {
        $user = $request->user();

        return new UserResource($user);
    }

    // Show user profile
    public function show(Request $request)
    {
        $user = $request->user()->load([
            'reviews.place.photos' // підвантажуємо фото разом із місцем
        ]);

        return new UserResource($user);
    }

    // update user profile
    public function update(Request $request)
    {
        $user = $request->user();

        $dataToUpdate = $request->validate([
            'name' => 'sometimes|string|max:255',
            'bio' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'interests' => 'nullable|string',
            'interests.*' => 'string',
            //'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        try {
            if (isset($validatedData['interests'])) {
                $interests = explode(',', $validatedData['interests']);
                $interests = array_map('trim', $interests);
                $validatedData['interests'] = array_filter($interests) ?: null;
            }
            $user->update($dataToUpdate);

            return new UserResource($user);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Avatar upload failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroyOwnProfile(Request $request)
    {
        $user = $request->user();
        $user->delete();

        return response()->json(['message' => 'Your account has been deleted.']);
    }


    // Show 10 users for admin
    public function index()
    {
        $this->authorizeAdmin();
        $users = User::with(['reviews', 'comments'])->get();

        return UserResource::collection($users);
    }
    //Update as admin
    public function adminUpdate(Request $request, $id)
    {
        $this->authorizeAdmin();

        $user = User::findOrFail($id);

        $dataToUpdate = $request->validate([
            'name' => 'sometimes|string|max:255',
            'bio' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'interests' => 'nullable|array',
            'interests.*' => 'string',
            'role' => ['sometimes', Rule::in(['USER', 'ADMIN'])], // allow to change the role
        ]);


        $user->update($dataToUpdate);


        return new UserResource($user);
    }


    // Delete  user as admin
    public function destroy($id)
    {
        $this->authorizeAdmin();

        $user = User::findOrFail($id);

        if ($user->id === auth()->id()) {
            return response()->json(['error' => 'Admins cannot delete themselves'], 403);
        }
        $user->delete();

        return response()->json(['message' => 'User deleted']);
    }

    public function search(Request $request)
    {
        $this->authorizeAdmin();

        $query = strtolower($request->input('query'));

        $users = User::whereRaw('LOWER(name) LIKE ?', ["%{$query}%"])
            ->orWhereRaw('LOWER(email) LIKE ?', ["%{$query}%"])
            ->orWhereRaw('LOWER(location) LIKE ?', ["%{$query}%"])
            ->with(['reviews', 'comments'])
            ->paginate(10);

        return UserResource::collection($users);
    }

    public function stats(Request $request)
    {
        $this->authorizeAdmin();

        return response()->json([
            'users_count' => User::count(),
            'places_count' => TouristPlace::count(),
            'reviews_count' => Review::count(),
        ]);
    }



    // Is admin validation
    protected function authorizeAdmin()
    {
        $user = auth()->user();

        if ($user->role !== 'ADMIN') {
            abort(403, 'Access denied');
        }
    }
}
