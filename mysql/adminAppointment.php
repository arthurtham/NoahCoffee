<?php
$servername = "localhost:3306";
$username = "root";
$password = "raspberry";
$dbname = "database";

/// Admin auth part
$realm = 'Restricted area';

//user => password
$users = array('admin' => 'noah',);


if (empty($_SERVER['PHP_AUTH_DIGEST'])) {
    header('HTTP/1.1 401 Unauthorized');
    header('WWW-Authenticate: Digest realm="'.$realm.
           '",qop="auth",nonce="'.uniqid().'",opaque="'.md5($realm).'"');

    die('Text to send if user hits Cancel button');
}


// analyze the PHP_AUTH_DIGEST variable
if (!($data = http_digest_parse($_SERVER['PHP_AUTH_DIGEST'])) ||
    !isset($users[$data['username']])) {
    header('HTTP/1.1 401 Unauthorized');
    header('WWW-Authenticate: Digest realm="'.$realm.
           '",qop="auth",nonce="'.uniqid().'",opaque="'.md5($realm).'"');
    
    die('Wrong Credentials!');
}

// generate the valid response
$A1 = md5($data['username'] . ':' . $realm . ':' . $users[$data['username']]);
$A2 = md5($_SERVER['REQUEST_METHOD'].':'.$data['uri']);
$valid_response = md5($A1.':'.$data['nonce'].':'.$data['nc'].':'.$data['cnonce'].':'.$data['qop'].':'.$A2);

if ($data['response'] != $valid_response) {
    header('HTTP/1.1 401 Unauthorized');
    header('WWW-Authenticate: Digest realm="'.$realm.
           '",qop="auth",nonce="'.uniqid().'",opaque="'.md5($realm).'"');
    
    die('Wrong Credentials!');
    }

// ok, valid username & password
echo 'You are logged in as: ' . $data['username'];


// function to parse the http auth header
function http_digest_parse($txt)
{
    // protect against missing data
    $needed_parts = array('nonce'=>1, 'nc'=>1, 'cnonce'=>1, 'qop'=>1, 'username'=>1, 'uri'=>1, 'response'=>1);
    $data = array();
    $keys = implode('|', array_keys($needed_parts));

    preg_match_all('@(' . $keys . ')=(?:([\'"])([^\2]+?)\2|([^\s,]+))@', $txt, $matches, PREG_SET_ORDER);

    foreach ($matches as $m) {
        $data[$m[1]] = $m[3] ? $m[3] : $m[4];
        unset($needed_parts[$m[1]]);
    }

    return $needed_parts ? false : $data;
}



/// SQL part

// AddAvailability
if (isset($_POST['addAvailability'])) {
    echo "<br>addAvailability: ";
    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    // Check connection
    if ($conn->connect_error) {
        echo $conn->connect_error;
    };

    $sql = "INSERT INTO availability (datetime) VALUES ('".$_POST['datetime']."');";
    $result = $conn->query($sql);

    if ($result === TRUE) {
        echo "Success";
    } else {
        echo $conn->error;
    };

    $conn->close();
};

// DeleteAvailability
if (isset($_POST['deleteAvailability'])) {
    echo "<br>deleteAvailability: ";
    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    // Check connection
    if ($conn->connect_error) {
        echo $conn->connect_error;
    };

    $sql = "DELETE FROM availability WHERE id='".$_POST['deleteAvailability']."';";
    $result = $conn->query($sql);

    if ($result === TRUE) {
        echo "Success";
    } else {
        echo $conn->error;
    };

    $conn->close();
};

// DeleteAppointment
if (isset($_POST['deleteAppointment'])) {
    echo "<br>deleteAppointment: ";
    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    // Check connection
    if ($conn->connect_error) {
        echo $conn->connect_error;
    };

    $sql = "DELETE FROM appointments WHERE id='".$_POST['deleteAppointment']."';";
    $result = $conn->query($sql);

    if ($result === TRUE) {
        echo "Success, ";
    } else {
        echo $conn->error;
    };
    
    $sql = "UPDATE availability SET busy=0 WHERE id='".$_POST['id']."';";
    $result = $conn->query($sql);

    if ($result === TRUE) {
        echo "Success, ";
    } else {
        echo $conn->error;
    };

    $conn->close();
};


// ViewAvailability

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    echo $conn->connect_error;
};

$sql = "SELECT id, datetime, busy FROM availability ORDER BY datetime ASC;";
$result = $conn->query($sql);

$availability_table = "<table><tr><th>id</th><th>datetime</th><th>busy</th></tr>";
if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        $availability_table .= "<tr><td>" . $row["id"]. "</td><td>" . $row["datetime"]. "</td><td>" . ($row["busy"] ? "Appt Set" : "<form action/'adminAppointment.php' method='post'><input type='hidden' name='deleteAvailability' value='". $row["id"] ."'><input type='submit' value='Delete'></form>") . "</td></tr>";
    }
} else {
    $availability_table .= "<tr><td>0 results</td></tr>";
}
$availability_table .= "</table>";
$conn->close();

// ViewAppointments

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    echo $conn->connect_error;
};

$sql = "SELECT id, code, name, phone, datetime FROM appointments ORDER BY datetime ASC;";
$result = $conn->query($sql);

$appointment_table = "<table><tr><th>id</th><th>code</th><th>name</th><th>phone</th><th>datetime</th><th>action</th></tr>";
if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        $appointment_table .= "<tr><td>" . $row["id"]. "</td><td>" . $row["code"]. "</td><td>" . $row["name"]. "</td><td>" . $row["phone"]. "</td><td>" . $row["datetime"]. "</td><td>" . "<form action/'adminAppointment.php' method='post'><input type='hidden' name='deleteAppointment' value='". $row["id"] ."'><input type='hidden' name='id' value='". $row["id"] ."'><input type='submit' value='Delete'></form>" . "</td></tr>";
    }
} else {
    $appointment_table .= "<tr><td>0 results</td></tr>";
}
$appointment_table .= "</table>";
$conn->close();


/// Displayed part

echo <<<OUTPUT

<!DOCTYPE html>
<html>
<body>

<h2>Add availability</h2>

<form action="/adminAppointment.php" method="post">
  <input type="hidden" name="addAvailability" value="1">
  Date:<br>
  <input type="datetime-local" name="datetime">
  <br><br>
  <input type="submit" value="Add">
</form>

<h2>Manage availability</h2>
{$availability_table}
<h2>Manage appointments</h2>
{$appointment_table}
</body>
</html>


OUTPUT;

?>
