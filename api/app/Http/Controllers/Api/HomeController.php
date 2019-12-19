<?php
namespace App\Http\Controllers\Api;


use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\JWTAuth;

use App\Models\Program;
use App\Models\Packages;
use App\Models\Fees;
use App\Models\Student;

use App\User;

use DB;

class HomeController extends Controller
{
    /**
    * @var JWTAuth
    */
    private $_userId = 1;
    private $jwtAuth;

    public function __construct(JWTAuth $jwtAuth)
    {
        $this->jwtAuth = $jwtAuth;
    }

    public function getSummary($sem ,$sy)
    {
       
    }
  

}
