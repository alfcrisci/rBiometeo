#' Discomfort index class label
#'
#' Label of the discomfort index class (see discomfort_index_class).
#'
#' @param t numeric Air temperature in degC.
#' @param rh numeric Relative humidity in percentage.
#' @param wind numeric Wind speed in meters per second.
#' @param pair numeric Air pressure in hPa.
#' @param lang character Language of the labels: "it" (default) or "en".
#' @return character label
#' @references Epstein Y., Moran D.S. (2006). Thermal comfort and the heat stress indices. Ind. Health 44: 388-398. doi:10.2486/indhealth.44.388
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords discomfort index
#' @export
discomfort_index_class_text <- function(t, rh, wind = 0.13, pair = 1010, lang = "it") {
  .js_apply("discomfort_index_class_text", t, rh, wind, pair, lang)
}
