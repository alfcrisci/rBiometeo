#' Physiological Equivalent Temperature (Walther & Goestchel 2018)
#'
#' Steady-state PET with the MEMI model as corrected by Walther & Goestchel (2018), port of pet_steady() of pythermalcomfort. Defaults describe the standard PET person. Values can differ from PET_Hoppe by a few degrees.
#'
#' @param t numeric Air temperature in degC.
#' @param rh numeric Relative humidity in percentage.
#' @param wind numeric Wind speed in meters per second.
#' @param tmrt numeric Mean radiant temperature in degC.
#' @param met numeric Activity in met, added (x 58.2, as W) to the basal metabolism. Default 80 W.
#' @param clo numeric Clothing insulation in clo. Default 0.9.
#' @param pair numeric Air pressure in hPa.
#' @param position character "standing", "sitting" or "standing, forced convection".
#' @param age numeric Age in years.
#' @param sex character "male" or "female".
#' @param weight numeric Body mass in kg.
#' @param height numeric Height in m.
#' @param wme numeric External work fraction (0-1).
#' @return PET in degC
#' @references Walther E., Goestchel Q. (2018). The P.E.T. comfort index: Questioning the model. Build. Environ. 137: 1-10. doi:10.1016/j.buildenv.2018.03.054
#' @references Hoppe P. (1999). The physiological equivalent temperature - a universal index for the biometeorological assessment of the thermal environment. Int. J. Biometeorol. 43: 71-75. doi:10.1007/s004840050118
#' @references Tartarini F., Schiavon S. (2020). pythermalcomfort: A Python package for thermal comfort research. SoftwareX 12: 100578. doi:10.1016/j.softx.2020.100578
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@cnr.it}
#' @keywords PET
#' @export
PET_Walther <- function(t, rh, wind, tmrt, met = 80/58.2, clo = 0.9, pair = 1013.25, position = "standing", age = 35, sex = "male", weight = 75, height = 1.75, wme = 0) {
  .js_apply("PET_Walther", t, rh, wind, tmrt, met, clo, pair, position, age, sex, weight, height, wme)
}
