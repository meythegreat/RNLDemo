<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function loadUsers(Request $request)
    {
        $search = $request->input('search');

        $users = User::with(['gender'])
            ->leftJoin('tbl_genders', 'tbl_users.gender_id', '=', 'tbl_genders.gender_id')
            ->where('tbl_users.is_deleted', false)
            ->orderBy('tbl_users.last_name', 'asc')
            ->orderBy('tbl_users.first_name', 'asc')
            ->orderBy('tbl_users.middle_name', 'asc')
            ->orderBy('tbl_users.suffix_name', 'asc');

        if ($search) {
            $users->where(function ($user) use ($search) {
                $user->where('tbl_users.first_name', 'like', "%{$search}%")
                    ->orWhere('tbl_users.middle_name', 'like', "%{$search}%")
                    ->orWhere('tbl_users.last_name', 'like', "%{$search}%")
                    ->orWhere('tbl_users.suffix_name', 'like', "%{$search}%")
                    ->orWhere('tbl_genders.gender', 'like', "%{$search}%");
            });
        }

        $users = $users->paginate(15);

        $users->getCollection()->transform(function ($user) {
            $user->profile_picture = $this->profilePictureUrl($user);

            return $user;
        });

        return response()->json([
            'users' => $users
        ], 200);
    }

    public function storeUser(Request $request)
    {
        $validated = $request->validate([
            'add_user_profile_picture' => ['nullable', 'image', 'mimes:png,jpg,jpeg'],
            'first_name' => ['required', 'max:55'],
            'middle_name' => ['nullable', 'max:55'],
            'last_name' => ['required', 'max:55'],
            'suffix_name' => ['nullable', 'max:55'],
            'gender' => ['required'],
            'birth_date' => ['required', 'date'],
            'username' => ['required', 'min:6', 'max:12', Rule::unique('tbl_users', 'username')],
            'password' => ['required', 'min:6', 'max:12', 'confirmed'],
            'password_confirmation' => ['required', 'min:6', 'max:12']
        ]);

        if ($request->hasFile('add_user_profile_picture')) {
            $validated['add_user_profile_picture'] = $this->storeProfilePicture(
                $request->file('add_user_profile_picture')
            );
        }

        $age = date_diff(date_create($validated['birth_date']), date_create('now'))->y;

        User::create([
            'profile_picture' => $validated['add_user_profile_picture'] ?? null,
            'first_name' => $validated['first_name'],
            'middle_name' => $validated['middle_name'],
            'last_name' => $validated['last_name'],
            'suffix_name' => $validated['suffix_name'],
            'gender_id' => $validated['gender'],
            'birth_date' => $validated['birth_date'],
            'age' => $age,
            'username' => $validated['username'],
            'password' => $validated['password']
        ]);

        return response()->json([
            'message' => 'User successfully saved.'
        ], 200);
    }

    public function updateUser(Request $request, User $user)
    {
        $validated = $request->validate([
            'edit_user_profile_picture' => ['nullable', 'image', 'mimes:png,jpg,jpeg'],
            'first_name' => ['required', 'max:55'],
            'middle_name' => ['nullable', 'max:55'],
            'last_name' => ['required', 'max:55'],
            'suffix_name' => ['nullable', 'max:55'],
            'gender' => ['required'],
            'birth_date' => ['required', 'date'],
            'username' => ['required', 'min:6', 'max:12', Rule::unique('tbl_users', 'username')->ignore($user)]
        ]);

        if ($request->has('remove_profile_picture') && $request->remove_profile_picture == '1') {
            $this->deleteProfilePicture($user->profile_picture);
            $user->profile_picture = null;
        } else if ($request->hasFile('edit_user_profile_picture')) {
            $this->deleteProfilePicture($user->profile_picture);
            $validated['edit_user_profile_picture'] = $this->storeProfilePicture(
                $request->file('edit_user_profile_picture')
            );
        }

        $age = date_diff(date_create($validated['birth_date']), date_create('now'))->y;

        $user->update([
            'profile_picture' => $validated['edit_user_profile_picture'] ?? $user->profile_picture,
            'first_name' => $validated['first_name'],
            'middle_name' => $validated['middle_name'],
            'last_name' => $validated['last_name'],
            'suffix_name' => $validated['suffix_name'],
            'gender_id' => $validated['gender'],
            'birth_date' => $validated['birth_date'],
            'age' => $age,
            'username' => $validated['username']
        ]);

        $user->profile_picture = $this->profilePictureUrl($user);

        return response()->json([
            'message' => 'User successfully updated.',
            'user' => $user
        ], 200);
    }

    public function showProfilePicture(Request $request, User $user)
    {
        if (! $user->profile_picture) {
            abort(404);
        }

        $profilePicturePath = $this->resolveProfilePicturePath($user->profile_picture);

        if (! $profilePicturePath) {
            abort(404);
        }

        return response()->file($profilePicturePath, [
            'Cache-Control' => 'private, max-age=1800',
            'Content-Type' => File::mimeType($profilePicturePath) ?: 'application/octet-stream',
        ]);
    }

    public function destroyUser(User $user)
    {
        $user->update([
            'is_deleted' => true
        ]);

        return response()->json([
            'message' => 'User Successfully Deleted.'
        ], 200);
    }

    private function profilePictureUrl(User $user): ?string
    {
        if (! $user->profile_picture || ! $this->resolveProfilePicturePath($user->profile_picture)) {
            return null;
        }

        return URL::temporarySignedRoute(
            'user.profile-picture',
            now()->addMinutes(30),
            ['user' => $user->user_id]
        );
    }

    private function storeProfilePicture(UploadedFile $uploadedFile): string
    {
        $extension = $uploadedFile->getClientOriginalExtension();
        $filenameToStore = sha1(Str::uuid()->toString() . microtime(true) . random_bytes(20)) . ($extension ? '.'.$extension : '');
        $privateUploadPath = storage_path('app/private/img/user/profile_picture');

        File::ensureDirectoryExists($privateUploadPath);
        $uploadedFile->move($privateUploadPath, $filenameToStore);

        return $filenameToStore;
    }

    private function deleteProfilePicture(?string $filename): void
    {
        if (! $filename) {
            return;
        }

        $privatePath = storage_path('app/private/img/user/profile_picture/' . $filename);
        $publicPath = storage_path('app/public/img/user/profile_picture/' . $filename);

        if (File::exists($privatePath)) {
            File::delete($privatePath);
        }

        if (File::exists($publicPath)) {
            File::delete($publicPath);
        }
    }

    private function resolveProfilePicturePath(string $filename): ?string
    {
        $privatePath = storage_path('app/private/img/user/profile_picture/' . $filename);

        if (File::exists($privatePath)) {
            return $privatePath;
        }

        $publicPath = storage_path('app/public/img/user/profile_picture/' . $filename);

        if (File::exists($publicPath)) {
            return $publicPath;
        }

        return null;
    }
}
