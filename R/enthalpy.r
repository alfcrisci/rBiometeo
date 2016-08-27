#' enthalpy
#'
#' Calculates the enthalpy of air/water vapor mixture [kJ/kg]. Inputs are dry-bulb temperature [C] and humidity ratio [unitless]. 
#'
#' @param numeric t Air temperature in Celsius degrees.
#' @param hum_ratio Humidity ratio [unitless].
#' @return 
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  enthalpy 
#' 
#' @export
#'
#'
#'
#'

enthalpy=function(t,hum_ratio) {
                         ct$assign("t", as.array(t))
                         ct$assign("hum_ratio", as.array(hum_ratio))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=enthalpy(t[i],hum_ratio[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}



