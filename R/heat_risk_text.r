#' WBGT heat risk label
#'
#' Label of the WBGT heat risk level (see heat_risk_level) in Italian or English; replaces heat_risk_text_level and heat_risk_text_level_eng.
#'
#' @param wbgt numeric WBGT in degC.
#' @param cav numeric Clothing adjustment value in degC.
#' @param tresh numeric Reference WBGT limit in degC.
#' @param lang character Language of the labels: "it" (default) or "en".
#' @return character label
#' @references ISO 7243:2017. Ergonomics of the thermal environment - Assessment of heat stress using the WBGT (wet bulb globe temperature) index.
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@cnr.it}
#' @keywords WBGT
#' @export
heat_risk_text <- function(wbgt, cav = 0, tresh = 28.5, lang = "it") {
  .js_apply("heat_risk_text", wbgt, cav, tresh, lang)
}
