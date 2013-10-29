var AutoSprite = function(settings, SpritePSD) {

  var AutoSprite = {};
  var SpritePSD = SpritePSD || app.activeDocument;
  var exportData = {
    "css": {
      name: settings.css && settings.css.name || settings.name || SpritePSD.name,
      path: settings.css && settings.css.path || settings.path || SpritePSD.path
    },
    
    "img": {
      name: settings.css && settings.css.name || settings.name || SpritePSD.name,
      path: settings.img && settings.img.path || settings.path || SpritePSD.path,
      outputFormat: settings.img && settings.img.outputFormat.toLowerCase() || "png"
    }
  };

  function getFullPath(path, file, ext) {
    return path + "/" + file + "." + ext;
  }

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

    var outputFilePath = getFullPath(exportData.path, exportData.name, "css");
    var outputFile = new File( outputFilePath );
    outputFile.open("w");
    outputFile.writeln(output);
    outputFile.close();

    if(typeof callback === "function") {
      callback("success", outputFilePath);
    }
    
    return;
  }

  function exportCSS() {
    writeCSS(getLayerGroup(SpritePSD), exportData["css"], function(status, data) {
      if(status === "success") {
        alert("CSS Created \n File \"" + data + "\" successfully written.");
      }
    });
  }

  AutoSprite.exportCSS = exportCSS;

  // Builds a file based on exportData information.
  function writePNG(document, exportData, callback) {
    
    var outputFilePath = getFullPath(exportData.path, exportData.name, "png")
    var outputFile = new File( outputFilePath );
    var options = new ExportOptionsSaveForWeb();
    options.format = SaveDocumentType.PNG;
    options.PNG8 = false;
    options.quality = 100;
    document.exportDocument(outputFile, ExportType.SAVEFORWEB, options);

    if(typeof callback === "function") {
      callback("success", outputFilePath);
    } 
  }

  function exportPNG() {
    writePNG(SpritePSD, exportData["img"], function(status, data) {
      if(status === "success") {
        alert("PNG Exported \n File \"" + data + "\" successfully written.");
      }
    });
  }
  
  function exportJPG() {
    alert("JPG Export not implemented");
  }

  function exportImage(imageFormat) {
    
    var imageFormat = imageFormat && imageFormat.toLowerCase() || exportData.img.outputFormat;
    
    var processOutput = {
      "png": exportPNG,
      "jpg": exportJPG
    };
    
    if(imageFormat in processOutput) {
      return processOutput[imageFormat]();
    } else {
      alert("Invalid image output format!");
    }
  }

  AutoSprite.exportImage = exportImage;

  return AutoSprite;
};