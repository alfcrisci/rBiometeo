#' THI
#'
#' Given air temperature (Celsius), relative humidity  gives Temperature Humidity Index discomfort. Giles (1990).
#'
#' @param t numeric  Air temperature in Celsius degrees.
#' @param rh numeric Relative humidity in percentage.
#' @return Temperature Humidity Index discomfort
#'
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords  THI, Temperature Humidity Index 
#' 
#' @export
#'
#'
#'
#'

THI=function(t,rh) {
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=THI(t[i],rh[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}



