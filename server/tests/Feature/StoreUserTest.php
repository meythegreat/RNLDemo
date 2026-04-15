<?php

namespace Tests\Feature;

use App\Models\Gender;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Laravel\Sanctum\Sanctum;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class StoreUserTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_users_can_store_a_user_with_a_profile_picture(): void
    {
        $privateUploadPath = storage_path('app/private/img/user/profile_picture');
        $publicUploadPath = storage_path('app/public/img/user/profile_picture');

        File::deleteDirectory($privateUploadPath);
        File::deleteDirectory($publicUploadPath);

        $gender = Gender::create([
            'gender' => 'Male',
        ]);

        $authenticatedUser = User::factory()->create([
            'gender_id' => $gender->gender_id,
            'username' => 'admin123',
        ]);

        Sanctum::actingAs($authenticatedUser);

        $response = $this->post('/api/user/storeUser', [
            'add_user_profile_picture' => UploadedFile::fake()->image('avatar.jpg'),
            'first_name' => 'Jane',
            'middle_name' => 'Marie',
            'last_name' => 'Doe',
            'suffix_name' => '',
            'gender' => (string) $gender->gender_id,
            'birth_date' => '1999-04-15',
            'username' => 'janedoe',
            'password' => 'secret1',
            'password_confirmation' => 'secret1',
        ]);

        $response
            ->assertOk()
            ->assertJson([
                'message' => 'User successfully saved.',
            ]);

        $storedUser = User::where('username', 'janedoe')->first();

        $this->assertNotNull($storedUser);
        $this->assertNotNull($storedUser->profile_picture);
        $this->assertMatchesRegularExpression('/^[a-f0-9]{40}\.(png|jpg|jpeg)$/', $storedUser->profile_picture);
        $this->assertFileExists($privateUploadPath.'/'.$storedUser->profile_picture);
        $this->assertFileDoesNotExist($publicUploadPath.'/'.$storedUser->profile_picture);
    }

    public function test_signed_profile_picture_route_can_fetch_an_older_public_image(): void
    {
        $publicUploadPath = storage_path('app/public/img/user/profile_picture');
        $filename = sha1('legacy-avatar');
        $imageBytes = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9p2P6QAAAABJRU5ErkJggg==');

        File::ensureDirectoryExists($publicUploadPath);
        File::put($publicUploadPath.'/'.$filename, $imageBytes);

        $gender = Gender::create([
            'gender' => 'Female',
        ]);

        $user = User::factory()->create([
            'gender_id' => $gender->gender_id,
            'profile_picture' => $filename,
            'username' => 'legacy12',
        ]);

        $signedUrl = URL::temporarySignedRoute('user.profile-picture', now()->addMinutes(30), [
            'user' => $user->user_id,
        ]);

        $response = $this->get($signedUrl);

        $response->assertOk();
        $response->assertHeader('content-type', 'image/png');
    }
}
