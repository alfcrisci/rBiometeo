#' mrt_thorsson
#'
#' Calculated the mean radiant temperature from the solar radiation.  Modified based on direct and diffuse ratio. Assumes a uniform surround temperature of Ta && short wave solar radiation only;
#'
#' @param numeric t air temperature in Celsius degrees.
#' @param numeric tg global short solar irradiance in Watt on mq.
#' @param numeric wind windspeed in meter per second.
#' @param numeric diam diameter of the sphere in millimeter. Input example  50 mm.
#' @return Mean Radiant temperature.
#'
#'
#' @author    Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
#' @references Thorsson et al, Different methods for estimating the mean radiant temperature in an outdoor urban setting, Int. J. Climatol.27  1983   1993 (2007)
#' @keywords  MRT 
#' 
#' @export
#'
#'
#'
#'

mrt_thorsson=function(t,tg,wind,diam) {
                         ct$assign("t", as.array(t))
                         ct$assign("tg", as.array(tg))
                         ct$assign("wind", as.array(wind))
                         ct$assign("diam", as.array(diam))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=mrt_thorsson(t[i],tg[i],wind[i],diam[0])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}

#' mrt_globe
#'
#' Given air temperature , the globe Temeperature, the wind speed and diameter mean radiant temperature is done according ISO 7726 1998.
#'
#' @param numeric t     Air temperature in Celsius degrees.
#' @param numeric tg    Global short solar irradiance in Watt on mq.
#' @param numeric wind  Windspeed in meter per second.
#' @param numeric diam  diameter of the sphere in millimeter. Input example 50 mm.
#' @return Mean Radiant temperature.
#'
#' @author    Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
#' @keywords  globe temperature 
#' 
#' @export
#'
#'
#'
#'

mrt_globe=function(t,tg,wind,diam) {
                         ct$assign("t", as.array(t))
                         ct$assign("tg", as.array(tg))
                         ct$assign("wind", as.array(wind))
                         ct$assign("diam", as.array(diam))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=mrt_globe(t[i],tg[i],wind[i],diam[0])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


#' mrt_solar_proj
#'
#' Calculated the mean radiant temperature from the short solar irradiance with human projection factor. it assumes a uniform surround temperature of air temperature  and short wave solar radiation.
#'
#' @param numeric t    Air temperature in Celsius Degrees.
#' @param numeric rad  Global short solar irradiance in Watt on mq.
#' @param numeric frad Fraction related to direct solar beam 0 to 1.
#' @return Mean Radiant temperature projected
#'
#'
#' @author    Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
#' @keywords  fMRT 
#' 
#' @export
#'
#'
#'
#'

mrt_solar_proj=function(t,rh,solar,sunelev,albedo,fdir,emis_sfc) {
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$assign("solar", as.array(solar))
                         ct$assign("sunelev", as.array(sunelev))
                         ct$assign("albedo", as.array(albedo))
                         ct$assign("emis_sfc", as.array(emis_sfc))
                         ct$assign("fdir", as.array(fdir))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=mrt_solar_proj(t[i],rh[i],solar[i],sunelev[i],albedo[i],emis_sfc[0],fdir[0])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}



