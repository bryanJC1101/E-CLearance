<?php
namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
// use Tymon\JWTAuth\JWTAuth;

use App\User;

use DB;

class GetterController extends Controller
{
    // /**
    //  * @var JWTAuth
    //  */
    // private $jwtAuth;

    // public function __construct(JWTAuth $jwtAuth)
    // {
    //     $this->jwtAuth = $jwtAuth;
    // }

    function _hashPassword(Request $request)
    {
        $password = $request->password;
        $user = User::where('username', $request->pasword)->first();




        // if (is_null($user->user_pass_status)) {

        // }
    }
}
