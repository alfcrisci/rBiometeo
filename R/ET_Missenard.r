#' Effective temperature in still air (Missenard)
#'
#' Analytical approximation by Missenard of the Houghten & Yaglou effective temperature: ET = t - 0.4 (t - 10) (1 - rh/100). For moving air use net_index.
#'
#' @param t numeric Air temperature in degC.
#' @param rh numeric Relative humidity in percentage.
#' @return ET in degC
#' @references Houghten F.C., Yaglou C.P. (1923). Determining lines of equal comfort. ASHVE Trans. 29: 163-176.
#' @references Missenard A. (1933). Temperature effective d'une atmosphere. Temperature resultante d'un milieu. Chauffage et Industrie, Paris.
#' @references Blazejczyk K., Epstein Y., Jendritzky G., Staiger H., Tinz B. (2012). Comparison of UTCI to selected thermal indices. Int. J. Biometeorol. 56: 515-535. doi:10.1007/s00484-011-0453-2
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords effective temperature
#' @export
ET_Missenard <- function(t, rh) {
  .js_apply("ET_Missenard", t, rh)
}
