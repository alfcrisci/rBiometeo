#' Thom discomfort index class label
#'
#' Label of the class of thom (see thom_class).
#'
#' @param t numeric Air temperature in degC.
#' @param rh numeric Relative humidity in percentage.
#' @param pair numeric Air pressure in hPa.
#' @param wind numeric Wind speed in meters per second.
#' @param lang character Language of the labels: "it" (default) or "en".
#' @return character label
#' @references Giles B.D., Balafoutis C., Maheras P. (1990). Too hot for comfort: the heatwaves in Greece in 1987 and 1988. Int. J. Biometeorol. 34: 98-104.
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords Thom
#' @export
thom_class_text <- function(t, rh, pair = 1010, wind = 0.13, lang = "it") {
  .js_apply("thom_class_text", t, rh, pair, wind, lang)
}
