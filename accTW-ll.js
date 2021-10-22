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
var customcenter =new L.latLng(23.6, 121); //default view for Shensan Canyon

// const ios=!window.MSStream && /iPad|iPhone|iPod/.test(navigator.userAgent); //iOS detection

const regxCenter=/^(-?\d+.?\d+),(-?\d+.?\d+)$/;  
if(urlParams.has('center')) //URL papameter format: ?center=lat,lng
  if (found = urlParams.get('center').match(regxCenter)){
    customcenter = new L.latLng(found[1],found[2]);     
  }

// a nice way to share to different APPs
  //geo:23.458,120.267?z=8

//#map=8/23.611/120.768 refer to openstreetmap
// console.log(window.location.hash); //show hash
// https://github.com/mlevans/leaflet-hash

// URI Parameter
// https://github.com/rwev/leaflet-view-meta


// ?zoom=8&center=25,121

if(urlParams.has('zoom')) //URL papameter format: ?center=lat,lng
  if (foundz = urlParams.get('zoom').match(/^(\d*)$/)){
    customzoom = parseInt(foundz[1],10);    
}



const map = L.map('map',{
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
  }, '-',  {
	    text: 'NLSC...',
      // iconCls: 'fa fa-map-o',
      icon:'https://maps.nlsc.gov.tw/pics/icon-60x60-ios.png',
	    callback: openNLSC,
  }, {
	    text: '地圖瀏覽器...',
      // iconCls: 'fa fa-map-o',
      icon: 'https://map.happyman.idv.tw/twmap/icons/twmap3.jpg',
	    callback: openTWMap3,      
  }, {	    text: '地圖對照器...',
      iconCls: 'fa fa-map-o',
	    callback: openMC,
  }, {	    text: 'Google地圖...',
      // iconCls: 'fa fa-map-o',
      icon: 'https://lh3.googleusercontent.com/V0Lu6YzAVaCVcjSJ_4Qb0mR_idw-GApETGbkodvDKTH-rpDvHuD6J84jshR_FvXdl5mJxqbIHVdebYCCbQMJNxIxRaIHYFSq6z7laA',
	    callback: openGM,
  }, '-', {	    text: 'Windy...',
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
      icon:'https://www.meteoblue.com/favicon.ico',
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
  zoomControl: true,
  // boxZoom: true,
  wheelPxPerZoomLevel : 200,
  wheelDebounceTime: 30,
  doubleTapDragZoom: "center",
  keyboard: true,
  bounds: ([[5,100], [40,140]]), //WGS DEM bound
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
  // 'https://tile.happyman.idv.tw/map/moi_osm/{z}/{x}/{y}.png',
  'https://rs.happyman.idv.tw/map/moi_osm/{z}/{x}/{y}.png',
  {
    attribution: '© <strong><a href="https://map.happyman.idv.tw/~mountain/twmap3/">地圖瀏覽器</a> </strong> ',
    minZoom: 13, //native zoom 10~17
    // maxZoom: 19,
    maxZoom: 16,
    maxNativeZoom: 16,
    // zoomOffset: (L.Browser.retina ? -1 : 0),
    // tileSize: (L.Browser.retina ? 512 : 256),
    bounds: ([[21.89080851,122.01364715], [25.30194682,120.01663670]]), //WGS DEM bound
  });
happymantile.addTo(map);


const nlscphoto2tile = L.tileLayer(
  'https://wmts.nlsc.gov.tw/wmts/PHOTO2/default/EPSG:3857/{z}/{y}/{x}',
  {
    attribution: '© <strong><a href="https://maps.nlsc.gov.tw/">NLSC</a> </strong>',
    minZoom: 17, //native zoom 7~19 
    maxZoom: 20,
    maxNativeZoom: 19,
    bounds: ([[21.89080851,122.01364715], [25.30194682,120.01663670]]), //WGS DEM bound
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
    bounds: ([[21.89080851,122.01364715], [25.30194682,120.01663670]]), //WGS DEM bound  
  });
  // MOEACGS.addTo(map);



// var popupMOEACGS = L.popup()
//   .setLatLng(map.getCenter())
//   .setContent('<p>Hello world!<br />This is a nice popup.</p>')
//   .openOn(MOEACGS);

MOEACGS.on("add", eadd);
function eadd(e){
  map.on("click", queryMOEACGS);
  gtag('event', 'layerOn', {
    'event_category': 'layer',
    'event_label': 'MOEACGS',
  });
}
MOEACGS.on("remove", eremove);
function eremove(e){  
  map.off("click", queryMOEACGS);
  gtag('event', 'layerOff', {
    'event_category': 'layer',
    'event_label': 'MOEACGS',
  });
}

const nlscLiDAR2019 = L.tileLayer(
  'https://wmts.nlsc.gov.tw/wmts/LiDAR2019/default/EPSG:3857/{z}/{y}/{x}',
  {
    attribution: '© <strong><a href="https://maps.nlsc.gov.tw/">NLSC</a> </strong>',
    minZoom: 17, //native zoom 9-20, set 17 as default 
    maxZoom: 21,
    maxNativeZoom: 20,
    bounds: ([[23.923255,120.482868],[24.498475,121.508168]]),    
  });
// nlscLiDAR2019.addTo(map);
const nlscLiDAR2020 = L.tileLayer(
  'https://wmts.nlsc.gov.tw/wmts/LiDAR2020/default/EPSG:3857/{z}/{y}/{x}',
  {
    attribution: '© <strong><a href="https://maps.nlsc.gov.tw/">NLSC</a> </strong>',
    minZoom: 17, //native zoom 9-20, set 17 as default 
    maxZoom: 21,
    maxNativeZoom: 20,
    bounds: ([[22.723201,120.857965],[23.94844,121.133177]]),
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
    bounds: ([[21.89080851,122.01364715], [25.30194682,120.01663670]]), //WGS DEM bound
  });
happymanBNoverlay.addTo(map);

      
const nlscEMAPoverlay = L.tileLayer(
  'https://wmts.nlsc.gov.tw/wmts/EMAP12/default/EPSG:3857/{z}/{y}/{x}',
  {
    attribution: '© <strong><a href="https://maps.nlsc.gov.tw/">NLSC</a> </strong>',
    minZoom: 16, //native zoom 9-19
    maxZoom: 19,
    maxNativeZoom: 19,
    bounds: ([[21.89080851,122.01364715], [25.30194682,120.01663670]]), //WGS DEM bound  
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
  bounds: ([[21.89080851,122.01364715], [25.30194682,120.01663670]]), //WGS TW DEM bound
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
  bounds: ([[21.89080851,122.01364715], [25.30194682,120.01663670]]), //WGS DEM bound
}).addTo(map);

// test show basin size
const wscircle = L.circle([22.75, 120.75], { radius: 2000, dashArray: '2, 6', interactive: false, fillOpacity: 0, });
basinsizeTP = L.tooltip({ offset: L.point(30, -30), opacity:1 });
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
      wscircle.setStyle({opacity:0});
    } else {
      wscircle.openTooltip();
      wscircle.setStyle({opacity:1});
    }
    if ((accVal) >= 0.0) {
      wscircle.setRadius(1000.0 * Math.sqrt(accVal / Math.PI));
    }
  }

  //---- Get DTM
  var dtmPix = dtmTW.getColor(lookupLatLng);
  var dtmVal = NaN;
  if (dtmPix !== null) {
    var dtmVal = (dtmPix[0] << 16) + (dtmPix[1] << 8) + dtmPix[2];
    // h = h === 0x800000 ? NaN : (h > 0x800000 ? h - 0x1000000 : h) / 100;
    dtmVal = dtmVal === 0x800000 ? NaN : (dtmVal > 0x800000 ? dtmVal - 0x1000000 : dtmVal) * 0.1 - 10000.0; //convension base -10000, internal 0.1
  }
  
  accinfo=(isNaN(accVal) ? "" : //no raster data
    (accVal < 0) ? "" : //nodata in raster
    (accVal < 10) ? "💧"+accVal.toFixed(1) + "km²" : //nodata in raster    
    "💧"+accVal.toFixed(0) + "km²");
    accinfo = "<div>"+accinfo+"</div>";
  
  dtminfo = (isNaN(dtmVal) ? "" : //no raster data
     "h "+dtmVal.toFixed(0) + "m" );
  dtminfo = "<div>"+dtminfo+"</div>";

  promptinfo = accinfo + dtminfo ;
  wscircle.setTooltipContent(promptinfo);
  // map.attributionControl.setPrefix(promptinfo);  
}

