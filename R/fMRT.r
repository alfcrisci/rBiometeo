#' fMRT
#'
#' Calculated the mean radiant temperature from the solar radiation.  Modified based on direct && diffuse ratio. Assumes a uniform surround temperature of Ta && short wave solar radiation only;
#'
#' @param numeric t Air temperature in Celsius Degrees.
#' @param numeric rad Global short solar irradiance in W/mq.
#' @param numeric frad Fraction related to direct solar beam [0-1].
#' @return Mean Radiant temperature.
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  fMRT 
#' 
#' @export
#'
#'
#'
#'

fMRT=function(t,rad,frad) {
                         ct$assign("Ta", as.array(t))
                         ct$assign("solar", as.array(rad))
                         ct$assign("frad", as.array(frad))
                         ct$eval("var res=[]; for(var i=0, len=Ta.length; i < len; i++){ res[i]=fMRTmod(Ta[i],solar[i],frad[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}



