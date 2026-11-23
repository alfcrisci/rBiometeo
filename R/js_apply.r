#' Internal: element-wise call of a function of biometeo.js
#'
#' Calls the JavaScript function \code{fun} for every element of the arguments (recycled to the
#' longest one). \code{NULL} arguments are passed as \code{undefined}, so the JavaScript default
#' is used. Results equal to the codes in \code{na_codes}, empty strings and results for
#' \code{NA} inputs are returned as \code{NA}.
#'
#' @param fun character Name of the JavaScript function.
#' @param ... Arguments, in the order of the JavaScript function.
#' @param na_codes numeric Values meaning "not computable". Default c(9999, -9999).
#' @return vector of results
#' @keywords internal
#' @noRd
.js_apply <- function(fun, ..., na_codes = c(9999, -9999)) {
  args <- list(...)
  present <- !vapply(args, is.null, logical(1))
  n <- if (any(present)) max(lengths(args[present])) else 1
  call <- character(length(args))
  na_mask <- rep(FALSE, n)
  for (k in seq_along(args)) {
    if (!present[k]) { call[k] <- "undefined"; next }
    v <- rep_len(args[[k]], n)
    na_mask <- na_mask | is.na(v)
    nm <- paste0("rbm_a", k)
    ct$assign(nm, as.array(v))
    call[k] <- paste0(nm, "[i]")
  }
  ct$eval(sprintf(
    "var rbm_res=[]; for (var i=0; i<%d; i++) { var v=%s(%s); rbm_res[i]=(v===undefined||(typeof v==='number'&&!isFinite(v)))?null:v; }",
    n, fun, paste(call, collapse = ",")))
  res <- ct$get("rbm_res")
  if (is.list(res)) res <- unlist(lapply(res, function(x) if (is.null(x)) NA else x))
  if (is.numeric(res)) res[res %in% na_codes] <- NA
  if (is.character(res)) res[res == ""] <- NA
  if (is.logical(res)) res <- as.numeric(res)
  res[na_mask] <- NA
  res
}
