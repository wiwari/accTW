const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
// console.log(queryString);
// console.log("-------------");
// console.log("SHOW ALL URL PARAMETERS");    
// for (const [key, value] of urlParams) {
//   console.log(key + " : " + value);    
// }
// console.log("-------------");

// //default view for Shensan Canyon
// var customzoom = 10;
// var customcenter =new L.latLng(22.75, 120.75); 
// default view for Taiwan
var customzoom = 10;
var customcenter = new L.latLng(23.6, 121); //default view for Shensan Canyon

// const ios=!window.MSStream && /iPad|iPhone|iPod/.test(navigator.userAgent); //iOS detection

const regxCenter = /^(-?\d+.?\d+),(-?\d+.?\d+)$/;
if (urlParams.has('center')) //URL papameter format: ?center=lat,lng
  if (found = urlParams.get('center').match(regxCenter)) {
    customcenter = new L.latLng(found[1], found[2]);
  }

// a nice way to share to different APPs
//geo:23.458,120.267?z=8

//#map=8/23.611/120.768 refer to openstreetmap
// console.log(window.location.hash); //show hash
// https://github.com/mlevans/leaflet-hash

// URI Parameter
// https://github.com/rwev/leaflet-view-meta


// ?zoom=8&center=25,121

if (urlParams.has('zoom')) //URL papameter format: ?center=lat,lng
  if (foundz = urlParams.get('zoom').match(/^(\d*)$/)) {
    customzoom = parseInt(foundz[1], 10);
  }



const map = L.map('map', {
  contextmenu: true,
  contextmenuWidth: 140,
  contextmenuItems: [{
    //     text: '顯示座標',
    //     callback: showCoordinates
    // }, {
    text: '導航...',
    // iconCls: 'fa fa-map',
    iconCls: 'fa fa-location-arrow',
    callback: openNavigate,
  }, '-', {
    text: 'NLSC...',
    // iconCls: 'fa fa-map-o',
    icon: 'https://maps.nlsc.gov.tw/pics/icon-60x60-ios.png',
    callback: openNLSC,
  }, {
    text: '地圖瀏覽器...',
    // iconCls: 'fa fa-map-o',
    icon: 'https://twmap.happyman.idv.tw/map/icon/twmap3.jpg',
    callback: openTWMap3,
  }, {
    text: '地圖對照器...',
    iconCls: 'fa fa-map-o',
    callback: openMC,
  }, {
    text: 'Google地圖...',
    // iconCls: 'fa fa-map-o',
    icon: 'https://lh3.googleusercontent.com/V0Lu6YzAVaCVcjSJ_4Qb0mR_idw-GApETGbkodvDKTH-rpDvHuD6J84jshR_FvXdl5mJxqbIHVdebYCCbQMJNxIxRaIHYFSq6z7laA',
    callback: openGM,
  }, '-', {
    text: 'Windy...',
    // iconCls: 'fa fa-cloud',
    icon: 'https://www.windy.com/favicon.ico',
    callback: openWindy,
  }, {
    text: 'WingGuru...',
    // iconCls: 'fa fa-cloud',
    icon: 'https://www.windguru.cz/img/windguru-icon-192x192.png',
    callback: openWingGuru,
  }, {
    text: 'Meteoblue...',
    // iconCls: 'fa fa-cloud',
    icon: 'https://www.meteoblue.com/favicon.ico',
    callback: openMeteoblue,
  }, '-', {
    text: '置中',
    iconCls: 'fa fa-align-center ',
    // icon: 'images/zoom-in.png',
    callback: centerMap
    // }, {
    //     text: '複製到剪貼簿',
    //     iconCls: 'fa fa-clipboard ',
    //     // icon: 'images/zoom-in.png',
    //     callback: copyShareURLtoclipboard
  }, {
    text: '複製分享連結',
    iconCls: 'fa fa-share-alt',
    // icon: 'images/zoom-out.png',
    callback: copyShareURLtoclipboard
  }],
  zoomControl: false,
  // boxZoom: true,
  wheelPxPerZoomLevel: 200,
  wheelDebounceTime: 30,
  doubleTapDragZoom: "center",
  keyboard: true,
  bounds: ([[5, 100], [40, 140]]), //WGS DEM bound
  doubleTapDragZoomOptions: {
    reverse: true,
  },

});
// map.setView([22.75, 120.75], 10);  //default view for Shensan Canyon

map.setView(customcenter, customzoom);  //default view for Shensan Canyon

L.control.scale().addTo(map);

// if (customzoom){
//   map.setZoom(customzoom);
//   console.log("?zoom=" + customzoom);  
// }

// if (customcenter){
//    map.flyTo(customcenter);
//   //  map.setView(customcenter);
// }





// map.setView([22.75, 120.75], 10);  //default view for Shensan Canyon

// MOIOSM by Rudy
// rendering scale do not fit web application
// 
// const rudytile = L.tileLayer( 
//   'http://rudy.tile.basecamp.tw/{z}/{x}/{y}.png',  
//   {
//     attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong>' + L.Browser.retina,
//     zoomOffset: (L.Browser.retina ? -1 : 0),
//     tileSize: (L.Browser.retina ? 512 : 256),
//     minZoom: 10,
//     maxZoom: 19,
//     maxNativeZoom: 19,
//   });
// rudytile.addTo(map);


const nlscEMAPtileLowDPI = L.tileLayer(
  'https://wmts.nlsc.gov.tw/wmts/EMAP/default/EPSG:3857/{z}/{y}/{x}', // standard EMAP  
  {
    attribution: '© <strong><a href="https://maps.nlsc.gov.tw/">NLSC</a> </strong>',
    minZoom: 7, //native zoom 7-19  //note: high DPI missing zoom 8,9
    maxZoom: 9,
    maxNativeZoom: 19,
    // bounds: ([[21.89080851,122.01364715], [25.30194682,120.01663670]]), //WGS DEM bound

  });
// nlscEMAPtileLowDPI.addTo(map);
const nlscEMAPtileHighDPI = L.tileLayer(
  'https://wmts.nlsc.gov.tw/wmts/EMAP96/default/EPSG:3857/{z}/{y}/{x}', // highDPI EMAP
  {
    attribution: '© <strong><a href="https://maps.nlsc.gov.tw/">NLSC</a> </strong>',
    minZoom: 10, //native zoom 7-19  //note: high DPI missing zoom 8,9
    maxZoom: 12,
    maxNativeZoom: 19,
    // bounds: ([[21.89080851,122.01364715], [25.30194682,120.01663670]]), //WGS DEM bound
  });
// nlscEMAPtileHighDPI.addTo(map);

var nlscEMAP = L.layerGroup([nlscEMAPtileLowDPI, nlscEMAPtileHighDPI]);
nlscEMAP.addTo(map);



// //TEST WMTS failure
// const nlscEMAPwmts = L.tileLayer.wms(    
//   // 'https://wmts.nlsc.gov.tw/wmts/EMAP/default/EPSG:3857/{z}/{y}/{x}', // standard EMAP
//   'https://wmts.nlsc.gov.tw/wmts?', // highDPI EMAP
//   {
//     // crs=EPSG:3857
//     dpiMode: 7, 
//     styles:'default',
//     tileMatrixSet:  'GoogleMapsCompatible',
//     layers: 'EMAP96',
//     format: 'image/png',
//     version: '1.0.0',
//     // styles: 'default',
//     crs: L.CRS.EPSG3857,
//     attribution: '© <strong><a href="https://maps.nlsc.gov.tw/">NLSC</a> </strong>',
//     // minZoom: 7, //native zoom 7-19
//     // maxZoom: 12,
//     // maxNativeZoom: 19,      
//   });
// nlscEMAPwmts.addTo(map);

const happymantile = L.tileLayer(
  'https://tile.happyman.idv.tw/map/moi_osm/{z}/{x}/{y}.png',
  {
    attribution: '© <strong><a href="https://map.happyman.idv.tw/~mountain/twmap3/">地圖瀏覽器</a> </strong> ',
    minZoom: 16, //native zoom 10~17
    // maxZoom: 19,
    maxZoom: 16,
    maxNativeZoom: 16,
    // zoomOffset: (L.Browser.retina ? -1 : 0),
    // tileSize: (L.Browser.retina ? 512 : 256),
    bounds: ([[21.89377500, 118.14262778], [25.30147222, 122.00965000]]), //WGS DEM bound 2022TW,PH,KM
  });
happymantile.addTo(map);

const nlscB100000 = L.tileLayer(
  'https://wmts.nlsc.gov.tw/wmts/B100000/default/EPSG:3857/{z}/{y}/{x}',
  {
    attribution: '© <strong><a href="https://maps.nlsc.gov.tw/">NLSC</a> </strong>',
    minZoom: 13, //native zoom 10~17
    // maxZoom: 19,
    maxZoom: 13,
    maxNativeZoom: 13,
    // zoomOffset: (L.Browser.retina ? -1 : 0),
    // tileSize: (L.Browser.retina ? 512 : 256),
    bounds: ([[21.89377500, 118.14262778], [25.30147222, 122.00965000]]), //WGS DEM bound 2022TW,PH,KM
  });


const nlscB50000 = L.tileLayer(
  'https://wmts.nlsc.gov.tw/wmts/B50000/default/EPSG:3857/{z}/{y}/{x}',
  {
    attribution: '© <strong><a href="https://maps.nlsc.gov.tw/">NLSC</a> </strong>',
    minZoom: 14, //native zoom 10~17
    // maxZoom: 19,
    maxZoom: 14,
    maxNativeZoom: 14,
    // zoomOffset: (L.Browser.retina ? -1 : 0),
    // tileSize: (L.Browser.retina ? 512 : 256),
    bounds: ([[21.89377500, 118.14262778], [25.30147222, 122.00965000]]), //WGS DEM bound 2022TW,PH,KM
  });


const nlscB25000 = L.tileLayer(
  'https://wmts.nlsc.gov.tw/wmts/B25000/default/EPSG:3857/{z}/{y}/{x}',
  {
    attribution: '© <strong><a href="https://maps.nlsc.gov.tw/">NLSC</a> </strong>',
    minZoom: 15, //native zoom 10~17
    // maxZoom: 19,
    maxZoom: 15,
    maxNativeZoom: 15,
    bounds: ([[21.89377500, 118.14262778], [25.30147222, 122.00965000]]), //WGS DEM bound 2022TW,PH,KM
  });
 
  var nlscBtopo = L.layerGroup([nlscB100000,nlscB50000,nlscB25000]);
  nlscBtopo.addTo(map);



const nlscphoto2tile = L.tileLayer(
  'https://wmts.nlsc.gov.tw/wmts/PHOTO2/default/EPSG:3857/{z}/{y}/{x}',
  {
    attribution: '© <strong><a href="https://maps.nlsc.gov.tw/">NLSC</a> </strong>',
    minZoom: 17, //native zoom 7~19 
    maxZoom: 20,
    maxNativeZoom: 19,
    bounds: ([[21.89377500, 118.14262778], [25.30147222, 122.00965000]]), //WGS DEM bound 2022TW,PH,KM
  });
nlscphoto2tile.addTo(map);

const MOEACGS = L.tileLayer(
  'https://geomap.gsmma.gov.tw/api/Tile/v1/getTile.cfm?layer=CGS_CGS_MAP&z={z}&x={x}&y={y}',
  {
    // old source: https://gis3.moeacgs.gov.tw/api/Tile/v1/oas/#/default/get_getTile_cfm
    // source: https://geomap.gsmma.gov.tw/gwh/gsb97-1/sys8a/t3/index1.cfm
    attribution: '© <strong><a href="https://geomap.gsmma.gov.tw">GSMMA</a> </strong>',
    minZoom: 7,
    maxZoom: 20,
    minNativeZoom: 1,
    maxNativeZoom: 17,
    opacity: 0.45,
    // interactive: true,  
    bounds: ([[21.89377500, 118.14262778], [25.30147222, 122.00965000]]), //WGS DEM bound 2022TW,PH,KM
  });
// MOEACGS.addTo(map);



// var popupMOEACGS = L.popup()
//   .setLatLng(map.getCenter())
//   .setContent('<p>Hello world!<br />This is a nice popup.</p>')
//   .openOn(MOEACGS);




MOEACGS.on("add", eadd);
function eadd(e) {
  map.on("click", queryMOEACGS);
  // gtag('event', 'layerOn', {
  //   'event_category': 'layer',
  //   'event_label': 'MOEACGS',
  // });
}
MOEACGS.on("remove", eremove);
function eremove(e) {
  map.closePopup();
  map.off("click", queryMOEACGS);
  // gtag('event', 'layerOff', {
  //   'event_category': 'layer',
  //   'event_label': 'MOEACGS',
  // });
}

const nlscLiDAR2019 = L.tileLayer(
  'https://wmts.nlsc.gov.tw/wmts/LiDAR2019/default/EPSG:3857/{z}/{y}/{x}',
  {
    attribution: '© <strong><a href="https://maps.nlsc.gov.tw/">NLSC</a> </strong>',
    minZoom: 17, //native zoom 9-20, set 17 as default 
    maxZoom: 21,
    maxNativeZoom: 20,
    bounds: ([[23.923255, 120.482868], [24.498475, 121.508168]]),
  });
// nlscLiDAR2019.addTo(map);
const nlscLiDAR2020 = L.tileLayer(
  'https://wmts.nlsc.gov.tw/wmts/LiDAR2020/default/EPSG:3857/{z}/{y}/{x}',
  {
    attribution: '© <strong><a href="https://maps.nlsc.gov.tw/">NLSC</a> </strong>',
    minZoom: 17, //native zoom 9-20, set 17 as default 
    maxZoom: 21,
    maxNativeZoom: 20,
    bounds: ([[22.723201, 120.857965], [23.94844, 121.133177]]),
  });
// nlscLiDAR2020.addTo(map);

const nlscLiDAR2021 = L.tileLayer(
  'https://wmts.nlsc.gov.tw/wmts/LiDAR2021/default/EPSG:3857/{z}/{y}/{x}',
  {
    attribution: '© <strong><a href="https://maps.nlsc.gov.tw/">NLSC</a> </strong>',
    minZoom: 17, //native zoom 9-20, set 17 as default 
    maxZoom: 21,
    maxNativeZoom: 20,
    bounds: ([[24.373243432, 120.557946056], [25.298465415, 121.558227538]]),
  });
// nlscLiDAR2021.addTo(map);

const nlscLiDAR2022 = L.tileLayer(
  'https://wmts.nlsc.gov.tw/wmts/LiDAR2022/default/EPSG:3857/{z}/{y}/{x}',
  {
    attribution: '© <strong><a href="https://maps.nlsc.gov.tw/">NLSC</a> </strong>',
    minZoom: 17, //native zoom 9-20, set 17 as default 
    maxZoom: 21,
    maxNativeZoom: 20,
    bounds: ([[23.523252524, 121.282920517], [25.323528948, 122.008377377]]),
  });
// nlscLiDAR2022.addTo(map);
23.523252524,121.282920517
var nlscLiDAR = L.layerGroup([nlscLiDAR2019, nlscLiDAR2020,nlscLiDAR2021,nlscLiDAR2022],
  {
      attribution: '© <strong><a href="https://maps.nlsc.gov.tw/">NLSC</a> </strong>',
      minZoom: 17, //native zoom 9-20, set 17 as default 
      maxZoom: 21,
      maxNativeZoom: 20,
  });
