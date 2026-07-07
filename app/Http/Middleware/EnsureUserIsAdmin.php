<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user() || ! $request->user()->isAdmin()) {
            // Redirect customer back to home with an error message
            return redirect('/')->with('flash', [
                'type' => 'error',
                'message' => 'Anda tidak memiliki akses ke area Admin.',
            ]);
        }

        return $next($request);
    }
}
