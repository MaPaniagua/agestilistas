<?php

$errorMSG = "";

//get name
if ( isset( $_POST["name"] ) ) {
    $name = $_POST["name"];
}

//get email
if ( isset( $_POST["email"] ) ) {
    $email = $_POST["email"];
}

//get subject
if ( empty( $_POST["msg_subject"] ) ) {
    $subject = "New Message Received";
} else {
    $subject = $_POST["msg_subject"];
}

//get subject
if ( isset( $_POST["message"] ) ) {
    $message = $_POST["message"];
}

//Add your email here
$EmailTo = "ithemeslab@gmail.com";

// prepare email body text
$msgBody = "";
$msgBody .= "Name: ";
$msgBody .= $name;
$msgBody .= "\n";
$msgBody .= "Email: ";
$msgBody .= $email;
$msgBody .= "\n";
$msgBody .= "Subject: ";
$msgBody .= $subject;
$msgBody .= "\n";
$msgBody .= "Message: ";
$msgBody .= $message;
$msgBody .= "\n";

//send email
$success = mail($EmailTo, $subject, $msgBody, "From:".$email);

// redirect to success page
if ( $success && $errorMSG == "" ) {
   echo "success";
} else {
    if( $errorMSG == "" ) {
        echo "Something went wrong :(";
    } else {
        echo $errorMSG;
    }
}
?>
