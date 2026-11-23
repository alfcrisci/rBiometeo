#' mdi_index
#'
#' Modified discomfort index MDI = 0.75 Tw + 0.38 Ta (Moran et al., 1998), with Tw the natural wet-bulb temperature.
#' Since version 0.4 the coefficients follow Moran et al. (previously 0.7 and 0.3).
#'
#' @param t numeric Air temperature in degC.
#' @param rh numeric Relative humidity in percentage.
#' @param wind numeric Windspeed in meters per second.
#' @param pair numeric Air pressure in hPa.
#' @return mdi_index 
#'
#'
#' @author    Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords  mdi_index 
#' @references Moran D.S., Shapiro Y., Epstein Y., Matthew W., Pandolf K.B. (1998). A modified discomfort index (MDI) as an alternative to the wet bulb globe temperature (WBGT). In: Hodgdon J.A., Heaney J.H., Buono M.J. (eds) Environmental Ergonomics VIII, pp. 77-80.
#'  
#'
#'
#'
#' @export

mdi_index<-function(t,rh,wind=0.2,pair=1010)  {
                          ct$assign("t", as.array(t))
                          ct$assign("rh", as.array(rh))
                          ct$assign("wind", as.array(wind))
                          ct$assign("pair", as.array(pair))
                          ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=mdi_index(t[i],rh[i],wind[0],pair[0])};")
                          res=ct$get("res")
                          return(ifelse(res==9999,NA,res))
}



