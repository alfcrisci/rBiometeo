#' windspeed
#'
#' @description Calculate meteorological wind speed.
#' 
#' @param u numeric U zonal component (m/s), 
#' @param v numeric V meridian component (m/s), 
#' @return wind speed (m/s)
#'
#' @author    Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords Scaler speed wind
#' 
#' 
#' @export

windspeed=function(u, v) {return(sqrt(u^2+v^2))}
