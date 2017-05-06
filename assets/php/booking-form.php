<?php

$errorMSG = "";

//get date
if ( isset( $_POST["bDate"] ) ) {
    $bDate = $_POST["bDate"];
}

//get time
if ( isset( $_POST["bTime"] ) ) {
    $bTime = $_POST["bTime"];
}

//get service
if ( isset( $_POST["bService"] ) ) {
    $bService = $_POST["bService"];
}

//get stylist
if ( isset( $_POST["bStylist"] ) ) {
    $bStylist = $_POST["bStylist"];
}

//get name
if ( isset( $_POST["bName"] ) ) {
    $bName = $_POST["bName"];
}

//get phone
if ( isset( $_POST["bPhone"] ) ) {
    $bPhone = $_POST["bPhone"];
}

//get email
if ( isset( $_POST["bEmail"] ) ) {
    $bEmail = $_POST["bEmail"];
}

//Add your email here
$EmailTo = "ithemeslab@gmail.com";
$subject = "New booking received from: { $bName } ";
// prepare email body text
$msgBody = "";
$msgBody .= "Name: ";
$msgBody .= $bName;
$msgBody .= "\n";
$msgBody .= "Email: ";
$msgBody .= $bEmail;
$msgBody .= "\n";
$msgBody .= "Booking Date: ";
$msgBody .= $bDate;
$msgBody .= "\n";
$msgBody .= "Booking Time: ";
$msgBody .= $bTime;
$msgBody .= "\n";
$msgBody .= "Serivce Name: ";
$msgBody .= $bService;
$msgBody .= "\n";
$msgBody .= "Stylist: ";
$msgBody .= $bStylist;
$msgBody .= "\n";
$msgBody .= "Phone Number: ";
$msgBody .= $bPhone;

//send email
$success = mail($EmailTo, $subject, $msgBody, "From:".$bEmail);

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
