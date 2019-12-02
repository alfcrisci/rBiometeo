#' PVS
#'
#' Broad range formula to estimate saturation vapor pressure.
#'
#' @param t numeric Air temperature in degC.
#' @return Saturaion vapor pressure (hPa)
#'
#'
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords   PVS 
#' @references Hardy B, 1998,"ITS-90 Formulations for Vapor Pressure, Frostpoint Temperature,Dewpoint Temperature, and Enhancement Factors in the Range 100 to +100 C".Proceedings of the Third International Symposium on Humidity & Moisture",Teddington, London, England, April 1998.
#' @export
#'
#'
#'
#'

PVS=function(t) {
                         ct$assign("T", as.array(t))
                         ct$eval("var res=[]; for(var i=0, len=T.length; i < len; i++){ rel[i]=PVS(T[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}

