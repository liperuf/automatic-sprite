#target photoshop
app.bringToFront();

var exportOpts = {
  name: "sprites",
  img: {
    outputformat: "PNG",
    // path: ""
  },
  css: {
    outputformat: "CSS",
    // path: ""
  }
  
};

var AutoSprite = function(opts, SpritePSD) {

  var AutoSprite = {};
  var SpritePSD = SpritePSD || app.activeDocument;
  var exportData = {
    
    "css": {
      name: opts.css && opts.css.name || opts.name || SpritePSD.name,
      path: opts.css && opts.css.path || SpritePSD.path
    },
    
    "img": {
      name: opts.css && opts.css.name || opts.name || SpritePSD.name,
      path: opts.img && opts.img.path || SpritePSD.path
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

    var outputFile = new File( getFullPath(exportData.path, exportData.name, "css") );
    outputFile.open("w");
    outputFile.writeln(output);
    outputFile.close();

    if(typeof callback === "function") {
      callback("success", exportData.path);
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
    
    var outputFile = new File( getFullPath(exportData.path, exportData.name, "png") );
    var options = new ExportOptionsSaveForWeb();
    options.format = SaveDocumentType.PNG;
    options.PNG8 = false;
    options.quality = 100;
    document.exportDocument(outputFile, ExportType.SAVEFORWEB, options);

    if(typeof callback === "function") {
      callback("success", exportData.path);
    } 
  }

  function exportPNG() {
    writePNG(SpritePSD, exportData["img"], function(status, data) {
      if(status === "success") {
        alert("PNG Exported \n File \"" + data + "\" successfully written.");
      }
    });
  }


  AutoSprite.exportImage = exportPNG;

  return AutoSprite;
};

var exportSprite = new AutoSprite(exportOpts, app.activeDocument);

exportSprite.exportCSS();
exportSprite.exportImage();
