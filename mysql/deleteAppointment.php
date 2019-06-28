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

// Part 1: Set a reservation code
//$code = "";
//$result = NULL;
//while(true) {
//    $code = substr(str_shuffle(bin2hex(random_bytes(6))),0,6);
//    // Create connection
//    $conn = new mysqli($servername, $username, $password, $dbname);
//    // Check connection
//    if ($conn->connect_error) {
//        die(json_encode(array("status" => "failed" , "error_message" => $conn->connect_error)));
//    };
//
//    $sql = "SELECT code FROM appointments WHERE code='".$code."' LIMIT 1";
//    $result = $conn->query($sql);
//
//    if ($result->num_rows == 1) {
//        //alert("Yes!");
//        $conn->close();
//        break;
//    } else {
//        die(json_encode(array("status" => "failed" , "error_message" => "There is no code")));
//    };
//};

// Part 2: Add info to the db
$code = $_POST['code'];

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die(json_encode(array("status" => "failed" , "error_message" => $conn->connect_error)));
};

$sql = "DELETE FROM `appointments` WHERE code='".$code."' AND datetime='".$_POST['datetime']."';";
$result = $conn->query($sql);

if ($result === TRUE) {
    
} else {
    die(json_encode(array("status" => "failed" , "error_message" => $conn->error)));
};

$conn->close();

// Part 3: Mark date as unavailable

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die(json_encode(array("status" => "failed" , "error_message" => $conn->connect_error)));
};

$sql = "UPDATE `availability` SET busy=false WHERE datetime='".$_POST['datetime']."';";
$result = $conn->query($sql);

if ($result === TRUE) {
    echo json_encode(array("status" => "success", "code" => $code ));
} else {
    echo json_encode(array("status" => "failed" , "error_message" => $conn->error));
};

$conn->close();


?>
