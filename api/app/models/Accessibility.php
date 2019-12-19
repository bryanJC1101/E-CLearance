<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use DB;

// use App\Model\Requestor;

class Accessibility extends Model
{

	protected $primaryKey = 'accId';
	protected $table = 'accessibility';
	protected $connection = 'clearance_db';


	public function Access()
	{
		return $this->belongsToMany('App\Models\Requestor', 'user_access', 'reqId', 'accId');
	}

	public static function getUserAccess($empId)
	{
		return DB::connection('clearance_db')
			->select("
				SELECT
				CONCAT('/',accessibility.accType,'/', accessibility.accName) AS routeUrl,
				accessibility.accName,
				accessibility.accId,
				accessibility.accType
				FROM
				requestor
				INNER JOIN user_access ON user_access.reqId = requestor.reqId
				INNER JOIN accessibility ON user_access.accId = accessibility.accId
				WHERE
				requestor.employee_id = '{$empId}'
    		");
	}
	public static function createUserAccess($accId, $reqId)
	{
		DB::connection('clearance_db')->table('user_access')->insert([
			'reqId' => $reqId,
			'accId' => $accId
		]);
	}
	public static function deleteUserAccess($reqId)
	{
		return DB::connection('clearance_db')->table('user_access')->where('reqId', $reqId)->delete();
	}



}
