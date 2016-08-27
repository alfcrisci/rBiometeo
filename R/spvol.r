#' spvol
#'
#' Gets the specific volume of air/water vapor mixture [m^3/kg].
#'
#' @param numeric t Air temperature in Celsius Degrees (dry bulb temeprature).
#' @param numeric hum_ratio Humidity ratio [unitless].
#' @param numeric pa Air pressure in hPa [millibar].
#' @return  Specific volume.
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  spvol 
#' 
#' @export
#'
#'
#'
#'

spvol=function(t,hum_ratio,pa) {
                         ct$assign("ta", as.array(t))
                         ct$assign("hum_ratio", as.array(hum_ratio))
                         ct$assign("pa", as.array(pa))
                         ct$eval("var res=[]; for(var i=0, len=ta.length; i < len; i++){ res[i]=spvol(ta[i],hum_ratio[i],pa[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}

