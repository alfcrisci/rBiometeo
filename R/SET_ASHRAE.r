#' Standard Effective Temperature (ASHRAE 55)
#'
#' SET with the Gagge two-node model in the version of ANSI/ASHRAE Standard 55-2023, port of set_tmp() of pythermalcomfort. Replaces the former pierceSET.
#'
#' @param t numeric Air temperature in degC.
#' @param rh numeric Relative humidity in percentage.
#' @param wind numeric Relative air speed in meters per second.
#' @param tmrt numeric Mean radiant temperature in degC.
#' @param met numeric Metabolic rate in met.
#' @param clo numeric Clothing insulation in clo.
#' @param wme numeric External work in met.
#' @param pair numeric Air pressure in hPa.
#' @param position character "standing" or "sitting".
#' @param bsa numeric Body surface area in m2.
#' @return SET in degC (1 decimal)
#' @references Gagge A.P., Fobelets A.P., Berglund L.G. (1986). A standard predictive index of human response to the thermal environment. ASHRAE Trans. 92(2B): 709-731.
#' @references ANSI/ASHRAE Standard 55-2023. Thermal Environmental Conditions for Human Occupancy. ASHRAE, Atlanta.
#' @references Tartarini F., Schiavon S. (2020). pythermalcomfort: A Python package for thermal comfort research. SoftwareX 12: 100578. doi:10.1016/j.softx.2020.100578
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@cnr.it}
#' @keywords SET
#' @export
SET_ASHRAE <- function(t, rh, wind, tmrt, met, clo, wme = 0, pair = 1013.25, position = "standing", bsa = 1.8258) {
  .js_apply("SET_ASHRAE", t, rh, wind, tmrt, met, clo, wme, pair, position, bsa)
}
