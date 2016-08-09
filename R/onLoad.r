#' @importFrom V8 new_context

ct <- NULL
.onLoad <- function(libname, pkgname){
  ct <<- V8::new_context();
  ct$source(system.file("js/biometeo_function.js", package = pkgname))

}
