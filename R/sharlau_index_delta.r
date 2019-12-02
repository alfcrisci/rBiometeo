#' sharlau_index_delta
#'
#' Computes the critical sharlau delta.
#'
#' @param t numeric Air temperature in degC.
#' @param rh numeric Relative humidity in percentage.
#' @return sharlau_index_delta
#' 
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords  sharlau_index_delta 
#' @references Scharlau, K., 1950, Einfuhrung eines Schwulemasstabes und Abgrenzung von Schwulezonen durch Isohygrothermen, Erdkunde, 4, 188 201.
#' @export
#'
#'
#'
#'

sharlau_index_delta=function(t,rh) {
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=sharlau_index_delta(t[i],rh[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}



