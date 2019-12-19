<?php
namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\JWTAuth;

use App\User;
use App\Models\Requestor;
use App\Models\Employee;
use App\Models\Accessibility;

use Session;


class AuthController extends Controller
{
    /**
     * @var JWTAuth
     */
    private $jwtAuth;

    public function __construct(JWTAuth $jwtAuth)
    {
        $this->jwtAuth = $jwtAuth;
    }

    public function login(Request $request)
    {
        $credentials = $request->only('username', 'password');

        if (!$token = $this->jwtAuth->attempt($credentials)) {
            return response()->json(['error' => 'invalid_credentials'], 401);
        }

        $user = $this->jwtAuth->authenticate($token);

        $requestor = [];
        $reqCred = Requestor::where('employee_id', $user->employee_id);

        if ($reqCred->count() > 0) {
            $requestor = $reqCred->first();
        } else {
            $accId = [12, 13];
            $reqId = Requestor::create([
                'reqStatus' => 'active',
                'employee_id' => $user->employee_id,
                'reqUserType' => $user->user_privilege,
                'reqUserRole' => 'requestor',
            ])->reqId;

            for ($i = 0; $i < count($accId); $i++) {
                Accessibility::createUserAccess($accId[$i], $reqId);
            }
            $requestor = Requestor::find($reqId);
        }

        return response()->json(compact('token', 'user', 'requestor'));
    }

    public function refresh()
    {
        $token = $this->jwtAuth->getToken();
        $token = $this->jwtAuth->refresh($token);

        return response()->json(compact('token'));
    }

    public function logout()
    {
        $token = $this->jwtAuth->getToken();

        $this->jwtAuth->invalidate($token);

        return response()->json(['logout']);
    }

    public function me()
    {
        if (!$user = $this->jwtAuth->parseToken()->authenticate()) {
            return response()->json(['error' => 'user_not_found'], 404);
        }
        return response()->json(compact(' user '));
    }
    public function get_accessibility()
    {
        if (!$user = $this->jwtAuth->parseToken()->authenticate()) {
            return response()->json(['error' => 'user_not_found'], 404);
        }

        $accessibilty = Accessibility::getUserAccess($user->employee_id);

        return response()->json([
            'userInfo' => Employee::find($user->employee_id),
            'accessiblity' => $accessibilty
        ]);
    }

    public function userInformation()
    {
        if (!$user = $this->jwtAuth->parseToken()->authenticate()) {
            return response()->json([' error ' => ' user_not_found '], 404);
        }
        $information = User::getPersonelInfo($user->per_id);

        return response()->json([
            'items' => $information
        ]);
    }


}
