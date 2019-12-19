<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Carbon\Carbon;
use DB;
use App\Models\Recipient;
use App\Models\Employee;

class Message extends Model
{

	protected $primaryKey = 'mesId';
	protected $table = 'messages';
	public $timestamps = false;
	protected $connection = 'clearance_db';

	protected $_reqId, $_messId;

	protected $fillable = [
		'mesId', 'mesDate', 'mesType', 'message', 'mesStatus', 'sender', 'mesDesc'
	];


	public function __construct($reqId = null, $messId = null)
	{
		$this->_messId = (!is_null($messId)) ? $messId : null;
		$this->_reqId = (!is_null($reqId)) ? $reqId : null;
		// dd(	$this->_reqId);
	}

	public function recipients()
	{
		return $this->hasmany('App\Models\Recipient', 'mesId');
	}

	public static function getUserMessages($msgId)
	{
		return DB::connection('clearance_db')
			->table('messages')
			->join('recipient', 'recipient.mesId', '=', 'messages.mesId')
			->orderBy('messages.mesStatus', 'desc')
			->where('recipient.receiver', $msgId);
	}

	public static function getMessageEmployeeId($msgId)
	{
		return DB::table('messages')
			->join('recipient', 'recipient.mesId', '=', 'messages.mesId')
			->where('messages.mesId', $msgId)
			->first();
		// $rec =  DB::select("
		// 						SELECT
		// 						recipient.recipient,
		// 						recipient.reqId
		// 						FROM
		// 						messages
		// 						INNER JOIN recipient ON recipient.mesId = messages.mesId
		// 						WHERE
		// 						messages.mesId = {$MessId}
		// 						GROUP BY
		// 						recipient.recipient
		// 				");
		// foreach($rec as $c){
		// 	return [
		// 		'empId' =>$c->recipient,
		// 		'reqId' =>$c->reqId
		// 	];
		// }
	}


	public static function getUserMessage($msgId, $reqId)
	{
		return DB::table('messages')
			->join('recipient', 'recipient.mesId', '=', 'messages.mesId')
			->where('messages.mesId', $msgId)
			->where('recipient.reqId', $reqId)
			->first();
	}



	public function getMessagesRecieve()
	{
		$messages = [];
		$recieves = DB::table('messages')
			->join('recipient', 'recipient.mesId', '=', 'messages.mesId')
			->where('recipient.reqId', $this->_reqId);

		$mCount = 0;

		foreach ($recieves->get() as $recieve) {
			if ($recieve->mesStatus === 'unread') {
				$mCount++;
			}
			$sender = null;
			$date = new Carbon($recieve->mesDate);

			$MesSenders = Message::find($recieve->mesId);

			if (!is_null($MesSenders)) {
				$requestor = Requestor::find($MesSenders->reqId);
				$sender = Employee::employees($requestor->employee_id);
			}

			$messages[] = [
				'mesId' => $recieve->mesId,
				'mesName' => $recieve->mesName,
				'mesDate' => $date->format('M/d/y - H:i'),
				'mesName' => $recieve->mesName,
				'mesType' => $recieve->mesType,
				'message' => substr($recieve->message, 0, 20) . ' ...',
				'mesStatus' => $recieve->mesStatus,
				'sender' => (!is_null($sender)) ? $sender : 'Unknown',
				'recType' => $recieve->recType,
				'recipient' => Employee::employees($recieve->recipient),
			];
		}

		return [
			'messages' => $messages,
			'messUnread' => $mCount,
			'messCount' => $recieves->count()
		];
	}

	public function getMessagesSent()
	{
		$messages = [];
		$senders = DB::table('messages')
			->join('recipient', 'recipient.mesId', '=', 'messages.mesId')
			->where('messages.reqId', $this->_reqId);


		$mCount = 0;

		foreach ($senders->get() as $sender) {
			if ($sender->mesStatus === 'unread') {
				$mCount++;
			}
			$senderEmp = null;
			$date = new Carbon($sender->mesDate);
			$MesSenders = Message::find($sender->mesId);

			if (!is_null($MesSenders)) {
				$requestor = Requestor::find($MesSenders->reqId);
				$senderEmp = Employee::employees($requestor->employee_id);
			}
			$messages[] = [
				'mesId' => $sender->mesId,
				'mesName' => $sender->mesName,
				'mesDate' => $date->format('M. d, y H:i'),
				'mesName' => $sender->mesName,
				'mesType' => $sender->mesType,
				'message' => substr($sender->message, 0, 20) . ' ...',
				'mesStatus' => $sender->mesStatus,
				'sender' => (!is_null($senderEmp)) ? $senderEmp : 'Unknown',
				'recType' => $sender->recType,
				'recipient' => Employee::employees($sender->recipient),
			];
		}
		return [
			'messages' => $messages,
			'messSentCount' => $senders->count()
		];
	}

	public static function countUnreadMsg($reqId)
	{
		$count = DB::select("
						SELECT
						Count(messages.mesId) as count
						FROM
						messages
						INNER JOIN recipient ON recipient.mesId = messages.mesId
						WHERE
						recipient.reqId = {$reqId} AND
						messages.mesStatus = 'unread'
					");
		foreach ($count as $c) {
			return $c->count;
		}
	}
	public static function countMsg($reqId)
	{
		return DB::table('messages')
			->where('reqId', $reqId)
			->count();
	}
	public static function countSentMsg($reqId)
	{
		return DB::table('recipient')
			->where('reqId', $reqId)
			->count();
	}
}
