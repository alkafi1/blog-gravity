<?php
$envPath = __DIR__ . '/.env';
if (!file_exists($envPath)) {
    die(".env file not found\n");
}

$lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
$config = [];
foreach ($lines as $line) {
    if (str_starts_with(trim($line), '#')) continue;
    $parts = explode('=', $line, 2);
    if (count($parts) === 2) {
        $config[trim($parts[0])] = trim($parts[1]);
    }
}

$host = $config['DB_HOST'] ?? '127.0.0.1';
$port = $config['DB_PORT'] ?? 3306;
$username = $config['DB_USERNAME'] ?? 'root';
$password = $config['DB_PASSWORD'] ?? '';
$database = $config['DB_DATABASE'] ?? 'blog';

echo "Attempting to connect to $host:$port as $username...\n";

try {
    $pdo = new PDO("mysql:host=$host;port=$port", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$database`");
    echo "Database '$database' created successfully.\n";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
