#' p_local
#'
#' Estimate local value of air pressure in hPa.
#'
#' @param press numeric Air sea level pressure in hPa.
#' @param elev numeric Altitude or Elevation in meters.
#' @param t  numeric Mean Air temperature in degC.
#' @return local air pressure
#'
#'
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords  p_local 
#' 
#' @export
#'
#'
#'
#'

p_local=function(press=1010,elev,t) {
                         ct$assign("press", as.array(press))
                         ct$assign("topo", as.array(elev))
                         ct$assign("temp", as.array(t))
                         ct$eval("var res=[]; for(var i=0, len=press.length; i < len; i++){ res[i]=p_local(press[i],topo[i],temp[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}

