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

class SignatoriesController extends Controller
{
    /**
     * @var JWTAuth
     */
    private $jwtAuth;

    public function __construct(JWTAuth $jwtAuth)
    {
        $this->jwtAuth = $jwtAuth;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $items = array();
        $signatories = Signatories::all();
        foreach ($signatories as $signatory) {
            $items[] = [
                'sigId' => $signatory->sigId,
                'sigName' => $signatory->sigName,
                'empName' => Employee::employees($signatory->employee_id),
                'deptName' => Employee::departments($signatory->deptId)
            ];

        }


        return response()->json([
            'signatories' => $items,
            'employees' => Employee::Employee_list(),
            'departments' => Employee::Departments_list(),

        ]);
    }

    public function ge_employee_info()
    {
        return response()->json([
            'employees' => Employee::Employee_list(),
            'departments' => Employee::Departments_list(),
        ]);
    }
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

        $sigId = Signatories::create([
            'employee_id' => $request->employees,
            'deptId' => $request->deptName,
            'sigDescription' => $request->description,
        ])->sigId;

        $aAccId = [7, 8, 9, 10];

        $role = 'signatory';

        $requestor = Requestor::where('employee_id', $request->employees);

        if ($requestor->count() > 0) {

            $reqId = $requestor->first()->reqId;

            Requestor::where('reqId', $reqId)->update(['reqUserRole' => $role]);

            Accessibility::deleteUserAccess($reqId);

            for ($i = 0; $i < count($aAccId); $i++) {
                Accessibility::createUserAccess($aAccId[$i], $reqId);
            }

        } else {
            $reqId = Requestor::create([
                'reqStatus' => 'active',
                'employee_id' => $request->employees,
                'reqUserType' => 'employee',
                'reqUserRole' => $role,
            ])->reqId;
            for ($i = 0; $i < count($aAccId); $i++) {
                Accessibility::createUserAccess($aAccId[$i], $reqId);
            }
        }


        return response()->json([
            'key' => true
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
        $items = [];
        $signatory = Signatories::find($id);

        return response()->json([
            'object' => $signatory,
            'signatory' => [
                'sigId' => $signatory->sigId,
                'deptId' => $signatory->deptId,
                'empId' => $signatory->employee_id,
                'signaName' => ucwords(Employee::employees($signatory->employee_id)),
                'deptName' => ucwords(Employee::departments($signatory->deptId)),
                'discription' => $signatory->sigDescription
            ]
        ]);
        // $items = array();

        // $signatories = Signatories::all();

        // foreach ($signatories as $signatory) {
        //     $items['signatoriesList'][] = [
        //         'sigId' => $signatory->sigId,
        //         'sigName' => $signatory->sigName,
        //         'empName' => Employee::employees($signatory->employee_id),
        //         'deptName' => Employee::departments($signatory->deptId)
        //     ];
        // }

        // $sigInfo = Signatories::find($id);

        // if (!is_null($sigInfo)) {

        //     $clearArray = array();
        //     $requirements = Requirements::where('sigId', $sigInfo->sigId);

        //     foreach ($requirements->groupBy('clearId')->get() as $requirement) {
        //         $clearArray[] = [
        //             'clearances' => [
        //                 'clearId' => Clearances::find($requirement->clearId)->clearId,
        //                 'clearName' => Clearances::find($requirement->clearId)->clearName,
        //             ],
        //             'requirements' => Requirements::getRequirements($requirement->clearId, $sigInfo->sigId)
        //         ];
        //     }


        //     $items['signatory'] = [
        //         'sigId' => $id,
        //         'clearName' => (!is_null($sigInfo->clearId)) ? strtoupper(Clearances::find($sigInfo->clearId)->clearName) : 'Not Assigned',
        //         'name' => strtoupper(Employee::departments($signatory->deptId)),
        //         'deptId' => $sigInfo->deptId,
        //         'empId' => $sigInfo->employee_id,
        //         'employee' => ucwords(Employee::employees($sigInfo->employee_id)),
        //         'department' => ucwords(Employee::departments($sigInfo->deptId)),
        //         'position' => ucwords($sigInfo->sigPosition),
        //         'description' => ucwords($sigInfo->sigDescription),
        //         'requirements' => (!empty($clearArray)) ? $clearArray : null,
        //     ];
        // }



        // return response()->json([
        //     'clearId' => $sigInfo->clearId,
        //     'items' => $items,
        //     'employees' => Employee::Employee_list(),
        //     'departments' => Employee::Departments_list(),
        // ]);
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
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $signatory = Signatories::find($id);

        $signatory->employee_id = $request->employees;
        $signatory->deptId = $request->deptName;
        $signatory->sigDescription = $request->description;
        $signatory->save();

        Requirements::where('sigId', '=', $id)->delete();

        if (!is_null($request->requirements[0]) and $request->requirements[0] !== '') {
            foreach ($request->requirements as $reqval) {
                if (!is_null($reqval) and $reqval !== "") {
                    Requirements::create([
                        'requireName' => $reqval,
                        'sigId' => $id,
                        'clearId' => $request->clearId
                    ]);
                }
            }
        }

        return response()->json([
            'key' => true,
        ]);
    }

    public function update_signatory(Request $request)
    {
        $sigId = $request->sigId;
        $deptId = $request->value[0]['value'];
        $empId = $request->value[1]['value'];
        $desc = $request->value[2]['value'];

        $signatory = Signatories::find($sigId);
        $signatory->employee_id = $empId;
        $signatory->deptId = $deptId;
        $signatory->sigDescription = $desc;
        $signatory->save();

        return response()->json([
            'key' => true,
        ]);

    }
    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $Signatory = Signatories::find($id);
        $Signatory->delete();

        return response()->json([
            'key' => true,
        ]);
    }
}
