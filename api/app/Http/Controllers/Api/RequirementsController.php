<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\JWTAuth;

use App\Models\Signatories;
use App\Models\Employee;
use App\Models\Requirements;
use App\Models\Clearances;
use App\Models\Requestor;
use App\Models\Accessibility;

use DB;
use Carbon\Carbon;

class RequirementsController extends Controller
{
    /**
     * @var JWTAuth
     */
    private $jwtAuth;
    private $user;
    private $sigId;
    public function __construct(JWTAuth $jwtAuth)
    {
        $this->jwtAuth = $jwtAuth;
        if (!$this->user = $this->jwtAuth->parseToken()->authenticate()) {
            return response()->json(['error' => 'user_not_found'], 404);
        }
    }
    public function index()
    {
        $sigId = null;
        $items = [];

        $signatory = Signatories::where('employee_id', $this->user->employee_id);

        if ($signatory->count()) {
            $sigId = $signatory->first()->sigId;
            $items = Requirements::getRequirementsOnClearance($sigId)->get();
        }
        return response()->json($items);
    }
    public function store(Request $request)
    {
        $clrId = $request->clrId;
        $forms = $request->value;
        $signatory = Signatories::where('employee_id', $this->user->employee_id);

        if ($signatory->count()) {
            $sigId = $signatory->first()->sigId;
            $clearSigId = DB::connection('clearance_db')
                ->table('clearsig_prior_details')
                ->where('sigId', $sigId)
                ->where('clearId', $clrId)
                ->first()->clearSigId;

            foreach ($forms as $form) {
                DB::connection('clearance_db')
                    ->table('requirements')
                    ->insert([
                        'clearSigId' => $clearSigId,
                        'requireName' => $form['value'],
                    ]);
            }
        }

        return response()->json([
            'key' => true
        ]);
    }
}
