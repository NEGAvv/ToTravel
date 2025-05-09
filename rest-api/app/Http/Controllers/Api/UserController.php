<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    // Show user profile
    public function show(Request $request)
    {
        $user = $request->user()->load('reviews');

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
            'interests' => 'nullable|array',
            'interests.*' => 'string',
        ]);

        // $user->update([
        //     ...$dataToUpdate,
        //     'interests' => isset($dataToUpdate['interests']) ? json_encode($dataToUpdate['interests']) : $user->interests,
        // ]);
        $user->update([
            ...$dataToUpdate
        ]);


        return new UserResource($user);
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
        $users = User::with(['reviews', 'comments'])->paginate(10);

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

        // $user->update([
        //     ...$dataToUpdate,
        //     'interests' => isset($dataToUpdate['interests']) ? json_encode($dataToUpdate['interests']) : $user->interests,
        // ]);

        $user->update([
            ...$dataToUpdate
        ]);


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



    // Is admin validation
    protected function authorizeAdmin()
    {
        $user = auth()->user();

        if ($user->role !== 'ADMIN') {
            abort(403, 'Access denied');
        }
    }
}
