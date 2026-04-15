<?php

namespace Tests\Feature;

use App\Models\Gender;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class UpdateUserProfilePictureTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_users_can_replace_an_existing_profile_picture(): void
    {
        $privateUploadPath = storage_path('app/private/img/user/profile_picture');
        File::deleteDirectory($privateUploadPath);
        File::ensureDirectoryExists($privateUploadPath);

        $gender = Gender::create([
            'gender' => 'Male',
        ]);

        $authenticatedUser = User::factory()->create([
            'gender_id' => $gender->gender_id,
            'username' => 'admin123',
        ]);

        $oldFilename = sha1('old-picture').'.jpg';
        File::put($privateUploadPath.'/'.$oldFilename, 'old-image');

        $user = User::factory()->create([
            'gender_id' => $gender->gender_id,
            'profile_picture' => $oldFilename,
            'username' => 'janedoe',
        ]);

        Sanctum::actingAs($authenticatedUser);

        $response = $this->post('/api/user/updateUser/'.$user->user_id, [
            '_method' => 'PUT',
            'edit_user_profile_picture' => UploadedFile::fake()->image('new-avatar.jpg'),
            'first_name' => $user->first_name,
            'middle_name' => $user->middle_name ?? '',
            'last_name' => $user->last_name,
            'suffix_name' => $user->suffix_name ?? '',
            'gender' => (string) $gender->gender_id,
            'birth_date' => $user->birth_date,
            'username' => $user->username,
        ]);

        $response->assertOk();

        $user->refresh();

        $this->assertNotNull($user->profile_picture);
        $this->assertNotSame($oldFilename, $user->profile_picture);
        $this->assertFileDoesNotExist($privateUploadPath.'/'.$oldFilename);
        $this->assertFileExists($privateUploadPath.'/'.$user->profile_picture);
        $this->assertStringContainsString(
            '/api/user/profile-picture/'.$user->user_id,
            $response->json('user.profile_picture')
        );
    }

    public function test_authenticated_users_can_remove_an_existing_profile_picture(): void
    {
        $privateUploadPath = storage_path('app/private/img/user/profile_picture');
        File::deleteDirectory($privateUploadPath);
        File::ensureDirectoryExists($privateUploadPath);

        $gender = Gender::create([
            'gender' => 'Female',
        ]);

        $authenticatedUser = User::factory()->create([
            'gender_id' => $gender->gender_id,
            'username' => 'admin124',
        ]);

        $oldFilename = sha1('remove-picture').'.jpg';
        File::put($privateUploadPath.'/'.$oldFilename, 'old-image');

        $user = User::factory()->create([
            'gender_id' => $gender->gender_id,
            'profile_picture' => $oldFilename,
            'username' => 'janedoe2',
        ]);

        Sanctum::actingAs($authenticatedUser);

        $response = $this->post('/api/user/updateUser/'.$user->user_id, [
            '_method' => 'PUT',
            'remove_profile_picture' => '1',
            'first_name' => $user->first_name,
            'middle_name' => $user->middle_name ?? '',
            'last_name' => $user->last_name,
            'suffix_name' => $user->suffix_name ?? '',
            'gender' => (string) $gender->gender_id,
            'birth_date' => $user->birth_date,
            'username' => $user->username,
        ]);

        $response->assertOk();

        $user->refresh();

        $this->assertNull($user->profile_picture);
        $this->assertFileDoesNotExist($privateUploadPath.'/'.$oldFilename);
        $this->assertNull($response->json('user.profile_picture'));
    }
}
