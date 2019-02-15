<?php
	if(ISSET($_REQUEST)) {
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

		$name = mysqli_real_escape_string($conn, $_POST["name"]);
		$time = $_POST["time"];
		$correctTally = $_POST["correctTally"];
		$difficulty = $_POST["questions"];
		$percentage = $_POST["percentage"];
		$points = $_POST["points"];

		$stmt = $conn->prepare("INSERT INTO player_attempts (player_name, correct_tally, difficulty, percentage, time, points) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssssi", $name, $correctTally, $difficulty, $percentage, $time, $points);
          
		$stmt->execute();
            
        $stmt->close();

        echo "Score uploaded.";
	}
?>