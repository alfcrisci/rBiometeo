#' temprad
#'
#' Calculate approximate mean radiant temperature. 
#'
#' @param numeric t Air temperature in Celsius Degrees.
#' @param numeric rh Air Relative humidity in %.
#' @param numeric rshort Direct short-wave solar radiation in W/mq.
#' @param numeric rdiffuse Diffuse short-wave solar radiation in W/mq.
#' @param numeric sunelev Sun elevation in degrees
#' @param numeric albedo Surrounding albedo.Default is 0.3.
#' @return 
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  temprad 
#' 
#' @export
#'
#'
#'
#'

temprad=function(t,rh,rshort,rdiffuse,sunelev,albedo=0.3) {
                        if ( length(albedo) == 1) {albedo=rep(albedo,length(t))}
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$assign("rshort", as.array(rshort))
                         ct$assign("rdiffuse", as.array(rdiffuse))
                         ct$assign("sunelev", as.array(sunelev))
                         ct$assign("albedo", as.array(albedo))
                          ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=temprad(t[i],rh[i],rshort[i],rdiffuse[i],sunelev[i],albedo[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}

