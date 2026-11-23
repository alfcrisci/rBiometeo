#' PET class
#'
#' Class 1-9 of thermal perception and physiological stress for a PET value (Matzarakis & Mayer): limits 4, 8, 13, 18, 23, 29, 35, 41 degC.
#'
#' @param pet numeric PET in degC (from PET_Hoppe or PET_Walther).
#' @return class 1-9
#' @references Matzarakis A., Mayer H., Iziomon M.G. (1999). Applications of a universal thermal index: physiological equivalent temperature. Int. J. Biometeorol. 43: 76-84. doi:10.1007/s004840050119
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords PET
#' @export
pet_class <- function(pet) {
  .js_apply("pet_class", pet)
}
