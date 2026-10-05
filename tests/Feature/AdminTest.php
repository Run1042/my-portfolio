<?php

namespace Tests\Feature;

use App\Models\Message;
use App\Models\Project;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_portfolio_loads_successfully(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);
    }

    public function test_guest_is_redirected_from_admin_to_login(): void
    {
        $response = $this->get('/admin');
        $response->assertRedirect('/admin/login');
    }

    public function test_admin_login_screen_loads(): void
    {
        $response = $this->get('/admin/login');
        $response->assertStatus(200);
    }

    public function test_admin_can_authenticate_and_access_dashboard(): void
    {
        $user = User::factory()->create([
            'email' => 'admin@portfolio.test',
            'password' => bcrypt('password'),
        ]);

        $loginResponse = $this->post('/admin/login', [
            'email' => 'admin@portfolio.test',
            'password' => 'password',
        ]);

        $loginResponse->assertRedirect(route('admin.dashboard'));
        $this->assertAuthenticatedAs($user);

        $dashboardResponse = $this->actingAs($user)->get('/admin/dashboard');
        $dashboardResponse->assertStatus(200);
        $dashboardResponse->assertSee('admin-root');
    }

    public function test_admin_can_fetch_dashboard_data_via_api(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->getJson('/admin/api/dashboard');
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'user',
            'stats' => ['total_projects', 'featured_projects', 'total_skills', 'total_messages', 'unread_messages'],
            'recent_projects',
            'recent_messages',
        ]);
    }

    public function test_admin_can_create_project_via_api(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/admin/api/projects', [
            'title' => 'Sample Test Project',
            'slug' => 'sample-test-project',
            'category' => 'Full-Stack Application',
            'description' => 'Test project description',
            'tags' => 'Laravel, PHPUnit',
            'is_featured' => 1,
            'order' => 1,
        ]);

        $response->assertStatus(200);
        $response->assertJson(['success' => true]);
        $this->assertDatabaseHas('projects', [
            'slug' => 'sample-test-project',
        ]);
    }

    public function test_admin_can_add_skill_via_api(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/admin/api/skills', [
            'name' => 'Docker',
            'category' => 'DevOps',
            'proficiency' => 85,
            'order' => 1,
        ]);

        $response->assertStatus(200);
        $response->assertJson(['success' => true]);
        $this->assertDatabaseHas('skills', [
            'name' => 'Docker',
        ]);
    }

    public function test_visitor_can_submit_contact_message(): void
    {
        $response = $this->post('/contact', [
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'subject' => 'Hiring Inquiry',
            'message' => 'Looking to hire for a project.',
        ]);

        $response->assertSessionHas('contact_success');
        $this->assertDatabaseHas('messages', [
            'email' => 'jane@example.com',
        ]);
    }

    public function test_role_and_permission_system(): void
    {
        $role = \App\Models\Role::create([
            'name' => 'Editor',
            'slug' => 'editor',
        ]);

        $permission = \App\Models\Permission::create([
            'name' => 'Edit Projects',
            'slug' => 'projects.edit',
            'category' => 'Projects',
        ]);

        $role->permissions()->attach($permission->id);

        $user = User::factory()->create();
        $user->assignRole('editor');

        $this->assertTrue($user->hasRole('editor'));
        $this->assertTrue($user->hasPermission('projects.edit'));
        $this->assertFalse($user->hasPermission('users.manage'));
    }

    public function test_admin_can_manage_roles_via_api(): void
    {
        $admin = User::factory()->create();

        // 1. Get roles
        $response = $this->actingAs($admin)->getJson('/admin/api/roles');
        $response->assertStatus(200);
        $response->assertJsonStructure(['roles', 'permissions', 'permissions_by_category']);

        // 2. Create role
        $createRes = $this->actingAs($admin)->postJson('/admin/api/roles', [
            'name' => 'Support Agent',
            'slug' => 'support-agent',
            'description' => 'Handle support messages',
        ]);
        $createRes->assertStatus(200);
        $createRes->assertJson(['success' => true]);
        $this->assertDatabaseHas('roles', ['slug' => 'support-agent']);
    }

    public function test_admin_can_manage_users_via_api(): void
    {
        $admin = User::factory()->create();

        // 1. Get users
        $response = $this->actingAs($admin)->getJson('/admin/api/users');
        $response->assertStatus(200);
        $response->assertJsonStructure(['users', 'roles']);

        // 2. Create user
        $createRes = $this->actingAs($admin)->postJson('/admin/api/users', [
            'name' => 'David Meng',
            'email' => 'david@portfolio.test',
            'password' => 'secret123',
        ]);
        $createRes->assertStatus(200);
        $createRes->assertJson(['success' => true]);
        $this->assertDatabaseHas('users', ['email' => 'david@portfolio.test']);
    }
}
