var AutoSprite = function(settings, SpritePSD) {

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

  /* 
   * Gets a group of layers (based on "root" param).
   * Returns an array of elements for CSS spriting.
   */
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

  /* 
   * Gets a single layer.
   * Returns it's important data for CSS sprite:
   *
   * - name: layer name
   * - selector: full layer's path name
   * - top: absolute top position from PSD
   * - left: absolute left position from PSD
   * - width: layer's width
   * - height: layer's height
   * 
   * [todo]
   * - force normalize on layer's name
   * - check for duplicated layer's name
   * 
   */
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


  /*
   * Returns a CSS string based on given element (layer data).
   * 
   * [todo]
   * - accept templating
   * 
   */
  function spriteCSS(element, rootSelector) {
    
    var output = "";
    output += "." + rootSelector + "";
    output += "." + element.selector + " {\n";
    output += "\twidth:  " + element.width + "px;\n";
    output += "\theight: " + element.height + "px;\n";
    output += "\tbackground-position: -" + element.left + "px -" + element.top + "px;\n";
    output += "}\n";

    return output + "\n";
  }


  /*
   * Returns root CSS selector string.
   * 
   * [todo]
   * - accept templating
   * - change background-image extension
   * 
   */
  function rootCSS(rootSelector) {
   
    var output = "";
    output += "." + rootSelector + " {\n";
    output += "\tbackground-image:  url(" + rootSelector + ".png);\n";
    output += "\tbackground-repeat: no-repeat;\n";
    output += "\tdisplay: block;\n";
    output += "}\n";

    return output + "\n";
  }


  /*
   * Iterates over content and builds a file.
   */
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
  
  /*
   * Exports CSS
   */
  function exportCSS() {
    writeCSS(getLayerGroup(SpritePSD), exportData["css"], function(status, data) {
      if(status === "success") {
        alert("CSS Created \n File \"" + data + "\" successfully written.");
      }
    });
  }

  /*
   * Builds a file based on exportData information.
   */
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

  /*
   * Exports PNG
   */
  function exportPNG() {
    writePNG(SpritePSD, exportData["img"], function(status, data) {
      if(status === "success") {
        alert("PNG Exported \n File \"" + data + "\" successfully written.");
      }
    });
  }
  
  /*
   * Exports JPG
   */
  function exportJPG() {
    alert("JPG Export not implemented");
  }

  /*
   * Exports Image
   */
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

  return {
    exportCSS: exportCSS,
    exportImage: exportImage
  };
};