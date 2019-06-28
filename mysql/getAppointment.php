<?php
$servername = "localhost:3306";
$username = "pi";
$password = "raspberry";
$dbname = "database";

// Part 0: Validate params
try {
    $_POST = json_decode(file_get_contents('php://input'), true);
}
catch (Exception $e){
    die(json_encode(array("status" => "failed" , "error_message" => "No values can be determined")));
}

if ((isset($_POST['code']))) {
    
} else {
    die(json_encode(array("status" => "failed" , "error_message" => "Combination of values not valid")));
};

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die(json_encode(array("status" => "failed" , "error_message" => "Connection error")));
}

$sql = "SELECT name,phone,datetime FROM `appointments` WHERE code='".$_POST['code']."' LIMIT 1;";
$result = $conn->query($sql);

$dbdata = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $dbdata[]=$row;
    }

    $dbdata = array(
        "status" => "success",
        "details" => $dbdata[0]
    );

    echo json_encode($dbdata);
    $conn->close();
    }
else {
    $dbdata = array(
        "status" => "success",
        "details" => array(
            "name" => "Reservation Not Found",
            "phone" => "",
            "datetime" => "",
        )
    );

    echo json_encode($dbdata);
    $conn->close();
};
?>
