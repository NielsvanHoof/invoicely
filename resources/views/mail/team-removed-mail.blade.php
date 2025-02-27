<x-mail::message>
    # You've Been Removed from a Team

    Hello {{ $user->name }},

    You are no longer a member of the team. Your access to team resources has been revoked.

    If you believe this was done in error, please contact the team owner directly.

    <x-mail::button :url="route('teams.index')">
        Manage Your Teams
    </x-mail::button>

    <x-mail::panel>
        You can create your own team or join another team by invitation.
    </x-mail::panel>

    Thanks,<br>
    {{ config('app.name') }}
</x-mail::message>