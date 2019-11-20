#' p_local
#'
#' DESCRIPTION
#'
#' @param numeric press Air local pressure in hPa [millibar].
#' @param numeric elev Altitude or Elevation in meters.
#' @param numeric t  Mean Air temperature in Celsius degrees.
#' @return 
#'
#'
#' @author  Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
#' @keywords  p_local 
#' 
#' @export
#'
#'
#'
#'

p_local=function(press,elev,temp) {
                         ct$assign("press", as.array(press))
                         ct$assign("topo", as.array(elev))
                         ct$assign("temp", as.array(temp))
                         ct$eval("var res=[]; for(var i=0, len=press.length; i < len; i++){ res[i]=p_local(press[i],topo[i],temp[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}

