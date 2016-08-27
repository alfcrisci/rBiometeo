#' steadman_indoor
#'
#' Computes Steadman's apparent temperature for indoor conditions where air movements are negligible.
#'
#' @param numeric t Air temperature in Celsius Degrees.
#' @param numeric rh Air Relative humidity in %.
#' @return 
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  steadman_indoor 
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



