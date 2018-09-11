<?php
$params = json_decode(file_get_contents('php://input'),true);
if(isset($params["user"])){
	require_once("../database/dbConnect.php");
	$user=json_decode($params['user']);
	$city_id= $db->query("SELECT id_city from `city` WHERE name='".$user->city."';")->fetchAll();
	if(empty($city_id)){
		$db->query("INSERT INTO city(name) VALUES('".$user->city."');");
		$city_id=$db->lastInsertId(); 
	}else{
		$city_id=$city_id[0][0];
	}
	$result= $db->query("SELECT id_user from `user` WHERE email='".$user->email."';")->fetchAll();
	if(empty($result)){
		$result= $db->query("INSERT INTO `user`(`id_city`, `password`, `first_name`, `last_name`, `address`, `email`, `latitude`, `longitude`) 
			VALUES (".$city_id.",'".md5($user->password)."', '".$user->first_name."','".$user->last_name."','".$user->address."','".$user->email."','".$user->lat."','".$user->long."');");
		if($result){
			echo '{"error":"success"}';
		}else{
			echo '{"error":"An error occured, please try again."}';
		}
	}else{
		echo '{"error":"Cet email est déjà utilisé."}';
	}
	
}else{
	echo '{"error":"No data given."}';
}
?>