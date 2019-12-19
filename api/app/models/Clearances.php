<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use DB;
// use App\Models\Signatories;

class Clearances extends Model
{

	// public $fillable = ['title','description'];


	protected $primaryKey = 'clearId';
	protected $table = 'clearances';
	protected $connection = 'clearance_db';
	public $timestamps = false;

	protected $fillable = [
		'clearId', 'clearName', 'clearDate', 'clearStatus', 'clearDescription', 'clearType'
	];

	// public static function newClearances($array = array()){
	// 	return DB::connection('clearance_db')->inserr
	// }

	public static function SignatoriesId($clearId)
	{
		return DB::connection('clearance_db')->select(
			"SELECT
				 signatories.sigId,
				 signatories.sigDescription,
				 clearsig_prior_details.sigPriority,
				 signatories.employee_id,
				 signatories.deptId
				 FROM
				 clearsig_prior_details
				 INNER JOIN signatories ON clearsig_prior_details.sigId = signatories.sigId
				 WHERE
				 clearsig_prior_details.clearId = {$clearId}
				 ORDER BY
				 clearsig_prior_details.sigPriority ASC"
		);
	}

	public static function insertSigPriority($clrId, $sigId, $val)
	{
		return DB::connection('clearance_db')
			->table('clearsig_prior_details')
			->insert([
				'clearId' => $clrId,
				'sigId' => $sigId,
				'sigPriority' => $val,
			]);
	}

	public static function clearsig_prior_details($clrId)
	{
		return DB::connection('clearance_db')
			->table('clearsig_prior_details')
			->where('clearId', $clrId);
	}

	public static function getClearanceWithSignatory($empId)
	{
		return DB::connection('clearance_db')->select(
			"SELECT
				 signatories.employee_id,
				 clearances.clearName,
				 clearances.clearId,
				 signatories.sigId
				 FROM
				 clearances
				 INNER JOIN clearsig_prior_details ON clearsig_prior_details.clearId = clearances.clearId
				 INNER JOIN signatories ON clearsig_prior_details.sigId = signatories.sigId
				 WHERE
				 signatories.employee_id = '{$empId}'"
		);
	}

	public static function getClearanceInSignatoryId($empId, $clearId)
	{
		return DB::connection('clearance_db')->select(
			"SELECT
				 signatories.sigId
				 FROM
				 clearances
				 INNER JOIN clearsig_prior_details ON clearsig_prior_details.clearId = clearances.clearId
				 INNER JOIN signatories ON clearsig_prior_details.sigId = signatories.sigId
				 WHERE
				 signatories.employee_id = '{$empId}' AND
				 clearances.clearId = {$clearId}"
		);
	}

	public static function getRequestClearanceStatus($clearId, $sigId, $requestId)
	{
		$status = DB::connection('clearance_db')->select("
				SELECT
				*
				FROM
				request_clearance_status
				WHERE
				request_clearance_status.clearId = {$clearId} AND
				request_clearance_status.requestId = {$sigId} AND
				request_clearance_status.sigId = {$sigId}
			");
	}
	public static function getClearId($requestId)
	{
		$cles = DB::connection('clearance_db')->select("
							SELECT
							request_details.clearId
							FROM
							request_details
							WHERE
							request_details.requestId = {$requestId}
							GROUP BY
							request_details.requestId
					");
		foreach ($cles as $cle)
			return $cle->clearId;
	}
	public static function getRequestClearances($reqId)
	{
		return DB::connection('clearance_db')->select("
						SELECT clearances.clearName, requests.requestId
						FROM requests
						INNER JOIN clearances ON requests.clearId = clearances.clearId
						WHERE requests.reqId = {$reqId}
					");
	}
}
