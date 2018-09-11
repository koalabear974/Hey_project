<?php
$params = json_decode(file_get_contents('php://input'),true);
if(isset($params["user"])){
	require_once("../database/dbConnect.php");
	$user=json_decode($params['user']);
	$result= $db->query("SELECT * from `user` WHERE email='".$user->email."';")->fetchAll(PDO::FETCH_ASSOC);
	if(!empty($result)){
		$jsonUser=json_encode($result[0]);
		echo '{"error":"success", "user":'.$jsonUser.'}';

	}else{
		echo '{"error":"Cet email n\'est pas enregistré."}';
	}
	
}else{
	echo '{"error":"No data given."}';
}
?>