<?php
namespace App\Http\Controllers\Api;


use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\JWTAuth;

use App\Models\Program;
use App\Models\Packages;
use App\Models\Fees;
use App\Models\Student;
use App\Models\Message;
use App\Models\Employee;
use App\Models\SignaRequest;

use App\User;
use DB;

class MessageController extends Controller
{
    /**
     * @var JWTAuth
     */
    private $_userId = 1;
    private $jwtAuth;
    private $user;

    public function __construct(JWTAuth $jwtAuth)
    {
        $this->jwtAuth = $jwtAuth;

        if (!$user = $this->jwtAuth->parseToken()->authenticate()) {
            return response()->json(['error' => 'user_not_found'], 404);
        }

        $this->user = $user;
    }
    public function index()
    {
        $items = [];

        $empId = $this->user->employee_id;

        $messages = Message::getUserMessages($empId)->get();

        $unread = 0;

        foreach ($messages as $message) {

            $items[] = [
                'mesId' => $message->mesId,
                'from' => Employee::employees($message->sender),
                'message' => $message->message,
                'date' => $message->mesDate,
                'status' => $message->mesStatus
            ];

            if ($message->mesStatus === "unread") {
                $unread++;
            }
        }

        return response()->json([
            'unread' => $unread,
            'message' => $items,
            'empId' => $this->user->employee_id
        ]);

    }

    public function show($id)
    {
        $message = Message::find($id);
        if ($message->mesStatus === 'unread') {
            $message->mesStatus = 'read';
            $message->save();
        }

        $request = SignaRequest::find($message->requestId);

        return response()->json([
            'mesId' => $message->mesId,
            'mesType' => $message->mesType,
            'requestId' => $message->requestId,
            'mesStatus' => $request !== null ? $request->requestStatus : null,
            'empNo' => $message->sender,
            'from' => Employee::employees($message->sender),
            'message' => $message->message,
            'date' => $message->mesDate,
            'mesKey' => ($message->mesType) ? true : false,
        ]);

    }
    public function store(Request $request)
    {
        $msgId = DB::connection('clearance_db')
            ->table('messages')
            ->insertGetId([
                'message' => $request->message,
                'mesDate' => date('Y-m-d H:i:s'),
                'mesStatus' => 'unread',
                'mesType' => 3,
                'sender' => $this->user->employee_id,
                'mesDesc' => 'message'
            ]);
        DB::connection('clearance_db')
            ->table('recipient')
            ->insert([
                'receiver' => $request->employeeId,
                'mesId' => $msgId,
            ]);

    }

    public function get_sent()
    {
        $items = [];
        if (!$user = $this->jwtAuth->parseToken()->authenticate()) {
            return response()->json(['error' => 'user_not_found'], 404);
        }
        $empId = $user->employee_id;

        $messages = Message::where('sender', $empId)->get();

        foreach ($messages as $message) {
            foreach ($message->recipients as $recipient) {
                $items[] = [
                    'msgId' => $recipient->mesId,
                    'sentId' => $recipient->receiver,
                    'To' => Employee::employees($recipient->receiver),
                    'message' => $message->message,
                    'date' => $message->mesDate,
                ];
            }
        }

        return response()->json($items);
    }
    public function deleteMessage(Request $request)
    {
        $forms = $request->forms;

        foreach ($forms as $form) {
            $message = Message::find($form['value']);
            $message->delete();
        }

        return response()->json(true);
    }

    public function destroy($id)
    {
        $message = Message::find($id);;
        $message->delete();
        return response()->json(true);
    }
}
