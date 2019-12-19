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

use Carbon\Carbon;
use App\User;
use DB;

class TrackingController extends Controller
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
        $requests = SignaRequest::join(
            'clearances',
            'requests.clearId',
            '=',
            'clearances.clearId'
        )
            ->join('requestor', 'requests.reqId', '=', 'requestor.reqId')
            ->select(
                'clearances.clearName',
                'requests.requestId',
                'requestor.employee_id'
            )
            ->get();

        foreach ($requests as $request) {
            $items[] = [
                'clrName' => $request->clearName,
                'requestId' => $request->requestId,
                'employee' => Employee::employees($request->employee_id),
            ];
        }
        return response()->json($items);
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

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $reqCtrl = new RequestController($this->jwtAuth);
        $clearance = $reqCtrl->show($id);

        return $clearance;
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
    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {


    }
}
