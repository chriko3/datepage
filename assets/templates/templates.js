function elementTemplate(dateTitel, key){
    return `<div class='element' data-key='${key}'>
        ${dateTitel}
    </div>`;
}

function elementNormalTemplate(input){
    return `<div class='element'>
        ${input}
    </div>`;
}


function elementAddButtonTemplate(){
  return `<div class='element addButton' onclick='openAddNewDate()'>
    Idee hinzufügen 📝
    </div>`;
}  

function elementBackButtonTemplate(){
  return `
    <div class='element backButton' onclick='goHome()'>
    Zurück 🔙
    </div>`;
}  