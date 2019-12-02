#' humidex
#'
#' Computes canadian Humidex index.
#'
#' @param t  numeric  Air temperature in degC.
#' @param rh  numeric Relative humidity in percentage.
#' @return humidex in degC.
#'
#' @author    Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords  humidex, canada
#' @references Masterson, J. et Richardson, F. A., Humidex, A Method of Quantifying Human Discomfort Due to Excessive Heat and Humidity, Downsview, Ontario, Environnement Canada, 1979, 45.
#' @export
#'
#'
#'
#'

humidex=function(t,rh) {
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=humidex(t[i],rh[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}



