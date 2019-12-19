<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use DB;


class Recipient extends Model
{

	protected $primaryKey = 'repId';
	protected $table = 'recipient';
	public $timestamps = false;
	protected $connection = 'clearance_db';

	protected $fillable = [
		'repId', 'receiver', 'mesId'
	];

}
