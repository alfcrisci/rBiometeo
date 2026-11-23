#' Heat index class
#'
#' Class 1-5 (US NWS): 1 no warning (< 80 F), 2 caution (80-90 F), 3 extreme caution (90-103 F), 4 danger (103-125 F), 5 extreme danger (>= 125 F).
#'
#' @param t numeric Air temperature in degC.
#' @param rh numeric Relative humidity in percentage.
#' @return class 1-5
#' @references Rothfusz L.P. (1990). The heat index 'equation'. NWS Southern Region Technical Attachment SR 90-23.
#' @references US National Weather Service. Heat index. https://www.weather.gov/ama/heatindex
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords heat index
#' @export
heatindex_class <- function(t, rh) {
  .js_apply("heatindex_class", t, rh)
}
