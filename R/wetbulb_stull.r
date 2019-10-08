#' wetbulb_stull
#'
#'  Compute natural wetbulb temperature by using Stull empirical formulation
#'
#' @param numeric t Air temperature in Celsius degrees.
#' @param numeric rh Air Relative humidity in percentage.
#' @param numeric press  Air pressure in hPa or millibar.
#' @return Wet bulb temperature in Celsius degrees.
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
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
                         return(ifelse(res==9999,NA,res))
}
