<?php
// api/orders.php — Orders API Endpoint
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

require_once __DIR__ . "/../config/database.php";

$method = $_SERVER["REQUEST_METHOD"];

if ($method === "GET") {
    $orderId = $_GET["order_id"] ?? null;
    $orders = [
        [
            "id" => "EXP-8849",
            "customerName" => "Alexander Vance",
            "email" => "demo@apex.com",
            "createdAt" => (time() - 86400) * 1000,
            "total" => 3506.76,
            "paymentMethod" => "Credit Card",
            "status" => "Processing"
        ],
        [
            "id" => "EXP-8850",
            "customerName" => "Elena Rostova",
            "email" => "elena@techworks.io",
            "createdAt" => (time() - 172800) * 1000,
            "total" => 4199.00,
            "paymentMethod" => "Bank Transfer",
            "status" => "Shipped"
        ]
    ];

    if ($orderId) {
        foreach ($orders as $o) {
            if ($o["id"] === $orderId) {
                echo json_encode(["success" => true, "order" => $o]);
                exit;
            }
        }
    }

    echo json_encode(["success" => true, "orders" => $orders]);
    exit;
}

if ($method === "POST") {
    $raw = file_get_contents("php://input");
    $data = json_decode($raw, true) ?: $_POST;

    $newId = "EXP-" . rand(1000, 9999);
    $order = [
        "id" => $newId,
        "customerName" => $data["customerName"] ?? "Customer",
        "email" => $data["email"] ?? "",
        "createdAt" => time() * 1000,
        "total" => (float)($data["total"] ?? 0),
        "status" => "Processing",
        "paymentMethod" => $data["paymentMethod"] ?? "Credit Card"
    ];

    echo json_encode(["success" => true, "order" => $order]);
    exit;
}
?>
