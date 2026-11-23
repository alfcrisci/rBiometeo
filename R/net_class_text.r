#' Normal Effective Temperature class label
#'
#' Label of the class of net_index (see net_class).
#'
#' @param t numeric Air temperature in degC.
#' @param rh numeric Relative humidity in percentage.
#' @param wind numeric Wind speed in meters per second.
#' @param lang character Language of the labels: "it" (default) or "en".
#' @return character label
#' @references Blazejczyk K., Epstein Y., Jendritzky G., Staiger H., Tinz B. (2012). Comparison of UTCI to selected thermal indices. Int. J. Biometeorol. 56: 515-535. doi:10.1007/s00484-011-0453-2
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords NET
#' @export
net_class_text <- function(t, rh, wind, lang = "it") {
  .js_apply("net_class_text", t, rh, wind, lang)
}
