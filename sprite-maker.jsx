#target photoshop

// Main
(function() {

  // preferences.rulerUnits = Units.PIXELS;

  if(app.documents.length <= 0) {
    alert("No document available.")
    return 'cancel';
  }

  var PSD = {};
  PSD.document = app.activeDocument;
  PSD.path = app.activeDocument.path;
  PSD.name = PSD.document.name;
  PSD.layers = PSD.document.layers;

  var exportFile = {};
  exportFile.name = "sprites";
  exportFile.path = PSD.path;
  exportFile.CSSPath = (function (file) { return file.path + "/" + file.name + ".css"; })(exportFile);
  exportFile.PNGPath = (function (file) { return file.path + "/" + file.name + ".png"; })(exportFile);

  writeCSS(getLayerGroup(PSD.document), exportFile, function(status, data) {
    if(status === "success") {
      alert("CSS Created \n File \"" + data + "\" successfully written.");
    }
  });
  
  writePNG(PSD.document, exportFile, function(status, data) {
    if(status === "success") {
      alert("PNG Exported \n File \"" + data + "\" successfully written.");
    }
  });

})();


// Gets a set (group) of layers and returns an array of
// elements.
function getLayerGroup(root, prefix) {
  
  var set = [], element;

  for(var i = 0; i < root.layers.length; i++) {
    
    element = getLayer(root.layers[i], prefix);
    
    if(element) { 
      set = set.concat( element );
    }
  }

  return set;
}


// Gets a layer (element) and returns it's important data.
function getLayer(layer, prefix) {
  
  if(!layer.visible) { 
    return false;
  }

  var pathname = '', name;

  if(layer.typename === 'LayerSet') {
    
    if(typeof prefix === 'undefined') {
      return getLayerGroup(layer, layer.name.toLowerCase());
    }
    else {
      return getLayerGroup(layer, prefix + "-" + layer.name.toLowerCase());
    }

  }
  else {

    if(typeof prefix !== "undefined") {
      pathname +=  prefix + '-';
    }
    
    name = layer.name.toLowerCase();
    pathname += name;

    return [{
      name: name,
      selector: pathname,
      top: layer.bounds[1].value,
      left: layer.bounds[0].value,
      width: layer.bounds[2].value - layer.bounds[0].value,
      height: layer.bounds[3].value - layer.bounds[1].value
    }];
  }
}


// return a CSS string based on given layer.
function spriteCSS(layer, rootSelector) {
  
  var output = "";
  output += "." + rootSelector + "";
  output += "." + layer.selector + " {\n";
  output += "\twidth:  " + layer.width + "px;\n";
  output += "\theight: " + layer.height + "px;\n";
  output += "\tbackground-position: -" + layer.left + "px -" + layer.top + "px;\n";
  output += "}\n";

  return output + "\n";
}


// return CSS initial settings.
function rootCSS(rootSelector) {
 
  var output = "";
  output += "." + rootSelector + " {\n";
  output += "\tbackground-image:  url(" + rootSelector + ".png);\n";
  output += "\tbackground-repeat: no-repeat;\n";
  output += "\tdisplay: block;\n";
  output += "}\n";

  return output + "\n";
}


// Iterates over content and builds a file.
function writeCSS(content, exportData, callback) {
  
  var output = rootCSS(exportData.name);

  for(var i = 0; i < content.length; i++) {
    output += spriteCSS(content[i], exportData.name);
  }

  var outputFile = new File(exportData.CSSPath);
  outputFile.open("w");
  outputFile.writeln(output);
  outputFile.close();

  if(typeof callback === "function") {
    callback("success", exportData.CSSPath);
  }
  
  return;
}


// Builds a file based on exportData information.
function writePNG(document, exportData, callback) {
  var outputFile = new File(exportData.PNGPath);
  var options = new ExportOptionsSaveForWeb();
  options.format = SaveDocumentType.PNG;
  options.PNG8 = false;
  options.quality = 100;
  document.exportDocument(outputFile, ExportType.SAVEFORWEB, options);

  if(typeof callback === "function") {
    callback("success", exportData.PNGPath);
  } 
}

// To Read:
// https://github.com/sjpsega/PSD2CssSprite/blob/master/PSD2CssSprite/PSD2CssSprite.jsx
// https://github.com/euskadi31/Photoshop-CSS-Sprite/blob/master/PSprite.jsx
// https://github.com/vvasilev-/sprites/blob/master/Sprites.jsx
// https://github.com/infinityspiral/Photoshop_CSS-Spritesheet/blob/master/CSS-Sprites.jsx
// https://raw.github.com/raptros/PSSpriteSheet/master/PSSpriteSheet.jsx