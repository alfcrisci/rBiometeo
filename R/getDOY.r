#' getDOY
#'
#' Get julian day number of date.
#'
#' @param date Date in format YYYY-MM-DD.
#' @return numeric Julian day.
#'
#'
#' @author    Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords  getDOY 
#' 
#' @export
#'
#'
#'
#'
getDOY=function(date) {
                         
                         return(format(as.Date(date),"%j"))
}

