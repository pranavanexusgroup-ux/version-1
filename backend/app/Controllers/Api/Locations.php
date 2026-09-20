<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;

class Locations extends ResourceController
{
    use ResponseTrait;

    public function index()
    {
        $db = \Config\Database::connect();
        $builder = $db->table('locations l')
            ->select('l.*, c.name as country_name, c.slug as country_slug, c.flag as country_flag, ci.name as city_name, ci.slug as city_slug')
            ->join('countries c', 'l.country_id = c.id')
            ->join('cities ci', 'l.city_id = ci.id')
            ->where('l.published', 1);

        $locations = $builder->get()->getResultArray();

        return $this->respond([
            'success' => true,
            'message' => 'Active destinations retrieved successfully',
            'data'    => $locations
        ]);
    }

    public function show($id = null)
    {
        $db = \Config\Database::connect();
        $builder = $db->table('locations l')
            ->select('l.*, c.name as country_name, c.slug as country_slug, c.flag as country_flag, ci.name as city_name, ci.slug as city_slug')
            ->join('countries c', 'l.country_id = c.id')
            ->join('cities ci', 'l.city_id = ci.id')
            ->where('l.published', 1)
            ->groupStart()
                ->where('l.id', $id)
                ->orWhere('l.slug', $id)
            ->groupEnd();

        $location = $builder->get()->getRowArray();

        if (!$location) {
            return $this->failNotFound('This destination is not currently listed as an active service location.');
        }

        return $this->respond([
            'success' => true,
            'message' => 'Destination details retrieved',
            'data'    => $location
        ]);
    }

    public function services($id = null)
    {
        $db = \Config\Database::connect();
        $builder = $db->table('location_services ls')
            ->select('s.id, s.name, s.slug, s.icon, s.featured, COALESCE(ls.description_override, s.short_description) as short_description, s.full_description, COALESCE(ls.requirements_override, s.requirements) as requirements, ls.availability_status')
            ->join('services s', 'ls.service_id = s.id')
            ->where('ls.published', 1)
            ->where('s.published', 1)
            ->where('ls.location_id', $id)
            ->orderBy('s.sort_order', 'ASC');

        $services = $builder->get()->getResultArray();

        return $this->respond([
            'success' => true,
            'message' => 'Available services for destination retrieved',
            'data'    => $services
        ]);
    }
}
