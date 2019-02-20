#' wbgt_indoor
#'
#' Calculate web bulb globe index for indoor environments. 
#'
#' @param numeric t Air temperature in Celsius Degrees.
#' @param numeric rh Air Relative humidity in percentage.
#' @param numeric wind Air wind wind velocity in meter per second. Default is 0.1.
#' @param numeric press Air Pressure in hPa. Default is 101.3.
#' @param numeric elev Elevation in meters on sea level. Default is 0.

#' @return 
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  wbgt_indoor 
#' 
#' @export
#'
#'
#'
#'

wbgt_indoor=function(t,rh,wind=0.1,press=101.3,elev=0) {
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$assign("wind", as.array(wind))
                         ct$assign("press", as.array(press))
                         ct$assign("elev", as.array(elev))
                         
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=wbgt_indoor(t[i],rh[i],wind[i],press[i],elev[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}



