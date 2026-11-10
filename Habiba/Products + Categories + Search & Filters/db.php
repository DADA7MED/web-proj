<?php
$host = 'localhost';
$username = 'root';
$password = '';
$database = 'laptop_store_db'; // تأكدي أن هذا هو اسم قاعدة البيانات لديكِ

$conn = mysqli_connect($host, $username, $password, $database);

// التحقق من الاتصال
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// ضبط الترميز ليدعم اللغة العربية بشكل صحيح
mysqli_set_charset($conn, "utf8");
?>