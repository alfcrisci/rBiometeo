#' Discomfort index class
#'
#' Class 1-4 of discomfort_index: 1 no heat stress (< 22), 2 mild (22-24), 3 moderate (24-28), 4 severe (>= 28 degC).
#'
#' @param t numeric Air temperature in degC.
#' @param rh numeric Relative humidity in percentage.
#' @param wind numeric Wind speed in meters per second.
#' @param pair numeric Air pressure in hPa.
#' @return class 1-4
#' @references Epstein Y., Moran D.S. (2006). Thermal comfort and the heat stress indices. Ind. Health 44: 388-398. doi:10.2486/indhealth.44.388
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@cnr.it}
#' @keywords discomfort index
#' @export
discomfort_index_class <- function(t, rh, wind = 0.13, pair = 1010) {
  .js_apply("discomfort_index_class", t, rh, wind, pair)
}
