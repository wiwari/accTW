// fix https://unpkg.com/leaflet-doubletapdragzoom@0.3.0/Leaflet.DoubleTapDragZoom.js freezing tap + squeeze
DoubleTapDragZoom.include({
  _onDoubleTapDragStart: function (e) {
    var map = this._map;
    if (!e.touches || e.touches.length !== 1 || map._animatingZoom) { return; }

    var p = map.mouseEventToContainerPoint(e.touches[0]);
    this._startPointY = p.y;
    this._startPoint = p;

    this._centerPoint = map.getSize()._divideBy(2);

    if (map.options.doubleTapDragZoom === 'center') {
      this._startLatLng = map.containerPointToLatLng(this._centerPoint);
    } else {
      this._startLatLng = map.containerPointToLatLng(p);
    }

    this._startZoom = map.getZoom();

    map._stop();
    map._moveStart(true, false);
    this._doubleTapDragging = false;
  },
});


