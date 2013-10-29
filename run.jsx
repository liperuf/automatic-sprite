#target photoshop

app.bringToFront();

$.evalFile($.includePath + "/autosprite/autosprite.jsx");

var exportOpts = {
  name: "sprites",
  path: $.includePath + "/demo",
  
  img: {
    outputFormat: "PNG",
    // path: $.includePath + "/demo"
  },
  css: {
    outputFormat: "CSS",
    // path: $.includePath + "/demo"
  }
  
};

var exportSprite = new AutoSprite(exportOpts, app.activeDocument);

exportSprite.exportCSS();
exportSprite.exportImage();
