#' PMV class (ISO 7730)
#'
#' Seven-point thermal sensation class for a PMV value: PMV rounded and limited to -3..+3, class = PMV + 4 (1 cold ... 7 hot).
#'
#' @param pmv numeric PMV value (e.g. from PMV_ISO7730).
#' @return class 1-7
#' @references ISO 7730:2005. Ergonomics of the thermal environment - Analytical determination and interpretation of thermal comfort using calculation of the PMV and PPD indices and local thermal comfort criteria.
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@cnr.it}
#' @keywords PMV
#' @export
pmv_class <- function(pmv) {
  .js_apply("pmv_class", pmv)
}
