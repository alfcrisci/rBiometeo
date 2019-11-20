#' wbgt_indoor
#'
#' Calculate web bulb globe index for indoor environments. 
#'
#' @param numeric t Air temperature in Celsius Degrees.
#' @param numeric rh Air Relative humidity in percentage.
#' @param numeric wind Air wind wind velocity in meter per second. Default is 0.1.
#' @param numeric press Air Pressure at sea level in hPa. Default is 1013.25 hPa.
#' @param numeric topo Elevation in meters on sea level. Default is 0.
#' @return 
#'
#'
#' @author  Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
#' @keywords  wbgt_indoor 
#' 
#' @export
#'
#'
#'
#'

wbgt_indoor=function(t,rh,wind=0.1,press=NULL,topo=NULL) {
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$assign("wind", as.array(wind))
                         if (is.null(press)){press=1013.25}
                         if (is.null(topo)){topo=1013.25}
                         ct$assign("press", as.array(press))
                         ct$assign("elev", as.array(topo))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=wbgt_indoor(t[i],rh[i],wind[i],press[0],elev[0])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}



