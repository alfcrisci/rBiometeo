#' Humidex class
#'
#' Class 1-4 (Environment Canada): 1 little or no discomfort (< 30), 2 some discomfort (30-39), 3 great discomfort (40-45), 4 dangerous (> 45).
#'
#' @param t numeric Air temperature in degC.
#' @param rh numeric Relative humidity in percentage.
#' @return class 1-4
#' @references Masterton J.M., Richardson F.A. (1979). Humidex: a method of quantifying human discomfort due to excessive heat and humidity. CLI 1-79, Environment Canada.
#' @references Environment and Climate Change Canada. How to use the Humidex. https://www.canada.ca/en/services/environment/weather/severeweather/humidex.html
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@cnr.it}
#' @keywords humidex
#' @export
humidex_class <- function(t, rh) {
  .js_apply("humidex_class", t, rh)
}
