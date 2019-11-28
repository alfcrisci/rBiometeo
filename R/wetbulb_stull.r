#' wetbulb_stull
#'
#' Compute natural wetbulb temperature by using Stull empirical formulation
#'
#' @param t numeric      Air temperature in degC.
#' @param rh numeric     Relative humidity in percentage ( %).
#' @param press numeric  Air pressure in hPa .
#' @return Wet bulb temperature in degC
#'
#'
#' @author  Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
#' @keywords  wetbulb 
#' @references  Stull, R.B., 2011, Meteorology for Scientists and Engineers, 3rd Edition. 938 pages. 
#' @export
#'
#'
#'
#'

wetbulb=function(t,rh) {
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=wetbulb_stull(t[i],rh[i]};")
                         res=ct$get("res")
                         return(ifelse(!is.numeric(res),NA,res))
}
