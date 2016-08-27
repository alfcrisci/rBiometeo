#' radtheoric
#'
#' Computes different theoretical radiation in W/mq for a location and a time : Global, Direct Beam radiation,Diffuse Radiation, Reflected radiation based on albedo.
#'
#' @param date  Datetime in format YYYY-MM-DD HH:MM:SS
#' @param numeric lat Latitude in decimal degrees.
#' @param numeric lon Longitude in decimal degrees.
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

radtheoric=function(datetime,lat,lon,albedo=0.3,param="global") {
                         if ( length(albedo)==1) {albedo=rep(albedo,length(datetime))}
                         if ( length(param)==1) {param=rep(param,length(datetime))}
                         ct$assign("param", as.array(param))
                         ct$assign("datetime", as.array(datetime))
                         ct$assign("lat", as.array(lat))
                         ct$assign("lon", as.array(lon))
                         ct$assign("albedo", as.array(lon))
                         ct$eval("var res=[]; for(var i=0, len=param.length; i < len; i++){ res[i]=radtheoric(param[i],datetime[i],lat[i],lon[i],albedo[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}

