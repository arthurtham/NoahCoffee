<?php
$servername = "localhost:3306";
$username = "pi";
$password = "raspberry";
$dbname = "database";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT id, datetime FROM `availability` WHERE busy=0;";
$result = $conn->query($sql);

$dbdata = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $dbdata[]=$row;
    }

    echo json_encode($dbdata);
    $conn->close();
    }
else {
    $dbdata = array(
        "id" => "0",
        "datetime" => "00/00/00 00:00"
        );
    );

    echo json_encode($dbdata);
    $conn->close();
};
?>
 
