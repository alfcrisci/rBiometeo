#' PMV class label
#'
#' Label of the ISO 7730 thermal sensation scale for a PMV value (see pmv_class).
#'
#' @param pmv numeric PMV value.
#' @param lang character Language of the labels: "it" (default) or "en".
#' @return character label
#' @references ISO 7730:2005. Ergonomics of the thermal environment - Analytical determination and interpretation of thermal comfort using calculation of the PMV and PPD indices and local thermal comfort criteria.
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@cnr.it}
#' @keywords PMV
#' @export
pmv_class_text <- function(pmv, lang = "it") {
  .js_apply("pmv_class_text", pmv, lang)
}
