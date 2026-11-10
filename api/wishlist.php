<?php
// api/wishlist.php — Real Wishlist API with MySQL PDO & Session Fallback
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

function sendResponse($statusCode, $data) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// User session or fallback to default user 1
$userId = (int)($_SESSION["user_id"] ?? 1);
$method = $_SERVER["REQUEST_METHOD"];

// Fallback session array if database is not running
if (!isset($_SESSION["wishlist"])) {
    $_SESSION["wishlist"] = [1];
}

try {
    // 1. MySQL PDO Mode (if PDO connection is active)
    if (isset($pdo) && $pdo) {
        if ($method === "GET") {
            $sql = "
                SELECT
                    p.id, p.category_id, p.name, p.slug, p.price, p.old_price,
                    p.rating, p.reviews_count, p.stock, p.image, p.specs, wi.added_at
                FROM wishlists w
                INNER JOIN wishlist_items wi ON w.wishlist_id = wi.wishlist_id
                INNER JOIN products p ON wi.product_id = p.id
                WHERE w.user_id = ?
                ORDER BY wi.added_at DESC
            ";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$userId]);
            $items = $stmt->fetchAll();

            foreach ($items as &$item) {
                if (isset($item['specs']) && is_string($item['specs'])) {
                    $decoded = json_decode($item['specs'], true);
                    if ($decoded !== null) $item['specs'] = $decoded;
                }
            }

            sendResponse(200, ["success" => true, "data" => $items]);
        }

        if ($method === "POST") {
            $input = json_decode(file_get_contents("php://input"), true) ?: $_POST;
            $productId = isset($input["product_id"]) ? (int)$input["product_id"] : 0;

            if ($productId <= 0) {
                sendResponse(400, ["success" => false, "message" => "Invalid product ID."]);
            }

            $wishlistStmt = $pdo->prepare("SELECT wishlist_id FROM wishlists WHERE user_id = ? LIMIT 1");
            $wishlistStmt->execute([$userId]);
            $wishlistId = $wishlistStmt->fetchColumn();

            if (!$wishlistId) {
                $createStmt = $pdo->prepare("INSERT INTO wishlists (user_id) VALUES (?)");
                $createStmt->execute([$userId]);
                $wishlistId = $pdo->lastInsertId();
            }

            // Toggle item
            $checkStmt = $pdo->prepare("SELECT wishlist_item_id FROM wishlist_items WHERE wishlist_id = ? AND product_id = ?");
            $checkStmt->execute([$wishlistId, $productId]);
            $existing = $checkStmt->fetchColumn();

            if ($existing) {
                $delStmt = $pdo->prepare("DELETE FROM wishlist_items WHERE wishlist_item_id = ?");
                $delStmt->execute([$existing]);
                sendResponse(200, ["success" => true, "status" => "removed", "message" => "Removed from wishlist."]);
            } else {
                $insStmt = $pdo->prepare("INSERT INTO wishlist_items (wishlist_id, product_id) VALUES (?, ?)");
                $insStmt->execute([$wishlistId, $productId]);
                sendResponse(200, ["success" => true, "status" => "added", "message" => "Added to wishlist."]);
            }
        }

        if ($method === "DELETE") {
            $productId = isset($_GET["product_id"]) ? (int)$_GET["product_id"] : 0;
            if ($productId === 0) {
                $stmt = $pdo->prepare("DELETE wi FROM wishlist_items wi INNER JOIN wishlists w ON wi.wishlist_id = w.wishlist_id WHERE w.user_id = ?");
                $stmt->execute([$userId]);
                sendResponse(200, ["success" => true, "message" => "Wishlist cleared successfully."]);
            } else {
                $stmt = $pdo->prepare("DELETE wi FROM wishlist_items wi INNER JOIN wishlists w ON wi.wishlist_id = w.wishlist_id WHERE w.user_id = ? AND wi.product_id = ?");
                $stmt->execute([$userId, $productId]);
                sendResponse(200, ["success" => true, "status" => "removed", "message" => "Product removed."]);
            }
        }
    }

    // 2. Session Fallback (if PDO is not running in sandbox)
    if ($method === "GET") {
        sendResponse(200, ["success" => true, "items" => $_SESSION["wishlist"]]);
    }

    if ($method === "POST") {
        $input = json_decode(file_get_contents("php://input"), true) ?: $_POST;
        $productId = isset($input["product_id"]) ? (int)$input["product_id"] : 0;
        if ($productId <= 0) sendResponse(400, ["success" => false, "message" => "Invalid ID."]);

        if (in_array($productId, $_SESSION["wishlist"])) {
            $_SESSION["wishlist"] = array_values(array_diff($_SESSION["wishlist"], [$productId]));
            $status = "removed";
        } else {
            $_SESSION["wishlist"][] = $productId;
            $status = "added";
        }
        sendResponse(200, ["success" => true, "status" => $status]);
    }

    if ($method === "DELETE") {
        $_SESSION["wishlist"] = [];
        sendResponse(200, ["success" => true, "status" => "cleared"]);
    }
} catch (Exception $e) {
    sendResponse(500, ["success" => false, "error" => $e->getMessage()]);
}
?>
