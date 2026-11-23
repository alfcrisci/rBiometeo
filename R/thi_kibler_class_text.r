#' Livestock Weather Safety Index label
#'
#' Label of the class of THI_kibler (see thi_kibler_class).
#'
#' @param t numeric Air temperature in degC.
#' @param rh numeric Relative humidity in percentage.
#' @param lang character Language of the labels: "it" (default) or "en".
#' @return character label
#' @references Livestock Conservation Institute (1970). Patterns of transit losses. LCI, Omaha, Nebraska.
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords livestock THI
#' @export
thi_kibler_class_text <- function(t, rh, lang = "it") {
  .js_apply("thi_kibler_class_text", t, rh, lang)
}
