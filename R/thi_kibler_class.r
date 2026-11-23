#' Livestock Weather Safety Index class
#'
#' Class 1-4 of the cattle THI of THI_kibler: 1 normal (< 75), 2 alert (75-78), 3 danger (79-83), 4 emergency (>= 84).
#'
#' @param t numeric Air temperature in degC.
#' @param rh numeric Relative humidity in percentage.
#' @return class 1-4
#' @references Livestock Conservation Institute (1970). Patterns of transit losses. LCI, Omaha, Nebraska.
#' @references Mader T.L., Davis M.S., Brown-Brandl T. (2006). Environmental factors influencing heat stress in feedlot cattle. J. Anim. Sci. 84: 712-719.
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords livestock THI
#' @export
thi_kibler_class <- function(t, rh) {
  .js_apply("thi_kibler_class", t, rh)
}
