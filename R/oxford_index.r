#' oxford_index
#'
#' Computes  the oxford index index of discomfort. 
#'
#' @param numeric t Air temperature in degC.
#' @param numeric rh Air Relative humidity (%).
#' @param numeric wind Wind speed in meters per second.
#' @param numeric pair Air pressure in hPa
#' @return 
#'
#'
#' @author  Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
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
                         return(ifelse(res==9999,NA,res))
}



