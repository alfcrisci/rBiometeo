#' sun_data
#'
#' Calculate sun parameters for specific location and time.
#'
#' @param datetime character     Datetime as in YYYY-MM-DDTHH:MM:SS considering local time
#' @param lat  numeric           Latitude in decimal degrees
#' @param lon  numeric           Longitude in decimal degrees
#' @param parameter character    Six solar parameter are available by name "azimuth","zenith","solarZenith","elevation","declination"or "JD"
#' @param tz character           time zone.
#' @return value of parameter indicated
#'
#'
#' @author    Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords  sun parameters 
#' 
#' @export
#'
#'
#'
#'

sun_data=function(datetime,lat,lon,parameter="azimuth",tz="GMT") {
                         ct$assign("datetime", as.array(datetime))
                         ct$assign("lat", as.array(lat))
                         ct$assign("lon", as.array(lon))
                         ct$assign("parameter", as.array(parameter))
                         ct$eval("var res=[]; for(var i=0, len=lat.length; i < len; i++){ res[i]=sun_data(datetime[0],lat[i],lon[i],parameter[0])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}

