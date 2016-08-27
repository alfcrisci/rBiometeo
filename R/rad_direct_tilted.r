#' rad_direct_tilted
#'
#' Computed a incident tilted radiation for a inclinated (planezen) and orientated plane (planeaz).
#'
#' @param date  Date in format YYYY-MM-DD HH:MM:SS
#' @param numeric lat Latitude in decimal degrees.
#' @param numeric lon Longitude in decimal degrees.
#' @param planezen Zenital angles of the plane.
#' @param planeaz Azimuthal angles of the plane.
#' @return 
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  Tilted radiation. 
#' 
#' @export
#'
#'
#'
#'

rad_direct_tilted=function(datetime,lat,lon,planezen,planeaz) {
                           ct$assign("datetime", as.array(datetime))
                           ct$assign("lat", as.array(lat))
                           ct$assign("lon", as.array(lon))
                           ct$assign("planezen", as.array(planezen))
                           ct$assign("planeaz", as.array(planeaz))
                           ct$eval("var res=[]; for(var i=0, len=datetime.length; i < len; i++){ res[i]=rad_direct_tilted(datetime[i],lat[i],lon[i],planezen[i],planeaz[i])};")
                           res=ct$get("res")
                          return(ifelse(res==9999,NA,res))
}

