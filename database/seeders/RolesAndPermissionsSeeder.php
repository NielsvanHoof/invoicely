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

        Permission::create(['name' => 'view invoices']);
        Permission::create(['name' => 'create invoices']);
        Permission::create(['name' => 'edit invoices']);
        Permission::create(['name' => 'delete invoices']);
        Permission::create(['name' => 'download invoices']);
        Permission::create(['name' => 'send invoices']);

        Permission::create(['name' => 'view own invoices']);
        Permission::create(['name' => 'pay invoices']);
        Permission::create(['name' => 'download own invoices']);

        // Create permissions for teams
        Permission::create(['name' => 'manage team']);
        Permission::create(['name' => 'invite team members']);
        Permission::create(['name' => 'remove team members']);

        Permission::create(['name' => 'view analytics']);
        Permission::create(['name' => 'export analytics']);

        Permission::create(['name' => 'manage settings']);
        Permission::create(['name' => 'manage users']);
        Permission::create(['name' => 'manage teams']);

        // Admin role - has all permissions
        $adminRole = Role::create(['name' => 'admin', 'guard_name' => 'web']);
        $adminRole->givePermissionTo(Permission::all());

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
        $clientRole = Role::create(['name' => 'client', 'guard_name' => 'web']);
        $clientRole->givePermissionTo([
            'view own invoices',
            'pay invoices',
            'download own invoices',
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
