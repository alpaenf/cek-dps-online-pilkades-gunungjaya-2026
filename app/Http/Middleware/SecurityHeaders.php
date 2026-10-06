<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request and attach maximum security headers.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Clickjacking protection: only allow same origin framing
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');

        // Prevent browser from MIME-sniffing the response
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // Cross-Site Scripting (XSS) filter protection
        $response->headers->set('X-XSS-Protection', '1; mode=block');

        // Referrer Information Protection
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Permissions Policy (restrict sensitive hardware access)
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');

        // Enforce HTTPS HSTS when connection is secure
        if ($request->isSecure()) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }

        return $response;
    }
}
