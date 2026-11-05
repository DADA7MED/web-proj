<?php
//api/categoriesApi.php
header('Content-Type: application/json; charset=UTF-8');

// استدعاء ملف الاتصال المشترك (نفس اللي بتستخدمه صفحة المنتجات)
require_once __DIR__ . '/../db.php';

try {
    // جلب التصنيفات باستخدام الاتصال $conn الموجود في db.php
    $result = mysqli_query($conn, "SELECT * FROM categories ORDER BY id ASC");
    
    if (!$result) {
        throw new Exception(mysqli_error($conn));
    }
    
    $categories = [];
    while ($row = mysqli_fetch_assoc($result)) {
        // فك تشفير الحقول لو مخزنة كـ JSON (مثل features أو models_list)
        if (isset($row['features']) && is_string($row['features'])) {
            $row['features'] = json_decode($row['features'], true);
        }
        if (isset($row['models_list']) && is_string($row['models_list'])) {
            $row['models_list'] = json_decode($row['models_list'], true);
        }
        
        $categories[] = $row;
    }
    
    echo json_encode($categories);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
