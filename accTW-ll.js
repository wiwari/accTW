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
    icon: 'https://map.happyman.idv.tw/twmap/icons/twmap3.jpg',
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
    minZoom: 13, //native zoom 10~17
    // maxZoom: 19,
    maxZoom: 16,
    maxNativeZoom: 16,
    // zoomOffset: (L.Browser.retina ? -1 : 0),
    // tileSize: (L.Browser.retina ? 512 : 256),
    bounds: ([[21.89080851, 122.01364715], [25.30194682, 120.01663670]]), //WGS DEM bound
  });
happymantile.addTo(map);


const nlscphoto2tile = L.tileLayer(
  'https://wmts.nlsc.gov.tw/wmts/PHOTO2/default/EPSG:3857/{z}/{y}/{x}',
  {
    attribution: '© <strong><a href="https://maps.nlsc.gov.tw/">NLSC</a> </strong>',
    minZoom: 17, //native zoom 7~19 
    maxZoom: 20,
    maxNativeZoom: 19,
    bounds: ([[21.89080851, 122.01364715], [25.30194682, 120.01663670]]), //WGS DEM bound
  });
nlscphoto2tile.addTo(map);

const MOEACGS = L.tileLayer(
  'https://gis3.moeacgs.gov.tw/api/Tile/v1/getTile.cfm?layer=CGS_CGS_MAP&z={z}&x={x}&y={y}',
  {
    // source: https://gis3.moeacgs.gov.tw/api/Tile/v1/oas/#/default/get_getTile_cfm
    attribution: '© <strong><a href="https://gis3.moeacgs.gov.tw">MOEGCGS</a> </strong>',
    minZoom: 7,
    maxZoom: 20,
    minNativeZoom: 1,
    maxNativeZoom: 17,
    opacity: 0.3,
    // interactive: true,  
    bounds: ([[21.89080851, 122.01364715], [25.30194682, 120.01663670]]), //WGS DEM bound  
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

var nlscLiDAR = L.layerGroup([nlscLiDAR2019, nlscLiDAR2020]);
nlscLiDAR.addTo(map);

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
    bounds: ([[21.89080851, 122.01364715], [25.30194682, 120.01663670]]), //WGS DEM bound
  });
happymanBNoverlay.addTo(map);


const nlscEMAPoverlay = L.tileLayer(
  'https://wmts.nlsc.gov.tw/wmts/EMAP12/default/EPSG:3857/{z}/{y}/{x}',
  {
    attribution: '© <strong><a href="https://maps.nlsc.gov.tw/">NLSC</a> </strong>',
    minZoom: 16, //native zoom 9-19
    maxZoom: 19,
    maxNativeZoom: 19,
    bounds: ([[21.89080851, 122.01364715], [25.30194682, 120.01663670]]), //WGS DEM bound  
  });
nlscEMAPoverlay.addTo(map);





// ------------------
// DOC https://github.com/OsmHackTW/terrain-rgb
// ------------------

const dtmTW = L.tileLayer.colorPicker("https://osmhacktw.github.io/terrain-rgb/tiles/{z}/{x}/{y}.png", {  //GITHUB exact commit
  attribution: '© <strong><a href="https://github.com/OsmHackTW/terrain-rgb/">OsmHackTW</a> </strong> ',
  tms: false, // CLI generation required    
  crs: L.CRS.EPSG3857,
  zoomOffset: 0, //DO NOT set zoom offset avoiding RGB smmothing issue.
  tileSize: 256,
  // zoomOffset: -1,
  // tileSize: 512,
  opacity: 0,
  minZoom: 7, //min 10
  // maxZoom: 14,
  minNativeZoom: 6,
  maxNativeZoom: 12,
  bounds: ([[21.89080851, 122.01364715], [25.30194682, 120.01663670]]), //WGS TW DEM bound
  // bounds: ([[20.72799,122.9312], [26.60305,118.1036]]), //bound provided by osmhacktw
}).addTo(map);


