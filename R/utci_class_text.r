#' UTCI class label
#'
#' Label of the 10 UTCI assessment classes (see utci_class), from extreme cold stress to extreme heat stress.
#'
#' @param t numeric Air temperature in degC.
#' @param rh numeric Relative humidity in percentage.
#' @param wind numeric Wind speed at 10 m in meters per second.
#' @param tr numeric Mean radiant temperature in degC. Default equal to t.
#' @param lang character Language of the labels: "it" (default) or "en".
#' @return character label
#' @references Blazejczyk K., Jendritzky G., Broede P., Fiala D., Havenith G., Epstein Y., Psikuta A., Kampmann B. (2013). An introduction to the Universal Thermal Climate Index (UTCI). Geographia Polonica 86(1): 5-10. doi:10.7163/GPol.2013.1
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@cnr.it}
#' @keywords UTCI
#' @export
utci_class_text <- function(t, rh, wind, tr = NULL, lang = "it") {
  if (is.null(tr)) tr <- t
  .js_apply("utci_class_text", t, rh, wind, tr, lang)
}
