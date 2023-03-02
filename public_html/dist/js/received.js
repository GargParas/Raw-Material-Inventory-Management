
var jpdbBaseUrl = "http://api.login2explore.com:5577";
var jpdbIML = "/api/iml";
var jpdbIRL = "/api/irl";
var itemDBName = "Item-DB";
var itemRelationName = "ItemReceived";
var connToken = "90938032|-31949274829065566|90949622";
$("#receiptNo").focus();
    
function validateData() {
//    alert("called valid");
    
    var no,date,id,quant;
    no = $("#receiptNo").val();
    date = $("#receiptDate").val();
    id = $("#itemId").val();
    quant = $("#itemQuantity").val();
    
    if (no === "") {
        alert("This is Required Value");
        $("#receiptNo").focus();
        return "";
    } 
    if (date === "") {
        alert("This is Required Value");
        $("#receiptDate").focus();
        return "";
    } 
    if (id === "") {
        alert("This is Required Value");
        $("#itemId").focus();
        return "";
    }
    
    if (quant === "") {
        alert("This is Required Value");
        $("#itemQuantity").focus();
        return "";
    }
    
    var jsonStrObj = {
        receipt_no: no,
        receipt_date: date,
        item_id: id,
        item_quantity: quant
    };
    return JSON.stringify(jsonStrObj);
}

//reseting the form values
function resetReceived() {
    $("#receiptNo").val("");
    $("#receiptDate").val("");
    $("#itemId").val("");
    $("#itemQuantity").val("");
    $("#receiptNo").prop('disabled',false);
    $("#save").prop('disabled',true);
    $("#change").prop('disabled',true);
    $("#reset").prop('disabled',true);
    $("#receiptNo").focus();
}

//on click function
function saveReceived() {
    var jsonStr = validateData();
    if (jsonStr === "") {
        return "";
    }
    var putReqStr = createPUTRequest(connToken,jsonStr,itemDBName,itemRelationName);
    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(putReqStr,jpdbBaseUrl,jpdbIML);
    alert("1 Record Added");
    jQuery.ajaxSetup({async: true});
    reset();
    $("#receiptNo").focus();
}

function changeReceived() {
    $("#change").prop('disabled',true);
    var jsonchag = validateData();
    var updateReq = createUPDATERecordRequest(connToken,jsonchag,itemDBName,itemRelationName,localStorage.getItem('recno'));
    jQuery.ajaxSetup({async: false});
    var resultJsonObj = executeCommandAtGivenBaseUrl(updateReq,jpdbBaseUrl,jpdbIML);
    alert("1 Record Updated");
    jQuery.ajaxSetup({async: true});
    resetReceived();
    $("#receiptNo").focus();
}

function getReceiptNoAsJsonObj(){
    var receiptno = $('#receiptNo').val();
    var jsonStr = {
        receipt_no:receiptno
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj){
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $('#receiptDate').val(record.receipt_date);
    $('#itemId').val(record.item_id);
    $('#itemQuantity').val(record.item_quantity); 
}

function saveRecNo2LS(jsonObj){
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno',lvData.rec_no);
}

function getRecNo(){
    var receiptNoJsonObj = getReceiptNoAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken,itemDBName,itemRelationName,receiptNoJsonObj);
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest,jpdbBaseUrl,jpdbIRL);
    jQuery.ajaxSetup({async:true});
    if(resJsonObj.status === 400) {
        $("#save").prop('disabled', false);
        $("#reset").prop('disabled', false);
        $("#receiptDate").focus();
    }
    else if(resJsonObj.status===200)
    {
        $("#receiptNo").prop('disabled',true);
        fillData(resJsonObj);

        $("#change").prop('disabled', false);
        $("#reset").prop('disabled', false);
        $("#receiptDate").focus();
   
    }
}