/**
 * Created by dmitrij on 28.02.2016.
 */
var xmlHttp = false;
var textField = document.getElementById("textField");
var submitButton = document.getElementById("submitButton");
var divError = document.getElementById("divError");

var falseCounter = 0;
var trueCounter = 0;
var lastFalseCounter = 0;
var trueField = document.getElementById("trueCounter");
var falseField = document.getElementById("falseCounter");
var lastFalseField = document.getElementById("lastFalseCounter");
var percentageField = document.getElementById("percentage");

/*@cc_on @*/
/*@if (@_jscript_version >= 5)
 try {
 xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
 } catch (e) {
 try {
 xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
 } catch (e2) {
 xmlHttp = false;
 }
 }
 @end @*/

if (!xmlHttp && typeof XMLHttpRequest != 'undefined') {
    xmlHttp = new XMLHttpRequest();
}

function callServerPost() {

    var url = "http://careers.intspirit.com/endpoint/post_response";

    var params = '{"Request":' + textField.value + '}';

    xmlHttp.open("POST", url, true);
    xmlHttp.onreadystatechange = updateForm;
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");


    xmlHttp.send(params);
}

function callServerGet(url, stateListener) {

    xmlHttp.open("GET", url, true);
    xmlHttp.onreadystatechange = stateListener;

    xmlHttp.send(null);
}

function updateForm(){
    if (xmlHttp.readyState == 4) {
        var response = xmlHttp.responseText;
        console.log(response);
        console.log(xmlHttp.status);
        if(xmlHttp.status == 200) {
            textField.value = "";
            submitButton.setAttribute("value", "Submit");
            divError.innerHTML ="";
        }
        else if(xmlHttp.status == 204) {
            if (textField.value.trim() ===""){
                submitButton.setAttribute("value", "Resubmit");
                divError.innerHTML ="Error";


            }
        }
        textField.value = '';
    }
}

function onClickSubmitButton (){
    callServerPost();
}

function onClickButtonReceive (){
    callServerGet("http://careers.intspirit.com/endpoint/response_codes", function (){
        if(xmlHttp.readyState == 4) {
            var response = xmlHttp.responseText;
            console.log(response);


            if (JSON.parse(response).result) {
                trueCounter++;
                lastFalseCounter = 0;
            }
            else {
                falseCounter++;
                lastFalseCounter++;


            }
            trueField.value = trueCounter;
            falseField.value = falseCounter;
            lastFalseField.value = lastFalseCounter;
            percentageField.value = (100.0 * falseCounter/(trueCounter + falseCounter)).toFixed(2);
        }
    });
}