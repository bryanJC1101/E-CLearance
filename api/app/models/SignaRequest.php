<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use DB;



class SignaRequest extends Model
{

	protected $primaryKey = 'requestId';
	protected $table = 'requests';
	public $timestamps = false;

	protected $connection = 'clearance_db';

	protected $fillable = [
		'requestId', 'requestDate', 'requestStatus', 'reqId', 'clearId'
	];

	public static function getRequestSignatoryStatus($requestId, $sigId)
	{
		return DB::connection('clearance_db')
			->table('request_details')
			->where('requestId', $requestId)
			->where('sigId', $sigId)
			->first();
	}

	public static function insertRequestDetailse($creds = array())
	{
		return DB::connection('clearance_db')
			->table('request_details')
			->insert([
				'requestId' => $creds['requesId'],
				'reqDetStatus' => $creds['reqDetStatus'],
				'reqDetDateCleared' => $creds['reqDate'],
				'sigId' => $creds['sigId'],
			]);
	}

	public static function getClearanceStatus($reqId = null)
	{
		return DB::connection('clearance_db')
			->select("
				SELECT
				*
				FROM
				requests
				INNER JOIN request_details ON request_details.requestId = requests.requestId
				WHERE
				requests.reqId = {$reqId}
 			");
	}

	public static function getRequestors($sigId, $key = false)
	{
		$cond = 'request_details.sigId';
		if ($key) {
			$cond = 'signatories.employee_id';
		}
		return DB::connection('clearance_db')
			->table('requests')
			->join('request_details', 'request_details.requestId', '=', 'requests.requestId')
			->join('signatories', 'request_details.sigId', '=', 'signatories.sigId')
			->where($cond, $sigId)
			->where('request_details.reqDetStatus', 'pending')
			->get();
	}

	public static function getRequestorCredentials($sigId, $reqId)
	{
		return DB::connection('clearance_db')
			->table('request_details')
			->leftJoin('requests', 'request_details.requestId', '=', 'requests.requestId')
			->where('request_details.sigId', $sigId)
			->where('requests.requestId', $reqId)
			->get();
	}

	public static function getRequestInfo($reqId)
	{
		return DB::connection('clearance_db')
			->table('requests')->where('reqId', $reqId)->get();
	}
	public static function inserClearanceCleared($data = array())
	{
		return DB::connection('clearance_db')
			->table('clearance_requests_status')->insert([
				'reqStatus' => 'cleared',
				'reqStatDate' => date('Y-m-d H:i:s'),
				'requestId' => $data['requestId'],
				'clearId' => $data['clearId'],
			]);
	}
	public static function checkClearanceStatus($requestId, $clearId)
	{
		return DB::connection('clearance_db')
			->table('clearance_requests_status')
			->where('requestId', $requestId)
			->where('clearId', $clearId);
	}

	public static function checkSignatoryStatus($requestId, $sigId)
	{
		return DB::connection('clearance_db')
			->table('requests')
			->join('request_details', 'request_details.requestId', '=', 'requests.requestId')
			->join('signatories', 'request_details.sigId', '=', 'signatories.sigId')
			->where('request_details.sigId', $sigId)
			->where('request_details.requestId', $requestId);
	}
	public static function getClearanceRequstors($empId)
	{
		return DB::connection('clearance_db')
			->table('requestor')
			->join('requests', 'requests.reqId', '=', 'requestor.reqId')
			->join('request_details', 'request_details.requestId', '=', 'requests.requestId')
			->where('request_details.reqDetStatus', 'pending')
			->where('request_details.requestId', $empId);
	}
	public static function getRequestsById($sigId)
	{
		return DB::connection('clearance_db')
			->table('requests')
			->join('request_details', 'request_details.requestId', '=', 'requests.requestId')
			->where('request_details.sigId', $sigId)
			->where('request_details.reqDetStatus', 'pending')
			->get([
				'request_details.reqDetId',
				'request_details.requestId',
				'request_details.sigId',
				'requests.reqId',
				'requests.clearId'
			]);
	}
}
