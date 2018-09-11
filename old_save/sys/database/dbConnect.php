<?php
try{
	$db = new PDO('mysql:host=localhost;dbname=hey_database','root','') ;
}
catch(Exception $e){
	die('Erreur dans l\'ouverture de la BDD :'.$e->getMessage()) ;
}
?>
