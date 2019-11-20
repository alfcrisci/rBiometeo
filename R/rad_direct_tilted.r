#' rad_direct_tilted
#'
#' Computed a incident tilted radiation for a inclinated (planezen) and orientated plane (planeaz).
#'
#' @param numeric jddate        Date in format DOY day of year.
#' @param numeric az            Sun azimuth in decimal degrees.
#' @param numeric elev          Sun elevation in decimal degrees.
#' @param numeric planezen      Zenital angles of the plane.
#' @param numeric planeaz       Azimuthal angles of the plane.
#' @return 
#' 
#'
#' @author  Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
#' @keywords  Tilted radiation. 
#' 
#' @export
#'
#'
#'
#'

rad_direct_tilted=function(jddate,az,elev,planezen,planeaz) {
                           ct$assign("jddate", as.array(jddate))
                           ct$assign("az", as.array(az))
                           ct$assign("elev", as.array(elev))
                           ct$assign("planezen", as.array(planezen))
                           ct$assign("planeaz", as.array(planeaz))
                           ct$eval("var res=[]; for(var i=0, len=jddate.length; i < len; i++){ res[i]=rad_direct_tilted(jddate[i],az[i],elev[i],planezen[0],planeaz[0])};")
                           res=ct$get("res")
                          return(ifelse(res==9999,NA,res))
}



