var item = {
  OutterObj: {
    NextObj: {
      url: 'julio.com'
    }
  }
}

console.log(getProperty(item, ['OutterObj','NextObj', 'url']))

function getProperty(rootObject, properties){

  properties.forEach(function(property){
    rootObject = rootObject[0] ? rootObject[0][property] : rootObject[property]
  });

  return rootObject;
}

field = getProperty(item, ['OutterObj','NextObj', 'url']);
html += "<li class='information'>" + field + "</li>";
