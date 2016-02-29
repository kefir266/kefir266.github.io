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
var blinkDiv = document.getElementById("blinkDiv");
var maData=[0,0,0];
var maField = document.getElementById("ma");
var listOfProductsField = document.getElementById("listOfProducts");

var fruits = [];
var vegetables = [];

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
                if (lastFalseCounter > 0){
                    maData.shift();
                    maData.push(lastFalseCounter);
                    maField.value = ((maData[0]+maData[1]+maData[2])/3).toFixed(2);
                    lastFalseCounter = 0;
                }
                blinkDiv.style.backgroundColor ="#00FF00";
            }
            else {
                falseCounter++;
                lastFalseCounter++;
                blinkDiv.style.backgroundColor = "#FF0000";

            }
            trueField.value = trueCounter;
            falseField.value = falseCounter;
            lastFalseField.value = lastFalseCounter;
            percentageField.value = (100.0 * falseCounter/(trueCounter + falseCounter)).toFixed(2);
        }
    });


}

function fetchData(){
    callServerGet("http://careers.intspirit.com/endpoint/data_set", function (){
        if(xmlHttp.readyState == 4) {
            var response = xmlHttp.responseText;
            console.log(response);
            var data = JSON.parse(response);
            if (data.type == "fruit") {
                if (data.item.toString() in fruits) {
                    fruits[data.item.toString()]++;
                }
                else fruits[data.item.toString()] = 1;
            }
            else {
                if (data.item.toString() in vegetables){
                    vegetables[data.item.toString()]++;
                }
                else vegetables[data.item.toString()] = 1;
            }
            outputList();

        }
    })
}

function clearList(){
    vegetables = [];
    fruits = [];
    outputList();
}

function outputList(){

    var htmlList = "";
    if (Object.keys(vegetables).length > 0){
        htmlList += "<ul><li>Vegetables</li><ul>";
        for (item in vegetables){
            htmlList += "<li>" + vegetables[item] + " " + item + "</li>";
        }
        htmlList += "</ul></ul>";
    }
    if (Object.keys(fruits).length > 0){
        htmlList += "<ul><li>Fruits</li><ul>";
        for (item in fruits){
            htmlList += "<li>" + fruits[item] + " " + item + "</li>";
        }
        htmlList += "</ul></ul>";
    }
    listOfProductsField.innerHTML = htmlList;

}