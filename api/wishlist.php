<?php
// api/wishlist.php — Wishlist API Endpoint
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

require_once __DIR__ . "/../config/database.php";

$method = $_SERVER["REQUEST_METHOD"];
$userId = $_SESSION["user_id"] ?? 1; // Default guest session

if (!isset($_SESSION["wishlist"])) {
    $_SESSION["wishlist"] = [1];
}

if ($method === "GET") {
    echo json_encode([
        "success" => true,
        "items" => $_SESSION["wishlist"]
    ]);
    exit;
}

if ($method === "POST") {
    $raw = file_get_contents("php://input");
    $data = json_decode($raw, true) ?: $_POST;
    $productId = isset($data["product_id"]) ? (int)$data["product_id"] : 0;

    if ($productId <= 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid product ID"]);
        exit;
    }

    if (!in_array($productId, $_SESSION["wishlist"])) {
        $_SESSION["wishlist"][] = $productId;
        $status = "added";
    } else {
        $_SESSION["wishlist"] = array_values(array_diff($_SESSION["wishlist"], [$productId]));
        $status = "removed";
    }

    echo json_encode([
        "success" => true,
        "status" => $status,
        "product_id" => $productId,
        "count" => count($_SESSION["wishlist"])
    ]);
    exit;
}

if ($method === "DELETE") {
    $productId = isset($_GET["product_id"]) ? (int)$_GET["product_id"] : 0;
    if ($productId > 0) {
        $_SESSION["wishlist"] = array_values(array_diff($_SESSION["wishlist"], [$productId]));
    } else {
        $_SESSION["wishlist"] = [];
    }

    echo json_encode([
        "success" => true,
        "status" => "cleared",
        "count" => count($_SESSION["wishlist"])
    ]);
    exit;
}
?>
