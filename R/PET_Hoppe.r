#' Physiological Equivalent Temperature (Hoppe / VDI 3787)
#'
#' PET with the original MEMI/PETBER routine of Hoppe as given in VDI 3787 Part 2 (standard person: male, 35 years, 75 kg, 1.75 m, 80 W of activity, 0.9 clo, standing). Comparable with RayMan and most of the PET literature. Classes: pet_class, pet_class_text.
#'
#' @param t numeric Air temperature in degC.
#' @param rh numeric Relative humidity in percentage.
#' @param wind numeric Wind speed in meters per second.
#' @param tmrt numeric Mean radiant temperature in degC.
#' @param pair numeric Air pressure in hPa. Default 1013.25.
#' @return PET in degC
#' @references Hoppe P. (1999). The physiological equivalent temperature - a universal index for the biometeorological assessment of the thermal environment. Int. J. Biometeorol. 43: 71-75. doi:10.1007/s004840050118
#' @references VDI 3787 Part 2 (2008, rev. 2022). Environmental meteorology - Methods for the human-biometeorological evaluation of the thermal component of the climate. Beuth, Berlin.
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords PET
#' @export
PET_Hoppe <- function(t, rh, wind, tmrt, pair = 1013.25) {
  .js_apply("PET_Hoppe", t, rh, wind, tmrt, pair)
}
