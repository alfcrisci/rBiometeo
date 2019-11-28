#' es
#'
#' Given a air temperature  in degC gives Vapor Pressure in hPa. Hardy, R.; ITS-90 Formulations for Vapor Pressure, Frostpoint
#' Temperature, Dewpoint Temperature and Enhancement Factors in the Range -100 to 100 degC;
#' 
#'
#' @param t numeric Air temperature in Celsius degrees.
#' @return Saturation Vapor Pressure in hPa.
#'
#'
#' @author  Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
#' @keywords  air saturation 
#' @references Proceedings of Third International Symposium on Humidity and Moisture. National Physical Laboratory (NPL), London, 1998, pp. 214-221 \url{http://www.thunderscientific.com/tech_info/reflibrary/its90formulas.pdf}
#' @export
#'
#'
#'
#'

es=function(t) {
                         ct$assign("t", as.array(t))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=es(t[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}

