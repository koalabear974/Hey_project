<?php
$params = json_decode(file_get_contents('php://input'),true);
if(isset($params["user"])){
	require_once("../database/dbConnect.php");
	$user=json_decode($params['user']);
	$result= $db->query("SELECT password from `user` WHERE email='".$user->email."';")->fetchAll();
	if(!empty($result)){
		if($result[0][0]==md5($user->password)){
			 $db->query("UPDATE `user` SET last_login=now();");
			echo '{"error":"success"}';
		}else{
			echo '{"error":"L\'email ou le mot de passe est incorect."}';
		}
	}else{
		echo '{"error":"Cet email n\'est pas enregistré."}';
	}
	
}else{
	echo '{"error":"No data given."}';
}
?>