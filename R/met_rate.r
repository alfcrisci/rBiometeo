#' met_rate
#'
#' Calculate metabolic 
#'
#' @param BSA numeric Body are surface. 
#' @param isolevel numeric Metabolic rate class following level of ISO FDIS 7243.
#'
#' @return basal metabolic rate
#'
#' @author Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
#' @references  Ergonomics of the thermal environment – Assessment of heat stress using the WBGT (wet bulb globe temperature)   index, ISO FDIS 7243 (2016)
#' @keywords  MET
#' @export
#'
#'
#'
#'

met_rate=function(BSA, isolevel)   {
  ct$assign("BSA", as.array(BSA))
  ct$assign("isolevel", as.array(isolevel))
  ct$eval("var res=[]; for(var i=0, len=BSA.length; i < len; i++){ res[i]=met_rate(BSA[i],isolevel[i])};")
  res=ct$get("res")
  return(res)
}
