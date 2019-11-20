#' humidex
#'
#' Computes canadian Humidex index.
#'
#' @param numeric t Air temperature in Celsius degrees.
#' @param numeric rh Air Relative humidity in percentage.
#' @return 
#'
#' @author  Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
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



