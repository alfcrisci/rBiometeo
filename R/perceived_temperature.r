#' Perceived temperature
#'
#' Air temperature of a reference environment (Tmrt = air temperature, wind 0.1 m/s, rh 50 percent) giving the same ISO 7730 PMV as the actual one (Klima-Michel concept, fixed clothing).
#'
#' @param t numeric Air temperature in degC.
#' @param rh numeric Relative humidity in percentage.
#' @param wind numeric Wind speed in meters per second.
#' @param tr numeric Mean radiant temperature in degC.
#' @param M numeric Metabolic rate in W/m2.
#' @param W numeric External work in W/m2.
#' @param clo numeric Clothing insulation in clo.
#' @return perceived temperature in degC
#' @references Staiger H., Laschewski G., Graetz A. (2012). The perceived temperature - a versatile index for the assessment of the human thermal environment. Part A: scientific basics. Int. J. Biometeorol. 56: 165-176. doi:10.1007/s00484-011-0409-6
#' @references ISO 7730:2005. Ergonomics of the thermal environment - Analytical determination and interpretation of thermal comfort using calculation of the PMV and PPD indices and local thermal comfort criteria.
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@cnr.it}
#' @keywords perceived temperature
#' @export
perceived_temperature <- function(t, rh, wind, tr, M = 58.15, W = 0, clo = 0.9) {
  .js_apply("perceived_temperature", t, rh, wind, tr, M, W, clo)
}
