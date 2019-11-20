#' wbgt_outdoor
#'
#' Calculate wet bulb globe temperature index for outdoor environements by using solar radiation.
#' Pressure correction follow
#
#' @param numeric t Air temperature in Celsius degrees.
#' @param numeric rh Air Relative humidity in percentage.
#' @param numeric wind Air wind wind velocity in meter per second. Default is 0.1.
#' @param numeric solar Solar Radiation Radiance in watt on square meter.
#' @param numeric press Air Pressure in hPa. Default is 1013.25.
#' @param numeric topo Elevation in meters on sea level. Default is 0. 

#' @return 
#'
#'
#' @author  Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
#' @keywords  wbgt_outdoor
#' 
#' @export
#'
#'
#'
#'

wbgt_outdoor=function(t,rh,wind,solar,press=1010,topo=0) {
  ct$assign("t", as.array(t))
  ct$assign("rh", as.array(rh))
  ct$assign("wind", as.array(wind))
  ct$assign("solar", as.array(solar))
  ct$assign("press", as.array(press))
  ct$assign("elev", as.array(topo))
  
  ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=wbgt_outdoor(t[i],rh[i],wind[i],solar[i],press[0],elev[0])};")
  res=ct$get("res")
  return(ifelse(res==9999,NA,res))
}
