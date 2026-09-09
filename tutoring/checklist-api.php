<?php
/**
 * checklist-api.php
 *
 * Tiny same-origin JSON store for the AQA checklist's tick state.
 * GET  -> returns the saved state (or {} if nothing saved yet)
 * POST -> replaces the saved state with the JSON body sent
 *
 * Upload this file into the SAME folder as the checklist .html file.
 * It will create/update "checklist-progress.json" next to itself.
 * No database needed.
 */

header('Content-Type: application/json');

// Restrict to same-origin-ish use; loosen/tighten as you like.
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$dataFile = __DIR__ . '/checklist-progress.json';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    $decoded = json_decode($raw, true);

    if (json_last_error() !== JSON_ERROR_NONE || !is_array($decoded)) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Body must be valid JSON']);
        exit;
    }

    // Write atomically: write to a temp file, then rename over the real one.
    $tmpFile = $dataFile . '.tmp';
    $written = file_put_contents($tmpFile, json_encode($decoded, JSON_PRETTY_PRINT));

    if ($written === false || !rename($tmpFile, $dataFile)) {
        http_response_code(500);
        echo json_encode(['ok' => false, 'error' => 'Could not write file. Check folder permissions.']);
        exit;
    }

    echo json_encode(['ok' => true, 'savedAt' => date('c')]);
    exit;
}

// GET (default): return saved state, or an empty object if nothing saved yet.
if (file_exists($dataFile)) {
    readfile($dataFile);
} else {
    echo json_encode(new stdClass());
}
