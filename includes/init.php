<?php
// includes/init.php — Global Initialization & Environment
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../db.php';

function asset($path) {
    return ltrim($path, '/');
}

function isActive($pageName) {
    $current = basename($_SERVER['PHP_SELF'], '.php');
    return $current === $pageName ? 'active' : '';
}
?>
