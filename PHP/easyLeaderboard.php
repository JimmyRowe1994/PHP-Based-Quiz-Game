<?php

	// $servername = "localhost";
	// $username = "root";
	// $password = "";
	// $db = "quiz";

	$servername = "db754820425.db.1and1.com";
	$username = "dbo754820425";
	$password = "W4terP3arYell0w!";
	$db = "db754820425";

	$conn = new mysqli($servername, $username, $password, $db);
	if ($conn->connect_error) {
    	die("Connection failed: " . $conn->connect_error);
	}

	$sql = "SELECT * FROM player_attempts WHERE difficulty = \"easy\" ORDER BY points DESC LIMIT 3";
	$result = $conn->query($sql);
	if($result->num_rows > 0) {
		while($row = $result->fetch_assoc()) {
			$dataArray [] = $row;
		}
		echo json_encode($dataArray);
	}
?>