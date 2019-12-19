<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use DB;



class Requirements extends Model
{
	protected $primaryKey = 'requireId';
	protected $table = 'requirements';
	public $timestamps = false;
	protected $connection = 'clearance_db';

	public $fillable = ['requireName', 'sigId', 'clearId'];


	public static function getRequirements($clearId, $sigId)
	{

		return DB::connection('clearance_db')
			->table('requirements')
			->where('sigId', $sigId)
			->where('clearId', $clearId);
	}

	public static function getRequirementsOnClearance($sigId)
	{
		return DB::connection('clearance_db')
			->table('clearances')
			->join('clearsig_prior_details', 'clearsig_prior_details.clearId', '=', 'clearances.clearId')
			->where('clearsig_prior_details.sigId', $sigId);
	}

}
