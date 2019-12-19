<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\JWTAuth;

 
use App\User;
use App\Models\Profile;
use App\Models\Barcode;

class ProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    private $jwtAuth;

  

    public function __construct(JWTAuth $jwtAuth)
    {
        $this->jwtAuth = $jwtAuth;

    }
    public function productTypes()
    {
        return response()->json([
            'itemType' => Profile::getItemType(),
            'specType' => Profile::getSpecType(),
            'packType' => Profile::getPackagingType(),
        ]);
    }
    public function index()
    {
        $products = Profile::getProductProfile();

        return response()->json([
            'products' => $products,
            // 'itemType' => Profile::getItemType(),
            // 'specType' => Profile::getSpecType(),
            // 'packType' => Profile::getPackagingType(),
        ]);
        
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        
       
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $key = false;
        if ($request->name === 'pType') {
            Profile::insertItemType('item_type', 'item_type', $request->value);
            $key = true;
        }
        if ($request->name === 'packType') {
            Profile::insertItemType('packaging_type', 'pack_type', $request->value);
            $key = true;
        }
        if ($request->name === 'specType') {
            Profile::insertItemType('item_spec', 'specification', $request->value);
            $key = true;
        }
        return response()->json($key);
    }


    public function store_profile(Request $request)
    {
        Profile::create([
            'name' => $request->prodName,
            'subname' => $request->subName,
            'it_id' => $request->iType,
            'pt_id' => $request->pType,
            'is_id' => $request->sType,
            'size' => $request->size,
            'weight' => $request->weight,
            'description' => $request->description,
            'date_inserted' => date('Y-m-d'),
            'time_inserted' =>  date('H:i:s'),
        ]);



        $products = Profile::getProductProfile();

        return response()->json([
            'products' => $products
        ]);
    } 

    public function update_profile(Request $request)
    {
        $ipId = $request->ipId;
        Profile::find($ipId)->update([
            'name' =>  $request->EpName,
            'subname' =>  $request->EpSubName,
            'size' =>  $request->EpSize,
            'weight' =>  $request->ePweight,
            'description' =>  $request->EpDesc,
        ]);
        
    }

    public function barcode($id)
    {
        $barcode = Barcode::where('ip_id', $id);
        $bCode = ( $barcode->count() > 0) ?   $barcode->first() : $barcode->count()  ;
        return response()->json($bCode);
    }
    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $profile = Profile::find($id);
        $profile->delete();
        return response()->json([
            'products' => Profile::getProductProfile()
        ]);
    }
}
