// Enable local GPX layer loading by drag and drop on map

function dropHandler(ev) {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (!ev.ctrlKey) {  //append gpx layers while holding ctrl
        local_gpxlayers.clearLayers();
    }

    // console.log('File(s) dropped');
    if (ev.dataTransfer.dropEffect == "copy" || true) {
        if (ev.dataTransfer.items) {
           
            // Use DataTransferItemList interface to access the file(s)
            [...ev.dataTransfer.items].forEach((item, i) => {
                // If dropped items aren't files, reject them
                if (item.kind === 'file') {
                    const file = item.getAsFile();
                    // console.log(`… file[${i}].name = ${file.name} ` + file.lastModified);

                    const regxFilename = /^(.*)\.[gG][pP][xX]$/;
                    if (file.name.length > 0) //URL papameter format: ?center=lat,lng
                        if (found = file.name.match(regxFilename)) {
                            // console.log(`GPX supported: ${file.name} , Modified ${file.lastModified}`);

                            const reader = new FileReader();
                            reader.addEventListener('load', (event) => {
                                // console.log(event.target.result);
                                var gpx = event.target.result; // URL to your GPX file or the GPX itself
                                lygpx = new L.GPX(gpx, {
                                    async: true,
                                    gpx_options: {
                                        parseElements: ['track'], // ['track', 'route', 'waypoint']
                                    },
                                    marker_options: {
                                        startIconUrl: 'https://github.com/mpetazzoni/leaflet-gpx/raw/main/pin-icon-start.png',
                                        endIconUrl: 'https://github.com/mpetazzoni/leaflet-gpx/raw/main/pin-icon-end.png',
                                        shadowUrl: 'https://github.com/mpetazzoni/leaflet-gpx/raw/main/pin-shadow.png',
                                        wptIconUrls: {
                                            '': 'https://github.com/mpetazzoni/leaflet-gpx/raw/main/pin-icon-wpt.png',
                                        },

                                    },
                                    polyline_options: {
                                        color: 'red',
                                        opacity: 0.5,
                                        weight: 5,
                                        lineCap: 'round'
                                    }
                                }).on('loaded', function (e) {
                                    local_gpxlayers.addLayer(lygpx);
                                    // lyctrl.addOverlay(e.target, '<span class="btn-sm"><i class="fa fa-arrow-circle-right text-black-50" aria-hidden="true"></i></span>' + e.target.get_name());
                                    map.fitBounds(local_gpxlayers.getBounds());
                                }).addTo(map);
                                
                            });
                            reader.readAsDataURL(file);


                        } else {
                            // console.log(`file type not supported: ${file.name}`); //not GPX file
                            ;
                        }

                }
            });


        } else {
            // Use DataTransfer interface to access the file(s)
            [...ev.dataTransfer.files].forEach((file, i) => {
                console.log(`… file[${i}].name = ${file.name}  `);
            });
        }
    }    

}

function dragOverHandler(ev) {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
    ev.dataTransfer.effectallowed = 'copy'

    if (ev.shiftKey) {
        // ev.dataTransfer.dropEffect = 'move';
        ev.dataTransfer.dropEffect = 'none';
    } else if (ev.altKey) {
        // ev.dataTransfer.dropEffect = 'link';     
        ev.dataTransfer.dropEffect = 'none';   
    } else {
        ev.dataTransfer.dropEffect = 'copy';
    }

    // ev.dataTransfer.dropEffect = 'copy';
    [...ev.dataTransfer.items].forEach((item, i) => {
        if (!(item.kind === 'file')) {
            // console.log(`not support other kind of input other than file: ${item.kind}`);  //eg: string
            ev.dataTransfer.dropEffect = 'none';
        }
    });

    // console.log('File(s) in drop zone');
}



map_forlocal = document.querySelector('#map');
map_forlocal.addEventListener("drop", (ev) => {
  dropHandler(ev);});
  map_forlocal.addEventListener("dragover", (ev) => {
dragOverHandler(ev);
});
map_forlocal=null;