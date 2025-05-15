<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions for web guard (users)
        Permission::create(['name' => 'view invoices', 'guard_name' => 'web']);
        Permission::create(['name' => 'create invoices', 'guard_name' => 'web']);
        Permission::create(['name' => 'edit invoices', 'guard_name' => 'web']);
        Permission::create(['name' => 'delete invoices', 'guard_name' => 'web']);
        Permission::create(['name' => 'download invoices', 'guard_name' => 'web']);
        Permission::create(['name' => 'send invoices', 'guard_name' => 'web']);

        // Create permissions for client guard
        Permission::create(['name' => 'view invoices', 'guard_name' => 'client']);
        Permission::create(['name' => 'pay invoices', 'guard_name' => 'client']);
        Permission::create(['name' => 'download invoices', 'guard_name' => 'client']);
        Permission::create(['name' => 'manage team', 'guard_name' => 'client']);
        Permission::create(['name' => 'invite team members', 'guard_name' => 'client']);
        Permission::create(['name' => 'remove team members', 'guard_name' => 'client']);

        // Create permissions for teams (web guard)
        Permission::create(['name' => 'manage team', 'guard_name' => 'web']);
        Permission::create(['name' => 'invite team members', 'guard_name' => 'web']);
        Permission::create(['name' => 'remove team members', 'guard_name' => 'web']);

        Permission::create(['name' => 'view analytics', 'guard_name' => 'web']);
        Permission::create(['name' => 'export analytics', 'guard_name' => 'web']);

        Permission::create(['name' => 'manage settings', 'guard_name' => 'web']);
        Permission::create(['name' => 'manage users', 'guard_name' => 'web']);
        Permission::create(['name' => 'manage teams', 'guard_name' => 'web']);

        // Admin role - has all permissions
        $adminRole = Role::create(['name' => 'admin', 'guard_name' => 'web']);
        $adminRole->givePermissionTo(Permission::where('guard_name', 'web')->get());

        // Invoicer role - can manage invoices and view analytics
        $invoicerRole = Role::create(['name' => 'invoicer', 'guard_name' => 'web']);
        $invoicerRole->givePermissionTo([
            'view invoices',
            'create invoices',
            'edit invoices',
            'delete invoices',
            'download invoices',
            'send invoices',
            'view analytics',
            'manage team',
            'invite team members',
            'remove team members',
        ]);

        // Team member role - limited permissions
        $teamMemberRole = Role::create(['name' => 'team_member', 'guard_name' => 'web']);
        $teamMemberRole->givePermissionTo([
            'view invoices',
            'create invoices',
            'edit invoices',
            'download invoices',
            'send invoices',
            'view analytics',
            'manage team',
            'invite team members',
            'remove team members',
        ]);

        // Client role - can only view and pay their own invoices
        $clientRole = Role::create(['name' => 'client', 'guard_name' => 'client']);
        $clientRole->givePermissionTo([
            'view invoices',
            'pay invoices',
            'download invoices',
            'manage team',
            'invite team members',
            'remove team members',
        ]);

        // Assign admin role to user ID 1 (if exists)
        $admin = User::first();
        if ($admin) {
            $admin->assignRole('admin');
        }

        // Assign client role to all clients
        $clients = Client::get();
        foreach ($clients as $client) {
            $client->assignRole('client');
        }
    }
}
