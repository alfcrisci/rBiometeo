#' THI class (Giles)
#'
#' Class 1-6 of THI (Thom discomfort index, Giles form): 1 < 21, 2 21-24, 3 24-27, 4 27-29, 5 29-32, 6 >= 32 degC.
#'
#' @param t numeric Air temperature in degC.
#' @param rh numeric Relative humidity in percentage.
#' @return class 1-6
#' @references Giles B.D., Balafoutis C., Maheras P. (1990). Too hot for comfort: the heatwaves in Greece in 1987 and 1988. Int. J. Biometeorol. 34: 98-104.
#' @references Thom E.C. (1959). The discomfort index. Weatherwise 12(2): 57-61. doi:10.1080/00431672.1959.9926960
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords THI
#' @export
thi_class <- function(t, rh) {
  .js_apply("thi_class", t, rh)
}
