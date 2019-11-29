#' .onLoad
#'
#' @importFrom V8 new_context

ct <- NULL

.onLoad <- function(libname, pkgname){
  ct <<- V8::v8()
  ct$source(system.file("inst/js/biometeo.js", package = pkgname))

}
