#' spvol
#'
#' Gets the specific volume of air/water vapor mixture [m^3/kg].
#'
#' @param t numeric Air temperature in degC.
#' @param hum_ratio numeric Humidity ratio. 
#' @param pair numeric Air pressure in (hPa).
#' @return  Specific volume
#'
#'
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords  spvol 
#' 
#' @export
#'
#'
#'
#'

spvol=function(t,hum_ratio,pair) {
                         ct$assign("ta", as.array(t))
                         ct$assign("hum_ratio", as.array(hum_ratio))
                         ct$assign("pa", as.array(pair))
                         ct$eval("var res=[]; for(var i=0, len=ta.length; i < len; i++){ res[i]=spvol(ta[i],hum_ratio[i],pa[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}

