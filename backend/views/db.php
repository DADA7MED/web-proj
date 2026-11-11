<?php
// db.php — Shared MySQLi Connection for XAMPP
$host = 'localhost';
$username = 'root';
$password = '';
$database = 'laptop_store_db';

$conn = @mysqli_connect($host, $username, $password, $database);

if ($conn) {
    mysqli_set_charset($conn, "utf8mb4");
} else {
    // Graceful error logging
    error_log("MySQLi connection failed: " . mysqli_connect_error());
}
?>
