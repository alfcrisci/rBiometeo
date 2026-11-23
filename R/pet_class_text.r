#' PET class label
#'
#' Label of the PET class (see pet_class).
#'
#' @param pet numeric PET in degC.
#' @param lang character Language of the labels: "it" (default) or "en".
#' @return character label
#' @references Matzarakis A., Mayer H., Iziomon M.G. (1999). Applications of a universal thermal index: physiological equivalent temperature. Int. J. Biometeorol. 43: 76-84. doi:10.1007/s004840050119
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@cnr.it}
#' @keywords PET
#' @export
pet_class_text <- function(pet, lang = "it") {
  .js_apply("pet_class_text", pet, lang)
}
