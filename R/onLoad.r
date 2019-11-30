#' @importFrom V8 new_context
.onLoad <- function(libname, pkg){
  assign("ct", V8::v8("window"), environment(.onLoad))
  ct$source(system.file("js/biometeo.js", package = pkg))

}


