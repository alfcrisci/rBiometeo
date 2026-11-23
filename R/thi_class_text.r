#' THI class label
#'
#' Label of the THI class (see thi_class).
#'
#' @param t numeric Air temperature in degC.
#' @param rh numeric Relative humidity in percentage.
#' @param lang character Language of the labels: "it" (default) or "en".
#' @return character label
#' @references Giles B.D., Balafoutis C., Maheras P. (1990). Too hot for comfort: the heatwaves in Greece in 1987 and 1988. Int. J. Biometeorol. 34: 98-104.
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@cnr.it}
#' @keywords THI
#' @export
thi_class_text <- function(t, rh, lang = "it") {
  .js_apply("thi_class_text", t, rh, lang)
}
