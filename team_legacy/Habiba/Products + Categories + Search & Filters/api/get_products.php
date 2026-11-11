<?php
header('Content-Type: application/json; charset=utf-8');
include '../db.php';

$query = "SELECT * FROM products";
$result = mysqli_query($conn, $query);

$products = [];

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        // فك تشفير حقل الـ specs إذا كان مخزناً كـ JSON أو نص
        if (isset($row['specs']) && is_string($row['specs'])) {
            $row['specs'] = json_decode($row['specs'], true);
        }
        $products[] = $row;
    }
}

echo json_encode($products);
?>