#' Thom discomfort index class
#'
#' Class 1-6 of thom (Thom discomfort index from wet-bulb temperature) with the thresholds of Giles et al. (1990).
#'
#' @param t numeric Air temperature in degC.
#' @param rh numeric Relative humidity in percentage.
#' @param pair numeric Air pressure in hPa.
#' @param wind numeric Wind speed in meters per second.
#' @return class 1-6
#' @references Thom E.C. (1959). The discomfort index. Weatherwise 12(2): 57-61. doi:10.1080/00431672.1959.9926960
#' @references Giles B.D., Balafoutis C., Maheras P. (1990). Too hot for comfort: the heatwaves in Greece in 1987 and 1988. Int. J. Biometeorol. 34: 98-104.
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@cnr.it}
#' @keywords Thom
#' @export
thom_class <- function(t, rh, pair = 1010, wind = 0.13) {
  .js_apply("thom_class", t, rh, pair, wind)
}
