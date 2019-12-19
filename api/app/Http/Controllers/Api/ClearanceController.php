<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\JWTAuth;

use App\Models\Signatories;
use App\Models\Employee;
use App\Models\Requirements;
use App\Models\Requestor;
use App\Models\Clearances;

use DB;
use Carbon\Carbon;
use App\User;

class ClearanceController extends Controller
{
    /**
     * @var JWTAuth
     */
    private $jwtAuth;
    private $user;

    public function __construct(JWTAuth $jwtAuth)
    {
        $this->jwtAuth = $jwtAuth;
        $this->user = $this->jwtAuth->parseToken()->authenticate();

    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // $items = ['clearances' => Clearances::all()];
        $items = [];
        $signatories = Signatories::all();

        foreach ($signatories as $signatory) {
            $items[] = [
                'sigId' => $signatory->sigId,
                'sigName' => $signatory->sigName,
                'empName' => Employee::employees($signatory->employee_id),
                'deptName' => Employee::departments($signatory->deptId) !== null ? Employee::departments($signatory->deptId) : 'No Signatory'
            ];
        }
        return response()->json([
            'clearances' => Clearances::all(),
            'signatories' => $items,
            'password' => bcrypt('secret'),
            'truepAss' => $this->user->user_pass
        ]);


    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $clearId = DB::connection('clearance_db')
            ->table('clearances')
            ->insertGetId([
                'clearName' => $request->clearName,
                'clearDate' => date('Y-m-d H:i:s'),
                'clearStatus' => 'active',
                'clearType' => $request->clearType,
                'clearDescription' => $request->clearDesc,
            ]);
        $msgId = DB::connection('clearance_db')
            ->table('messages')
            ->insertGetId([
                'message' => 'Requesting for Clearances Requirements',
                'mesDate' => date('Y-m-d H:i:s'),
                'mesStatus' => 'unread',
                'mesType' => 1,
                'sender' => $this->user->employee_id,
                'mesDesc' => 'requirements'
            ]);
        $count = 1;
        for ($i = 0; $i < count($request->signatory); $i++) {
            DB::connection('clearance_db')
                ->table('ClearSig_prior_details')
                ->insert([
                    'clearId' => $clearId,
                    'sigId' => $request->signatory[$i],
                    'sigPriority' => $count++
                ]);

            DB::connection('clearance_db')
                ->table('recipient')
                ->insert([
                    'receiver' => Signatories::find($request->signatory[$i])->employee_id,
                    'mesId' => $msgId,
                ]);
        }

        return response()->json([
            'key' => true,
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {

        $items = array();
        $clearance = Clearances::find($id);
        $signatories = Signatories::getSignatories($id)->get();

        foreach ($signatories as $signatory) {
            $requirement = Requirements::where('clearSigId', $signatory->clearSigId);
            $items['signatories'][] = [
                'sigId' => $signatory->sigId,
                'signaName' => ucwords(Employee::employees($signatory->employee_id)),
                'deptName' => ucwords(Employee::departments($signatory->deptId)),
                'requirements' => $requirement->count() > 1 ? $requirement->get() : null,
            ];
        }

        $items = [
            'clearance' => $clearance,
            'signatories' => isset($items['signatories']) ? $items['signatories'] : [],
        ];

        return response()->json($items);

    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {

    }

    public function update_clearance(Request $request)
    {
        $clrId = $request->clrId;
        $items = $request->items;
        $clearance = Clearances::find($clrId);

        $clearance->clearName = $items['clrName'];
        $clearance->clearType = $items['clrType'];
        $clearance->clearDescription = $items['clrDesc'];
        $clearance->save();

        if (!empty($request->signatories)) {
            Clearances::clearsig_prior_details($clrId)->delete();
            $count = 1;
            for ($i = 0; $i < count($request->signatories); $i++) {
                $sigId = $request->signatories[$i]['value'];
                Clearances::insertSigPriority($clrId, $sigId, $count++);
            }
        }
        return response()->json([
            'key' => true,
        ]);
        
        // return $request->all();
        # code...
    }
    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {

        $clearance = Clearances::find($id);
        $clearance->delete();

        return response()->json([
            'key' => true,
        ]);
    }
}
