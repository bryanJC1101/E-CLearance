<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use DB;

class RequestDetails extends Model
{
    protected $primaryKey = 'reqDetId';
    protected $table = 'request_details';
    public $timestamps = false;
    protected $connection = 'clearance_db';

}
