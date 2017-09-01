#' sun_data
#'
#' Calculate solar parameter for a location and a time.
#'
#' @param datetime  Datetime in format YYYY-MM-DD HH:MM:SS. 
#' @param numeric lat Latitude in decimal degrees.
#' @param numeric lon Longitude in decimal degrees.
#' @param character parameter Six solar parameter are available by name "azimuth","zenith","solarZenith","elevation","declination","JD".
#' @return Parameter indicated in degrees or integer (JD).
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  sun parameter 
#' 
#' @export
#'
#'
#'
#'

sun_data=function(datetime,lat,lon,parameter="azimuth") {
                         datetimestring=format(datetime,"%Y-%m-%dT%H:%M:%S") 
                         if ( length( datetimestring)>1) {parameter=rep(parameter,length(datetimestring))}
  
                         ct$assign("datetime", as.array(datetimestring))
                         ct$assign("lat", as.array(lat))
                         ct$assign("lon", as.array(lon))
                         ct$assign("parameter", as.array(parameter))
                         ct$eval("var res=[]; for(var i=0, len=datetime.length; i < len; i++){ res[i]=sun_data(datetime[i],lat[i],lon[i],parameter[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}

