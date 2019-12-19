<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use DB;


use App\Models\Requirements;

class Signatories extends Model
{

    // public $fillable = ['title','description'];

    protected $primaryKey = 'sigId';
    protected $table = 'signatories';
    public $timestamps = false;
    protected $connection = 'clearance_db';

    protected $fillable = [
        'employee_id', 'sigDescription', 'deptId'
    ];

    public static function getSignatories($clearId)
    {
        return DB::connection('clearance_db')
            ->table('signatories')
            ->join('clearsig_prior_details', 'clearsig_prior_details.sigId', '=', 'signatories.sigId')
            ->where('clearsig_prior_details.clearId', $clearId)
            ->orderBy('clearsig_prior_details.sigPriority', 'ASC');
    }

    // public function requirements()
    // {
    //     return $this->hasMany('App\Models\Requirements', 'sigId');
    // }

    public static function getSignotryRequest($empId)
    {
        return DB::table('signatories')
            ->join('request_details', 'request_details.sigId', '=', 'signatories.sigId')
            ->where('signatories.employee_id', $empId)
            ->groupBy('signatories.employee_id')
            ->get();



    }


}
