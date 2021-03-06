library(tidyverse)
library(lubridate)
bigMac <- read.csv("big-mac-source-data.csv")
bigMac <-mutate(bigMac, price_dollar = local_price/dollar_ex) %>%
         select(name, price_dollar, date) %>%
         filter(name %in% c("Norway", "Sweden", "United States",
                            "Canada", "Brazil", "Denmark", 
                            "New Zealand", "Czech Republic", "China", 
                            "Turkey", "Russia"))

bigMac <- bigMac%>%
          group_by(name) %>%
          mutate(var_perc = 100 * (price_dollar - lag(price_dollar))/lag(price_dollar)) %>%
          filter(format(as.Date(date),"%Y")!=2000)
write.csv(bigMac, file = "bigMac.csv")
