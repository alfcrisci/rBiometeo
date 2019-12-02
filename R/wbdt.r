#' wbdt
#'
#' Given t air temperature (Celsius), rh relative humidity (percentage)  gives  Wet-bulb dry temperature (WBDT). 
#'
#' @param t    numeric Air temperature in degC.
#' @param rh   numeric Relative humidity in percentage.
#' @param pair numeric Mean Wind speed in meters per second.
#' @return Wet-bulb dry temperature in degC.
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords  WBDT
#' 
#' @export
#'
#'
#'
#'

wbdt=function(t,rh,pair=1010) {
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$assign("pair", as.array(pair))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=wbdt(t[i],rh[i],pair[0])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}



