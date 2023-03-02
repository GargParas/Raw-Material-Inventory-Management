
var jpdbBaseUrl = "http://api.login2explore.com:5577";
var jpdbIML = "/api/iml";
var jpdbIRL = "/api/irl";
var itemDBName = "Item-DB";
var itemRelationName = "ItemManagement";
var connToken = "90938032|-31949274829065566|90949622";
$("#itemId").focus();
    
function validateData() {
//    alert("called valid");
    
    var id,name,stock,unit;
    id = $("#itemId").val();
    name = $("#itemName").val();
    stock = $("#itemStock").val();
    unit = $("#itemUnit").val();
    
    if (id === "") {
        alert("This is Required Value");
        $("#itemId").focus();
        return "";
    } 
    if (name === "") {
        alert("This is Required Value");
        $("#itemName").focus();
        return "";
    } 
    if (stock === "") {
        alert("This is Required Value");
        $("#itemStock").focus();
        return "";
    }
    
    if (unit === "") {
        alert("This is Required Value");
        $("#itemUnit").focus();
        return "";
    }
    
    var jsonStrObj = {
        item_id: id,
        item_name: name,
        item_stock: stock,
        item_unit: unit
    };
    return JSON.stringify(jsonStrObj);
}

//reseting the form values
function resetMgmt() {
    $("#itemId").val("");
    $("#itemName").val("");
    $("#itemStock").val("");
    $("#itemUnit").val("");
    $("#itemId").prop('disabled',false);
    $("#save").prop('disabled',true);
    $("#change").prop('disabled',true);
    $("#reset").prop('disabled',true);
    $("#itemId").focus();
}

//on click function
function saveMgmt() {
    var jsonStr = validateData();
    if (jsonStr === "") {
        return "";
    }
    var putReqStr = createPUTRequest(connToken,jsonStr,itemDBName,itemRelationName);
    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(putReqStr,jpdbBaseUrl,jpdbIML);
    alert("1 Record Added");
    jQuery.ajaxSetup({async: true});
    resetMgmt();
    $("#itemId").focus();
}

function changeMgmt() {
    $("#change").prop('disabled',true);
    
    var jsonchag = validateData();
    var updateReq = createUPDATERecordRequest(connToken,jsonchag,itemDBName,itemRelationName,localStorage.getItem('recno'));
    
    jQuery.ajaxSetup({async: false});
    var resultJsonObj = executeCommandAtGivenBaseUrl(updateReq,jpdbBaseUrl,jpdbIML);
    alert("1 Record Updated");
    jQuery.ajaxSetup({async: true});
    resetMgmt();
    $("#itemId").focus();
}

function getItemIdAsJsonObj(){
    var itemId = $('#itemId').val();
    var jsonStr = {
        item_id:itemId
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj){
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $('#itemName').val(record.item_name);
    $('#itemStock').val(record.item_stock);
    $('#itemUnit').val(record.item_unit); 
}

function saveRecNo2LS(jsonObj){
   
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno',lvData.rec_no);
}

function getItem(){
    var itemIdJsonObj = getItemIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken,itemDBName,itemRelationName,itemIdJsonObj);
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest,jpdbBaseUrl,jpdbIRL);
    jQuery.ajaxSetup({async:true});
    if(resJsonObj.status === 400) {
        $("#save").prop('disabled', false);
        $("#reset").prop('disabled', false);
        $("#itemName").focus();
    }
    else if(resJsonObj.status===200)
    {
        $("#itemId").prop('disabled',true);
        fillData(resJsonObj);

        $("#change").prop('disabled', false);
        $("#reset").prop('disabled', false);
        $("#itemName").focus();
   
    }
}