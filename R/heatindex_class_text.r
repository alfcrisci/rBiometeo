#' Heat index class label
#'
#' Label of the heat index class (see heatindex_class).
#'
#' @param t numeric Air temperature in degC.
#' @param rh numeric Relative humidity in percentage.
#' @param lang character Language of the labels: "it" (default) or "en".
#' @return character label
#' @references US National Weather Service. Heat index. https://www.weather.gov/ama/heatindex
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords heat index
#' @export
heatindex_class_text <- function(t, rh, lang = "it") {
  .js_apply("heatindex_class_text", t, rh, lang)
}
