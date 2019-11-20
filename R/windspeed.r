#' windspeed
#'
#' @description Calculate meteorological wind speed.
#' 
#' @param u numeric U zonal component 
#' @param v numeric V meridian component 
#' @return 
#'
#' @author  Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
#' @keywords speed wind
#' 
#' 
#' @export

windspeed=function(u, v) {return(sqrt(u^2+v^2))}
