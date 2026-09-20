<?php

namespace Config;

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

// Default Route
$routes->get('/', 'Home::index');

// ---------------------- PUBLIC REST API ----------------------
$routes->group('api', ['namespace' => 'App\Controllers\Api'], static function ($routes) {
    $routes->get('health', 'HealthController::index');
    $routes->get('countries', 'Countries::index');
    $routes->get('countries/(:num)/cities', 'Countries::cities/$1');
    $routes->get('locations', 'Locations::index');
    $routes->get('locations/(:segment)', 'Locations::show/$1');
    $routes->get('locations/(:segment)/(:segment)', 'Locations::byCountryCity/$1/$2');
    $routes->get('locations/(:segment)/services', 'Locations::services/$1');
    $routes->get('services', 'Services::index');
    $routes->get('services/(:segment)', 'Services::show/$1');
    $routes->get('faqs', 'Faqs::index');
    $routes->get('blogs', 'Blogs::index');
    $routes->get('blogs/(:segment)', 'Blogs::show/$1');
    $routes->get('testimonials', 'Testimonials::index');
    $routes->get('gallery', 'Gallery::index');
    $routes->get('settings', 'Settings::index');
    $routes->get('google-reviews', 'Settings::googleReviews');
    $routes->post('enquiries', 'Enquiries::create');
});

// ---------------------- ADMIN REST API ----------------------
$routes->group('api/admin', ['namespace' => 'App\Controllers\Admin'], static function ($routes) {
    // Auth (unprotected login)
    $routes->post('login', 'AuthController::login');

    // Protected Admin Routes (Require AuthFilter)
    $routes->group('', ['filter' => 'adminAuth'], static function ($routes) {
        $routes->post('logout', 'AuthController::logout');
        $routes->get('me', 'AuthController::me');
        $routes->get('stats', 'DashboardController::stats');

        // Enquiries Workflow
        $routes->get('enquiries', 'EnquiriesController::index');
        $routes->get('enquiries/(:num)', 'EnquiriesController::show/$1');
        $routes->put('enquiries/(:num)/status', 'EnquiriesController::updateStatus/$1');
        $routes->put('enquiries/(:num)/assign', 'EnquiriesController::assign/$1');
        $routes->put('enquiries/(:num)/notes', 'EnquiriesController::updateNotes/$1');
        $routes->get('enquiries/(:num)/history', 'EnquiriesController::history/$1');

        // Location Engine CMS
        $routes->resource('countries', ['controller' => 'CountriesController']);
        $routes->resource('cities', ['controller' => 'CitiesController']);
        $routes->resource('locations', ['controller' => 'LocationsController']);
        $routes->get('locations/(:num)/services', 'LocationsController::getServices/$1');
        $routes->post('location-services', 'LocationsController::saveLocationService');

        // Services CMS
        $routes->resource('services', ['controller' => 'ServicesController']);

        // Content CMS
        $routes->resource('faqs', ['controller' => 'FaqsController']);
        $routes->resource('blogs', ['controller' => 'BlogsController']);
        $routes->resource('testimonials', ['controller' => 'TestimonialsController']);
        $routes->resource('gallery', ['controller' => 'GalleryController']);

        // Settings & Integrations
        $routes->get('settings', 'SettingsController::index');
        $routes->put('settings', 'SettingsController::update');
        $routes->put('google-reviews', 'SettingsController::updateGoogle');

        // Users & Roles
        $routes->get('users', 'UsersController::index');
        $routes->get('roles', 'UsersController::roles');
        $routes->get('activity-logs', 'DashboardController::activityLogs');
        $routes->get('notifications', 'DashboardController::notifications');
    });
});
