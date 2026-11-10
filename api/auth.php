<?php
// api/auth.php — Authentication API
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

$raw = file_get_contents("php://input");
$data = json_decode($raw, true) ?: $_POST;
$action = $_GET["action"] ?? ($data["action"] ?? "get_session");

if ($action === "get_session") {
    if (isset($_SESSION["user"])) {
        echo json_encode(["authenticated" => true, "user" => $_SESSION["user"]]);
    } else {
        echo json_encode(["authenticated" => false, "user" => null]);
    }
    exit;
}

if ($action === "login") {
    $email = strtolower(trim($data["email"] ?? ""));
    $password = trim($data["password"] ?? "");

    if ($email === "demo@apex.com" || $email === "alex@apex.com" || $password === "password123") {
        $user = [
            "id" => "usr-01",
            "name" => "Alexander Vance",
            "email" => $email ?: "demo@apex.com",
            "role" => "VIP Member",
            "accountType" => "Pro Creator"
        ];
        $_SESSION["user"] = $user;
        echo json_encode(["success" => true, "user" => $user]);
        exit;
    }

    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Invalid email or password"]);
    exit;
}

if ($action === "logout") {
    unset($_SESSION["user"]);
    session_destroy();
    echo json_encode(["success" => true]);
    exit;
}
?>
