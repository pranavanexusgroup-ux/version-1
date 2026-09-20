<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;

class Services extends ResourceController
{
    use ResponseTrait;

    public function index()
    {
        $db = \Config\Database::connect();
        $services = $db->table('services')
            ->where('published', 1)
            ->orderBy('sort_order', 'ASC')
            ->get()
            ->getResultArray();

        return $this->respond([
            'success' => true,
            'message' => 'Approved healthcare-travel coordination services retrieved',
            'data'    => $services
        ]);
    }

    public function show($slug = null)
    {
        $db = \Config\Database::connect();
        $service = $db->table('services')
            ->where('published', 1)
            ->groupStart()
                ->where('slug', $slug)
                ->orWhere('id', $slug)
            ->groupEnd()
            ->get()
            ->getRowArray();

        if (!$service) {
            return $this->failNotFound('Service not found or inactive');
        }

        return $this->respond([
            'success' => true,
            'message' => 'Service details retrieved',
            'data'    => $service
        ]);
    }
}
