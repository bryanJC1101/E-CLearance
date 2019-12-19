<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\JWTAuth;

// use App\Http\Controllers\Api\AssessmentController;

use App\Models\Student;
use App\Models\Fees;
use App\Models\Packages;
use App\Models\Program;
use App\Models\Subject;
use App\Models\Employee;

use App\User;

use DB;
use App;

class UsersController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    private $jwtAuth;



    public function __construct(JWTAuth $jwtAuth)
    {
        $this->jwtAuth = $jwtAuth;

    }

    public function index()
    {

        $users = User::all();

        foreach ($users as $key => $user) {
            if ($user->userRole !== 'admin') {
                $items[] = [
                    'account' => $user,
                    'access' => User::getUserAccessibility($user->userId)
                ];
            }

        }
        return response()->json([
            'users' => $items,
            'accessbilities' => User::accessibities(),
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
        $userId = User::create([
            'username' => $request->username,
            'fname' => $request->fname,
            'lname' => $request->lname,
            'mname' => $request->mname,
            'password' => bcrypt($request->password),
        ])->userId;

        $forms = $request->all();

        foreach ($forms as $fk => $form) {
            $kArr = explode('-', $fk);

            if (count($kArr) > 1) {
                if ($form !== false) {
                    DB::table('accessibility')->insert([
                        'userId' => $userId,
                        'accl_id' => $kArr[1],
                    ]);
                }
            }
        }

        $users = User::all();

        foreach ($users as $key => $user) {
            if ($user->userRole !== 'admin') {
                $items[] = [
                    'account' => $user,
                    'access' => User::getUserAccessibility($user->userId)
                ];
            }

        }
        return response()->json([
            'users' => $items,
            'accessbilities' => User::accessibities(),
        ]);

        // $this->index();
        // return response()->json(true);


    }

}
