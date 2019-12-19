<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
 */

Route::post('auth/login', 'Api\AuthController@login');
Route::post('auth/refresh', 'Api\AuthController@refresh');
Route::get('auth/logout', 'Api\AuthController@logout');


Route::group(['middleware' => 'jwt.auth', 'namespace' => 'Api\\'], function () {
    Route::get('auth/me', 'AuthController@me');

    Route::get('user/access', 'AuthController@get_accessibility');
    Route::get('user/userType', 'AuthController@get_userType');


    Route::resource('clearance', 'ClearanceController');
    Route::resource('signatories', 'SignatoriesController');
    Route::resource('message', 'MessageController');


    Route::get('getsent', 'MessageController@get_sent');
    Route::post('updateClearance', 'ClearanceController@update_clearance');
    Route::post('updateSignatory', 'SignatoriesController@update_signatory');



    Route::resource('requirements', 'RequirementsController');
    Route::resource('request', 'RequestController');
    Route::resource('tracking', 'TrackingController');

    Route::get('getRequest/{reqdetid}/{requestId}', 'RequestController@getRequest');
    Route::post('approveRequest', 'RequestController@approved_request');
    Route::post('postHoldRequest', 'RequestController@holdRequest');
    Route::post('postCleared', 'RequestController@clearedRequest');
    Route::post('deleteMsg', 'MessageController@deleteMessage');



    Route::get('requestors', 'RequestController@requestors');
    

    // Route::get('auth/accessibilty', 'AuthController@accessbility');
    // Route::get('auth/information', 'AuthController@userInformation');
    
    // Route::resource('profile' , 'ProfileController');
    // Route::resource('stockin' , 'StockinController');
    // Route::resource('services' , 'ServicesController');
    // Route::resource('stockout' , 'StockoutController');
    // Route::resource('borrow' , 'BorrowController');
    // Route::resource('return' , 'ReturnController');
    // Route::resource('reports' , 'ReportsController');
    // Route::resource('users' , 'UsersController');

    // Route::get('checkStocks/{id}/{qty}' , 'StockoutController@checkStocks');
    // Route::get('pType' , 'ProfileController@productTypes');
    // Route::get('getBarcode/{id}', 'ProfileController@barcode');
    // Route::get('checkCode/{code}', 'ReturnController@checkTransCode');
    // Route::get('getStockoutHis/{start}/{end}', 'ReportsController@getStockout');
    
    // Route::post('postProfile', 'ProfileController@store_profile');
    // Route::post('editservice', 'ServicesController@edit_services');
    // Route::post('updateProfile', 'ProfileController@update_profile');
    // Route::post('updateStockout', 'StockoutController@update_stockout');
    
    
    // Route::get('programs' , 'PackageController@getProgram');


    // Route::get('feeType' , 'PackageController@getFeeType');
    // // Route::get('feeSchdule' , 'PackageController@getFeeType');stdInfo

    // Route::get('packagesCredentials' , 'PackageController@getPackagesCredentials');
    // Route::get('assessment/{acctNo}/{sem}/{sy}' , 'FeesController@stdAssessmentInfo');
    // Route::get('studentInfo/{acctNo}/{sem}/{sy}' , 'FeesController@stdInformation');
    
    // Route::get('subjects' , 'PackageController@getSubjectList');

    // Route::post('postPackages' , 'PackageController@savePackages');
    // Route::post('postBilled' , 'FeesController@billed');
    // Route::post('postListDiscount' , 'FeesController@listDiscount');
    // Route::post('postDiscount' , 'FeesController@postDiscount');

    

    

    // Route::resource('packages' , 'PackageController');
    // Route::resource('fees' , 'FeesController');
    // Route::resource('settings' , 'ParticularSettingsController');
    // Route::resource('users' , 'UsersController');
    
    
    
    // // Get Setting Controller
    // Route::get('terms' , 'ParticularSettingsController@getTerms');
    // Route::get('settingsGetPackages/{sem}/{sy}' , 'ParticularSettingsController@getPackages');

    // // Post Setting Controller
    

    // // Get Reports Controller

    // Route::get('getStudentAssessment/{sem}/{sy}' , 'ReportsController@studentAssessment');
    // Route::get('getStudentBalances', 'ReportsController@studentBalances');
    

    // // Get Home Controller
    // Route::get('summary/{sem}/{sy}' , 'HomeController@getSummary');
    
    // Route::post('postFeeSched' , 'PackageController@addFeeScheduleType');
    // Route::post('postFeeSched' , 'PackageController@addFeeScheduleType');



});

