#' Corrected effective temperature
#'
#' Effective temperature computed with the globe temperature instead of the air temperature (Vernon & Warner), keeping the vapour pressure, with the NET formula with wind. Approximation of the CET normal scale.
#'
#' @param t numeric Air temperature in degC.
#' @param rh numeric Relative humidity in percentage.
#' @param wind numeric Wind speed in meters per second.
#' @param tg numeric Globe temperature in degC (150 mm black globe).
#' @return CET in degC
#' @references Vernon H.M., Warner C.G. (1932). The influence of the humidity of the air on capacity for work at high temperatures. J. Hyg. 32(3): 431-462.
#' @references Gregorczuk M., Cena K. (1967). Distribution of effective temperature over the surface of the Earth. Int. J. Biometeorol. 11: 145-149.
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords effective temperature
#' @export
CET <- function(t, rh, wind, tg) {
  .js_apply("CET", t, rh, wind, tg)
}
