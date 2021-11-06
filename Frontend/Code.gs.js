const backendSheet = "https://script.google.com/macros/s/****************/exec";
const apikey = "*************";

function doGet(e) {
  PropertiesService.getUserProperties().setProperty("id", -1); //reset user row id in backend spreadsheet
  return HtmlService.createTemplateFromFile('Index')
          .evaluate()
          .addMetaTag('viewport', 'width=device-width, initial-scale=1')
          .setTitle('Aplicació de votació serverless')
        ;
}

function request(action, email, value){
  const options = {
    'method' : 'post',
    'payload' : {
      'action': action,
      'email': email,
      'value': value,
      'id': PropertiesService.getUserProperties().getProperty("id"),
      'apikey': apikey
    },
    'muteHttpExceptions': true
  };
  let response = UrlFetchApp.fetch(backendSheet, options).getContentText();
  try{
    response = JSON.parse(response);
  }catch(e){
    return null;  
  }
  if(PropertiesService.getUserProperties().getProperty("id")==-1 && response.id>-1){
    PropertiesService.getUserProperties().setProperty("id", response.id); //user row id in backend spreadsheet
  }
  return response.value!==null ? response.value : null;
}

function getUserVote(){
  return request("getUserVote", Session.getActiveUser().getEmail());
}

function addVote(value) {
  return request("addVote", Session.getActiveUser().getEmail(), value);
}

function getData(){
  return request("getData");
}