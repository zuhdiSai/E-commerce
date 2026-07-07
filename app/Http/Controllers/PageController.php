<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    /**
     * Display the About page.
     */
    public function about(): Response
    {
        return Inertia::render('about', [
            'storeInfo' => config('store'),
        ]);
    }

    /**
     * Display the Privacy Policy page.
     */
    public function privacyPolicy(): Response
    {
        return Inertia::render('policies/privacy', [
            'storeInfo' => config('store'),
        ]);
    }

    /**
     * Display the Terms and Conditions page.
     */
    public function termsConditions(): Response
    {
        return Inertia::render('policies/terms', [
            'storeInfo' => config('store'),
        ]);
    }

    /**
     * Display the Return Policy page.
     */
    public function returnPolicy(): Response
    {
        return Inertia::render('policies/returns', [
            'storeInfo' => config('store'),
        ]);
    }
}
