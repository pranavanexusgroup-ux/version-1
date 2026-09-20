<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class PranavaNexusSeeder extends Seeder
{
    public function run()
    {
        // 1. Roles
        $roles = [
            ['id' => 1, 'name' => 'Super Admin', 'slug' => 'super-admin', 'description' => 'Full platform access'],
            ['id' => 2, 'name' => 'Admin', 'slug' => 'admin', 'description' => 'Operational management'],
            ['id' => 3, 'name' => 'Content Manager', 'slug' => 'content-manager', 'description' => 'Locations, services, SEO & content'],
            ['id' => 4, 'name' => 'Enquiry Manager', 'slug' => 'enquiry-manager', 'description' => 'Patient travel coordination workflow']
        ];
        $this->db->table('roles')->ignore(true)->insertBatch($roles);

        // 2. Default Users (Pass: NexusAdmin@2026!)
        $passHash = hash('sha256', 'NexusAdmin@2026!_pnc_salt_2026');
        $users = [
            [
                'name'          => 'Pranava Nexus Administrator',
                'email'         => 'admin@pranavanexuscare.com',
                'password_hash' => $passHash,
                'role_id'       => 1,
                'status'        => 'ACTIVE'
            ]
        ];
        $this->db->table('users')->ignore(true)->insertBatch($users);

        // 3. Approved 9 Services
        $services = [
            [
                'id'                => 1,
                'name'              => 'Treatment Enquiry Coordination',
                'slug'              => 'treatment-enquiry-coordination',
                'short_description' => 'Share your treatment requirement and available reports. We organise initial medical details and coordinate with healthcare providers.',
                'full_description'  => 'Share your treatment requirement and available reports. We can help organise the initial information needed for the next step and coordinate enquiries with relevant healthcare providers, where appropriate.',
                'requirements'      => 'Recent medical reports, prescription history, diagnostic summary.',
                'icon'              => 'FileSearch',
                'featured'          => 1,
                'published'         => 1,
                'sort_order'        => 1
            ],
            [
                'id'                => 2,
                'name'              => 'Hospital / Doctor Appointment Coordination',
                'slug'              => 'hospital-doctor-appointment-coordination',
                'short_description' => 'Structured appointment requests and formal communication with accredited hospitals, medical centers, and specialists.',
                'full_description'  => 'We can assist with appointment requests and communication with hospitals, clinics or doctors, subject to their availability and acceptance of the enquiry.',
                'requirements'      => 'Preferred specialty, preferred timeline, relevant past medical history.',
                'icon'              => 'CalendarCheck2',
                'featured'          => 1,
                'published'         => 1,
                'sort_order'        => 2
            ],
            [
                'id'                => 3,
                'name'              => 'Medical Document Coordination',
                'slug'              => 'medical-document-coordination',
                'short_description' => 'Organising diagnostic records, scans, prescriptions, and health summaries for hospital review.',
                'full_description'  => 'We help organise the medical documents and information required for appointment or treatment enquiries. Patients should share only documents they are comfortable providing.',
                'requirements'      => 'Digital copies of reports (PDF/JPG), clear diagnostic scans.',
                'icon'              => 'FileCheck',
                'featured'          => 1,
                'published'         => 1,
                'sort_order'        => 3
            ],
            [
                'id'                => 4,
                'name'              => 'Treatment Journey Planning',
                'slug'              => 'treatment-journey-planning',
                'short_description' => 'Transparent sequence planning covering initial enquiry, consultation, hospital stay, local recovery, and return.',
                'full_description'  => 'We help patients understand the practical sequence of a planned medical journey, including enquiry, appointment, travel, stay and return arrangements.',
                'requirements'      => 'Travel timeline expectations, mobility requirements, accompanying attendant.',
                'icon'              => 'Compass',
                'featured'          => 1,
                'published'         => 1,
                'sort_order'        => 4
            ],
            [
                'id'                => 5,
                'name'              => 'Travel Assistance',
                'slug'              => 'travel-assistance',
                'short_description' => 'Coordination of non-clinical travel logistics including flights, trains, visa documentation support, and schedules.',
                'full_description'  => 'We can coordinate non-clinical travel requirements such as travel planning, local transfers or other agreed logistical arrangements.',
                'requirements'      => 'Valid passport (6 months minimum), visa invitation from medical provider.',
                'icon'              => 'Plane',
                'featured'          => 1,
                'published'         => 1,
                'sort_order'        => 5
            ],
            [
                'id'                => 6,
                'name'              => 'Accommodation Assistance',
                'slug'              => 'accommodation-assistance',
                'short_description' => 'Identifying convenient, hygienic lodging options and patient-friendly hotels near the healthcare facility.',
                'full_description'  => 'Where requested, we can assist with identifying or coordinating suitable accommodation options near the relevant healthcare facility.',
                'requirements'      => 'Estimated stay duration, dietary preferences, accessibility needs.',
                'icon'              => 'Hotel',
                'featured'          => 1,
                'published'         => 1,
                'sort_order'        => 6
            ],
            [
                'id'                => 7,
                'name'              => 'Local Transfer Coordination',
                'slug'              => 'local-transfer-coordination',
                'short_description' => 'Airport/station pickups, scheduled hospital transit, and reliable local transportation throughout the treatment stay.',
                'full_description'  => 'Ground transfer coordination between airport, railway terminal, hotel, and hospital appointments.',
                'requirements'      => 'Arrival flight/train information, luggage count, special mobility requirements.',
                'icon'              => 'Car',
                'featured'          => 1,
                'published'         => 1,
                'sort_order'        => 7
            ],
            [
                'id'                => 8,
                'name'              => 'Patient & Attendant Support',
                'slug'              => 'patient-attendant-support',
                'short_description' => 'Dedicated support for patients and accompanying family members covering local language, SIM cards, currency exchange guidance.',
                'full_description'  => 'We can help coordinate practical requirements for patients travelling with family members or attendants.',
                'requirements'      => 'Number of attendants, preferred language, emergency contact.',
                'icon'              => 'Users',
                'featured'          => 1,
                'published'         => 1,
                'sort_order'        => 8
            ],
            [
                'id'                => 9,
                'name'              => 'Follow-up Coordination',
                'slug'              => 'follow-up-coordination',
                'short_description' => 'Post-treatment communication, tele-consultation scheduling, and coordinating subsequent check-ups with treating specialists.',
                'full_description'  => 'Where requested and available, we can help coordinate follow-up appointments or communication with the relevant healthcare provider.',
                'requirements'      => 'Discharge summary, physician prescribed follow-up schedule.',
                'icon'              => 'HeartPulse',
                'featured'          => 1,
                'published'         => 1,
                'sort_order'        => 9
            ]
        ];
        $this->db->table('services')->ignore(true)->insertBatch($services);
    }
}
