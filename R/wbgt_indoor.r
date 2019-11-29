#' wbgt_indoor
#'
#' Calculate web bulb globe index for indoor environments. 
#'
#' @param t    numeric Air temperature in degC.
#' @param rh   numeric Relative humidity in percentage .
#' @param wind numeric Mean Wind speed in meters per second.
#' @param pair numeric Air pressure in millibar or hPa. Default 1010 hPa.
#' @param elev numeric Elevation in meters on sea level. Default is 0.
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

wbgt_indoor=function(t,rh,wind=0.1,pair=1010,elev=0) {
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$assign("wind", as.array(wind))
                         ct$assign("press", as.array(pair))
                         ct$assign("elev", as.array(elev))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=wbgt_indoor(t[i],rh[i],wind[i],press[0],elev[0])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}