// geo:23.458,120.267?z=8 

read_catchment=L.featureGroup();
read_catchment.addLayer(catchment);
// read_catchment.addLayer(wscircle);

read_catchment.on("add",wsLookupOn);
read_catchment.on("remove ",wsLookupOff);
map.on("zoomend", zoomend_check);
map.on("zoomstart", zoomstart_check);


function zoomend_check(e){
  if (map.getZoom()>=8 && map.getZoom()<=18){
    lyctrl.addOverlay(read_catchment,"集水面積");
    read_catchment.addLayer(wscircle);
  }  
}
function zoomstart_check(e){
  if (map.getZoom()>=8 && map.getZoom()<=18){
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
      '+proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=aust_SA'
    ]
   ]);
  var EPSG3826 = new proj4.Proj('EPSG:3826');//TWD97 121分帶  
  var EPSG4326 = new proj4.Proj('EPSG:4326');//WGS84
 
async function queryMOEACGS(e){
  // Todo 地質查詢 ================================
  // https://gis3.moeacgs.gov.tw/api/Tile/v1/oas/#/default/get_getTooltip_cfm
  // 地質資訊 https://gis3.moeacgs.gov.tw/api/Tile/v1/getTooltip.cfm?layer=TYPE3&z=12&x=309758&y=2730559
  // (EPSG:3826)
  // zoom: 1-17

  //4326轉3826 (經緯度轉TWD97)
  var tw97 = proj4(EPSG4326, EPSG3826, [e.latlng.lng , e.latlng.lat ]);  
  // console.log(tw97[0],  tw97[1]);
  const queryzoom = (map.getZoom() > 17) ? 17 : map.getZoom();
  await $.getJSON("https://gis3.moeacgs.gov.tw/api/Tile/v1/getTooltip.cfm?layer=TYPE3&z=" + queryzoom + "&x=" + tw97[0] + "&y=" + tw97[1], function (data) {
    var cleandata = data['tooltip'];
    cleandata = cleandata.replace(/構造名稱：/g,"");
    cleandata = cleandata.replace(/構造名稱：\s*\n/g,"");
    cleandata = cleandata.replace(/構造描述：/g,"");
    cleandata = cleandata.replace(/地質年代：/g,"");    
    cleandata = cleandata.replace(/地層名稱：/g,"");
    cleandata = cleandata.replace(/圖例描述：/g,"");
    cleandata = cleandata.replace(/斷層名稱：/g,"");
    cleandata = cleandata.replace(/斷層描述：/g,"");
    cleandata = cleandata.replace(/地層組成：/g,"");
    cleandata = cleandata.replace(/(資料來源：\s*一百萬分之一臺灣區域地質圖數值檔)[,-](\S*)[,-](\d\d\d\d)/g,"1M地質圖, $3");    
    cleandata = cleandata.replace(/(資料來源：\s*五十萬分之一臺灣區域地質圖數值檔)[,-](\S*)[,-](\d\d\d\d)/g,"50萬地質圖, $3");
    cleandata = cleandata.replace(/(資料來源：五十萬分之一臺灣區域地質圖數值檔-臺灣)/g,"50萬地質圖"); 
    cleandata = cleandata.replace(/(資料來源：\s*二十五萬分之一臺灣區域地質圖數值檔)[,-](\S*)[,-](\d\d\d\d)/g,"25萬地質圖, $3"); 
    cleandata = cleandata.replace(/(資料來源：\s*二十五萬分之一臺灣區域地質圖數值檔-臺灣)/g,"25萬地質圖");     
    cleandata = cleandata.replace(/(資料來源：\s*五萬分之一臺灣區域地質圖數值檔)[,-](\S*)[,-](\d\d\d\d)/g,"5萬地質圖-$2, $3");                                         
    cleandata = cleandata.replace(/([^\n]+)/g,"<li>$1</li>");
    // cleandata = cleandata.replace(/([^\n]+)/g,"$1");
    cleandata = cleandata.replace(/\s+/g," ");    
    cleandata = cleandata.replace(/(\S)\(/g,"$1 (");
    cleandata = cleandata.replace(/\(/g,"<br />(");
    cleandata = cleandata.replace(/\s+\)/g,")");
    cleandata = cleandata.replace(/，/g,"、");
    if (cleandata != ""){
    L.popup({className: "moeacgs-div-span",})
      .setLatLng(e.latlng)
      .setContent("<ul>"+cleandata+"</ul>")
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


const lyctrl=L.control.layers({
  "正射影像":nlscphoto2tile,
},{
  "光達影像":nlscLiDAR,"地質查詢":MOEACGS,"產生器GPX":happymanGPXoverlay,"產生器BN":happymanBNoverlay,"nlsc透明":nlscEMAPoverlay,
  //"集水區":read_catchment,
}).addTo(map);



function wsLookupOff(event){    
  
  if (L.Browser.mobile) {
    map.off("move", lookupvalue);
  } else {
    map.off("mousemove", lookupvalue);
  }
  wscircle.closeTooltip();
  // read_catchment.removeFrom(map);  
  // wscircle.closenTooltip();
  
}

function wsLookupOn(event){
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


// GPS button for mobile devices
if(L.Browser.mobile){
  var locator = L.control.locate({
    position: 'topleft',
    strings: {
        title: "所在位置"
    }
  }).addTo(map);
}

// GeoSearch Button
const GeoSearch= window.GeoSearch;
osmSearcher = new GeoSearch.OpenStreetMapProvider({
  params: {
    countrycodes: 'tw',   
    'accept-language': 'zh',
  },
});
const searchControl = new GeoSearch.SearchControl({
  // style: 'button', //'button' | 'bar',
  searchLabel: '搜尋地點',
  autoComplete : false, 
  autoClose: true,
  keepResult: true,
  retainZoomLevel: true,
  provider: osmSearcher,
});
map.addControl(searchControl);

map.on('geosearch/showlocation',searched );
function searched(e){
  gtag('event', 'searched', {
    'event_category': 'poi',
    'event_label': "search: "+$(".glass").val(),
    // 'non_interaction': true  
  });
  history.replaceState(null, "", "?q="+$(".glass").val());
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
//   alert("已複製到剪貼簿");  

// }).addTo( map );


//context menu testing

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
    // 'non_interaction': true  
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

function openTWMap3 (e) {	
  const lookupLatLng = map.getCenter();  
  shareUrl = "https://map.happyman.idv.tw/~mountain/twmap3/?goto="+lookupLatLng.lat.toFixed(6)+","+ lookupLatLng.lng.toFixed(6) + "&zoom=" + map.getZoom();
  window.open(shareUrl);
  gtag('event', 'openMap', {
    'event_category': 'context',
    'event_label': 'TWMap3',   
    'non_interaction': true     
  });
}

function openNLSC (e) {	
  const lookupLatLng = map.getCenter();  
  shareUrl = "https://maps.nlsc.gov.tw/go/"+lookupLatLng.lng.toFixed(6)+"/"+ lookupLatLng.lat.toFixed(6) + "/" + map.getZoom();
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

function openWindy (e) {	
  const lookupLatLng = map.getCenter();  
  shareUrl = "https://www.windy.com/"+lookupLatLng.lat.toFixed(3)+"/"+ lookupLatLng.lng.toFixed(3) + "/meteogram?rain,"+lookupLatLng.lat.toFixed(3)+"," +lookupLatLng.lng.toFixed(3)+","+ map.getZoom()+",m:ek1ajxt";  // Android pin on the point
  window.open(shareUrl);
  gtag('event', 'openFCST', {
    'event_category': 'context',
    'event_label': 'windy',   
    'non_interaction': true     
  });
}

function openMeteoblue (e) {	
  const lookupLatLng = map.getCenter();
  shareUrl = "https://www.meteoblue.com/en/weather/maps/#coords="+ map.getZoom()+ "/" +lookupLatLng.lat.toFixed(3)+"/"+ lookupLatLng.lng.toFixed(3) + "";  // Android pin on the point
  window.open(shareUrl);
  gtag('event', 'openFCST', {
    'event_category': 'context',
    'event_label': 'mb',   
    'non_interaction': true     
  });
}

function openWingGuru (e) {	
  const lookupLatLng = map.getCenter();  
  shareUrl = "https://www.windguru.cz/map/?lat="+lookupLatLng.lat.toFixed(6)+"&lon="+lookupLatLng.lng.toFixed(6)+"&zoom="+map.getZoom();  // Android pin on the point
  window.open(shareUrl);
  gtag('event', 'openFCST', {
    'event_category': 'context',
    'event_label': 'wg',   
    'non_interaction': true     
  });
}

function centerMap (e) {
	map.panTo(e.latlng);
}

map.on("contextmenu.show", wsLookupOff);
map.on("contextmenu.hide",wsLookupOn);


function getShareUrl(){
  return (window.location.origin + window.location.pathname+"?center=" + map.getCenter().lat.toFixed(6) + ","+ map.getCenter().lng.toFixed(6)+"&zoom=" +map.getZoom());
}


map.setView(customcenter, customzoom);



L.Control.urlCtrl4iOS = L.Control.extend({
  onAdd: function(map) {
      var text = L.DomUtil.create('input',"ios-clipboard");       
      text.style.width = '100px'; 
      text.style.display = 'none';
      text.value="Clipboard";
      return text;
  },
  onRemove: function(map) {
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