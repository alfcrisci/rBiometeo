#' winddir
#'
#' @description Calculate meteorological wind direction from cartesian components u and v.
#' 
#' @param u numeric U zonal component 
#' @param v numeric V meridian component 
#' 
#' @references 
#' Istituto di Biometeorologia Firenze Italy
#' @author  Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
#' @keywords Meteorological Wind direction 
#' 
#' 
#' @export

winddir <- function(u, v) {
                    (180 / pi) * atan(u/v) + ifelse(v>0,180,ifelse(u>0,360,0))
}