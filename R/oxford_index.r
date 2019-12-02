#' oxford_index
#'
#' Computes the oxford index of thermal discomfort. 
#'
#' @param t numeric Air temperature in degC.
#' @param rh numeric Relative humidity in percentage.
#' @param wind numeric Windspeed in meters per second.
#' @param pair numeric Air pressure in hPa.
#' @return oxford index
#'
#'
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords  oxford_index 
#' @references  Lind AR, Hallon RF,1957, Assessment of physiologic severity of hot climate. J Appl Physiol 11, 35 40.
#' @export
#'
#'
#'
#'

oxford_index=function(t,rh,wind=0.2,pair=1010) {
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$assign("wind", as.array(wind))
                         ct$assign("pair", as.array(pair))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=oxford_index(t[i],rh[i],wind[0],pair[0])};")
                         res=ct$get("res")
                         return(res)
}



