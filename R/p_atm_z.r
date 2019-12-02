#' p_atm_z
#' 
#' Calculate local air ressure as function of elevation/altitude in meters and sea-level pressure.
#' 
#' @param z       numeric elevation/altitude (m).
#' @param p_sl    numeric pressure at sea level, per weather report (hPa),Default 101235 Pa. 
#'                         
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @references    2005 ASHRAE Handbook - Fundamentals (SI) ch.6 (3)
#' @return        numeric pressure (Pa)
#' @export
#' 

p_atm_z <- function(z, p_sl = 1013.25) {
                    p_sl * (1 - 2.25577e-5 * z)^5.2559 
}
