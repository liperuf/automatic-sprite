#target photoshop

app.bringToFront();

$.evalFile($.includePath + "/autosprite/autosprite.jsx");

var settings = {
  name: "sprites",
  path: $.includePath + "/demo",
  // img: {
  //   outputFormat: "PNG",
  //   path: $.includePath + "/demo"
  // },
  // css: {
  //   outputFormat: "CSS",
  //   path: $.includePath + "/demo"
  // }
};

var exportSprite = new AutoSprite(settings, app.activeDocument);

// exportSprite.exportCSS();
exportSprite.exportImage("PNG");
