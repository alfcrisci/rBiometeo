#' Scharlau sultriness class
#'
#' Class 1-4: 1 comfort, 2 slightly unpleasant, 3 unpleasant, 4 heavily unpleasant, from sharlau_index_delta.
#'
#' @param t numeric Air temperature in degC.
#' @param rh numeric Relative humidity in percentage.
#' @return class 1-4
#' @references Scharlau K. (1950). Einfuehrung eines Schwuelemassstabes und Abgrenzung von Schwuelezonen durch Isohygrothermen. Erdkunde 4: 188-201.
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@cnr.it}
#' @keywords Scharlau
#' @export
sharlau_class <- function(t, rh) {
  .js_apply("sharlau_class", t, rh)
}
