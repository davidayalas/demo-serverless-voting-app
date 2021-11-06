const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
const apikey = "*************";

function doPost(e) {
  const clientApiKey = e && e.parameter && e.parameter.apikey ? e.parameter.apikey : null;

  if(clientApiKey!==apikey){
    return ContentService.createTextOutput('{"error":"invalid credentials"}').setMimeType(ContentService.MimeType.JSON);
  }

  const action = e && e.parameter && e.parameter.action ? e.parameter.action : null;
  const email = e && e.parameter && e.parameter.email ? e.parameter.email : null;
  const id = e && e.parameter && e.parameter.id ? e.parameter.id*1 : -1;
  const value = e && e.parameter && e.parameter.value ? e.parameter.value : null;

  let response = {
    'response' : null
  }

  switch(action){
    case "getUserVote":
      response=getUserVote(email, id);
      break;
    case "getData":
      response={'value': getData()};
      break;
    case "addVote":
      response=addVote(email,value, id);
      break;
  }
  
  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return HtmlService.createHtmlOutput("<h1>Hola</h1>");
}

function findVote(email){
  const data = sheet.getDataRange().getValues();
  let i, z;
  for(i=0, z=data.length; i<z; i++){
    if(data[i][0]===email) {
      break;
    }
  }
  return i<z ? (i+1) : -1;
}  

function getUserVote(email, id){
  const user = email;
  const find = id>-1 ? id : findVote(user);
  if(find>-1){
    return {'value': sheet.getRange("B"+find).getValue(), 'id': find};
  }
  return {'value': null, 'id': -1};
}

function addVote(email, value, id) {
  const user = email;
  const find = id>-1 ? id : findVote(user);
  if(find>-1){
    sheet.getRange("B"+find).setValue(value);
  }else{
    sheet.appendRow([user, value]);
  }
  return {'value': getData(true)};
}

function getData(refresh){
  refresh = refresh || false;
    
  if(!refresh && PropertiesService.getScriptProperties().getProperty("results")){
    return JSON.parse(PropertiesService.getScriptProperties().getProperty("results"));
  }
  
  const data = sheet.getDataRange().getValues();
  const results = {};
  for(let i=0, z=data.length; i<z; i++){
    if(!results[data[i][1]]){
      results[data[i][1]]=1;
    }else{
      results[data[i][1]] = results[data[i][1]]+1;
    }
  }
  
  PropertiesService.getScriptProperties().setProperty("results", JSON.stringify(results)); //cache 
  return results;
}