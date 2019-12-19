<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use DB;
// use App\Model\Requestor;

class Employee extends Model
{

	protected $primaryKey = 'employee_id';
	protected $table = 'employees';

	public static function userCredentials($btnNo)
	{
    	
    	// return $requestor;
	}

	public static function employees($btnNo = null)
	{
		$employees = DB::select("
		    			SELECT
		    			employees.employee_fname,
		    			employees.employee_mname,
		    			employees.employee_lname
		    			FROM
		    			employees
		    			WHERE
		    			employees.employee_id= '{$btnNo}'
					  ");
		foreach ($employees as $employee) {
			$empMName = (!is_null($employee->employee_mname)) ? $employee->employee_mname[0] . '. ' : null;
			return $employee->employee_lname . ', ' . $empMName . ' ' . $employee->employee_fname;
		}

	}

	public static function departments($deptId = null)
	{
		$departments = DB::select("
			    			SELECT
			    			departments.department_name
			    			FROM
			    			departments
			    			WHERE
			    			departments.department_id = '{$deptId}'
						");
		foreach ($departments as $department)
			return $department->department_name;
	}

	public static function Departments_list()
	{
		return DB::select("
			    			SELECT
			    			departments.department_id,
			    			departments.department_name
			    			FROM
			    			departments
			    			ORDER BY
			    			departments.department_name ASC
						");
	}

	public static function Employee_list()
	{
		return DB::select("
			    			SELECT
			    			employees.employee_fname,
			    			employees.employee_mname,
			    			employees.employee_lname,
			    			employees.employee_id
			    			FROM
			    			employees
			    			ORDER BY
			    			employees.employee_lname ASC
						");
	}

	public static function employment($empId)
	{
		$items = array();


		$employees = DB::table('employees')
			->join('employment', 'employment.employee_id', '=', 'employees.employee_id')
			->join('departments', 'employment.department_id', '=', 'departments.department_id')
			->where('employees.employee_id', $empId)
			->get([
				'departments.department_name',
				'employment.employment_hired_date',
				'employees.employee_fname',
				'employees.employee_mname',
				'employees.employee_id',
				'employees.employee_lname',
				'employees.employee_mobile',
				'employees.employee_permanent_address',
				'employment.employment_job_title'
			]);
		foreach ($employees as $employee) {
			$middle = (!is_null($employee->employee_fname)) ? $employee->employee_fname[0] . '. ' : null;

			$fullname = $employee->employee_fname . ' ' . $middle . ' ' . $employee->employee_lname;

			$items = [
				'empId' => $employee->employee_id,
				'fullname' => $fullname,
				'department' => $employee->department_name,
				'dateHired' => $employee->employment_hired_date,
				'phone' => $employee->employee_mobile,
				'address' => $employee->employee_permanent_address,
				'position' => $employee->employment_job_title,
				'images' => 'public/images/no_images/no_image.png',
			];
		}
		return $items;
	}

	public static function getEmployeeInfo($employee_id)
	{
		$employee = Employee::where('employee_id', $employee_id)->first();
		$middle = (!is_null($employee->employee_fname)) ? $employee->employee_fname[0] . '. ' : null;
		$fullname = $employee->employee_fname . ' ' . $middle . ' ' . $employee->employee_lname;

		return [
			'empId' => $employee->employee_id,
			'fullname' => $fullname,
			'dateHired' => $employee->employment_hired_date,
			'phone' => $employee->employee_mobile,
			'address' => $employee->employee_permanent_address,
		];
		// return Employee::where('employee_id' , $employee_id)->first();
	}

}
