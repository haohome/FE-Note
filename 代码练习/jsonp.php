<?php 
header("Content-type:application/javascript;charset:utf-8");
$getData=$_GET['callback'];
$hello=json_encode([1,2,3,4]);
echo $getData."('$hello')";
?>