// nlscLiDAR.addTo(map);

const happymanATIS = L.tileLayer(
  'https://tile.happyman.idv.tw/map/atis/{z}/{x}/{y}.png',
  {
    attribution: '© <strong><a href="https://map.happyman.idv.tw/~mountain/twmap3/">地圖瀏覽器</a> </strong> ',
    minZoom: 17, //native zoom 5~22
    maxZoom: 21,
    maxNativeZoom: 21,


  });
  // happymanATIS.addTo(map);

const happymanGPXoverlay = L.tileLayer(
  'https://tile.happyman.idv.tw/map/gpxtrack/{z}/{x}/{y}.png',
  {
    attribution: '© <strong><a href="https://map.happyman.idv.tw/~mountain/twmap3/">地圖瀏覽器</a> </strong> ',
    minZoom: 14, //native zoom 10~19
    maxZoom: 18,
    maxNativeZoom: 19,
    zoomOffset: -1,
    tileSize: 512,
    opacity: 0.4,

  });
happymanGPXoverlay.addTo(map);

const happymanBNoverlay = L.tileLayer(
  'https://tile.happyman.idv.tw/map/rudy_bn/{z}/{x}/{y}.png',
  {
    attribution: '© <strong><a href="https://map.happyman.idv.tw/~mountain/twmap3/">地圖瀏覽器</a> </strong> ',
    minZoom: 17, //native zoom 8-22
    maxZoom: 18,
    maxNativeZoom: 22,
    zoomOffset: -1,
    tileSize: 512,
    opacity: 0.6,
    bounds: ([[21.89377500, 118.14262778], [25.30147222, 122.00965000]]), //WGS DEM bound 2022TW,PH,KM
  });
happymanBNoverlay.addTo(map);


const nlscEMAPoverlay = L.tileLayer(
  'https://wmts.nlsc.gov.tw/wmts/EMAP12/default/EPSG:3857/{z}/{y}/{x}',
  {
    attribution: '© <strong><a href="https://maps.nlsc.gov.tw/">NLSC</a> </strong>',
    minZoom: 16, //native zoom 9-19
    maxZoom: 19,
    maxNativeZoom: 19,
    bounds: ([[21.89377500, 118.14262778], [25.30147222, 122.00965000]]), //WGS DEM bound 2022TW,PH,KM
  });
nlscEMAPoverlay.addTo(map);



const dtmTW = L.tileLayer.colorPicker("https://raw.githubusercontent.com/wiwari/accTW/3c09f5b8746b56c037ac78cf7b8d53e33c93460e/dist/dem/{z}/{x}/{y}.png", {  //GITHUB exact commit
  tms: false, // CLI generation required    
  crs: L.CRS.EPSG3857,
  zoomOffset: 0, //DO NOT set zoom offset avoiding RGB smmothing issue.
  tileSize: 256,
  // zoomOffset: -1,
  // tileSize: 512,
  opacity: 0,
  minZoom: 7, //min 10
  // maxZoom: 14,
  minNativeZoom: 7,
  maxNativeZoom: 14,
  // bounds: ([[21.89080851, 122.01364715], [25.30194682, 120.01663670]]), //WGS TW DEM bound
  bounds: ([[21.89377500, 118.14262778], [25.30147222, 122.00965000]]), //WGS DEM bound 2022TW,PH,KM
}).addTo(map);


// ------------------
// DOC RGBterrain tiles generation https://github.com/syncpoint/terrain-rgb
// ------------------

// const catchment = L.tileLayer.colorPicker("wsRGBAtiles/{z}/{x}/{y}.png", { //local
// const catchment = L.tileLayer.colorPicker("https://cdn.jsdelivr.net/gh/wiwari/accTW@tiles/dist/{z}/{x}/{y}.png", { //CDN
// const catchment = L.tileLayer.colorPicker("https://cdn.jsdelivr.net/gh/wiwari/accTW@3c09f5b8746b56c037ac78cf7b8d53e33c93460e/dist/acc/{z}/{x}/{y}.png", {  //CDN exact commit
// const catchment = L.tileLayer.colorPicker("https://raw.githubusercontent.com/wiwari/accTW/tiles/dist/{z}/{x}/{y}.png", {  //GITHUB
const catchment = L.tileLayer.colorPicker("https://raw.githubusercontent.com/wiwari/accTW/3c09f5b8746b56c037ac78cf7b8d53e33c93460e/dist/acc/{z}/{x}/{y}.png", {  //GITHUB exact commit
  // attribution: '&copy; BASIN',
  tms: false, // CLI generation required    
  crs: L.CRS.EPSG3857,
  zoomOffset: 0, //DO NOT set zoom offset avoiding RGB smmothing issue.
  tileSize: 256,
  // zoomOffset: -1,
  // tileSize: 512,
  opacity: 0.0,
  minZoom: 7, //min 10
  // maxZoom: 14,
  minNativeZoom: 7,
  maxNativeZoom: 14,
  // bounds: ([[21.89080851, 122.01364715], [25.30194682, 120.01663670]]), //WGS DEM bound 2020TW
  //
  // TW:  120d 0'59.64"E - 122d 0'34.74"E , 21d53'37.59"N -  25d18' 5.30"N      // 120.01656667 - 122.00965000 , 21.89377500 - 25.30147222
  // bounds: ([[21.89377500, 120.01656667], [25.30147222, 122.00965000]]), //WGS DEM bound 2022TW
  // PH:   119d18'26.57"E - 119d44' 5.26"E ,  23d10'19.13"N -  23d47'58.11"N //   119.30738056 - 119.73479444 ,  23.17198056 - 23.79947500
  // bounds: ([[23.17198056, 119.30738056], [23.79947500, 119.73479444]]), //WGS DEM bound 2022PH
  // KM:   118d 8'33.46"E - 118d30'43.44"E,  24d22'35.51"N -  24d32' 1.69"N //    118.14262778 - 118.51206667 ,   24.37653056 - 24.53380278
  // bounds: ([[24.37653056, 118.14262778], [24.53380278, 118.51206667]]), //WGS DEM bound 2022KM

  // TW, PH, KM 
  bounds: ([[21.89377500, 118.14262778], [25.30147222, 122.00965000]]), //WGS DEM bound 2022TW,PH,KM
}).addTo(map);

// test show basin size
const wscircle = L.circle([22.75, 120.75], { radius: 2000, dashArray: '2, 6', interactive: false, fillOpacity: 0, });
basinsizeTP = L.tooltip({ offset: L.point(30, -30), opacity: 1 });
wscircle.bindTooltip(basinsizeTP);
wscircle.setTooltipContent("集水區????km²");
wscircle.closeTooltip();

// wscircle.addTo(map);

function lookupvalue(event) {
  //--- Display Color
  // var a = catchment.getColor(event.latlng);
  // if (a !== null) {
  //   var hex = "#" + (0x1000000 + (a[0] << 16) + (a[1] << 8) + a[2]).toString(16).substr(1);
  //   var tmpl = "<b style='background:@;color:black;'>@</b>";
  //   if (Math.min(a[0], a[1], a[2]) < 0x40) tmpl = tmpl.replace("black", "white");
  //   map.attributionControl.setPrefix(tmpl.replace(/@/g, hex));
  // } else {
  //   map.attributionControl.setPrefix("unavailable");
  // }
  const lookupLatLng = L.Browser.mobile ? map.getCenter() : event.latlng;

  wscircle.setLatLng(lookupLatLng);

  // calculate action catchment range
  let shownMin = 65536.;
  let shownMax = 0.;
  if(map.hasLayer(streams)){
    shownMin = Math.min (shownMin,0.1 * Math.pow (streams.options.uniforms.uWaterThresholdZoomStep, streams.options.uniforms.uWaterThresholdZoomAtTenthKmsq - map.getZoom()));
    shownMax = 9999.;
  }

  if(map.hasLayer(streamsRangeHightlight)){
    shownMin = Math.min (shownMin, highlightRangeCtrl.getRange()[0]);
    shownMax = Math.max (shownMax, highlightRangeCtrl.getRange()[1]);
  }

  shownMin = Math.max(0.1, shownMin);
  

  //---- Get catchment acc
  var accPix = catchment.getColor(lookupLatLng);
  var accVal = NaN;
  if (accPix !== null) {
    var accVal = (accPix[0] << 16) + (accPix[1] << 8) + accPix[2];
    // h = h === 0x800000 ? NaN : (h > 0x800000 ? h - 0x1000000 : h) / 100;
    accVal = accVal === 0x800000 ? NaN : (accVal > 0x800000 ? accVal - 0x1000000 : accVal) * 0.1 - 10000.0; //convension base -10000, internal 0.1 
    if (accVal < 0.1 || isNaN(accVal) || accVal > shownMax || accVal <shownMin
        // (map.hasLayer(streamsRangeHightlight) && (accVal < highlightRangeCtrl.getRange()[0]  || accVal >highlightRangeCtrl.getRange()[1] )) ||
        // (map.hasLayer(streams) && (accVal < 0.1 * Math.pow (streams.options.uniforms.uWaterThresholdZoomStep, streams.options.uniforms.uWaterThresholdZoomAtTenthKmsq - map.getZoom()) ))
        // waterThreshold = 0.1 * pow(uWaterThresholdZoomStep, (uWaterThresholdZoomAtTenthKmsq - uTileCoords.z - uExtraZoom))
      ) 
    {
      wscircle.closeTooltip();
      wscircle.setStyle({ opacity: 0 });
    } else {
      wscircle.openTooltip();
      wscircle.setStyle({ opacity: 1 });
    }
    if ((accVal) >= 0.0) {
      wscircle.setRadius(1000.0 * Math.sqrt(accVal / Math.PI));
    }
  }else{
    wscircle.closeTooltip();
  }

  //---- Get DTM
  var dtmPix = dtmTW.getColor(lookupLatLng);
  var dtmVal = NaN;
  if (dtmPix !== null) {
    var dtmVal = (dtmPix[0] << 16) + (dtmPix[1] << 8) + dtmPix[2];
    // h = h === 0x800000 ? NaN : (h > 0x800000 ? h - 0x1000000 : h) / 100;
    dtmVal = dtmVal === 0x800000 ? NaN : (dtmVal > 0x800000 ? dtmVal - 0x1000000 : dtmVal) * 0.1 - 10000.0; //convension base -10000, internal 0.1
  }

  accinfo = (isNaN(accVal) ? "" : //no raster data
    (accVal < 0) ? "" : //nodata in raster
      (accVal < 10) ? "💧" + accVal.toFixed(1) + "<sub>km²</sub>" : //nodata in raster    
        "💧" + accVal.toFixed(0) + "<sub>km²</sub>");
  accinfo = "<div>" + accinfo + "</div>";

  dtminfo = (isNaN(dtmVal) ? "" : //no raster data
    "↕️" + dtmVal.toFixed(0) + "<sub>m</sub>");
  dtminfo = "<div>" + dtminfo + "</div>";

  promptinfo = accinfo + dtminfo;
  wscircle.setTooltipContent(promptinfo);
  // map.attributionControl.setPrefix(promptinfo);  
}

// geo:23.458,120.267?z=8 

read_catchment = L.featureGroup();
read_catchment.addLayer(catchment);
// read_catchment.addLayer(wscircle);

read_catchment.on("add", wsLookupOn);
read_catchment.on("remove ", wsLookupOff);
map.on("zoomend", zoomend_check);
map.on("zoomstart", zoomstart_check);


function zoomend_check(e) {
  // streams.setUniform('uWaterThreshold', (0.1 * Math.pow(3,15-map.getZoom()))); //best fitting visually
  // streams.setUniform('uWaterThreshold', (0.1 * Math.pow(4,14-map.getZoom()))); //experimental make no uExtraZoom while zoom larger than maxNativeZoom
  // streams.reRender();
  if (map.getZoom() >= streams.options.maxNativeZoom) {
    streams.setUniform('uExtraZoom', map.getZoom() - streams.options.maxNativeZoom);
    streams.redraw(); //workaround alpha issue in tilelayer.gl while over zoomed
    streamsRangeHightlight.setUniform('uExtraZoom', map.getZoom() - streamsRangeHightlight.options.maxNativeZoom);
    streamsRangeHightlight.redraw(); //workaround alpha issue in tilelayer.gl while over zoomed
  }

  if (map.getZoom() >= 8 && map.getZoom() <= 18) {
    lyctrl.addOverlay(read_catchment, "集水面積🔎");
    read_catchment.addLayer(wscircle);    
  } 
  
  highlightRangeCtrl._rangestring.innerHTML= highlightRangeCtrl.getSliderLabel(highlightRangeCtrl.getRange());
  highlightRangeCtrl.updateWavelengthLabel() ; 

}
function zoomstart_check(e) {
  if (map.getZoom() >= 8 && map.getZoom() <= 18) {
    lyctrl.removeLayer(read_catchment);
    read_catchment.removeLayer(wscircle);
  }
}

// map.on("zoomend",wsLookupOn);
// map.on("zoomstart",wsLookupOff);

// TODO外連連結
// https://image.afasi.gov.tw/map_searching/map.aspx //農林航照

proj4.defs([
  [
    'EPSG:4326',
    '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees'],
  [
    'EPSG:3826',
    '+title=TWD97 TM2+proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=GRS80 +units=公尺 +no_defs'
  ],
  [
    'EPSG:3828',
    // '+proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=aust_SA' //
    '+proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=aust_SA +towgs84=-752,-358,-179,-0.0000011698,0.0000018398,0.0000009822,0.00002329 +units=m +no_defs'
  ],
  [
    'EPSG:3821',
    '+proj=longlat +ellps=aust_SA +no_defs'
  ],
  [
    'EPSG:3824',
    '+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs'
  ]
]);
var EPSG4326 = new proj4.Proj('EPSG:4326');//WGS84
var EPSG3826 = new proj4.Proj('EPSG:3826');//TWD97 121分帶  
var EPSG3821 = new proj4.Proj('EPSG:3821');//TWD67 經緯度
var EPSG3824 = new proj4.Proj('EPSG:3824');//TWD97 經緯度


