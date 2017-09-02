#' radtheoric
#'
#' Computes different theoretical radiation in W/mq for a location and a time : Global, Direct Beam radiation,Diffuse Radiation, Reflected radiation based on albedo.
#'
#' @param jddate  Datetime in DOY Day of year.
#' @param numeric elev Sun elevation decimal degrees.
#' @param numeric  albedo Surronding albedo value. Default is 0.3. 
#' @param character param Theoretical parameter available for radiation "global","direct","diffuse","reflected".
#' @return 
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  radtheoric 
#' 
#' @export
#'
#'
#'
#'

radtheoric=function(jddate,elev,albedo=0.3,param="direct") {
                          ct$assign("jddate", as.array(jddate))
                          ct$assign("elev", as.array(elev))
                          ct$assign("albedo", as.array(albedo))
                          ct$assign("param", as.array(param))
                          
                          ct$eval("var res=[]; for(var i=0, len=elev.length; i < len; i++){ res[i]=radtheoric(jddate[0],elev[i],albedo[0],param[0])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}

