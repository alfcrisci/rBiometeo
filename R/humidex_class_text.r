#' Humidex class label
#'
#' Label of the humidex class (see humidex_class).
#'
#' @param t numeric Air temperature in degC.
#' @param rh numeric Relative humidity in percentage.
#' @param lang character Language of the labels: "it" (default) or "en".
#' @return character label
#' @references Environment and Climate Change Canada. How to use the Humidex. https://www.canada.ca/en/services/environment/weather/severeweather/humidex.html
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords humidex
#' @export
humidex_class_text <- function(t, rh, lang = "it") {
  .js_apply("humidex_class_text", t, rh, lang)
}
