#' Normal Effective Temperature class (Central Europe)
#'
#' Class 1-7 of net_index: 1 very cold (< 1), 2 cold (1-9), 3 cool (9-17), 4 fresh (17-21), 5 comfortable (21-23), 6 warm (23-27), 7 hot (>= 27 degC).
#'
#' @param t numeric Air temperature in degC.
#' @param rh numeric Relative humidity in percentage.
#' @param wind numeric Wind speed in meters per second.
#' @return class 1-7
#' @references Blazejczyk K., Epstein Y., Jendritzky G., Staiger H., Tinz B. (2012). Comparison of UTCI to selected thermal indices. Int. J. Biometeorol. 56: 515-535. doi:10.1007/s00484-011-0453-2
#' @references Li P.W., Chan S.T. (2000). Application of a weather stress index for alerting the public to stressful weather in Hong Kong. Meteorol. Appl. 7(4): 369-375. doi:10.1017/S1350482700001602
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@cnr.it}
#' @keywords NET
#' @export
net_class <- function(t, rh, wind) {
  .js_apply("net_class", t, rh, wind)
}
