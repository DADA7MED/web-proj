
<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/../config/database.php";

function sendResponse($statusCode, $data)
{
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// Check login
if (!isset($_SESSION["user_id"])) {
    sendResponse(401, [
        "success" => false,
        "message" => "Please login first."
    ]);
}

$userId = (int) $_SESSION["user_id"];
$method = $_SERVER["REQUEST_METHOD"];

try {

    // GET: Get wishlist products
    if ($method === "GET") {

        $sql = "
            SELECT
                p.id,
                p.name,
                p.price,
                p.old_price,
                p.rating,
                p.reviews_count,
                p.stock,
                p.image,
                p.specs,
                wi.added_at
            FROM wishlists w
            INNER JOIN wishlist_items wi
                ON w.wishlist_id = wi.wishlist_id
            INNER JOIN products p
                ON wi.product_id = p.id
            WHERE w.user_id = ?
            ORDER BY wi.added_at DESC
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([$userId]);

        sendResponse(200, [
            "success" => true,
            "data" => $stmt->fetchAll()
        ]);
    }

    // POST: Add product to wishlist
    if ($method === "POST") {

        $input = json_decode(file_get_contents("php://input"), true);

        if (!is_array($input)) {
            sendResponse(400, [
                "success" => false,
                "message" => "Invalid request data."
            ]);
        }

        $productId = isset($input["product_id"])
            ? (int) $input["product_id"]
            : 0;

        if ($productId <= 0) {
            sendResponse(400, [
                "success" => false,
                "message" => "Invalid product ID."
            ]);
        }

        // Check if product exists
        $productStmt = $pdo->prepare(
            "SELECT id FROM products WHERE id = ?"
        );
        $productStmt->execute([$productId]);

        if (!$productStmt->fetch()) {
            sendResponse(404, [
                "success" => false,
                "message" => "Product not found."
            ]);
        }

        // Find the user's wishlist
        $wishlistStmt = $pdo->prepare(
            "SELECT wishlist_id FROM wishlists WHERE user_id = ? LIMIT 1"
        );
        $wishlistStmt->execute([$userId]);

        $wishlistId = $wishlistStmt->fetchColumn();

        // Create wishlist if it does not exist
        if (!$wishlistId) {
            $createStmt = $pdo->prepare(
                "INSERT INTO wishlists (user_id) VALUES (?)"
            );
            $createStmt->execute([$userId]);

            $wishlistId = $pdo->lastInsertId();
        }

        // Add product without duplicating it
        $itemStmt = $pdo->prepare("
            INSERT IGNORE INTO wishlist_items
                (wishlist_id, product_id)
            VALUES (?, ?)
        ");
        $itemStmt->execute([$wishlistId, $productId]);

        sendResponse(200, [
            "success" => true,
            "message" => "Product added to wishlist."
        ]);
    }

    // DELETE: Remove one product or clear wishlist
    if ($method === "DELETE") {

        $productId = isset($_GET["product_id"])
            ? (int) $_GET["product_id"]
            : 0;

        // Clear all wishlist items
        if ($productId === 0) {

            $stmt = $pdo->prepare("
                DELETE wi
                FROM wishlist_items wi
                INNER JOIN wishlists w
                    ON wi.wishlist_id = w.wishlist_id
                WHERE w.user_id = ?
            ");
            $stmt->execute([$userId]);

            sendResponse(200, [
                "success" => true,
                "message" => "Wishlist cleared successfully."
            ]);
        }

        if ($productId < 0) {
            sendResponse(400, [
                "success" => false,
                "message" => "Invalid product ID."
            ]);
        }

        // Remove one product
        $stmt = $pdo->prepare("
            DELETE wi
            FROM wishlist_items wi
            INNER JOIN wishlists w
                ON wi.wishlist_id = w.wishlist_id
            WHERE w.user_id = ?
            AND wi.product_id = ?
        ");
        $stmt->execute([$userId, $productId]);

        sendResponse(200, [
            "success" => true,
            "message" => "Product removed from wishlist."
        ]);
    }

    sendResponse(405, [
        "success" => false,
        "message" => "Method not allowed."
    ]);

} catch (PDOException $e) {

    error_log("Wishlist database error: " . $e->getMessage());

    sendResponse(500, [
        "success" => false,
        "message" => "A database error occurred. Please try again."
    ]);

} catch (Throwable $e) {

    error_log("Wishlist API error: " . $e->getMessage());

    sendResponse(500, [
        "success" => false,
        "message" => "Something went wrong. Please try again."
    ]);
}
