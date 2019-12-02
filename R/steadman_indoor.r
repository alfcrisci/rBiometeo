#' steadman_indoor
#'
#' Computes Steadman's apparent temperature for indoor conditions where air movements are negligible.
#'
#' @param  t numeric Air temperature in Celsius degrees.
#' @param  rh numeric  Relative humidity in percentage.
#' @return steadman indoor index
#' 
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords  steadman, apparent temperature,indoor 
#' 
#' @export
#'
#'
#'
#'

steadman_indoor=function(t,rh) {
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=steadman_indoor(t[i],rh[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}



