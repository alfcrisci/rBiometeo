#' Wind chill risk label
#'
#' Label of the wind chill risk class of windchill_cla (Environment and Climate Change Canada), with frostbite times.
#'
#' @param t numeric Air temperature in degC.
#' @param wind numeric Wind speed in meters per second.
#' @param lang character Language of the labels: "it" (default) or "en".
#' @return character label
#' @references Environment and Climate Change Canada. Wind chill index. https://www.canada.ca/en/environment-climate-change/services/weather-health/wind-chill-cold-weather/wind-chill-index.html
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords wind chill
#' @export
windchill_class_text <- function(t, wind, lang = "it") {
  .js_apply("windchill_class_text", t, wind, lang)
}
