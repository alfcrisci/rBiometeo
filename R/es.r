#' es
#'
#'Given a temperature  Celsius value give Vapor Pressure in hPa. Hardy, R.; ITS-90 Formulations for Vapor Pressure, Frostpoint
#' Temperature, Dewpoint Temperature and Enhancement Factors in the Range -100 to 100 degC;
#' 
#'
#' @param numeric t Air temperature in Celsius degrees.
#' @return Saturation Vapor Pressure in hPa.
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  es 
#' @references Proceedings of Third International Symposium on Humidity and Moisture. National Physical Laboratory (NPL), London, 1998, pp. 214-221 \link{http://www.thunderscientific.com/tech_info/reflibrary/its90formulas.pdf}
#' @export
#'
#'
#'
#'

es=function(ta) {
                         ct$assign("ta", as.array(t))
                         ct$eval("var res=[]; for(var i=0, len=ta.length; i < len; i++){ res[i]=es(ta[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}

