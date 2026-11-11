<?php
// includes/header.php — Shared HTML Head & Metadata
require_once __DIR__ . '/init.php';
$pageTitle = $pageTitle ?? 'Laptop Store — Engineered for Extreme Performance';
$pageCss = $pageCss ?? 'css/pages/home.css';
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($pageTitle) ?></title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <link rel="stylesheet" href="css/base.css">
    <link rel="stylesheet" href="<?= htmlspecialchars($pageCss) ?>">
</head>
<body>
<?php require_once __DIR__ . '/navbar.php'; ?>
