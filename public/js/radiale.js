function radiale(angle,ecart,polygone){

    //var maxx=max(polygone(:,0));
    //var maxy=max(polygone(:,1));
    //var minx=min(polygone(:,0));
    //var miny=min(polygone(:,1));
    var maxx=polygone[0][0];
    var maxy=polygone[0][1]
    var miny=polygone[0][0]
    var minx=polygone[0][1];

    for (var i = 0; i < polygone.length; i++){
        if (polygone[i][0]<minx){
            minx=polygone[i][0];
        }
        else if (polygone[i][0]>maxx){
            maxx=polygone[i][0];
        }
        else if (polygone[i][1]<miny){
            miny=polygone[i][1];
        }
        else if (polygone[i][1]>maxy){
            maxy=polygone[i][1];
        }
    }

    var cotecarre=1.02*Math.sqrt((maxx-minx)**2+(maxy-miny)**2);
    var matrot=[[Math.cos(angle) , -Math.sin(angle)],[Math.sin(angle) , Math.cos(angle)]];
    var n=floor(cotecarre/ecart)+1;
    var coordsegmentscentre=[[[-cotecarre/2,-cotecarre/2],[cotecarre/2,-cotecarre/2]]];

    for (var i = 1; i < n; i++){
        coordsegmentscentre=coordsegmentscentre.concat([[-cotecarre/2,-cotecarre/2+i*ecart],[cotecarre/2,-cotecarre/2+i*ecart]]);
    }

    for (var i = 0; i < coordsegmentscentre.length; i++){
        coordsegmentscentre[i]=produitMat(matrot,coordsegmentscentre[i]);
    }

    var coordsegments=[];
    var medx=(maxx+minx)/2;
    var medy=(maxy+miny)/2;

    for (var i = 0; i < coordsegmentscentre.length; i++){
        coordsegments=coordsegments.concat([[coordsegmentscentre[i][0][0]+medx,coordsegmentscentre[i][0][1]+medy],[coordsegmentscentre[i][1][0]+medx,coordsegmentscentre[i][1][1]+medy]]);
    }

    var radiales=[];
    for (var i = 0; i < coordsegments.length; i++){
        var point=[];
        var x=coordsegments[i][0][0];
        var y=coordsegments[i][0][1];
        var xdebutsegment,ydebutsegment,xfinsegment,yfinsegment;
        var distance=cotecarre/1000;
        var dehors=true;
        var test=false;
        var n=floor(cotecarre/distance)+1;
        for (var i = 0, i < n, i++){
            point=[x+i*distance*Math.cos(angle),y+i*distance*Math.sin(angle)];
            test=inside(point,polygone);
            if (test && dehors){
                dehors=false;
                xdebutsegment=point[0];
                ydebutsegment=point[1];
            }
            else if (not(test) && not(dehors)){
                dehors=true;
                xfinsegment=point[0]-distance*cos(angle);
                yfinsegment=point[1]-distance*sin(angle);
                radiales=radiales.concat([[xdebutsegment,ydebutsegment],[xfinsegment,yfinsegment]]);
                xdebutsegment=0;
                ydebutsegment=0;
                xfinsegment=0;
                yfinsegment=0;
            }
        }
    }
    return radiales;
}

function inside(point, poly) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        var xi = poly[i][0], yi = poly[i][1];
        var xj = poly[j][0], yj = poly[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};

function produitMat(matrot,segment){
    var segmentbis= [[0,0],[0,0]];

    segmentbis[0][0]=segment[0][0]*matrot[0][0]+segment[0][1]*matrot[1][0];
    segmentbis[0][1]=segment[0][0]*matrot[0][1]+segment[0][1]*matrot[1][1];
    segmentbis[1][0]=segment[1][0]*matrot[0][0]+segment[1][1]*matrot[1][0];
    segmentbis[1][1]=segment[1][0]*matrot[0][1]+segment[1][1]*matrot[1][1];

    return segmentbis;
}