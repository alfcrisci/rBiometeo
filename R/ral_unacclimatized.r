#' ral_unacclimatized
#'
#' Calculate treshshold of risk realated to wbgt index for unacclimatized people.
#'
#' @param met numeric Metabolic rate in w/mq following level of ISO FDIS 7243.
#
#' @return RAL
#'
#' @author Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
#' @references  Ergonomics of the thermal environment – Assessment of heat stress using the WBGT (wet bulb globe temperature)   index, ISO FDIS 7243 (2016)
#' @keywords  RAL
#' @export
#'
#'
#'
#'

ral_unacclimatized=function(met)  {
  ct$assign("met", as.array(met))
  ct$eval("var res=[]; for(var i=0, len=met.length; i < len; i++){ res[i]=ral_unacclimatized(met[i])};")
  res=ct$get("res")
  return(res)
}

