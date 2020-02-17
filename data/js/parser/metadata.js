class Metadata {

updateMetaDataFields(){
  $('#rightAside').accordion({active:0});
  //document.getElementById("inputColNum").value= collectionNumber;
  //document.getElementById("inputOffscreenName").value= collectionNumber;
  //document.getElementById("inputDbNum").value= databaseNumber;
  //document.getElementById("inputPubNum").value= publicationNumber;
  //document.getElementById("inputSiteProv").value= siteProvenance;
  //document.getElementById("inputColNum").value= collectionNumber;
  document.getElementById("inputFilename").value= this.Filename;
  document.getElementById("inputType").value= this.Type;
  document.getElementById("inputDimensions").value= this.Dimensions;

  document.getElementById("inputPublication").value= this.Publication;
  document.getElementById("inputDescription").value= this.Description;
  document.getElementById("inputNotes").value= this.Notes;

  rightAside=true;
  $("#rightAside").animate({right:'15px'});
  $("#contentwrapper").css("right","315px");
  $("#rightAsideButtonIcon").attr("class","sidebarIcon ui-icon ui-icon-triangle-1-e");
}
}
