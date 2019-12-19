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
use App\Models\SignaRequest;
use App\Models\Recipient;
use App\Models\Message;
use App\Models\RequestDetails;



use DB;
use Carbon\Carbon;
use App\User;

class RequestController extends Controller
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
        $items = [];
        $reqId = Requestor::getUserType($this->user->employee_id)->reqId;

        $requests = SignaRequest::where('reqId', $reqId);

        if ($requests->count() > 0) {
            foreach ($requests->get() as $request) {
                $items[] = [
                    'reqName' => Clearances::find($request->clearId)->clearName,
                    'requestId' => $request->requestId
                ];
            }
        }

        return response()->json($items);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $clrId = $request->cleartype;
        $reqId = Requestor::getUserType($this->user->employee_id)->reqId;
        $clearance = Clearances::find($clrId);

        $requestId = SignaRequest::create([
            'requestDate' => date('Y-m-d H:i:s'),
            'requestStatus' => 'pending',
            'reqId' => $reqId,
            'clearId' => $clrId,
        ])->requestId;

        $msgId = DB::connection('clearance_db')
            ->table('messages')
            ->insertGetId([
                'message' => 'Applyng for Clearances ' . strtoupper($clearance->clearName),
                'mesDate' => date('Y-m-d H:i:s'),
                'mesStatus' => 'unread',
                'mesType' => 2,
                'sender' => $this->user->employee_id,
                'mesDesc' => 'approval',
                'requestId' => $requestId
            ]);

        Recipient::create([
            'receiver' => 'BTN-2012-0175',
            'mesId' => $msgId,
        ]);

        return response()->json($requestId);
        // return $clearance;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $items = [];
        $sigArray = [];
        $request = SignaRequest::find($id);


        if ($request->requestStatus === 'pending') {
            $items['pending'] = [
                'clearance' => Clearances::find($request->clearId),
                'status' => $request->requestStatus,
                'request' => $request
            ];
        } else {

            $signatories = Signatories::getSignatories($request->clearId)->get();
            $clrStatus = SignaRequest::checkClearanceStatus($id, $request->clearId);

            $isStat = true;
            $clearStatArr = [];

            foreach ($signatories as $signatory) {
                $requirement = Requirements::where('clearSigId', $signatory->clearSigId);
                $signaStatus = SignaRequest::checkSignatoryStatus($id, $signatory->sigId);

                if ($signaStatus->count() > 0) {
                    $status = 'pending';
                    $clearedDate = null;

                    if ($isStat && $signaStatus->get()->first()->reqDetStatus === 'cleared') {
                        $status = $signaStatus->get()->first()->reqDetStatus;
                        $clearedDate = $signaStatus->get()->first()->reqDetDateCleared;
                    } else {
                        $isStat = false;
                    }



                    $clearStatArr = [
                        'status' => $status,
                        'clearedDate' => $clearedDate,
                    ];
                }

                $sigArray[] = [
                    'signaStat' => $clearStatArr,
                    'sigId' => $signatory->sigId,
                    'employeeId' => $signatory->employee_id,
                    'signaName' => ucwords(Employee::employees($signatory->employee_id)),
                    'deptName' => ucwords(Employee::departments($signatory->deptId)),
                    'requirements' => $requirement->count() > 1 ? $requirement->get() : null,
                ];
            }

            $items['approved'] = [
                'status' => $request->requestStatus,
                'clearanceStatus' => $clrStatus->count() > 0 ? $clrStatus->first() : null,
                'requestor' => Employee::employees(Requestor::find($request->reqId)->employee_id),
                'employee' => Employee::employment(Requestor::find($request->reqId)->employee_id),
                'request' => $request,
                'clearance' => Clearances::find($request->clearId),
                'signatories' => $sigArray,
                'hrEmployee' => Employee::employment('BTN-2011-0160'),
            ];
        }

        return response()->json($items);
    }

    public function approved_request(Request $request)
    {
        $requestId = $request->requstId;
        $senderEmpId = $request->senderEmpId;
        $userEmpId = $request->userEmpId;


        $requestDet = SignaRequest::find($requestId);

        if ($requestDet->requestStatus === 'pending') {
            $requestDet->requestStatus = 'approved';
            $requestDet->requestAppDate = date('Y-m-d H:i:s');
            $requestDet->requestAppBy = $userEmpId;
            $requestDet->save();
        }

        $signatories = Clearances::SignatoriesId($requestDet->clearId);


        foreach ($signatories as $signatory) {
            $mesages = new Message();
            $mesages->mesDate = date('Y-m-d H:i:s');
            $mesages->mesType = 0;
            $mesages->sender = $userEmpId;
            $mesages->message = 'Request you to clearance signing for Mr./Ms. ' . ucwords(Employee::employees($senderEmpId)) . ' Please be guided ';
            $mesages->mesStatus = 'unread';
            $mesages->mesDesc = 'signing';
            $mesages->save();

            Recipient::create([
                'receiver' => $signatory->employee_id,
                'mesId' => $mesages->mesId,
            ]);


            if ($signatory->employee_id === 'BTN-1997-0001' or $signatory->employee_id === 'BTN-1998-0004') {

                SignaRequest::insertRequestDetailse([
                    'requesId' => $requestId,
                    'sigId' => $signatory->sigId,
                    'reqDate' => date('Y-m-d H:i:s'),
                    'reqDetStatus' => 'cleared'
                ]);

            } else {
                SignaRequest::insertRequestDetailse([
                    'requesId' => $requestId,
                    'sigId' => $signatory->sigId,
                    'reqDate' => null,
                    'reqDetStatus' => 'pending'
                ]);
            }




        }

        return $signatories;
        // return $request->all();
    }

    public function requestors()
    {
        $items = [];
        $sigId = Signatories::where('employee_id', $this->user->employee_id)->first()->sigId;

        $requestId = SignaRequest::getRequestsById($sigId);

        foreach ($requestId as $rId) {
            $empId = Requestor::find($rId->reqId)->employee_id;
            $items[] = [
                'clearId' => $rId->clearId,
                'reqDetId' => $rId->reqDetId,
                'requestId' => $rId->requestId,
                'employee' => strtoupper(Employee::employees($empId)),
                'clearance' => ucwords(Clearances::find($rId->clearId)->clearName)
            ];
        }
        return response()->json($items);
    }

    public function getRequest($reqdetid, $requestId)
    {
        $clearance = $this->show($requestId);

        $requestDetails = RequestDetails::find($reqdetid);

        $requestStatus = $requestDetails->reqDetStatus;

        return compact('clearance', 'requestStatus');

    }

    public function clearedRequest(Request $request)
    {
        $reqDet = RequestDetails::find($request->reqdetId);

        $reqDet->reqDetStatus = 'cleared';
        $reqDet->reqDetDateCleared = date('Y-m-d H:i:s');
        $reqDet->save();

        $msgId = DB::connection('clearance_db')
            ->table('messages')
            ->insertGetId([
                'message' => 'Your request is cleared',
                'mesDate' => date('Y-m-d H:i:s'),
                'mesStatus' => 'unread',
                'mesType' => 3,
                'sender' => $this->user->employee_id,
                'mesDesc' => 'message'
            ]);
        DB::connection('clearance_db')
            ->table('recipient')
            ->insert([
                'receiver' => $request->empId,
                'mesId' => $msgId,
            ]);
        return response()->json(true);
    }

    public function holdRequest(Request $request)
    {
        $msgId = DB::connection('clearance_db')
            ->table('messages')
            ->insertGetId([
                'message' => $request->reason,
                'mesDate' => date('Y-m-d H:i:s'),
                'mesStatus' => 'unread',
                'mesType' => 3,
                'sender' => $this->user->employee_id,
                'mesDesc' => 'message'
            ]);
        DB::connection('clearance_db')
            ->table('recipient')
            ->insert([
                'receiver' => $request->empId,
                'mesId' => $msgId,
            ]);

        return response()->json(true);

    }
}
