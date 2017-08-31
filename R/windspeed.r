#' windspeed
#'
#' @description Calculate meteorological wind speed.
#' 
#' @param u numeric U zonal component 
#' @param v numeric V meridian component 
#' @return 
#'
#' @references Istituto di Biometeorologia Firenze Italy.
#' @author  Alfonso crisci \email{a.crisci@@ibimet.cnr.it} Marco Morabito \email{m.morabito@@unifi.it} 
#' @keywords speed wind
#' 
#' 
#' @export

windspeed <- function(u, v) {
                    sqrt(u^2+v^2)
}
