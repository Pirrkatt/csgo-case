<?php
$url = (isset($_GET['url'])) ? $_GET['url'] : false;
if(!$url) exit;

set_error_handler("warning_handler", E_WARNING);

$string = file_get_contents($url);
header('Content-Type: application/json');
header('Cache-Control: public, max-age=604800');

// Copy response code
preg_match('/([0-9])\d+/',$http_response_header[0],$matches);
$responsecode = intval($matches[0]);
http_response_code($responsecode);

echo $string;

restore_error_handler();

function warning_handler($errno, $errstr) { 
  header('Content-Type: text/plain');
  echo $errstr;
}