#' rad_direct_tilted
#'
#' Computed a incident tilted radiation for a inclinated (planezen) and orientated plane (planeaz).
#'
#' @param jddate numeric        Date in format DOY day of year.
#' @param az numeric            Sun azimuth in decimal degrees.
#' @param elev numeric          Sun elevation in decimal degrees.
#' @param planezen numeric      Zenital angles of the plane.
#' @param planeaz numeric       Azimuthal angles of the plane.
#' @return incident tilted radiation
#' 
#'
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
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
                           return(ifelse(!is.numeric(res),NA,res))
}



