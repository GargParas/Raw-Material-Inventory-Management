
var jpdbBaseUrl = "http://api.login2explore.com:5577";
var jpdbIML = "/api/iml";
var jpdbIRL = "/api/irl";
var itemDBName = "Item-DB";
var itemRelationName = "ItemIssued";
var connToken = "90938032|-31949274829065566|90949622";
$("#issueNo").focus();
    
function validateData() {
    var no,date,id,quant;
    no = $("#issueNo").val();
    date = $("#issueDate").val();
    id = $("#itemId").val();
    quant = $("#issueQuantity").val();
    
    if (no === "") {
        alert("This is Required Value");
        $("#issueNo").focus();
        return "";
    } 
    if (date === "") {
        alert("This is Required Value");
        $("#issueDate").focus();
        return "";
    } 
    if (id === "") {
        alert("This is Required Value");
        $("#itemId").focus();
        return "";
    }
    
    if (quant === "") {
        alert("This is Required Value");
        $("#issueQuantity").focus();
        return "";
    }
    
    var jsonStrObj = {
        issue_no: no,
        issue_date: date,
        item_id: id,
        issue_quantity: quant
    };
    return JSON.stringify(jsonStrObj);
}

//reseting the form values
function resetIssue() {
    $("#issueNo").val("");
    $("#issueDate").val("");
    $("#itemId").val("");
    $("#issueQuantity").val("");
    $("#issueNo").prop('disabled',false);
    $("#save").prop('disabled',true);
    $("#change").prop('disabled',true);
    $("#reset").prop('disabled',true);
    $("#issueNo").focus();
}

//on click function
function saveIssue() {
    var jsonStr = validateData();
    if (jsonStr === "") {
        return "";
    }
    var putReqStr = createPUTRequest(connToken,jsonStr,itemDBName,itemRelationName);
    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(putReqStr,jpdbBaseUrl,jpdbIML);
    alert("1 Record Added");
    jQuery.ajaxSetup({async: true});
    resetIssue();
    $("#issueNo").focus();
}

function changeIssue() {
    $("#change").prop('disabled',true);
    
    var jsonchag = validateData();
    
    var updateReq = createUPDATERecordRequest(connToken,jsonchag,itemDBName,itemRelationName,localStorage.getItem('recno'));
    
    jQuery.ajaxSetup({async: false});
    var resultJsonObj = executeCommandAtGivenBaseUrl(updateReq,jpdbBaseUrl,jpdbIML);
    alert("1 Record Updated");
    jQuery.ajaxSetup({async: true});
    resetIssue();
    $("#issueNo").focus();
}

function getIssueNoAsJsonObj(){
    var issueno = $('#issueNo').val();
    var jsonStr = {
        issue_no:issueno
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj){
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $('#issueDate').val(record.issue_date);
    $('#itemId').val(record.item_id);
    $('#issueQuantity').val(record.issue_quantity); 
}

function saveRecNo2LS(jsonObj){
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno',lvData.rec_no);
}

function getIssueNo(){
    var issueNoJsonObj = getIssueNoAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken,itemDBName,itemRelationName,issueNoJsonObj);
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest,jpdbBaseUrl,jpdbIRL);
    jQuery.ajaxSetup({async:true});
    if(resJsonObj.status === 400) {
        $("#save").prop('disabled', false);
        $("#reset").prop('disabled', false);
        $("#issueDate").focus();
    }
    else if(resJsonObj.status===200)
    {
        $("#issueNo").prop('disabled',true);
        fillData(resJsonObj);

        $("#change").prop('disabled', false);
        $("#reset").prop('disabled', false);
        $("#issueDate").focus();
   
    }
}