// ------------------
// DOC RGBterrain tiles generation https://github.com/syncpoint/terrain-rgb
// ------------------

// const catchment = L.tileLayer.colorPicker("https://osmhacktw.github.io/terrain-rgb/tiles/{z}/{x}/{y}.png", {
// const catchment = L.tileLayer.colorPicker("wsRGBAtiles/{z}/{x}/{y}.png", { //local
// const catchment = L.tileLayer.colorPicker("https://cdn.jsdelivr.net/gh/wiwari/accTW@tiles/dist/{z}/{x}/{y}.png", { //CDN
// const catchment = L.tileLayer.colorPicker("https://cdn.jsdelivr.net/gh/wiwari/accTW@08bca9f6eb1fb64ba0d83cd7903cd7c20b413217/dist/{z}/{x}/{y}.png", {  //CDN exact commit
// const catchment = L.tileLayer.colorPicker("https://raw.githubusercontent.com/wiwari/accTW/tiles/dist/{z}/{x}/{y}.png", {  //GITHUB
const catchment = L.tileLayer.colorPicker("https://raw.githubusercontent.com/wiwari/accTW/08bca9f6eb1fb64ba0d83cd7903cd7c20b413217/dist/{z}/{x}/{y}.png", {  //GITHUB exact commit
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
  bounds: ([[21.89080851, 122.01364715], [25.30194682, 120.01663670]]), //WGS DEM bound
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

  //---- Get catchment acc
  var accPix = catchment.getColor(lookupLatLng);
  var accVal = NaN;
  if (accPix !== null) {
    var accVal = (accPix[0] << 16) + (accPix[1] << 8) + accPix[2];
    // h = h === 0x800000 ? NaN : (h > 0x800000 ? h - 0x1000000 : h) / 100;
    accVal = accVal === 0x800000 ? NaN : (accVal > 0x800000 ? accVal - 0x1000000 : accVal) * 0.1 - 10000.0; //convension base -10000, internal 0.1 
    if (accVal < 0.1 || isNaN(accVal)) {
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
      (accVal < 10) ? "💧" + accVal.toFixed(1) + "km²" : //nodata in raster    
        "💧" + accVal.toFixed(0) + "km²");
  accinfo = "<div>" + accinfo + "</div>";

  dtminfo = (isNaN(dtmVal) ? "" : //no raster data
    "h " + dtmVal.toFixed(0) + "m");
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
  if (map.getZoom() >= 8 && map.getZoom() <= 18) {
    lyctrl.addOverlay(read_catchment, "集水面積");
    read_catchment.addLayer(wscircle);    
  }  
    streams.setUniform('uWaterThreshold', (0.1 * Math.pow(3,15-map.getZoom())));
    // streams.reRender();
    if (map.getZoom() >= streams.options.maxNativeZoom )
      streams.redraw(); //workaround alpha issue in tilelayer.gl while over zoomed
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


async function queryMOEACGS(e) {
  // Todo 地質查詢 ================================
  // https://gis3.moeacgs.gov.tw/api/Tile/v1/oas/#/default/get_getTooltip_cfm
  // 地質資訊 https://gis3.moeacgs.gov.tw/api/Tile/v1/getTooltip.cfm?layer=TYPE3&z=12&x=309758&y=2730559
  // (EPSG:3826)
  // zoom: 1-17

  //4326轉3826 (經緯度轉TWD97)
  var tw97 = proj4(EPSG4326, EPSG3826, [e.latlng.lng, e.latlng.lat]);
  // console.log(tw97[0],  tw97[1]);
  const queryzoom = (map.getZoom() > 17) ? 17 : map.getZoom();
  await $.getJSON("https://gis3.moeacgs.gov.tw/api/Tile/v1/getTooltip.cfm?layer=TYPE3&z=" + queryzoom + "&x=" + tw97[0] + "&y=" + tw97[1], function (data) {
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
      L.popup({ className: "moeacgs-div-span", MOEACGS})
        .setLatLng(e.latlng)
        .setContent("<ul>" + cleandata + "</ul>")
        .openOn(map);
    }
    gtag('event', 'queryMOEACGS', {
      'event_category': 'layer',
      'event_label': 'MOEACGS',
    });
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
  "正射影像": nlscphoto2tile,
}, {
  "光達影像": nlscLiDAR, "地質查詢": MOEACGS, "產生器GPX": happymanGPXoverlay, "產生器BN": happymanBNoverlay, "nlsc透明": nlscEMAPoverlay,
  //"集水區":read_catchment,
}).addTo(map);


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

  wl_url_w = "https://gweb.wra.gov.tw/HydroInfoMobile/hichart?stno=" + layer.feature.properties.id + "&category=rtLE&deptID=" + layer.feature.properties.TownIdentifier + "&sdate=" + sWDate_str + "&edate=" + eDate_str;
  wl_url_m = "https://gweb.wra.gov.tw/HydroInfoMobile/hichart?stno=" + layer.feature.properties.id + "&category=rtLE&deptID=" + layer.feature.properties.TownIdentifier + "&sdate=" + sMDate_str + "&edate=" + eDate_str;
  wl_url_q = "https://gweb.wra.gov.tw/HydroInfoMobile/hichart?stno=" + layer.feature.properties.id + "&category=rtLE&deptID=" + layer.feature.properties.TownIdentifier + "&sdate=" + sQDate_str + "&edate=" + eDate_str;
  wl_url_y = "https://gweb.wra.gov.tw/HydroInfoMobile/hichart?stno=" + layer.feature.properties.id + "&category=rtLE&deptID=" + layer.feature.properties.TownIdentifier + "&sdate=" + sYDate_str + "&edate=" + eDate_str;

  
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


  wlpopupmsg=
    '<div class="container-sm">' +
    layer.feature.properties.name + " : "
    /* + layer.feature.properties.id*/
    + layer.feature.properties.river + "<br/>"
    + '即時：'
    + ' <a href="' + wl_url_w + '" target="_blank" class="btn btn-outline-primary btn-sm" >週</a>'
    + ' <a href="' + wl_url_m + '" target="_blank" class="btn btn-outline-primary btn-sm" >月</a>'
    + ' <a href="' + wl_url_q + '" target="_blank" class="btn btn-outline-primary btn-sm" >季</a>'
    + ' <a href="' + wl_url_y + '" target="_blank" class="btn btn-outline-primary btn-sm" >年</a><br />'
    ;
  his_str="";
  if (layer.feature.properties.ObervationItems.match("0"))
    his_str += "水位";    
  if (layer.feature.properties.ObervationItems.match("1"))
    his_str += "流量";    
  if (his_str)
    wlpopupmsg += '歷史： <a href="' + wl_url_le + '" target="_blank" class="btn btn-outline-primary btn-sm" >' + his_str + '</a>';
  // if (layer.feature.properties.ObervationItems.match("2"))
  //   wlpopupmsg += '含沙量';
  // if (layer.feature.properties.ObervationItems.match("4"))
  // wlpopupmsg += '流速';

    // + '<br />' + wlrtstr
  wlpopupmsg += '</div>';

  return wlpopupmsg; 

});

waterlevelLayer.on('add',
  function(){
    if (map.getZoom() <=9) map.setZoom(10);  
    read_catchment.remove();
  }
);

lyctrl.addOverlay(waterlevelLayer, "水位站");


  // wl_ly.addTo(map);

  // Get realtime waterlevel data
  // https://data.wra.gov.tw/Service/OpenData.aspx?format=json&id=2D09DB8B-6A1B-485E-88B5-923A462F475C 
  var realtime_waterlevel={};  
    $.getJSON("https://api.allorigins.win/get?url=https%3A//data.wra.gov.tw/Service/OpenData.aspx%3Fformat%3Djson%26id%3D2D09DB8B-6A1B-485E-88B5-923A462F475C&callback=?", function (data) {    
      
    wlrt_obj=JSON.parse(data.contents);    
      wlrt_obj["RealtimeWaterLevel_OPENDATA"].forEach(element => {
        realtime_waterlevel[element.StationIdentifier] = {'RecordTime':element.RecordTime,'WaterLevel':element.WaterLevel};
      });
    });
    // console.log(realtime_waterlevel);
  
    // Get waterlevel station information
  async function readWLStatGeoJON() {    
    // Query Station of Water Level  //https://data.wra.gov.tw/Service/OpenData.aspx?format=json&id=28E06316-FE39-40E2-8C35-7BF070FD8697
    
    await $.getJSON("wra/28E06316-FE39-40E2-8C35-7BF070FD8697.json")
    // await $.getJSON("https://data.wra.gov.tw/Service/OpenData.aspx?format=json&id=28E06316-FE39-40E2-8C35-7BF070FD8697")  //not supporting CORS
    // await $.getJSON("https://api.allorigins.win/get?url=https%3A//data.wra.gov.tw/Service/OpenData.aspx%3Fformat%3Djson%26id%3D28E06316-FE39-40E2-8C35-7BF070FD8697&callback=?")
      .done(function (data) {        
        wl_obs=data;
        // console.log("second success");
        // wl_obs = JSON.parse(data.contents); //for allorigins parsing        
        wl_obs.RiverStageObservatoryProfile_OPENDATA.forEach(ob => {

          sta_id=ob.BasinIdentifier.replace(/ /g, "");
          sta_name=ob.ObservatoryName.replace(/ /g, "");
          sta_river=ob.RiverName.replace(/ /g, "");
          sta_TownIdentifier=ob.TownIdentifier.replace(/ /g, "");
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
                "TownIdentifier" : sta_TownIdentifier,                
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
      .fail(function (data) {
        console.log("WL Station query error");
      })
      .always(function (data) { 
        1;       
        // console.log("complete");
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
  'ELEV':'海拔',
  'RAIN':'一小時',
  'MIN_10' : '十分鐘',
  'HOUR_3':'三小時',
  'HOUR_6':'六小時',
  'HOUR_12':'12小時',
  'HOUR_24':'24小時',
  'NOW':'今日',
  'latest_2days':'二日',
  'latest_3days':'三日'
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

// 站位圖示 https://www.cwb.gov.tw/V8/C/P/Rainfall/Rainfall_PlotImg.html?ID=81AJ1
// https://www.cwb.gov.tw/V8/C/P/Rainfall/Rainfall_PlotImg.html?ID=C0UA5 
// 雨量摘要 https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0002-001?Authorization=rdec-key-123-45678-011121314&locationName=%E4%B9%9D%E4%BB%BD%E4%BA%8C%E5%B1%B1&elementName=
// 雨量站說明 https://e-service.cwb.gov.tw/wdps/obs/state.htm




// lyctrl.addOverlay(RALayer,"雨量站");




var rainstations={};

//水利署水文資訊網 https://gweb.wra.gov.tw/HydroInfoMobile/hichart?stno=01U050&category=rtRA&deptID=1&sdate=2021/10/22&edate=2021/10/25&flow_cnt=&searchType=
//氣象局站位 API https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0002-001?Authorization=rdec-key-123-45678-011121314&format=JSON&elementName=ELEV
//氣象局 API https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0002-001?Authorization=rdec-key-123-45678-011121314
//氣象局 JSON https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/O-A0002-001?Authorization=rdec-key-123-45678-011121314&format=JSON 
async function readRAStatGeoJON() {    
  // Query Station of Water Level  //https://data.wra.gov.tw/Service/OpenData.aspx?format=json&id=28E06316-FE39-40E2-8C35-7BF070FD8697
   
  await $.getJSON("https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0002-001?Authorization=rdec-key-123-45678-011121314&format=JSON&elementName=ELEV&parameterName=ATTRIBUTE")
    .done(function (data) {      
      rainstations=data;
      // console.log("RA second success");
      if(rainstations.success){
        // console.log("Read OK!");
        data.records.location.forEach(element => {
          // sta_id=element.stationId.replace(/ /g, "");
          sta_id=element.stationId.replace(/ /g, "");
          sta_name=element.locationName.replace(/ /g, "");
          sta_time=element.time;
          sta_lat=element.lat.replace(/ /g, "");
          sta_lon=element.lon.replace(/ /g, "");           
          // console.log(element.locationName, element.stationId,element.lat,element.lon,element.time );
          pt = {
            "type": "Feature",
            "properties": {
              "id": sta_id,
              "name": sta_name,    
              "time" : sta_time,   
            },
            "geometry": {
              "type": "Point",
              "coordinates": [sta_lon, sta_lat]
            }
          };
          RALayer.addData(pt);
        });
      }      
      data.records.location[0].locationName;
    })
    .fail(function (data) {
      console.log("RA Station query error");
    })
    .always(function (data) { 
      1;
      // console.log("complete");
    });
}


$.ajaxSettings.async = false;
readRAStatGeoJON();
$.ajaxSettings.async = true;

var clusterRA = L.markerClusterGroup();
clusterRA.bindPopup( function (layer) {
  gtag('event', 'click', {
    'event_category': 'rainfall',
    'event_label': "station: " + layer.feature.properties.name,
  });
  // $.ajaxSettings.async = false;
  // $.getJSON("https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0002-001?Authorization=rdec-key-123-45678-011121314&locationName=" + layer.feature.properties.name + "&elementName=RAIN,HOUR_3,HOUR_6,HOUR_12,HOUR_24,NOW,latest_2days,latest_3days",function (data) {
  $.getJSON("https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0002-001?Authorization=rdec-key-123-45678-011121314&locationName=" + layer.feature.properties.name + "&elementName=HOUR_6,HOUR_12,HOUR_24,NOW,latest_2days,latest_3days",function (data) {
    RApoi="";
    if(data.success){
      // console.log("OK!");
      rra=data;
      // if (rra.records.location[0].locationName == layer.feature.properties.name) {
        rra.records.location.forEach(loc => {                
          if (loc.stationId == layer.feature.properties.id) {    
            RApoi+='<table class="table table-sm"><tbody>';
            loc.weatherElement.forEach(el => {
              // console.log(el.elementName,el.elementValue);
              rainvalue = (el.elementValue > 0) ? parseFloat(el.elementValue).toFixed(1):
                (el.elementValue = -998) ? "0.0" : "--";
              //// Table tag
              
              RApoi += '<tr><th scope="row" >'+str_RA[el.elementName] + '</th><td class="text-right">' + rainvalue + '</td></tr>';
              

              // Div tag
              
              // RApoi+='<div class="row">';
              // RApoi+='<div class="col-sm text-break">'+str_RA[el.elementName] + '</div><div class="col-sm">' + rainvalue + '</div>';
              // RApoi+='</div>';
              
              

            });
          RApoi+='</tbody></table>';  
          }
          
      });      
      // data: ELEV, RAIN, MIN_10, HOUR_3, HOUR_6, HOUR_12, HOUR_24, NOW, latest_2days, latest_3days
    }
  
  });
  // $.ajaxSettings.async = true;

  //水利署所有站位 https://gweb.wra.gov.tw/Hydroinfo/WraSTList/

  RApopupmsg = "";
  RApopupmsg += '<div class="container-fluid">';
  RApopupmsg += layer.feature.properties.name + " (" +layer.feature.properties.id+") <br />" ;  
  RApopupmsg += '<a href="https://www.cwb.gov.tw/V8/C/P/Rainfall/Rainfall_PlotImg.html?ID=' + layer.feature.properties.id.replace(/(.....)./, "$1") + '" target="_blank" class="btn btn-outline-primary btn-sm">' +'即時' + '</a>';
  RApopupmsg += cwbCodis.exist(layer.feature.properties.id)? '<a href="'+cwbCodis.url(layer.feature.properties.id)+'" target="_blank" class="btn btn-outline-primary btn-sm">' +'月報' + '</a>' : '';
  RApopupmsg += '<a href="https://gweb.wra.gov.tw/HydroInfo/StDataInfo/StDataInfo?RA&' + layer.feature.properties.id.replace(/(......)/, "$1") + '" target="_blank" class="btn btn-outline-primary btn-sm">' + "歷史" + '</a>' + "<br />";
  // RApopupmsg+= layer.feature.properties.river + "<br/>"    ;
  // RApopupmsg+='<br />' + wlrtstr;
  RApopupmsg += RApoi;
  RApopupmsg += '</div>';
  return RApopupmsg;



});
clusterRA.addLayer(RALayer);

clusterRA.on('add',
  function(){
    if (map.getZoom() <=9) map.setZoom(10);  
    read_catchment.remove();
  }
);

lyctrl.addOverlay(clusterRA, "雨量站");





// 考慮改用 https://fhy.wra.gov.tw/WraApi#!/ReservoirApi/ReservoirApi_Station
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
  popupinfo = "";
  popupinfo += '<div class="container-sm">';
  popupinfo += layer.feature.properties.name ;
  popupinfo += (layer.feature.properties.id) ? "(" + layer.feature.properties.id + ")" :'';
  popupinfo += "<br/>";  
  popupinfo += (layer.feature.properties.date) ? layer.feature.properties.date.replace(/(....-..-..)T.*/, "$1") + "<br/>" : '';
  popupinfo += (layer.feature.properties.InflowTotal) ? "流入" + (layer.feature.properties.InflowTotal * 10000 / 24 / 60 / 60).toFixed(2) + "<sub>m³/s</sub><br/>" : '';
  popupinfo += (layer.feature.properties.OutflowTotal) ? "流出" + (layer.feature.properties.OutflowTotal * 10000 / 24 / 60 / 60).toFixed(2) + "<sub>m³/s</sub><br/>" : '';
  popupinfo += (wrafhy_activeStationNo.includes(parseInt(layer.feature.properties.id)))? '<a href="https://wiwari.github.io/wra-fhy/?StationNo='+ layer.feature.properties.id +' " target="_blank" class="btn btn-outline-primary btn-sm">近日平均流量</a>' : '';
  popupinfo += '</div>';

  return popupinfo;
     
});

wraRES.on('add',
  function(){
    if (map.getZoom() <=9) map.setZoom(10);  
    read_catchment.remove();
  }
);
lyctrl.addOverlay(wraRES, "水庫堤壩");

var wraRESshp = null;
getwraRESshp();
function getwraRESshp() {
  $.ajaxSettings.async = false;
  $.getJSON("wra/SWRESOIR.json", function (data) {
    wraRESshp = data;
    getwraRESdailyAPI();
  });
  $.ajaxSettings.async = true;
  
}


var wrafhy_activeStationNo= null;
getwrafhyActiveStationNo();
function getwrafhyActiveStationNo() {
  $.ajaxSettings.async = false;
  $.getJSON("/wra-fhy/data/active_stations.json", function (data) {
    wrafhy_activeStationNo = data[0].StationNoList;    
  });
  $.ajaxSettings.async = true;
  
}


var wraRESdailyAPI ={};


var wraRESstaAPI = {};

function getwraRESstaAPI() {
  $.ajax({ //GET JSON with header
    dataType: "json",
    beforeSend: function (request) {
      request.setRequestHeader("Accept", "application/json");
    },
    // url: "https://fhy.wra.gov.tw/WraApi/v1/Reservoir/Station",
    url: "https://fhy.wra.gov.tw/WraApi/v1/Reservoir/Station?$select=Latitude,Longitude,StationNo,StationName",
    // data: data,
    success: async function (data) {
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
          if (rt_sta.StationNo == sta['StationNo']){
            sta['date']=rt_sta['Time'];
            if(rt_sta['InflowTotal'])              
              sta['InflowTotal']=rt_sta['InflowTotal'];
            if(rt_sta['OutflowTotal'])
              sta['OutflowTotal']=rt_sta['OutflowTotal'];

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
    }
  });
}








function getwraRESdailyAPI() {
  $.ajaxSettings.async = false;
  $.ajax({
    //GET JSON with header
    dataType: "json",
    beforeSend: function (request) {
      request.setRequestHeader("Accept", "application/json");
    },
    url: "https://fhy.wra.gov.tw/WraApi/v1/Reservoir/Daily",
    // url: "https://fhy.wra.gov.tw/WraApi/v1/Reservoir/Daily",
    // url: "https://data.wra.gov.tw/Service/OpenData.aspx?format=json&id=50C8256D-30C5-4B8D-9B84-2E14D5C6DF71" ,
    // data: data,
    success: function (data) {
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

    }
  });
  $.ajaxSettings.async = true;
}

// ===============
// CCTV
const staCCTV = L.geoJSON([], {
  pointToLayer: function (geoJsonPoint, latlng) {
    return L.marker(latlng, { icon: cameraIcon });
  }
});

//----------------
getCCTV();
function getCCTV() {
  $.ajaxSettings.async = false;
  $.getJSON("wrafmg/cctv.geojson", function (data) {
 
    data.features.forEach(sta => {
        staCCTV.addData(sta);
    });
  });
  $.ajaxSettings.async = true;  
}

//              ---- cluster BEGIN
var clusterCCTV = L.markerClusterGroup(
  {
    // zoomToBoundsOnClick: false,
    disableClusteringAtZoom: 17
  });



clusterCCTV.addLayer(staCCTV);
// map.addLayer(clusterCCTV);



 clusterCCTV.bindPopup(function (layer) {

  gtag('event', 'click', {
    'event_category': 'cctv',
    'event_label': "station: " + layer.feature.properties.name 
  });
  
  popupinfo = "";
  popupinfo += '<div class="container-sm">';
  popupinfo += layer.feature.properties.name  ;
  popupinfo += '<a href="' +layer.feature.properties.DivSrc +' " target="_blank" class="btn btn-outline-primary btn-sm"> 預覽 <i class="fa fa-camera " aria-hidden="true" ></i> </a>' +'<br />' ;
  popupinfo += layer.feature.properties.OpenName;
  if (layer.feature.properties.OpenSrc != null)
    popupinfo += '<a href="' +layer.feature.properties.OpenSrc +' " target="_blank" class="btn btn-outline-primary btn-sm"> 完整 <i class="fa fa-camera " aria-hidden="true" ></i> </a>' ;

  popupinfo += '<br />' ;
  popupinfo += layer.feature.properties.provider ;
  popupinfo += '</div>' ;

  return popupinfo;
     
});

lyctrl.addOverlay(clusterCCTV, "CCTV");


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



// === end of CCTV ================ 




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



// https://gitlab.com/IvanSanchez/Leaflet.TileLayer.GL
var glShaderStreams = `
  // precision highp float;       // Use 24-bit floating point numbers for everything
  // uniform float uNow;          // Microseconds since page load, as per performance.now()
  // uniform vec3 uTileCoords;    // Tile coordinates, as given to L.TileLayer.getTileUrl()
  // varying vec2 vTextureCoords; // Pixel coordinates of this fragment, to fetch texture color
  // varying vec2 vCRSCoords;     // CRS coordinates of this fragment
  // varying vec2 vLatLngCoords;  // Lat-Lng coordinates of this fragment (linearly interpolated)
  // uniform sampler2D uTexture0;  
  
  void main(void) {
    highp vec4 texelColour = texture2D(uTexture0, vec2(vTextureCoords.s, vTextureCoords.t));
  
    // Color ramp. The alpha value represents the elevation for that RGB colour stop.
    vec4 colours[11];
    float stepHeight[11];
    colours[0] = vec4(0.0, 0.0, 0.2, 0.0);
    colours[1] = vec4(1.0, 0.0, 0.0, 0.3);       
    colours[2] = vec4(1.0, 1.0, 0.0, 0.6);
    colours[3] = vec4(0.0, 0.8, 0.0, 0.7);
    colours[4] = vec4(0.0, 0.8, 0.5,1.0);
    colours[5] = vec4(0.0, 0.8, 0.9, 1.0);
    colours[6] = vec4(0.0, 0.5, 0.9, 1.0);
    colours[7] = vec4(0.0, 0.1, 0.9, 1.0);
    colours[8] = vec4(0.9, 0.0, 0.9, 1.0);
    colours[9] = vec4(0.6, 0.0, 0.7, 1.0);    
    colours[10] = vec4(0.4, 0.0 , 0.5, 1.0);     
    stepHeight[0] = log(0.01);
    stepHeight[1] = log(0.1);       
    stepHeight[2] = log(0.5);
    stepHeight[3] = log(1.0);
    stepHeight[4] = log(4.0);
    stepHeight[5] = log(5.0);
    stepHeight[6] = log(30.0);
    stepHeight[7] = log(100.0);
    stepHeight[8] = log(300.0);
    stepHeight[9] = log(1500.0);    
    stepHeight[10] = log(3500.0);  
      
    // Height is represented in TENTHS of a meter
    highp float height = (
      texelColour.r * 255.0 * 256.0 * 256.0 +
      texelColour.g * 255.0 * 256.0 +
      texelColour.b * 255.0 )/10.
    -10000.0;
      
    vec4 newcolor ;
      
    newcolor = colours[0].rgba;
  
    for (int i=0; i < 10; i++) {
      // Do a smoothstep of the heights between steps. If the result is > 0
      // (meaning "the height is higher than the lower bound of this step"),
      // then replace the colour with a linear blend of the step.
      // If the result is 1, this means that the real colour will be applied
      // in a later loop.
  
      newcolor = mix(
        newcolor,
        colours[i+1].rgba,
        smoothstep( stepHeight[i], stepHeight[i+1], log(height) )
      );
    }
      
    if (height < uWaterThreshold){
      gl_FragColor = vec4(0.,0.0,0.0,0.);
    }else{
      gl_FragColor = vec4(newcolor.rgba);
    }    
  }
  
`

var streams = L.tileLayer.gl({
  fragmentShader: glShaderStreams,  
  tileLayers: [catchment],
  // tileUrls: ['https://raw.githubusercontent.com/wiwari/accTW/08bca9f6eb1fb64ba0d83cd7903cd7c20b413217/dist/{z}/{x}/{y}.png'],
  uniforms: {
	  uWaterThreshold: 72.9, //0.1,
    // uWaterAlphaMin: 0.1,
    // uWaterAlphaMax: 5.0,
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
  bounds: ([[21.89080851, 122.01364715], [25.30194682, 120.01663670]]), //WGS DEM bound
}).addTo(map);
lyctrl.addOverlay(streams, "水線著色⁺");





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


function copyShareURLtoclipboard(e) {
  // // for Firfox only
  // console.log("not iOS");
  // navigator.clipboard.writeText(getShareUrl()).then(function() {
  //   /* clipboard successfully set */
  //   // console.log("pasted");
  // }, function() {
  //   /* clipboard write failed */
  //   console.log("ERROR while copy share URL to clipboard");
  // });

  // for iOS and chrome and better compatibility for newer broser    
  $(".ios-clipboard").show();
  $(".ios-clipboard").val(getShareUrl());
  iosCopyToClipboard(document.getElementsByClassName('ios-clipboard')[0]);
  document.getElementsByClassName('map')[0].focus();
  // document.getSelection().removeAllRanges();
  $(".ios-clipboard").hide();

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