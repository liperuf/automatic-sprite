#target photoshop

app.bringToFront();

$.evalFile($.includePath + "/autosprite/autosprite.jsx");

var exportOpts = {
  name: "sprites",
  img: {
    outputformat: "PNG",
    path: $.includePath + "/demo"
  },
  css: {
    outputformat: "CSS",
    path: $.includePath + "/demo"
  }
  
};

var exportSprite = new AutoSprite(exportOpts, app.activeDocument);

exportSprite.exportCSS();
exportSprite.exportImage();
