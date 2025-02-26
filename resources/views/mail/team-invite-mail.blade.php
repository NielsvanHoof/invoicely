<x-mail::message>
# You've Been Invited to Join a Team!

**{{ $sender->name }}** has invited you to join their team **{{ $team->name }}** on {{ config('app.name') }}.

As a team member, you'll be able to:
- Collaborate on invoices
- Share client information
- Access team resources

@if(isset($password))
## Account Information
An account has been created for you with the following details:

**Email:** {{ $recipient->email }}
**Password:** {{ $password }}

Please change your password after your first login.
@endif

<x-mail::button :url="route('login')">
Access Your Account
</x-mail::button>

If you already have an account, simply log in to access your new team.

If you did not expect to receive this invitation, you can safely ignore this email.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
