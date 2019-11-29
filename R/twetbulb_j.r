#' twetbulb_j
#'
#' Estimating wet bulb temperature following  empirical equation given by Jeevananda, 1976.
#'
#' @param t numeric Air temperature in degC.
#' @param pair numeric Air Pressure in hPa. Default is 1010.
#' @return wet bulb temperature
#'
#'
#' @author  Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
#' @keywords wet bulb temperature 
#' 
#' @export
#'
#'
#'
#'

twetbulb_j=function(t,pair) {
                         ct$assign("t", as.array(t))
                         ct$assign("p", as.array(pair))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=twetbulb_j(t[i],p[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}



