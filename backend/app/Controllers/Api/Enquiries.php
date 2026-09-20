<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;

class Enquiries extends ResourceController
{
    use ResponseTrait;

    protected $modelName = 'App\Models\EnquiryModel';
    protected $format    = 'json';

    public function create()
    {
        $rules = [
            'fullName'           => 'required|min_length[2]|max_length[150]',
            'phoneWhatsApp'      => 'required|min_length[6]|max_length[50]',
            'treatmentSpecialty' => 'required|min_length[2]|max_length[200]',
            'consent'            => 'required'
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $db = \Config\Database::connect();
        
        // Count existing enquiries to formulate sequence: PNC-2026-000001
        $count = $db->table('enquiries')->countAllResults();
        $referenceNo = 'PNC-2026-' . str_pad((string)($count + 1), 6, '0', STR_PAD_LEFT);

        $data = [
            'reference_no'          => $referenceNo,
            'full_name'             => trim($this->request->getVar('fullName')),
            'phone_whatsapp'        => trim($this->request->getVar('phoneWhatsApp')),
            'email'                 => $this->request->getVar('email') ? trim($this->request->getVar('email')) : null,
            'country_city'          => $this->request->getVar('countryCity'),
            'preferred_destination' => $this->request->getVar('preferredDestination'),
            'preferred_city'        => $this->request->getVar('preferredCity'),
            'treatment_specialty'   => trim($this->request->getVar('treatmentSpecialty')),
            'expected_travel_date'  => $this->request->getVar('expectedTravelDate'),
            'brief_requirement'     => $this->request->getVar('briefRequirement'),
            'selected_service_id'   => $this->request->getVar('selectedServiceId') ? (int)$this->request->getVar('selectedServiceId') : null,
            'consent'               => 1,
            'status'                => 'NEW'
        ];

        $enquiryId = $db->table('enquiries')->insert($data);

        // Record Initial History
        $db->table('enquiry_status_history')->insert([
            'enquiry_id'      => $enquiryId,
            'previous_status' => null,
            'new_status'      => 'NEW',
            'admin_user_id'   => null,
            'admin_user_name' => 'Web Portal Visitor',
            'note'            => 'Public medical tourism enquiry registered via online form.'
        ]);

        return $this->respondCreated([
            'success' => true,
            'message' => 'Your healthcare travel enquiry has been received successfully. A dedicated coordinator will reach out promptly.',
            'data'    => [
                'referenceNo' => $referenceNo,
                'status'      => 'NEW'
            ]
        ]);
    }
}
