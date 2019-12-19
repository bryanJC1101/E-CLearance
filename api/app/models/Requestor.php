<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use DB;


class Requestor extends Model
{
	protected $primaryKey = 'reqId';
	protected $table = 'requestor';
	public $timestamps = false;
	protected $connection = 'clearance_db';


	public $_keys = false;

	protected $fillable = [
		'reqStatus', 'employee_id', 'reqUserType', 'reqUserRole'
	];


	public static function getUserType($empId)
	{
		return DB::connection('clearance_db')
			->table('requestor')
			->where('employee_id', $empId)
			->first();
	}
	public static function check_requestor($empId)
	{
		$count = DB::connection('clearance_db')
			->table('requestor')
			->where('employee_id', $empId)
			->count();

		if ($count < 1) {
			return true;
		}
		return false;
	}

	public function create_requestor($empCred = array())
	{
		$this->create([
			'reqStatus' => 'active',
			'employee_id' => $empCred['empId'],
			'reqUserType' => $empCred['empType'],
			'reqUserRole' => $empCred['empPrev'],
		]);
	}

	public static function create_logs($empId)
	{
		$requestor = DB::table('requestor')->where('employee_id', $empId)->first();

		$logId = DB::table('logs')->insertGetId([
			'loginDate' => date('Y-m-d H:m:s'),
			'logStatus' => 'online',
			'reqId' => $requestor->reqId,
		]);
		Session::put('logId', $logId);
	}
}
