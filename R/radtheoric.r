#' radtheoric
#'
#' Computes different theoretical radiation in W/mq for a location and a time : Global, Direct Beam radiation,Diffuse Radiation, Reflected radiation based on albedo.
#'
#' @param  jddate   Datetime in DOY Day of year
#' @param  sunelev numeric Sun elevation decimal degrees
#' @param  albedo numeric Surronding albedo value. Default is 0.3 
#' @param  param character Theoretical parameter available for radiation "global","direct","diffuse" ( clear sky diffuse),"reflected".
#' @return Requested irradinace in KJ on mq 
#'
#'
#' @author  Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
#' @keywords  radtheoric 
#' 
#' @export
#'
#'
#'
#'

radtheoric=function(jddate,sunelev=75,albedo=0.4,param="direct") {
                          ct$assign("jddate", as.array(jddate))
                          ct$assign("elev", as.array(sunelev))
                          ct$assign("albedo", as.array(albedo))
                          ct$assign("param", as.array(param))
                          ct$eval("var res=[]; for(var i=0, len=elev.length; i < len; i++){ res[i]=radtheoric(jddate[i],elev[i],albedo[0],param[0])};")
                          res=ct$get("res")
                          return(ifelse(res==9999,NA,res))
}

