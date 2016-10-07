(function(){ //wrap

elvtr.MapApp01.prototype.initDrawControls = function(options){
  var options = options || {}, o = options;
  var elm = o.elm || $('<div>')[0];
  // Inspired by example: ... /v3.3.0/examples/draw-and-modify-features.html
  var map = this.map;
  var dr = this.draw = {};
  var _this = this;
  
  // Create button elements and render:
  var $ctrl1 = $(elm).addClass('controlBox'), $pnt = $('<span class="controlSpan">').attr('title','Toggle draw mode'), 
    $pol = $pnt.clone(), $lns = $pnt.clone(), $rmf = $pnt.clone().attr('title','Remove all features')
    $mod = $pnt.clone().attr('title','Toggle modify'); 
  $ctrl1.append( $('<h4>').append('Draw stuff')
    , $('<p>').append('To modify, hold shift key down and drag node.') 
    , $pnt.append('Point'), $lns.append('LineString'), 
        $pol.append('Polygon'), $rmf.append('Clear'), $mod.append('Modify') 
  );
  
  // Create a FeatureOverlay:
  var fo = this.featureOverlay = new ol.FeatureOverlay({
    style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255,0,191,0.4)' 
        })
      , stroke: new ol.style.Stroke({
            color: 'rgb(255,0,191)' 
          , width: 2
        })
      , image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({
            color: 'rgb(255,0,191)' 
          })
        }) // image
    }) // style
  });
  fo.setMap(map);
  
  // Keep draw interaction and button state in sync:
  var syncBnState = function(int,$bn){
    var go = function(){ int.getActive() ? $bn.addClass('active') : $bn.removeClass('active'); };
    go();
    int.on('change:active', go);
  };
  
  // Create interactions, add them to map - first modify:
  var mod = this.draw.modify = new ol.interaction.Modify({
      features: fo.getFeatures()
    , deleteCondition: function(event) {
        return ol.events.condition.shiftKeyOnly(event) && ol.events.condition.singleClick(event);
      }
  }); // mod.setActive(false);
  map.addInteraction(mod);
  syncBnState(mod,$mod);
  // Then draw point:
  var pnt = this.draw.intPoint = new ol.interaction.Draw({
      features: fo.getFeatures()
    , type: 'Point'
  }); pnt.setActive(false);
  map.addInteraction(pnt);
  syncBnState(pnt,$pnt);
  // Then draw linestring:
  var lns = this.draw.intLineString = new ol.interaction.Draw({
      features: fo.getFeatures()
    , type: 'LineString'
  }); lns.setActive(false);
  map.addInteraction(lns);
  syncBnState(lns,$lns);
  // Then draw polygon:
  var pol = this.draw.intPolygon = new ol.interaction.Draw({
      features: fo.getFeatures()
    , type: 'Polygon'
  }); pol.setActive(false);
  map.addInteraction(pol);
  syncBnState(pol,$pol);

  // Activate the requested draw interaction, deactivate the others:
  this.draw.activate = function(int){
    for(var key in this){
      var INT = this[key];
      if(INT instanceof ol.interaction.Draw){
        (INT == int && !INT.getActive()) ? INT.setActive(true) : INT.setActive(false);  
      }
    }
  };
  
  // Set button handlers:
  $pnt.click(function(){ _this.draw.activate(pnt); });
  $lns.click(function(){ _this.draw.activate(lns); });
  $pol.click(function(){ _this.draw.activate(pol); });
  $rmf.click(function(){ // Must run bacwards through array. No method for removing multiple features in ol3?
    var a = fo.getFeatures().getArray();
    for(var i=a.length; i>=0; i--){ fo.removeFeature(a[i]); }
  });
  $mod.click(function(){
    mod.getActive() ? mod.setActive(false) : mod.setActive(true);
  });
  
};

// Run it:    
$(document).ready(function(){
  var g = function(id){ return document.getElementById(id); };
  window.app = new elvtr.MapApp01({
      mapElm: g('map1')
    , layerSwitcherElm: g('layerSwitcher')
  });
  app.initDrawControls({ elm: g('ctrl1') });
});

})() //wrap