function queryMOEACGS(e) {
  // Todo 地質查詢 ================================
  // https://gis3.moeacgs.gov.tw/api/Tile/v1/oas/#/default/get_getTooltip_cfm
  // 地質資訊 https://gis3.moeacgs.gov.tw/api/Tile/v1/getTooltip.cfm?layer=TYPE3&z=12&x=309758&y=2730559
  // (EPSG:3826)
  // zoom: 1-17

  //4326轉3826 (經緯度轉TWD97)
  // var tw97 = proj4(EPSG4326, EPSG3826, [e.latlng.lng, e.latlng.lat]);
  // console.log(tw97[0],  tw97[1]);

  const queryPointIn3857 = L.Projection.SphericalMercator.project(e.latlng)
  // const queryzoom = (map.getZoom() > 17) ? 17 : map.getZoom();

  const queryscale = 577791.7098721985 * Math.pow(2 , ( 10 - map.getZoom()));   
  // in gsmma zoom to scale default , z=10 , scale=  577791.7098721985

  //  source :　　　https://geomap.gsmma.gov.tw/gwh/gsb97-1/sys8a/t3/index1.cfm
  //  other API:         https://www.geologycloud.tw/geohome/DataService/swagger/api
  //  above new URL have CORS issue , but https://gis3.moeacgs.gov.tw/api/Tile/v1/getTooltip.cfm?layer=TYPE3&srs=EPSG%3A3826&z=12&x=309758&y=2730559
  fetch("https://geomap.gsmma.gov.tw/api/Tile/v2/getTooltip.cfm?layer=TYPE4&srs=3857&x=" + queryPointIn3857.x + "&y=" + queryPointIn3857.y + "&scale=" + queryscale ,
    {
      signal: AbortSignal.timeout(5000),
    })
    .then((response) => {
      return response.json();
    })
    .then(data => {

      var cleandata = data['tooltip'];
      cleandata = cleandata.replace(/構造名稱：/g, "");
      cleandata = cleandata.replace(/構造名稱：\s*\n/g, "");
      cleandata = cleandata.replace(/構造描述：/g, "");
      cleandata = cleandata.replace(/地質年代：/g, "");
      cleandata = cleandata.replace(/地層名稱：/g, "");
      cleandata = cleandata.replace(/圖例描述：/g, "");
      cleandata = cleandata.replace(/斷層名稱：/g, "");
      cleandata = cleandata.replace(/斷層描述：/g, "");
      cleandata = cleandata.replace(/地層組成：/g, "");
      cleandata = cleandata.replace(/(資料來源：\s*一百萬分之一臺灣區域地質圖數值檔)[,-](\S*)[,-](\d\d\d\d)/g, "1M地質圖, $3");
      cleandata = cleandata.replace(/(資料來源：\s*五十萬分之一臺灣區域地質圖數值檔)[,-](\S*)[,-](\d\d\d\d)/g, "50萬地質圖, $3");
      cleandata = cleandata.replace(/(資料來源：五十萬分之一臺灣區域地質圖數值檔-臺灣)/g, "50萬地質圖");
      cleandata = cleandata.replace(/(資料來源：\s*二十五萬分之一臺灣區域地質圖數值檔)[,-](\S*)[,-](\d\d\d\d)/g, "25萬地質圖, $3");
      cleandata = cleandata.replace(/(資料來源：\s*二十五萬分之一臺灣區域地質圖數值檔-臺灣)/g, "25萬地質圖");
      cleandata = cleandata.replace(/(資料來源：\s*五萬分之一臺灣區域地質圖數值檔)[,-](\S*)[,-](\d\d\d\d)/g, "5萬地質圖-$2, $3");
      cleandata = cleandata.replace(/([^\n]+)/g, "<li>$1</li>");
      // cleandata = cleandata.replace(/([^\n]+)/g,"$1");
      cleandata = cleandata.replace(/\s+/g, " ");
      cleandata = cleandata.replace(/(\S)\(/g, "$1 (");
      cleandata = cleandata.replace(/\(/g, "<br />(");
      cleandata = cleandata.replace(/\s+\)/g, ")");
      cleandata = cleandata.replace(/，/g, "、");
      if (cleandata != "") {
        L.popup({ className: "moeacgs-div-span", MOEACGS })
          .setLatLng(e.latlng)
          .setContent("<ul>" + cleandata + "</ul>")
          .openOn(map);
      }
      gtag('event', 'queryMOEACGS', {
        'event_category': 'layer',
        'event_label': 'MOEACGS',
      });
    })
    .catch((err) => {
      // console.log('rejected: ', err);
      if (err.name === "TimeoutError") {
        console.error("Timeout: It took more than 15 seconds to get the result!");
      }else {
          // A network error, or some other problem.
          console.error("Error: type: ${err.name}, message: ${err.message}");
      }
    });

  // console.log();
  // TEST ====================


  // MOEACGS.bindTooltip("ABC");
  // MOEACGS.openTooltip();
  // MOEACGS.setTooltipContent("XXX");
}
// map.on("click", queryMOEACGS);


// map.on("click", async e => {  
//   // // === URL queryString test
//   // const queryString = window.location.search;
//   // const urlParams = new URLSearchParams(queryString);  
//   // console.log(queryString);
//   // console.log("-------------");
//   // if(urlParams.has('center'))
//   //   customcenter = new L.latLng(urlParams.get('center').split(','));
//   //   console.log(customcenter);
//   //   // map.flyTo();
//   // for (const [key, value] of urlParams) {
//   //   console.log(key + " : " + value);    
//   // } 

// })

// // Configure leaflet-topography seems a better way to work without rendering
// L.Topography.configure({
//   tilesUrl: "wsRGBAtiles/{z}/{x}/{y}.png",
// });
// // ------------------------------------------ getTopography test for BASIn catchment
// map.on("click", async e => {
//   // const { elevation, slope, aspect } = await L.Topography.getTopography(e.latlng);  // a clever way to retrive elevation without downloading all data
//   const { elevation, slope, aspect } = await L.Topography.getTopography(e.latlng);
//   if (elevation !== null) {
//     console.log(elevation, slope, aspect);
//   }else{    
//     console.log("NoData");
//   }
// })

// ==== TopoLayer in leaflet-topography example, lack of alpha and nodata value support
// const elevationLayer = new L.Topography.TopoLayer({   
//   // topotype: 'elevation', 
//   tilesUrl: "wsRGBAtiles/{z}/{x}/{y}.png",
//   // tilesUrl: "terrain-rgb-Tiles/{z}/{x}/{y}.png",
//   // token: 'your_mapbox_token'
//   // customization: <customization_options>
//   // topotype: 'elevation',
//   topotype: 'slope',
//   // customization: {

//   //   colors: [ '#000000', '#000000', '#000020', '#000040', '#000080', '#0000B0', '#0000F0', '#0000FF'],
//   //   breakpoints: [-1, 0, 5, 30, 100, 300, 3000,100000],
//   // },

//   minZoom: 10, //min 10
//   // maxZoom: 14,
//   maxNativeZoom: 14,
//   // zoomOffset: -1,
//   // tileSize: 512,
//   bounds: ([[21.89080851,122.01364715], [25.30194682,120.01663670]]), //WGS

// });
// elevationLayer.addTo(map);



var umbrellaIcon = L.divIcon({
  className: 'container-sm ',
  html: '<span class="btn-sm btn-primary"> <i class="fa fa-umbrella text-light" aria-hidden="true"></i></span>'
}
);

var levelupIcon = L.divIcon({
  className: 'container-sm ',
  html: '<span class="btn-sm btn-primary"> <i class="fa fa-level-up text-light" aria-hidden="true"></i></span>'
}
);


var folderIcon = L.divIcon({
  className: 'container-sm ',
  html: '<span class="btn-sm btn-primary"> <i class="fa fa-folder text-light" aria-hidden="true"></i></span>'
}
);

var cameraIcon = L.divIcon({
  className: 'container-sm ',
  html: '<span class="btn-sm btn-primary"> <i class="fa fa-camera text-light" aria-hidden="true"></i></span>'
}
);

var myparkIcon = L.divIcon({
  className: 'my-div-icon',
  html: '<span class="my-div-span"> 🅿 </span>'
}
);
var parkIcon = L.icon({
  iconUrl: 'icon_PARKING.png',
  // shadowUrl: 'leaf-shadow.png',
  iconSize: [20, 20], // size of the icon
  // shadowSize:   [50, 64], // size of the shadow
  iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
  // shadowAnchor: [4, 62],  // the same for the shadow
  popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});


const lyctrl = L.control.layers({
  "正射影像": nlscphoto2tile, "光達影像": nlscLiDAR, "農航空拍": happymanATIS, 
}, {
  "地質查詢🪨": MOEACGS, "產生器<sub>gpx</sub>🚶": happymanGPXoverlay, "產生器<sub>BN</sub>": happymanBNoverlay, "nlsc透明": nlscEMAPoverlay,
  //"集水區":read_catchment,
}).addTo(map);

const  lyctrl2 = L.control.layers({});
lyctrl2.addTo(map);


map.on("preclick", hidelyctrl);
function hidelyctrl(e){
  lyctrl.collapse();
}

function wsLookupOff(event) {

  if (L.Browser.mobile) {
    map.off("move", lookupvalue);
  } else {
    map.off("mousemove", lookupvalue);
  }
  wscircle.closeTooltip();
  // read_catchment.removeFrom(map);  
  // wscircle.closenTooltip();

}

function wsLookupOn(event) {
  if (L.Browser.mobile) {
    map.on("move", lookupvalue);
  } else {
    map.on("mousemove", lookupvalue);
  }
  // read_catchment.addTo(map);  
  // wscircle.openTooltip();    
}
read_catchment.addTo(map);
// wsLookupOn(null);


const ob_items = ["水位","流量","含砂量","流速"];

const waterlevelLayer = L.geoJSON([], {
  pointToLayer: function (geoJsonPoint, latlng) {
    return L.marker(latlng, { icon: levelupIcon });
  }
}).bindPopup(function (layer) {

  gtag('event', 'click', {
    'event_category': 'waterlevel',
    'event_label': "station: " + layer.feature.properties.name,
  });

  eDate = new Date();
  sWDate = new Date(eDate.valueOf() - 7 * 24 * 60 * 60 * 1000);
  sMDate = new Date(eDate.valueOf() - 31 * 24 * 60 * 60 * 1000);
  sQDate = new Date(eDate.valueOf() - 92 * 24 * 60 * 60 * 1000);
  sYDate = new Date(eDate.valueOf() - 366 * 24 * 60 * 60 * 1000);

  eDate_str = eDate.getFullYear() + "/" + (eDate.getMonth() + 1) + "/" + eDate.getDate();
  sWDate_str = sWDate.getFullYear() + "/" + (sWDate.getMonth() + 1) + "/" + sWDate.getDate();
  sMDate_str = sMDate.getFullYear() + "/" + (sMDate.getMonth() + 1) + "/" + sMDate.getDate();
  sQDate_str = sQDate.getFullYear() + "/" + (sQDate.getMonth() + 1) + "/" + sQDate.getDate();
  sYDate_str = sYDate.getFullYear() + "/" + (sYDate.getMonth() + 1) + "/" + sYDate.getDate();

  wl_url_w = "https://gweb.wra.gov.tw/HydroInfoMobile/hichart?stno=" + layer.feature.properties.id + "&category=rtLE&sdate=" + sWDate_str + "&edate=" + eDate_str;
  wl_url_m = "https://gweb.wra.gov.tw/HydroInfoMobile/hichart?stno=" + layer.feature.properties.id + "&category=rtLE&sdate=" + sMDate_str + "&edate=" + eDate_str;
  wl_url_q = "https://gweb.wra.gov.tw/HydroInfoMobile/hichart?stno=" + layer.feature.properties.id + "&category=rtLE&sdate=" + sQDate_str + "&edate=" + eDate_str;
  wl_url_y = "https://gweb.wra.gov.tw/HydroInfoMobile/hichart?stno=" + layer.feature.properties.id + "&category=rtLE&sdate=" + sYDate_str + "&edate=" + eDate_str;

  const btmUriList = {
    "週" : wl_url_w, 
    "月" : wl_url_m,
    "季" : wl_url_q,
    "年" : wl_url_y,
  
  };
  
  // ob_item_str=layer.feature.properties.ObervationItems.replace(/0/,ob_items[0]);
  // ob_item_str=ob_item_str.replace(/1/,ob_items[1]);
  // ob_item_str=ob_item_str.replace(/2/,ob_items[2]);

  // wl_url_ra = "https://gweb.wra.gov.tw/HydroInfo/StDataInfo/StDataInfo?RA&" +  layer.feature.properties.id ;//歷年雨量
  // wl_url_di = "https://gweb.wra.gov.tw/HydroInfo/StDataInfo/StDataInfo?DI&" + layer.feature.properties.id; //歷年流量
  wl_url_le = "https://gweb.wra.gov.tw/HydroInfo/StDataInfo/StDataInfo?LE&" + layer.feature.properties.id; //歷年水位

  // ObervationItems 水位,流量,含砂量,流速　/0,1,2,4
  // wlrtstr="";
  // if(realtime_waterlevel.hasOwnProperty(layer.feature.properties.id))
  //   wlrtstr=
  //   "<sub>"+realtime_waterlevel[layer.feature.properties.id].RecordTime +"</sub><br />"
  //   + realtime_waterlevel[layer.feature.properties.id].WaterLevel + "m<br />"
  //   ;
  const popupStationContainer = L.DomUtil.create('div',"container-sm");

  popupStationContainer.appendChild(document.createTextNode(layer.feature.properties.name));
  popupStationContainer.appendChild(document.createTextNode(" : "));
  popupStationContainer.appendChild(document.createTextNode(layer.feature.properties.river));
  L.DomUtil.create('br','',popupStationContainer);

  popupStationContainer.appendChild(document.createTextNode("即時："));

  for (const key of Object.keys(btmUriList)){ 
    const linkElement=L.DomUtil.create('a','btn btn-outline-primary btn-sm',popupStationContainer);
    linkElement.text=key;
    linkElement.href=btmUriList[key];
    linkElement.target='_blank';
    L.DomEvent.disableClickPropagation(linkElement);
    L.DomEvent.on(linkElement, 'click', function(e) {  
      e.preventDefault();
      openDialog(linkElement.href);
    });
  }

  L.DomUtil.create('br','',popupStationContainer);

  let his_str="";
  if (layer.feature.properties.ObervationItems.match("0"))
    his_str += "水位";    
  if (layer.feature.properties.ObervationItems.match("1"))
    his_str += "流量";    

  if (his_str){
    popupStationContainer.appendChild(document.createTextNode("歷史："));
    const linkElement=L.DomUtil.create('a','btn btn-outline-primary btn-sm',popupStationContainer);
    linkElement.text=his_str;
    linkElement.href=wl_url_le;
    linkElement.target='_blank';
    L.DomEvent.disableClickPropagation(linkElement);
    L.DomEvent.on(linkElement, 'click', function(e) {  
      e.preventDefault();
      openDialog(linkElement.href);
    });
  }

  return popupStationContainer; 

});

waterlevelLayer.on('add',
  function(){
    if (map.getZoom() <=9) map.setZoom(10);  
    read_catchment.remove();
  }
);

lyctrl.addOverlay(waterlevelLayer, '水位<span class="btn-sm"><i class="fa fa-level-up text-black-50" aria-hidden="true"></i></span>');


  // wl_ly.addTo(map);

  // Get realtime waterlevel data
  // https://data.wra.gov.tw/Service/OpenData.aspx?format=json&id=2D09DB8B-6A1B-485E-88B5-923A462F475C 
  // revised URL             https://data.wra.gov.tw/OpenAPI/api/OpenData/2D09DB8B-6A1B-485E-88B5-923A462F475C/Data
  var realtime_waterlevel={};  

fetch("https://data.wra.gov.tw/OpenAPI/api/OpenData/2D09DB8B-6A1B-485E-88B5-923A462F475C/Data")
  .then((response) => {
    return response.json();
  })
  .then(data => {
    wlrt_obj = data;
    wlrt_obj.responseData.forEach(element => {
      realtime_waterlevel[element.ST_NO] = { 'RecordTime': element.RecordTime, 'WaterLevel': element.WaterLevel };
    });
  })
  .catch((err) => {
    console.log('rejected: ', err);
  });


    // console.log(realtime_waterlevel);
  
    // Get waterlevel station information
  function readWLStatGeoJON() {    
    // Query Station of Water Level  //https://data.wra.gov.tw/Service/OpenData.aspx?format=json&id=28E06316-FE39-40E2-8C35-7BF070FD8697      //not supporting CORS
    // https://api.allorigins.win/get?url=https%3A//data.wra.gov.tw/Service/OpenData.aspx%3Fformat%3Djson%26id%3D28E06316-FE39-40E2-8C35-7BF070FD8697&callback=?
    fetch("wra/28E06316-FE39-40E2-8C35-7BF070FD8697.json")
    .then((response) => {
      return response.json();
    })
    .then(data => {
      wl_obs=data;
        // console.log("second success");
        // wl_obs = JSON.parse(data.contents); //for allorigins parsing        
        wl_obs.RiverStageObservatoryProfile_OPENDATA.forEach(ob => {

          sta_id=ob.BasinIdentifier.replace(/ /g, "");
          sta_name=ob.ObservatoryName.replace(/ /g, "");
          sta_river=ob.RiverName.replace(/ /g, "");
          sta_ObervationItems=ob.ObervationItems.replace(/ /g, "");
          sta_ObervationItems=ob.ObervationItems.replace(/,/g, "");

          if (ob.ObservationStatus == "現存") {
            obs97loc = ob.LocationByTWD97_XY.match(/(\S+)\s(\S+)/);
            wgs84 = proj4(EPSG3826, EPSG4326, [parseFloat(obs97loc[1]), parseFloat(obs97loc[2])]);
            
            // rtvalue="";
            // if (wlrt2.hasOwnProperty(sta_id)){            
            //   rtvalue=wlrt2[sta_id];
            // }
            // console.log(ob.BasinIdentifier, ob.ObservatoryName, wgs84[0], wgs84[1],rtvalue);
            pt = {
              "type": "Feature",
              "properties": {
                "id": sta_id,
                "name": sta_name,
                "river": sta_river,          
                "ObervationItems" : sta_ObervationItems,
              },
              "geometry": {
                "type": "Point",
                "coordinates": [wgs84[0], wgs84[1]]
              }              
            };
            waterlevelLayer.addData(pt);
          }
        });
        // lyctrl.addOverlay(waterlevelLayer, "水利署水位站");
    })
    .catch((err) => {
      console.log('rejected: ', err);
    });

    
      
  }
  // 即時水位 
  // JSON https://gweb.wra.gov.tw/HydroInfoMobile/Chart?containerID=chart-single-rtle&category=rtLE&stno=1140H099&sYear=2021&sMonth=10&sDay=21&eYear=2021&eMonth=10&eDay=24&timeframe=YYMMDD&timeType=hh&mode=0&flow_cnt=&searchType=
  // Chart https://gweb.wra.gov.tw/HydroInfoMobile/hichart?stno=1140H099&category=rtLE&deptID=14&sdate=2021/07/22&edate=2021/10/24&flow_cnt=&searchType=
  // Chart https://gweb.wra.gov.tw/HydroInfoMobile/hichart?stno=1300H020&category=rtLE&deptID=2&sdate=2021/07/01&edate=2021/10/24&flow_cnt=&searchType=
  // https://gweb.wra.gov.tw/HydroInfoMobile/hichart?stno=1140H099&category=rtLE&sdate=2021/03/22&edate=2021/10/24

  // MAP https://gweb.wra.gov.tw/HyMapService/MapView.aspx?x=262563.72&y=2726400.95&datatype=hydroinfo_rtle&edit=2&dateS=2021/07/01&dateE=2021/10/24&name=%u4E94%u5CF0%u5927%u6A4B&auth=0&legend=legend_rtle

  readWLStatGeoJON();



const str_RA = {
  'Past1hr':'一小時',
  'Past10Min' : '十分鐘',
  'Past3hr':'三小時',
  'Past6Hr':'六小時',
  'Past12hr':'12小時',
  'Past24hr':'24小時',
  'Now':'今日',
  'Past2days':'二日',
  'Past3days':'三日'
}

// rain fall
rra={};
var RApoi="";
const RALayer = L.geoJSON([], {
  pointToLayer: function (geoJsonPoint, latlng) {
    return L.marker(latlng, { icon: umbrellaIcon });
  }
});


RALayer.on('add',
  function(){
    if (map.getZoom() <=9) map.setZoom(10);
    read_catchment.remove();
  }
);

// 站位圖示 https://www.cwa.gov.tw/V8/C/P/Rainfall/Rainfall_PlotImg.html?ID=81AJ1
// https://www.cwa.gov.tw/V8/C/P/Rainfall/Rainfall_PlotImg.html?ID=C0UA5 
// 雨量摘要 https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0002-001?Authorization=rdec-key-123-45678-011121314&locationName=%E4%B9%9D%E4%BB%BD%E4%BA%8C%E5%B1%B1&elementName=
// 雨量站說明 https://e-service.cwa.gov.tw/wdps/obs/state.htm




// lyctrl.addOverlay(RALayer,"雨量站");




var rainstations={};

//水利署水文資訊網 https://gweb.wra.gov.tw/HydroInfoMobile/hichart?stno=01U050&category=rtRA&deptID=1&sdate=2021/10/22&edate=2021/10/25&flow_cnt=&searchType=
//氣象局站位 API https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0002-001?Authorization=rdec-key-123-45678-011121314&format=JSON&elementName=ELEV
//氣象局 API https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0002-001?Authorization=rdec-key-123-45678-011121314
//氣象局 JSON https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/O-A0002-001?Authorization=rdec-key-123-45678-011121314&format=JSON 
function readRAStatGeoJON() {    
  // Query Station of Water Level  //https://data.wra.gov.tw/Service/OpenData.aspx?format=json&id=28E06316-FE39-40E2-8C35-7BF070FD8697
  fetch("https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0002-001?Authorization=rdec-key-123-45678-011121314")
  .then((response) => {
    return response.json();
  })
  .then(data => {
         
    rainstations=data;
    // console.log("RA second success");
    if(rainstations.success){
      // console.log("Read OK!");
      data.records.Station.forEach(element => {
        // sta_id=element.stationId.replace(/ /g, "");
        sta_id=element.StationId.replace(/ /g, "");
        sta_name=element.StationName.replace(/ /g, "");
        sta_time=element.ObsTime.DateTime;
        if (element.GeoInfo.Coordinates[0].CoordinateName === "TWD67"){
          wgs84 = proj4(EPSG3821, EPSG4326, [parseFloat(element.GeoInfo.Coordinates[0].StationLongitude), parseFloat(element.GeoInfo.Coordinates[0].StationLatitude)]);
          sta_lat=wgs84[1];
          sta_lon=wgs84[0];     
        }else if(element.GeoInfo.Coordinates[0].CoordinateName === "WGS84"){
          sta_lat=element.GeoInfo.Coordinates[0].StationLatitude;
          sta_lon=element.GeoInfo.Coordinates[0].StationLongitude;
        }else{
          console.log("unkown CoordinateName in RA query" + element.GeoInfo.Coordinates[0].CoordinateName);
          throw new Error('unkown CoordinateName in RA query' + element.GeoInfo.Coordinates[0].CoordinateName);
        };
    
        // console.log(element.locationName, element.stationId,element.lat,element.lon,element.time );
        pt = {
          "type": "Feature",
          "properties": {
            "id": sta_id,
            "name": sta_name,    
            "time" : sta_time,   
            "rain": element.RainfallElement,
          },
          "geometry": {
            "type": "Point",
            "coordinates": [sta_lon, sta_lat]
          }
        };
        RALayer.addData(pt);
      });
      clusterRA.addLayer(RALayer);
    }      
    
  })
  .catch((err) => {
    console.log('rejected: ', err);
  });
}

readRAStatGeoJON();

var clusterRA = L.markerClusterGroup();
clusterRA.bindPopup(  function (layer) {
  gtag('event', 'click', {
    'event_category': 'rainfall',
    'event_label': "station: " + layer.feature.properties.name,
  });


  RApoi ='<table class="table table-sm"><tbody>';
  for (duration in layer.feature.properties.rain) {

    // console.log(el.elementName,el.elementValue);
    rainvalue = (layer.feature.properties.rain[duration].Precipitation > 0) ? parseFloat(layer.feature.properties.rain[duration].Precipitation).toFixed(1) :
      (layer.feature.properties.rain[duration].Precipitation = -998) ? "0.0" : "--";
    //// Table tag

    RApoi += '<tr><th scope="row" >' + str_RA[duration] + '</th><td class="text-right">' + rainvalue + '</td></tr>';
  }
  RApoi+='</tbody></table>';  
  RApoi+= (new Date(layer.feature.properties.time)).toLocaleTimeString() + " 更新";

  //水利署所有站位 https://gweb.wra.gov.tw/Hydroinfo/WraSTList/


  const popupStationContainer = L.DomUtil.create('div',"container-sm"); //container-fluid maybe? 
  popupStationContainer.appendChild(document.createTextNode(layer.feature.properties.name));
  popupStationContainer.appendChild(document.createTextNode(` (${layer.feature.properties.id})`));
  L.DomUtil.create('br','',popupStationContainer);

  {
  const linkElement=L.DomUtil.create('a','btn btn-outline-primary btn-sm',popupStationContainer);
    linkElement.text='即時';
    linkElement.href='https://www.cwa.gov.tw/V8/C/P/Rainfall/Rainfall_PlotImg.html?ID=' + layer.feature.properties.id.replace(/(.....)./, "$1");
    linkElement.target='_blank';
    L.DomEvent.disableClickPropagation(linkElement);
    L.DomEvent.on(linkElement, 'click', function(e) {  
      e.preventDefault();
      openDialog(linkElement.href);
    });
  }

  if (staCodis = cwaCodis.find(layer.feature.properties.id)){
    //cwaCodis.url(layer.feature.properties.id)
    const linkElement=L.DomUtil.create('a','btn btn-outline-primary btn-sm',popupStationContainer);
    linkElement.text='二週';
    linkElement.href=cwaCodis.url(layer.feature.properties.id);
    linkElement.target='_blank';
    L.DomEvent.disableClickPropagation(linkElement);
    L.DomEvent.on(linkElement, 'click', function(e) {  
      e.preventDefault();
      openDialog(linkElement.href);
    });

  }

  {
    const linkElement=L.DomUtil.create('a','btn btn-outline-primary btn-sm',popupStationContainer);
    linkElement.text='歷史';
    linkElement.href='https://gweb.wra.gov.tw/HydroInfo/StDataInfo/StDataInfo?RA&' + layer.feature.properties.id.replace(/(......)/, "$1");
    linkElement.target='_blank';
    L.DomEvent.disableClickPropagation(linkElement);
    L.DomEvent.on(linkElement, 'click', function(e) {  
      e.preventDefault();
      openDialog(linkElement.href);
    });
  }
  L.DomUtil.create('br','',popupStationContainer);
    
  {
    //RApoi
    const tableElement = L.DomUtil.create('table','table table-sm',popupStationContainer);
    const tbodyElement = L.DomUtil.create('tbody','',tableElement);
    
    for (duration in layer.feature.properties.rain) {

      // console.log(el.elementName,el.elementValue);
      rainvalue = (layer.feature.properties.rain[duration].Precipitation > 0) ? parseFloat(layer.feature.properties.rain[duration].Precipitation).toFixed(1) :
        (layer.feature.properties.rain[duration].Precipitation = -998) ? "0.0" : "--";
      //// Table tag
  
      const rowElement = L.DomUtil.create('tr','',tbodyElement);
      const rowHeader = L.DomUtil.create('th','',rowElement); 
      rowElement.setAttribute("scope","row");
      rowHeader.innerHTML=str_RA[duration];
      const rowData = L.DomUtil.create('td','text-right',rowElement); 
      rowData.innerHTML=rainvalue;     
    }
   
    popupStationContainer.appendChild(document.createTextNode( (new Date(layer.feature.properties.time)).toLocaleTimeString() + " 更新"));
    L.DomUtil.create('br','',popupStationContainer);
  }
  

  

  if(staCodis){
    const subElement=L.DomUtil.create('sub','',popupStationContainer);
    subElement.appendChild(document.createTextNode(staCodis.stationStartDate + ' - ' + staCodis.stationEndDate));
  }

  return popupStationContainer;
});


clusterRA.on('add',
  function(){
    if (map.getZoom() <=9) map.setZoom(10);  
    read_catchment.remove();
  }
);

lyctrl.addOverlay(clusterRA, '雨量<span class="btn-sm"><i class="fa fa-umbrella text-black-50" aria-hidden="true"></i></span>');



// 考慮改用 https://fhy.wra.gov.tw/WraApi#!/ReservoirApi/ReservoirApi_Station
// TODO: https://data.wra.gov.tw/openapi/swagger
// 104pcs 對照最多，座標有缺 https://fhy.wra.gov.tw/WraApi/v1/Reservoir/Station     
//  68pcs https://fhy.wra.gov.tw/WraApi/v1/Reservoir/RealTimeInfo
//  76pcs https://fhy.wra.gov.tw/WraApi/v1/Reservoir/Daily
// 98pcs SWRESOIR 最多組座標 缺部份 ID
// 335pcs 水庫水情資料 https://data.gov.tw/dataset/45501 名稱由 水庫每日營運狀況 取得
// 76 水庫每日營運狀況 50C8256D-30C5-4B8D-9B84-2E14D5C6DF71.json
// 95 水庫代碼 ID 與其他資料不相符  DD225E12-CF60-466F-B686-F97AF801AD0D.json
// 351 https://data.startupterrace.tw/api/dataset_api/1c81ddae-2bc7-4ca2-b3ff-02ffac0fbc7d 水庫水情資料 from https://data.startupterrace.tw/search/detail/2632a049-d925-4956-b802-7829a9f2a0e1/%E6%B0%B4%E5%BA%AB%E6%B0%B4%E6%83%85%E8%B3%87%E6%96%99
// 水庫基本資料 缺ID座標 D54BA676-ED9A-4077-9A10-A0971B3B020C.json

const wraRES = L.geoJSON([], {
  pointToLayer: function (geoJsonPoint, latlng) {
    return L.marker(latlng, { icon: folderIcon });
  }
}).bindPopup(function (layer) {

  gtag('event', 'click', {
    'event_category': 'reservoir',
    'event_label': "station: " + layer.feature.properties.name,
  });
  
  // API filter example
  // "https://fhy.wra.gov.tw/WraApi/v1/Reservoir/Station?$filter=StationName eq '羅好壩'"
  // "https://fhy.wra.gov.tw/WraApi/v1/Reservoir/Daily?$filter=StationNo eq '10213'&$select=InflowTotal,OutflowTotal,Time"

  const popupStationContainer = L.DomUtil.create('div',"container-sm");
  popupStationContainer.appendChild(document.createTextNode(layer.feature.properties.name));
  if (layer.feature.properties.id ) 
    {
    popupStationContainer.appendChild(document.createTextNode(`(${layer.feature.properties.id})`));
    L.DomUtil.create('br','',popupStationContainer);
    }    
  if (layer.feature.properties.date){
    popupStationContainer.appendChild(document.createTextNode(layer.feature.properties.date.replace(/(....-..-..)T.*/, "$1")));
    L.DomUtil.create('br','',popupStationContainer);

  }
  if (layer.feature.properties.InflowTotal){
    popupStationContainer.appendChild(document.createTextNode("流入" + (layer.feature.properties.InflowTotal * 10000 / 24 / 60 / 60).toFixed(2)));
    const subElement=L.DomUtil.create('sub','',popupStationContainer);
    subElement.appendChild(document.createTextNode("m³/s"));
    L.DomUtil.create('br','',popupStationContainer);
  }
  if (layer.feature.properties.OutflowTotal){
    popupStationContainer.appendChild(document.createTextNode("流出" + (layer.feature.properties.OutflowTotal * 10000 / 24 / 60 / 60).toFixed(2)));
    const subElement=L.DomUtil.create('sub','',popupStationContainer);
    subElement.appendChild(document.createTextNode("m³/s"));
    L.DomUtil.create('br','',popupStationContainer);
  }
  if ((wrafhy_activeStationNo.includes(parseInt(layer.feature.properties.id)))){
    const linkElement=L.DomUtil.create('a','btn btn-outline-primary btn-sm',popupStationContainer);
    linkElement.text='近日平均流量';
    linkElement.href=`https://wiwari.github.io/wra-fhy/?StationNo=${layer.feature.properties.id}`;
    linkElement.target='_blank';
    L.DomEvent.disableClickPropagation(linkElement);
    L.DomEvent.on(linkElement, 'click', function(e) {  
      e.preventDefault();
      openDialog(linkElement.href);
    });
  }
  return popupStationContainer;
     
});

wraRES.on('add',
  function(){
    if (map.getZoom() <=9) map.setZoom(10);  
    read_catchment.remove();
  }
);
lyctrl.addOverlay(wraRES, '堤壩<span class="btn-sm"><i class="fa fa-folder text-black-50" aria-hidden="true"></i></span>');

var wraRESshp = null;
getwraRESshp();
function getwraRESshp() {  
  fetch("wra/SWRESOIR.json")
    .then((response) => {
      return response.json();
    })
    .then(data => {
      wraRESshp = data;
      getwraRESdailyAPI();
    })
    .catch((err) => {
      console.log('rejected: ', err);
    });
}


var wrafhy_activeStationNo= null;
getwrafhyActiveStationNo();
function getwrafhyActiveStationNo() {
  fetch("/wra-fhy/data/active_stations.json")
    .then((response) => {
      return response.json();
    })
    .then(data => {
      wrafhy_activeStationNo = data[0].StationNoList;
    })
    .catch((err) => {
      console.log('rejected: ', err);
    });
}


var wraRESdailyAPI ={};


var wraRESstaAPI = {};

function getwraRESstaAPI() {
  fetch("https://fhy.wra.gov.tw/WraApi/v1/Reservoir/Station?$select=Latitude,Longitude,StationNo,StationName",{
    "headers": {
        "Accept": "application/json",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin"
    },
    // "referrer": "https://fhy.wra.gov.tw/WraApi/",
    "method": "GET",
    "mode": "cors"
})
    .then((response) => {
      return response.json();
    })
    .then(data => {

      wraRESstaAPI = data;
      // CityCode (string):// 縣市代碼 ,
      // EffectiveCapacity (number, optional): 有效容量(萬立方公尺) ,
      // FullWaterHeight (number, optional): 滿水位標高(公尺) ,
      // DeadWaterHeight (number, optional): 呆水位標高(公尺)(底床高) ,
      // Latitude (number, optional): 緯度(WGS84) ,
      // Longitude (number, optional) 經度(WGS84) ,
      // Storage (number): 總蓄水量(萬立方公尺) ,
      // ProtectionFlood (integer): 是否涉及防洪(0:否;1:是) ,
      // HydraulicConstruction (integer): 水工結構物種類(1:水庫and壩;2:攔河堰) ,
      // Importance (integer): 水庫堰壩之重要性(1:主要;0:其他) ,
      // StationNo (string): 測站代碼 ,
      // StationName (string): 測站中文名稱 ,
      // BasinNo (string): 流域代碼 , 
      // BasinName (string):// 流域名稱 


      //append SWRESOIR.shp coordinates and stations
      wraRESshp.features.forEach(sta_shp => {
        s = "";
        found = 0;
        wraRESstaAPI.forEach(sta_api => {
          if (sta_shp.properties.COMPARE_ID !== null && sta_shp.properties.COMPARE_ID && sta_shp.properties.COMPARE_ID == sta_api['StationNo']) { // overwrite station from API if any station in SWRESOIR.shp which has better resolution
            s += (sta_shp.properties.COMPARE_ID) + sta_shp.properties.RES_NAME;
            sta_api['Latitude'] = sta_shp.geometry.coordinates[1];
            sta_api['Longitude'] = sta_shp.geometry.coordinates[0];
            // s += sta_shp.geometry.coordinates[0] + " " +sta_shp.geometry.coordinates[1] + " 相同ID";
            found = 1;
          } else if ((sta_shp.properties.RES_NAME) == sta_api['StationName']) {
            s += sta_shp.properties.RES_NAME;
            sta_api['Latitude'] = sta_shp.geometry.coordinates[1];
            sta_api['Longitude'] = sta_shp.geometry.coordinates[0];
            // s  += sta_api['Latitude'] +" "+ sta_api['Longitude'] + " 相同名稱";
            found = 1;
          } else if (sta_shp.properties.RES_NAME.match(sta_api['StationName']) || sta_api['StationName'].match(sta_shp.properties.RES_NAME)) {
            s += sta_shp.properties.RES_NAME;
            sta_api['Latitude'] = sta_shp.geometry.coordinates[1];
            sta_api['Longitude'] = sta_shp.geometry.coordinates[0];
            // s  += sta_api['Latitude'] +" "+ sta_api['Longitude'] + " 包含名稱";
            found = 1;
          }
        });
        if (found != 1) { //append  SWRESOIR.shp only station
          newsta = {};
          if (sta_shp.properties.COMPARE_ID !== null && sta_shp.properties.COMPARE_ID) {
            s += sta_shp.properties.COMPARE_ID + " ";
            newsta["StationNo"] = sta_shp.properties.COMPARE_ID;
          }
          newsta["StationName"] = sta_shp.properties.RES_NAME;
          newsta["Latitude"] = sta_shp.geometry.coordinates[1];
          newsta["Longitude"] = sta_shp.geometry.coordinates[0];
          wraRESstaAPI.push(newsta);
          // s+=sta_shp.properties.RES_NAME + sta_shp.geometry.coordinates[0] + ", " + sta_shp.geometry.coordinates[1] + " not matching";           
        }
        // console.log(s);
      });

      //append Daily data into station data
      wraRESdailyAPI.forEach(rt_sta => {
        wraRESstaAPI.forEach(sta => {
          if (rt_sta.StationNo == sta['StationNo']) {
            sta['date'] = rt_sta['Time'];
            if (rt_sta['InflowTotal'])
              sta['InflowTotal'] = rt_sta['InflowTotal'];
            if (rt_sta['OutflowTotal'])
              sta['OutflowTotal'] = rt_sta['OutflowTotal'];

            // StationNo (string):測站代碼 ,
            // Time (string):           // 水情時間(格式:yyyy-MM-dd HH:mm) ,
            // EffectiveCapacity (number, optional):            // 有效容量(萬立方公尺) ,
            // DeadWaterHeight (number, optional):            // 呆水位標高(公尺)(底床高) ,
            // FullWaterHeight (number, optional):            // 滿水位標高(公尺) ,
            // AccumulatedRainfall (number, optional):             // 集水區本日降雨量(mm) ,
            // InflowTotal (number, optional):             // 本日總進水量(萬立方公尺) ,
            // OutflowTotal (number, optional):            // 本日總出水量(萬立方公尺) 
          }
        });
      });


      wraRESstaAPI.forEach(sta_api => {
        // s = sta_api['StationNo'] + " "+ sta_api['StationName'] + " ";
        // console.log(s);

        if (sta_api.hasOwnProperty('Latitude') && sta_api.hasOwnProperty('Longitude')) {
          pt = {
            "type": "Feature",
            "properties": {
              "id": sta_api['StationNo'],
              "name": sta_api['StationName'],
              "date": sta_api['date'],
              "InflowTotal": sta_api['InflowTotal'],
              "OutflowTotal": sta_api['OutflowTotal'],
              // "time" : sta_time,   
            },
            "geometry": {
              "type": "Point",
              "coordinates": [sta_api['Longitude'], sta_api['Latitude']]
            }
          };
          wraRES.addData(pt);
        }

      });


      // wraRESdata.features.forEach(el => {
      //   s = el.properties.RES_NAME + " " + el.geometry.coordinates[0]+ " " + el.geometry.coordinates[1];
      //   wraRESstaAPI.forEach(element => {
      //     if
      //     (element['StationName'] == el.properties.RES_NAME)
      //       s += element['StationName'];
      //   });
      //   console.log(s);
      // });


      // wraRES.addData(wraRESdata.features);
      // wlrt_obj=JSON.parse(data.contents);    
      //   wlrt_obj["RealtimeWaterLevel_OPENDATA"].forEach(element => {
      //     realtime_waterlevel[element.StationIdentifier] = {'RecordTime':element.RecordTime,'WaterLevel':element.WaterLevel};
      //   });
    })
  .catch((err) => {
    console.log('rejected: ', err);
  });


}








function getwraRESdailyAPI() {
  fetch("https://fhy.wra.gov.tw/WraApi/v1/Reservoir/Daily", {
    // TODO: https://data.wra.gov.tw/openapi/swagger
    // url: "https://fhy.wra.gov.tw/WraApi/v1/Reservoir/Daily",
    // url: "https://data.wra.gov.tw/Service/OpenData.aspx?format=json&id=50C8256D-30C5-4B8D-9B84-2E14D5C6DF71" ,
    "headers": {
      "Accept": "application/json",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin"
    },
    // "referrer": "https://fhy.wra.gov.tw/WraApi/",
    "method": "GET",
    "mode": "cors"
  })
  .then((response) => {
    return response.json();
  })
    .then(data => {
      wraRESdailyAPI = data;
      wraRESdailyAPI.forEach(rt_sta => {
        1;
        // console.log(rt_sta.StationNo);
      });

      getwraRESstaAPI();
      // "StationNo": "31201",
      // "Time": "2021-11-01T00:00:00",
      // "EffectiveCapacity": 2651.317,
      // "DeadWaterHeight": 100.2,
      // "FullWaterHeight": 142,
      // "AccumulatedRainfall": 1.1,
      // "InflowTotal": 18.049,
      // "OutflowTotal": 15.264
    })
  .catch((err) => {
    console.log('rejected: ', err);
  });


}



// ===============
// CCTV
const staCCTV = L.geoJSON([], {
  pointToLayer: function (geoJsonPoint, latlng) {
    return L.marker(latlng, { icon: cameraIcon });
  }
});

//----------------




//              ---- cluster BEGIN
var clusterCCTV = L.markerClusterGroup(
  {
    // zoomToBoundsOnClick: false,
    disableClusteringAtZoom: 17
  });



// clusterCCTV.addLayer(staCCTV);
// map.addLayer(clusterCCTV);



 clusterCCTV.bindPopup(function (layer) {

  gtag('event', 'click', {
    'event_category': 'cctv',
    'event_label': "station: " + layer.feature.properties.name 
  });
  
  const popupStationContainer = L.DomUtil.create('div',"container-sm"); //container-fluid maybe? 
  
  popupStationContainer.appendChild(document.createTextNode(layer.feature.properties.name));
  {
    const linkElement=L.DomUtil.create('a','btn btn-outline-primary btn-sm',popupStationContainer);
      linkElement.innerHTML ='預覽 <i class="fa fa-camera " aria-hidden="true" ></i>';
      linkElement.href=layer.feature.properties.DivSrc;
      linkElement.target='_blank';
      L.DomEvent.disableClickPropagation(linkElement);
      // L.DomEvent.on(linkElement, 'click', function(e) {  
      //   e.preventDefault();
      //   openDialog(linkElement.href);
      // });
  }
  L.DomUtil.create('br','',popupStationContainer);
  popupStationContainer.appendChild(document.createTextNode(layer.feature.properties.OpenName));
  if (layer.feature.properties.OpenSrc != null){
    const linkElement=L.DomUtil.create('a','btn btn-outline-primary btn-sm',popupStationContainer);
      linkElement.innerHTML ='完整 <i class="fa fa-camera " aria-hidden="true" ></i>';
      linkElement.href=layer.feature.properties.OpenSrc;
      linkElement.target='_blank';
      L.DomEvent.disableClickPropagation(linkElement);
      // L.DomEvent.on(linkElement, 'click', function(e) {  
      //   e.preventDefault();
      //   openDialog(linkElement.href);
      // });
  }
  L.DomUtil.create('br','',popupStationContainer);

  popupStationContainer.appendChild(document.createTextNode(layer.feature.properties.provider));  
  L.DomUtil.create('br','',popupStationContainer);

  return popupStationContainer;
     
});

lyctrl.addOverlay(clusterCCTV, '影像<span class="btn-sm"><i class="fa fa-camera text-black-50" aria-hidden="true"></i></span>');


//              ---- cluster END

clusterCCTV.on('add',
  function(){
    if (map.getZoom() <=9) map.setZoom(10);  
    read_catchment.remove();
  }
);

// clusterCCTV.on('click', function (a) {
// 	console.log('marker ' + a.layer + ' : ' + a.latlng );
// });

// clusterCCTV.on('clusterclick', function (a) {
// 	// a.layer is actually a cluster
// 	console.log('cluster ' + a.layer.getAllChildMarkers().length);
// });

getCCTV();
function getCCTV() {
  fetch("wrafmg/cctv.geojson")
    .then((response) => {
      return response.json();
    })
    .then(data => {
      // console.log(data);
      data.features.forEach(sta => {
        staCCTV.addData(sta);
      });
      clusterCCTV.addLayer(staCCTV);
    })
    .catch((err) => {
      console.log('rejected: ', err);
    });


}


// === end of CCTV ================ 


// local_gpxlayers BEGIN -----
local_gpxlayers = L.featureGroup([]);
lyctrl.addOverlay(local_gpxlayers,'自有上傳'+'<span class="btn-sm"><i class="fa fa-file-code-o  text-black-50" aria-hidden="true"></i></span>');
local_gpxlayers.addTo(map);
// local_gpxlayers  END -----

// //GeoPackageTest =========================================================================
// L.geoPackageFeatureLayer([], {
//   // geoPackageUrl: 'http://localhost:8080/geopackage-js/docs/leaflet/canyoning_topo.gpkg',
//   geoPackageUrl: 'canyoning_topo.gpkg',
//   layerName: 'canyoning_topo_wt',
//   noCache: true,
//   style: function (feature) {
//     return {
//       color: '#F00',
//       weight: 2,
//       opacity: 1,
//     };
//   },
//   // === default marker ===
//   // pointToLayer: function(feature, latlng) {
//   //   return L.circleMarker(latlng, {
//   //     radius: 2,
//   //   });
//   // },
//   pointToLayer: function (feature, latlng) {
//     return L.marker(latlng, {
//       icon: myparkIcon
//     });
//   },
//   onEachFeature: function (feature, layer) {
//     let string = '';
//     for (const key in feature.properties) {
//       string +=
//         '<div class="item"><span class="label">' +
//         key +
//         ': </span><span class="value">' +
//         feature.properties[key] +
//         '</span></div>';
//     }
//     layer.bindPopup(string);
//   },
// }).addTo(map);

// Positioning to Device GPS
// function onLocationFound(e) {
//   var radius = e.accuracy;

//   L.marker(e.latlng).addTo(map)
//       // .bindPopup("You are within " + radius + " meters from this point").openPopup();
//       ;

//   L.circle(e.latlng, radius).addTo(map);
// }

// map.on('locationfound', onLocationFound);

// function onLocationError(e) {
//   alert(e.message);
// }

// map.on('locationerror', onLocationError);

// map.locate({setView: true, maxZoom: 14}); 


const glShaderStreamsHighlightDefinition = `
#define RANGEHIGHLIGHT 1
`;

// https://gitlab.com/IvanSanchez/Leaflet.TileLayer.GL
var glShaderStreams = `
#define M_2PI 6.2831853071795864769252867665590
#define M_PI  3.1415926535897932384626433832795
#define M_PI2 1.5707963267948966192313216916398
  // precision highp float;       // Use 24-bit floating point numbers for everything.
  // uniform float uExtraZoom;    // extraZoom over maxNativeZoom
  // uniform float uWaterThresholdZoomStep;
  // uniform float uWaterThresholdZoomAtTenthKmsq;
  // uniform float uWaterUserDefinedVisibleRangeMax;
  // uniform float uWaterUserDefinedVisibleRangeMin;
  // uniform float uHighlightWavelengthAtZ14;
  // uniform float uNow;          // Microseconds since page load, as per performance.now()
  // uniform vec3 uTileCoords;    // Tile coordinates, as given to L.TileLayer.getTileUrl()
  // varying vec2 vTextureCoords; // Pixel coordinates of this fragment, to fetch texture color
  // varying vec2 vCRSCoords;     // CRS coordinates of this fragment
  // varying vec2 vLatLngCoords;  // Lat-Lng coordinates of this fragment (linearly interpolated)
  // uniform sampler2D uTexture0;  

  vec4 colours[11];
  float stepHeight[11];
  float stepHeightLinear[11];
  
  float waterThreshold = 0.1 * pow(uWaterThresholdZoomStep, (uWaterThresholdZoomAtTenthKmsq - uTileCoords.z - uExtraZoom)) ; //0.001 is workaround to precision issue
  // float waterThreshold = 0.1 * pow(3.7371928188465519779000410099209, (14.0 - uTileCoords.z - uExtraZoom)) + 0.001 ; //0.001 is workaround to precision issue
  // float waterThreshold = 0.1 * pow(3., (15.0 - uTileCoords.z - uExtraZoom)) + 0.01 ;  
  // float waterThreshold = 0.1 * exp2( 2. * (14.0 - uTileCoords.z - uExtraZoom )) + 0.01 ;

  float deRGB(vec4 texelColour){
    // // Height is represented in TENTHS of a meter
    // float height = (   
    //   texelColour.b * 255.0 +
    //   texelColour.g * 255.0 * 256.0 +
    //   texelColour.r * 255.0 * 256.0 * 256.0 
    //    )/10.
    // -10000.0;

    // rewrite in another way
    float height;
    ivec4 texelColourInt = ivec4(texelColour * 256.);
     if(texelColourInt.r == 1 && 
        texelColourInt.g == 134 &&    //height : 0-9.5km2 
        texelColourInt.b >= 160 &&    //height : >=0.0  
        texelColourInt.b <= 210    )  // height : <=5.0     
    {  
      int heightInt = texelColourInt.b -160;
      float heightSmallNumber = float(heightInt) * 0.1;
      height = heightSmallNumber;   
    }else if(all(equal(texelColourInt.rgb,ivec3(0,0,0)))){
      height = -10000.0;
    }else {
      height = 
        dot(texelColour.rgb , vec3(65536. , 256. , 1.))
        * 25.5 -10000.0;      
    }
    return height;
  }

  vec4 renderColor(float renderValue, float filterValue){
    vec4 newcolor = vec4(0.,0.,0.,0.);
  #ifndef RANGEHIGHLIGHT
    newcolor = mix(
      newcolor,
      colours[0].rgba,
      smoothstep( -10000. , stepHeightLinear[0] ,  renderValue )
    );
    // newcolor = colours[0].rgba;  
    // for renderValue <= 0.1
    newcolor = mix(
        newcolor,
        colours[1].rgba,
        smoothstep( stepHeightLinear[0] , stepHeightLinear[1] ,  renderValue )
      );

    // for renderValue >= 0.1
    for (int i=1 ; i < 5 ; i++){ 
      newcolor = mix(
        newcolor,
        colours[i+1].rgba,
        smoothstep( stepHeight[i] , stepHeight[i+1] ,  log2(renderValue) )
      );
    }
    // newcolor = colours[5].rgba;
    for (int i=5; i < 10; i++) {

      // Do a smoothstep of the catchment between steps. If the result is > 0
      // (meaning "the catchment is higher than the lower bound of this step"),
      // then replace the colour with a linear blend of the step.
      // If the result is 1, this means that the real colour will be applied
      // in a later loop.
  
      newcolor = mix(
        newcolor,
        colours[i+1].rgba,
        smoothstep(stepHeight[i], stepHeight[i+1], log2(renderValue))
      );
    }
  #endif

  #ifndef RANGEHIGHLIGHT
    if (filterValue <= waterThreshold ){
      return( vec4(0.,0.,0.,0.));
      // return(vec4(newcolor.rgba));  
    }else{
       return(vec4(newcolor.rgba));
    }
  #else
      if (filterValue >= uWaterUserDefinedVisibleRangeMax || filterValue < uWaterUserDefinedVisibleRangeMin )
      {
        newcolor.rgba = vec4(0., 0., 0., 0.);
      }else{

        // newcolor.rgba = newcolor.rgba * sin( M_PI * fract(uNow /1000.));
        // newcolor.rgb = newcolor.rgb + (1.- newcolor.rgb) * fract(uNow /1000.);
        // newcolor.rgb = newcolor.rgb + (1.- newcolor.rgb) * step(0.5,fract(uNow /1000.));
        newcolor.a = 1.;
        // newcolor.rgb = vec3(1., 1., 1.)* step(0.5,fract(uNow /1000.));        
        // float phi = (log2(renderValue)- 2. * fract(uNow /1000.)) * M_PI; //log phase , best for catchment
        // float phi = ((renderValue)/2.- 2. * fract(uNow /1000.)) * M_PI; //linear phase , best for altitude
        float phi = ((renderValue)/(uHighlightWavelengthAtZ14 * pow(2.,14.0 - uTileCoords.z - uExtraZoom)) + fract(uNow /1000.)) * M_2PI;
        // float phi = ((renderValue)/(10.* pow(2.,14.0 - uTileCoords.z - uExtraZoom)) + fract(uNow /1000.)) * M_2PI; //linear phase , best for altitude tweak , wavelength best for kayaking
        // float phi = ((renderValue)/(200.* pow(2.,14.0 - uTileCoords.z - uExtraZoom)) + fract(uNow /1000.)) * M_2PI; //linear phase , best for altitude tweak , wavelength best for canyoning
        newcolor.rgb = vec3(0.3, 0.3, 0.3)* sin(phi) + vec3(0.7, 0.7, 0.7); 
        // newcolor.rgb = vec3(sin(phi), sin(phi- 2.* M_PI/3.), sin(phi-4.* M_PI/3.));
        // newcolor.rgb = vec3(1., 1., 1.)* sin((0.01*(renderValue)-  2. *  fract(uNow /1000.)) * M_PI);
        // newcolor.rgba = newcolor.rgba * fract(uNow /1000.);
        // newcolor.a = fract(uNow /1000.);
      }
      return(vec4(newcolor.rgba));
  #endif
    return(vec4(0.,1.,0.,1.));
  }


  void main(void) {
    // Color ramp. The alpha value represents the elevation for that RGB colour stop.   

    colours[0] = vec4(0.0, 0.0, 0.2, 0.0);
    colours[1] = vec4(1.0, 0.0, 0.0, 0.3);
    colours[2] = vec4(1.0, 1.0, 0.0, 0.6);
    colours[3] = vec4(0.0, 0.8, 0.0, 0.7);
    colours[4] = vec4(0.0, 0.8, 0.5, 1.0);
    colours[5] = vec4(0.0, 0.8, 0.9, 1.0);
    colours[6] = vec4(0.0, 0.5, 0.9, 1.0);
    colours[7] = vec4(0.0, 0.1, 0.9, 1.0);
    colours[8] = vec4(0.9, 0.0, 0.9, 1.0);
    colours[9] = vec4(0.6, 0.0, 0.7, 1.0);
    colours[10] = vec4(0.4, 0.0, 0.5, 1.0);
    stepHeight[0] = log2(0.01);
    stepHeight[1] = log2(0.1);
    stepHeight[2] = log2(0.5);
    stepHeight[3] = log2(1.0);
    stepHeight[4] = log2(4.0);
    stepHeight[5] = log2(5.0);
    stepHeight[6] = log2(30.0);
    stepHeight[7] = log2(100.0);
    stepHeight[8] = log2(300.0);
    stepHeight[9] = log2(1500.0);    
    stepHeight[10]= log2(3500.0);
    stepHeightLinear[0] = 0.0;
    stepHeightLinear[1] = 0.1;
    stepHeightLinear[2] = 0.5;
    stepHeightLinear[3] = 1.0;
    stepHeightLinear[4] = 4.0;
    stepHeightLinear[5] = 5.0;

    float catchment = deRGB(texture2D(uTexture0, vec2(vTextureCoords.s, vTextureCoords.t)));
    float altitude = deRGB(texture2D(uTexture1, vec2(vTextureCoords.s, vTextureCoords.t)));
  
  #ifndef RANGEHIGHLIGHT
    gl_FragColor=renderColor(catchment,catchment); // renderColor(float renderValue, float filterValue)
  #else
    gl_FragColor=renderColor(altitude,catchment); // renderColor(float renderValue, float filterValue)
  #endif
  }
  
`

var streams = L.tileLayer.gl({
// var streams = L.tileLayer.gl2({
  fragmentShader: glShaderStreams,  
  tileLayers: [catchment,dtmTW],
  // tileUrls: ['https://raw.githubusercontent.com/wiwari/accTW/3c09f5b8746b56c037ac78cf7b8d53e33c93460e/dist/acc/{z}/{x}/{y}.png'],
  uniforms: {
    uWaterThresholdZoomStep: (Math.pow(Math.pow(3, 6), 1/5)), //(3^6)^0.2 
    uWaterThresholdZoomAtTenthKmsq: 14,
	  // uWaterThreshold: 72.9, //0.1,
    // uWaterAlphaMin: 0.1,
    // uWaterAlphaMax: 5.0,
    uExtraZoom: 0 ,
	},
  tms: false, // CLI generation required    
  crs: L.CRS.EPSG3857,
  zoomOffset: 0, //DO NOT set zoom offset avoiding RGB smmothing issue.
  tileSize: 256,
  opacity: 1.0,
  minZoom: 7, //min 10
  // maxZoom: 14,
  minNativeZoom: 7,
  maxNativeZoom: 14,
  bounds: ([[21.89377500, 118.14262778], [25.30147222, 122.00965000]]), //WGS DEM bound 2022TW,PH,KM
}).addTo(map);
lyctrl.addOverlay(streams, "水線著色🏳️‍🌈"); //<sup>彩⁺</sup>


var streamsRangeHightlight = L.tileLayer.gl({
    fragmentShader: glShaderStreamsHighlightDefinition + glShaderStreams,  
    tileLayers: [catchment,dtmTW],
    // tileUrls: ['https://raw.githubusercontent.com/wiwari/accTW/3c09f5b8746b56c037ac78cf7b8d53e33c93460e/dist/acc/{z}/{x}/{y}.png'],
    uniforms: {
      uWaterThresholdZoomStep: (Math.pow(Math.pow(3, 6), 1/5)), //(3^6)^0.2 
      uWaterThresholdZoomAtTenthKmsq: 14,
      uWaterUserDefinedVisibleRangeMax: 1000,
      uWaterUserDefinedVisibleRangeMin: 15,
      uHighlightWavelengthAtZ14: 10,  //10 best for kayaking, 200 best for canyoning at Zoom14
      // uWaterThreshold: 72.9, //0.1,
      // uWaterAlphaMin: 0.1,
      // uWaterAlphaMax: 5.0,
      uExtraZoom: 0 ,
    },
    tms: false, // CLI generation required    
    crs: L.CRS.EPSG3857,
    zoomOffset: 0, //DO NOT set zoom offset avoiding RGB smmothing issue.
    tileSize: 256,
    opacity: 1.0,
    minZoom: 7, //min 10
    // maxZoom: 14,
    minNativeZoom: 7,
    maxNativeZoom: 14,
    bounds: ([[21.89377500, 118.14262778], [25.30147222, 122.00965000]]), //WGS DEM bound 2022TW,PH,KM
  })
  streamsRangeHightlight.on('add',()=>{  
    highlightRangeCtrl.addTo(map);     
    // highlightRangeCtrl.setRangeValue([streamsRangeHightlight.options.uniforms.uWaterUserDefinedVisibleRangeMin,streamsRangeHightlight.options.uniforms.uWaterUserDefinedVisibleRangeMax]);
  });  
  streamsRangeHightlight.on('remove',()=>{  
    highlightRangeCtrl.remove();     
    // highlightRangeCtrl.setRangeValue([streamsRangeHightlight.options.uniforms.uWaterUserDefinedVisibleRangeMin,streamsRangeHightlight.options.uniforms.uWaterUserDefinedVisibleRangeMax]);
  });  
  // streamsRangeHightlight.addTo(map);
  lyctrl.addOverlay(streamsRangeHightlight, "水線自選〰️"); //<sup>灰波</sup>


L.Control.rangeSlider = L.Control.extend({
    options: {
      rangeValue:[2,17],
      digitMin: 0,
      digitMax: 3,
      segmentsPerDecimal: 6, //segments in a decimal
      bindingLayer: null,
    },
    initialize: function(options) {            
      L.setOptions(this, options);      

      let segmentsPerDecimal=this.options.segmentsPerDecimal;
      let min=segmentsPerDecimal*this.options.digitMin;
      let max=segmentsPerDecimal*this.options.digitMax;      
      
      this._ControlContainer=L.DomUtil.create('div','leaflet-control leaflet-control-layers  ');    

      this._selectWavelengthContainer=L.DomUtil.create('div','form-floating container',this._ControlContainer);
      this._selectWavelength=L.DomUtil.create('select','form-select',this._selectWavelengthContainer);
      this._selectWavelength.id="wavelength";
      this._selectWavelengthLabel=L.DomUtil.create('label','form-label',this._selectWavelengthContainer);
      this._selectWavelengthLabel.setAttribute("for","wavelength")
      // this._selectWavelengthLabel.setAttribute("placeholder","TEST");
      this._selectWavelengthLabel.innerHTML="波紋高差、每秒下降";


      this._opt1=L.DomUtil.create('option','',this._selectWavelength);
      this._opt1.value="10";
      // this._opt1.innerHTML="航行";
      this._opt2=L.DomUtil.create('option','',this._selectWavelength);
      this._opt2.value="200";
      // this._opt2.innerHTML="溯行";  

      this._sliderContainer=L.DomUtil.create('div','form-floating highlighRange_container container',this._ControlContainer);    

      this._slider1=L.DomUtil.create('input','form-range',this._sliderContainer);
      this._slider1.id="rangeFromSlider";
      this._slider1.type="range";      

      this._lable=L.DomUtil.create('label','form-label',this._sliderContainer);

      this._slider2=L.DomUtil.create('input','form-range',this._sliderContainer);
      this._slider2.id="rangeToSlider";   
      this._slider2.type="range";
      
      this._lable.setAttribute("for","rangeFromSlider")
      // this._lable.setAttribute("placeholder","TEST");
      // this._lable.style="text-align: center;";
      this._rangestring=L.DomUtil.create('span','',this._lable);
      this._rangestring.innerHTML='catchment range';


      // this._selectWavelengthLabel=L.DomUtil.create('label','',this._sliderContainer);
      // this._selectWavelengthLabel.for="rangeFromSlider";
      // this._selectWavelengthLabel.innerHTML="拉拔";
      
      this._slider1.min= min;
      this._slider1.max= max;
      this._slider2.min= min;
      this._slider2.max= max; 

 
      this.updateWavelengthLabel(); 
      

      this.setRangeValue(this.getRange())  ;   

    },
    onAdd: function(map) {   
        // Stop propagation of click events on the control
        L.DomEvent.disableClickPropagation(this._ControlContainer);
        // L.DomEvent.on(this._ControlContainer, 'mousedown mouseup click touchstart', L.DomEvent.stopPropagation);
        L.DomEvent.on(this._slider1, 'change', function(e) {
          let newSliderRange=[this._slider1.value,this._slider2.value].sort((a, b) => parseFloat(a) - parseFloat(b));
          newRange=newSliderRange.map(this.tickDecode);
          this.setRangeValue(newRange);
          this.fire('change', {value: newRange});
        }.bind(this));
        L.DomEvent.on(this._slider2, 'change', function(e) {
          let newSliderRange=[this._slider1.value,this._slider2.value].sort((a, b) => parseFloat(a) - parseFloat(b));
          newRange=newSliderRange.map(this.tickDecode);
          this.setRangeValue(newRange);
          this.fire('change', {value: newRange});
        }.bind(this));
        L.DomEvent.on(this._slider1, 'input', function(e) {
          let newSliderRange=[this._slider1.value,this._slider2.value].sort((a, b) => parseFloat(a) - parseFloat(b));
          newRange=newSliderRange.map(this.tickDecode);
          // this.setRangeValue(newRange);
          this.fire('input', {value: newRange});
        }.bind(this));
        L.DomEvent.on(this._slider2, 'input', function(e) {
          let newSliderRange=[this._slider1.value,this._slider2.value].sort((a, b) => parseFloat(a) - parseFloat(b));
          newRange=newSliderRange.map(this.tickDecode);
          // this.setRangeValue(newRange);
          this.fire('input', {value: newRange});
        }.bind(this));
        L.DomEvent.on(this._selectWavelength, 'change', function(e) {
          if (e.target.value == this.options.bindingLayer.options.uniforms.uHighlightWavelengthAtZ14){
            ;
          }else{
            if(e.target.value > this.options.bindingLayer.options.uniforms.uHighlightWavelengthAtZ14){
              this.setRangeValue(this.getRange().map((x) =>{ return (x / Math.pow(10,1+2/6.))}));
            }else{
              this.setRangeValue(this.getRange().map((x) =>{ return (x * Math.pow(10,1+2/6.))}));
            }
          }
          this.options.bindingLayer.options.uniforms.uHighlightWavelengthAtZ14=e.target.value;
          this.options.bindingLayer.setUniform('uHighlightWavelengthAtZ14',e.target.value);
          this._rangestring.innerHTML= this.getSliderLabel(this.options.rangeValue);
          this.updateWavelengthLabel();

          this.fire('changeWavelength', e.target.value);
        }.bind(this));
        
        return this._ControlContainer;
    },
    onRemove: function(map) {
        // Nothing to do here
    },
    tickEncode : function (x){
      return Math.round(6 * Math.log10(x / 1.0));      
    },
    tickDecode : function (x){
      return (Math.pow(10,(x/6.)));
    },
    setRangeValue: function(rangeValue) {
      let sortedRangeValue = rangeValue.sort((a, b) => parseFloat(a) - parseFloat(b));
      this.options.rangeValue = sortedRangeValue;
      this._slider1.value = this.tickEncode(sortedRangeValue[0]);
      this._slider2.value = this.tickEncode(sortedRangeValue[1]);
      this._rangestring.innerHTML= this.getSliderLabel(sortedRangeValue);
    },
    getRange: function(){
      return (this.options.rangeValue[0] < this.options.rangeValue[1] ? [this.options.rangeValue[0], this.options.rangeValue[1]] : [this.options.rangeValue[1], this.options.rangeValue[0]] );
    },
    simplifyRangeValue: function(x){ //as readible number
      return x.toFixed(Math.max(0,1-Math.floor(Math.log10(x))));
    },
    getWavelength: function(x){
      // let wavelength = streamsRangeHightlight.options.uniforms.uHighlightWavelengthAtZ14 * Math.pow(2,14-map.getZoom()) ;
      // let wavelength = this.options.bindingLayer.options.uniforms.uHighlightWavelengthAtZ14 * Math.pow(2,14-map.getZoom()) ;
      let wavelength = x * Math.pow(2,14-map.getZoom()) ;
      return ( wavelength  );
    },
    getSliderLabel: function(value){ //input range
      let sortedRangeValue = value.sort((a, b) => parseFloat(a) - parseFloat(b));
      // return ("💧" + this.simplifyRangeValue(sortedRangeValue[0]) + " - " + this.simplifyRangeValue(sortedRangeValue[1]) + " km²" + this.getWavelengthLabel());
      return ("💧" + this.simplifyRangeValue(sortedRangeValue[0]) + " - " + this.simplifyRangeValue(sortedRangeValue[1]) + " km²" );
    },
    getWavelengthLabel: function(x){
      if (x){
        return("" + this.getWavelength(x) + "m");
      } else{
        return("" + this.getWavelength(this._selectWavelength.value) + "m");
      }
      

    },
    updateWavelengthLabel(){
      this._opt1.innerHTML= "🛶" + this.getWavelengthLabel(this._opt1.value) +" (適航行)";
      this._opt2.innerHTML= "🧗"+ this.getWavelengthLabel(this._opt2.value) +" (適溯行)"; 
    }
});
L.Control.rangeSlider.include(L.Evented.prototype);

let highlightRangeCtrl = new L.Control.rangeSlider({ 
  bindingLayer: streamsRangeHightlight,
  rangeValue:[streamsRangeHightlight.options.uniforms.uWaterUserDefinedVisibleRangeMin,streamsRangeHightlight.options.uniforms.uWaterUserDefinedVisibleRangeMax], 
  digitMin: -1, 
  digitMax:(3+4/6) , 
  position: 'bottomleft' ,  
})

highlightRangeCtrl.on("change",(e)=>{
  // console.log("Change fired " +  e.value /*highlightrangeCtrl.getRange()*/);
  streamsRangeHightlight.options.uniforms.uWaterUserDefinedVisibleRangeMin=e.value[0];
  streamsRangeHightlight.options.uniforms.uWaterUserDefinedVisibleRangeMax=e.value[1];
  streamsRangeHightlight.setUniform('uWaterUserDefinedVisibleRangeMin',e.value[0]);
  streamsRangeHightlight.setUniform('uWaterUserDefinedVisibleRangeMax',e.value[1]);
  streamsRangeHightlight.reRender();
  streamsRangeHightlight.redraw();
});
highlightRangeCtrl.on("input",(e)=>{
  // console.log("Input fired " +  e.value /*highlightrangeCtrl.getRange()*/);
    highlightRangeCtrl._rangestring.innerHTML= highlightRangeCtrl.getSliderLabel(e.value);
});
highlightRangeCtrl.on("changeWavelength",(e)=>{
  streamsRangeHightlight.options.uniforms.uWaterUserDefinedVisibleRangeMin=highlightRangeCtrl.getRange()[0];
  streamsRangeHightlight.options.uniforms.uWaterUserDefinedVisibleRangeMax=highlightRangeCtrl.getRange()[1];
  streamsRangeHightlight.setUniform('uWaterUserDefinedVisibleRangeMin',highlightRangeCtrl.getRange()[0]);
  streamsRangeHightlight.setUniform('uWaterUserDefinedVisibleRangeMax',highlightRangeCtrl.getRange()[1]);
  streamsRangeHightlight.reRender();
  streamsRangeHightlight.redraw();
});



// cwa accumilated precipitation daily. ref: O-A0040-002. "119.188-123.588", "21.523-25.938"
// https://cwaopendata.s3.ap-northeast-1.amazonaws.com/Observation/O-A0040-002.json
// https://cwaopendata.s3.ap-northeast-1.amazonaws.com/Observation/O-A0040-003.json
// O-A0040-003: 21.51 - 25.92,  119.18 - 123.58
// https://www.cwa.gov.tw/Data/rainfall/2024-07-21_1730.QZJ8.jpg

// CWA images ----------------------------------
const CWA ={
   getRainMapUrl : function (offset = 0, delayedMinutes = 15, date) { // expect offset 0(now), -1(the day before), -2(the day before)
    const strTemp="https://www.cwa.gov.tw/Data/rainfall/2024-07-22_0000.QZJ8.jpg";
    const now = date? date: new Date() ; 
    // const delayedMinutes = 15; // get image numbers of minutes later
    let adjustedTime;
    let filename ;
    let year, month, day, hours, minutes ;

    if (offset == 0){

      // return ('https://www.cwa.gov.tw/Data/rainfall/QZJ.jpg'); // shortcut to get latest one, but update slower

      // Subtract 15 minutes from current time
      adjustedTime = new Date(now.getTime() - delayedMinutes * 60000); // 15 minutes in milliseconds
    
      // Round adjusted time to nearest half-hour
      let flooredMinutes = Math.floor(adjustedTime.getMinutes() / 30) * 30;
      let flooredHours = adjustedTime.getHours();
      
      // Format the rounded time components
      hours = String(flooredHours).padStart(2, '0');
      minutes = String(flooredMinutes).padStart(2, '0');
    }else{
      // Subtract 15 minutes from current time
      adjustedTime = new Date(now.getTime() - delayedMinutes * 60000 + ( 1 - offset ) * 24 * 60 * 60000); // 15 minutes in milliseconds
      hours = '00';
      minutes = '00';
    }    
    year = adjustedTime.getFullYear();
    month = String(adjustedTime.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
    day = String(adjustedTime.getDate()).padStart(2, '0');
    filename =`https://www.cwa.gov.tw/Data/rainfall/${year}-${month}-${day}_${hours}${minutes}.QZJ8.jpg`;
    return filename;
  },
  getFCSTMapUrls06hr : [
    'https://www.cwa.gov.tw/Data/fcst_img/QPF_ChFcstPrecip_6_06.png',
    'https://www.cwa.gov.tw/Data/fcst_img/QPF_ChFcstPrecip_6_12.png',
    'https://www.cwa.gov.tw/Data/fcst_img/QPF_ChFcstPrecip_6_18.png',
    'https://www.cwa.gov.tw/Data/fcst_img/QPF_ChFcstPrecip_6_24.png',
    'https://www.cwa.gov.tw/Data/fcst_img/QPF_ChFcstPrecip_6_30.png',
    'https://www.cwa.gov.tw/Data/fcst_img/QPF_ChFcstPrecip_6_36.png',
    'https://www.cwa.gov.tw/Data/fcst_img/QPF_ChFcstPrecip_6_42.png',
    'https://www.cwa.gov.tw/Data/fcst_img/QPF_ChFcstPrecip_6_48.png',
  ],
  getFCSTMapUrls12hr : [
    'https://www.cwa.gov.tw/Data/fcst_img/QPF_ChFcstPrecip_12_12.png',
    'https://www.cwa.gov.tw/Data/fcst_img/QPF_ChFcstPrecip_12_24.png',
    'https://www.cwa.gov.tw/Data/fcst_img/QPF_ChFcstPrecip_12_36.png',
    'https://www.cwa.gov.tw/Data/fcst_img/QPF_ChFcstPrecip_12_48.png',
  ],
  getRadarMapUrl : function (offset = 0, delayedMinutes = 12, date) { // expect offset 0(now), -1(the day before), -2(the day before)
    const strTemp="https://www.cwa.gov.tw/Data/radar/CV1_TW_3600_202407261210.png";
                 
    const now = date? date: new Date() ; 
    // const delayedMinutes = 15; // get image numbers of minutes later
    let adjustedTime;
    let filename ;
    let year, month, day, hours, minutes ;
    

    // return ('https://www.cwa.gov.tw/Data/rainfall/QZJ.jpg'); // shortcut to get latest one, but update slower

    // Subtract 15 minutes from current time
    adjustedTime = new Date(now.getTime() - delayedMinutes * 60000 - offset * 10 * 60000); // 15 minutes in milliseconds
  
    // Round adjusted time to nearest half-hour
    let flooredMinutes = Math.floor(adjustedTime.getMinutes() / 10) * 10;
    let flooredHours = adjustedTime.getHours();
    
    // Format the rounded time components
    hours = String(flooredHours).padStart(2, '0');
    minutes = String(flooredMinutes).padStart(2, '0');

    
    year = adjustedTime.getFullYear();
    month = String(adjustedTime.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
    day = String(adjustedTime.getDate()).padStart(2, '0');
    filename =`https://www.cwa.gov.tw/Data/radar/CV1_TW_3600_${year}${month}${day}${hours}${minutes}.png`;
    return filename;
  },
}

const cwa_dlong = -0.003;
const cwa_dlat  = -0.022;

const emptyLayer = new L.layerGroup();
lyctrl2.addBaseLayer(emptyLayer,"<span style=''>無</span>");
emptyLayer.addTo(map);

const cwaDailyGroup = L.featureGroup();
for (i=0; i< 3; i++){
  L.imageOverlay(
    // "https://cwaopendata.s3.ap-northeast-1.amazonaws.com/Observation/O-A0040-002.jpg", 
    // "https://www.cwa.gov.tw/Data/rainfall/2024-07-22_0000.QZJ8.jpg",
    CWA.getRainMapUrl(i), 
    // L.latLngBounds([[25.92  , 123.58], [21.51 , 119.18]]), 
    L.latLngBounds([[25.938 + cwa_dlat , 123.588 + cwa_dlong ], [21.523 + cwa_dlat, 119.188+ cwa_dlong]]),  
    {
    opacity: 0,
    // errorOverlayUrl: CWA.getRainMapUrl(0),
    // errorOverlayUrl: 'https://cdn-icons-png.flaticon.com/512/110/110686.png',
    // alt: altText,
    // interactive: true,
    attribution: '© <strong><a href="https://www.cwa.gov.tw/">CWA</a></strong>',
    // className: 'd-none',
  }).addTo(cwaDailyGroup);
}
cwaDailyGroup.on('add', (e)=>{
  e.target._index=0;
  e.target.getLayers()[e.target._index].setOpacity(0.4);  
  e.target._interval = setInterval(() => {
    e.target.getLayers()[e.target._index].setOpacity(0);
//     cwaDaily.setUrl(CWA.getRainMapUrl(cwaDaily._index));
  e.target._index = (e.target._index + 1) % 3;
  e.target.getLayers()[e.target._index].setOpacity(0.4);    
  }, 2000);
});
cwaDailyGroup.on('remove', (e)=>{  
  clearInterval(e.target._interval);
  e.target.getLayers()[e.target._index].setOpacity(0);
});
// cwaDailyGroup.addTo(map);
lyctrl2.addBaseLayer(cwaDailyGroup,"🌧️日累積");


const cwaPrecipitationForcast6HR = L.featureGroup();
for (i = 0 ; i< CWA.getFCSTMapUrls06hr.length  ; i ++){
  L.imageOverlay(  
    [CWA.getFCSTMapUrls06hr[i]], 
    L.latLngBounds([[25.800  , 122.445 ], [21.805, 118.940]]),   //肉眼對準
    {
    opacity: 0,
    attribution: '© <strong><a href="https://www.cwa.gov.tw/">CWA</a></strong>',
  }).addTo(cwaPrecipitationForcast6HR);
}
cwaPrecipitationForcast6HR.on('add',(e)=>{
  e.target._index=0;
  e.target.getLayers()[e.target._index].setOpacity(0.4);  
  e.target._interval=setInterval(() => {
    e.target.getLayers()[e.target._index].setOpacity(0);  
    e.target._index = (e.target._index +1) % CWA.getFCSTMapUrls06hr.length;
    e.target.getLayers()[e.target._index].setOpacity(0.4);  
  }, 1000);
});
cwaPrecipitationForcast6HR.on('remove',(e)=>{
  clearInterval(e.target._interval);
  e.target.getLayers()[e.target._index].setOpacity(0);
});
// cwaPrecipitationFCST.addTo(map);

lyctrl2.addBaseLayer(cwaPrecipitationForcast6HR,"🌧️預報06<sub>hr</sub>");


const cwaPrecipitationForcast12HR = L.featureGroup();
for (i = 0 ; i< CWA.getFCSTMapUrls12hr.length  ; i ++){
  L.imageOverlay(  
    [CWA.getFCSTMapUrls12hr[i]], 
    L.latLngBounds([[25.800  , 122.445 ], [21.805, 118.940]]),   //肉眼對準
    {
    opacity: 0,
    attribution: '© <strong><a href="https://www.cwa.gov.tw/">CWA</a></strong>',
  }).addTo(cwaPrecipitationForcast12HR);
}
cwaPrecipitationForcast12HR.on('add',(e)=>{
  e.target._index=0;
  e.target.getLayers()[e.target._index].setOpacity(0.4);  
  e.target._interval=setInterval(() => {
    e.target.getLayers()[e.target._index].setOpacity(0);  
    e.target._index = (e.target._index +1) % CWA.getFCSTMapUrls12hr.length;
    e.target.getLayers()[e.target._index].setOpacity(0.4);  
  }, 1000);
});
cwaPrecipitationForcast12HR.on('remove',(e)=>{
  clearInterval(e.target._interval);
  e.target.getLayers()[e.target._index].setOpacity(0);
});
// cwaPrecipitationFCST.addTo(map);

lyctrl2.addBaseLayer(cwaPrecipitationForcast12HR,"🌧️預報12<sub>hr</sub>");

// const cwaRadar = L.imageOverlay(
//   // "https://cwaopendata.s3.ap-northeast-1.amazonaws.com/Observation/O-A0058-001.png", // larget
//   "https://cwaopendata.s3.ap-northeast-1.amazonaws.com/Observation/O-A0058-003.png", // small

//   // L.latLngBounds([[29.25  , 126.50  ], [17.75, 115.00]]),   // large
//   L.latLngBounds([[26.5 -0.03  , 124], [20.5 -0.03, 118]]), // small
//   {
//   opacity: 0.4,
//   // alt: altText,
//   // interactive: true,
//   attribution: '© <strong><a href="https://www.cwa.gov.tw/">CWA</a></strong>',
// });
// lyctrl2.addBaseLayer(cwaRadar,'雷達回波近');

// const cwaRadar0 = L.imageOverlay(
//   "https://cwaopendata.s3.ap-northeast-1.amazonaws.com/Observation/O-A0058-006.png", // small
//   L.latLngBounds([[26.5 -0.03  , 124], [20.5 -0.03, 118]]), // small
//   {
//   opacity: 0.4,
//   // alt: altText,
//   // interactive: true,
//   attribution: '© <strong><a href="https://www.cwa.gov.tw/">CWA</a></strong>',
// });
// lyctrl2.addBaseLayer(cwaRadar0,'雷達回波近透');

const cwaRadarGroup = L.featureGroup();
for (i=0; i< 6; i++){
  L.imageOverlay(
    // "https://cwaopendata.s3.ap-northeast-1.amazonaws.com/Observation/O-A0040-002.jpg", 
    // "https://www.cwa.gov.tw/Data/rainfall/2024-07-22_0000.QZJ8.jpg",
    CWA.getRadarMapUrl(i), 
    // L.latLngBounds([[25.92  , 123.58], [21.51 , 119.18]]), 
    L.latLngBounds([[26.5 -0.03  , 124], [20.5 -0.03, 118]]),  
    {
    opacity: 0,
    // errorOverlayUrl: CWA.getRainMapUrl(0),
    // errorOverlayUrl: 'https://cdn-icons-png.flaticon.com/512/110/110686.png',
    // alt: altText,
    // interactive: true,
    attribution: '© <strong><a href="https://www.cwa.gov.tw/">CWA</a></strong>',
    // className: 'd-none',
  }).addTo(cwaRadarGroup);
}
cwaRadarGroup.on('add', (e)=>{
  e.target._index=0;
  e.target.getLayers()[e.target._index].setOpacity(0.4);  
  e.target._interval = setInterval(() => {
    e.target.getLayers()[e.target._index].setOpacity(0);
//     cwaRadarGroup.setUrl(CWA.getRainMapUrl(cwaRadarGroup._index));
  e.target._index = (e.target._index +5) % 6;
  e.target.getLayers()[e.target._index].setOpacity(0.4);    
  }, 500);
});
cwaRadarGroup.on('remove', (e)=>{  
  clearInterval(e.target._interval);
  e.target.getLayers()[e.target._index].setOpacity(0);
});
lyctrl2.addBaseLayer(cwaRadarGroup,"🌧️雷達");
// CWA images ---------------------------------- end


// var kmz = L.kmzLayer().addTo(map);
// kmz.on('load', function(e) {
//   lyctrl.addOverlay(e.layer, e.name);
//   // e.layer.addTo(map);
// });

// // kmz.load('https://cwaopendata.s3.ap-northeast-1.amazonaws.com/Observation/O-A0040-003.kmz');
// kmz.load('/O-A0040-003.kmz');

// GPS button for mobile devices
if (L.Browser.mobile) {
  var locator = L.control.locate({
    position: 'topleft',
    strings: {
      title: "所在位置"
    }
  }).addTo(map);
}

// GeoSearch Button
const GeoSearch = window.GeoSearch;
osmSearcher = new GeoSearch.OpenStreetMapProvider({
  params: {
    countrycodes: 'tw',
    'accept-language': 'zh',
  },
});
const searchControl = new GeoSearch.SearchControl({
  // style: 'button', //'button' | 'bar',
  searchLabel: '搜尋地點',
  autoComplete: false,
  autoClose: true,
  keepResult: true,
  retainZoomLevel: true,
  provider: osmSearcher,
});
map.addControl(searchControl);

map.on('geosearch/showlocation', searched);
function searched(e) {
  gtag('event', 'searched', {
    'event_category': 'poi',
    'event_label': "search: " + $(".glass").val(),
  });
  history.replaceState(null, "", "?q=" + $(".glass").val());
}

// Gross hair for mobile device
if (L.Browser.mobile) {
  var controlCross = L.control.centerCross({ show: true, toggleText: '✛', toggleTitle: '十字標示' });
  map.addControl(controlCross);
}

// L.easyButton('fa-share-alt', function(btn, map){
//   //Navigator Share
//   console.log("click bars");  
//   if (navigator.share) {
//     alert('navigator.share is supported ');
//     try {
//       navigator.share(
//         {
//           title: 'MDN',
//           text: 'Learn web development on MDN!',
//           url: 'https://developer.mozilla.org'
//         }
//       );
//     } catch (err) {
//       console.log('Error: ' + err);
//     }
//   }else{
//     alert("navigator.share is not supported:");
//   }
// }).addTo( map );

// L.easyButton('fa-bars', function(btn, map){
//   // alert("已複製到剪貼簿");  
// }).addTo( map );

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    //Firefox and new Chrome
    navigator.clipboard.writeText(getShareUrl())
    .then(function() {
      /* clipboard successfully set */
    }, function() {
      /* clipboard write failed */
      console.log("ERROR while copy share URL to clipboard");
    });
  } else {
    // Fallback for browsers that do not support navigator.clipboard.writeText
    // for iOS and chrome and better compatibility for newer broser    
    $(".ios-clipboard").show();
    $(".ios-clipboard").val(getShareUrl());
    iosCopyToClipboard(document.getElementsByClassName('ios-clipboard')[0]);
    document.getElementsByClassName('map')[0].focus();
    // document.getSelection().removeAllRanges();
    $(".ios-clipboard").hide();
  }
}

function copyShareURLtoclipboard(e) {
  copyToClipboard(getShareUrl());

  gtag('event', 'share', {
    'event_category': 'engagement',
    'event_label': 'copy URL',
  });
}

function showCoordinates(e) {
  alert(e.latlng);
}
function openNavigate(e) {
  const lookupLatLng = map.getCenter();
  if (L.Browser.android) { //Andoird works perfectly
    shareUrl = "geo:" + lookupLatLng.lat.toFixed(6) + "," + lookupLatLng.lng.toFixed(6) + "?q=" + lookupLatLng.lat.toFixed(6) + "," + lookupLatLng.lng.toFixed(6) + "&z=" + map.getZoom();  // Android pin on the point
  } else { //iOS and PC not so good should handle wscircle action

    if (L.Browser.mobile) { //iOS
      shareUrl = "https://www.google.com/maps/dir/?api=1&destination=" + map.getCenter().lat.toFixed(6) + "," + map.getCenter().lng.toFixed(6); // Android only open APP    
    } else { //PC
      shareUrl = "https://www.google.com/maps/dir/?api=1&destination=" + e.latlng.lat.toFixed(6) + "," + e.latlng.lng.toFixed(6); // Android only open APP    
    }
  }
  window.open(shareUrl);
  gtag('event', 'openMap', {
    'event_category': 'context',
    'event_label': 'navigate',
    'non_interaction': true
  });
}

function openTWMap3(e) {
  const lookupLatLng = map.getCenter();
  shareUrl = "https://map.happyman.idv.tw/~mountain/twmap3/?goto=" + lookupLatLng.lat.toFixed(6) + "," + lookupLatLng.lng.toFixed(6) + "&zoom=" + map.getZoom();
  window.open(shareUrl);
  gtag('event', 'openMap', {
    'event_category': 'context',
    'event_label': 'TWMap3',
    'non_interaction': true
  });
}

function openNLSC(e) {
  const lookupLatLng = map.getCenter();
  shareUrl = "https://maps.nlsc.gov.tw/go/" + lookupLatLng.lng.toFixed(6) + "/" + lookupLatLng.lat.toFixed(6) + "/" + map.getZoom();
  window.open(shareUrl);
  gtag('event', 'openMap', {
    'event_category': 'context',
    'event_label': 'NLSC',
    'non_interaction': true
  });
}

function openMC(e) {
  const lookupLatLng = map.getCenter();
  shareUrl = "https://mc.basecamp.tw/#" + map.getZoom() + "/" + lookupLatLng.lat.toFixed(6) + "/" + lookupLatLng.lng.toFixed(6);
  window.open(shareUrl);
  gtag('event', 'openMap', {
    'event_category': 'context',
    'event_label': 'MC',
    'non_interaction': true
  });
}

function openGM(e) {
  const lookupLatLng = map.getCenter();
  shareUrl = "https://www.google.com/maps/@?api=1&map_action=map&center=" + map.getCenter().lat.toFixed(6) + "," + map.getCenter().lng.toFixed(6) + "&zoom=" + map.getZoom() + "&basemap=satellite";
  window.open(shareUrl);
  gtag('event', 'openMap', {
    'event_category': 'context',
    'event_label': 'GoogleMap',
    'non_interaction': true
  });
}

function openWindy(e) {
  const lookupLatLng = map.getCenter();
  shareUrl = "https://www.windy.com/" + lookupLatLng.lat.toFixed(3) + "/" + lookupLatLng.lng.toFixed(3) + "/meteogram?rain," + lookupLatLng.lat.toFixed(3) + "," + lookupLatLng.lng.toFixed(3) + "," + map.getZoom() + ",m:ek1ajxt";  // Android pin on the point
  window.open(shareUrl);
  gtag('event', 'openFCST', {
    'event_category': 'context',
    'event_label': 'windy',
    'non_interaction': true
  });
}

function openMeteoblue(e) {
  const lookupLatLng = map.getCenter();
  shareUrl = "https://www.meteoblue.com/en/weather/maps/#coords=" + map.getZoom() + "/" + lookupLatLng.lat.toFixed(3) + "/" + lookupLatLng.lng.toFixed(3) + "";  // Android pin on the point
  window.open(shareUrl);
  gtag('event', 'openFCST', {
    'event_category': 'context',
    'event_label': 'mb',
    'non_interaction': true
  });
}

function openWingGuru(e) {
  const lookupLatLng = map.getCenter();
  shareUrl = "https://www.windguru.cz/map/?lat=" + lookupLatLng.lat.toFixed(6) + "&lon=" + lookupLatLng.lng.toFixed(6) + "&zoom=" + map.getZoom();  // Android pin on the point
  window.open(shareUrl);
  gtag('event', 'openFCST', {
    'event_category': 'context',
    'event_label': 'wg',
    'non_interaction': true
  });
}

function centerMap(e) {
  map.panTo(e.latlng);
}

map.on("contextmenu.show", wsLookupOff);
map.on("contextmenu.hide", wsLookupOn);


function getShareUrl() {
  return (window.location.origin + window.location.pathname + "?center=" + map.getCenter().lat.toFixed(6) + "," + map.getCenter().lng.toFixed(6) + "&zoom=" + map.getZoom());
}


map.setView(customcenter, customzoom);



L.Control.urlCtrl4iOS = L.Control.extend({
  onAdd: function (map) {
    var text = L.DomUtil.create('input', "ios-clipboard");
    text.style.width = '100px';
    text.style.display = 'none';
    text.value = "Clipboard";
    return text;
  },
  onRemove: function (map) {
    // Nothing to do here
  }
});
new L.Control.urlCtrl4iOS({ position: 'topright' }).addTo(map);
$(".ios-clipboard").hide();

function iosCopyToClipboard(el) {
  var oldContentEditable = el.contentEditable,
    oldReadOnly = el.readOnly,
    range = document.createRange();

  el.contentEditable = true;
  el.readOnly = false;
  range.selectNodeContents(el);

  var s = window.getSelection();
  s.removeAllRanges();
  s.addRange(range);

  el.setSelectionRange(0, 999999); // A big number, to cover anything that could be inside the element.

  el.contentEditable = oldContentEditable;
  el.readOnly = oldReadOnly;

  document.execCommand('copy');
}



if (urlParams.has('q')) { //URL papameter format: ?center=lat,lng
  if (querypoi = urlParams.get('q').match(/^(\S*)$/)) {
    $(".glass").val(querypoi[1]);
  }
}

// flash URL ? parameters in browser
// history.pushState({page: 1}, "", "?");
history.replaceState(null, "", "?");
// console.log(window.location.search);
